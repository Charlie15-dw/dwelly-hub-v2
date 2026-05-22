export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
}

export interface Achievement extends AchievementDef {
  earned: boolean
  earnedDate?: string
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Passed your very first assessment.',
    icon: '👣',
  },
  {
    id: 'assessment-ace',
    title: 'Assessment Ace',
    description: 'Passed an assessment on the very first attempt.',
    icon: '🎯',
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Achieved 100% on any assessment.',
    icon: '💯',
  },
  {
    id: 'compliance-champion',
    title: 'Compliance Champion',
    description: 'Passed both compliance assessments.',
    icon: '🛡️',
  },
  {
    id: 'recap-regular',
    title: 'Recap Regular',
    description: 'Completed three monthly recap sessions.',
    icon: '🔄',
  },
  {
    id: 'passport-holder',
    title: 'Passport Holder',
    description: 'Passed five or more assessments.',
    icon: '🎫',
  },
  {
    id: 'master-assessor',
    title: 'Master Assessor',
    description: 'Passed the master assessment.',
    icon: '👑',
  },
  {
    id: 'full-house',
    title: 'Full House',
    description: 'Passed every assessment in the programme.',
    icon: '🏠',
  },
]

interface ResultRow {
  assessment_id: string
  score: number
  passed: boolean
}

const TOTAL_ASSESSMENTS = 15

export function computeAchievements(results: ResultRow[]): Achievement[] {
  // Build maps for quick lookup
  const passedIds = new Set(results.filter(r => r.passed).map(r => r.assessment_id))
  const countByAssessment = new Map<string, number>()
  for (const r of results) {
    countByAssessment.set(r.assessment_id, (countByAssessment.get(r.assessment_id) ?? 0) + 1)
  }

  const checks: Record<string, boolean> = {
    'first-steps':         passedIds.size >= 1,
    'assessment-ace':      results.some(r => r.passed && (countByAssessment.get(r.assessment_id) ?? 0) === 1),
    'perfect-score':       results.some(r => r.score === 100),
    'compliance-champion': passedIds.has('cmp-01') && passedIds.has('cmp-02'),
    'recap-regular':       results.filter(r => r.assessment_id.startsWith('recap-') && r.passed).length >= 3,
    'passport-holder':     passedIds.size >= 5,
    'master-assessor':     passedIds.has('master-assessment'),
    'full-house':          passedIds.size >= TOTAL_ASSESSMENTS,
  }

  return ACHIEVEMENT_DEFS.map(def => ({
    ...def,
    earned: checks[def.id] ?? false,
  }))
}
