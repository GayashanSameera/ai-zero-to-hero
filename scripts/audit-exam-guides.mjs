// Structural and exam-link audit for every certification Exam Guide topic.
// This complements check-content.mjs with cross-file checks.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const contentDir = path.join(root, 'src/content')
const examDir = path.join(root, 'src/exam')
const errors = []
const warnings = []
const fail = message => errors.push(message)
const warn = message => warnings.push(message)

const phaseFiles = fs.readdirSync(contentDir).filter(file => /^phase.*\.js$/.test(file)).sort()
const phases = []
for (const file of phaseFiles) {
  const phase = (await import(pathToFileURL(path.join(contentDir, file)).href)).default
  phases.push({ file, phase })
}

const questions = fs.readdirSync(examDir)
  .filter(file => file.endsWith('.json') && file !== 'index.json')
  .flatMap(file => JSON.parse(fs.readFileSync(path.join(examDir, file), 'utf8')).questions)
questions.push(...JSON.parse(fs.readFileSync(path.join(root, 'src/exam-ccar/ccar-f-practice.json'), 'utf8')).questions)
const questionIds = new Set(questions.map(question => question.id))
const referencedBy = new Map()
const topicKeys = new Set()
let topicCount = 0

for (const { file, phase } of phases) {
  if (!phase.id || !phase.title || !Array.isArray(phase.topics)) fail(`${file}: invalid phase shape`)
  for (const topic of phase.topics || []) {
    topicCount++
    const label = `${phase.id}/${topic.id || '?'}`
    if (!topic.id || !topic.title) fail(`${label}: missing id or title`)
    if (topicKeys.has(label)) fail(`${label}: duplicate topic id`)
    topicKeys.add(label)
    if (!Array.isArray(topic.body) || topic.body.length < 2 || topic.body.some(x => typeof x !== 'string' || !x.trim())) {
      fail(`${label}: body must contain at least two non-empty paragraphs`)
    }
    if (!topic.analogy?.trim()) fail(`${label}: missing beginner analogy`)
    if (!topic.example?.trim()) fail(`${label}: missing worked example`)
    if (!Array.isArray(topic.keyPoints) || topic.keyPoints.length < 3) fail(`${label}: needs at least three key points`)
    if (!Array.isArray(topic.terms) || topic.terms.length < 1) fail(`${label}: missing related terms`)
    if (typeof topic.plain !== 'string' || !topic.plain.trim()) fail(`${label}: missing directly authored plain-language explanation`)
    if (!Array.isArray(topic.internGuide) || topic.internGuide.length !== 4 || topic.internGuide.some(x => typeof x !== 'string' || !x.trim())) {
      fail(`${label}: internGuide must contain exactly four directly authored, non-empty steps`)
    }
    for (const [index, paragraph] of (topic.body || []).entries()) {
      const words = paragraph.trim().split(/\s+/).length
      if (words > 180) warn(`${label}: paragraph ${index + 1} is ${words} words; consider splitting it`)
    }
    for (const ref of topic.examRefs || []) {
      if (!questionIds.has(ref)) fail(`${label}: unknown exam reference ${ref}`)
      if (!referencedBy.has(ref)) referencedBy.set(ref, [])
      referencedBy.get(ref).push(label)
    }
  }
}

for (const question of questions) if (!referencedBy.has(question.id)) fail(`${question.id}: question has no Exam Guide lesson`)
for (const [ref, topics] of referencedBy) if (topics.length > 1) warn(`${ref}: intentionally verify overlap: ${topics.join(', ')}`)

for (const message of warnings) console.log(`WARN ${message}`)
for (const message of errors) console.log(`ERROR ${message}`)
console.log(`\nAudited ${topicCount} topics in ${phases.length} guides and ${questions.length} exam questions.`)
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`)
process.exit(errors.length ? 1 : 0)
