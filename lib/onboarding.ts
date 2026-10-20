// Staged onboarding — the stage → content map and server-side state computation.
//
// This is the rich half (it imports the content data files), so it is only ever
// used by the getting-started server pages and the advance API, never by
// middleware. The lightweight gate lives in lib/onboarding-gate.ts.
//
// Each stage pulls the real content already in the Hub so the two never drift:
//   1 Maintenance  — CRM 2.0 maintenance guides + their knowledge checks
//   2 Compliance   — CRM 2.0 compliance guides + their knowledge checks
//   3 Move-outs    — written guide + video guides + module assessments
//   4 Inspections  — written guide + video guides + module assessments
//   5 Support      — written guide + video guides + module assessments
//   6 Right to Rent— written guide only (no videos, no assessments)

import type { createServerClient } from '@/lib/supabase/server'
import { MAINTENANCE_GUIDES } from '@/lib/crm2-maintenance-content'
import { CRM2_GUIDES } from '@/lib/crm2-content'
import { getTrainingPage } from '@/lib/training-content'
import { MODULES, type ModuleSection } from '@/lib/data'
import {
  CRM2_CONTENT_TYPE,
  crm2ContentId,
  MAINTENANCE_CONTENT_TYPE,
  maintenanceContentId,
} from '@/lib/crm2-completions'
import { FIRST_STAGE, GRADUATED_STAGE } from '@/lib/onboarding-gate'

export { FIRST_STAGE, GRADUATED_STAGE }

// Written guides are the required part of a stage. "completion" points at the
// row these pages already write into content_completions, so we read the exact
// same store the lesson's own "Mark as read" button writes to.
export interface OnboardingGuide {
  title: string
  href: string
  completion: { contentType: string; contentId: string }
}

// Video guides are supporting material (stages 3–5). Surfaced as links; not
// required to advance — the knowledge they cover is examined by the assessments.
export interface OnboardingVideo {
  title: string
  href: string
}

// Assessments are the deferrable "come back to this" part — the quiz pages that
// record into assessment_results.
export interface OnboardingAssessment {
  title: string
  assessmentId: string
  href: string
}

export interface OnboardingStageDef {
  n: number
  key: string
  label: string
  blurb: string
  guides: OnboardingGuide[]
  videos: OnboardingVideo[]
  assessments: OnboardingAssessment[]
}

// A move-outs / inspections / support stage: one written guide plus the section's
// video modules, whose quizzes become the stage's assessments.
function videoStage(
  n: number,
  key: string,
  label: string,
  blurb: string,
  trainingId: string,
  section: ModuleSection,
): OnboardingStageDef {
  const page = getTrainingPage(trainingId)
  const mods = MODULES.filter((m) => m.section === section)
  return {
    n,
    key,
    label,
    blurb,
    guides: page
      ? [{
          title: page.title,
          href: `/training/${page.id}`,
          completion: { contentType: 'training', contentId: page.id },
        }]
      : [],
    videos: mods.map((m) => ({ title: m.title, href: `/modules/${m.id}` })),
    assessments: mods.map((m) => ({ title: m.title, assessmentId: m.id, href: `/quiz/${m.id}` })),
  }
}

