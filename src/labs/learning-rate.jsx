import React, { useEffect, useRef, useState } from 'react'
import { useCanvas, frame, dot, css, reduceMotion } from './draw.js'

const DOM = { x0: -5, x1: 5, y0: 0, y1: 27, xt: [-4, -2, 0, 2, 4], yt: [0, 10, 20] }
const PRESETS = [[0.03, 'ගොඩක් පොඩි (0.03)'], [0.3, 'හරියටම (0.3)'], [0.9, 'ලොකු වැඩියි (0.9)'], [1.05, 'ගොඩක් ලොකුයි (1.05)']]
const START = { cls: '', text: 'බෝලය පටන් ගන්නේ වම් පැත්තේ උඩින්. පියවරක් තියන්න.' }

// The hill is loss = x². Its slope at x is 2x, so one step is x ← x − learningRate × 2x.
function describe(x, prev, steps, lr) {
  if (Math.abs(x) < 0.05) return { done: true, cls: 'good', text: `පියවර ${steps}කින් පහළටම ආවා. අඩුම loss එක = හොඳම model එක.` }
  if (Math.abs(x) > 1e6) return { done: true, cls: 'bad', text: `පියවර ${steps}කට පස්සේ පිපිරුණා! ඇත්ත training වලදී මේක පේන්නේ "loss = NaN" කියලා. Learning rate එක අඩු කරන්න.` }
  if (Math.abs(x) > Math.abs(prev)) return { cls: 'bad', text: `පියවර ${steps}: කලින්ට වඩා නරකයි! හැම පියවරක්ම පහළ පනිනවා, ඊට වඩා උඩට වැටෙනවා. Learning rate එක ලොකු වැඩියි.` }
  if (Math.sign(x) !== Math.sign(prev)) return { cls: 'warn', text: `පියවර ${steps}: නිම්නය හරහා එහාට මෙහාට පනිනවා (zig-zag). හොඳ වෙනවා, ඒත් පියවර නාස්ති වෙනවා.` }
  if (lr < 0.1) return { cls: 'warn', text: `පියවර ${steps}: හරිම හෙමින් පහළට යනවා. කවදහරි යයි... ඒත් ගොඩක් වෙලා යනවා.` }
  return { cls: '', text: `පියවර ${steps}: ස්ථාවරව පහළට යනවා.` }
}

export default function LearningRateLab() {
  const [lr, setLr] = useState(0.3)
  const [trail, setTrail] = useState([-4])
  const [status, setStatus] = useState(START)
  const timer = useRef(null)
  const stop = () => { clearInterval(timer.current); timer.current = null }
  useEffect(() => stop, [])

  const x = trail[trail.length - 1]
  const steps = trail.length - 1

  const ref = useCanvas((ctx, W, H) => {
    const f = frame(ctx, W, H, DOM, 'Knob එකේ අගය (weight)', 'Loss')
    f.clip()
    ctx.beginPath()
    for (let v = -5; v <= 5.001; v += 0.05) (v === -5 ? ctx.moveTo : ctx.lineTo).call(ctx, f.sx(v), f.sy(v * v))
    ctx.strokeStyle = css('--ink'); ctx.lineWidth = 2.5; ctx.stroke()
    const shown = trail.slice(-60)
    ctx.beginPath()
    shown.forEach((v, i) => (i ? ctx.lineTo(f.sx(v), f.sy(v * v)) : ctx.moveTo(f.sx(v), f.sy(v * v))))
    ctx.strokeStyle = css('--warn'); ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([])
    shown.slice(0, -1).forEach(v => dot(ctx, f.sx(v), f.sy(v * v), 3.5, css('--warn')))
    dot(ctx, f.sx(0), f.sy(0), 4, css('--good'))
    ctx.restore()
    if (Math.abs(x) <= 5.2 && x * x <= DOM.y1) {
      dot(ctx, f.sx(x), f.sy(x * x), 9, css('--accent'), css('--surface'))
    } else {
      ctx.fillStyle = css('--bad'); ctx.font = '700 13px ' + css('--body'); ctx.textBaseline = 'top'
      ctx.textAlign = x < 0 ? 'left' : 'right'
      ctx.fillText(x < 0 ? '← chart එකෙන් එළියට පැන්නා' : 'chart එකෙන් එළියට පැන්නා →', x < 0 ? f.P.l + 8 : W - f.P.r - 8, f.P.t + 6)
    }
  }, [trail], { ratio: 0.5, minH: 220, maxH: 360 })

  // Applies one step to a trail and returns the new trail plus whether to stop.
  const advance = t => {
    const prev = t[t.length - 1]
    const next = prev - lr * 2 * prev
    const nt = [...t, next]
    const d = describe(next, prev, nt.length - 1, lr)
    setStatus(d)
    return [nt, d.done]
  }

  const stepOnce = () => { stop(); setTrail(t => advance(t)[0]) }
  const runTen = () => {
    stop()
    if (reduceMotion()) {
      setTrail(t => { let cur = t; for (let i = 0; i < 10; i++) { const [nt, done] = advance(cur); cur = nt; if (done) break } return cur })
      return
    }
    let n = 0
    timer.current = setInterval(() => {
      setTrail(t => { const [nt, done] = advance(t); if (done || ++n >= 10) stop(); return nt })
    }, 280)
  }
  const reset = (newLr = lr) => { stop(); setLr(newLr); setTrail([-4]); setStatus(START) }

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: බෝලය කන්දෙන් පහළට</h3><span className="eyebrow">Learning Rate</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>වක්‍රය (curve) තමයි කන්ද. බෝලය තමයි model එක. නිම්නයේ පහළම තැන = අඩුම loss = හොඳම model එක. හැම preset එකක්ම try කරලා බලන්න.</p>
      <canvas ref={ref} role="img" aria-label="U හැඩයේ loss curve එකක් මත පියවරෙන් පියවර පහළට යන බෝලයක්" />
      <div className="row">
        {PRESETS.map(([v, label]) => (
          <button type="button" key={v} aria-pressed={lr === v} onClick={() => reset(v)}>{label}</button>
        ))}
      </div>
      <div className="ctrl">
        <label htmlFor="lr-rate">Learning rate <output>{lr.toFixed(2)}</output></label>
        <input type="range" id="lr-rate" min="0.01" max="1.1" step="0.01" value={lr} onChange={e => reset(+e.target.value)} />
      </div>
      <div className="row">
        <button type="button" className="primary" onClick={stepOnce}>පියවර 1ක්</button>
        <button type="button" onClick={runTen}>පියවර 10ක්</button>
        <button type="button" onClick={() => reset()}>Reset</button>
        <span className="muted num" style={{ fontSize: '0.85rem' }}>පියවර: {steps} · loss: {x * x < 1e6 ? (x * x).toFixed(3) : '∞'}</span>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Learning rate</th><th>වෙන දේ</th><th>ඇත්ත ලෝකයේදී</th></tr></thead>
          <tbody>
            <tr><td>පොඩි වැඩියි</td><td>ඉගෙන ගන්නවා, ඒත් හරිම හෙමින්</td><td>පැය ගණන් වෙනුවට දවස් ගණන් training</td></tr>
            <tr><td>හරියටම</td><td>ඉක්මනින් පහළටම යනවා</td><td>Engineers tune කරන්නේ මේකට</td></tr>
            <tr><td>ලොකු වැඩියි</td><td>Zig-zag වෙනවා, නැත්නම් පිපිරෙනවා</td><td>Loss එක "NaN" වෙනවා. ගොඩක් සුලබ bug එකක්.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
