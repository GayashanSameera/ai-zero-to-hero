import React, { useState } from 'react'
import { useCanvas, css } from './draw.js'

const BASE = ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too']
const ROW = 26

const HEADS = [
  { name: 'Head 1: meaning (who is "it"?)', q: 'Who or what am I talking about? Which noun do I belong to?' },
  { name: 'Head 2: previous word', q: 'What is the word just before me?' },
  { name: 'Head 3: action and who does it', q: 'What is my action (verb), or what does it act on?' },
]

// Hand-designed scores so the patterns are easy to see. Real models learn these numbers during training.
function weights(head, wide, i) {
  const n = 11
  const s = Array.from({ length: n }, (_, j) => (head === 1 ? 0.05 : 0.15 / (1 + Math.abs(i - j))))
  const add = (j, v) => { s[j] += v }
  add(i, head === 1 ? 0.6 : 0.5)
  if (head === 0) {
    if (i === 7) { add(1, wide ? 0.3 : 3); add(5, wide ? 3 : 0.3); add(10, 0.8) }
    if (i === 10) { add(7, 1.2); add(wide ? 5 : 1, 1.5) }
    if (i === 1 || i === 5) add(i - 1, 0.6)
    if (i === 8) { add(7, 0.8); add(10, 0.6) }
  } else if (head === 1) {
    if (i > 0) add(i - 1, 2.5)
  } else {
    const rules = { 1: [[3, 1.5], [2, 0.8]], 2: [[3, 2]], 3: [[5, 2], [1, 1], [2, 0.5]], 5: [[3, 2]], 7: [[8, 1.5]], 8: [[10, 1.5], [7, 1]], 9: [[10, 2]], 10: [[8, 1.5], [9, 0.8]] }
    ;(rules[i] || []).forEach(([j, v]) => add(j, v))
  }
  const tot = s.reduce((a, b) => a + b, 0)
  return s.map(v => v / tot)
}

export default function AttentionLab() {
  const [wide, setWide] = useState(false)
  const [sel, setSel] = useState(7)
  const [head, setHead] = useState(0)
  const words = [...BASE, wide ? 'wide' : 'tired']
  const w = weights(head, wide, sel)
  const ranked = words.map((t, j) => ({ t, j, w: w[j] })).sort((a, b) => b.w - a.w)

  const H = words.length * ROW + 16
  const ref = useCanvas((ctx, W) => {
    const xl = W * 0.36, xr = W * 0.64, y = j => 8 + j * ROW + ROW / 2
    ctx.font = '13px ' + css('--mono')
    ctx.textBaseline = 'middle'
    words.forEach((_, j) => {
      ctx.beginPath(); ctx.moveTo(xl + 6, y(sel)); ctx.lineTo(xr - 6, y(j))
      ctx.globalAlpha = 0.12 + 0.88 * Math.min(1, w[j] * 1.6)
      ctx.strokeStyle = css('--accent'); ctx.lineWidth = 1 + w[j] * 12; ctx.stroke()
    })
    ctx.globalAlpha = 1
    words.forEach((t, j) => {
      const tw = ctx.measureText(t).width
      ctx.globalAlpha = Math.min(0.85, w[j] * 1.6)
      ctx.fillStyle = css('--accent-soft')
      ctx.fillRect(xr + 2, y(j) - 10, tw + 8, 20)
      ctx.globalAlpha = 1
      ctx.fillStyle = css('--ink'); ctx.textAlign = 'left'; ctx.fillText(t, xr + 6, y(j))
      ctx.fillStyle = j === sel ? css('--accent') : css('--muted'); ctx.textAlign = 'right'; ctx.fillText(t, xl - 4, y(j))
    })
  }, [sel, head, wide], { ratio: 0, minH: H, maxH: H })

  const pick = e => {
    const r = e.currentTarget.getBoundingClientRect()
    const j = Math.floor((e.clientY - r.top - 8) / ROW)
    if (j >= 0 && j < words.length && e.clientX - r.left < r.width * 0.5) setSel(j)
  }

  const me = words[sel]
  let status
  if (head === 0 && sel === 7) status = { cls: 'good', text: wide
    ? `Now "it" looks mostly at "street" (${(w[5] * 100).toFixed(0)}%). Why? A street can be "too wide", but an animal can't. Changing only the last word changed what "it" means!`
    : `"it" looks mostly at "animal" (${(w[1] * 100).toFixed(0)}%). An animal can be "too tired", but a street can't. Now switch to "wide" and watch.` }
  else if (head === 1) status = { cls: '', text: 'This head makes every word look at the word just before it. Simple, but real models have heads like this to understand word order.' }
  else status = { cls: '', text: `"${me}" looks mostly at "${ranked[0].j === sel ? ranked[1].t : ranked[0].t}". Try clicking another word or picking another head. "it" + Head 1 is the best example.` }

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: Which words does a word look at?</h3><span className="eyebrow">Self-Attention</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>Attention means every word in a sentence looks at the other words and decides "who matters to me?". Click a word below. The darker the colour and the thicker the line, the bigger the attention weight.</p>
      <div className="row">
        <button type="button" aria-pressed={!wide} onClick={() => setWide(false)}>...too tired</button>
        <button type="button" aria-pressed={wide} onClick={() => setWide(true)}>...too wide</button>
      </div>
      <div className="row" style={{ gap: 6 }}>
        {words.map((t, j) => (
          <button type="button" key={j} aria-pressed={j === sel} onClick={() => setSel(j)} title={`${(w[j] * 100).toFixed(0)}%`}
            style={{ padding: '4px 9px', background: j === sel ? undefined : `color-mix(in srgb, var(--accent) ${Math.round(Math.min(1, w[j] * 1.6) * 55)}%, var(--surface))` }}>{t}</button>
        ))}
      </div>
      <div className="row">
        {HEADS.map((h, i) => <button type="button" key={i} aria-pressed={head === i} onClick={() => setHead(i)}>{h.name}</button>)}
      </div>
      <canvas ref={ref} onClick={pick} role="img" aria-label={`Attention weights from "${me}" to the other words`} />
      <div className="legend"><span>Left: the word that is looking (you can click it)</span><span>Right: the words it looks at</span></div>
      <div className="table-wrap" style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '10px 12px', fontSize: '0.92rem' }}>
        <p><strong>Query (Q)</strong>, the question "{me}" asks: <em>"{HEADS[head].q}"</em></p>
        <p style={{ marginTop: 6 }}><strong>Key (K)</strong>, every word shows a label about itself. The better Q and K match, the higher the score. Best matches: {ranked.slice(0, 3).map(r => `${r.t} ${(r.w * 100).toFixed(0)}%`).join(', ')}.</p>
        <p style={{ marginTop: 6 }}><strong>Value (V)</strong>, the actual information each word carries. The new meaning "{me}" gets = {ranked.slice(0, 3).map(r => `${(r.w * 100).toFixed(0)}% × ${r.t}`).join(' + ')} + a little of the rest.</p>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
      <p className="muted" style={{ fontSize: '0.85rem' }}>We set these weights by hand. A real model has dozens of heads, and it learns their weights by itself during training. In models like GPT, a word can only look at the words before it (masked attention).</p>
    </div>
  )
}
