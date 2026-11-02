import React, { useState } from 'react'
import { useCanvas, css } from './draw.js'

const BASE = ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too']
const ROW = 26

const HEADS = [
  { name: 'Head 1: අර්ථය (coreference)', q: 'මම කියන්නේ කා ගැනද? මට අදාළ නාම පදය (noun) කොයිද?' },
  { name: 'Head 2: කලින් වචනය', q: 'මට කලින් තියෙන වචනය මොකක්ද?' },
  { name: 'Head 3: ක්‍රියාව සහ කර්තෘ/කර්මය', q: 'මගේ ක්‍රියාව (verb) හෝ ඒකට අදාළ දේ මොකක්ද?' },
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
    ? `"it" දැන් වැඩිපුරම බලන්නේ "street" දිහා (${(w[5] * 100).toFixed(0)}%). ඇයි? "too wide" (ගොඩක් පළලයි) කියන්න පුළුවන් පාරකට මිසක් සතෙකුට නෙවෙයි. අන්තිම වචනය විතරක් මාරු කළාම "it" අර්ථය වෙනස් වුණා!`
    : `"it" වැඩිපුරම බලන්නේ "animal" දිහා (${(w[1] * 100).toFixed(0)}%). "too tired" (ගොඩක් මහන්සියි) වෙන්නේ සතෙක් මිසක් පාරක් නෙවෙයි. දැන් "wide" එකට මාරු කරලා බලන්න.` }
  else if (head === 1) status = { cls: '', text: 'මේ head එක හැම වචනයකින්ම කලින් වචනය දිහා බලනවා. සරලයි, හැබැයි වචන පිළිවෙළ (word order) තේරුම් ගන්න මේ වගේ heads ඇත්ත models වලත් තියෙනවා.' }
  else status = { cls: '', text: `"${me}" වැඩිපුරම බලන්නේ "${ranked[0].j === sel ? ranked[1].t : ranked[0].t}" දිහා. වෙන වචනයක් click කරලා, වෙන head එකක් තෝරලා බලන්න. "it" + Head 1 තමයි සුපිරිම උදාහරණය.` }

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: වචනයක් කාව බලනවද?</h3><span className="eyebrow">Self-Attention</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>Attention කියන්නේ වාක්‍යයේ හැම වචනයක්ම අනිත් වචන දිහා බලලා "මට වැදගත් කවුද?" කියලා තීරණය කරන එක. පහළ වචනයක් click කරන්න. පාට තද වෙන තරමට, ඉරි මහත වෙන තරමට attention weight එක වැඩියි.</p>
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
      <canvas ref={ref} onClick={pick} role="img" aria-label={`"${me}" වචනයේ සිට අනිත් වචන වලට attention weights`} />
      <div className="legend"><span>වම: බලන වචනය (click කරන්නත් පුළුවන්)</span><span>දකුණ: බලන්න ලැබෙන වචන</span></div>
      <div className="table-wrap" style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '10px 12px', fontSize: '0.92rem' }}>
        <p><strong>Query (Q)</strong>, "{me}" අහන ප්‍රශ්නය: <em>"{HEADS[head].q}"</em></p>
        <p style={{ marginTop: 6 }}><strong>Key (K)</strong>, හැම වචනයක්ම තමන් ගැන ලේබලයක් පෙන්වනවා. Q එකයි K එකයි ගැළපෙන තරමට score එක වැඩියි. හොඳම ගැළපීම්: {ranked.slice(0, 3).map(r => `${r.t} ${(r.w * 100).toFixed(0)}%`).join(', ')}.</p>
        <p style={{ marginTop: 6 }}><strong>Value (V)</strong>, හැම වචනයකම ඇත්ත තොරතුරු. "{me}" ට ලැබෙන අලුත් අර්ථය = {ranked.slice(0, 3).map(r => `${(r.w * 100).toFixed(0)}% × ${r.t}`).join(' + ')} + ඉතුරු ටිකක්.</p>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
      <p className="muted" style={{ fontSize: '0.85rem' }}>මෙතන weights අපි අතින් හැදුවා. ඇත්ත model එකක heads දුසිම් ගණනක් තියෙනවා, ඒවගේ weights training එකේදී තනියම ඉගෙන ගන්නවා. GPT වගේ models වල වචනයකට බලන්න පුළුවන් කලින් වචන විතරයි (masked attention).</p>
    </div>
  )
}
