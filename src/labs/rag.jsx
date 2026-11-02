import React, { useMemo, useState } from 'react'

// A fictional company's policy documents (made up for teaching).
const DOCS = [
  { title: 'නිවාඩු', text: 'හැම සේවකයෙකුටම අවුරුද්දකට annual leave දින 14ක් තියෙනවා. Medical leave දින 7ක් වෙනම තියෙනවා, දින 2කට වඩා නම් වෛද්‍ය සහතිකයක් ඕනේ.' },
  { title: 'පඩිය', text: 'පඩිය (salary) හැම මාසෙම 25 වෙනිදා bank account එකට දානවා. 25 වෙනිදා නිවාඩු දවසක් නම්, ඊට කලින් වැඩ කරන දවසේ salary එක ලැබෙනවා.' },
  { title: 'Work from home', text: 'සතියකට දින 2ක් work from home (WFH) කරන්න පුළුවන්. WFH දවස් team lead එක්ක කලින් එකඟ වෙන්න ඕනේ.' },
  { title: 'Office වේලාව', text: 'Office වේලාව උදේ 8.30 ඉඳන් හවස 5.00 දක්වා. Colombo office එකේ කෑම කාමරය දවල් 12 ඉඳන් 2 දක්වා open.' },
  { title: 'Laptop', text: 'අලුත් සේවකයන්ට company laptop එකක් දෙනවා. Laptop එක නැති වුණොත් IT team එකට පැය 24ක් ඇතුළත කියන්න ඕනේ.' },
  { title: 'Bonus', text: 'අවුරුදු අවසාන bonus එක දෙසැම්බර් salary එකත් එක්ක දෙනවා. Bonus එක company එකේ ලාභය සහ ඔයාගේ performance එක අනුව තීරණය වෙනවා.' },
]
// Chunking: split every document into sentences.
const CHUNKS = DOCS.flatMap((d, di) => d.text.split(/(?<=\.)\s+/).map((t, k) => ({ id: `D${di + 1}.${k + 1}`, doc: d.title, text: t })))

// Fixed vocabulary: each dimension is one idea, matched by a few Sinhala / English word forms.
const VOCAB = [
  ['leave', ['leave', 'නිවාඩු']], ['medical', ['medical', 'වෛද්‍ය', 'අසනීප']], ['year', ['අවුරුද්', 'annual', 'year']],
  ['salary', ['salary', 'පඩි']], ['when', ['වෙනිදා', 'කවද', 'දිනය']], ['wfh', ['wfh', 'work from home', 'ගෙදර ඉඳන්']],
  ['office', ['office', 'කාර්යාල']], ['time', ['වේලාව', 'time', 'පැය']], ['food', ['කෑම', 'lunch']],
  ['laptop', ['laptop', 'computer']], ['team', ['team']], ['bonus', ['bonus']],
]
const embed = text => {
  const t = text.toLowerCase()
  return VOCAB.map(([, forms]) => forms.reduce((n, f) => n + t.split(f).length - 1, 0))
}
const cosine = (a, b) => {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0)
  const na = Math.hypot(...a), nb = Math.hypot(...b)
  return na && nb ? dot / (na * nb) : 0
}
CHUNKS.forEach(c => { c.vec = embed(c.text) })

const PRESETS = [
  { q: 'මට අවුරුද්දකට නිවාඩු කීයක් තියෙනවද?', a: 'ඔයාට අවුරුද්දකට annual leave දින 14ක් තියෙනවා [D1.1]. (D2.2 chunk එකත් retrieve වුණා, හැබැයි ඒක පඩිය ගැන නිසා LLM එක ඒක පාවිච්චි කළේ නැහැ. Retrieval හැමදාම perfect නැහැ!)' },
  { q: 'Salary එක දාන්නේ කවදද?', a: 'Salary එක හැම මාසෙම 25 වෙනිදා bank account එකට දානවා [D2.1]. 25 වෙනිදා නිවාඩු දවසක් නම්, ඊට කලින් වැඩ කරන දවසේ ලැබෙනවා [D2.2].' },
  { q: 'ගෙදර ඉඳන් වැඩ කරන්න පුළුවන්ද?', a: 'ඔව්. සතියකට දින 2ක් WFH කරන්න පුළුවන් [D3.1]. හැබැයි ඒ දවස් team lead එක්ක කලින් එකඟ වෙන්න ඕනේ [D3.2].' },
]

