import React, { useMemo } from 'react'
import { marked } from 'marked'

marked.setOptions({ gfm: true })

// Blockquotes that start with "**සිංහලෙන්:**" become the orange Sinhala helper box.
const siBoxes = html => html.replace(/<blockquote>(\s*<p><strong>සිංහලෙන්:?<\/strong>)/g, '<blockquote class="si-box">$1')

// External links open in a new tab; in-app "#/..." links stay in place.
const externalLinks = html => html.replace(/<a href="(https?:[^"]+)"/g, '<a target="_blank" rel="noreferrer" href="$1"')

export default function Markdown({ src, className = '' }) {
  const html = useMemo(() => (src ? externalLinks(siBoxes(marked.parse(src))) : ''), [src])
  if (!html) return null
  return <div className={'md ' + className} dangerouslySetInnerHTML={{ __html: html }} />
}

// Plain-text Sinhala helper box for cert phases (topic.si field).
export function SiBox({ text }) {
  if (!text) return null
  return (
    <blockquote className="si-box">
      <p><strong>සිංහලෙන්:</strong> {text}</p>
    </blockquote>
  )
}
