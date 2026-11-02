import React, { useRef, useState } from 'react'
import { useCanvas, frame, dot, css } from './draw.js'

// Hand-made 2D "embeddings". Similar meaning → similar direction from the origin.
// Built so that king − man + woman lands exactly on queen.
const WORDS = {
  king: [4, 8], queen: [6.5, 5.5], prince: [3.5, 6.5], princess: [5.5, 4.5], man: [2.5, 3], woman: [5, 0.5],
  dog: [-6, 4], cat: [-7, 3], elephant: [-5, 6.5],
  kottu: [-6, -5], hoppers: [-4.5, -6.5], rice: [-7, -3.5],
  'Sri Lanka': [6, -5], Colombo: [4.5, -6.5], Kandy: [3, -7], India: [7.5, -3],
}
const GROUP = w => (['king', 'queen', 'prince', 'princess', 'man', 'woman'].includes(w) ? '--series-1'
  : ['dog', 'cat', 'elephant'].includes(w) ? '--series-2'
  : ['kottu', 'hoppers', 'rice'].includes(w) ? '--series-3' : '--series-4')
const DOM = { x0: -9, x1: 9, y0: -9, y1: 9, xt: [-8, -4, 0, 4, 8], yt: [-8, -4, 0, 4, 8] }
const cos = (a, b) => (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b))

function arrow(ctx, x0, y0, x1, y1, color, dash) {
  const a = Math.atan2(y1 - y0, x1 - x0)
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5; ctx.setLineDash(dash ? [6, 5] : [])
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([])
  ctx.beginPath(); ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - 11 * Math.cos(a - 0.4), y1 - 11 * Math.sin(a - 0.4))
  ctx.lineTo(x1 - 11 * Math.cos(a + 0.4), y1 - 11 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill()
}

