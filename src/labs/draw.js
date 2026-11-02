// Shared canvas helpers for labs. Labs are src/labs/<id>.jsx; this file is not a lab.
import { useEffect, useRef } from 'react'

export const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Returns a ref for a <canvas>. `draw(ctx, W, H)` runs whenever deps change,
 * the container resizes, or the light/dark theme changes. Sizes for high-DPI screens.
 */
export function useCanvas(draw, deps, { ratio = 0.6, minH = 220, maxH = 420 } = {}) {
  const ref = useRef(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

  const render = () => {
    const canvas = ref.current
    if (!canvas || !canvas.parentElement) return
    const dpr = window.devicePixelRatio || 1
    const W = canvas.parentElement.clientWidth
    const H = Math.max(minH, Math.min(maxH, Math.round(W * ratio)))
    canvas.style.height = H + 'px'
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    drawRef.current(ctx, W, H)
  }

  useEffect(render, deps)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ro = new ResizeObserver(() => render())
    ro.observe(canvas.parentElement)
    const mq = matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', render)
    const mo = new MutationObserver(render)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    document.fonts?.ready.then(render)
    return () => { ro.disconnect(); mq.removeEventListener('change', render); mo.disconnect() }
  }, [])

  return ref
}

/**
 * Draws grid, ticks and axis labels. d = { x0, x1, y0, y1, xt: [], yt: [], xf?, yf? }.
 * Returns scale functions sx/sy (data → pixels), their inverses, padding P and clip().
 */
export function frame(ctx, W, H, d, xLabel, yLabel, pad = {}) {
  const P = { l: 56, r: 14, t: 12, b: 44, ...pad }
  const sx = x => P.l + ((x - d.x0) / (d.x1 - d.x0)) * (W - P.l - P.r)
  const sy = y => H - P.b - ((y - d.y0) / (d.y1 - d.y0)) * (H - P.t - P.b)
  const ix = px => d.x0 + ((px - P.l) / (W - P.l - P.r)) * (d.x1 - d.x0)
  const iy = py => d.y0 + ((H - P.b - py) / (H - P.t - P.b)) * (d.y1 - d.y0)
  ctx.lineWidth = 1
  ctx.strokeStyle = css('--line')
  ctx.fillStyle = css('--muted')
  ctx.font = '12px ' + css('--mono')
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ;(d.xt || []).forEach(x => {
    ctx.beginPath(); ctx.moveTo(sx(x), P.t); ctx.lineTo(sx(x), H - P.b); ctx.stroke()
    ctx.fillText(d.xf ? d.xf(x) : x, sx(x), H - P.b + 6)
  })
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ;(d.yt || []).forEach(y => {
    ctx.beginPath(); ctx.moveTo(P.l, sy(y)); ctx.lineTo(W - P.r, sy(y)); ctx.stroke()
    ctx.fillText(d.yf ? d.yf(y) : y, P.l - 8, sy(y))
  })
  ctx.font = '12px ' + css('--body')
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  if (xLabel) ctx.fillText(xLabel, P.l + (W - P.l - P.r) / 2, H - 2)
  if (yLabel) {
    ctx.save()
    ctx.translate(12, P.t + (H - P.t - P.b) / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textBaseline = 'middle'
    ctx.fillText(yLabel, 0, 0)
    ctx.restore()
  }
  return {
    sx, sy, ix, iy, P,
    clip() { ctx.save(); ctx.beginPath(); ctx.rect(P.l, P.t, W - P.l - P.r, H - P.t - P.b); ctx.clip() },
  }
}

export function dot(ctx, x, y, r, fill, stroke) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) { ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke() }
}

/** Seeded random numbers so labs look the same on every load. */
export function seeded(seed = 7) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

/** A slider with label and live value. */
export function sliderProps(value, set) {
  return { value, onChange: e => set(+e.target.value) }
}
