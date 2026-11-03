import React, { useEffect, useRef, useState } from 'react'
import { useCanvas, frame, dot, css, reduceMotion } from './draw.js'

// 12 houses: size in m², price in Rs. lakhs
const HOUSES = [[55,105],[70,118],[82,150],[95,160],[110,178],[120,205],[135,215],[150,248],[160,255],[175,290],[190,300],[200,330]]
const DOM = { x0: 40, x1: 210, y0: 40, y1: 360, xt: [50, 100, 150, 200], yt: [100, 200, 300], yf: y => y + 'L' }

const mse = (w, b) => HOUSES.reduce((s, [x, y]) => s + (w * x + b - y) ** 2, 0) / HOUSES.length
const rmse = (w, b) => Math.sqrt(mse(w, b))

export default function FitLineLab() {
  const [w, setW] = useState(0.6)
  const [b, setB] = useState(150)
  const [showMiss, setShowMiss] = useState(true)
  const [history, setHistory] = useState([])
  const [status, setStatus] = useState({ cls: '', text: 'Move the two sliders to make the "average error" as small as you can. Then let the computer learn.' })
  const raf = useRef(null)

  const stop = () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null }
  useEffect(() => stop, [])

  const plotRef = useCanvas((ctx, W, H) => {
    const f = frame(ctx, W, H, DOM, 'House size (m²)', 'Price (Rs. lakhs)')
    f.clip()
    if (showMiss) {
      ctx.strokeStyle = css('--warn'); ctx.lineWidth = 2
      HOUSES.forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(f.sx(x), f.sy(y)); ctx.lineTo(f.sx(x), f.sy(w * x + b)); ctx.stroke() })
    }
    ctx.strokeStyle = css('--ink'); ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(f.sx(DOM.x0), f.sy(w * DOM.x0 + b)); ctx.lineTo(f.sx(DOM.x1), f.sy(w * DOM.x1 + b)); ctx.stroke()
    ctx.setLineDash([4, 4]); ctx.strokeStyle = css('--muted'); ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(f.sx(140), f.sy(DOM.y0)); ctx.lineTo(f.sx(140), f.sy(w * 140 + b)); ctx.stroke()
    ctx.setLineDash([])
    dot(ctx, f.sx(140), f.sy(w * 140 + b), 5, css('--surface'), css('--ink'))
    HOUSES.forEach(([x, y]) => dot(ctx, f.sx(x), f.sy(y), 6, css('--accent')))
    ctx.restore()
  }, [w, b, showMiss], { ratio: 0.6, minH: 250 })

  const histRef = useCanvas((ctx, W, H) => {
    const maxY = Math.max(40, ...history) * 1.1
    const n = Math.max(history.length - 1, 20)
    const f = frame(ctx, W, H, { x0: 0, x1: n, y0: 0, y1: maxY, xt: [0, Math.round(n / 2), n], yt: [0, Math.round(maxY / 2)], yf: y => y + 'L' }, 'Training step', 'Error')
    if (!history.length) return
    f.clip()
    ctx.beginPath()
    history.forEach((v, i) => (i ? ctx.lineTo(f.sx(i), f.sy(v)) : ctx.moveTo(f.sx(i), f.sy(v))))
    ctx.strokeStyle = css('--accent'); ctx.lineWidth = 2.5; ctx.stroke()
    ctx.lineTo(f.sx(history.length - 1), f.sy(0)); ctx.lineTo(f.sx(0), f.sy(0)); ctx.closePath()
    ctx.globalAlpha = 0.12; ctx.fillStyle = css('--accent'); ctx.fill(); ctx.globalAlpha = 1
    dot(ctx, f.sx(history.length - 1), f.sy(history[history.length - 1]), 5, css('--accent'), css('--surface'))
    ctx.restore()
  }, [history], { ratio: 0.28, minH: 140, maxH: 200 })

  const learn = () => {
    stop()
    // Work in hundreds so the hill has a friendly shape: price/100 = a * size/100 + c
    const xs = HOUSES.map(p => p[0] / 100), ys = HOUSES.map(p => p[1] / 100), n = xs.length, lr = 0.25
    let a = w, c = b / 100, step = 0
    const hist = [rmse(w, b)]
    const oneStep = () => {
      let ga = 0, gc = 0
      for (let i = 0; i < n; i++) { const e = a * xs[i] + c - ys[i]; ga += (2 * e * xs[i]) / n; gc += (2 * e) / n }
      a -= lr * ga; c -= lr * gc; step++
      hist.push(rmse(a, c * 100))
      return Math.hypot(ga, gc)
    }
    const finish = () => {
      setW(a); setB(c * 100); setHistory([...hist])
      setStatus({ cls: 'good', text: `Done in ${step} steps. The error dropped from ${hist[0].toFixed(1)} lakhs to ${hist[hist.length - 1].toFixed(1)} lakhs. The computer worked out by itself: Rs. ${Math.round(a * 100000).toLocaleString()} per m², plus a starting price of ${Math.round(c * 100)} lakhs. Nobody told it these numbers. It learned them from 12 examples.` })
    }
    if (reduceMotion()) { while (step < 400 && oneStep() > 1e-4); return finish() }
    const tick = () => {
      let g = 1
      const per = step < 30 ? 1 : 3
      for (let k = 0; k < per; k++) g = oneStep()
      setW(a); setB(c * 100); setHistory([...hist])
      setStatus({ cls: '', text: `Step ${step}: error ${hist[hist.length - 1].toFixed(1)} lakhs. Checking the slope and taking a step downhill...` })
      if (step < 400 && g > 1e-4) raf.current = requestAnimationFrame(tick)
      else { raf.current = null; finish() }
    }
    raf.current = requestAnimationFrame(tick)
  }

  const scramble = () => {
    stop()
    setW(0.2 + Math.random() * 0.6); setB(100 + Math.random() * 90); setHistory([])
    setStatus({ cls: '', text: 'Started from a bad guess. Now press "Let the computer learn".' })
  }

  const e = rmse(w, b)
  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: Fit the line yourself</h3><span className="eyebrow">Linear Regression</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>Each dot is one house: its size (left to right) and the price it sold for (bottom to top). The black line is our <strong>model</strong>. It has just two knobs (parameters).</p>
      <canvas ref={plotRef} role="img" aria-label="House size and price, with the prediction line" />
      <div className="legend">
        <span><i style={{ background: 'var(--accent)' }} />A house we know</span>
        <span><i style={{ background: 'var(--warn)' }} />Error (miss)</span>
      </div>
      <div className="controls">
        <div className="ctrl">
          <label htmlFor="fl-w">Price per m² (slope) <output>Rs. {Math.round(w * 100000).toLocaleString()}</output></label>
          <input type="range" id="fl-w" min="0" max="3" step="0.01" value={w} onChange={ev => { stop(); setW(+ev.target.value) }} />
          <span className="hint">How steep the line is</span>
        </div>
        <div className="ctrl">
          <label htmlFor="fl-b">Starting price (bias) <output>{Math.round(b)} lakhs</output></label>
          <input type="range" id="fl-b" min="-100" max="200" step="1" value={b} onChange={ev => { stop(); setB(+ev.target.value) }} />
          <span className="hint">Moves the whole line up / down</span>
        </div>
      </div>
      <label className="check"><input type="checkbox" checked={showMiss} onChange={ev => setShowMiss(ev.target.checked)} /> Show the errors (orange lines)</label>
      <div className="readouts">
        <div className="readout"><small>Average error (RMSE)</small><b className={e < 12 ? 'good' : 'warn'}>{e.toFixed(1)} lakhs</b></div>
        <div className="readout"><small>Loss (MSE)</small><b style={{ fontSize: '1.2rem' }}>{Math.round(mse(w, b)).toLocaleString()}</b></div>
        <div className="readout"><small>Guess for a 140 m² house</small><b style={{ fontSize: '1.2rem' }}>{Math.round(w * 140 + b)} lakhs</b></div>
      </div>
      <h3 style={{ marginTop: 8 }}>Now let the computer do it (Gradient Descent)</h3>
      <canvas ref={histRef} role="img" aria-label="How the error drops with each training step" />
      <div className="row">
        <button type="button" className="primary" onClick={learn}>Let the computer learn</button>
        <button type="button" onClick={scramble}>Start from a bad guess</button>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
    </div>
  )
}
