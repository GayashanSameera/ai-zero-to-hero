import React, { useState } from 'react'

export function CodeBlock({ lang = 'python', src }) {
  const [label, setLabel] = useState('Copy')
  const commentRe = lang === 'sql' ? /^\s*--/ : lang === 'javascript' ? /^\s*\/\// : /^\s*#/
  const copy = () => {
    navigator.clipboard?.writeText(src).then(
      () => { setLabel('Copied ✓'); setTimeout(() => setLabel('Copy'), 1600) },
      () => setLabel('Copy failed')
    )
  }
  return (
    <div className="code-wrap">
      <span className="code-lang">{lang}</span>
      <button type="button" onClick={copy}>{label}</button>
      <pre>
        {src.trim().split('\n').map((line, i) => {
          const hash = line.indexOf(lang === 'sql' ? '--' : lang === 'javascript' ? '//' : '#')
          if (commentRe.test(line)) return <div key={i} className="c">{line}</div>
          // trailing comment, but not inside a string like "#hashtag"
          if (hash > 0 && lang === 'python' && line.slice(0, hash).split(/["']/).length % 2 === 1) {
            return <div key={i}>{line.slice(0, hash)}<span className="c">{line.slice(hash)}</span></div>
          }
          return <div key={i}>{line || ' '}</div>
        })}
      </pre>
    </div>
  )
}

export function Quiz({ items, onFinish }) {
  const [picked, setPicked] = useState({})
  const done = Object.keys(picked).length
  const correct = items.filter((q, i) => picked[i] === q.answer).length
  const choose = (qi, oi) => {
    if (picked[qi] !== undefined) return
    const next = { ...picked, [qi]: oi }
    setPicked(next)
    if (Object.keys(next).length === items.length) {
      onFinish?.(items.filter((q, i) => next[i] === q.answer).length)
    }
  }
  return (
    <div className="stack">
      <div className="quiz">
        {items.map((item, qi) => {
          const p = picked[qi]
          return (
            <div className="q" key={qi}>
              <h3>{qi + 1}. {item.q}</h3>
              <div className="opts">
                {item.options.map((o, oi) => {
                  let cls = ''
                  if (p !== undefined && oi === item.answer) cls = 'right'
                  else if (p === oi) cls = 'wrong'
                  return <button type="button" key={oi} className={cls} onClick={() => choose(qi, oi)}>{o}</button>
                })}
              </div>
              {p !== undefined && (
                <p className="why">{p === item.answer ? '✓ හරි! ' : '✗ ටිකක් වැරදියි. '}{item.why}</p>
              )}
            </div>
          )
        })}
      </div>
      {done === items.length && (
        <div className="row">
          <span className="score" aria-live="polite">ලකුණු: {correct} / {items.length}</span>
          <button type="button" onClick={() => setPicked({})}>ආයෙත් කරන්න</button>
        </div>
      )}
    </div>
  )
}
