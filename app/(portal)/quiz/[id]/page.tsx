import { notFound } from 'next/navigation'
import {
  QUIZ_QUESTIONS,
  MODULES,
  RECAP_ROUNDS,
  PRODUCT_RELEASE_QUIZZES,
  PRODUCT_RELEASE_QUESTIONS,
} from '@/lib/data'
import { redirect } from 'next/navigation'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { isHubBeta, isHubElevated, isMaintenancePreview } from '@/lib/preview'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { CRM2_LESSONS, CRM2_CAPSTONE_MODULE_ID, CRM2_CAPSTONE_SAMPLE } from '@/lib/crm2-content'
import { MAINTENANCE_LESSONS } from '@/lib/crm2-maintenance-content'
import QuizClient, { type QuizCategory } from './QuizClient'

// Video module sections (3 questions each for combined assessments). Maintenance
// and compliance are no longer drawn from the retired mnt-02 / cmp-02 quizzes —
// CRM 2.0 now carries that content (see the CRM 2.0 pools below).
const VIDEO_MODULE_IDS = ['mvt-02', 'ins-02', 'sup-02']

// CRM 2.0 now supplies the maintenance and compliance questions for the combined
// Full and Master assessments. Three from each keeps the Full assessment at 5
// sections / 15 questions and the Master at its 27-question total.
const CRM2_MAINTENANCE_QUIZ_IDS = MAINTENANCE_LESSONS
  .map(l => l.quizModuleId)
  .filter((m): m is string => Boolean(m))
const CRM2_COMPLIANCE_QUIZ_IDS = CRM2_LESSONS
  .map(l => l.quizModuleId)
  .filter((m): m is string => Boolean(m) && m !== CRM2_CAPSTONE_MODULE_ID)

// First N base-tier questions across a set of CRM 2.0 lesson quizzes.
function firstCrm2Questions(ids: readonly string[], n: number) {
  return ids
    .flatMap(mid => QUIZ_QUESTIONS.filter(q => q.moduleId === mid && !q.tier))
    .slice(0, n)
}
// The knowledge base — the three knowledge modules plus the portal content
// (Tenant, Landlord & Maintenance Provider portals). Used both for the combined
// Knowledge Base assessment and for the knowledge half of the Master assessment.
const KNOWLEDGE_ASSESSMENT_IDS = ['kno-01', 'kno-02', 'kno-03', 'kno-portals']
const KNOWLEDGE_ASSESSMENT_SAMPLE = 24
const PER_SECTION = 3

// How many questions to show per module assessment (samples from the full pool)
const ASSESSMENT_QUESTION_COUNTS: Record<string, number> = {
  'mnt-01': 6,  'mnt-02': 10, 'mnt-03': 5,
  'cmp-01': 6,  'cmp-02': 8,
  'ins-02': 6,  'mvt-02': 8,
  'sys-01': 5,  'sys-02': 5,  'sup-02': 6,
  'kno-01': 5,  'kno-02': 7,  'kno-03': 5,
}

