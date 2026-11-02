import React, { useEffect, useRef, useState } from 'react'
import { useCanvas, frame, dot, css, seeded, reduceMotion } from './draw.js'

// 60 customers: monthly spend (Rs. '000) vs shop visits per month, in 3 natural groups.
const GROUPS = [[18, 4], [50, 15], [80, 6]]
const POINTS = (() => {
  const r = seeded(21), g = () => (r() + r() + r() - 1.5) * 2
  return GROUPS.flatMap(([cx, cy]) => Array.from({ length: 20 }, () => [cx + g() * 7, cy + g() * 1.6]))
})()
const DOM = { x0: 0, x1: 100, y0: 0, y1: 20, xt: [0, 25, 50, 75, 100], yt: [0, 5, 10, 15, 20] }
const COLORS = ['--series-1', '--series-2', '--series-3', '--series-4', '--muted']
// visits are multiplied by 5 so both axes count equally when measuring distance
const dist = (p, c) => Math.hypot(p[0] - c[0], (p[1] - c[1]) * 5)

const assignAll = centers => POINTS.map(p => centers.reduce((best, c, i) => (dist(p, c) < dist(p, centers[best]) ? i : best), 0))
const moveAll = (centers, assign) => centers.map((c, i) => {
  const mine = POINTS.filter((_, j) => assign[j] === i)
  if (!mine.length) return c
  return [mine.reduce((s, p) => s + p[0], 0) / mine.length, mine.reduce((s, p) => s + p[1], 0) / mine.length]
})
const totalDist = (centers, assign) => POINTS.reduce((s, p, j) => s + dist(p, centers[assign[j]]), 0)