const STEPS = [
  ['Knowledge base', 'මේ company එකේ ඇතුළත ලියකියවිලි. LLM එක මේවා කවදාවත් training එකේදී දැකලා නැහැ. ඒ නිසා කෙලින්ම ඇහුවොත් ඒක අනුමාන කරලා බොරු (hallucination) කියන්න පුළුවන්.'],
  ['Chunking', 'දිග ලියකියවිලි පොඩි කෑලි (chunks) වලට කපනවා. මෙතන අපි වාක්‍යයෙන් වාක්‍යය කැපුවා. පොඩි කෑලි නිසා ප්‍රශ්නයට අදාළ කොටස විතරක් හොයාගන්න ලේසියි.'],
  ['Embedding', 'හැම chunk එකක්ම අංක ලැයිස්තුවක් (vector) බවට හරවනවා. මෙතන සරලව: vocabulary එකේ හැම අදහසක්ම කී පාරක් තියෙනවද කියලා ගණන් කරනවා (bag-of-words). තද පාට කොටුව = වැඩි ගණනක්. ඇත්ත embedding models අර්ථය අල්ලගන්නවා, dimensions දහස් ගණනක් තියෙනවා.'],
  ['ප්‍රශ්නය', 'User ගේ ප්‍රශ්නයත් හරියටම ඒ විදිහටම vector එකක් කරනවා. එතකොට ප්‍රශ්නයයි chunks ටිකයි එකම "භාෂාවෙන්" සසඳන්න පුළුවන්.'],
  ['Retrieval', 'ප්‍රශ්න vector එකයි හැම chunk vector එකයි අතර cosine similarity එක ගණන් කරනවා (0 = කිසි සම්බන්ධයක් නැහැ, 1 = එකම දිශාව). වැඩිම score එක තියෙන chunks 2 (top-2) තෝරගන්නවා.'],
  ['Prompt එක හදනවා', 'තෝරගත්ත chunks ටික, උපදෙස් (system prompt) එක්ක ප්‍රශ්නයට කලින් prompt එකට දානවා. LLM එකට "විභාගයට පොත ඇරගෙන ලියන්න" (open book) දෙනවා වගේ.'],
  ['LLM උත්තරය', 'LLM එක context එක කියවලා උත්තරය ලියනවා, [D2.1] වගේ මූලාශ්‍රය (citation) එක්ක. ඒ නිසා ඔයාට උත්තරය ඇත්තද කියලා check කරන්න පුළුවන්.'],
]

const Bars = ({ vec }) => {
  const max = 2
  return (
    <span style={{ display: 'inline-flex', gap: 2, verticalAlign: 'middle' }} aria-label={'vector [' + vec.join(', ') + ']'}>
      {vec.map((v, i) => (
        <span key={i} title={`${VOCAB[i][0]}: ${v}`} style={{ width: 9, height: 18, borderRadius: 2, border: '1px solid var(--line)', background: v ? `color-mix(in srgb, var(--accent) ${Math.min(1, v / max) * 100}%, var(--surface))` : 'var(--surface)' }} />
      ))}
    </span>
  )
}
const box = { border: '1px solid var(--line)', borderRadius: 8, padding: '8px 10px', fontSize: '0.9rem' }

