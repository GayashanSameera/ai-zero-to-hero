// Every src/content/phase*.js file is picked up automatically, ordered by phase number.
const modules = import.meta.glob('./phase*.js', { eager: true })

export const phases = Object.keys(modules)
  .map(path => modules[path].default)
  .filter(Boolean)
  .sort((a, b) => a.number - b.number)

export const findPhase = id => phases.find(p => p.id === id)

export const allTopics = phases.flatMap(p => p.topics.map(t => ({ ...t, phase: p })))

export const topicKey = (phaseId, topicId) => `${phaseId}/${topicId}`
