// English course lessons: every src/lessons/NN-*.md file becomes one phase.
import { parseLesson, rewriteLinks } from './parse.js'
import { LAB_MAP } from './labMap.js'

export { LAB_MAP }

const files = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true })

const parsed = Object.entries(files)
  .map(([path, md]) => parseLesson(md, path.slice(2)))
  .sort((a, b) => a.number - b.number)

const known = new Set(parsed.flatMap(l => [l.id, ...l.topics.map(t => `${l.id}/${t.id}`)]))
const resolve = (id, anchor) => (anchor && known.has(`${id}/${anchor}`) ? `#/p/${id}/${anchor}` : `#/p/${id}`)

// Fix links: other lesson files and same-file "#anchor" links become app routes.
function fixLinks(md, lessonId) {
  if (!md) return md
  return rewriteLinks(md, resolve).replace(/\]\(#([^)/\s]+)\)/g, (_, anchor) => `](${resolve(lessonId, anchor)})`)
}

// Rows of the "New words in this file" table, for the site-wide search page.
function wordRows(md) {
  return md.split('\n')
    .map(l => l.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/))
    .filter(m => m && !/^-+$/.test(m[1]) && !/^word$/i.test(m[1]) && !/^term$/i.test(m[1]))
    .map(m => ({ en: m[1].replace(/\*\*/g, ''), meaning: m[2].replace(/\*\*/g, '') }))
}

export const lessons = parsed.map(l => ({
  ...l,
  prereq: fixLinks(l.prereq, l.id),
  intro: fixLinks(l.intro, l.id),
  checkYourself: fixLinks(l.checkYourself, l.id),
  newWords: fixLinks(l.newWords, l.id),
  words: wordRows(l.newWords),
  topics: l.topics.map(t => ({ ...t, md: fixLinks(t.md, l.id), lab: LAB_MAP[`${l.id}/${t.id}`] })),
}))
