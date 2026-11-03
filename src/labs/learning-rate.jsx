import React, { useEffect, useRef, useState } from 'react'
import { useCanvas, frame, dot, css, reduceMotion } from './draw.js'

const DOM = { x0: -5, x1: 5, y0: 0, y1: 27, xt: [-4, -2, 0, 2, 4], yt: [0, 10, 20] }
const PRESETS = [[0.03, 'Very small (0.03)'], [0.3, 'Just right (0.3)'], [0.9, 'Too big (0.9)'], [1.05, 'Way too big (1.05)']]
const START = { cls: '', text: 'The ball starts high up on the left. Take a step.' }

// The hill is loss = x². Its slope at x is 2x, so one step is x ← x − learningRate × 2x.
function describe(x, prev, steps, lr) {
  if (Math.abs(x) < 0.05) return { done: true, cls: 'good', text: `Reached the bottom in ${steps} steps. Lowest loss = best model.` }
  if (Math.abs(x) > 1e6) return { done: true, cls: 'bad', text: `Blew up after ${steps} steps! In real training this shows up as "loss = NaN". Lower the learning rate.` }
  if (Math.abs(x) > Math.abs(prev)) return { cls: 'bad', text: `Step ${steps}: worse than before! Every step jumps right over the bottom and lands even higher. The learning rate is too big.` }
  if (Math.sign(x) !== Math.sign(prev)) return { cls: 'warn', text: `Step ${steps}: bouncing back and forth across the valley (zig-zag). It is getting better, but wasting steps.` }
  if (lr < 0.1) return { cls: 'warn', text: `Step ${steps}: going down very slowly. It will get there one day... but it takes ages.` }
  return { cls: '', text: `Step ${steps}: going steadily downhill.` }
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
    const f = frame(ctx, W, H, DOM, 'Knob value (weight)', 'Loss')
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
      ctx.fillText(x < 0 ? '← jumped off the chart' : 'jumped off the chart →', x < 0 ? f.P.l + 8 : W - f.P.r - 8, f.P.t + 6)
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
      <div className="lab-head"><h3>Lab: Rolling the ball downhill</h3><span className="eyebrow">Learning Rate</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>The curve is the hill. The ball is the model. The lowest point of the valley = lowest loss = best model. Try every preset.</p>
      <canvas ref={ref} role="img" aria-label="A ball stepping down a U-shaped loss curve" />
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
        <button type="button" className="primary" onClick={stepOnce}>1 step</button>
        <button type="button" onClick={runTen}>10 steps</button>
        <button type="button" onClick={() => reset()}>Reset</button>
        <span className="muted num" style={{ fontSize: '0.85rem' }}>Steps: {steps} · loss: {x * x < 1e6 ? (x * x).toFixed(3) : '∞'}</span>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Learning rate</th><th>What happens</th><th>In the real world</th></tr></thead>
          <tbody>
            <tr><td>Too small</td><td>Learns, but very slowly</td><td>Training takes days instead of hours</td></tr>
            <tr><td>Just right</td><td>Gets to the bottom quickly</td><td>This is what engineers tune for</td></tr>
            <tr><td>Too big</td><td>Zig-zags, or blows up</td><td>The loss becomes "NaN". A very common bug.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
