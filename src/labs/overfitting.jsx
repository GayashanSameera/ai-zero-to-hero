import React, { useState } from 'react'
import { useCanvas, frame, dot, css } from './draw.js'

// size m², price Rs. lakhs. The model studies TRAIN; TEST is the hidden exam.
const TRAIN = [[60,130],[85,135],[105,195],[125,180],[145,250],[165,240],[190,315]]
const TEST = [[70,128],[95,160],[115,192],[135,222],[155,255],[180,288]]
const DOM = { x0: 45, x1: 205, y0: 40, y1: 380, xt: [50, 100, 150, 200], yt: [100, 200, 300], yf: y => y + 'L' }

const line = (() => {
  const n = TRAIN.length
  const mx = TRAIN.reduce((s, p) => s + p[0], 0) / n
  const my = TRAIN.reduce((s, p) => s + p[1], 0) / n
  let num = 0, den = 0
  TRAIN.forEach(([x, y]) => { num += (x - mx) * (y - my); den += (x - mx) ** 2 })
  const s = num / den, i = my - s * mx
  return x => s * x + i
})()

// A curve that passes exactly through every training point (polynomial interpolation).
const wiggle = x => TRAIN.reduce((sum, [xi, yi], i) => {
  let term = yi
  TRAIN.forEach(([xj], j) => { if (j !== i) term *= (x - xj) / (xi - xj) })
  return sum + term
}, 0)

const miss = (fn, data) => Math.sqrt(data.reduce((s, [x, y]) => s + (fn(x) - y) ** 2, 0) / data.length)
const fmt = v => v.toFixed(1) + ' lakhs'

export default function OverfittingLab() {
  const [mode, setMode] = useState('line')
  const [showTest, setShowTest] = useState(false)
  const fn = mode === 'line' ? line : wiggle

  const ref = useCanvas((ctx, W, H) => {
    const f = frame(ctx, W, H, DOM, 'House size (m²)', 'Price (Rs. lakhs)')
    f.clip()
    if (showTest) {
      ctx.strokeStyle = css('--good'); ctx.lineWidth = 2; ctx.globalAlpha = 0.7
      TEST.forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(f.sx(x), f.sy(y)); ctx.lineTo(f.sx(x), f.sy(fn(x))); ctx.stroke() })
      ctx.globalAlpha = 1
    }
    ctx.beginPath()
    for (let x = DOM.x0; x <= DOM.x1; x += 0.5) {
      const y = Math.max(-500, Math.min(900, fn(x)))
      x === DOM.x0 ? ctx.moveTo(f.sx(x), f.sy(y)) : ctx.lineTo(f.sx(x), f.sy(y))
    }
    ctx.strokeStyle = css('--ink'); ctx.lineWidth = 2.5; ctx.stroke()
    TRAIN.forEach(([x, y]) => dot(ctx, f.sx(x), f.sy(y), 6, css('--accent')))
    if (showTest) TEST.forEach(([x, y]) => dot(ctx, f.sx(x), f.sy(y), 6, css('--surface'), css('--good')))
    ctx.restore()
  }, [mode, showTest], { ratio: 0.6, minH: 250 })

  const lt = miss(line, TEST), wt = miss(wiggle, TEST)
  let status
  if (!showTest) {
    status = mode === 'wiggle'
      ? { cls: '', text: 'The wiggly curve passes through every training house. Zero error! Looks perfect, right? Now tick "Show new houses".' }
      : { cls: '', text: 'The straight line misses every training house by a little. Compare it with the wiggly curve, then tick "Show new houses".' }
  } else {
    status = mode === 'wiggle'
      ? { cls: 'bad', text: `On new houses the wiggly curve is off by ${fmt(wt)}. That is ${(wt / lt).toFixed(1)} times worse than the straight line. It didn't learn the pattern, it memorised the noise. This is called overfitting.` }
      : { cls: 'good', text: `On new houses the straight line is off by only ${fmt(lt)}. It learned the real pattern, so it does well in the exam too.` }
  }

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: Straight line vs wiggly curve</h3><span className="eyebrow">Overfitting</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>Think of two students. One <strong>memorises</strong> the answers to past papers. The other <strong>understands</strong> the lesson. Who does better in a new exam?</p>
      <canvas ref={ref} role="img" aria-label="A straight line or a wiggly curve fitted to the training houses, with new test houses" />
      <div className="legend">
        <span><i style={{ background: 'var(--accent)' }} />Training houses (what the model studied)</span>
        <span><i style={{ background: 'var(--good)' }} />New houses (the exam)</span>
      </div>
      <div className="row">
        <button type="button" aria-pressed={mode === 'line'} onClick={() => setMode('line')}>Straight line (understands)</button>
        <button type="button" aria-pressed={mode === 'wiggle'} onClick={() => setMode('wiggle')}>Wiggly curve (memorises)</button>
      </div>
      <label className="check"><input type="checkbox" id="of-show-test" checked={showTest} onChange={e => setShowTest(e.target.checked)} /> Show new houses (the exam)</label>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Model</th><th>Training error</th><th>New houses error</th></tr></thead>
          <tbody>
            <tr className={mode === 'line' ? 'active' : ''}><td>Straight line</td><td className="num">{fmt(miss(line, TRAIN))}</td><td className="num">{showTest ? fmt(lt) : 'hidden'}</td></tr>
            <tr className={mode === 'wiggle' ? 'active' : ''}><td>Wiggly curve</td><td className="num">{fmt(miss(wiggle, TRAIN))} (perfect!)</td><td className="num">{showTest ? fmt(wt) : 'hidden'}</td></tr>
          </tbody>
        </table>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
    </div>
  )
}
