import React, { useMemo, useState, useEffect } from 'react'
import { phases, findPhase, allTopics, topicKey } from './content/index.js'
import { labs } from './labs/index.js'
import { useHashRoute, useStoredState, useUser } from './hooks.js'
import { supabase, sendLoginLink, signOut } from './sync.js'
import { CodeBlock, Quiz } from './components/Common.jsx'
import Markdown, { SiBox } from './components/Markdown.jsx'
import Exam, { TopicExamQuestions } from './components/Exam.jsx'

// The course, grouped into the parts from lesson 00 (Start Here).
const PARTS = [
  ['Part A: Foundations', '6 to 8 weeks', 0, 7],
  ['Part B: Data Science', '3 to 4 weeks', 8, 10],
  ['Part C: Machine Learning', '5 to 6 weeks', 11, 14],
  ['Part D: Deep Learning', '4 to 5 weeks', 15, 17],
  ['Part E: NLP & LLMs', '4 to 6 weeks', 18, 21],
  ['Part F: GenAI Apps', '4 to 5 weeks', 22, 25],
  ['Part G: Production, Safety & Career', '4 to 6 weeks', 26, 31],
]

// NCA-GENL deep-dive track: one phase per exam domain, each linked to its exam questions.
const EXAM_PATH = [
  ['ml-deep-dive', 'Domain 01: ML fundamentals and the calculations the exam asks for.'],
  ['architecture', 'Domain 02: every part of the Transformer, inside and out.'],
  ['inference', 'Domain 03: tokens, decoding, and how a model is served.'],
  ['prompting-agents', 'Domain 04: prompts, LLM behaviour and agents.'],
  ['rag-deep-dive', 'Domain 05: embeddings, vector search and production RAG.'],
  ['training', 'Domain 06: fine-tuning, alignment and distributed training.'],
  ['evaluation', 'Domain 07: benchmarks, metrics and A/B testing.'],
  ['nvidia', 'Domain 08: NVIDIA GPUs, Triton, TensorRT-LLM, NIM, NeMo.'],
  ['trustworthy', 'Domain 09: fairness, privacy, security, guardrails, governance.'],
]

// Other certifications and hands-on skills from the study-topics document.
const CERT_PATH = [
  ['cert-practical', 'Certification map, the NCA-GENL exam guide, and hands-on skills.'],
  ['claude-agents-tools', 'CCAR-F Domains 1-2: agent loop, subagents, hooks, tool design, MCP.'],
  ['claude-code-reliability', 'CCAR-F Domains 3-5: Claude Code config, structured output, batches, context, reliability.'],
  ['agentic-ai', 'NCP-AAI: agents in production (your main target).'],
  ['ai-infrastructure', 'NCA-AIIO: GPUs, data centres, networking, Kubernetes, Slurm, AWS.'],
  ['multimodal', 'NCA-GENM: images, audio, video, CLIP, diffusion, U-Net.'],
  ['accelerated-data-science', 'NCA-ADS: RAPIDS, cuDF, Dask, cuML, cuGraph.'],
]

export default function App() {
  const route = useHashRoute()
  const [learned, setLearned] = useStoredState('learned', {})
  const [scores, setScores] = useStoredState('quizScores', {})
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || '')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [route.join('/')])

  const toggleTheme = () => {
    const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch (e) { /* ignore */ }
    setTheme(next)
  }

  const [section, phaseId, topicId] = route
  let page
  if (section === 'p' && findPhase(phaseId)) {
    const phase = findPhase(phaseId)
    const topic = topicId && phase.topics.find(t => t.id === topicId)
    page = topic
      ? <TopicPage phase={phase} topic={topic} learned={learned} setLearned={setLearned} />
      : <PhasePage phase={phase} learned={learned} scores={scores} setScores={setScores} />
  } else if (section === 'glossary') {
    page = <Glossary />
  } else if (section === 'exam') {
    page = <Exam route={route} />
  } else {
    page = <Home learned={learned} scores={scores} />
  }

  return (
    <div className="shell">
      <div className="topbar">
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Menu">☰ Menu</button>
        <strong>AI Zero to Hero</strong>
        <button type="button" className="ghost" onClick={toggleTheme} aria-label="Theme">◐</button>
      </div>
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}
      <Sidebar open={menuOpen} route={route} learned={learned} toggleTheme={toggleTheme} />
      <main className="main">
        <div className="content">{page}</div>
      </main>
    </div>
  )
}

