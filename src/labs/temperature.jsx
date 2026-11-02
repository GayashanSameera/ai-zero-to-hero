import React, { useEffect, useMemo, useRef, useState } from 'react'
import { seeded, reduceMotion } from './draw.js'

// Fixed logits (raw scores) a model might give for the next token.
const PROMPTS = [
  { name: 'English', text: 'The cat sat on the ...', cands: [[' mat', 3.2], [' floor', 2.5], [' sofa', 2.1], [' roof', 1.4], [' chair', 1.2], [' bed', 1.0], [' table', 0.6], [' moon', -0.6]] },
  { name: 'සිංහල', text: 'මම උදේට කෑවේ ...', cands: [['බත්', 2.8], ['පාන්', 2.6], ['ඉඳිආප්ප', 2.0], ['කිරිබත්', 1.8], ['රොටී', 1.3], ['ආප්ප', 1.0], ['කොත්තු', 0.2], ['අයිස්ක්‍රීම්', -0.8]] },
]

// logits → softmax(logit / T) → keep top-k → keep top-p (nucleus) → renormalise
function distribution(cands, T, k, p) {
  const z = cands.map(([, l]) => l / T)
  const m = Math.max(...z)
  const e = z.map(v => Math.exp(v - m))
  const s = e.reduce((a, b) => a + b, 0)
  const rows = cands.map(([tok, logit], i) => ({ tok, logit, prob: e[i] / s, keep: false }))
  const order = rows.map((_, i) => i).sort((a, b) => rows[b].prob - rows[a].prob)
  let cum = 0
  order.forEach((idx, rank) => {
    if (rank < k && cum < p) { rows[idx].keep = true; cum += rows[idx].prob }
  })
  const kept = rows.reduce((a, r) => a + (r.keep ? r.prob : 0), 0)
  rows.forEach(r => { r.final = r.keep ? r.prob / kept : 0 })
  return rows
}

