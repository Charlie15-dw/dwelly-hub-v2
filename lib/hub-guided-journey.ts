// Guided new-starter journey — a progress-based, stage-gated view of the same
// data behind the Hub "Your journey" widget. Where computeJourney() returns a
// flat 6-step list, this groups the work into sequential STAGES that unlock as
// the previous stage is completed ("complete these to unlock the next stage"),
// regardless of calendar time. Universal path for now (not role-specific).
//
// Pure (no React/Supabase) so it can be unit-tested in isolation. Consumes the
// same JourneyInput as computeJourney().

import type { JourneyInput } from './hub-journey'

export type TaskState = 'done' | 'current' | 'todo' | 'locked'

export interface GuidedTask {
  label: string
  href: string
  detail: string
  state: TaskState
  /** Whether finishing this task is required to complete the stage. */
  required: boolean
}

export interface GuidedStage {
  n: number
  title: string
  blurb: string
  tasks: GuidedTask[]
  locked: boolean
  complete: boolean
  current: boolean
  /** 0–100 across the stage's tasks. */
  pct: number
}

export interface GuidedJourneyResult {
  isNewStarter: boolean
  allComplete: boolean
  /** 0–100 across every task in the journey. */
  pct: number
  /** The single next action the learner should take. */
  nextHref: string
  nextLabel: string
  currentStage: number
  stages: GuidedStage[]
}

export function computeGuidedJourney(input: JourneyInput): GuidedJourneyResult {
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
  const assessmentsDone = totalAssessments > 0 && completedAssessments >= totalAssessments

  const isNewStarter = !hasLearningProfile && !modulesStarted && !hasAssessmentAttempts

  // Stage gates — each requires the meaningful deliverable of that stage.
  const stage1Complete = hasLearningProfile
  const stage2Complete = stage1Complete && modulesDone
  const stage3Complete = stage2Complete && assessmentsDone

  const stage2Locked = !stage1Complete
  const stage3Locked = !stage2Complete

  // The current stage is the first unlocked, not-yet-complete stage.
  const currentStage =
    !stage1Complete ? 1
    : !stage2Complete ? 2
    : !stage3Complete ? 3
    : 4 // all done

  // Build a stage's tasks, resolving each task's state relative to whether the
  // stage is locked / current, and which task is the next actionable one.
  function buildStage(
    n: number,
    title: string,
    blurb: string,
    locked: boolean,
    complete: boolean,
    raw: Array<{ label: string; href: string; detail: string; done: boolean; required: boolean }>,
  ): GuidedStage {
    const isCurrent = !locked && !complete && n === currentStage
    let currentAssigned = false
    const tasks: GuidedTask[] = raw.map((t) => {
      let state: TaskState
      if (t.done) {
        state = 'done'
      } else if (locked) {
        state = 'locked'
      } else if (isCurrent && !currentAssigned) {
        state = 'current'
        currentAssigned = true
      } else {
        state = 'todo'
      }
      return { label: t.label, href: t.href, detail: t.detail, state, required: t.required }
    })
    const doneCount = raw.filter(t => t.done).length
    const pct = raw.length > 0 ? Math.round((doneCount / raw.length) * 100) : 0
    return { n, title, blurb, tasks, locked, complete, current: isCurrent, pct }
  }

  const stages: GuidedStage[] = [
    buildStage(1, 'Get set up', 'Tell us how you learn best so we can shape your path.', false, stage1Complete, [
      {
        label: 'Complete your Learning Profile', href: '/pre-training',
        detail: hasLearningProfile ? 'Completed' : 'Takes a couple of minutes',
        done: hasLearningProfile, required: true,
      },
    ]),
    buildStage(2, 'Learn the craft', 'Work through the training, watch the modules and read the essentials.', stage2Locked, stage2Complete, [
      {
        label: 'Read the Training Guide', href: '/training',
        detail: trainingDone ? 'Marked complete' : 'Written guides for every area',
        done: trainingDone, required: false,
      },
      {
        label: 'Watch the Video Modules', href: '/modules',
        detail: modulesDone ? 'All modules complete' : `${completedModules} of ${totalModules} complete`,
        done: modulesDone, required: true,
      },
      {
        label: 'Explore the Knowledge Base', href: '/knowledge',
        detail: knowledgeDone ? 'Marked complete' : 'In-depth reference articles',
        done: knowledgeDone, required: false,
      },
    ]),
    buildStage(3, 'Prove it', 'Pass your assessments and earn your signed-off Competency Passport.', stage3Locked, stage3Complete, [
      {
        label: 'Pass your Assessments', href: '/assessments',
        detail: `${completedAssessments} of ${totalAssessments} passed`,
        done: assessmentsDone, required: true,
      },
      {
        label: 'View your Competency Passport', href: '/passport',
        detail: assessmentsDone ? 'Ready — view your signed-off record' : 'Unlocks once assessments are passed',
        done: stage3Complete, required: false,
      },
    ]),
  ]

  const allComplete = stage3Complete

  // Overall percentage across the three meaningful gates (profile, modules,
  // assessments) — mirrors the weighting used by computeJourney().
  const pct = Math.round(
    ((hasLearningProfile ? 1 : 0)
      + (totalModules > 0 ? completedModules / totalModules : 0)
      + (totalAssessments > 0 ? completedAssessments / totalAssessments : 0)) / 3 * 100,
  )

  // Next action = the first non-done task in the current (unlocked) stage.
  let nextHref = '/passport'
  let nextLabel = 'View your Passport'
  if (!allComplete) {
    const stage = stages.find(s => s.current)
    const task = stage?.tasks.find(t => t.state === 'current') ?? stage?.tasks.find(t => t.state !== 'done')
    if (task) {
      nextHref = task.href
      nextLabel = isNewStarter && stage?.n === 1 ? 'Start here' : task.label
    }
  }

  return { isNewStarter, allComplete, pct, nextHref, nextLabel, currentStage, stages }
}
