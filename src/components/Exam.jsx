import React, { useEffect, useMemo, useState } from 'react'
import index from '../exam/index.json'
import ccar from '../exam-ccar/ccar-f-practice.json'
import { findPhase, allTopics } from '../content/index.js'
import { useStoredState } from '../hooks.js'
import { isCorrect, isMulti, needed, toggle, answeredValue, correctSet, correctLetters } from './examUtils.js'

// NCA-GENL domain files load on demand so the first page stays small; CCAR-F is small enough to bundle.
const loaders = import.meta.glob(['../exam/*.json', '!../exam/index.json'])
export const loadDomain = id => (id === ccar.id ? Promise.resolve(ccar) : loaders[`../exam/${id}.json`]().then(m => m.default))

const ccarMeta = {
  id: ccar.id, num: ccar.num, title: ccar.title, prefix: ccar.prefix, related: ccar.related,
  count: ccar.questions.length, levelNames: ccar.levelNames,
  levels: ccar.levelNames.map(n => ccar.questions.filter(q => q.level === n).length),
}
const allDomains = [...index, ccarMeta]
const CCAR_DOMAINS = {
  1: 'Agentic Architecture & Orchestration', 2: 'Tool Design & MCP Integration', 3: 'Claude Code Configuration & Workflows',
  4: 'Prompt Engineering & Structured Output', 5: 'Context Management & Reliability',
}

// Which lesson teaches each exam question (from topic.examRefs).
const lessonFor = {}
allTopics.forEach(t => (t.examRefs || []).forEach(ref => { lessonFor[ref] ||= t }))

/** Loads the given question ids (e.g. ['TAI-001']) from whichever domain files hold them. */
export async function loadQuestions(ids) {
  const prefixes = [...new Set(ids.map(id => id.split('-')[0]))]
  const domains = await Promise.all(allDomains.filter(d => prefixes.includes(d.prefix)).map(d => loadDomain(d.id)))
  const byId = Object.fromEntries(domains.flatMap(d => d.questions).map(q => [q.id, q]))
  return ids.map(id => byId[id]).filter(Boolean)
}

function useAnswers() {
  return useStoredState('examAnswers', {})
}
const record = (q, v) => ({ pick: v, ok: isCorrect(q, v) })

export function TopicExamQuestions({ refs }) {
  const [open, setOpen] = useState(false)
  const [qs, setQs] = useState(null)
  const [answers, setAnswers] = useAnswers()
  useEffect(() => { if (open && !qs) loadQuestions(refs).then(setQs) }, [open])
  const ccarOnly = refs.every(r => r.startsWith('CCAR-'))
  const label = ccarOnly ? 'CCAR-F' : refs.some(r => r.startsWith('CCAR-')) ? 'Exam practice' : 'NCA-GENL'
  return (
    <section className="stack">
      <div className="eyebrow">{label}</div>
      <h2>Exam questions on this topic ({refs.length})</h2>
      {!open
        ? <div><button type="button" className="primary" onClick={() => setOpen(true)}>Show {refs.length} questions</button></div>
        : !qs ? <p className="muted">Loading...</p>
          : qs.map(q => (
            <div className="lab" key={q.id}>
              <Question q={q} picked={answers[q.id]?.pick} showLesson={false}
                onPick={v => setAnswers(a => ({ ...a, [q.id]: record(q, v) }))} />
            </div>
          ))}
    </section>
  )
}

const LEVELS = ['Foundation', 'Intermediate', 'Advanced']
const LEVEL_NAMES = { Foundation: 'Foundation', Intermediate: 'Intermediate', Advanced: 'Advanced' }
const levelLabel = l => l

