import React, { useMemo, useState } from 'react'

// A tiny hand-made vocabulary. Real tokenizers (tiktoken, SentencePiece) learn ~50k-200k pieces from data.
const VOCAB = [...new Set([
  ' the', 'the', 'The', ' a', ' an', ' and', ' of', ' to', ' in', ' is', ' on', ' it', ' that', ' for', ' with',
  ' cat', ' sat', ' mat', ' I', ' you', ' we', ' are', ' was', ' be', ' can', ' will', ' not', ' how', ' what',
  ' do', ' does', 'This', ' this', ' learn', ' learning', ' model', ' models', ' machine', ' token', ' tokens',
  'Token', 'izer', 'ize', ' AI', ' language', ' large', ' hello', 'Hello', ' world', ' today', ' go', ' going',
  ' split', ' into', ' small', ' pieces', ' call', ' word', ' words', ' text', ' new', ' time', ' day', ' very',
  ' good', ' fast', ' under', ' stand', ' people', ' love', ' rice', ' curry', ' Colombo', ' Sri', ' Lanka',
  ' Rs', 'Price', ' phone', 'ing', 'ed', 'er', 'ly', 's', 'tion', 're', 'un', ' un', ' re',
  'def', ' def', ' return', 'return', 'print', ' print', ' add', 'add', '):', '()', '    ', '  ', '\n',
  ' ==', ' =', ' +', ' -', ' x', ' y', ' if', ' range', 'self',
  '00', '000', '10', '100', '20', '202', '2024', '19', '99', '12', '123', '23', '34', '45', '56', '67', '77', '89',
])]
const VOCAB_ID = new Map(VOCAB.map((t, i) => [t, 256 + i]))
const MAX_LEN = Math.max(...VOCAB.map(t => t.length))
const enc = new TextEncoder()
const hex = b => '<0x' + b.toString(16).toUpperCase().padStart(2, '0') + '>'

// Greedy longest match: at each position take the longest vocab piece; else one ASCII char; else UTF-8 bytes.
function tokenize(text) {
  const out = []
  let i = 0
  while (i < text.length) {
    let hit = null
    for (let L = Math.min(MAX_LEN, text.length - i); L >= 2; L--) {
      const s = text.slice(i, i + L)
      if (VOCAB_ID.has(s)) { hit = s; break }
    }
    if (hit) { out.push({ text: hit, id: VOCAB_ID.get(hit) }); i += hit.length; continue }
    const ch = String.fromCodePoint(text.codePointAt(i))
    const code = ch.codePointAt(0)
    if (code < 128) out.push({ text: ch, id: VOCAB_ID.get(ch) ?? code })
    else enc.encode(ch).forEach(b => out.push({ text: hex(b), id: b, byte: true }))
    i += ch.length
  }
  return out
}

const PRESETS = [
  ['English', 'The cat sat on the mat. Tokenizers split text into small pieces called tokens!'],
  ['Emoji', 'I love kottu 🍛 and cricket 🏏 in Colombo!'],
  ['Code', 'def add(x, y):\n    return x + y\n\nprint(add(2, 3))'],
  ['Numbers', 'Price: Rs. 1,234,567.89 on 2024-11-01, phone 0771234567'],
]
const show = t => t.replace(/ /g, '·').replace(/\n/g, '↵')

export default function TokenizerLab() {
  const [text, setText] = useState(PRESETS[0][1])
  const [ids, setIds] = useState(false)
  const tokens = useMemo(() => tokenize(text), [text])

  const chars = [...text].length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const perWord = words ? tokens.length / words : 0
  const bytes = tokens.filter(t => t.byte).length

  let status
  if (!text.trim()) status = { cls: '', text: 'Type something. You will see its tokens below.' }
  else if (bytes > 0) status = { cls: 'warn', text: `This tokenizer's vocabulary has no pieces for some of these characters, so it breaks each one into raw UTF-8 bytes (like <0xF0>). An emoji becomes 4 bytes, and a Sinhala or Tamil letter becomes 3. That gave ${bytes} bytes! ${perWord.toFixed(1)} tokens per word. This is why emoji and languages like Sinhala cost much more than English on pay-per-token APIs, and fill the context window faster.` }
  else if (perWord > 2) status = { cls: 'warn', text: `${perWord.toFixed(1)} tokens per word. In code and numbers, spaces, brackets and bits of digits each become separate tokens. That is why maths is hard for a model: it doesn't see "1,234,567" as one number, but as several pieces.` }
  else status = { cls: 'good', text: `Only ${perWord.toFixed(1)} tokens per word. Common English words (" the", " cat") are one whole token each. Unusual words ("Tokenizers") get broken into pieces: Token + izer + s.` }

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: Break text into tokens</h3><span className="eyebrow">Tokenization</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>A model doesn't read letters. It reads <strong>tokens</strong>: words or pieces of words. Every token has a number (an ID). Type anything in the box below and see.</p>
      <div className="row">
        {PRESETS.map(([name, val]) => (
          <button type="button" key={name} aria-pressed={text === val} onClick={() => setText(val)}>{name}</button>
        ))}
      </div>
      <label htmlFor="tokenizer-text" className="muted" style={{ fontSize: '0.9rem' }}>Your text</label>
      <textarea id="tokenizer-text" value={text} onChange={e => setText(e.target.value)} rows={3} />
      <label className="check"><input type="checkbox" id="tokenizer-ids" checked={ids} onChange={e => setIds(e.target.checked)} /> Show token IDs instead of text</label>
      <div aria-label="Tokens" style={{ display: 'flex', flexWrap: 'wrap', gap: 4, fontFamily: 'var(--mono)', fontSize: '0.85rem', lineHeight: 1.4 }}>
        {tokens.map((t, i) => {
          const c = `var(--series-${(i % 4) + 1})`
          return (
            <span key={i} title={`ID ${t.id}`} style={{
              padding: '2px 6px', borderRadius: 6, whiteSpace: 'pre', color: 'var(--ink)',
              border: `1px ${t.byte ? 'dashed' : 'solid'} ${c}`,
              background: `color-mix(in srgb, ${c} 16%, var(--surface))`,
            }}>{ids ? t.id : show(t.text)}</span>
          )
        })}
      </div>
      <div className="legend">
        <span>· = space</span><span>↵ = new line</span><span>Dashed box = one UTF-8 byte</span>
      </div>
      <div className="readouts">
        <div className="readout"><small>Characters</small><b>{chars}</b></div>
        <div className="readout"><small>Words</small><b>{words}</b></div>
        <div className="readout"><small>Tokens</small><b className={bytes ? 'warn' : ''}>{tokens.length}</b></div>
        <div className="readout"><small>Tokens / word</small><b className={perWord > 2 ? 'warn' : 'good'}>{perWord.toFixed(2)}</b></div>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
      <p className="muted" style={{ fontSize: '0.85rem' }}>Note: this is a <strong>simple teaching tokenizer</strong> made for learning. Its vocabulary has only {VOCAB.length} pieces. Real tokenizers (tiktoken in GPT, SentencePiece in Llama/Gemma) use many thousands of pieces learned from data with BPE, so their counts will differ from these. But the idea is the same.</p>
    </div>
  )
}
