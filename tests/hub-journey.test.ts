import { describe, it, expect } from 'vitest'
import { computeJourney, type JourneyInput } from '@/lib/hub-journey'

// A brand-new user: no profile, no modules, no assessments.
const NEW_STARTER: JourneyInput = {
  hasLearningProfile: false,
  completedModules: 0,
  totalModules: 10,
  completedAssessments: 0,
  totalAssessments: 15,
  hasAssessmentAttempts: false,
  modulesStarted: false,
  trainingDone: false,
  knowledgeDone: false,
}

function stepState(input: JourneyInput, n: number) {
  return computeJourney(input).steps.find(s => s.n === n)?.state
}

describe('computeJourney', () => {
  it('flags a brand-new user as a new starter pointing at the profile', () => {
    const r = computeJourney(NEW_STARTER)
    expect(r.isNewStarter).toBe(true)
    expect(r.current).toBe('profile')
    expect(r.continueHref).toBe('/pre-training')
    expect(r.continueLabel).toBe('Start here')
    expect(r.pct).toBe(0)
    expect(stepState(NEW_STARTER, 1)).toBe('current')
  })

  it('is no longer a new starter once any assessment has been attempted', () => {
    const r = computeJourney({ ...NEW_STARTER, hasAssessmentAttempts: true })
    expect(r.isNewStarter).toBe(false)
  })

  it('advances to modules once the profile is done', () => {
    const input = { ...NEW_STARTER, hasLearningProfile: true, modulesStarted: true }
    const r = computeJourney(input)
    expect(r.isNewStarter).toBe(false)
    expect(r.current).toBe('modules')
    expect(r.continueHref).toBe('/modules')
    expect(r.continueLabel).toBe('Continue: Video Modules')
    expect(stepState(input, 1)).toBe('done')
    expect(stepState(input, 3)).toBe('current')
  })

  it('advances to assessments once profile and all modules are done', () => {
    const input: JourneyInput = {
      ...NEW_STARTER,
      hasLearningProfile: true,
      completedModules: 10,
      modulesStarted: true,
    }
    const r = computeJourney(input)
    expect(r.current).toBe('assessments')
    expect(r.continueHref).toBe('/assessments')
    expect(stepState(input, 3)).toBe('done')
    expect(stepState(input, 5)).toBe('current')
  })

  it('reaches the passport when everything is complete', () => {
    const input: JourneyInput = {
      hasLearningProfile: true,
      completedModules: 10,
      totalModules: 10,
      completedAssessments: 15,
      totalAssessments: 15,
      hasAssessmentAttempts: true,
      modulesStarted: true,
      trainingDone: true,
      knowledgeDone: true,
    }
    const r = computeJourney(input)
    expect(r.current).toBe('passport')
    expect(r.continueHref).toBe('/passport')
    expect(r.continueLabel).toBe('View your Passport')
    expect(r.pct).toBe(100)
    expect(stepState(input, 6)).toBe('current')
  })

  it('computes overall percentage as an even weighting of the three tracked pillars', () => {
    // profile done (1) + half modules (0.5) + no assessments (0) => 1.5/3 = 50%
    const r = computeJourney({
      ...NEW_STARTER,
      hasLearningProfile: true,
      completedModules: 5,
      totalModules: 10,
    })
    expect(r.pct).toBe(50)
  })

  it('caps module progress so extra completions never exceed the total', () => {
    // completedModules clamped upstream; here completed == total marks it done
    const input = { ...NEW_STARTER, hasLearningProfile: true, completedModules: 10, totalModules: 10, modulesStarted: true }
    expect(stepState(input, 3)).toBe('done')
    expect(computeJourney(input).steps.find(s => s.n === 3)?.detail).toBe('All modules complete')
  })

  it('shows the Training Guide and Knowledge Base as explore steps until marked complete', () => {
    expect(stepState(NEW_STARTER, 2)).toBe('explore')
    expect(stepState(NEW_STARTER, 4)).toBe('explore')
    expect(stepState({ ...NEW_STARTER, trainingDone: true }, 2)).toBe('done')
    expect(stepState({ ...NEW_STARTER, knowledgeDone: true }, 4)).toBe('done')
  })
})
