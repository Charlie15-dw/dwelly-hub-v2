// Pure computation for the Hub home "Your journey" widget. All progress is
// derived server-side from learning_profiles, module_progress, content_completions
// and assessment_results, reduced to the primitives below, then turned into the
// milestone/step state machine here. Kept free of React/Supabase so it can be
// unit-tested in isolation.

export type JourneyState = 'done' | 'current' | 'todo' | 'explore'

export interface JourneyStep {
  n: number
  label: string
  href: string
  state: JourneyState
  detail: string
}

export interface JourneyInput {
  hasLearningProfile: boolean
  completedModules: number
  totalModules: number
  completedAssessments: number
  totalAssessments: number
  /** true if the user has any assessment attempt (passed or not) */
  hasAssessmentAttempts: boolean
  /** true if the user has completed at least one module */
  modulesStarted: boolean
  /** section-level "worked through this" marker for the Training Guide */
  trainingDone: boolean
  /** section-level "worked through this" marker for the Knowledge Base */
  knowledgeDone: boolean
}

export type JourneyMilestone = 'profile' | 'modules' | 'assessments' | 'passport'

export interface JourneyResult {
  isNewStarter: boolean
  current: JourneyMilestone
  continueHref: string
  continueLabel: string
  pct: number
  steps: JourneyStep[]
}

export function computeJourney(input: JourneyInput): JourneyResult {
  const {
    hasLearningProfile,
    completedModules,
    totalModules,
    completedAssessments,
    totalAssessments,
    hasAssessmentAttempts,
    modulesStarted,
    trainingDone,
    knowledgeDone,
  } = input

  const modulesDone = totalModules > 0 && completedModules >= totalModules
  const assessmentsDone = completedAssessments >= totalAssessments

  const isNewStarter = !hasLearningProfile && !modulesStarted && !hasAssessmentAttempts

  // The single "current" milestone drives the Continue button and step states.
  const current: JourneyMilestone =
    !hasLearningProfile ? 'profile'
    : !modulesDone ? 'modules'
    : !assessmentsDone ? 'assessments'
    : 'passport'

  const continueHref =
    current === 'profile' ? '/pre-training'
    : current === 'modules' ? '/modules'
    : current === 'assessments' ? '/assessments'
    : '/passport'

  const continueLabel =
    isNewStarter ? 'Start here'
    : current === 'profile' ? 'Continue: Learning Profile'
    : current === 'modules' ? 'Continue: Video Modules'
    : current === 'assessments' ? 'Continue: Assessments'
    : 'View your Passport'

  const pct = Math.round(
    ((hasLearningProfile ? 1 : 0)
      + (totalModules > 0 ? completedModules / totalModules : 0)
      + (totalAssessments > 0 ? completedAssessments / totalAssessments : 0)) / 3 * 100
  )

  const steps: JourneyStep[] = [
    {
      n: 1, label: 'Learning Profile', href: '/pre-training',
      state: hasLearningProfile ? 'done' : 'current',
      detail: hasLearningProfile ? 'Completed' : 'Start here — takes a couple of minutes',
    },
    {
      n: 2, label: 'Training Guide', href: '/training',
      state: trainingDone ? 'done' : 'explore',
      detail: trainingDone
        ? 'Marked complete'
        : 'Written guides for every area of the platform',
    },
    {
      n: 3, label: 'Video Modules', href: '/modules',
      state: modulesDone ? 'done' : current === 'modules' ? 'current' : 'todo',
      detail: modulesDone ? 'All modules complete' : `${completedModules} of ${totalModules} modules complete`,
    },
    {
      n: 4, label: 'Knowledge Base', href: '/knowledge',
      state: knowledgeDone ? 'done' : 'explore',
      detail: knowledgeDone
        ? 'Marked complete'
        : 'In-depth property management articles',
    },
    {
      n: 5, label: 'Assessments', href: '/assessments',
      state: assessmentsDone ? 'done' : current === 'assessments' ? 'current' : 'todo',
      detail: `${completedAssessments} of ${totalAssessments} passed`,
    },
    {
      n: 6, label: 'Competency Passport', href: '/passport',
      state: current === 'passport' ? 'current' : 'todo',
      detail: current === 'passport' ? 'Ready — view your signed-off record' : 'Your finish line',
    },
  ]

  return { isNewStarter, current, continueHref, continueLabel, pct, steps }
}