// Tiny markdown: ``` code blocks, `inline code`, **bold**.
function Inline({ text }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('`') && p.endsWith('`') && p.length > 1 ? <code key={i}>{p.slice(1, -1)}</code>
      : p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong>
        : <React.Fragment key={i}>{p}</React.Fragment>)
}
export function Md({ text }) {
  const blocks = text.split(/```[a-z]*\n?/)
  return (
    <div className="prose">
      {blocks.map((b, i) => i % 2
        ? <pre key={i} style={{ paddingTop: 16 }}>{b.replace(/\n$/, '')}</pre>
        : b.trim().split(/\n\s*\n/).filter(Boolean).map((para, j) => <p key={i + '-' + j}><Inline text={para} /></p>))}
    </div>
  )
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

// Mock exam settings. `pick` builds the question list; `groupOf`/`groupLabel` give the per-domain score table.
const NCA_MOCK = {
  key: 'nca', title: 'Mock exam', size: 60, minutes: 60, target: 70,
  intro: '60 random questions from all 9 domains, 60 minutes. Like the real exam, you only see right and wrong answers at the end.',
  targetNote: '(NVIDIA does not publish the pass mark. 70%+ is a safe target.)',
  async pick() {
    const domains = await Promise.all(index.map(d => loadDomain(d.id)))
    // Spread questions evenly across domains, exam-level only (Foundation + Intermediate).
    const per = Math.ceil(this.size / domains.length)
    return shuffle(domains.flatMap(d => shuffle(d.questions.filter(q => q.level !== 'Advanced')).slice(0, per))).slice(0, this.size)
  },
  groupOf: q => q.id.split('-')[0],
  groupLabel: g => index.find(x => x.prefix === g)?.title || g,
}
const CCAR_MOCK = {
  key: 'ccar', title: 'CCAR-F Mock exam', size: ccar.questions.length, minutes: ccar.questions.length * 2, target: 80,
  intro: `All ${ccar.questions.length} questions from Practice Exams 1 and 2 in the PDF, in random order, ${ccar.questions.length * 2} minutes (the PDF's rule: 2 minutes per question). "Choose 2" questions score only if both correct answers are picked. You only see right and wrong answers at the end.`,
  targetNote: '(According to the PDF, 80%+ means you are ready to book the exam. The real exam is 60 questions in 120 minutes; we have 40 questions.)',
  async pick() { return shuffle(ccar.questions) },
  groupOf: q => 'D' + q.domain,
  groupLabel: g => `Domain ${g.slice(1)}: ${CCAR_DOMAINS[g.slice(1)]}`,
}

export default function Exam({ route }) {
  const [, sub] = route
  if (sub === 'mock') return <Mock key="nca" config={NCA_MOCK} />
  if (sub === 'ccar-mock') return <Mock key="ccar" config={CCAR_MOCK} />
  if (sub && allDomains.find(d => d.id === sub)) return <DomainPractice key={sub} domainId={sub} />
  return <ExamHome />
}

function ExamHome() {
  const [answers] = useAnswers()
  const total = index.reduce((s, d) => s + d.count, 0)
  const ncaPrefixes = index.map(d => d.prefix)
  const mineNca = Object.entries(answers).filter(([id]) => ncaPrefixes.includes(id.split('-')[0])).map(([, v]) => v)
  const correct = mineNca.filter(a => a.ok).length
  const ccarMine = Object.entries(answers).filter(([id]) => id.startsWith('CCAR-'))
  const ccarOk = ccarMine.filter(([, v]) => v.ok).length
  return (
    <div className="stack-lg">
      <section className="stack">
        <div className="crumbs"><a href="#/">Home</a><span>/</span><span>Exam practice</span></div>
        <div className="eyebrow">NVIDIA NCA-GENL · Unofficial practice</div>
        <h1>NCA-GENL Exam Practice</h1>
        <p>All {total.toLocaleString()} questions from your Question Bank v2 are here. Every question tests a different concept. Pick an answer, then read the explanation.</p>
        <p className="muted">The real exam: 50-60 questions in 60 minutes. To get ready, do Foundation and Intermediate first. Advanced is only if you want to go deeper. Claude Certified Architect (CCAR-F) questions are further down.</p>
        <div className="stats">
          <div className="stat"><b>{mineNca.length}</b><small>Answered</small></div>
          <div className="stat"><b>{mineNca.length ? Math.round((correct / mineNca.length) * 100) : 0}%</b><small>Correct</small></div>
          <div className="stat"><b>{total - mineNca.length}</b><small>Remaining</small></div>
        </div>
        <div className="progress-bar"><div style={{ width: (mineNca.length / total) * 100 + '%' }} /></div>
        <div><a className="btn primary" href="#/exam/mock">⏱ Take a mock exam ({NCA_MOCK.size} questions, {NCA_MOCK.minutes} minutes)</a></div>
      </section>
      <section className="stack">
        <h2>Exam domains</h2>
        <div className="phase-grid">
          {index.map(d => {
            const prefix = d.prefix
            const mine = Object.entries(answers).filter(([id]) => id.startsWith(prefix + '-'))
            const ok = mine.filter(([, v]) => v.ok).length
            return (
              <a key={d.id} href={`#/exam/${d.id}`} className="phase-card">
                <div className="top"><span className="eyebrow">Domain {d.num} · {prefix}</span>
                  {mine.length > 0 && <span className="chip done">{Math.round((ok / mine.length) * 100)}% correct</span>}</div>
                <h3>{d.title}</h3>
                <div className="meta">{LEVELS.map((l, i) => <span key={l}>{LEVEL_NAMES[l]} {d.levels[i]}</span>)}</div>
                <div className="progress-bar"><div style={{ width: (mine.length / d.count) * 100 + '%' }} /></div>
                <span className="muted num" style={{ fontSize: '0.8rem' }}>{mine.length}/{d.count} done</span>
              </a>
            )
          })}
        </div>
      </section>
      <section className="stack">
        <div className="eyebrow">Claude Certified Architect – Foundations</div>
        <h2>CCAR-F Practice Exams</h2>
        <p>Practice Exams 1 and 2 from the study PDF: {ccarMeta.count} questions with explanations. 3 questions are "choose 2" (they score only if both are right). Every question links to the lesson that teaches it.</p>
        <div className="phase-grid">
          <a href={`#/exam/${ccarMeta.id}`} className="phase-card">
            <div className="top"><span className="eyebrow">CCAR-F · {ccarMeta.prefix}</span>
              {ccarMine.length > 0 && <span className="chip done">{Math.round((ccarOk / ccarMine.length) * 100)}% correct</span>}</div>
            <h3>{ccarMeta.title}</h3>
            <div className="meta">{ccarMeta.levelNames.map((n, i) => <span key={n}>{n} · {ccarMeta.levels[i]}</span>)}</div>
            <div className="progress-bar"><div style={{ width: (ccarMine.length / ccarMeta.count) * 100 + '%' }} /></div>
            <span className="muted num" style={{ fontSize: '0.8rem' }}>{ccarMine.length}/{ccarMeta.count} done</span>
          </a>
        </div>
        <div><a className="btn primary" href="#/exam/ccar-mock">⏱ CCAR-F mock exam ({CCAR_MOCK.size} questions, {CCAR_MOCK.minutes} minutes)</a></div>
      </section>
    </div>
  )
}

function Question({ q, picked, onPick, reveal = true, number, showLesson = true }) {
  const multi = isMulti(q), need = needed(q)
  const [sel, setSel] = useState([])
  const show = reveal && picked !== undefined
  const lesson = showLesson && lessonFor[q.id]
  const chosen = Array.isArray(picked) ? picked : (picked === undefined || picked === -1 ? [] : [picked])
  const right = correctSet(q)
  const ok = isCorrect(q, picked)

  const click = i => {
    if (!multi) return onPick(i)
    if (reveal) setSel(s => toggle(s, i, need))
    else onPick(toggle(chosen, i, need))
  }
  const pressed = i => (reveal ? sel.includes(i) : chosen.includes(i))

  return (
    <div className="q">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="eyebrow">{number ? number + ' · ' : ''}{q.id} · {q.topic}</span>
        <span className="chip" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{levelLabel(q.level)}</span>
      </div>
      <Md text={q.q} />
      {multi && <p className="muted" style={{ fontSize: '0.9rem' }}>Choose {need} correct answers. It scores only if all are right.</p>}
      <div className="opts">
        {q.options.map((o, i) => {
          let cls = ''
          if (show && right.includes(i)) cls = 'right'
          else if (show && chosen.includes(i)) cls = 'wrong'
          return (
            <button type="button" key={i} className={cls} aria-pressed={multi && !show ? pressed(i) : (!multi && !reveal ? chosen.includes(i) : undefined)}
              onClick={() => click(i)} disabled={reveal && picked !== undefined}>
              <strong>{'ABCDE'[i]}.</strong>&nbsp;<span><Inline text={o} /></span>
            </button>
          )
        })}
      </div>
      {multi && reveal && !show && (
        <div><button type="button" className="primary" disabled={sel.length !== need} onClick={() => onPick(sel)}>Check answer ({sel.length}/{need})</button></div>
      )}
      {show && (
        <div className={'status ' + (ok ? 'good' : 'bad')}>
          <strong>{ok ? '✓ Correct! ' : `✗ Wrong. The right answer is ${correctLetters(q)}. `}</strong>
          <Md text={q.why} />
        </div>
      )}
      {show && lesson && (
        <p style={{ fontSize: '0.92rem' }}>📖 Learn this concept: <a href={`#/p/${lesson.phase.id}/${lesson.id}`}>{lesson.phase.title} → {lesson.title}</a></p>
      )}
    </div>
  )
}

function DomainPractice({ domainId }) {
  const meta = allDomains.find(d => d.id === domainId)
  const levels = meta.levelNames || LEVELS
  const [data, setData] = useState(null)
  const [answers, setAnswers] = useAnswers()
  const [level, setLevel] = useState(levels[0])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [pos, setPos] = useState(0)

  useEffect(() => { setData(null); loadDomain(domainId).then(setData) }, [domainId])

  const list = useMemo(() => {
    if (!data) return []
    const s = search.trim().toLowerCase()
    return data.questions.filter(q =>
      (level === 'All' || q.level === level) &&
      (filter === 'all' || (filter === 'new' && !answers[q.id]) || (filter === 'wrong' && answers[q.id] && !answers[q.id].ok)) &&
      (!s || q.topic.toLowerCase().includes(s) || q.q.toLowerCase().includes(s)))
  }, [data, level, filter, search])  // answers deliberately excluded so the list doesn't shift while answering

  useEffect(() => setPos(0), [level, filter, search])

  if (!data) return <p className="muted">Loading...</p>
  const q = list[Math.min(pos, list.length - 1)]
  const pick = v => setAnswers(a => ({ ...a, [q.id]: record(q, v) }))
  const related = meta.related.map(findPhase).filter(Boolean)
  const isCcar = meta.prefix === 'CCAR'

  return (
    <div className="stack-lg">
      <section className="stack">
        <div className="crumbs"><a href="#/">Home</a><span>/</span><a href="#/exam">Exam practice</a><span>/</span><span>{meta.prefix}</span></div>
        <div className="eyebrow">{isCcar ? 'Claude Certified Architect – Foundations' : `Domain ${meta.num}`}</div>
        <h1>{meta.title}</h1>
        {related.length > 0 && (
          <p className="muted">It's easier if you read these lessons first: {related.map((p, i) => (
            <React.Fragment key={p.id}>{i ? ', ' : ''}<a href={`#/p/${p.id}`}>{p.title}</a></React.Fragment>))}</p>
        )}
        <div className="controls">
          <div className="ctrl">
            <label htmlFor="exam-level">{isCcar ? 'Practice exam' : 'Level'}</label>
            <select id="exam-level" value={level} onChange={e => setLevel(e.target.value)}>
              {levels.map(l => <option key={l} value={l}>{levelLabel(l)}</option>)}
              <option value="All">{isCcar ? 'Both exams' : 'All levels'}</option>
            </select>
          </div>
          <div className="ctrl">
            <label htmlFor="exam-filter">Show</label>
            <select id="exam-filter" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="new">Not done yet</option>
              <option value="wrong">Only the ones I got wrong (review)</option>
            </select>
          </div>
          <div className="ctrl">
            <label htmlFor="exam-search">Topic search</label>
            <input type="search" id="exam-search" placeholder={isCcar ? 'e.g. hooks, Batches, escalation' : 'e.g. KV cache, Triton'} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </section>

      {!q ? (
        <div className="status">No questions match this filter. {filter === 'wrong' ? 'You have no wrong answers. Great!' : ''}</div>
      ) : (
        <section className="lab">
          <Question key={q.id + (answers[q.id] ? '-done' : '-new')} q={q} picked={answers[q.id]?.pick} onPick={pick} number={`${pos + 1}/${list.length}`} />
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button type="button" onClick={() => setPos(p => Math.max(0, p - 1))} disabled={pos === 0}>← Previous</button>
            {answers[q.id] && <button type="button" className="ghost" onClick={() => setAnswers(a => { const n = { ...a }; delete n[q.id]; return n })}>Try again</button>}
            <button type="button" className="primary" onClick={() => setPos(p => Math.min(list.length - 1, p + 1))} disabled={pos >= list.length - 1}>Next →</button>
          </div>
        </section>
      )}

      {list.length > 0 && (
        <section className="stack">
          <h3>Questions in this list</h3>
          <div className="row" style={{ gap: 6 }}>
            {list.map((x, i) => {
              const a = answers[x.id]
              const bg = !a ? 'var(--surface)' : a.ok ? 'var(--good-soft)' : 'var(--warn-soft)'
              return <button type="button" key={x.id} title={x.topic} onClick={() => setPos(i)}
                style={{ padding: '2px 8px', fontSize: '0.75rem', background: bg, borderColor: i === pos ? 'var(--accent)' : undefined }}
                className="num">{x.id.split('-')[1]}</button>
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function Mock({ config }) {
  const [qs, setQs] = useState(null)
  const [picks, setPicks] = useState({})
  const [pos, setPos] = useState(0)
  const [start, setStart] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [done, setDone] = useState(false)

  const begin = async () => {
    const chosen = await config.pick()
    setQs(chosen); setPicks({}); setPos(0); setDone(false); setStart(Date.now()); setNow(Date.now())
  }

  useEffect(() => {
    if (!start || done) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [start, done])

  const total = config.minutes * 60
  const left = start ? Math.max(0, total - Math.floor((now - start) / 1000)) : total
  useEffect(() => { if (start && left === 0) setDone(true) }, [left, start])

  if (!qs) {
    return (
      <div className="stack">
        <div className="crumbs"><a href="#/exam">Exam practice</a><span>/</span><span>{config.title}</span></div>
        <h1>{config.title}</h1>
        <p>{config.intro}</p>
        <div><button type="button" className="primary" onClick={begin}>Start</button></div>
      </div>
    )
  }

  const score = qs.filter(q => isCorrect(q, picks[q.id])).length
  const answered = qs.filter(q => answeredValue(picks[q.id])).length
  if (done) {
    const byGroup = {}
    qs.forEach(q => { const g = config.groupOf(q); byGroup[g] ||= [0, 0]; byGroup[g][1]++; if (isCorrect(q, picks[q.id])) byGroup[g][0]++ })
    const wrong = qs.filter(q => !isCorrect(q, picks[q.id]))
    const pct = Math.round((score / qs.length) * 100)
    return (
      <div className="stack-lg">
        <section className="stack">
          <h1>Result: {score} / {qs.length} ({pct}%)</h1>
          <div className={'status ' + (pct >= config.target ? 'good' : 'warn')}>
            {pct >= config.target ? 'Great! Keep this level.' : 'A bit more practice needed. Read the wrong answers below carefully.'} {config.targetNote}
          </div>
          <div className="table-wrap"><table>
            <thead><tr><th>Domain</th><th>Correct</th></tr></thead>
            <tbody>{Object.entries(byGroup).sort(([a], [b]) => a.localeCompare(b)).map(([g, [c, t]]) => (
              <tr key={g}><td>{config.groupLabel(g)}</td><td className="num">{c}/{t}</td></tr>
            ))}</tbody>
          </table></div>
          <div className="row"><button type="button" className="primary" onClick={begin}>New mock exam</button><a className="btn" href="#/exam">Back to exam practice</a></div>
        </section>
        {wrong.length > 0 && (
          <section className="stack">
            <h2>Questions you got wrong ({wrong.length})</h2>
            {wrong.map(q => <div className="lab" key={q.id}><Question q={q} picked={picks[q.id] ?? -1} onPick={() => {}} /></div>)}
          </section>
        )}
      </div>
    )
  }

  const q = qs[pos]
  const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0')
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="eyebrow">{config.title} · Question {pos + 1}/{qs.length}</span>
        <span className="readout"><b className={left < 300 ? 'bad' : ''} style={{ fontSize: '1.4rem' }}>⏱ {mm}:{ss}</b></span>
      </div>
      <div className="progress-bar"><div style={{ width: (answered / qs.length) * 100 + '%', background: 'var(--accent)' }} /></div>
      <div className="lab">
        <Question key={q.id} q={q} picked={picks[q.id]} reveal={false} onPick={v => setPicks(p => ({ ...p, [q.id]: v }))} />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button type="button" onClick={() => setPos(p => Math.max(0, p - 1))} disabled={pos === 0}>← Previous</button>
          {pos < qs.length - 1
            ? <button type="button" className="primary" onClick={() => setPos(p => p + 1)}>Next →</button>
            : <button type="button" className="primary" onClick={() => setDone(true)}>Submit</button>}
        </div>
      </div>
      <div className="row" style={{ gap: 6 }}>
        {qs.map((x, i) => (
          <button type="button" key={x.id} onClick={() => setPos(i)} className="num"
            style={{ padding: '2px 8px', fontSize: '0.75rem', background: answeredValue(picks[x.id]) ? 'var(--accent-soft)' : 'var(--surface)', borderColor: i === pos ? 'var(--accent)' : undefined }}>{i + 1}</button>
        ))}
      </div>
      <p className="muted" style={{ fontSize: '0.85rem' }}>Answered: {answered}/{qs.length}. <button type="button" className="ghost" onClick={() => setDone(true)}>Submit now</button></p>
    </div>
  )
}
