/**
 * Seeded pseudo-random shuffle utilities.
 *
 * Each browser gets a stable key stored in localStorage ('dwelly-shuffle-key').
 * All shuffles (question order, option order, assessment list) are seeded from
 * hashStr(browserKey + someId), giving consistent results for the same
 * user/device while differing between users.
 */

/** FNV-1a 32-bit hash — fast, good distribution for short strings */
export function hashStr(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

/** LCG-based seeded Fisher-Yates shuffle */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Returns a stable per-browser shuffle key.
 * Creates one on first call and persists it to localStorage.
 * Returns '' on server (no localStorage) — callers should treat '' as "no shuffle".
 */
export function getBrowserKey(): string {
  if (typeof window === 'undefined') return ''
  let key = localStorage.getItem('dwelly-shuffle-key')
  if (!key) {
    key = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)
    localStorage.setItem('dwelly-shuffle-key', key)
  }
  return key
}