function phaseProgress(phase, learned) {
  const done = phase.topics.filter(t => learned[topicKey(phase.id, t.id)]).length
  return { done, total: phase.topics.length }
}

const shortNum = p => (p.track === 'cert' ? p.label.replace('Exam guide ', 'E') : p.number)

function Sidebar({ open, route, learned, toggleTheme }) {
  const [section, phaseId, topicId] = route
  const link = p => {
    const { done, total } = phaseProgress(p, learned)
    const active = section === 'p' && phaseId === p.id
    return (
      <div key={p.id}>
        <a href={`#/p/${p.id}`} className={'phase-link' + (active && !topicId ? ' active' : '')}>
          <span className={'phase-num' + (total && done === total ? ' done' : '')}>{done === total && total ? '✓' : shortNum(p)}</span>
          <span className="grow">{p.title}<small>{done}/{total} topics</small></span>
        </a>
        {active && (
          <div className="topic-list">
            {p.topics.map(t => (
              <a key={t.id} href={`#/p/${p.id}/${t.id}`} className={topicId === t.id ? 'active' : ''}>
                {learned[topicKey(p.id, t.id)] ? <span className="tick">✓</span> : null}
                <span>{t.title}</span>
                {t.lab && labs[t.lab] ? <span className="lab-dot" title="Interactive lab" /> : null}
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }
  return (
    <nav className={'sidebar' + (open ? ' open' : '')} aria-label="Roadmap">
      <div className="brand">
        <a href="#/">AI <span>Zero → Hero</span></a>
        <button type="button" className="ghost" onClick={toggleTheme} title="Light / Dark">◐</button>
      </div>
      <div className="nav-links">
        <a href="#/" className={!section ? 'active' : ''}>🏠 Home</a>
        <a href="#/glossary" className={section === 'glossary' ? 'active' : ''}>🔎 Search terms (Glossary)</a>
        <a href="#/exam" className={section === 'exam' ? 'active' : ''}>📝 Exam Practice (NCA-GENL + CCAR-F)</a>
      </div>
      <Account />
      <div className="nav-label">The course</div>
      <div className="nav-links">{phases.filter(p => p.track === 'course').map(link)}</div>
      <div className="nav-label">Exam guides</div>
      <div className="nav-links">{phases.filter(p => p.track === 'cert').map(link)}</div>
    </nav>
  )
}

function Account() {
  const user = useUser()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  if (!supabase) return null

  if (user) {
    return (
      <div className="account">
        <span className="muted">☁️ Progress sync: <strong>{user.email}</strong></span>
        <button type="button" onClick={signOut}>Sign out</button>
      </div>
    )
  }

  const submit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendLoginLink(email.trim())
      setStatus('sent')
    } catch (err) {
      setStatus(err.message)
    }
  }
  return (
    <form className="account" onSubmit={submit}>
      <span className="muted">Sign in with your email to see your progress on any device.</span>
      <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit" className="primary" disabled={status === 'sending'}>Email login link</button>
      {status === 'sent' && <span className="muted">Check your inbox and click the link.</span>}
      {status && status !== 'sent' && status !== 'sending' && <span className="error">{status}</span>}
    </form>
  )
}

function PhaseCard({ p, learned, scores }) {
  const { done, total } = phaseProgress(p, learned)
  const labsHere = p.topics.filter(t => t.lab && labs[t.lab]).length
  return (
    <a href={`#/p/${p.id}`} className="phase-card">
      <div className="top">
        <span className="eyebrow">{p.label}</span>
        {scores[p.id] !== undefined && <span className="chip done">Quiz {scores[p.id]}/{p.quiz?.length}</span>}
      </div>
      <h3>{p.title}</h3>
      <p>{p.summary}</p>
      <div className="meta">
        <span>{total} topics</span>
        {labsHere > 0 && <span>{labsHere} labs</span>}
        {p.duration && <span>{p.duration}</span>}
      </div>
      <div className="progress-bar"><div style={{ width: (total ? (done / total) * 100 : 0) + '%' }} /></div>
    </a>
  )
}

function PathSection({ title, intro, items }) {
  const shown = items.filter(([id]) => findPhase(id))
  if (!shown.length) return null
  return (
    <section className="stack">
      <h2>{title}</h2>
      {intro && <p className="muted">{intro}</p>}
      <ol className="path">
        {shown.map(([id, why]) => {
          const p = findPhase(id)
          return (
            <li key={id}>
              <div>
                <a href={`#/p/${id}`}><strong>{p.title}</strong></a>
                <p className="muted" style={{ fontSize: '0.93rem' }}>{why}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function Home({ learned, scores }) {
  const totalTopics = allTopics.length
  const doneTopics = allTopics.filter(t => learned[topicKey(t.phase.id, t.id)]).length
  const labCount = allTopics.filter(t => t.lab && labs[t.lab]).length
  const pct = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0
  const course = phases.filter(p => p.track === 'course')
  const certs = phases.filter(p => p.track === 'cert')
  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="eyebrow">Data Science · ML · Deep Learning · LLMs · GenAI</div>
        <h1>AI Zero to Hero</h1>
        <p>No need to be scared of maths. Every concept here is explained in plain English, step by step, with everyday examples and worked numbers. Under each idea there is an orange <strong>සිංහලෙන්</strong> box that explains it again in simple Sinhala.</p>
        <p className="muted">Read each topic, play with the lab, then mark it as learned. Your progress is saved on this computer (and synced if you sign in).</p>
        <div className="stats">
          <div className="stat"><b>{course.length}</b><small>Lessons</small></div>
          <div className="stat"><b>{certs.length}</b><small>Exam guides</small></div>
          <div className="stat"><b>{totalTopics}</b><small>Topics</small></div>
          <div className="stat"><b>{labCount}</b><small>Interactive labs</small></div>
          <div className="stat"><b>{pct}%</b><small>Your progress</small></div>
        </div>
        <div className="progress-bar" aria-label={`Progress ${pct}%`}><div style={{ width: pct + '%' }} /></div>
      </section>

      <section className="callout box example">
        <h3>📝 Preparing for the NVIDIA NCA-GENL exam?</h3>
        <p>All 1,350 questions from your Question Bank v2, with explanations, plus a 60-question timed mock exam, are in <a href="#/exam">Exam Practice</a>. There are also 40 Claude Certified Architect (CCAR-F) questions and a <a href="#/exam/ccar-mock">CCAR-F mock exam</a>.</p>
      </section>

      {PARTS.map(([title, time, from, to]) => {
        const items = course.filter(p => p.number >= from && p.number <= to)
        if (!items.length) return null
        return (
          <section className="stack" key={title}>
            <h2>{title} <span className="muted" style={{ fontSize: '0.9rem', fontWeight: 400 }}>· {time}</span></h2>
            <div className="phase-grid">{items.map(p => <PhaseCard key={p.id} p={p} learned={learned} scores={scores} />)}</div>
          </section>
        )
      })}

      <section className="stack">
        <h2>Exam guides</h2>
        <p className="muted">Deep dives written for the certifications. Do them after the matching course lessons.</p>
        <div className="phase-grid">{certs.map(p => <PhaseCard key={p.id} p={p} learned={learned} scores={scores} />)}</div>
      </section>

      <PathSection title="NCA-GENL Deep-Dive Track"
        intro="After the course, one exam guide per exam domain. Every topic ends with the exam questions that test it."
        items={EXAM_PATH} />
      <PathSection title="Beyond NCA-GENL: other certifications"
        intro="Your path: NCA-GENL → Claude Certified Architect (CCAR-F) → NCP-AAI → (optional) NCA-AIIO. Do the others only if you need them."
        items={CERT_PATH} />

      <section className="stack">
        <h2>The secret to learning this well</h2>
        <div className="box keys">
          <ul>
            <li><strong>Read → do the lab → do the quiz.</strong> Reading alone doesn't stick.</li>
            <li>An AI can write code for you. But <strong>run it, change one number</strong>, and see what happens.</li>
            <li>After every part, put a small project on GitHub.</li>
            <li>With 1 to 2 hours a day you can cover the whole course in about 7 to 9 months.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

function PhasePage({ phase, learned, scores, setScores }) {
  const { done, total } = phaseProgress(phase, learned)
  const isCourse = phase.track === 'course'
  return (
    <div className="stack-lg">
      <section className="stack">
        <div className="crumbs"><a href="#/">Home</a><span>/</span><span>{phase.label}</span></div>
        <div className="eyebrow">{phase.label}{phase.duration ? ` · ${phase.duration}` : ''}</div>
        <h1>{phase.title}</h1>
        {phase.titleSi && <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{phase.titleSi}</p>}
        {isCourse && phase.summary && <p><strong>After this lesson you can:</strong> {phase.summary}</p>}
        {!isCourse && <p>{phase.summary}</p>}
        {isCourse && phase.prereq && <Markdown className="muted" src={`**Before you start:** ${phase.prereq}`} />}
        {isCourse && phase.intro && <Markdown src={phase.intro} />}
        <div className="row">
          <div className="progress-bar" style={{ flex: 1, minWidth: 160 }}><div style={{ width: (total ? (done / total) * 100 : 0) + '%' }} /></div>
          <span className="muted num" style={{ fontSize: '0.85rem' }}>{done}/{total} learned</span>
        </div>
        {phase.topics[0] && <div><a className="btn primary" href={`#/p/${phase.id}/${phase.topics[0].id}`}>Start →</a></div>}
      </section>

      <section className="stack">
        <h2>Topics</h2>
        <div className="topic-cards">
          {phase.topics.map((t, i) => {
            const isDone = learned[topicKey(phase.id, t.id)]
            return (
              <a key={t.id} href={`#/p/${phase.id}/${t.id}`} className="topic-card">
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="t">{t.title}<small>{t.terms?.map(x => x.en).join(' · ')}</small></span>
                {isDone ? <span className="chip done">✓ Done</span> : t.lab && labs[t.lab] ? <span className="chip">Lab</span> : <span />}
              </a>
            )
          })}
        </div>
      </section>

      {phase.quiz?.length > 0 && (
        <section className="stack">
          <div className="eyebrow">Check yourself</div>
          <h2>{phase.label} Quiz</h2>
          {scores[phase.id] !== undefined && <p className="muted">Previous score: {scores[phase.id]} / {phase.quiz.length}</p>}
          <Quiz items={phase.quiz} onFinish={n => setScores(s => ({ ...s, [phase.id]: n }))} />
        </section>
      )}

      {phase.checkYourself && (
        <section className="stack">
          <h2>Check yourself: open questions</h2>
          <p className="muted">Try to answer each one before opening the answer.</p>
          <Markdown src={phase.checkYourself} />
        </section>
      )}

      {phase.newWords && (
        <section className="stack">
          <h2>New words in this lesson</h2>
          <Markdown src={phase.newWords} />
        </section>
      )}

      {phase.englishQuiz?.length > 0 && (
        <section className="stack">
          <div className="eyebrow">English exam practice</div>
          <h2>{phase.englishQuizTitle || 'English Practice Questions'}</h2>
          {phase.englishQuizNote && <p className="muted">{phase.englishQuizNote}</p>}
          {scores[`${phase.id}-english`] !== undefined && (
            <p className="muted">Previous score: {scores[`${phase.id}-english`]} / {phase.englishQuiz.length}</p>
          )}
          <Quiz items={phase.englishQuiz} onFinish={n => setScores(s => ({ ...s, [`${phase.id}-english`]: n }))} />
        </section>
      )}
    </div>
  )
}

function TopicPage({ phase, topic, learned, setLearned }) {
  const idx = phase.topics.indexOf(topic)
  const prev = phase.topics[idx - 1]
  const next = phase.topics[idx + 1]
  const phaseIdx = phases.indexOf(phase)
  const nextPhase = !next && phases[phaseIdx + 1]
  const key = topicKey(phase.id, topic.id)
  const isDone = !!learned[key]
  const Lab = topic.lab && labs[topic.lab]
  useEffect(() => { window.scrollTo(0, 0) }, [key])
  return (
    <article className="stack-lg">
      <section className="stack">
        <div className="crumbs">
          <a href="#/">Home</a><span>/</span>
          <a href={`#/p/${phase.id}`}>{phase.label}: {phase.title}</a>
        </div>
        <div className="eyebrow">Topic {idx + 1} / {phase.topics.length}</div>
        <h1>{topic.title}</h1>
        {topic.md && <Markdown src={topic.md} />}
        {topic.body?.length > 0 && (
          <div className="prose">
            {topic.body.map((para, i) => <p key={i}>{para}</p>)}
          </div>
        )}
        <SiBox text={topic.si} />
      </section>

      {(topic.analogy || topic.example) && (
        <section className="stack">
          {topic.analogy && (
            <div className="box analogy"><h3>💡 Think of it simply</h3><p>{topic.analogy}</p></div>
          )}
          {topic.example && (
            <div className="box example"><h3>🧪 Worked example</h3><p>{topic.example}</p></div>
          )}
        </section>
      )}

      {Lab && (
        <section className="stack">
          <div className="eyebrow" style={{ color: 'var(--warn)' }}>Interactive lab</div>
          <h2>Try it yourself</h2>
          <Lab />
        </section>
      )}

      {topic.code?.src && (
        <section className="stack">
          <h2>In code</h2>
          <CodeBlock lang={topic.code.lang} src={topic.code.src} />
        </section>
      )}

      {topic.keyPoints?.length > 0 && (
        <div className="box keys">
          <h3>✅ Remember</h3>
          <ul>{topic.keyPoints.map((k, i) => <li key={i}>{k}</li>)}</ul>
        </div>
      )}

      {topic.domainChecklist?.length > 0 && (
        <section className="stack">
          <h2>Official exam objectives and lessons</h2>
          <p className="muted">This checklist follows the domain objectives NVIDIA publishes. Pick the linked lesson to study each objective.</p>
          {topic.domainChecklist.map(domain => (
            <div className="box keys" key={domain.name}>
              <h3>{domain.name} ({domain.weight})</h3>
              <ul>
                {domain.objectives.map((objective, i) => (
                  <li key={i}>
                    {objective.text}
                    {objective.lessons?.length > 0 && (
                      <> — {objective.lessons.map((lesson, j) => (
                        <React.Fragment key={lesson.phase + lesson.topic}>
                          {j > 0 && ', '}
                          <a href={`#/p/${lesson.phase}/${lesson.topic}`}>{lesson.label}</a>
                        </React.Fragment>
                      ))}</>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {topic.terms?.length > 0 && (
        <section className="stack">
          <h2>Related terms</h2>
          <dl className="terms">
            {topic.terms.map(t => (
              <div key={t.en}><dt>{t.en}</dt><dd>{t.si}</dd></div>
            ))}
          </dl>
        </section>
      )}

      {topic.resources?.length > 0 && (
        <section className="stack">
          <h2>Official resources and further study</h2>
          <ul>
            {topic.resources.map(resource => (
              <li key={resource.url}>
                <a href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a>
                {resource.description && <span className="muted"> — {resource.description}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {topic.examRefs?.length > 0 && <TopicExamQuestions key={key} refs={topic.examRefs} />}

      <div className={'learned-bar' + (isDone ? ' on' : '')}>
        <label className="check">
          <input type="checkbox" checked={isDone}
            onChange={e => setLearned(l => ({ ...l, [key]: e.target.checked }))} />
          {isDone ? 'Great! Marked as learned ✓' : 'I understand this. Mark it as learned'}
        </label>
      </div>

      <nav className="pager">
        {prev && <a href={`#/p/${phase.id}/${prev.id}`}><small>← Previous</small>{prev.title}</a>}
        {next && <a className="next" href={`#/p/${phase.id}/${next.id}`}><small>Next →</small>{next.title}</a>}
        {!next && (
          <a className="next" href={`#/p/${phase.id}`}><small>Lesson finished →</small>Do the quiz</a>
        )}
      </nav>
      {nextPhase && <p className="muted">Next: <a href={`#/p/${nextPhase.id}`}>{nextPhase.label}: {nextPhase.title}</a></p>}
    </article>
  )
}

function Glossary() {
  const [q, setQ] = useState('')
  const entries = useMemo(() => {
    const list = []
    phases.forEach(p => {
      p.words?.forEach(w => list.push({ en: w.en, meaning: w.meaning, href: `#/p/${p.id}`, where: p.title }))
      p.topics.forEach(t => {
        const href = `#/p/${p.id}/${t.id}`
        if (p.track === 'cert') list.push({ en: t.title, meaning: t.keyPoints?.[0] || '', href, where: t.title })
        t.terms?.forEach(x => list.push({ en: x.en, meaning: x.si, href, where: t.title }))
      })
    })
    return list.sort((a, b) => a.en.localeCompare(b.en))
  }, [])
  const needle = q.trim().toLowerCase()
  const shown = needle ? entries.filter(e => e.en.toLowerCase().includes(needle) || e.meaning.toLowerCase().includes(needle)) : entries
  return (
    <div className="stack">
      <div className="eyebrow">Glossary</div>
      <h1>Search terms</h1>
      <p className="muted">{entries.length} concepts from the whole course and the exam guides. The full A to Z list is in <a href="#/p/glossary">Lesson 31: Glossary</a>.</p>
      <input type="search" id="glossary-search" placeholder="e.g. overfitting, token, attention..." value={q} onChange={e => setQ(e.target.value)} />
      <p className="muted num" style={{ fontSize: '0.85rem' }}>{shown.length} results</p>
      <dl className="gloss-list">
        {shown.slice(0, 300).map((e, i) => (
          <div className="gloss-item" key={e.en + i}>
            <dt>{e.en}</dt>
            <dd>{e.meaning} <a href={e.href}>→ {e.where}</a></dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