export default function RagLab() {
  const [step, setStep] = useState(0)
  const [qi, setQi] = useState(1)
  const [custom, setCustom] = useState('')
  const question = qi >= 0 ? PRESETS[qi].q : custom
  const qvec = useMemo(() => embed(question), [question])
  const scored = useMemo(() => CHUNKS.map(c => ({ ...c, score: cosine(qvec, c.vec) })), [qvec])
  const top = [...scored].sort((a, b) => b.score - a.score).slice(0, 2)
  const topIds = top.map(c => c.id)
  const none = !qvec.some(Boolean)

  const prompt = `SYSTEM: ඔයා company HR assistant කෙනෙක්. පහත CONTEXT එකේ තියෙන දේවල් විතරක් පාවිච්චි කරලා උත්තර දෙන්න. Chunk ID එක cite කරන්න. CONTEXT එකේ නැත්නම් "මම දන්නේ නැහැ" කියන්න.\n\nCONTEXT:\n${top.map(c => `[${c.id}] ${c.text}`).join('\n')}\n\nQUESTION: ${question}`
  const answer = none ? 'සමාවෙන්න, මට දීපු context එකේ ඒ ගැන තොරතුරු නැහැ. HR team එකෙන් අහන්න.'
    : qi >= 0 ? PRESETS[qi].a : `Context එකට අනුව: ${top[0].text} [${top[0].id}]`

  const chunkList = (render) => <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{CHUNKS.map(render)}</div>

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: RAG pipeline එක පියවරෙන් පියවර</h3><span className="eyebrow">Retrieval-Augmented Generation</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>ලංකාවේ හිතලා හදපු software company එකක (<em>Kelani Soft</em>) HR chatbot එකක් හදමු. LLM එකට company නීති රීති දන්නේ නැහැ. RAG එකෙන් අපි අදාළ කොටස හොයලා prompt එකට දානවා.</p>
      <div className="row" style={{ gap: 6 }}>
        {STEPS.map(([name], i) => <button type="button" key={i} aria-pressed={step === i} onClick={() => setStep(i)} style={{ padding: '4px 10px' }} title={name}>{i + 1}</button>)}
      </div>
      <h3>{step + 1}. {STEPS[step][0]}</h3>

      {step === 0 && DOCS.map((d, i) => <div key={i} style={box}><strong>D{i + 1} · {d.title}</strong><br />{d.text}</div>)}
      {step === 1 && chunkList(c => <div key={c.id} style={box}><span className="num" style={{ color: 'var(--accent)' }}>[{c.id}]</span> {c.text}</div>)}
      {step === 2 && <>
        <div className="legend">{VOCAB.map(([k], i) => <span key={k}>{i + 1}. {k}</span>)}</div>
        {chunkList(c => <div key={c.id} style={{ ...box, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}><span className="num">[{c.id}]</span><Bars vec={c.vec} /><span className="muted" style={{ fontSize: '0.82rem', flexBasis: '100%' }}>{c.text}</span></div>)}
      </>}
      {step >= 3 && step <= 4 && <>
        <div className="row">
          {PRESETS.map((p, i) => <button type="button" key={i} aria-pressed={qi === i} onClick={() => setQi(i)}>{p.q}</button>)}
        </div>
        <label htmlFor="rag-question" className="muted" style={{ fontSize: '0.9rem' }}>නැත්නම් ඔයාගේම ප්‍රශ්නයක් type කරන්න</label>
        <input type="text" id="rag-question" value={custom} placeholder="උදා: Laptop එක නැති වුණොත් මොකද කරන්නේ?" onChange={e => { setCustom(e.target.value); setQi(e.target.value ? -1 : 1) }} />
        <div style={{ ...box, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}><strong>Q</strong><Bars vec={qvec} /><span>{question}</span></div>
      </>}
      {step === 4 && chunkList(c => {
        const s = scored.find(x => x.id === c.id).score, hit = topIds.includes(c.id) && !none
        return (
          <div key={c.id} style={{ ...box, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', borderColor: hit ? 'var(--good)' : 'var(--line)', background: hit ? 'var(--good-soft)' : 'transparent' }}>
            <span className="num">[{c.id}]</span><Bars vec={c.vec} /><b className="num" style={{ color: hit ? 'var(--good)' : 'var(--muted)' }}>{s.toFixed(2)}</b>
            <span style={{ fontSize: '0.82rem', flexBasis: '100%' }} className={hit ? '' : 'muted'}>{c.text}</span>
          </div>
        )
      })}
      {step === 5 && <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: 'var(--code-bg)', padding: 12, borderRadius: 8, fontFamily: 'var(--mono)', fontSize: '0.82rem', margin: 0 }}>{prompt}</pre>}
      {step === 6 && <>
        <div style={box}><strong>User:</strong> {question}</div>
        <div style={{ ...box, borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}><strong>HR Bot:</strong> {answer}</div>
      </>}

      <div className={'status ' + (step === 4 && none ? 'warn' : step === 6 ? 'good' : '')}>
        {step === 4 && none ? 'මේ ප්‍රශ්නයේ අපේ vocabulary එකේ වචන එකක්වත් නැහැ, ඒ නිසා හැම score එකම 0යි. ඇත්ත embeddings අර්ථය දන්න නිසා මේ ප්‍රශ්නය එන්නේ නැහැ. "leave", "salary", "laptop" වගේ වචනයක් දාලා බලන්න.' : STEPS[step][1]}
      </div>
      <div className="row">
        <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}>← Back</button>
        <button type="button" className="primary" onClick={() => setStep(s => s + 1)} disabled={step === STEPS.length - 1}>Next →</button>
        <span className="muted" style={{ fontSize: '0.85rem' }}>පියවර {step + 1} / {STEPS.length}</span>
      </div>
    </div>
  )
}
