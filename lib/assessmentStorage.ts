/**
 * assessmentStorage.ts
 * Persists an in-progress assessment session to localStorage so a learner can
 * resume mid-quiz after a refresh. Lock state and completed results are NOT
 * stored here — those are DB-authoritative (assessment_results) and scoped to
 * the signed-in user, so they can never leak between accounts on a shared
 * device. A one-time cleanup of the old lock key lives in clearLegacyLockData.
 */

// ── Legacy cleanup ─────────────────────────────────────────────────────────

const LEGACY_LOCK_KEY = 'portal_assessment_attempts'

/**
 * Removes the old, non-user-scoped lock cache. This key used to drive the
 * "assessment locked" screen from localStorage, which meant a second user on
 * the same device inherited the first user's completions. Lock state is now
 * read per-user from the database, so the key is obsolete and cleared once.
 */
export function clearLegacyLockData(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(LEGACY_LOCK_KEY)
  } catch {
    // Non-critical — nothing depends on this key any more.
  }
}

// ── In-progress sessions ──────────────────────────────────────────────────────

export interface InProgressSession {
  moduleId: string
  startedAt: string
  answers: (number | null)[]   // one slot per question, null = not yet answered
  submittedUpTo: number        // index of the last question that was submitted
}

const IN_PROGRESS_KEY = 'portal_assessment_in_progress'

function getAllInProgress(): InProgressSession[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(IN_PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as InProgressSession[]) : []
  } catch {
    return []
  }
}

export function getInProgress(moduleId: string): InProgressSession | null {
  if (typeof window === 'undefined') return null
  return getAllInProgress().find(s => s.moduleId === moduleId) ?? null
}

export function saveInProgress(session: InProgressSession): void {
  if (typeof window === 'undefined') return
  const all = getAllInProgress().filter(s => s.moduleId !== session.moduleId)
  all.push(session)
  localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(all))
}

export function clearInProgress(moduleId: string): void {
  if (typeof window === 'undefined') return
  const all = getAllInProgress().filter(s => s.moduleId !== moduleId)
  localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(all))
}
