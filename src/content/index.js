// Phases = English course lessons (src/lessons/*.md) followed by the certification
// exam-guide phases (every src/content/phase*.js file), ordered by number.
import { lessons } from '../lessons/index.js'

const modules = import.meta.glob('./phase*.js', { eager: true })

const certPhases = Object.keys(modules)
  .map(path => modules[path].default)
  .filter(Boolean)
  .sort((a, b) => a.number - b.number)
  .map((p, i) => ({ ...p, track: 'cert', label: `Exam guide ${i + 1}` }))

export const phases = [...lessons, ...certPhases]

export const findPhase = id => phases.find(p => p.id === id)

export const allTopics = phases.flatMap(p => p.topics.map(t => ({ ...t, phase: p })))

export const topicKey = (phaseId, topicId) => `${phaseId}/${topicId}`