export const ONBOARDING_STAGES: OnboardingStageDef[] = [
  {
    n: 1,
    key: 'maintenance',
    label: 'Maintenance',
    blurb: 'Learn how maintenance runs end to end in CRM 2.0 — raising, actioning and closing repair work.',
    guides: MAINTENANCE_GUIDES.map((l) => ({
      title: l.title,
      href: `/hub/crm-2/maintenance/${l.slug}`,
      completion: { contentType: MAINTENANCE_CONTENT_TYPE, contentId: maintenanceContentId(l.slug) },
    })),
    videos: [],
    assessments: MAINTENANCE_GUIDES.filter((l) => l.quizModuleId).map((l) => ({
      title: l.title,
      assessmentId: l.quizModuleId as string,
      href: `/quiz/${l.quizModuleId}`,
    })),
  },
  {
    n: 2,
    key: 'compliance',
    label: 'Compliance',
    blurb: 'Keep every property compliant in CRM 2.0 — certificates, remedial works and escalations.',
    guides: CRM2_GUIDES.map((l) => ({
      title: l.title,
      href: `/hub/crm-2/${l.slug}`,
      completion: { contentType: CRM2_CONTENT_TYPE, contentId: crm2ContentId(l.slug) },
    })),
    videos: [],
    assessments: CRM2_GUIDES.filter((l) => l.quizModuleId).map((l) => ({
      title: l.title,
      assessmentId: l.quizModuleId as string,
      href: `/quiz/${l.quizModuleId}`,
    })),
  },
  videoStage(
    3,
    'move-outs',
    'Move-outs',
    'Run a move-out from notice through to the final close, including the video walkthroughs.',
    'move-outs',
    'move-outs',
  ),
  videoStage(
    4,
    'inspections',
    'Inspections',
    'Book, carry out and complete property inspections, including the video walkthroughs.',
    'inspections',
    'inspections',
  ),
  videoStage(
    5,
    'support',
    'Support',
    'Handle support tasks the Dwelly way, including the video walkthroughs.',
    'support',
    'support',
  ),
  {
    n: 6,
    key: 'right-to-rent',
    label: 'Right to Rent',
    blurb: 'Your legal duties around Right to Rent checks — the final step before the full Hub opens up.',
    guides: (() => {
      const page = getTrainingPage('right-to-rent')
      return page
        ? [{
            title: page.title,
            href: `/training/${page.id}`,
            completion: { contentType: 'training', contentId: page.id },
          }]
        : []
    })(),
    videos: [],
    assessments: [],
  },
]

export function getStageDef(stage: number): OnboardingStageDef | undefined {
  return ONBOARDING_STAGES.find((s) => s.n === stage)
}

// ── Server-side state for the getting-started shell ────────────────────────

export interface OnboardingGuideState extends OnboardingGuide { done: boolean }
export interface OnboardingAssessmentState extends OnboardingAssessment { passed: boolean }

export interface OnboardingStageState {
  def: OnboardingStageDef
  guides: OnboardingGuideState[]
  videos: OnboardingVideo[]
  assessments: OnboardingAssessmentState[]
  guidesComplete: boolean   // every required written guide marked read
  assessmentsUnlocked: boolean // the "come back to this" tab is available
  assessmentsComplete: boolean // every assessment passed (not required to advance)
  canAdvance: boolean       // written guides done → may move to the next stage
}

type ServerClient = ReturnType<typeof createServerClient>

// Reads the user's completion + assessment rows once and resolves the current
// stage's state. canAdvance is true as soon as the written guides are done —
// outstanding assessments never block moving on (they can be returned to later).
export async function getStageState(
  supabase: ServerClient,
  userId: string,
  stage: number,
): Promise<OnboardingStageState | null> {
  const def = getStageDef(stage)
  if (!def) return null

  const [{ data: completions }, { data: results }] = await Promise.all([
    supabase
      .from('content_completions')
      .select('content_type, content_id')
      .eq('user_id', userId),
    supabase
      .from('assessment_results')
      .select('assessment_id, passed')
      .eq('user_id', userId),
  ])

  const doneSet = new Set((completions ?? []).map((r) => `${r.content_type}::${r.content_id}`))
  const passedSet = new Set((results ?? []).filter((r) => r.passed).map((r) => r.assessment_id))

  const guides: OnboardingGuideState[] = def.guides.map((g) => ({
    ...g,
    done: doneSet.has(`${g.completion.contentType}::${g.completion.contentId}`),
  }))
  const assessments: OnboardingAssessmentState[] = def.assessments.map((a) => ({
    ...a,
    passed: passedSet.has(a.assessmentId),
  }))

  const guidesComplete = guides.length > 0 ? guides.every((g) => g.done) : true
  const assessmentsComplete = assessments.length > 0 ? assessments.every((a) => a.passed) : true

  return {
    def,
    guides,
    videos: def.videos,
    assessments,
    guidesComplete,
    assessmentsUnlocked: guidesComplete,
    assessmentsComplete,
    canAdvance: guidesComplete,
  }
}
