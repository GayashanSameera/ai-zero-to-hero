import React, { useState } from 'react'
import { useCanvas, frame, dot, css, seeded } from './draw.js'

// 40 emails: [model score 0-1, isSpam]. 16 spam, 24 normal; the scores overlap a bit.
const EMAILS = (() => {
  const r = seeded(42), bell = () => (r() + r() + r()) / 3
  const clamp = v => Math.min(0.99, Math.max(0.01, v))
  const spam = Array.from({ length: 16 }, () => [clamp(0.35 + bell() * 0.65), true])
  const ham = Array.from({ length: 24 }, () => [clamp(bell() * 0.7 - 0.05), false])
  return [...spam, ...ham].map(([s, y], i) => ({ s, y, j: r() }))
})()
const pct = v => (isNaN(v) ? '–' : Math.round(v * 100) + '%')

export default function ConfusionMatrixLab() {
  const [t, setT] = useState(0.5)

  let tp = 0, fp = 0, fn = 0, tn = 0
  EMAILS.forEach(({ s, y }) => {
    const p = s >= t
    if (p && y) tp++; else if (p && !y) fp++; else if (!p && y) fn++; else tn++
  })
  const acc = (tp + tn) / EMAILS.length
  const prec = tp / (tp + fp), rec = tp / (tp + fn)
  const f1 = 2 * prec * rec / (prec + rec)

  const stripRef = useCanvas((ctx, W, H) => {
    const f = frame(ctx, W, H, { x0: 0, x1: 1, y0: 0, y1: 2, xt: [0, 0.25, 0.5, 0.75, 1], yt: [] }, 'Model\'s spam score', '', { l: 16, r: 16, t: 8 })
    f.clip()
    ctx.globalAlpha = 0.1; ctx.fillStyle = css('--bad')
    ctx.fillRect(f.sx(t), f.sy(2), f.sx(1) - f.sx(t), f.sy(0) - f.sy(2))
    ctx.globalAlpha = 1
    EMAILS.forEach(({ s, y, j }) => {
      const row = y ? 1.5 : 0.5
      dot(ctx, f.sx(s), f.sy(row + (j - 0.5) * 0.6), 5, css(y ? '--bad' : '--good'), s >= t ? css('--ink') : null)
    })
    ctx.strokeStyle = css('--ink'); ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(f.sx(t), f.sy(0)); ctx.lineTo(f.sx(t), f.sy(2)); ctx.stroke()
    ctx.fillStyle = css('--muted'); ctx.font = '12px ' + css('--body'); ctx.textBaseline = 'top'; ctx.textAlign = 'left'
    ctx.fillText('Really spam', f.sx(0) + 4, f.sy(2) + 2)
    ctx.fillText('Really good email', f.sx(0) + 4, f.sy(1) + 2)
    ctx.textAlign = 'right'; ctx.fillStyle = css('--ink')
    ctx.fillText('Spam folder →', f.sx(1) - 4, f.sy(2) + 2)
    ctx.restore()
  }, [t], { ratio: 0.32, minH: 170, maxH: 220 })

  let status
  if (t < 0.3) status = { cls: 'warn', text: `The threshold is very low (${t.toFixed(2)}). Even a little doubt sends an email to the spam folder. Recall ${pct(rec)}: it catches almost all the spam. But precision ${pct(prec)}: ${fp} good emails went to spam by mistake. Imagine losing a job offer email that way!` }
  else if (t > 0.75) status = { cls: 'warn', text: `The threshold is very high (${t.toFixed(2)}). It only says spam when it is very sure. Precision ${pct(prec)}: when it says spam, it almost always is. But recall ${pct(rec)}: ${fn} spam emails sneaked into the inbox.` }
  else status = { cls: 'good', text: `Threshold ${t.toFixed(2)}. A balance between precision ${pct(prec)} and recall ${pct(rec)}. Move the threshold left and recall goes up while precision goes down. Move it right and the opposite happens. You can't get both to 100% at once, because the scores overlap.` }

  const cell = (n, label, note, good) => (
    <td style={{ background: good ? 'var(--good-soft)' : 'var(--warn-soft)', verticalAlign: 'top' }}>
      <b style={{ fontSize: '1.4rem', fontFamily: 'var(--display)' }}>{n}</b> <span className="muted" style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{label}</span>
      <div style={{ fontSize: '0.82rem' }}>{note}</div>
    </td>
  )

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: Build a spam filter</h3><span className="eyebrow">Confusion Matrix</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>There are 40 emails. The model gives each one a <strong>score</strong> between 0 and 1 (1 = definitely spam). If the score is above the <strong>threshold</strong>, the email goes to the spam folder. You decide where that line goes.</p>
      <canvas ref={stripRef} role="img" aria-label="Emails by score, with the threshold line" />
      <div className="legend">
        <span><i style={{ background: 'var(--bad)' }} />Really spam</span>
        <span><i style={{ background: 'var(--good)' }} />Really good email</span>
        <span>Black ring = the model said spam</span>
      </div>
      <div className="controls">
        <div className="ctrl">
          <label htmlFor="cm-threshold">Threshold <output>{t.toFixed(2)}</output></label>
          <input type="range" id="cm-threshold" min="0.02" max="0.98" step="0.01" value={t} onChange={e => setT(+e.target.value)} />
          <span className="hint">A score above this means spam</span>
        </div>
      </div>
      <div className="table-wrap">
        <table style={{ minWidth: 340 }}>
          <thead><tr><th></th><th>Model: Spam</th><th>Model: Good</th></tr></thead>
          <tbody>
            <tr><th>Really spam</th>
              {cell(tp, 'TP', 'Caught a spam email correctly.', true)}
              {cell(fn, 'FN', 'Missed a spam email. It landed in the inbox.', false)}</tr>
            <tr><th>Really good</th>
              {cell(fp, 'FP', 'A good email went to spam by mistake.', false)}
              {cell(tn, 'TN', 'A good email correctly went to the inbox.', true)}</tr>
          </tbody>
        </table>
      </div>
      <div className="readouts">
        <div className="readout"><small>Accuracy</small><b>{pct(acc)}</b></div>
        <div className="readout"><small>Precision</small><b className={prec >= 0.8 ? 'good' : 'warn'}>{pct(prec)}</b></div>
        <div className="readout"><small>Recall</small><b className={rec >= 0.8 ? 'good' : 'warn'}>{pct(rec)}</b></div>
        <div className="readout"><small>F1</small><b>{isNaN(f1) ? '–' : f1.toFixed(2)}</b></div>
      </div>
      <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}><strong>Precision</strong> = of the emails the model called spam, how many really were spam. <strong>Recall</strong> = of all the real spam, how much it caught. <strong>F1</strong> = one score that balances the two.</p>
      <div className={'status ' + status.cls}>{status.text}</div>
    </div>
  )
}
