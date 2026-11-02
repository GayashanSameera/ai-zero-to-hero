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
  ['සිංහල', 'මම අද කොළඹ යනවා'],
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
  if (!text.trim()) status = { cls: '', text: 'මොනවා හරි type කරන්න. Tokens මොනවද කියලා පල්ලෙහායින් පෙනෙයි.' }
  else if (bytes > 0) status = { cls: 'warn', text: `මේ tokenizer එකේ vocabulary එකේ සිංහල කෑලි නැහැ. ඒ නිසා හැම සිංහල අකුරක්ම UTF-8 bytes 3කට කඩනවා (<0xE0> වගේ). Bytes ${bytes}ක් ආවා! වචනයකට tokens ${perWord.toFixed(1)}ක්. Token එකකට ගෙවන API එකකදී සිංහල ඉංග්‍රීසියට වඩා ගොඩක් ගණන් යන්නේ, context window එක ඉක්මනට පිරෙන්නේ මේ නිසයි.` }
  else if (perWord > 2) status = { cls: 'warn', text: `වචනයකට tokens ${perWord.toFixed(1)}ක්. Code සහ numbers වල spaces, brackets, ඉලක්කම් කෑලි වෙන වෙනම tokens වෙනවා. ඒ නිසා model එකට ගණන් හදන එක අමාරුයි: "1,234,567" එක අංකයක් විදිහට නෙවෙයි, කෑලි කීපයක් විදිහට දකින්නේ.` }
  else status = { cls: 'good', text: `වචනයකට tokens ${perWord.toFixed(1)}ක් විතරයි. පොදු ඉංග්‍රීසි වචන (" the", " cat") මුළු වචනයම එක token එකක්. අමුතු වචන ("Tokenizers") කෑලි වලට කැඩෙනවා: Token + izer + s.` }

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: Text එක tokens වලට කඩමු</h3><span className="eyebrow">Tokenization</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>Model එකක් අකුරු කියවන්නේ නැහැ. ඒක කියවන්නේ <strong>tokens</strong>: වචන හෝ වචන කෑලි. හැම token එකකටම අංකයක් (ID) තියෙනවා. පහළ කොටුවේ ඕන දෙයක් type කරලා බලන්න.</p>
      <div className="row">
        {PRESETS.map(([name, val]) => (
          <button type="button" key={name} aria-pressed={text === val} onClick={() => setText(val)}>{name}</button>
        ))}
      </div>
      <label htmlFor="tokenizer-text" className="muted" style={{ fontSize: '0.9rem' }}>ඔයාගේ text එක</label>
      <textarea id="tokenizer-text" value={text} onChange={e => setText(e.target.value)} rows={3} />
      <label className="check"><input type="checkbox" id="tokenizer-ids" checked={ids} onChange={e => setIds(e.target.checked)} /> Text වෙනුවට token IDs පෙන්වන්න</label>
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
        <span>· = space</span><span>↵ = new line</span><span>Dashed කොටුව = UTF-8 byte එකක්</span>
      </div>
      <div className="readouts">
        <div className="readout"><small>Characters</small><b>{chars}</b></div>
        <div className="readout"><small>Words</small><b>{words}</b></div>
        <div className="readout"><small>Tokens</small><b className={bytes ? 'warn' : ''}>{tokens.length}</b></div>
        <div className="readout"><small>Tokens / word</small><b className={perWord > 2 ? 'warn' : 'good'}>{perWord.toFixed(2)}</b></div>
      </div>
      <div className={'status ' + status.cls}>{status.text}</div>
      <p className="muted" style={{ fontSize: '0.85rem' }}>සැලකිය යුතුයි: මේක ඉගෙන ගන්න හදපු <strong>සරල teaching tokenizer</strong> එකක්. Vocabulary එකේ කෑලි {VOCAB.length}ක් විතරයි. ඇත්ත tokenizers (GPT වල tiktoken, Llama/Gemma වල SentencePiece) data වලින් BPE ඉගෙන ගත්ත කෑලි දහස් ගණනක් පාවිච්චි කරනවා, ඒ නිසා ඒවගේ ගණන් මෙතනට වඩා වෙනස්. හැබැයි අදහස එකමයි.</p>
    </div>
  )
}
