// Imports the CCAR-F practice exams (section 15 and section 20) from the study PDF into JSON for Exam Practice.
// Usage: node scripts/import-ccar.mjs ../Claude-Certified-Architect-Foundations-Zero-to-Hero.pdf
// Needs the `pdftotext` command (poppler-utils).
// NOTE: src/exam-ccar/ccar-f-practice.json is now a hand-translated English version. Re-running this import re-creates the Sinhala text from the PDF.
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const pdf = process.argv[2]
if (!pdf) { console.error('Usage: node scripts/import-ccar.mjs <path to the CCAR-F PDF>'); process.exit(1) }
const out = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/exam-ccar')
fs.mkdirSync(out, { recursive: true })

const lines = execFileSync('pdftotext', ['-layout', pdf, '-'], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8').split('\n')
  .filter(l => !/^\s*Page \d+ of \d+\s*$/.test(l) && !/^\s*Claude Certified Architect – Foundations: Zero to Hero\s*$/.test(l))

const lastIndex = re => { let at = -1; lines.forEach((l, i) => { if (re.test(l)) at = i }); return at }
const slice = (startRe, endRe) => {
  const a = lastIndex(startRe), b = lastIndex(endRe)
  if (a < 0 || b <= a) throw new Error(`section not found: ${startRe}`)
  return lines.slice(a + 1, b)
}

// Which lesson task each Practice Exam 1 question tests (the PDF's table gives only the domain for this exam).
const P1_TASKS = ['1.1', '1.3', '1.3', '1.5', '1.7', '2.1', '2.2', '2.3', '2.4', '2.5', '3.1', '3.2', '3.4', '3.6', '4.1', '4.3', '4.4', '4.5', '5.1', '5.2']

function parseSection(sectionLines, levelName, startNo, tasksFor) {
  const tableAt = sectionLines.findIndex(l => /^\s*#\s+.*\b(Domain|Task)\b/.test(l))
  if (tableAt < 0) throw new Error(`${levelName}: answer table not found`)
  const qLines = sectionLines.slice(0, tableAt)
  const tLines = sectionLines.slice(tableAt)

  // Answer table: "N  B  1  explanation..." with explanations wrapping onto later lines.
  const key = {}
  let cur = null
  for (const raw of tLines) {
    if (/16[–-]20/.test(raw)) break
    if (/^\s*#\s+.*\b(Domain|Task)\b/.test(raw) || !raw.trim()) continue
    const m = raw.match(/^\s*(\d{1,2})\s+([A-E](?:,\s*[A-E])*)\s+(\d(?:\.\d)?(?:,\s*\d(?:\.\d)?)*)\s+(.*)$/)
    if (m) { cur = { letters: m[2].split(/,\s*/), ref: m[3].split(/,\s*/), why: m[4].trim() }; key[+m[1]] = cur }
    else if (cur) cur.why += ' ' + raw.trim()
  }

  // Questions: start at "N. (Scenario) ..." lines.
  const blocks = []
  for (const raw of qLines) {
    const m = raw.match(/^\s*(\d{1,2})\.\s+\(/)
    if (m) blocks.push({ no: +m[1], text: raw.trim() })
    else if (blocks.length && raw.trim()) blocks[blocks.length - 1].text += ' ' + raw.trim()
  }

  return blocks.map(b => {
    const head = b.text.match(/^\d{1,2}\.\s+\(([^)]+)\)\s*(.*)$/s)
    if (!head) throw new Error(`${levelName} Q${b.no}: bad header`)
    // Find options in order A), B), C), D)[, E)] after the stem.
    const body = head[2]
    const found = []
    let from = 0
    for (const L of 'ABCDE') {
      const re = new RegExp(`(^|\\s)${L}\\)\\s`)
      const m = re.exec(body.slice(from))
      if (!m) break
      found.push({ L, start: from + m.index + m[1].length, textStart: from + m.index + m[0].length })
      from = from + m.index + m[0].length
    }
    if (found.length < 4) throw new Error(`${levelName} Q${b.no}: found ${found.length} options`)
    const options = found.map((f, i) => body.slice(f.textStart, i + 1 < found.length ? found[i + 1].start : body.length).trim())
    const k = key[b.no]
    if (!k) throw new Error(`${levelName} Q${b.no}: no answer row`)
    const answers = k.letters.map(L => 'ABCDE'.indexOf(L))
    if (answers.some(i => i < 0 || i >= options.length)) throw new Error(`${levelName} Q${b.no}: answer out of range`)
    const tasks = tasksFor ? [tasksFor[b.no - 1]] : k.ref
    return {
      scenario: head[1].trim(),
      stem: body.slice(0, found[0].start).trim().replace(/^—\s*/, ''),
      options, answers, why: k.why.replace(/\s+/g, ' ').trim(), tasks,
      domain: +tasks[0].split('.')[0],
      levelName, no: b.no,
    }
  })
}

const p1 = parseSection(slice(/^15\. CCAR-F Practice Exam/, /^16\. Registration/), 'Practice Exam 1', 1, P1_TASKS)
const p2 = parseSection(slice(/^20\. Practice Exam 2/, /^21\. Final-Week Cheat Sheet/), 'Practice Exam 2', 1, null)
if (p1.length !== 20 || p2.length !== 20) throw new Error(`expected 20 + 20 questions, got ${p1.length} + ${p2.length}`)

const questions = [...p1, ...p2].map((q, i) => ({
  id: `CCAR-${String(i + 1).padStart(3, '0')}`,
  topic: q.scenario,
  level: q.levelName,
  q: q.stem,
  options: q.options,
  answer: q.answers[0],
  answers: q.answers,
  why: q.why,
  tasks: q.tasks,
  domain: q.domain,
}))

const data = {
  id: 'ccar-f-practice',
  num: 'CCAR',
  title: 'Claude Certified Architect – Foundations: Practice Exams',
  prefix: 'CCAR',
  related: ['claude-agents-tools', 'claude-code-reliability'],
  levelNames: ['Practice Exam 1', 'Practice Exam 2'],
  questions,
}
fs.writeFileSync(path.join(out, 'ccar-f-practice.json'), JSON.stringify(data, null, 1))
console.log(`CCAR-F: ${questions.length} questions (${questions.filter(q => q.answers.length > 1).length} multiple-response)`)
