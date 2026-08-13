import { createServerClient } from '@/lib/supabase/server'
import { MODULES } from '@/lib/data'
import { computeJourney, type JourneyResult } from '@/lib/hub-journey'
import { computeGuidedJourney, type GuidedJourneyResult } from '@/lib/hub-guided-journey'

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
  /** Count of items past their due date (drives the red hero/sidebar badge). */
  overdue: number
}

export interface HubHome {
  firstName: string
  journey: JourneyResult
  guided: GuidedJourneyResult
  progress: OverallProgress
  needsYou: NeedsYouItem[]
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function fmtDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export async function getHubHome(userId: string, email: string | null | undefined): Promise<HubHome> {
  const supabase = createServerClient()
  const today = todayISO()

  const [
    { data: profile },
    { data: resultRows },
    { data: progressRows },
    { data: learningProfile },
    { data: completionRows },
    { data: recallRows },
  ] = await Promise.all([
    supabase.from('user_profiles').select('full_name').eq('id', userId).maybeSingle(),
    supabase.from('assessment_results').select('assessment_id, passed').eq('user_id', userId),
    supabase.from('module_progress').select('module_id, completed').eq('user_id', userId),
    supabase.from('learning_profiles').select('completed_at').eq('user_id', userId).maybeSingle(),
    supabase.from('content_completions').select('content_type, content_id').eq('user_id', userId),
    supabase.from('recall_schedules').select('id, assessment_id, due_date, completed_at').eq('user_id', userId).is('completed_at', null),
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
  const needsYou: NeedsYouItem[] = []

  // Recall & Refresh checks are the only genuinely time-bound source: they
  // carry a real due_date. Anything before today is overdue; today is due.
  const recalls = (recallRows ?? [])
    .filter(r => r.due_date)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
  for (const r of recalls) {
    const overdue = r.due_date < today
    if (!overdue && r.due_date > today) continue // future — not yet on the queue
    needsYou.push({
      id: `recall-${r.id}`,
      title: 'Knowledge refresher due',
      meta: `${overdue ? 'Overdue' : 'Due today'} · ${fmtDate(r.due_date)} · Recap & Refresh`,
      href: '/recap',
      stage: overdue ? 'overdue' : 'due',
      cta: 'Refresh',
    })
  }

  // Self-paced training steps have no deadline, so they surface as "due" (never
  // overdue) to nudge without inventing a deadline that the data doesn't hold.
  if (!journeyInput.hasLearningProfile) {
    needsYou.push({
      id: 'profile',
      title: 'Complete your Learning Profile',
      meta: 'Takes a couple of minutes · Learning Profile',
      href: '/pre-training',
      stage: 'due',
      cta: 'Start',
    })
  }
  if (totalModules > 0 && completedModules < totalModules) {
    needsYou.push({
      id: 'modules',
      title: 'Finish your video modules',
      meta: `${completedModules} of ${totalModules} complete · Video Modules`,
      href: '/modules',
      stage: 'due',
      cta: 'Continue',
    })
  }
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

  const stageRank: Record<NeedsStage, number> = { overdue: 0, due: 1, resolved: 2 }
  needsYou.sort((a, b) => stageRank[a.stage] - stageRank[b.stage])

  const overdue = needsYou.filter(i => i.stage === 'overdue').length

  const firstName = (profile?.full_name ?? email?.split('@')[0] ?? '').split(' ')[0]

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
      overdue,
    },
    needsYou,
  }
}