export default function EmbeddingsLab() {
  const [sel, setSel] = useState(['king', 'queen'])
  const [math, setMath] = useState(false)
  const scale = useRef(null)

  const result = [WORDS.king[0] - WORDS.man[0] + WORDS.woman[0], WORDS.king[1] - WORDS.man[1] + WORDS.woman[1]]
  const nearest = Object.keys(WORDS).filter(w => !['king', 'man', 'woman'].includes(w))
    .reduce((best, w) => (cos(WORDS[w], result) > cos(WORDS[best], result) ? w : best), 'queen')

  const plotRef = useCanvas((ctx, W, H) => {
    const f = frame(ctx, W, H, DOM, '', '', { l: 30, b: 26, r: 10 })
    scale.current = f
    const o = [f.sx(0), f.sy(0)]
    ctx.strokeStyle = css('--muted'); ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(f.sx(DOM.x0), o[1]); ctx.lineTo(f.sx(DOM.x1), o[1]); ctx.moveTo(o[0], f.sy(DOM.y0)); ctx.lineTo(o[0], f.sy(DOM.y1)); ctx.stroke()
    if (math) {
      const k = WORDS.king, km = [k[0] - WORDS.man[0], k[1] - WORDS.man[1]]
      arrow(ctx, o[0], o[1], f.sx(k[0]), f.sy(k[1]), css('--series-1'))
      arrow(ctx, f.sx(k[0]), f.sy(k[1]), f.sx(km[0]), f.sy(km[1]), css('--bad'), true)
      arrow(ctx, f.sx(km[0]), f.sy(km[1]), f.sx(result[0]), f.sy(result[1]), css('--good'), true)
      ctx.fillStyle = css('--muted'); ctx.font = '12px ' + css('--body'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      ctx.fillText('− man', f.sx((k[0] + km[0]) / 2) + 6, f.sy((k[1] + km[1]) / 2))
      ctx.fillText('+ woman', f.sx((km[0] + result[0]) / 2) + 6, f.sy((km[1] + result[1]) / 2))
      dot(ctx, f.sx(result[0]), f.sy(result[1]), 13, 'transparent', css('--warn'))
    } else {
      sel.forEach((w, i) => arrow(ctx, o[0], o[1], f.sx(WORDS[w][0]), f.sy(WORDS[w][1]), css(i ? '--warn' : '--accent')))
    }
    ctx.font = '13px ' + css('--body'); ctx.textBaseline = 'middle'
    Object.entries(WORDS).forEach(([w, [x, y]]) => {
      const on = !math && sel.includes(w)
      dot(ctx, f.sx(x), f.sy(y), on ? 7 : 5, css(GROUP(w)), on ? css('--ink') : null)
      const tw = ctx.measureText(w).width, px = f.sx(x)
      const right = x > 0 ? px + 9 + tw < W - 2 : px - 9 - tw < 2
      ctx.fillStyle = css('--ink'); ctx.textAlign = right ? 'left' : 'right'
      ctx.fillText(w, px + (right ? 9 : -9), f.sy(y))
    })
  }, [sel, math], { ratio: 0.9, minH: 320, maxH: 520 })

  const pick = w => {
    setMath(false)
    setSel(s => (s.includes(w) ? s : [s[s.length - 1], w]))
  }
  const onClick = e => {
    const f = scale.current
    if (!f) return
    const r = e.currentTarget.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top
    let best = null, bd = 28
    Object.entries(WORDS).forEach(([w, [x, y]]) => { const d = Math.hypot(f.sx(x) - px, f.sy(y) - py); if (d < bd) { bd = d; best = w } })
    if (best) pick(best)
  }

  const c = cos(WORDS[sel[0]], WORDS[sel[1]])
  const verdict = c > 0.9 ? { cls: 'good', t: 'ගොඩක් සමාන අර්ථයක්. ඊතල දෙකම වගේ එකම දිශාවට.' }
    : c > 0.5 ? { cls: 'good', t: 'ටිකක් සම්බන්ධයි. දිශා දෙක ළඟයි.' }
    : c > -0.2 ? { cls: 'warn', t: 'වැඩි සම්බන්ධයක් නෑ. ඊතල දෙක ආසන්න වශයෙන් හරස් අතට (90°).' }
    : { cls: 'bad', t: 'අර්ථයෙන් ගොඩක් වෙනස්. ඊතල දෙක ප්‍රතිවිරුද්ධ පැතිවලට.' }

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: වචන වලට ලිපිනයක් (Embeddings)</h3><span className="eyebrow">Word Embeddings</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>Computer එකට වචන තේරෙන්නේ නෑ, අංක විතරයි. ඉතින් හැම වචනයකටම සිතියමක තැනක් (<strong>vector</strong> එකක්) දෙනවා. අර්ථය සමාන වචන එකම දිශාවට. ඇත්ත models වල dimensions සිය ගණනක් තියෙනවා. මෙතන තේරුම් ගන්න ලේසි වෙන්න 2D විතරයි.</p>
      <canvas ref={plotRef} onClick={onClick} style={{ cursor: 'pointer' }} role="img" aria-label="වචන 16ක 2D embedding සිතියම, තෝරපු වචන වලට origin එකේ ඉඳන් ඊතල" />
      <div className="legend">
        <span><i style={{ background: 'var(--series-1)' }} />මිනිස්සු / රජ පවුල</span>
        <span><i style={{ background: 'var(--series-2)' }} />සතුන්</span>
        <span><i style={{ background: 'var(--series-3)' }} />කෑම</span>
        <span><i style={{ background: 'var(--series-4)' }} />රටවල් / නගර</span>
      </div>
      <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>Canvas එකේ වචනයක් click කරන්න, නැත්නම් පහළ බොත්තමක් ඔබන්න. අන්තිමට තෝරපු වචන දෙක සසඳනවා.</p>
      <div className="row" role="group" aria-label="වචන තෝරන්න">
        {Object.keys(WORDS).map(w => (
          <button type="button" key={w} id={`embeddings-word-${w.replace(/\s/g, '-').toLowerCase()}`} aria-pressed={!math && sel.includes(w)} onClick={() => pick(w)} style={{ padding: '4px 10px', fontSize: '0.85rem' }}>{w}</button>
        ))}
      </div>
      <div className="readouts">
        <div className="readout"><small>වචන දෙක</small><b style={{ fontSize: '1.1rem' }}>{sel[0]} ↔ {sel[1]}</b></div>
        <div className="readout"><small>Cosine similarity</small><b className={verdict.cls}>{c.toFixed(2)}</b></div>
      </div>
      <div className="row">
        <button type="button" className="primary" aria-pressed={math} onClick={() => setMath(!math)}>king − man + woman = ?</button>
      </div>
      <div className={'status ' + (math ? 'good' : verdict.cls)}>
        {math
          ? <>king එකේ ඊතලයෙන් පටන් ගත්තා. "man" ඊතලය අඩු කළා (රතු), "woman" ඊතලය එකතු කළා (කොළ). තැඹිලි කවය වැටුණේ ({result[0]}, {result[1]}) තැනට. ළඟම වචනය: <strong>{nearest}</strong>! ඒ කියන්නේ "පිරිමි → ගැහැණු" කියන අර්ථය සිතියමේ එක දිශාවක් විදිහට තියෙනවා.</>
          : <>Cosine similarity = ඊතල දෙක කොච්චර එකම දිශාවට ද කියන එක. 1 = හරියටම එකම දිශාව. 0 = හරස් අතට. -1 = ප්‍රතිවිරුද්ධ දිශා. මෙතන {c.toFixed(2)}: {verdict.t}</>}
      </div>
    </div>
  )
}