export default async function QuizPage({ params }: { params: { id: string } }) {
  const moduleId = params.id

  const isFullAssessment      = moduleId === 'full-assessment'
  const isMasterAssessment    = moduleId === 'master-assessment'
  const isKnowledgeAssessment = moduleId === 'knowledge-assessment'
  const isRecapQuiz        = moduleId.startsWith('recap-')
  const isReleaseQuiz      = moduleId.startsWith('release-')
  const isRecallQuiz       = moduleId.startsWith('recall-')
  const isCrm2Quiz         = moduleId.startsWith('crm2-')

  // Maintenance quizzes share the crm2- prefix but are still preview-only.
  const isMaintQuiz = MAINTENANCE_LESSONS.some(l => l.quizModuleId === moduleId)

  // CRM 2.0 quizzes are private — gate them to the same allow-list as the
  // lessons before doing anything else. Maintenance ones are gated tighter, to
  // the maintenance preview, so they stay locked even by direct URL.
  if (isCrm2Quiz) {
    const auth = createServerClient()
    const { data: { user } } = await auth.auth.getUser()
    if (!user) redirect('/')
    if (!(await canAccessCrm2(auth, user))) redirect('/hub')
    if (isMaintQuiz && !isMaintenancePreview(user.email)) redirect('/hub/crm-2')
  }

  // ── Determine quiz category and metadata ────────────────────────────────

  let quizCategory: QuizCategory = 'module'
  let moduleTitle = 'Knowledge Check'
  let passmark = 80
  let backHref = `/modules/${moduleId}`
  let backLabel = 'Back to Module'

  // Recall: recall-{baseId}-{days}
  let recallLabel: string | undefined
  let recallModuleTitle: string | undefined

  // Recap
  let recapLabel: string | undefined
  let recapTheme: string | undefined
  let recapQuestionModuleIds: string[] | undefined
  let recapModuleTitles: Record<string, string> | undefined

  if (isMasterAssessment) {
    quizCategory = 'master'
    moduleTitle  = 'Master Assessment — All Sections'
    passmark     = 80
    backHref     = '/assessments'
    backLabel    = 'Back to Assessments'
  } else if (isFullAssessment) {
    quizCategory = 'full'
    moduleTitle  = 'Full Assessment — Video Modules'
    passmark     = 80
    backHref     = '/assessments'
    backLabel    = 'Back to Assessments'
  } else if (isKnowledgeAssessment) {
    quizCategory = 'knowledge'
    moduleTitle  = 'Knowledge Base Assessment — All Sections'
    passmark     = 80
    backHref     = '/assessments'
    backLabel    = 'Back to Assessments'
  } else if (isRecapQuiz) {
    const recapRound = RECAP_ROUNDS.find(r => r.id === moduleId)
    if (!recapRound) notFound()
    quizCategory           = 'recap'
    moduleTitle            = `Monthly Recap — ${recapRound.label}`
    passmark               = 0
    backHref               = '/recap'
    backLabel              = 'Back to Recap & Refresh'
    recapLabel             = recapRound.label
    recapTheme             = recapRound.theme
    recapQuestionModuleIds = recapRound.questionModuleIds
    recapModuleTitles      = Object.fromEntries(
      recapRound.questionModuleIds.map(mid => [mid, MODULES.find(m => m.id === mid)?.title ?? mid])
    )
  } else if (isRecallQuiz) {
    const recallMatch = moduleId.match(/^recall-(.+)-(\d+)$/)
    if (!recallMatch) notFound()
    const recallBase = recallMatch[1]
    const recallDays = parseInt(recallMatch[2])
    recallLabel         = recallDays === 3 ? '3-day' : recallDays === 7 ? '7-day' : '30-day'
    recallModuleTitle   = MODULES.find(m => m.id === recallBase)?.title ?? recallBase
    quizCategory        = 'recall'
    moduleTitle         = `Recall Check — ${recallModuleTitle}`
    passmark            = 0
    backHref            = '/assessments'
    backLabel           = 'Back to Assessments'
  } else if (isReleaseQuiz) {
    const releaseQuiz = PRODUCT_RELEASE_QUIZZES.find(r => r.id === moduleId)
    if (!releaseQuiz) notFound()
    quizCategory = 'release'
    moduleTitle  = releaseQuiz.title
    passmark     = releaseQuiz.passmark
    backHref     = '/recap'
    backLabel    = 'Back to Recap & Refresh'
  } else if (isCrm2Quiz) {
    const lesson = CRM2_LESSONS.find(l => l.quizModuleId === moduleId)
      ?? MAINTENANCE_LESSONS.find(l => l.quizModuleId === moduleId)
    if (!lesson) notFound()
    quizCategory = 'crm2'
    moduleTitle  = `${lesson.title} — Knowledge Check`
    passmark     = 80
    backHref     = isMaintQuiz ? `/hub/crm-2/maintenance/${lesson.slug}` : `/hub/crm-2/${lesson.slug}`
    backLabel    = 'Back to lesson'
  } else {
    // Regular module assessment
    const mod = MODULES.find(m => m.id === moduleId)
    if (!mod) notFound()
    moduleTitle = mod.title
    passmark    = mod.passmark
  }

  // ── Build question pool (server-side, never sent to client bundle) ───────

  let questionPool = QUIZ_QUESTIONS.filter(() => false) // typed empty default

  if (isMasterAssessment) {
    // Master spans Move-Outs, Inspections and Support (master tier) and the full
    // knowledge base including the portal content (kno-portals), plus CRM 2.0
    // maintenance and compliance. 27 questions total.
    questionPool = [
      ...[...VIDEO_MODULE_IDS, ...KNOWLEDGE_ASSESSMENT_IDS].flatMap(mid =>
        QUIZ_QUESTIONS.filter(q => q.moduleId === mid && q.tier === 'master')
      ),
      ...firstCrm2Questions(CRM2_MAINTENANCE_QUIZ_IDS, PER_SECTION),
      ...firstCrm2Questions(CRM2_COMPLIANCE_QUIZ_IDS, PER_SECTION),
    ]
  } else if (isFullAssessment) {
    // Move-Outs, Inspections and Support come from the video modules; maintenance
    // and compliance now come from CRM 2.0. 5 sections / 15 questions.
    questionPool = [
      ...VIDEO_MODULE_IDS.flatMap(mid =>
        QUIZ_QUESTIONS.filter(q => q.moduleId === mid && !q.tier).slice(0, PER_SECTION)
      ),
      ...firstCrm2Questions(CRM2_MAINTENANCE_QUIZ_IDS, PER_SECTION),
      ...firstCrm2Questions(CRM2_COMPLIANCE_QUIZ_IDS, PER_SECTION),
    ]
  } else if (isKnowledgeAssessment) {
    // Combined Knowledge Base assessment — the three knowledge modules plus the
    // portal content. The client shuffles and samples this down per learner.
    questionPool = KNOWLEDGE_ASSESSMENT_IDS.flatMap(mid =>
      QUIZ_QUESTIONS.filter(q => q.moduleId === mid && !q.tier)
    )
  } else if (isRecapQuiz && recapQuestionModuleIds) {
    // Pass the full recap-tier pool — client will shuffle and sample down
    questionPool = recapQuestionModuleIds.flatMap(mid =>
      QUIZ_QUESTIONS.filter(q => q.moduleId === mid && q.tier === 'recap')
    )
  } else if (isRecallQuiz) {
    const recallMatch = moduleId.match(/^recall-(.+)-(\d+)$/)
    if (recallMatch) {
      questionPool = QUIZ_QUESTIONS.filter(q => q.moduleId === recallMatch[1] && !q.tier)
    }
  } else if (isReleaseQuiz) {
    questionPool = PRODUCT_RELEASE_QUESTIONS.filter(q => q.releaseId === moduleId)
  } else if (moduleId === CRM2_CAPSTONE_MODULE_ID) {
    // Capstone: aggregate the pool from every CRM 2.0 lesson quiz (not the
    // capstone itself). The client shuffles and samples this down.
    const crm2ModuleIds = new Set(
      CRM2_LESSONS
        .map(l => l.quizModuleId)
        .filter((m): m is string => Boolean(m) && m !== CRM2_CAPSTONE_MODULE_ID)
    )
    questionPool = QUIZ_QUESTIONS.filter(q => crm2ModuleIds.has(q.moduleId) && !q.tier)
  } else {
    // Covers regular module assessments and CRM 2.0 lesson quizzes.
    questionPool = QUIZ_QUESTIONS.filter(q => q.moduleId === moduleId && !q.tier)
  }

  const sampleSize = isRecapQuiz
    ? RECAP_ROUNDS.find(r => r.id === moduleId)?.questionCount ?? questionPool.length
    : moduleId === CRM2_CAPSTONE_MODULE_ID
      ? CRM2_CAPSTONE_SAMPLE
      : isKnowledgeAssessment
        ? Math.min(KNOWLEDGE_ASSESSMENT_SAMPLE, questionPool.length)
        : ASSESSMENT_QUESTION_COUNTS[moduleId] ?? questionPool.length

  // Beta gate — confidence-based scoring is trialled with a single test account.
  // Elevated gate — the two review accounts see the redesigned quiz flow.
  let beta = false
  let elevated = false
  try {
    const auth = createServerClient()
    const { data: { user } } = await auth.auth.getUser()
    beta = isHubBeta(user?.email)
    elevated = isHubElevated(user?.email)
  } catch {
    // Non-critical — quiz still loads without the beta confidence UI.
  }

  // Lock / unlock, decided server-side so RLS never blocks it.
  //
  // A completed attempt (pass or fail) locks the assessment. A manager "reassign"
  // inserts an un-consumed module_resets row to grant a retake. The retake grant
  // stays live until it is actually USED — i.e. until a new attempt is recorded
  // AFTER the reset was created. Crucially we do NOT consume the reset just
  // because the quiz page was opened: viewing must never burn a granted retake
  // (that bug left people locked out after merely looking at the assessment).
  let wasReset = false
  let lockedByDb = false
  let lastAttempt: { score: number; passed: boolean; completedAt: string } | undefined
  if (!isRecapQuiz && !isRecallQuiz) {
    try {
      const auth = createServerClient()
      const { data: { user } } = await auth.auth.getUser()
      if (user) {
        const service = createServiceClient()

        // This user's most recent attempt for this assessment. Read via the
        // service role (not the RLS-gated auth client): in a Server Component
        // createServerClient can't refresh a stale session cookie, so an
        // auth-client read can silently return no rows and leave the assessment
        // unlocked. Reading through the service role makes the lock decision
        // independent of session freshness, matching the reset read below and
        // the admin overview.
        const { data: attempts } = await service
          .from('assessment_results')
          .select('score, passed, completed_at')
          .eq('user_id', user.id)
          .eq('assessment_id', moduleId)
          .order('completed_at', { ascending: false })
          .limit(1)
        const last = attempts?.[0]

        // Any live (un-consumed) retake grant, newest first.
        const { data: resets } = await service
          .from('module_resets')
          .select('id, created_at')
          .eq('user_id', user.id)
          .eq('module_id', moduleId)
          .is('consumed_at', null)
          .order('created_at', { ascending: false })
        const pendingReset = resets?.[0]

        const toAttempt = () => ({
          score: last?.score ?? 0,
          passed: last?.passed ?? false,
          completedAt: last?.completed_at ?? '',
        })

        if (pendingReset) {
          // Has the granted retake already been used? Only if there's an attempt
          // dated after the reset was created.
          const retakeUsed = Boolean(
            last?.completed_at && Date.parse(last.completed_at) > Date.parse(pendingReset.created_at)
          )
          if (retakeUsed) {
            // Retake spent — consume every live reset and lock again on the
            // fresh attempt.
            await service
              .from('module_resets')
              .update({ consumed_at: new Date().toISOString() })
              .eq('user_id', user.id)
              .eq('module_id', moduleId)
              .is('consumed_at', null)
            lockedByDb = true
            lastAttempt = toAttempt()
          } else {
            // Retake still available — unlocked. Signal a fresh start so any
            // stale in-progress session from the previous attempt is cleared.
            wasReset = true
          }
        } else if (last) {
          // No retake granted and there's a completed attempt — locked.
          lockedByDb = true
          lastAttempt = toAttempt()
        }
      }
    } catch {
      // Non-critical — quiz will still load, lock check falls through to client
    }
  }

  return (
    <QuizClient
      moduleId={moduleId}
      moduleTitle={moduleTitle}
      passmark={passmark}
      quizCategory={quizCategory}
      questionPool={questionPool}
      sampleSize={sampleSize}
      backHref={backHref}
      backLabel={backLabel}
      wasReset={wasReset}
      lockedByDb={lockedByDb}
      lastAttempt={lastAttempt}
      beta={beta}
      elevated={elevated}
      recapLabel={recapLabel}
      recapTheme={recapTheme}
      recapQuestionModuleIds={recapQuestionModuleIds}
      recapModuleTitles={recapModuleTitles}
      recallLabel={recallLabel}
      recallModuleTitle={recallModuleTitle}
    />
  )
}