export default function TemperatureLab() {
  const [pi, setPi] = useState(0)
  const [T, setT] = useState(1)
  const [k, setK] = useState(8)
  const [p, setP] = useState(1)
  const [tally, setTally] = useState({})
  const [last, setLast] = useState([])
  const rng = useRef(seeded(42))

  const prompt = PROMPTS[pi]
  const rows = useMemo(() => distribution(prompt.cands, T, k, p), [pi, T, k, p])
  useEffect(() => { setTally({}); setLast([]) }, [pi, T, k, p])

  const sample = n => {
    const t = { ...tally }, picks = []
    for (let j = 0; j < n; j++) {
      let r = rng.current(), chosen = rows.find(x => x.keep)
      for (const row of rows) { if (!row.keep) continue; r -= row.final; if (r <= 0) { chosen = row; break } }
      t[chosen.tok] = (t[chosen.tok] || 0) + 1
      picks.push(chosen.tok)
    }
    setTally(t); setLast(picks.slice(-8))
  }

  const total = Object.values(tally).reduce((a, b) => a + b, 0)
  const top = rows.reduce((a, r) => (r.final > a.final ? r : a))
  const keptN = rows.filter(r => r.keep).length

  let status
  if (keptN === 1) status = { cls: 'warn', text: `ඉතුරු වෙලා තියෙන්නේ "${top.tok.trim()}" එක විතරයි. Model එක හැමදාම එකම දේ කියනවා (greedy). ආරක්ෂිතයි, හැබැයි කම්මැලියි.` }
  else if (T < 0.6) status = { cls: 'good', text: `Temperature අඩුයි (${T.toFixed(1)}). ලොකු probability එක තව ලොකු වෙනවා: "${top.tok.trim()}" ට ${(top.final * 100).toFixed(0)}%. උත්තර ස්ථිරයි, නැවත නැවත එකම දේ. Facts, code, ගණන් වලට හොඳයි.` }
  else if (T > 1.3) status = { cls: 'warn', text: `Temperature වැඩියි (${T.toFixed(1)}). Bars ඔක්කොම සමාන වෙන්න ළං වෙනවා. අමුතු tokens ("${rows[rows.length - 1].tok.trim()}" වගේ) පවා තෝරගන්න පුළුවන්. Creative, හැබැයි සමහර වෙලාවට විකාර. Top-k / top-p එකෙන් අමුතු ඒවා කපලා දාන්න පුළුවන්.` }
  else status = { cls: '', text: `Temperature ${T.toFixed(1)}: සාමාන්‍ය මට්ටම. Model එක logits වලට අනුව සාධාරණව තෝරනවා. "Sample 20" ඔබලා ප්‍රතිඵල ගණන් බලන්න.` }

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: ඊළඟ token එක තෝරන හැටි</h3><span className="eyebrow">Temperature · Top-k · Top-p</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>LLM එකක් ඊළඟට එන්න පුළුවන් හැම token එකකටම ලකුණක් (<strong>logit</strong>) දෙනවා. <strong>Softmax</strong> එකෙන් ඒවා probability (%) බවට හරවනවා. ඊට පස්සේ "ලොතරැයියක්" වගේ එකක් අහඹු ලෙස තෝරනවා. Sliders වලින් ඒ ලොතරැයිය වෙනස් කරන්න.</p>
      <div className="row">
        {PROMPTS.map((pr, i) => <button type="button" key={pr.name} aria-pressed={pi === i} onClick={() => setPi(i)}>{pr.name}</button>)}
      </div>
      <div className="status" style={{ fontFamily: 'var(--mono)' }}>{prompt.text}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} aria-label="Next token probabilities">
        {rows.map(r => (
          <div key={r.tok} style={{ display: 'grid', gridTemplateColumns: 'minmax(70px, 7.5em) 3.2em 1fr 3.4em', gap: 8, alignItems: 'center', fontSize: '0.88rem', opacity: r.keep ? 1 : 0.45 }}>
            <span style={{ fontFamily: 'var(--mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: r.keep ? 'none' : 'line-through' }}>{r.tok.replace(/^ /, '·')}</span>
            <span className="num muted" title="logit">{r.logit.toFixed(1)}</span>
            <span style={{ background: 'var(--code-bg)', borderRadius: 4, height: 14, overflow: 'hidden' }}>
              <span style={{ display: 'block', height: '100%', width: (r.keep ? r.final : r.prob) * 100 + '%', background: r.keep ? (r === top ? 'var(--accent)' : 'var(--series-1)') : 'var(--muted)', opacity: r.keep && r !== top ? 0.6 : 1, transition: reduceMotion() ? 'none' : 'width .2s' }} />
            </span>
            <span className="num" style={{ textAlign: 'right' }}>{r.keep ? (r.final * 100).toFixed(1) + '%' : 'අයින්'}</span>
          </div>
        ))}
      </div>
      <div className="legend">
        <span>මැද අංකය = logit</span>
        <span><i style={{ background: 'var(--accent)' }} />වැඩිම probability</span>
        <span><i style={{ background: 'var(--muted)' }} />top-k / top-p නිසා අයින් කළා</span>
      </div>
      <div className="controls">
        <div className="ctrl">
          <label htmlFor="temperature-t">Temperature <output>{T.toFixed(1)}</output></label>
          <input type="range" id="temperature-t" min="0.1" max="2" step="0.1" value={T} onChange={e => setT(+e.target.value)} />
          <span className="hint">අඩු = ස්ථිරයි, වැඩි = අහඹුයි</span>
        </div>
        <div className="ctrl">
          <label htmlFor="temperature-k">Top-k <output>{k}</output></label>
          <input type="range" id="temperature-k" min="1" max="8" step="1" value={k} onChange={e => setK(+e.target.value)} />
          <span className="hint">හොඳම k ගණන විතරක් තියාගන්න</span>
        </div>
        <div className="ctrl">
          <label htmlFor="temperature-p">Top-p <output>{p.toFixed(2)}</output></label>
          <input type="range" id="temperature-p" min="0.05" max="1" step="0.05" value={p} onChange={e => setP(+e.target.value)} />
          <span className="hint">එකතුව p % වෙනකම් හොඳම ඒවා තියාගන්න</span>
        </div>
      </div>
      <div className="row">
        <button type="button" className="primary" onClick={() => sample(1)}>Sample 1</button>
        <button type="button" onClick={() => sample(20)}>Sample 20</button>
        <button type="button" onClick={() => { setTally({}); setLast([]) }}>Reset</button>
      </div>
      {total > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Token</th><th>වාර ගණන</th><th>%</th></tr></thead>
            <tbody>
              {rows.filter(r => tally[r.tok]).map(r => (
                <tr key={r.tok}><td style={{ fontFamily: 'var(--mono)' }}>{r.tok.replace(/^ /, '·')}</td><td className="num">{tally[r.tok]}</td><td className="num">{((tally[r.tok] / total) * 100).toFixed(0)}%</td></tr>
              ))}
            </tbody>
          </table>
          <p className="muted" style={{ fontSize: '0.85rem', marginTop: 6 }}>මුළු samples {total}. අන්තිම ඒවා: {last.map(t => t.trim()).join(', ')}</p>
        </div>
      )}
      <div className={'status ' + status.cls}>{status.text}</div>
    </div>
  )
}