export default function KMeansLab() {
  const [k, setK] = useState(3)
  const [st, setSt] = useState({ centers: null, assign: null, iter: 0 })
  const [seed, setSeed] = useState(5)
  const [status, setStatus] = useState({ cls: '', text: 'මේ තිත් 60 කඩේට එන customers ලා. කවුරුත් අපිට group කියලා නෑ. "Centers random විදිහට තියන්න" ඔබලා පටන් ගන්න.' })
  const timer = useRef(null)

  const stop = () => { if (timer.current) clearTimeout(timer.current); timer.current = null }
  useEffect(() => stop, [])

  const { centers, assign, iter } = st
  const plotRef = useCanvas((ctx, W, H) => {
    const f = frame(ctx, W, H, DOM, 'මාසෙකට වියදම (Rs. \'000)', 'මාසෙකට එන වාර', { l: 44 })
    f.clip()
    if (centers && assign) {
      ctx.lineWidth = 1; ctx.globalAlpha = 0.3
      POINTS.forEach((p, j) => {
        ctx.strokeStyle = css(COLORS[assign[j]])
        ctx.beginPath(); ctx.moveTo(f.sx(p[0]), f.sy(p[1])); ctx.lineTo(f.sx(centers[assign[j]][0]), f.sy(centers[assign[j]][1])); ctx.stroke()
      })
      ctx.globalAlpha = 1
    }
    POINTS.forEach((p, j) => dot(ctx, f.sx(p[0]), f.sy(p[1]), 5, assign ? css(COLORS[assign[j]]) : css('--ink')))
    ;(centers || []).forEach((c, i) => {
      const x = f.sx(c[0]), y = f.sy(c[1])
      ctx.fillStyle = css(COLORS[i]); ctx.strokeStyle = css('--surface'); ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(x, y - 11); ctx.lineTo(x + 11, y); ctx.lineTo(x, y + 11); ctx.lineTo(x - 11, y); ctx.closePath()
      ctx.fill(); ctx.stroke()
      ctx.strokeStyle = css('--ink'); ctx.lineWidth = 1; ctx.stroke()
    })
    ctx.restore()
  }, [centers, assign], { ratio: 0.65, minH: 260 })

  const place = (kk = k) => {
    stop()
    const r = seeded(seed); setSeed(seed + 1)
    const c = Array.from({ length: kk }, () => [10 + r() * 80, 2 + r() * 16])
    setSt({ centers: c, assign: null, iter: 0 })
    setStatus({ cls: '', text: `Centers ${kk}ක් (diamond හැඩය) random තැන් වල තිබ්බා. දැන් "Assign step" ඔබන්න: හැම customer කෙනෙක්ම ළඟම center එකට යනවා.` })
    return c
  }

  const assignStep = () => {
    stop()
    const c = centers || place()
    const a = assignAll(c)
    const changed = assign ? a.filter((v, j) => v !== assign[j]).length : POINTS.length
    setSt({ centers: c, assign: a, iter })
    setStatus({ cls: '', text: `Assign step: හැම තිතක්ම ළඟම center එකේ පාටට වුණා. Customers ${changed} දෙනෙක් group මාරු කළා. ඊළඟට "Move centers step" ඔබන්න.` })
  }

  const moveStep = () => {
    stop()
    if (!centers || !assign) return assignStep()
    const c = moveAll(centers, assign)
    const moved = c.reduce((s, p, i) => s + dist(p, centers[i]), 0)
    setSt({ centers: c, assign, iter: iter + 1 })
    setStatus(moved < 0.01
      ? { cls: 'good', text: 'Centers එක තැනකින්වත් හෙල්ලුනේ නෑ. ඒ කියන්නේ k-means ඉවරයි (converged)!' }
      : { cls: '', text: `Move step: හැම center එකක්ම තමන්ගේ පාටේ තිත් වල මැදට (සාමාන්‍යයට) ගියා. දැන් ආයේ "Assign step" කරන්න.` })
  }

  const runToFinish = () => {
    stop()
    let c = centers || place(), a = assign || assignAll(c), n = iter
    const frames = []
    for (let guard = 0; guard < 50; guard++) {
      const c2 = moveAll(c, a); n++
      const a2 = assignAll(c2)
      frames.push({ centers: c2, assign: a2, iter: n })
      const same = a2.every((v, j) => v === a[j])
      c = c2; a = a2
      if (same) break
    }
    const done = () => {
      const t = totalDist(c, a)
      setStatus({ cls: 'good', text: `වටයන් ${n}කින් ඉවරයි. තවත් කිසිම customer කෙනෙක් group මාරු වෙන්නේ නෑ. මුළු දුර ${t.toFixed(0)}. ${k === 3 ? 'K = 3 දාපුවාම ස්වභාවික group 3 ම ලස්සනට හොයාගත්තා!' : 'K = 3 කරලා බලන්න. මේ data වල ඇත්තටම group 3ක් තියෙනවා.'}` })
    }
    if (reduceMotion()) { setSt(frames[frames.length - 1]); return done() }
    let i = 0
    const tick = () => {
      setSt(frames[i])
      setStatus({ cls: '', text: `වටය ${frames[i].iter}: assign කරනවා, centers මැදට යවනවා...` })
      i++
      timer.current = i < frames.length ? setTimeout(tick, 600) : null
      if (i >= frames.length) done()
    }
    tick()
  }

  const changeK = v => {
    stop(); setK(v); setSt({ centers: null, assign: null, iter: 0 })
    setStatus({ cls: '', text: `K = ${v}. ඒ කියන්නේ customers ලා group ${v}කට බෙදන්න හදනවා. Centers ආයේ තියන්න.` })
  }

  const total = centers && assign ? totalDist(centers, assign) : null
  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: Customers ලා group කරන්න</h3><span className="eyebrow">K-Means Clustering</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>හැම තිතක්ම කඩේක customer කෙනෙක්. වමේ ඉඳන් දකුණට = මාසෙකට වියදම. පහළ ඉඳන් උඩට = මාසෙකට කඩේට එන වාර ගණන. Labels නෑ (<strong>unsupervised</strong>). K-means පියවර දෙකක් ආයේ ආයේ කරනවා: <strong>assign</strong> (ළඟම center එකට) සහ <strong>move</strong> (center එක group එකේ මැදට).</p>
      <canvas ref={plotRef} role="img" aria-label="Customers ලා වියදම සහ එන වාර අනුව k-means clusters" />
      <div className="legend">
        {Array.from({ length: k }, (_, i) => <span key={i}><i style={{ background: `var(${COLORS[i]})` }} />Group {i + 1}</span>)}
        <span>◆ = center</span>
      </div>
      <div className="controls">
        <div className="ctrl">
          <label htmlFor="km-k">Groups ගණන (K) <output>{k}</output></label>
          <input type="range" id="km-k" min="2" max="5" step="1" value={k} onChange={e => changeK(+e.target.value)} />
          <span className="hint">K අපි කලින්ම තීරණය කරන්න ඕනේ</span>
        </div>
      </div>
      <div className="row">
        <button type="button" onClick={() => place()}>Centers random විදිහට තියන්න</button>
        <button type="button" onClick={assignStep}>Assign step</button>
        <button type="button" onClick={moveStep}>Move centers step</button>
        <button type="button" className="primary" onClick={runToFinish}>අවසානය දක්වා run කරන්න</button>
      </div>
      <div className="readouts">
        <div className="readout"><small>Iterations</small><b>{iter}</b></div>
        <div className="readout"><small>Group ඇතුළේ මුළු දුර</small><b className={total === null ? '' : 'good'}>{total === null ? '–' : total.toFixed(0)}</b></div>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
    </div>
  )
}
