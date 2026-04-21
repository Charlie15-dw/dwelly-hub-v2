/**
 * assessmentStorage.ts
 * Persists assessment attempt records to localStorage.
 * Assessments lock on completion (pass or fail); only managers can unlock retakes.
 * Recap quizzes are never stored here — they have no pass mark.
 */

const STORAGE_KEY = 'portal_assessment_attempts'

export interface AttemptRecord {
  moduleId: string    // e.g. 'onb-01', 'master-assessment'
  completedAt: string // ISO timestamp
  score: number       // 0–100 integer
  passed: boolean
  locked: boolean     // true after completion; manager sets false to grant retake
}

// ── Read ─────────────────────────────────────────────────────────────────────

export function getAttempts(): AttemptRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AttemptRecord[]) : []
  } catch {
    return []
  }
}

export function getLastAttempt(moduleId: string): AttemptRecord | null {
  if (typeof window === 'undefined') return null
  const all = getAttempts().filter(a => a.moduleId === moduleId)
  return all.length > 0 ? all[all.length - 1] : null
}

export function isLocked(moduleId: string): boolean {
  if (typeof window === 'undefined') return false
  const last = getLastAttempt(moduleId)
  return last?.locked ?? false
}

/**
 * Returns the most recent locked attempt per moduleId.
 * Used by the manager dashboard to list assessments awaiting unlock.
 */
export function getLockedAttempts(): AttemptRecord[] {
  if (typeof window === 'undefined') return []
  const all = getAttempts()
  const byModule = new Map<string, AttemptRecord>()
  for (const attempt of all.filter(a => a.locked)) {
    byModule.set(attempt.moduleId, attempt) // later entries overwrite earlier ones
  }
  return Array.from(byModule.values())
}

// ── Write ────────────────────────────────────────────────────────────────────

/** Saves a completed attempt. Always sets locked: true. */
export function saveAttempt(record: Omit<AttemptRecord, 'locked'>): void {
  if (typeof window === 'undefined') return
  const all = getAttempts()
  all.push({ ...record, locked: true })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

// ── Manager actions ───────────────────────────────────────────────────────────

/** Flips the most recent attempt for a moduleId to locked: false. */
export function unlockAssessment(moduleId: string): void {
  if (typeof window === 'undefined') return
  const all = getAttempts()
  // Find the last record for this moduleId and unlock it
  for (let i = all.length - 1; i >= 0; i--) {
    if (all[i].moduleId === moduleId) {
      all[i] = { ...all[i], locked: false }
      break
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
