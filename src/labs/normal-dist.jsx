import React, { useEffect, useRef, useState } from 'react'
import { useCanvas, frame, css, seeded, reduceMotion } from './draw.js'

// A/L exam marks (0-100). Bell curve + optional histogram of random students.
const N = 200, BIN = 5
const pdf = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI))

// Box-Muller: two uniform random numbers → one normal random number
function sampleMarks(seed, m, s) {
  const r = seeded(seed), out = []
  while (out.length < N) {
    const z = Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r())
    const v = m + s * z
    if (v >= 0 && v <= 100) out.push(v)
  }
  return out
}

export default function NormalDistLab() {
  const [mean, setMean] = useState(55)
  const [sd, setSd] = useState(12)
  const [band, setBand] = useState(1)
  const [samples, setSamples] = useState([])
  const [shown, setShown] = useState(0)
  const [seed, setSeed] = useState(11)
  const [status, setStatus] = useState({ cls: '', text: 'Move the mean and the whole hill slides left / right. Move the SD and the hill gets wider / narrower.' })
  const raf = useRef(null)

  const stop = () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null }
  useEffect(() => stop, [])

  const visible = samples.slice(0, shown)
  const plotRef = useCanvas((ctx, W, H) => {
    const peak = pdf(mean, mean, sd)
    const bins = Array(100 / BIN).fill(0)
    visible.forEach(v => { bins[Math.min(bins.length - 1, Math.floor(v / BIN))]++ })
    const dens = bins.map(c => c / (N * BIN))
    const y1 = Math.max(peak, ...dens) * 1.15
    const f = frame(ctx, W, H, { x0: 0, x1: 100, y0: 0, y1, xt: [0, 20, 40, 60, 80, 100], yt: [] }, 'A/L marks', 'How many students', { l: 28 })
    f.clip()
    // histogram of samples
    ctx.fillStyle = css('--series-2'); ctx.globalAlpha = 0.45
    dens.forEach((d, i) => { if (d) ctx.fillRect(f.sx(i * BIN) + 1, f.sy(d), f.sx(BIN) - f.sx(0) - 2, f.sy(0) - f.sy(d)) })
    ctx.globalAlpha = 1
    // shaded bands
    const shade = (k, alpha) => {
      const a = Math.max(0, mean - k * sd), b = Math.min(100, mean + k * sd)
      ctx.beginPath(); ctx.moveTo(f.sx(a), f.sy(0))
      for (let x = a; x <= b; x += 0.5) ctx.lineTo(f.sx(x), f.sy(pdf(x, mean, sd)))
      ctx.lineTo(f.sx(b), f.sy(0)); ctx.closePath()
      ctx.globalAlpha = alpha; ctx.fillStyle = css('--accent'); ctx.fill(); ctx.globalAlpha = 1
    }
    if (band >= 2) shade(2, 0.14)
    if (band >= 1) shade(1, 0.22)
    // curve
    ctx.beginPath()
    for (let x = 0; x <= 100; x += 0.5) (x ? ctx.lineTo(f.sx(x), f.sy(pdf(x, mean, sd))) : ctx.moveTo(f.sx(x), f.sy(pdf(x, mean, sd))))
    ctx.strokeStyle = css('--accent'); ctx.lineWidth = 2.5; ctx.stroke()
    // mean and SD markers
    ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.strokeStyle = css('--ink')
    ctx.beginPath(); ctx.moveTo(f.sx(mean), f.sy(0)); ctx.lineTo(f.sx(mean), f.sy(peak)); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = css('--ink'); ctx.font = '12px ' + css('--mono'); ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
    ctx.fillText('mean', f.sx(mean), f.sy(peak) - 4)
    ctx.restore()
  }, [mean, sd, band, shown, samples], { ratio: 0.55, minH: 240 })

  const draw = () => {
    stop()
    const s = sampleMarks(seed, mean, sd)
    setSeed(seed + 1); setSamples(s)
    const finish = () => {
      setShown(N)
      const in1 = s.filter(v => Math.abs(v - mean) <= sd).length, in2 = s.filter(v => Math.abs(v - mean) <= 2 * sd).length
      setStatus({ cls: 'good', text: `Picked marks for ${N} random students. ${Math.round(in1 / N * 100)}% of them are within ±1 SD (the curve says 68%). ${Math.round(in2 / N * 100)}% are within ±2 SD (the curve says 95%). See how the orange bars follow the shape of the curve? Press it again: it's a little different every time, but the shape stays the same.` })
    }
    if (reduceMotion()) return finish()
    let n = 0
    const tick = () => {
      n = Math.min(N, n + 5); setShown(n)
      setStatus({ cls: '', text: `Picked ${n} students... watch how the bars build up.` })
      if (n < N) raf.current = requestAnimationFrame(tick)
      else { raf.current = null; finish() }
    }
    setShown(0); raf.current = requestAnimationFrame(tick)
  }

  const clear = () => { stop(); setSamples([]); setShown(0) }
  const lo1 = Math.round(mean - sd), hi1 = Math.round(mean + sd)

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: The bell curve (Normal Distribution)</h3><span className="eyebrow">Normal Distribution</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>Think of the marks of students who sat the A/L exam in Sri Lanka. Most are somewhere in the middle. Only a few get very low or very high marks. So the shape looks like a bell. <strong>Mean</strong> = the middle. <strong>SD (standard deviation)</strong> = how spread out the marks are from the middle.</p>
      <canvas ref={plotRef} role="img" aria-label="Bell curve of A/L marks, with shaded SD ranges and a histogram of random samples" />
      <div className="legend">
        <span><i style={{ background: 'var(--accent)' }} />Bell curve (theory)</span>
        <span><i style={{ background: 'var(--series-2)' }} />Histogram of {N} random students</span>
      </div>
      <div className="controls">
        <div className="ctrl">
          <label htmlFor="nd-mean">Middle mark (mean) <output>{mean}</output></label>
          <input type="range" id="nd-mean" min="30" max="75" step="1" value={mean} onChange={e => { clear(); setMean(+e.target.value) }} />
          <span className="hint">Slides the hill left / right</span>
        </div>
        <div className="ctrl">
          <label htmlFor="nd-sd">Spread (SD) <output>{sd}</output></label>
          <input type="range" id="nd-sd" min="4" max="20" step="1" value={sd} onChange={e => { clear(); setSd(+e.target.value) }} />
          <span className="hint">Small SD = everyone is close to the middle</span>
        </div>
      </div>
      <div className="row" role="group" aria-label="Range to shade">
        <button type="button" aria-pressed={band === 0} onClick={() => setBand(0)}>No shading</button>
        <button type="button" aria-pressed={band === 1} onClick={() => setBand(1)}>±1 SD (≈68%)</button>
        <button type="button" aria-pressed={band === 2} onClick={() => setBand(2)}>±2 SD (≈95%)</button>
      </div>
      <div className="readouts">
        <div className="readout"><small>±1 SD range</small><b style={{ fontSize: '1.2rem' }}>{lo1} – {hi1}</b></div>
        <div className="readout"><small>±2 SD range</small><b style={{ fontSize: '1.2rem' }}>{Math.round(mean - 2 * sd)} – {Math.round(mean + 2 * sd)}</b></div>
        <div className="readout"><small>Samples</small><b style={{ fontSize: '1.2rem' }}>{shown}</b></div>
      </div>
      <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>So about 68 out of every 100 students get between {lo1} and {hi1} marks.</p>
      <div className="row">
        <button type="button" className="primary" onClick={draw}>Pick {N} random students</button>
        <button type="button" onClick={clear}>Clear histogram</button>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
    </div>
  )
}
