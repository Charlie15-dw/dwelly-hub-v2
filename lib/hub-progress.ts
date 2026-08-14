import { createServerClient } from '@/lib/supabase/server'
import { MODULES } from '@/lib/data'
import { computeJourney, type JourneyResult } from '@/lib/hub-journey'
import { computeGuidedJourney, type GuidedJourneyResult } from '@/lib/hub-guided-journey'
import {
  computeSummary,
  computeSectionCompetency,
  certificationStatus,
  PASSPORT_MILESTONES,
  type PassportSummary,
  type SectionCompetency,
  type CertificationStatus,
  type ResultRow,
} from '@/lib/passport'
import { computeAchievements, type Achievement } from '@/lib/achievements-data'

// The single place Hub-home progress and the "Needs you" queue are computed.
// There used to be two "Overall progress" numbers (here and on the old
// dashboard) derived differently; this module is now the one source, so the
// hero count, the sidebar badge and the Needs-you card can never drift apart.
//
// Why this is computed server-side rather than in a Supabase `needs_you` view:
// the sources that would make up a "resolved" item — hub_questions and
// hub_training_requests — are deliberately locked to the service role (Q&A is
// anonymous; its submitter must never reach the client). Exposing them through
// a client-readable view would breach that. So Needs-you is built here, on the
// server, only from data the user is already allowed to read under RLS.

// Mirrors the dashboard's canonical 15 assessments.
export const ALL_ASSESSMENT_IDS = [
  'mnt-01', 'mnt-02', 'cmp-01', 'cmp-02', 'mnt-03', 'ins-02',
  'sys-01', 'mvt-02', 'sys-02', 'sup-02',
  'kno-01', 'kno-02', 'kno-03', 'full-assessment', 'master-assessment',
]

export type NeedsStage = 'overdue' | 'due' | 'resolved'

export interface NeedsYouItem {
  id: string
  title: string
  /** Short line naming the source section. */
  meta: string
  href: string
  stage: NeedsStage
  cta: string
}

export interface OverallProgress {
  pct: number
  completedModules: number
  totalModules: number
  completedAssessments: number
  totalAssessments: number
}

/** Everything the elevated (gated) Hub home renders, derived from the same
 *  assessment data as the rest of this helper so no number can drift. */
export interface MilestoneStatus {
  id: string
  label: string
  passed: boolean
}

export interface ElevatedHome {
  fullName: string
  summary: PassportSummary
  sections: SectionCompetency[]
  achievements: Achievement[]
  milestones: MilestoneStatus[]
  certification: CertificationStatus
  avgScore: number | null
}

export interface HubHome {
  firstName: string
  journey: JourneyResult
  guided: GuidedJourneyResult
  progress: OverallProgress
  needsYou: NeedsYouItem[]
  elevated: ElevatedHome
}

export async function getHubHome(userId: string, email: string | null | undefined): Promise<HubHome> {
  const supabase = createServerClient()

  const [
    { data: profile },
    { data: resultRows },
    { data: progressRows },
    { data: learningProfile },
    { data: completionRows },
  ] = await Promise.all([
    supabase.from('user_profiles').select('full_name').eq('id', userId).maybeSingle(),
    supabase.from('assessment_results').select('assessment_id, passed, score, completed_at').eq('user_id', userId),
    supabase.from('module_progress').select('module_id, completed').eq('user_id', userId),
    supabase.from('learning_profiles').select('completed_at').eq('user_id', userId).maybeSingle(),
    supabase.from('content_completions').select('content_type, content_id').eq('user_id', userId),
  ])

  // ── Progress (identical rules to the old hub page) ──────────────────────
  const passedIds = new Set(
    (resultRows ?? [])
      .filter(r => r.passed && ALL_ASSESSMENT_IDS.includes(r.assessment_id))
      .map(r => r.assessment_id),
  )
  const completedAssessments = passedIds.size
  const totalAssessments = ALL_ASSESSMENT_IDS.length

  const countableModuleIds = new Set(
    MODULES.filter(m => !m.locked && m.duration !== 'Always-on').map(m => m.id),
  )
  const completedModuleIds = new Set(
    (progressRows ?? []).filter(r => r.completed && countableModuleIds.has(r.module_id)).map(r => r.module_id),
  )
  const totalModules = countableModuleIds.size
  const completedModules = Math.min(completedModuleIds.size, totalModules)

  const SECTION_ID = '__section__'
  const completions = completionRows ?? []
  const trainingDone = completions.some(c => c.content_type === 'training' && c.content_id === SECTION_ID)
  const knowledgeDone = completions.some(c => c.content_type === 'knowledge' && c.content_id === SECTION_ID)

  const journeyInput = {
    hasLearningProfile: !!learningProfile,
    completedModules,
    totalModules,
    completedAssessments,
    totalAssessments,
    hasAssessmentAttempts: (resultRows ?? []).length > 0,
    modulesStarted: completedModuleIds.size > 0,
    trainingDone,
    knowledgeDone,
  }

  const journey = computeJourney(journeyInput)
  const guided = computeGuidedJourney(journeyInput)

  // ── Needs you ───────────────────────────────────────────────────────────
  // Only outstanding assessments surface here for now. The spaced-repetition
  // refreshers (recall_schedules) are deliberately not used yet, and the
  // self-paced Learning Profile / Video Modules steps live in the journey card
  // below rather than the queue.
  const needsYou: NeedsYouItem[] = []
  if (completedAssessments < totalAssessments) {
    needsYou.push({
      id: 'assessments',
      title: 'Pass your remaining assessments',
      meta: `${completedAssessments} of ${totalAssessments} passed · Assessments`,
      href: '/assessments',
      stage: 'due',
      cta: 'Open',
    })
  }

  const firstName = (profile?.full_name ?? email?.split('@')[0] ?? '').split(' ')[0]

  // ── Elevated home ─────────────────────────────────────────────────────────
  // Passport competency, achievements and milestone status for the gated
  // "Today first" home. All derived from the same assessment_results already
  // fetched above, so these numbers can never diverge from the journey/progress.
  const passportResults: ResultRow[] = (resultRows ?? []).map(r => ({
    assessment_id: r.assessment_id,
    score: r.score ?? 0,
    passed: !!r.passed,
    completed_at: r.completed_at ?? null,
  }))
  const summary = computeSummary(passportResults)
  const sections = computeSectionCompetency(passportResults)
  const achievements = computeAchievements(passportResults, userId)
  const milestones: MilestoneStatus[] = PASSPORT_MILESTONES.map(m => ({
    id: m.id,
    label: m.label,
    passed: passedIds.has(m.id),
  }))
  // Recert window is only known on the full Passport page; treat as not-yet-due
  // here so a certified user reads "Certified" rather than "Recert due".
  const certification = certificationStatus(summary, 1)
  const fullName = profile?.full_name?.trim() || firstName

  const elevated: ElevatedHome = {
    fullName,
    summary,
    sections,
    achievements,
    milestones,
    certification,
    avgScore: summary.avgScore,
  }

  return {
    firstName,
    journey,
    guided,
    progress: {
      pct: journey.pct,
      completedModules,
      totalModules,
      completedAssessments,
      totalAssessments,
    },
    needsYou,
    elevated,
  }
}
