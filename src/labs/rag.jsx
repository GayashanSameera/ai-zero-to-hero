import React, { useMemo, useState } from 'react'

// A fictional company's policy documents (made up for teaching).
const DOCS = [
  { title: 'Leave', text: 'Every employee gets 14 days of annual leave per year. There are also 7 separate days of medical leave, and you need a doctor\'s certificate for more than 2 days in a row.' },
  { title: 'Salary', text: 'Your salary is paid into your bank account on the 25th of every month. If the 25th is a holiday, you get your salary on the working day before it.' },
  { title: 'Work from home', text: 'You can work from home (WFH) 2 days a week. Agree your WFH days with your team lead in advance.' },
  { title: 'Office hours', text: 'Office hours are 8.30 in the morning to 5.00 in the evening. The lunch room in the Colombo office is open from 12 noon to 2.' },
  { title: 'Laptop', text: 'New employees get a company laptop. If you lose your laptop, tell the IT team within 24 hours.' },
  { title: 'Bonus', text: 'A bonus is paid at the end of December, together with that month\'s salary. The bonus depends on the company\'s profit and your performance.' },
]
// Chunking: split every document into sentences.
const CHUNKS = DOCS.flatMap((d, di) => d.text.split(/(?<=\.)\s+/).map((t, k) => ({ id: `D${di + 1}.${k + 1}`, doc: d.title, text: t })))

// Fixed vocabulary: each dimension is one idea, matched by a few English word forms.
const VOCAB = [
  ['leave', ['leave', 'holiday']], ['medical', ['medical', 'doctor', 'sick']], ['year', ['year', 'annual']],
  ['salary', ['salary', 'pay']], ['when', ['25th', 'when', 'date']], ['wfh', ['wfh', 'work from home']],
  ['office', ['office']], ['time', ['hour', 'time']], ['food', ['lunch', 'food']],
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
  { q: 'How many days of leave do I get per year?', a: 'You get 14 days of annual leave per year [D1.1]. (Chunk D2.2 was also retrieved because it says "holiday", but it is about salary, so the LLM did not use it. Retrieval is not always perfect!)' },
  { q: 'When is the salary paid?', a: 'Your salary is paid into your bank account on the 25th of every month [D2.1]. If the 25th is a holiday, you get it on the working day before [D2.2].' },
  { q: 'Can I work from home?', a: 'Yes. You can work from home 2 days a week [D3.1]. But you need to agree those days with your team lead in advance [D3.2].' },
]

const STEPS = [
  ['Knowledge base', 'These are the company\'s internal documents. The LLM never saw them during training. So if you just ask it directly, it may guess and make things up (hallucination).'],
  ['Chunking', 'Long documents are cut into small pieces (chunks). Here we cut them sentence by sentence. Small pieces make it easy to find just the part that answers the question.'],
  ['Embedding', 'Every chunk is turned into a list of numbers (a vector). Here we keep it simple: we count how many times each idea in our vocabulary appears (bag-of-words). Darker box = higher count. Real embedding models capture meaning and have thousands of dimensions.'],
  ['The question', 'The user\'s question is turned into a vector in exactly the same way. Now the question and the chunks can be compared in the same "language".'],
  ['Retrieval', 'We work out the cosine similarity between the question vector and every chunk vector (0 = not related at all, 1 = same direction). We keep the 2 chunks with the highest scores (top-2).'],
  ['Building the prompt', 'The chosen chunks go into the prompt, along with instructions (the system prompt), before the question. It is like letting the LLM sit an open-book exam.'],
  ['The LLM answer', 'The LLM reads the context and writes the answer, with a source (citation) like [D2.1]. So you can check whether the answer is true.'],
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

  const prompt = `SYSTEM: You are the company HR assistant. Answer using only what is in the CONTEXT below. Cite the chunk ID. If it is not in the CONTEXT, say "I don't know".\n\nCONTEXT:\n${top.map(c => `[${c.id}] ${c.text}`).join('\n')}\n\nQUESTION: ${question}`
  const answer = none ? 'Sorry, the context I was given has no information about that. Please ask the HR team.'
    : qi >= 0 ? PRESETS[qi].a : `According to the context: ${top[0].text} [${top[0].id}]`

  const chunkList = (render) => <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{CHUNKS.map(render)}</div>

  return (
    <div className="lab">
      <div className="lab-head"><h3>Lab: The RAG pipeline, step by step</h3><span className="eyebrow">Retrieval-Augmented Generation</span></div>
      <p className="muted" style={{ fontSize: '0.95rem' }}>Let's build an HR chatbot for a made-up Sri Lankan software company (<em>Kelani Soft</em>). The LLM doesn't know the company's rules. With RAG, we find the right part of the documents and put it into the prompt.</p>
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
        <label htmlFor="rag-question" className="muted" style={{ fontSize: '0.9rem' }}>Or type your own question</label>
        <input type="text" id="rag-question" value={custom} placeholder="e.g. What should I do if I lose my laptop?" onChange={e => { setCustom(e.target.value); setQi(e.target.value ? -1 : 1) }} />
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
        {step === 4 && none ? 'This question has none of the words in our vocabulary, so every score is 0. Real embeddings understand meaning, so they don\'t have this problem. Try a word like "leave", "salary" or "laptop".' : STEPS[step][1]}
      </div>
      <div className="row">
        <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}>← Back</button>
        <button type="button" className="primary" onClick={() => setStep(s => s + 1)} disabled={step === STEPS.length - 1}>Next →</button>
        <span className="muted" style={{ fontSize: '0.85rem' }}>Step {step + 1} / {STEPS.length}</span>
      </div>
    </div>
  )
}
