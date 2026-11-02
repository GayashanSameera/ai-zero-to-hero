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
    const f = frame(ctx, W, H, { x0: 0, x1: 1, y0: 0, y1: 2, xt: [0, 0.25, 0.5, 0.75, 1], yt: [] }, 'Model එකේ spam score එක', '', { l: 16, r: 16, t: 8 })
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
    ctx.fillText('ඇත්ත spam', f.sx(0) + 4, f.sy(2) + 2)
    ctx.fillText('ඇත්ත හොඳ email', f.sx(0) + 4, f.sy(1) + 2)
    ctx.textAlign = 'right'; ctx.fillStyle = css('--ink')
    ctx.fillText('Spam folder →', f.sx(1) - 4, f.sy(2) + 2)
    ctx.restore()
  }, [t], { ratio: 0.32, minH: 170, maxH: 220 })

  let status
  if (t < 0.3) status = { cls: 'warn', text: `Threshold එක ගොඩක් අඩුයි (${t.toFixed(2)}). ටිකක් සැකයක් තිබ්බත් spam folder එකට යවනවා. Recall ${pct(rec)}: spam ගොඩක්ම අල්ලනවා. ඒත් precision ${pct(prec)}: හොඳ emails ${fp}ක් වැරදිලා spam වලට ගියා. Job offer email එකක් එහෙම නැති වුණොත් අවුල්!` }
  else if (t > 0.75) status = { cls: 'warn', text: `Threshold එක ගොඩක් වැඩියි (${t.toFixed(2)}). ගොඩක් විශ්වාස නම් විතරයි spam කියන්නේ. Precision ${pct(prec)}: spam කිව්වොත් ඒක ඇත්තටම වගේ spam. ඒත් recall ${pct(rec)}: spam ${fn}ක් inbox එකට රිංගුවා.` }
  else status = { cls: 'good', text: `Threshold ${t.toFixed(2)}. Precision ${pct(prec)} සහ recall ${pct(rec)} අතර සමබරයක්. Threshold එක වමට ගත්තොත් recall වැඩි වෙනවා, precision අඩු වෙනවා. දකුණට ගත්තොත් අනිත් පැත්ත. දෙකම එකපාර 100% කරන්න බෑ, මොකද scores එකිනෙකට පැටලිලා.` }

  const cell = (n, label, note, good) => (
    <td style={{ background: good ? 'var(--good-soft)' : 'var(--warn-soft)', verticalAlign: 'top' }}>
      <b style={{ fontSize: '1.4rem', fontFamily: 'var(--display)' }}>{n}</b> <span className="muted" style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{label}</span>
      <div style={{ fontSize: '0.82rem' }}>{note}</div>
    </td>
  )

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: Spam filter එකක් හදමු</h3><span className="eyebrow">Confusion Matrix</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>Emails 40ක් තියෙනවා. Model එක හැම email එකකටම 0ත් 1ත් අතර <strong>score</strong> එකක් දෙනවා (1 = අනිවාර්යයෙන්ම spam). Score එක <strong>threshold</strong> එකට වඩා වැඩි නම් spam folder එකට යවනවා. ඒ ඉර ඔයා තීරණය කරන්න.</p>
      <canvas ref={stripRef} role="img" aria-label="Emails score එක අනුව, threshold ඉර සමඟ" />
      <div className="legend">
        <span><i style={{ background: 'var(--bad)' }} />ඇත්තටම spam</span>
        <span><i style={{ background: 'var(--good)' }} />ඇත්තටම හොඳ email</span>
        <span>කළු වටේ = model එක spam කිව්වා</span>
      </div>
      <div className="controls">
        <div className="ctrl">
          <label htmlFor="cm-threshold">Threshold <output>{t.toFixed(2)}</output></label>
          <input type="range" id="cm-threshold" min="0.02" max="0.98" step="0.01" value={t} onChange={e => setT(+e.target.value)} />
          <span className="hint">මේකට වඩා score වැඩි නම් spam</span>
        </div>
      </div>
      <div className="table-wrap">
        <table style={{ minWidth: 340 }}>
          <thead><tr><th></th><th>Model: Spam</th><th>Model: හොඳයි</th></tr></thead>
          <tbody>
            <tr><th>ඇත්තටම Spam</th>
              {cell(tp, 'TP', 'Spam එකක් හරියටම අල්ලගත්තා.', true)}
              {cell(fn, 'FN', 'Spam එකක් මඟ ඇරුණා. Inbox එකට ආවා.', false)}</tr>
            <tr><th>ඇත්තටම හොඳයි</th>
              {cell(fp, 'FP', 'හොඳ email එකක් වැරදිලා spam වලට ගියා.', false)}
              {cell(tn, 'TN', 'හොඳ email එක හරියටම inbox එකට.', true)}</tr>
          </tbody>
        </table>
      </div>
      <div className="readouts">
        <div className="readout"><small>Accuracy</small><b>{pct(acc)}</b></div>
        <div className="readout"><small>Precision</small><b className={prec >= 0.8 ? 'good' : 'warn'}>{pct(prec)}</b></div>
        <div className="readout"><small>Recall</small><b className={rec >= 0.8 ? 'good' : 'warn'}>{pct(rec)}</b></div>
        <div className="readout"><small>F1</small><b>{isNaN(f1) ? '–' : f1.toFixed(2)}</b></div>
      </div>
      <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}><strong>Precision</strong> = model එක spam කිව්ව ඒවායින් ඇත්තටම spam කීයද. <strong>Recall</strong> = ඇත්ත spam ඔක්කොගෙන් අල්ලගත්තේ කීයද. <strong>F1</strong> = ඒ දෙකේම සමබර ලකුණක්.</p>
      <div className={'status ' + status.cls}>{status.text}</div>
    </div>
  )
}
