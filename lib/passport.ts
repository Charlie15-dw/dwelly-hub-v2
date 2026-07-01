// Competency Passport logic. Pure and data-driven: given a user's assessment
// results, derive per-section competency, overall progress and certification
// status. No data is invented — sections with no attempts are reported as
// "not-started" rather than assumed complete.

export type PassportSection =
  | 'Maintenance'
  | 'Compliance'
  | 'Inspections'
  | 'Move-Outs'
  | 'Support'
  | 'Knowledge'

export interface PassportAssessment {
  id: string
  label: string
  section: PassportSection
}

// Milestone assessments that span the whole programme (not tied to one area).
export interface MilestoneAssessment {
  id: string
  label: string
}

// The six competency areas and their assessments.
export const PASSPORT_ASSESSMENTS: PassportAssessment[] = [
  { id: 'mnt-01', label: 'Creating a Repair Request',        section: 'Maintenance' },
  { id: 'mnt-02', label: 'Actioning the Maintenance Task',   section: 'Maintenance' },
  { id: 'cmp-01', label: 'Creating a Compliance Task',       section: 'Compliance' },
  { id: 'cmp-02', label: 'Actioning the Compliance Task',    section: 'Compliance' },
  { id: 'mnt-03', label: 'Creating an Inspection Task',      section: 'Inspections' },
  { id: 'ins-02', label: 'Completing the Inspection',        section: 'Inspections' },
  { id: 'sys-01', label: 'Initiating the Move-Out Process',  section: 'Move-Outs' },
  { id: 'mvt-02', label: 'Completing the Move-Out',          section: 'Move-Outs' },
  { id: 'sys-02', label: 'Raising a Support Task',           section: 'Support' },
  { id: 'sup-02', label: 'Actioning the Support Task',       section: 'Support' },
  { id: 'kno-01', label: 'Dwelly Best Practice',             section: 'Knowledge' },
  { id: 'kno-02', label: 'Repairs & Legal Responsibilities', section: 'Knowledge' },
  { id: 'kno-03', label: 'Property Finances & the Ledger',   section: 'Knowledge' },
]

export const PASSPORT_MILESTONES: MilestoneAssessment[] = [
  { id: 'full-assessment',   label: 'Full Programme Assessment' },
  { id: 'master-assessment', label: 'Master Assessment' },
]

export const SECTION_ORDER: PassportSection[] = [
  'Maintenance', 'Compliance', 'Inspections', 'Move-Outs', 'Support', 'Knowledge',
]

// All assessment ids that count toward programme completion (13 + 2 = 15).
export const ALL_PASSPORT_IDS: string[] = [
  ...PASSPORT_ASSESSMENTS.map(a => a.id),
  ...PASSPORT_MILESTONES.map(m => m.id),
]

export const PASS_MARK = 80

export interface ResultRow {
  assessment_id: string
  score: number
  passed: boolean
  completed_at?: string | null
}

export interface AssessmentRecord {
  id: string
  label: string
  section: PassportSection | 'Milestone'
  attempted: boolean
  score: number | null
  passed: boolean
  completedAt: string | null
}

export type CompetencyStatus = 'proficient' | 'developing' | 'not-started'

export interface SectionCompetency {
  section: PassportSection
  passed: number
  total: number
  avgScore: number | null
  status: CompetencyStatus
  complete: boolean
}

export interface PassportSummary {
  passedCount: number
  totalCount: number
  progressPct: number
  avgScore: number | null
  passRate: number | null
  certified: boolean
}

export type CertificationStatus = 'certified' | 'recert-due' | 'in-training' | 'not-started'

// Reduce raw results to the most recent attempt per assessment.
export function latestByAssessment(results: ResultRow[]): Map<string, ResultRow> {
  const latest = new Map<string, ResultRow>()
  for (const r of results) {
    const existing = latest.get(r.assessment_id)
    if (!existing || (r.completed_at ?? '') >= (existing.completed_at ?? '')) {
      latest.set(r.assessment_id, r)
    }
  }
  return latest
}

// Per-section competency, from the latest attempt of each assessment.
export function computeSectionCompetency(results: ResultRow[]): SectionCompetency[] {
  const latest = latestByAssessment(results)

  return SECTION_ORDER.map(section => {
    const assessments = PASSPORT_ASSESSMENTS.filter(a => a.section === section)
    const attempts = assessments
      .map(a => latest.get(a.id))
      .filter((r): r is ResultRow => !!r)

    const passed = attempts.filter(r => r.passed).length
    const total = assessments.length
    const avgScore = attempts.length > 0
      ? Math.round(attempts.reduce((s, r) => s + r.score, 0) / attempts.length)
      : null

    let status: CompetencyStatus = 'not-started'
    if (attempts.length > 0) status = passed === total ? 'proficient' : 'developing'

    return { section, passed, total, avgScore, status, complete: passed === total }
  })
}

// Flat record of every programme assessment (attempted or not), latest attempt.
export function buildAssessmentRecord(results: ResultRow[]): AssessmentRecord[] {
  const latest = latestByAssessment(results)

  const core: AssessmentRecord[] = PASSPORT_ASSESSMENTS.map(a => {
    const r = latest.get(a.id)
    return {
      id: a.id,
      label: a.label,
      section: a.section,
      attempted: !!r,
      score: r?.score ?? null,
      passed: r?.passed ?? false,
      completedAt: r?.completed_at ?? null,
    }
  })

  const milestones: AssessmentRecord[] = PASSPORT_MILESTONES.map(m => {
    const r = latest.get(m.id)
    return {
      id: m.id,
      label: m.label,
      section: 'Milestone' as const,
      attempted: !!r,
      score: r?.score ?? null,
      passed: r?.passed ?? false,
      completedAt: r?.completed_at ?? null,
    }
  })

  return [...core, ...milestones]
}

// Headline numbers for the passport.
export function computeSummary(results: ResultRow[]): PassportSummary {
  const passedIds = new Set(
    results.filter(r => r.passed && ALL_PASSPORT_IDS.includes(r.assessment_id)).map(r => r.assessment_id),
  )
  const passedCount = passedIds.size
  const totalCount = ALL_PASSPORT_IDS.length
  const progressPct = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0
  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : null
  const passRate = results.length > 0
    ? Math.round((results.filter(r => r.passed).length / results.length) * 100)
    : null

  return { passedCount, totalCount, progressPct, avgScore, passRate, certified: passedCount >= totalCount }
}

// Overall certification status, factoring in the annual re-cert window.
export function certificationStatus(summary: PassportSummary, daysUntilRecert: number): CertificationStatus {
  if (summary.certified) return daysUntilRecert <= 0 ? 'recert-due' : 'certified'
  if (summary.passedCount === 0) return 'not-started'
  return 'in-training'
}
