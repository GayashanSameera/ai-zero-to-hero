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
const fmt = v => v.toFixed(1) + ' ලක්ෂ'

export default function OverfittingLab() {
  const [mode, setMode] = useState('line')
  const [showTest, setShowTest] = useState(false)
  const fn = mode === 'line' ? line : wiggle

  const ref = useCanvas((ctx, W, H) => {
    const f = frame(ctx, W, H, DOM, 'ගෙදර ප්‍රමාණය (m²)', 'මිල (Rs. ලක්ෂ)')
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
      ? { cls: '', text: 'රැලි වක්‍රය හැම training ගෙදරක් හරහාම යනවා. වැරැද්ද බින්දුවයි! Perfect වගේ නේද? දැන් "අලුත් ගෙවල් පෙන්වන්න" tick කරන්න.' }
      : { cls: '', text: 'සරල රේඛාව හැම training ගෙදරකටම පොඩ්ඩක් වරදිනවා. රැලි වක්‍රයත් එක්ක සසඳලා, ඊට පස්සේ "අලුත් ගෙවල් පෙන්වන්න" tick කරන්න.' }
  } else {
    status = mode === 'wiggle'
      ? { cls: 'bad', text: `අලුත් ගෙවල් වලට රැලි වක්‍රය ${fmt(wt)}කින් වරදිනවා. ඒ සරල රේඛාවට වඩා ${(wt / lt).toFixed(1)} ගුණයක් නරකයි. ඒක pattern එක නෙවෙයි ඉගෙන ගත්තේ, noise එක කටපාඩම් කළා. මේකට කියන්නේ Overfitting.` }
      : { cls: 'good', text: `අලුත් ගෙවල් වලට සරල රේඛාව ${fmt(lt)}කින් විතරයි වරදින්නේ. ඒක ඇත්ත pattern එක ඉගෙන ගත්තා. ඒ නිසා විභාගෙත් හොඳට කරනවා.` }
  }

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: සරල රේඛාව vs රැලි වක්‍රය</h3><span className="eyebrow">Overfitting</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>ළමයි දෙන්නෙක් ගැන හිතන්න. එක්කෙනෙක් පරණ ප්‍රශ්න පත්‍රවල උත්තර <strong>කටපාඩම්</strong> කරනවා. අනිත් කෙනා පාඩම <strong>තේරුම් ගන්නවා</strong>. අලුත් විභාගයකදී කවුද දිනන්නේ?</p>
      <canvas ref={ref} role="img" aria-label="Training ගෙවල් වලට සරල රේඛාවක් හෝ රැලි වක්‍රයක් fit කරලා, අලුත් test ගෙවල් එක්ක" />
      <div className="legend">
        <span><i style={{ background: 'var(--accent)' }} />Training ගෙවල් (model එක පාඩම් කළේ මේවා)</span>
        <span><i style={{ background: 'var(--good)' }} />අලුත් ගෙවල් (විභාගය)</span>
      </div>
      <div className="row">
        <button type="button" aria-pressed={mode === 'line'} onClick={() => setMode('line')}>සරල රේඛාව (තේරුම් ගන්නවා)</button>
        <button type="button" aria-pressed={mode === 'wiggle'} onClick={() => setMode('wiggle')}>රැලි වක්‍රය (කටපාඩම් කරනවා)</button>
      </div>
      <label className="check"><input type="checkbox" id="of-show-test" checked={showTest} onChange={e => setShowTest(e.target.checked)} /> අලුත් ගෙවල් පෙන්වන්න (විභාගය)</label>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Model</th><th>Training වැරැද්ද</th><th>අලුත් ගෙවල් වැරැද්ද</th></tr></thead>
          <tbody>
            <tr className={mode === 'line' ? 'active' : ''}><td>සරල රේඛාව</td><td className="num">{fmt(miss(line, TRAIN))}</td><td className="num">{showTest ? fmt(lt) : 'සඟවලා'}</td></tr>
            <tr className={mode === 'wiggle' ? 'active' : ''}><td>රැලි වක්‍රය</td><td className="num">{fmt(miss(wiggle, TRAIN))} (perfect!)</td><td className="num">{showTest ? fmt(wt) : 'සඟවලා'}</td></tr>
          </tbody>
        </table>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
    </div>
  )
}
