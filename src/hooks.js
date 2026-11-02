import { useEffect, useState, useCallback, useSyncExternalStore } from 'react'
import { subscribe, getValue, putValue, getUser } from './sync.js'

export function useHashRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [parts, setParts] = useState(read)
  useEffect(() => {
    const onChange = () => { setParts(read()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return parts
}

// Shared across components, so every user of a key sees updates (including cloud sync).
export function useStoredState(key, initial) {
  const value = useSyncExternalStore(subscribe, () => getValue(key, initial))
  const set = useCallback(next => {
    const v = typeof next === 'function' ? next(getValue(key, initial)) : next
    putValue(key, v)
  }, [key])
  return [value, set]
}

export function useUser() {
  return useSyncExternalStore(subscribe, getUser)
}
