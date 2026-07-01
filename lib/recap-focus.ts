// Personalised "focus areas" for the Recap page. Pure, data-driven logic:
// given a user's assessment results and the module catalogue, surface the
// modules they scored weakest on so they can revise. No data is invented —
// only modules the user has actually attempted (and underperformed on) are
// returned, so the panel stays empty when there's nothing to flag.

export interface FocusInputResult {
  assessment_id: string
  score: number
  completed_at?: string | null
}

export interface FocusModule {
  id: string
  title: string
  section: string
  passmark: number
}

export interface FocusArea {
  moduleId: string
  title: string
  section: string
  score: number
  passmark: number
}

export function computeFocusAreas(
  results: FocusInputResult[],
  modules: FocusModule[],
  limit = 3,
): FocusArea[] {
  const moduleById = new Map(modules.map(m => [m.id, m]))

  // Keep the most recent score per module the user has attempted.
  const latestByModule = new Map<string, FocusInputResult>()
  for (const r of results) {
    if (!moduleById.has(r.assessment_id)) continue // skip full/master/recap/release ids
    const existing = latestByModule.get(r.assessment_id)
    if (!existing || (r.completed_at ?? '') >= (existing.completed_at ?? '')) {
      latestByModule.set(r.assessment_id, r)
    }
  }

  const weak: FocusArea[] = []
  latestByModule.forEach((result, moduleId) => {
    const mod = moduleById.get(moduleId)!
    if (result.score < mod.passmark) {
      weak.push({
        moduleId,
        title: mod.title,
        section: mod.section,
        score: result.score,
        passmark: mod.passmark,
      })
    }
  })

  // Lowest scores first; break ties by title for a stable order.
  weak.sort((a, b) => (a.score - b.score) || a.title.localeCompare(b.title))
  return weak.slice(0, limit)
}
