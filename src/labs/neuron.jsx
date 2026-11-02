import React, { useState } from 'react'
import { useCanvas, frame, dot, css } from './draw.js'

// One neuron deciding "should I go to the beach?"
const INPUTS = [
  { name: 'අව්ව තියෙනවද', short: 'අව්ව' },
  { name: 'යාළුවෝ free ද', short: 'යාළුවෝ' },
  { name: 'වැස්ස එන්න ඉඩ', short: 'වැස්ස' },
]
const ACTS = {
  Step: { f: z => (z >= 0 ? 1 : 0), cut: 0.5, si: '0ට වඩා වැඩි නම් 1, නැත්නම් 0. "ඔව්/නෑ" විතරයි.' },
  Sigmoid: { f: z => 1 / (1 + Math.exp(-z)), cut: 0.5, si: 'ඕනෑම අංකයක් 0ත් 1ත් අතරට තද කරනවා. Probability එකක් වගේ.' },
  ReLU: { f: z => Math.max(0, z), cut: 0, si: 'Negative නම් 0. Positive නම් ඒ අංකයම. Deep learning වල ගොඩක්ම පාවිච්චි වෙන්නේ මේක.' },
  Tanh: { f: z => Math.tanh(z), cut: 0, si: 'Sigmoid වගේමයි, ඒත් -1ත් 1ත් අතරට තද කරනවා.' },
}

