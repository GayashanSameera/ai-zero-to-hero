import React, { useMemo, useState, useEffect } from 'react'
import { phases, findPhase, allTopics, topicKey } from './content/index.js'
import { labs } from './labs/index.js'
import { useHashRoute, useStoredState, useUser } from './hooks.js'
import { supabase, sendLoginLink, signOut } from './sync.js'
import { CodeBlock, Quiz } from './components/Common.jsx'
import Exam, { TopicExamQuestions } from './components/Exam.jsx'

// Suggested order for someone who wants results first and maths only when needed.
const PATH = [
  ['programming', 'Python සහ මූලික tools ඉගෙන ගන්න. මේක නැතුව අනිත් දේවල් කරන්න අමාරුයි.'],
  ['data-science', 'Data එක්ක වැඩ කරන්න පුරුදු වෙන්න: Pandas, charts, cleaning.'],
  ['ml', 'Machine Learning වල මූලික අදහස. Labs ටික අනිවාර්යයෙන්ම කරන්න.'],
  ['math', 'මෙතනින් පස්සේ maths කොටස reference එකක් විදිහට පාවිච්චි කරන්න. තේරෙන්නේ නැති තැනක් ආවොත් විතරක් බලන්න.'],
  ['deep-learning', 'Neural networks: knobs ගොඩක් එකට වැඩ කරන විදිහ.'],
  ['nlp', 'Computer එකට භාෂාව තේරෙන විදිහ.'],
  ['llm', 'ChatGPT, Claude වගේ LLMs ඇතුළේ වෙන්නේ මොකක්ද.'],
  ['genai', 'Prompts, RAG, agents: ඇත්ත apps හදන්න.'],
  ['mlops', 'ඔයා හදපු දේ ලෝකයට deploy කරන්න.'],
  ['advanced', 'Hero level: research, RL, scaling.'],
]

// NCA-GENL deep-dive track: one phase per exam domain, each linked to its exam questions.
const EXAM_PATH = [
  ['ml-deep-dive', 'Domain 01: ML fundamentals සහ exam calculations.'],
  ['architecture', 'Domain 02: Transformer එක ඇතුළේ හැම කෑල්ලක්ම.'],
  ['inference', 'Domain 03: Tokens, decoding, සහ model එකක් serve කරන විදිහ.'],
  ['prompting-agents', 'Domain 04: Prompts, LLM හැසිරීම සහ agents.'],
  ['rag-deep-dive', 'Domain 05: Embeddings, vector search සහ production RAG.'],
  ['training', 'Domain 06: Fine-tuning, alignment සහ distributed training.'],
  ['evaluation', 'Domain 07: Benchmarks, metrics සහ A/B testing.'],
  ['nvidia', 'Domain 08: NVIDIA GPUs, Triton, TensorRT-LLM, NIM, NeMo.'],
  ['trustworthy', 'Domain 09: Fairness, privacy, security, guardrails, governance.'],
]

// Other NVIDIA certifications and hands-on skills from the study-topics document.
const CERT_PATH = [
  ['cert-practical', 'Certifications map, NCA-GENL exam guide, සහ hands-on skills.'],
  ['claude-agents-tools', 'CCAR-F Domain 1-2: agent loop, subagents, hooks, tool design, MCP.'],
  ['claude-code-reliability', 'CCAR-F Domain 3-5: Claude Code config, structured output, batches, context, reliability.'],
  ['agentic-ai', 'NCP-AAI: production වල agents (ඔයාගේ ප්‍රධාන ඉලක්කය).'],
  ['ai-infrastructure', 'NCA-AIIO: GPUs, data centers, networking, Kubernetes, Slurm, AWS.'],
  ['multimodal', 'NCA-GENM: images, audio, video, CLIP, diffusion, U-Net.'],
  ['accelerated-data-science', 'NCA-ADS: RAPIDS, cuDF, Dask, cuML, cuGraph.'],
]

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

