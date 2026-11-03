// Turns one English course markdown file into the phase shape the app renders.
// Pure JS (no Vite APIs) so node scripts can use it too.

export function slugify(heading) {
  return heading.trim().toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-')
}

const isFence = line => /^\s*(```|~~~)/.test(line)

// Split markdown into [{ heading, lines }] at "## " lines outside code fences.
function splitSections(md) {
  const sections = [{ heading: null, lines: [] }]
  let inFence = false
  for (const line of md.split('\n')) {
    if (isFence(line)) inFence = !inFence
    if (!inFence && /^## /.test(line)) sections.push({ heading: line.slice(3).trim(), lines: [] })
    else sections[sections.length - 1].lines.push(line)
  }
  return sections
}

// Remove "```quiz ... ```" blocks; return [md without them, parsed items].
function takeQuiz(md, where) {
  const items = []
  const out = md.replace(/^```quiz\s*\n([\s\S]*?)^```\s*$/gm, (_, json) => {
    try { items.push(...JSON.parse(json)) } catch (e) { throw new Error(`${where}: bad quiz JSON: ${e.message}`) }
    return ''
  })
  return [out, items]
}

const tidy = lines => lines.join('\n').trim().replace(/\n-{3,}$/, '').trim()

export function parseLesson(md, fileName) {
  const m = fileName.match(/^(\d+)-(.+)\.md$/)
  if (!m) throw new Error(`bad lesson file name: ${fileName}`)
  const [head, ...sections] = splitSections(md.replace(/\r\n/g, '\n'))

  const headText = head.lines.join('\n')
  const titleLine = headText.match(/^# (.+)$/m)
  const grab = label => {
    const r = headText.match(new RegExp(`^>\\s*\\*\\*${label}:\\*\\*\\s*(.+)$`, 'm'))
    return r ? r[1].trim() : ''
  }
  // Intro text under the title that isn't the prereq/summary quote (e.g. 00 and 31).
  const intro = headText.replace(/^# .+$/m, '').split('\n')
    .filter(l => !/^>/.test(l)).join('\n').replace(/^-{3,}$/gm, '').trim()

  const lesson = {
    id: m[2],
    number: parseInt(m[1], 10),
    track: 'course',
    label: `Lesson ${m[1]}`,
    title: titleLine ? titleLine[1].replace(/^\d+\s*:\s*/, '').trim() : m[2],
    summary: grab('After this file you can'),
    prereq: grab('Before you start'),
    intro,
    topics: [], checkYourself: '', newWords: '', quiz: [],
  }

  for (const s of sections) {
    const name = s.heading.replace(/^\d+\.\s*/, '')
    const [raw, quiz] = takeQuiz(tidy(s.lines), `${fileName} § ${s.heading}`)
    lesson.quiz.push(...quiz)
    const body = raw.trim()
    if (/^table of contents$/i.test(name)) continue
    if (/^check yourself/i.test(name)) lesson.checkYourself = body
    else if (/^new words/i.test(name)) lesson.newWords = body
    else lesson.topics.push({ id: slugify(s.heading), title: name, md: body })
  }
  return lesson
}

// Rewrite links like (10-data-science-workflow.md#anchor) using resolve(lessonId, anchor).
export function rewriteLinks(md, resolve) {
  return md.replace(/\]\((\d+)-([a-z0-9-]+)\.md(?:#([^)\s]*))?\)/g,
    (_, num, id, anchor) => `](${resolve(id, anchor || '')})`)
}