export default function NeuronLab() {
  const [x, setX] = useState([0.8, 0.6, 0.3])
  const [w, setW] = useState([1.5, 1.0, -2.0])
  const [b, setB] = useState(-0.5)
  const [act, setAct] = useState('Sigmoid')

  const z = x.reduce((s, xi, i) => s + xi * w[i], 0) + b
  const A = ACTS[act]
  const out = A.f(z)
  const go = out > A.cut

  const diagRef = useCanvas((ctx, W, H) => {
    const inX = 76, sumX = W * 0.5, actX = W * 0.72, outX = W - 34, midY = H / 2
    const ys = INPUTS.map((_, i) => H * (0.2 + i * 0.3))
    ctx.font = '12px ' + css('--body'); ctx.textBaseline = 'middle'
    // weighted connections
    ys.forEach((y, i) => {
      ctx.strokeStyle = css(w[i] >= 0 ? '--good' : '--bad')
      ctx.lineWidth = 0.5 + Math.abs(w[i]) * 3
      ctx.globalAlpha = 0.35 + 0.65 * x[i]
      ctx.beginPath(); ctx.moveTo(inX, y); ctx.lineTo(sumX, midY); ctx.stroke()
      ctx.globalAlpha = 1
      ctx.fillStyle = css('--ink'); ctx.textAlign = 'center'
      const mx = (inX + sumX) / 2, my = (y + midY) / 2
      ctx.fillStyle = css('--surface'); ctx.fillRect(mx - 20, my - 9, 40, 18)
      ctx.fillStyle = css(w[i] >= 0 ? '--good' : '--bad'); ctx.font = '12px ' + css('--mono')
      ctx.fillText((w[i] >= 0 ? '+' : '') + w[i].toFixed(1), mx, my)
      dot(ctx, inX, y, 16, css('--surface'), css('--accent'))
      ctx.fillStyle = css('--ink'); ctx.fillText(x[i].toFixed(1), inX, y)
      ctx.font = '12px ' + css('--body'); ctx.textAlign = 'right'; ctx.fillStyle = css('--muted')
      ctx.fillText(INPUTS[i].short, inX - 22, y)
    })
    // bias from above
    ctx.strokeStyle = css(b >= 0 ? '--good' : '--bad'); ctx.lineWidth = 0.5 + Math.abs(b) * 3; ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(sumX, 12); ctx.lineTo(sumX, midY); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = css('--muted'); ctx.textAlign = 'left'; ctx.fillText('bias ' + b.toFixed(1), sumX + 6, 16)
    // sum → activation → output
    ctx.strokeStyle = css('--line'); ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(sumX, midY); ctx.lineTo(outX, midY); ctx.stroke()
    dot(ctx, sumX, midY, 24, css('--surface'), css('--ink'))
    ctx.fillStyle = css('--ink'); ctx.textAlign = 'center'; ctx.font = '18px ' + css('--body'); ctx.fillText('Σ', sumX, midY - 5)
    ctx.font = '11px ' + css('--mono'); ctx.fillText(z.toFixed(2), sumX, midY + 11)
    ctx.fillStyle = css('--surface'); ctx.strokeStyle = css('--accent')
    ctx.fillRect(actX - 30, midY - 18, 60, 36); ctx.strokeRect(actX - 30, midY - 18, 60, 36)
    ctx.fillStyle = css('--accent'); ctx.font = '12px ' + css('--mono'); ctx.fillText(act, actX, midY)
    dot(ctx, outX, midY, 22, css(go ? '--good' : '--muted'))
    ctx.fillStyle = css('--surface'); ctx.fillText(out.toFixed(2), outX, midY)
    ctx.fillStyle = css('--ink'); ctx.font = '12px ' + css('--body'); ctx.fillText(go ? 'යමු!' : 'එපා', outX, midY + 36)
  }, [x, w, b, act], { ratio: 0.5, minH: 220, maxH: 300 })

  const plotRef = useCanvas((ctx, W, H) => {
    const d = { x0: -5, x1: 5, y0: -1.2, y1: 2.5, xt: [-4, -2, 0, 2, 4], yt: [-1, 0, 1, 2] }
    const f = frame(ctx, W, H, d, 'Weighted sum (z)', 'Output', { l: 44 })
    f.clip()
    ctx.beginPath()
    for (let v = -5; v <= 5.001; v += 0.05) (v === -5 ? ctx.moveTo(f.sx(v), f.sy(A.f(v))) : ctx.lineTo(f.sx(v), f.sy(A.f(v))))
    ctx.strokeStyle = css('--accent'); ctx.lineWidth = 2.5; ctx.stroke()
    const zc = Math.max(-5, Math.min(5, z))
    ctx.setLineDash([4, 4]); ctx.strokeStyle = css('--muted'); ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(f.sx(zc), f.sy(d.y0)); ctx.lineTo(f.sx(zc), f.sy(A.f(zc))); ctx.stroke(); ctx.setLineDash([])
    dot(ctx, f.sx(zc), f.sy(A.f(zc)), 6, css('--warn'), css('--surface'))
    ctx.restore()
  }, [z, act], { ratio: 0.4, minH: 170, maxH: 240 })

  const setAt = (arr, set, i) => e => { const n = [...arr]; n[i] = +e.target.value; set(n) }
  const parts = x.map((xi, i) => `${xi.toFixed(1)}×${w[i].toFixed(1)}`).join(' + ')

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: එක neuron එකක් ඇතුළේ</h3><span className="eyebrow">Perceptron / Neuron</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>මේ neuron එක තීරණය කරනවා අද <strong>මුහුදු වෙරළට යනවද</strong> කියලා. Inputs තුනක් (0 = නෑ, 1 = අනිවාර්යයෙන්ම). හැම input එකකටම <strong>weight</strong> එකක් තියෙනවා: ඒ input එක කොච්චර වැදගත්ද කියලා. කොළ ඉර = පක්ෂයි, රතු ඉර = විපක්ෂයි, මහත = වැදගත්කම.</p>
      <canvas ref={diagRef} role="img" aria-label="Inputs, weights, weighted sum, activation සහ output පෙන්වන neuron diagram එක" />
      <div className="controls">
        {INPUTS.map((inp, i) => (
          <div className="ctrl" key={i}>
            <label htmlFor={`neuron-x${i}`}>{inp.name} (input) <output>{x[i].toFixed(1)}</output></label>
            <input type="range" id={`neuron-x${i}`} min="0" max="1" step="0.1" value={x[i]} onChange={setAt(x, setX, i)} />
            <label htmlFor={`neuron-w${i}`}>Weight <output>{w[i].toFixed(1)}</output></label>
            <input type="range" id={`neuron-w${i}`} min="-2" max="2" step="0.1" value={w[i]} onChange={setAt(w, setW, i)} />
          </div>
        ))}
        <div className="ctrl">
          <label htmlFor="neuron-b">Bias <output>{b.toFixed(1)}</output></label>
          <input type="range" id="neuron-b" min="-2" max="2" step="0.1" value={b} onChange={e => setB(+e.target.value)} />
          <span className="hint">කලින්ම තියෙන කැමැත්ත / අකමැත්ත</span>
        </div>
      </div>
      <div className="row" role="group" aria-label="Activation function">
        {Object.keys(ACTS).map(k => <button type="button" key={k} aria-pressed={act === k} onClick={() => setAct(k)}>{k}</button>)}
      </div>
      <canvas ref={plotRef} role="img" aria-label={`${act} activation function එක, දැන් තියෙන weighted sum එකේ ලකුණ සමඟ`} />
      <div className="readouts">
        <div className="readout"><small>Weighted sum (z)</small><b>{z.toFixed(2)}</b></div>
        <div className="readout"><small>Output</small><b className={go ? 'good' : 'warn'}>{out.toFixed(2)}</b></div>
        <div className="readout"><small>තීරණය</small><b className={go ? 'good' : 'warn'}>{go ? 'වෙරළට යමු' : 'ගෙදර ඉමු'}</b></div>
      </div>
      <div className={'status ' + (go ? 'good' : 'warn')}>
        z = {parts} + ({b.toFixed(1)}) = <strong>{z.toFixed(2)}</strong>. ඒ කියන්නේ inputs × weights එකතු කරලා bias එකත් දැම්මා. ඊට පස්සේ <strong>{act}</strong>: {A.si} Output එක {out.toFixed(2)}, ඒ නිසා {go ? 'neuron එක කියනවා "යමු!"' : 'neuron එක කියනවා "එපා".'} වැස්සේ weight එක negative නිසා වැස්ස වැඩි වෙද්දී z අඩු වෙනවා.
      </div>
    </div>
  )
}
