import { createClient } from '@supabase/supabase-js'

// Progress always lives in localStorage. When Supabase is configured and the user signs in
// with their email, the same keys are also copied to their row in the `progress` table so it
// follows them to other devices. Without the env vars the app stays local-only.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = url && anonKey ? createClient(url, anonKey, { auth: { flowType: 'pkce' } }) : null

// Keys stored per user in the cloud. Add a key here when a new useStoredState holds progress.
const SYNCED_KEYS = ['learned', 'quizScores', 'examAnswers']

const values = {}
const listeners = new Set()
let user = null
let uploadTimer = null

function readLocal(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : undefined
  } catch (e) {
    return undefined
  }
}

function setValue(key, v) {
  values[key] = v
  try { localStorage.setItem(key, JSON.stringify(v)) } catch (e) { /* storage unavailable */ }
}

const notify = () => listeners.forEach(fn => fn())

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getValue(key, initial) {
  if (!(key in values)) values[key] = readLocal(key) ?? initial
  return values[key]
}

export function putValue(key, v) {
  setValue(key, v)
  notify()
  if (SYNCED_KEYS.includes(key)) scheduleUpload()
}

export const getUser = () => user

function snapshot() {
  return Object.fromEntries(SYNCED_KEYS.map(k => [k, getValue(k, {})]))
}

function scheduleUpload() {
  if (!supabase || !user) return
  clearTimeout(uploadTimer)
  uploadTimer = setTimeout(upload, 1000)
}

async function upload() {
  if (!user) return
  const { error } = await supabase.from('progress')
    .upsert({ user_id: user.id, data: snapshot(), updated_at: new Date().toISOString() })
  if (error) console.warn('Progress sync failed:', error.message)
}

// Combines the account's saved progress with what this browser has; this browser wins on
// conflicts, so anything done before signing in is kept and added to the account.
async function pullAndMerge() {
  const { data: row, error } = await supabase.from('progress').select('data').eq('user_id', user.id).maybeSingle()
  if (error) { console.warn('Progress load failed:', error.message); return }
  const remote = row?.data || {}
  for (const key of SYNCED_KEYS) setValue(key, { ...(remote[key] || {}), ...getValue(key, {}) })
  notify()
  await upload()
}

export async function sendLoginLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + window.location.pathname },
  })
  if (error) throw error
}

// Clears this browser's progress too, so the next person on a shared computer starts fresh.
export async function signOut() {
  clearTimeout(uploadTimer)
  await upload()
  await supabase.auth.signOut()
  for (const key of SYNCED_KEYS) setValue(key, {})
  notify()
}

if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    const next = session?.user || null
    const changed = next?.id !== user?.id
    user = next
    if (!changed) return
    notify()
    // Run outside the callback: awaiting Supabase calls inside it can deadlock the client.
    if (user) setTimeout(pullAndMerge, 0)
    // Drop the one-time ?code=... from the magic link once the session exists.
    if (user && window.location.search.includes('code=')) {
      history.replaceState(null, '', window.location.pathname + window.location.hash)
    }
  })
}
