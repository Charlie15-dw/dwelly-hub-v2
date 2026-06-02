import { notFound } from 'next/navigation'
import {
  QUIZ_QUESTIONS,
  MODULES,
  RECAP_ROUNDS,
  PRODUCT_RELEASE_QUIZZES,
  PRODUCT_RELEASE_QUESTIONS,
} from '@/lib/data'
import QuizClient, { type QuizCategory } from './QuizClient'

// Video module sections (3 questions each for combined assessments)
const VIDEO_MODULE_IDS = ['mnt-02', 'cmp-02', 'mvt-02', 'ins-02', 'sup-02']
const KNOWLEDGE_IDS    = ['kno-01', 'kno-02', 'kno-03']
const PER_SECTION = 3

// How many questions to show per module assessment (samples from the full pool)
const ASSESSMENT_QUESTION_COUNTS: Record<string, number> = {
  'mnt-01': 6,  'mnt-02': 10, 'mnt-03': 5,
  'cmp-01': 6,  'cmp-02': 15,
  'ins-02': 6,  'mvt-02': 8,
  'sys-01': 5,  'sys-02': 5,  'sup-02': 6,
  'kno-01': 5,  'kno-02': 7,  'kno-03': 5,
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const moduleId = params.id

  const isFullAssessment   = moduleId === 'full-assessment'
  const isMasterAssessment = moduleId === 'master-assessment'
  const isRecapQuiz        = moduleId.startsWith('recap-')
  const isReleaseQuiz      = moduleId.startsWith('release-')
  const isRecallQuiz       = moduleId.startsWith('recall-')

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
    questionPool = [...VIDEO_MODULE_IDS, ...KNOWLEDGE_IDS].flatMap(mid =>
      QUIZ_QUESTIONS.filter(q => q.moduleId === mid && q.tier === 'master')
    )
  } else if (isFullAssessment) {
    questionPool = VIDEO_MODULE_IDS.flatMap(mid =>
      QUIZ_QUESTIONS.filter(q => q.moduleId === mid && !q.tier).slice(0, PER_SECTION)
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
  } else {
    questionPool = QUIZ_QUESTIONS.filter(q => q.moduleId === moduleId && !q.tier)
  }

  const sampleSize = isRecapQuiz
    ? RECAP_ROUNDS.find(r => r.id === moduleId)?.questionCount ?? questionPool.length
    : ASSESSMENT_QUESTION_COUNTS[moduleId] ?? questionPool.length

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
      recapLabel={recapLabel}
      recapTheme={recapTheme}
      recapQuestionModuleIds={recapQuestionModuleIds}
      recapModuleTitles={recapModuleTitles}
      recallLabel={recallLabel}
      recallModuleTitle={recallModuleTitle}
    />
  )
}
