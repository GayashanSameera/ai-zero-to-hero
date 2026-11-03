// Converts the NCA-GENL Question Bank v2 markdown files into JSON for the Exam Practice section.
// Usage: node scripts/import-nca.mjs ../NCA-GENL-Question-Bank-v2
import fs from 'fs'
import path from 'path'

const src = process.argv[2]
if (!src) { console.error('Usage: node scripts/import-nca.mjs <path to NCA-GENL-Question-Bank-v2>'); process.exit(1) }
const out = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/exam')
fs.mkdirSync(out, { recursive: true })

// Related site phases for each exam domain, used for "learn this first" links.
const RELATED = {
  '01': ['ml-deep-dive', 'ml-fundamentals'], '02': ['architecture', 'neural-networks'], '03': ['inference', 'how-llms-work'],
  '04': ['prompting-agents', 'prompt-engineering'], '05': ['rag-deep-dive', 'embeddings-vector-databases-rag'],
  '06': ['training', 'training-finetuning-alignment'], '07': ['evaluation', 'evaluating-llms'],
  '08': ['nvidia', 'inference-and-serving'], '09': ['trustworthy', 'responsible-ai'],
}

const index = []
for (const file of fs.readdirSync(src).filter(f => /^\d\d-.*\.md$/.test(f)).sort()) {
  const md = fs.readFileSync(path.join(src, file), 'utf8')
  const num = file.slice(0, 2)
  const title = md.match(/^# (.+)$/m)[1].trim()
  const questions = []
  let level = ''
  // Split on level headings and question headings while tracking the current level.
  const parts = md.split(/^(?=## |### )/m)
  for (const part of parts) {
    const lv = part.match(/^## (Foundation|Intermediate|Advanced)/)
    if (lv) { level = lv[1]; continue }
    const h = part.match(/^### ([A-Z]+-\d+) · (.+)\n/)
    if (!h) continue
    const body = part.slice(h[0].length)
    const optRe = /^- \*\*([A-D])\.\*\* (.*)$/gm
    const options = []
    let m, firstOpt = -1
    while ((m = optRe.exec(body))) { if (firstOpt < 0) firstOpt = m.index; options.push(m[2].trim()) }
    const ans = body.match(/\*\*Answer: ([A-D])\.\*\*.*\n([\s\S]*?)<\/details>/)
    if (options.length !== 4 || !ans) throw new Error(`${file} ${h[1]}: could not parse`)
    questions.push({
      id: h[1],
      topic: h[2].trim(),
      level,
      q: body.slice(0, firstOpt).trim(),
      options,
      answer: 'ABCD'.indexOf(ans[1]),
      why: ans[2].trim(),
    })
  }
  const id = file.replace(/\.md$/, '')
  fs.writeFileSync(path.join(out, id + '.json'), JSON.stringify({ id, num, title, related: RELATED[num] || [], questions }))
  index.push({ id, num, title, prefix: questions[0].id.split('-')[0], count: questions.length, related: RELATED[num] || [],
    levels: ['Foundation', 'Intermediate', 'Advanced'].map(l => questions.filter(q => q.level === l).length) })
  console.log(`${file}: ${questions.length} questions`)
}
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 1))
console.log(`Total: ${index.reduce((s, d) => s + d.count, 0)}`)
