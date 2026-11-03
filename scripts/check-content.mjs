// Content checker for the English site.
// Usage: node scripts/check-content.mjs [--only id1,id2] [--rules rule1,rule2]
// Prints "file: rule: detail" for every problem and exits 1 if there are any.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { pathToFileURL } from 'url'
import { parseLesson } from '../src/lessons/parse.js'
import { LAB_MAP } from '../src/lessons/labMap.js'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1].split(',') : null }
const only = arg('--only')
const rules = arg('--rules')
const wanted = id => !only || only.includes(id)
const on = rule => !rules || rules.includes(rule)

const SI = /[඀-෿]/
const problems = []
const fail = (file, rule, detail) => problems.push(`${file}: ${rule}: ${detail}`)

function checkQuiz(file, quiz) {
  quiz.forEach((item, i) => {
    const ok = item && typeof item.q === 'string' && item.q.trim() && Array.isArray(item.options) &&
      item.options.length >= 3 && item.options.length <= 5 && Number.isInteger(item.answer) &&
      item.answer >= 0 && item.answer < item.options.length && typeof item.why === 'string' && item.why.trim()
    if (!ok) fail(file, 'quiz-json', `item ${i + 1} needs q, 3-5 options, a valid answer index and why`)
  })
}

// Remove Sinhala helper blockquotes (from a "> **සිංහලෙන්:**" line to the end of that blockquote).
function stripSiBoxes(md) {
  const out = []
  let inBox = false
  for (const line of md.split('\n')) {
    if (/^>\s*\*\*සිංහලෙන්:?\*\*/.test(line)) { inBox = true; continue }
    if (inBox && /^>/.test(line)) continue
    inBox = false
    out.push(line)
  }
  return out.join('\n')
}

// ---------- course lessons ----------
const lessonDir = path.join(root, 'src/lessons')
const sourceDir = path.join(root, '../AI-Zero-to-Hero-English')
const topicIds = new Set()
for (const file of fs.readdirSync(lessonDir).filter(f => /^\d\d-.*\.md$/.test(f)).sort()) {
  const md = fs.readFileSync(path.join(lessonDir, file), 'utf8')
  let lesson
  try { lesson = parseLesson(md, file) } catch (e) { fail(file, 'lesson-parse', e.message); continue }
  lesson.topics.forEach(t => topicIds.add(`${lesson.id}/${t.id}`))
  if (!wanted(lesson.id)) continue

  if (on('quiz-json')) checkQuiz(file, lesson.quiz)
  const exempt = lesson.number === 0 || lesson.number === 31
  if (on('lesson-quiz') && !exempt && lesson.quiz.length < 5) fail(file, 'lesson-quiz', `${lesson.quiz.length} quiz questions, need 5-8`)
  if (on('si-box') && !exempt) {
    for (const t of lesson.topics) {
      const words = t.md.split(/\s+/).length
      if (words >= 40 && !/^>\s*\*\*සිංහලෙන්:?\*\*/m.test(t.md)) fail(file, 'si-box', `topic "${t.title}" has no Sinhala box`)
    }
  }
  if (on('si-leak')) {
    stripSiBoxes(md).split('\n').forEach((line, i) => { if (SI.test(line)) fail(file, 'si-leak', `line ${i + 1}: Sinhala outside a Sinhala box`) })
  }
  // Every non-empty line of the owner's English source must still be in the lesson.
  if (on('md-preserved') && fs.existsSync(path.join(sourceDir, file))) {
    const have = new Set(md.split('\n').map(l => l.trim()))
    const src = fs.readFileSync(path.join(sourceDir, file), 'utf8').split('\n').map(l => l.trim()).filter(l => l && !/^-{3,}$/.test(l))
    const missing = src.filter(l => !have.has(l))
    if (missing.length / src.length > 0.03) fail(file, 'md-preserved', `${missing.length} of ${src.length} source lines changed or removed, e.g. "${missing[0].slice(0, 80)}"`)
  }
}
if (on('lab-map')) {
  for (const key of Object.keys(LAB_MAP)) if (!topicIds.has(key)) fail('src/lessons/labMap.js', 'lab-map', `no topic ${key}`)
}

// ---------- certification phases ----------
const baseline = fs.readFileSync(path.join(root, 'scripts/cert-baseline.txt'), 'utf8').trim()
const loadSource = async src => (await import('data:text/javascript,' + encodeURIComponent(src))).default
const shape = p => JSON.stringify({ id: p.id, number: p.number, topics: p.topics.map(t => ({ id: t.id, examRefs: t.examRefs || null })) })

const contentDir = path.join(root, 'src/content')
for (const file of fs.readdirSync(contentDir).filter(f => /^phase.*\.js$/.test(f)).sort()) {
  const rel = `src/content/${file}`
  const phase = (await import(pathToFileURL(path.join(contentDir, file)).href)).default
  if (!wanted(phase.id)) continue

  if (on('cert-ids')) {
    const old = await loadSource(execFileSync('git', ['show', `${baseline}:${rel}`], { cwd: root }).toString('utf8'))
    if (shape(old) !== shape(phase)) fail(rel, 'cert-ids', 'phase id, number, topic ids/order or examRefs changed')
  }
  if (on('quiz-json')) { checkQuiz(rel, phase.quiz || []); checkQuiz(rel, phase.englishQuiz || []) }
  if (on('cert-si')) {
    for (const t of phase.topics) if (!t.si || !SI.test(t.si)) fail(rel, 'cert-si', `topic "${t.id}" has no Sinhala si box`)
  }
  if (on('si-leak')) {
    const { topics, ...rest } = phase
    if (SI.test(JSON.stringify(rest))) fail(rel, 'si-leak', 'Sinhala in phase-level fields')
    for (const t of topics) {
      const { si, ...other } = t
      if (SI.test(JSON.stringify(other))) fail(rel, 'si-leak', `topic "${t.id}" has Sinhala outside its si field`)
    }
  }
}

for (const p of problems) console.log(p)
console.log(problems.length ? `\n${problems.length} problem(s)` : 'OK: no problems')
process.exit(problems.length ? 1 : 0)