function Sidebar({ open, route, learned, toggleTheme }) {
  const [section, phaseId, topicId] = route
  return (
    <nav className={'sidebar' + (open ? ' open' : '')} aria-label="Roadmap">
      <div className="brand">
        <a href="#/">AI <span>Zero → Hero</span></a>
        <button type="button" className="ghost" onClick={toggleTheme} title="Light / Dark">◐</button>
      </div>
      <div className="nav-links">
        <a href="#/" className={!section ? 'active' : ''}>🏠 මුල් පිටුව</a>
        <a href="#/glossary" className={section === 'glossary' ? 'active' : ''}>🔎 වචන හොයන්න (Glossary)</a>
        <a href="#/exam" className={section === 'exam' ? 'active' : ''}>📝 Exam Practice (NCA-GENL + CCAR-F)</a>
      </div>
      <Account />
      <div className="nav-label">Roadmap</div>
      <div className="nav-links">
        {phases.map(p => {
          const { done, total } = phaseProgress(p, learned)
          const active = section === 'p' && phaseId === p.id
          return (
            <div key={p.id}>
              <a href={`#/p/${p.id}`} className={'phase-link' + (active && !topicId ? ' active' : '')}>
                <span className={'phase-num' + (total && done === total ? ' done' : '')}>{done === total && total ? '✓' : p.number}</span>
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
        })}
      </div>
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
      <span className="muted">ඕනෑම device එකකින් progress බලන්න email එකෙන් sign in වෙන්න.</span>
      <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit" className="primary" disabled={status === 'sending'}>Email login link</button>
      {status === 'sent' && <span className="muted">Inbox එක බලන්න, link එක click කරන්න.</span>}
      {status && status !== 'sent' && status !== 'sending' && <span className="error">{status}</span>}
    </form>
  )
}

function Home({ learned, scores }) {
  const totalTopics = allTopics.length
  const doneTopics = allTopics.filter(t => learned[topicKey(t.phase.id, t.id)]).length
  const labCount = allTopics.filter(t => t.lab && labs[t.lab]).length
  const termCount = allTopics.reduce((s, t) => s + (t.terms?.length || 0) + 1, 0)
  const pct = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0
  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="eyebrow">Data Science · ML · Deep Learning · LLMs · GenAI</div>
        <h1>AI Zero to Hero</h1>
        <p>Maths ගැන බය වෙන්න එපා. මෙතන හැම concept එකක්ම සරල සිංහලෙන්, එදිනෙදා උදාහරණ එක්ක පැහැදිලි කරලා තියෙනවා. Technical වචන English වලින්ම තියෙනවා, මොකද වැඩ කරද්දී ඔයාට ඕනේ වෙන්නේ ඒවාමයි.</p>
        <p className="muted">හැම topic එකක්ම කියවලා, lab එක සෙල්ලම් කරලා, "ඉගෙන ගත්තා" කියලා mark කරන්න. ඔයාගේ progress මේ computer එකේ save වෙනවා.</p>
        <div className="stats">
          <div className="stat"><b>{phases.length}</b><small>Phases</small></div>
          <div className="stat"><b>{totalTopics}</b><small>Topics</small></div>
          <div className="stat"><b>{termCount}</b><small>Concepts</small></div>
          <div className="stat"><b>{labCount}</b><small>Interactive labs</small></div>
          <div className="stat"><b>{pct}%</b><small>ඔයාගේ progress</small></div>
        </div>
        <div className="progress-bar" aria-label={`Progress ${pct}%`}><div style={{ width: pct + '%' }} /></div>
      </section>

      <section className="callout box example">
        <h3>📝 NVIDIA NCA-GENL exam එකට ලෑස්ති වෙනවද?</h3>
        <p>ඔයාගේ Question Bank v2 එකේ ප්‍රශ්න 1,350ම explanations එක්ක, සහ 60-ප්‍රශ්න timed mock exam එකක් <a href="#/exam">Exam Practice</a> එකේ තියෙනවා. Claude Certified Architect (CCAR-F) ප්‍රශ්න 40ක් සහ ඒ සඳහා <a href="#/exam/ccar-mock">mock exam එකකුත්</a> තියෙනවා.</p>
      </section>

      <section className="stack">
        <h2>Roadmap එක</h2>
        <div className="phase-grid">
          {phases.map(p => {
            const { done, total } = phaseProgress(p, learned)
            const labsHere = p.topics.filter(t => t.lab && labs[t.lab]).length
            return (
              <a key={p.id} href={`#/p/${p.id}`} className="phase-card">
                <div className="top">
                  <span className="eyebrow">Phase {p.number}</span>
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
          })}
        </div>
      </section>

      <PathSection title="Maths වලට කැමති නැත්නම් යන්න හොඳම පාර"
        intro="Roadmap එකේ අංක පිළිවෙළට යන්න ඕනේ නෑ. මේ පිළිවෙළ ඔයාට ලේසියි:" items={PATH} />
      <PathSection title="NCA-GENL Deep-Dive Track"
        intro="මූලික phases ඉවර කළාට පස්සේ, exam domain එකකට එක phase එක බැගින්. හැම topic එකකම අන්තිමට ඒකට අදාළ exam ප්‍රශ්න තියෙනවා."
        items={EXAM_PATH} />
      <PathSection title="NCA-GENL වලින් එහාට: අනිත් NVIDIA Certifications"
        intro="ඔයාගේ path එක: NCA-GENL → Claude Certified Architect (CCAR-F) → NCP-AAI → (optional) NCA-AIIO. අනිත් ඒවා ඕනේ නම් විතරක්."
        items={CERT_PATH} />

      <section className="stack">
        <h2>හොඳටම ඉගෙන ගන්න රහස</h2>
        <div className="box keys">
          <ul>
            <li><strong>කියවන්න → Lab එක කරන්න → Quiz එක කරන්න.</strong> කියවලා විතරක් මතක හිටින්නේ නෑ.</li>
            <li>AI එකකට code ලියන්න කියන්න පුළුවන්. ඒත් ඒ code එක <strong>run කරලා, එක අංකයක් වෙනස් කරලා</strong> මොකද වෙන්නේ කියලා බලන්න.</li>
            <li>හැම phase එකකටම පස්සේ පොඩි project එකක් GitHub එකට දාන්න.</li>
            <li>දවසට පැය 2-3ක් දුන්නොත් මාස 10-12කින් හොඳ මට්ටමකට එන්න පුළුවන්.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

function PhasePage({ phase, learned, scores, setScores }) {
  const { done, total } = phaseProgress(phase, learned)
  return (
    <div className="stack-lg">
      <section className="stack">
        <div className="crumbs"><a href="#/">මුල් පිටුව</a><span>/</span><span>Phase {phase.number}</span></div>
        <div className="eyebrow">Phase {phase.number}{phase.duration ? ` · ${phase.duration}` : ''}</div>
        <h1>{phase.title}</h1>
        {phase.titleSi && <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{phase.titleSi}</p>}
        <p>{phase.summary}</p>
        <div className="row">
          <div className="progress-bar" style={{ flex: 1, minWidth: 160 }}><div style={{ width: (total ? (done / total) * 100 : 0) + '%' }} /></div>
          <span className="muted num" style={{ fontSize: '0.85rem' }}>{done}/{total} ඉගෙන ගත්තා</span>
        </div>
        {phase.topics[0] && <div><a className="btn primary" href={`#/p/${phase.id}/${phase.topics[0].id}`}>පටන් ගන්න →</a></div>}
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
                {isDone ? <span className="chip done">✓ ඉවරයි</span> : t.lab && labs[t.lab] ? <span className="chip">Lab</span> : <span />}
              </a>
            )
          })}
        </div>
      </section>

      {phase.quiz?.length > 0 && (
        <section className="stack">
          <div className="eyebrow">Check yourself</div>
          <h2>Phase {phase.number} Quiz</h2>
          {scores[phase.id] !== undefined && <p className="muted">කලින් ලකුණු: {scores[phase.id]} / {phase.quiz.length}</p>}
          <Quiz items={phase.quiz} onFinish={n => setScores(s => ({ ...s, [phase.id]: n }))} />
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
  return (
    <article className="stack-lg">
      <section className="stack">
        <div className="crumbs">
          <a href="#/">මුල් පිටුව</a><span>/</span>
          <a href={`#/p/${phase.id}`}>Phase {phase.number}: {phase.title}</a>
        </div>
        <div className="eyebrow">Topic {idx + 1} / {phase.topics.length}</div>
        <h1>{topic.title}</h1>
        <div className="prose">
          {topic.body?.map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </section>

      {(topic.analogy || topic.example) && (
        <section className="stack">
          {topic.analogy && (
            <div className="box analogy"><h3>💡 සරලව හිතන්න</h3><p>{topic.analogy}</p></div>
          )}
          {topic.example && (
            <div className="box example"><h3>🧪 උදාහරණයක්</h3><p>{topic.example}</p></div>
          )}
        </section>
      )}

      {Lab && (
        <section className="stack">
          <div className="eyebrow" style={{ color: 'var(--warn)' }}>Interactive lab</div>
          <h2>අතින්ම කරලා බලන්න</h2>
          <Lab />
        </section>
      )}

      {topic.code?.src && (
        <section className="stack">
          <h2>Code එකෙන් බැලුවොත්</h2>
          <CodeBlock lang={topic.code.lang} src={topic.code.src} />
        </section>
      )}

      {topic.keyPoints?.length > 0 && (
        <div className="box keys">
          <h3>✅ මතක තියාගන්න</h3>
          <ul>{topic.keyPoints.map((k, i) => <li key={i}>{k}</li>)}</ul>
        </div>
      )}

      {topic.domainChecklist?.length > 0 && (
        <section className="stack">
          <h2>Official exam objectives and lessons</h2>
          <p className="muted">මෙම checklist එක NVIDIA විසින් පළ කළ domain objectives මත පදනම් වේ. එක් එක් objective එක ඉගෙනගන්න සබැඳි lesson තෝරන්න.</p>
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
          <h2>අදාළ වචන</h2>
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
          {isDone ? 'නියමයි! මේක ඉගෙන ගත්තා ✓' : 'මට මේක තේරුණා. "ඉගෙන ගත්තා" කියලා mark කරන්න'}
        </label>
      </div>

      <nav className="pager">
        {prev && <a href={`#/p/${phase.id}/${prev.id}`}><small>← කලින්</small>{prev.title}</a>}
        {next && <a className="next" href={`#/p/${phase.id}/${next.id}`}><small>ඊළඟට →</small>{next.title}</a>}
        {!next && (
          <a className="next" href={`#/p/${phase.id}`}><small>Phase එක ඉවරයි →</small>Quiz එක කරන්න</a>
        )}
      </nav>
      {nextPhase && <p className="muted">ඊළඟ phase එක: <a href={`#/p/${nextPhase.id}`}>{nextPhase.title}</a></p>}
    </article>
  )
}

function Glossary() {
  const [q, setQ] = useState('')
  const entries = useMemo(() => {
    const list = []
    allTopics.forEach(t => {
      list.push({ en: t.title, si: t.keyPoints?.[0] || t.body?.[0] || '', t })
      t.terms?.forEach(x => list.push({ en: x.en, si: x.si, t }))
    })
    return list.sort((a, b) => a.en.localeCompare(b.en))
  }, [])
  const needle = q.trim().toLowerCase()
  const shown = needle ? entries.filter(e => e.en.toLowerCase().includes(needle) || e.si.toLowerCase().includes(needle)) : entries
  return (
    <div className="stack">
      <div className="eyebrow">Glossary</div>
      <h1>වචන හොයන්න</h1>
      <p className="muted">මුළු roadmap එකේම තියෙන concepts {entries.length}ක්. English හෝ සිංහලෙන් search කරන්න.</p>
      <input type="search" id="glossary-search" placeholder="උදා: overfitting, token, attention..." value={q} onChange={e => setQ(e.target.value)} />
      <p className="muted num" style={{ fontSize: '0.85rem' }}>{shown.length} results</p>
      <dl className="gloss-list">
        {shown.slice(0, 300).map((e, i) => (
          <div className="gloss-item" key={e.en + i}>
            <dt>{e.en}</dt>
            <dd>{e.si} <a href={`#/p/${e.t.phase.id}/${e.t.id}`}>→ {e.t.title}</a></dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
