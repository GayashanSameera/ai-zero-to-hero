// Answer helpers shared by every exam screen. A question has `answer` (first correct option index) and,
// for "pick N" questions, `answers` (all correct option indices).
export const correctSet = q => (q.answers?.length ? q.answers : [q.answer])
export const needed = q => correctSet(q).length
export const isMulti = q => needed(q) > 1

/** One pick for single-answer questions; an array of picks for "pick N" questions. All-or-nothing, as in the real exam. */
export function isCorrect(q, picked) {
  if (picked === undefined || picked === null || picked === -1) return false
  if (!isMulti(q)) return picked === q.answer
  if (!Array.isArray(picked) || new Set(picked).size !== needed(q)) return false
  return picked.every(i => correctSet(q).includes(i))
}

/** Adds or removes option i, keeping at most `max` selected (the oldest pick is dropped first). */
export function toggle(list, i, max) {
  if (list.includes(i)) return list.filter(x => x !== i)
  const next = [...list, i]
  return next.length > max ? next.slice(next.length - max) : next
}

export const answeredValue = v => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== -1)
export const correctLetters = q => correctSet(q).map(i => 'ABCDE'[i]).join(' + ')
