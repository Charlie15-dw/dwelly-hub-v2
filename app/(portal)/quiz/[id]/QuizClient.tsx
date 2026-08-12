'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, CheckCircle2, XCircle, ChevronRight,
  Clock, Trophy, ArrowRight, ClipboardCheck, RefreshCw, BookOpen, Lock,
} from 'lucide-react'
import type { QuizQuestion } from '@/lib/data'
import { cn } from '@/lib/utils'
import { getInProgress, saveInProgress, clearInProgress } from '@/lib/assessmentStorage'
import { createClient } from '@/lib/supabase/client'
import { hashStr, seededShuffle, getBrowserKey } from '@/lib/shuffle'
import { scoreQuiz } from '@/lib/quiz-scoring'

/** Shuffle the options of a question and recalculate the correct index */
function shuffleOptions(q: QuizQuestion, seed: number): QuizQuestion {
  const newOrder = seededShuffle(Array.from({ length: q.options.length }, (_, i) => i), seed)
  return {
    ...q,
    options: newOrder.map(i => q.options[i]),
    correct: newOrder.indexOf(q.correct),
  }
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

/** Shown on a results screen when a result/progress write to Supabase failed. */
function SaveErrorBanner() {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 mb-6 text-left" role="alert">
      <p className="text-sm font-bold text-red-700 mb-1">We couldn&apos;t save this result</p>
      <p className="text-xs text-red-600 leading-relaxed">
        Your answers were scored correctly, but there was a problem saving them to your record.
        Please check your connection and try again, or let your manager know so it can be recorded manually.
      </p>
    </div>
  )
}

export type QuizCategory = 'module' | 'full' | 'master' | 'recap' | 'recall' | 'release' | 'crm2'

// Confidence-based scoring (beta). Learners rate how sure they are before
// seeing the answer. A confident mistake is a hidden gap worth flagging — much
// more useful to surface than a lucky guess that happened to be right.
type ConfidenceLevel = 'high' | 'medium' | 'low'
const CONFIDENCE_OPTIONS: { value: ConfidenceLevel; label: string }[] = [
  { value: 'high', label: 'Sure' },
  { value: 'medium', label: 'Fairly sure' },
  { value: 'low', label: 'Guessing' },
]

export interface QuizClientProps {
  moduleId: string
  moduleTitle: string
  passmark: number
  quizCategory: QuizCategory
  questionPool: QuizQuestion[]
  sampleSize: number
  backHref: string
  backLabel: string
  // recap-specific
  recapLabel?: string
  recapTheme?: string
  recapQuestionModuleIds?: string[]
  recapModuleTitles?: Record<string, string>
  // recall-specific
  recallLabel?: string
  recallModuleTitle?: string
  recallDays?: number
  // set to true when server detected and consumed a pending manager reset
  wasReset?: boolean
  // DB-authoritative lock: computed server-side from this user's own
  // assessment_results, so it can never pick up another user's completions.
  lockedByDb?: boolean
  lastAttempt?: { score: number; passed: boolean; completedAt: string }
  // beta-gated features (confidence-based scoring)
  beta?: boolean
}

export default function QuizClient({
  moduleId,
  moduleTitle,
  passmark,
  quizCategory,
  questionPool,
  sampleSize,
  backHref,
  backLabel,
  recapLabel,
  recapTheme,
  recapQuestionModuleIds,
  recapModuleTitles,
  recallLabel,
  recallModuleTitle,
  wasReset = false,
  lockedByDb = false,
  lastAttempt,
  beta = false,
}: QuizClientProps) {
  const isFullAssessment   = quizCategory === 'full'
  const isMasterAssessment = quizCategory === 'master'
  const isRecapQuiz        = quizCategory === 'recap'
  const isRecallQuiz       = quizCategory === 'recall'
  const isReleaseQuiz      = quizCategory === 'release'
  // CRM 2.0 lesson quizzes: a private, freely-retakeable practice assessment.
  // They keep a real pass mark but never lock and never write to the shared
  // assessment tables the manager dashboard reads.
  const isCrm2Quiz         = quizCategory === 'crm2'

  // Stable question list — computed once on mount so re-renders don't reshuffle
  const [demoQuestions] = useState<QuizQuestion[]>(() => {
    const browserKey = getBrowserKey()

    if (isMasterAssessment || isFullAssessment) {
      return questionPool
    }
    if (isRecapQuiz) {
      return shuffle(questionPool).slice(0, sampleSize)
    }
    if (isRecallQuiz) {
      return shuffle(questionPool).slice(0, 3)
    }
    if (isReleaseQuiz) {
      if (!browserKey) return questionPool
      return seededShuffle(questionPool, hashStr(browserKey + moduleId))
        .map(q => shuffleOptions(q, hashStr(browserKey + q.id)))
    }
    // Regular module assessment
    if (!browserKey) return questionPool.slice(0, sampleSize)
    return seededShuffle(questionPool, hashStr(browserKey + moduleId))
      .slice(0, sampleSize)
      .map(q => shuffleOptions(q, hashStr(browserKey + q.id)))
  })

  const [currentQ, setCurrentQ]       = useState(0)
  const [selected, setSelected]        = useState<number | null>(null)
  const [submitted, setSubmitted]      = useState(false)
  // Confidence-based scoring (beta) — captured per question before submitting.
  const [confidence, setConfidence]    = useState<ConfidenceLevel | null>(null)
  const [confidences, setConfidences]  = useState<(ConfidenceLevel | null)[]>(new Array(demoQuestions.length).fill(null))
  const [answers, setAnswers]          = useState<(number | null)[]>(new Array(demoQuestions.length).fill(null))
  const [showResults, setShowResults]  = useState(false)
  const [quizStarted, setQuizStarted]  = useState(false)
  const [scheduleId, setScheduleId]    = useState<string | null>(null)
  // True when a critical result/progress write to Supabase failed, so we can
  // warn the user rather than silently losing their result.
  const [saveError, setSaveError]      = useState(false)

  // Read scheduleId from URL on mount (recall quizzes only)
  useEffect(() => {
    if (!isRecallQuiz) return
    const params = new URLSearchParams(window.location.search)
    setScheduleId(params.get('schedule'))
  }, [isRecallQuiz])

  // Resume any in-progress session on mount. Lock status is decided
  // server-side (lockedByDb) and rendered before we get here, so there's
  // nothing to check locally.
  useEffect(() => {
    if (isRecapQuiz || isRecallQuiz) return

    // Server already consumed the pending reset before this page rendered
    if (wasReset) {
      clearInProgress(moduleId)
      return
    }

    if (lockedByDb) return

    const session = getInProgress(moduleId)
    if (session && session.submittedUpTo >= 0) {
      const restoredAnswers = [...session.answers]
      while (restoredAnswers.length < demoQuestions.length) restoredAnswers.push(null)
      setAnswers(restoredAnswers)
      const resumeQ = session.submittedUpTo + 1
      setCurrentQ(Math.min(resumeQ, demoQuestions.length - 1))
      if (session.submittedUpTo >= demoQuestions.length - 1) {
        setShowResults(true)
      }
      setQuizStarted(true)
    }
  }, [moduleId, wasReset, lockedByDb, isRecapQuiz, isRecallQuiz, demoQuestions.length])

  // Save recall result to Supabase and mark schedule complete
  useEffect(() => {
    if (!showResults || !isRecallQuiz) return
    async function saveRecallResult() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('assessment_results').insert({
        user_id: user.id,
        assessment_id: moduleId,
        score,
        passed: true,
        completed_at: new Date().toISOString(),
      })
      if (error) {
        console.error('Failed to save recall result', error)
        setSaveError(true)
        return
      }
      if (scheduleId) {
        await fetch('/api/quiz/complete-recall', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheduleId, score }),
        })
      }
    }
    saveRecallResult()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults])

  // Save recap result to Supabase when results appear
  useEffect(() => {
    if (!showResults || !isRecapQuiz) return
    async function saveRecapToSupabase() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase.from('assessment_results').insert({
        user_id: user.id,
        assessment_id: moduleId,
        score,
        passed: true,
        completed_at: new Date().toISOString(),
      })
      if (error) {
        console.error('Failed to save recap result', error)
        setSaveError(true)
      }
    }
    saveRecapToSupabase()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults])

  // Save attempt to Supabase when the results screen appears. The DB row is
  // the single source of truth for both the score record and the lock state.
  useEffect(() => {
    if (!showResults || isRecapQuiz || isRecallQuiz) return
    clearInProgress(moduleId)

    async function saveToSupabase() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('assessment_sessions')
        .delete()
        .eq('user_id', user.id)
        .eq('module_id', moduleId)

      const allAnswers = demoQuestions.map((q, i) => {
        const userAns = answers[i]
        return {
          question: q.question,
          yourAnswer: userAns !== null ? q.options[userAns] : 'No answer',
          correctAnswer: q.options[q.correct],
          isCorrect: userAns === q.correct,
          rationale: q.rationale,
        }
      })

      const { error: resultError } = await supabase.from('assessment_results').insert({
        user_id: user.id,
        assessment_id: moduleId,
        score,
        passed,
        answers: allAnswers,
        completed_at: new Date().toISOString(),
      })
      if (resultError) {
        console.error('Failed to save assessment result', resultError)
        setSaveError(true)
      }

      // CRM 2.0 quizzes have no backing video module and no recall content, so
      // skip the module_progress upsert and the recall scheduling — but they do
      // still lock and save a scored result above, like any other assessment.
      if (passed && !isFullAssessment && !isMasterAssessment && !isReleaseQuiz && !isCrm2Quiz) {
        const { error: progressError } = await supabase.from('module_progress').upsert({
          user_id: user.id,
          module_id: moduleId,
          progress: 100,
          completed: true,
          last_watched_at: new Date().toISOString(),
        }, { onConflict: 'user_id,module_id' })
        if (progressError) {
          console.error('Failed to save module progress', progressError)
          setSaveError(true)
        }
      }

      if (passed && !isFullAssessment && !isMasterAssessment && !isReleaseQuiz && !isCrm2Quiz) {
        void fetch('/api/quiz/schedule-recall', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assessmentId: moduleId }),
        })
      }
    }
    saveToSupabase()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults])

  // ── Locked screen ─────────────────────────────────────────────────────────
  if (lockedByDb) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <Link href={backHref} className="text-sm text-slate-500 hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>
        <div className="card p-10 text-center">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5 bg-slate-100">
            <Lock className="w-9 h-9 text-slate-400" aria-hidden />
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Assessment Locked</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
            You&apos;ve already completed this assessment. Your manager will unlock a retake
            once they&apos;ve reviewed your result.
          </p>
          {lastAttempt && (
            <div className="inline-flex items-center gap-5 bg-slate-50 border border-slate-200 rounded-2xl px-7 py-4 mb-6">
              <div className="text-center">
                <p className={cn(
                  'text-3xl font-black tabular-nums',
                  lastAttempt.passed ? 'text-teal' : 'text-red-500',
                )}>
                  {lastAttempt.score}%
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Last Score</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <p className={cn(
                  'text-sm font-semibold',
                  lastAttempt.passed ? 'text-teal' : 'text-red-500',
                )}>
                  {lastAttempt.passed ? 'Passed' : 'Failed'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(lastAttempt.completedAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-400">
            Speak to your manager to request a retake for this assessment.
          </p>
        </div>
      </div>
    )
  }

  // Guard — no questions available
  if (demoQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <Link href="/assessments" className="text-sm text-slate-500 hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Assessments
        </Link>
        <div className="card p-10 text-center">
          <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto mb-4" aria-hidden />
          <h2 className="text-base font-semibold text-navy mb-2">No questions found</h2>
          <p className="text-sm text-slate-500 mb-6">
            This assessment has no questions yet. Complete the module first, then return here.
          </p>
          <Link href="/assessments" className="btn-primary inline-flex">Go to Assessments</Link>
        </div>
      </div>
    )
  }

  const question = demoQuestions[currentQ]
  const { correctCount, score, passed } = scoreQuiz(answers, demoQuestions, passmark)

  function handleSelect(idx: number) {
    if (submitted) return
    setSelected(idx)
  }

  function handleSubmit() {
    if (selected === null) return
    const newAnswers = [...answers]
    newAnswers[currentQ] = selected
    setAnswers(newAnswers)
    if (beta) {
      const newConfidences = [...confidences]
      newConfidences[currentQ] = confidence
      setConfidences(newConfidences)
    }
    setSubmitted(true)
    setQuizStarted(true)
    if (!isRecapQuiz) {
      saveInProgress({
        moduleId,
        startedAt: new Date().toISOString(),
        answers: newAnswers,
        submittedUpTo: currentQ,
      })
      void (async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from('assessment_sessions').upsert({
          user_id: user.id,
          module_id: moduleId,
          answers: newAnswers,
          current_question: currentQ,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,module_id' })
      })()
    }
  }

  function handleNext() {
    if (currentQ < demoQuestions.length - 1) {
      setCurrentQ(prev => prev + 1)
      setSelected(null)
      setSubmitted(false)
      setConfidence(null)
    } else {
      setShowResults(true)
    }
  }

  // ── Recap results screen ──────────────────────────────────────────────────
  if (showResults && isRecapQuiz) {
    const moduleScores = (recapQuestionModuleIds ?? []).map(mid => {
      const moduleQs = demoQuestions.filter(q => q.moduleId === mid)
      const correct  = moduleQs.filter(q => {
        const qIdx = demoQuestions.indexOf(q)
        return answers[qIdx] === q.correct
      }).length
      const label = recapModuleTitles?.[mid] ?? mid
      return { mid, label, correct, total: moduleQs.length }
    }).filter(s => s.total > 0)

    const toRevisit = moduleScores.filter(s => s.correct < s.total)
    const onTrack   = moduleScores.filter(s => s.correct === s.total)

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card p-8">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ background: 'rgba(79,70,229,0.1)' }}
          >
            <RefreshCw className="w-9 h-9" style={{ color: '#4F46E5' }} aria-hidden />
          </div>

          <h2 className="text-2xl font-bold text-navy mb-1 text-center">Monthly Recap Complete</h2>
          <p className="text-slate-500 text-sm mb-6 text-center">
            {recapLabel} — {recapTheme}
          </p>

          {saveError && <SaveErrorBanner />}

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-4xl font-black tabular-nums" style={{ color: '#4F46E5' }}>{score}%</p>
              <p className="text-xs text-slate-400 mt-1">Your Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-navy tabular-nums">{correctCount}/{demoQuestions.length}</p>
              <p className="text-xs text-slate-400 mt-1">Correct</p>
            </div>
          </div>

          {toRevisit.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-4 text-left">
              <p className="text-sm font-bold text-amber-800 mb-2">Areas to Revisit</p>
              <div className="space-y-1.5">
                {toRevisit.map(s => (
                  <div key={s.mid} className="flex items-center justify-between">
                    <span className="text-xs text-amber-700 truncate">{s.label}</span>
                    <span className="text-xs font-semibold text-amber-700 flex-shrink-0 ml-3">{s.correct}/{s.total} correct</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {onTrack.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-6 text-left">
              <p className="text-sm font-bold text-emerald-800 mb-2">You&apos;re on Track</p>
              <div className="space-y-1.5">
                {onTrack.map(s => (
                  <div key={s.mid} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" aria-hidden />
                    <span className="text-xs text-emerald-700">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-left space-y-3 mb-6">
            {demoQuestions.map((q, i) => {
              const userAns = answers[i]
              const isCorrect = userAns === q.correct
              return (
                <div key={q.id} className={cn(
                  'rounded-xl p-4 border',
                  isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50',
                )}>
                  <div className="flex items-start gap-2.5 mb-2">
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden />
                      : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden />
                    }
                    <p className="text-sm font-medium text-navy leading-snug">{q.question}</p>
                  </div>
                  {!isCorrect && (
                    <>
                      <p className="text-xs text-red-600 mb-1 ml-6">
                        Your answer: {userAns !== null ? q.options[userAns] : 'No answer'}
                      </p>
                      <p className="text-xs text-emerald-700 font-medium mb-2 ml-6">
                        Correct: {q.options[q.correct]}
                      </p>
                    </>
                  )}
                  <p className="text-xs text-slate-600 ml-6 bg-white/80 rounded-lg p-2 border border-slate-100 leading-relaxed">
                    <span className="font-semibold">Rationale: </span>{q.rationale}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/recap" className="btn-secondary flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" aria-hidden /> Back to Recap &amp; Refresh
            </Link>
            <Link href="/modules" className="btn-outline flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" aria-hidden /> Video Library
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Recall results screen ─────────────────────────────────────────────────
  if (showResults && isRecallQuiz) {
    const allCorrect = correctCount === demoQuestions.length

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card p-8 text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ background: 'rgba(249,115,22,0.1)' }}
          >
            <RefreshCw className="w-9 h-9" style={{ color: '#f97316' }} aria-hidden />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#f97316' }}>
            {recallLabel} recall check
          </p>
          <h2 className="text-2xl font-bold text-navy mb-1">Recall Check Complete</h2>
          <p className="text-slate-500 text-sm mb-6">{recallModuleTitle}</p>

          {saveError && <SaveErrorBanner />}

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-4xl font-black tabular-nums" style={{ color: '#f97316' }}>{score}%</p>
              <p className="text-xs text-slate-400 mt-1">Your Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-navy tabular-nums">{correctCount}/{demoQuestions.length}</p>
              <p className="text-xs text-slate-400 mt-1">Correct</p>
            </div>
          </div>

          {allCorrect ? (
            <div className="rounded-xl border border-teal/30 bg-teal/5 p-4 mb-6 text-left">
              <p className="text-sm font-bold text-teal mb-1">Knowledge retained ✓</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                You answered every question correctly — the knowledge from this module is firmly embedded.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6 text-left">
              <p className="text-sm font-bold text-amber-800 mb-1">Worth revisiting</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                You missed {demoQuestions.length - correctCount} question{demoQuestions.length - correctCount !== 1 ? 's' : ''}.
                {' '}Review the rationale below and consider re-reading the module material.
              </p>
            </div>
          )}

          <div className="text-left space-y-3 mb-6">
            {demoQuestions.map((q, i) => {
              const userAns = answers[i]
              const isCorrect = userAns === q.correct
              return (
                <div key={q.id} className={cn(
                  'rounded-xl p-4 border',
                  isCorrect ? 'border-teal/30 bg-teal/5' : 'border-red-200 bg-red-50/50',
                )}>
                  <div className="flex items-start gap-2.5 mb-2">
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" aria-hidden />
                      : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden />
                    }
                    <p className="text-sm font-medium text-navy leading-snug">{q.question}</p>
                  </div>
                  {!isCorrect && (
                    <>
                      <p className="text-xs text-red-600 mb-1 ml-6">
                        Your answer: {userAns !== null ? q.options[userAns] : 'No answer'}
                      </p>
                      <p className="text-xs text-teal font-medium mb-2 ml-6">
                        Correct: {q.options[q.correct]}
                      </p>
                    </>
                  )}
                  <p className="text-xs text-slate-600 ml-6 bg-white/80 rounded-lg p-2 border border-slate-100 leading-relaxed">
                    <span className="font-semibold">Rationale: </span>{q.rationale}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/assessments" className="btn-primary flex items-center gap-1.5">
              All Assessments <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Standard results screen ───────────────────────────────────────────────
  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card p-8 text-center">
          <div className={cn(
            'w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4',
            passed ? 'bg-teal/15' : 'bg-red-100',
          )}>
            {passed
              ? <Trophy className="w-9 h-9 text-teal" aria-hidden />
              : <XCircle className="w-9 h-9 text-red-500" aria-hidden />
            }
          </div>
          <h2 className="text-2xl font-bold text-navy mb-1">
            {passed ? 'Assessment Passed!' : 'Not Quite There Yet'}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {passed
              ? `Great work. You scored ${score}% — above the ${passmark}% pass threshold.`
              : `You scored ${score}%. The pass threshold is ${passmark}%. Review the module and try again.`
            }
          </p>

          {saveError && <SaveErrorBanner />}

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-4xl font-black tabular-nums" style={{ color: passed ? '#1D7874' : '#ef4444' }}>
                {score}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Your Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slate-300 tabular-nums">{passmark}%</p>
              <p className="text-xs text-slate-400 mt-1">Pass Mark</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-navy tabular-nums">{correctCount}/{demoQuestions.length}</p>
              <p className="text-xs text-slate-400 mt-1">Correct</p>
            </div>
          </div>

          {beta && (() => {
            // "Confidently wrong" — questions the learner was sure about but got
            // wrong. These are the hidden gaps most worth revisiting: the learner
            // doesn't know they don't know. Lucky guesses that were right are
            // intentionally not celebrated here.
            const confidentlyWrong = demoQuestions.filter((q, i) =>
              confidences[i] === 'high' && answers[i] !== q.correct
            )
            if (confidentlyWrong.length === 0) return null
            return (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6 text-left">
                <p className="text-sm font-bold text-amber-800 mb-1">Worth a closer look</p>
                <p className="text-xs text-amber-700 leading-relaxed mb-2.5">
                  You were sure about {confidentlyWrong.length} question{confidentlyWrong.length !== 1 ? 's' : ''} you
                  didn&apos;t get right. These are the gaps most worth revisiting — read the rationale below carefully.
                </p>
                <ul className="space-y-1">
                  {confidentlyWrong.map(q => (
                    <li key={q.id} className="text-xs text-amber-700 flex items-start gap-1.5">
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden />
                      <span className="leading-snug">{q.question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })()}

          <div className="text-left space-y-3 mb-6">
            {demoQuestions.map((q, i) => {
              const userAns = answers[i]
              const isCorrect = userAns === q.correct
              return (
                <div key={q.id} className={cn(
                  'rounded-xl p-4 border text-left',
                  isCorrect ? 'border-teal/30 bg-teal/5' : 'border-red-200 bg-red-50/50',
                )}>
                  <div className="flex items-start gap-2.5 mb-2">
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    }
                    <p className="text-sm font-medium text-navy leading-snug">{q.question}</p>
                  </div>
                  {!isCorrect && (
                    <>
                      <p className="text-xs text-red-600 mb-1 ml-6">
                        Your answer: {userAns !== null ? q.options[userAns] : 'No answer'}
                      </p>
                      <p className="text-xs text-teal font-medium mb-2 ml-6">
                        Correct: {q.options[q.correct]}
                      </p>
                    </>
                  )}
                  <p className="text-xs text-slate-600 ml-6 bg-slate-50 rounded-lg p-2 border border-slate-100 leading-relaxed">
                    <span className="font-semibold">Rationale: </span>{q.rationale}
                  </p>
                </div>
              )
            })}
          </div>

          {passed && !isReleaseQuiz && !isCrm2Quiz && (
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-bold text-navy mb-1">Recall checks scheduled ✓</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                To beat the forgetting curve, you&apos;ll receive a 3-question email recall check in{' '}
                <strong>3 days</strong>, <strong>7 days</strong>, and <strong>30 days</strong>.
                Each check takes under 2 minutes and won&apos;t affect your score.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href={backHref} className="btn-secondary flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" aria-hidden /> {backLabel}
            </Link>
            <Link href={isCrm2Quiz ? '/hub/crm-2/assessments' : '/assessments'} className="btn-primary flex items-center gap-1.5">
              All Assessments <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Active quiz ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {!quizStarted && (
        <Link href={backHref} className="text-sm text-slate-500 hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>
      )}

      <div className="card p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">{isRecapQuiz ? 'Monthly Recap' : isRecallQuiz ? `${recallLabel} Recall Check` : 'Assessment'}</p>
            <h1 className="text-base font-bold text-navy">{moduleTitle}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-4 h-4" aria-hidden />
              <span>~{demoQuestions.length * 1.5} min</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="font-semibold text-navy">{currentQ + 1}</span>
              <span>/ {demoQuestions.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-4">
          {demoQuestions.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-1.5 rounded-full transition-all duration-300',
                i < currentQ
                  ? (answers[i] === demoQuestions[i]?.correct ? 'bg-teal' : 'bg-red-400')
                  : i === currentQ
                    ? 'bg-orange'
                    : 'bg-slate-100',
              )}
              aria-hidden
            />
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>Q{currentQ + 1} of {demoQuestions.length}</span>
          <span>{isRecapQuiz || isRecallQuiz ? 'Knowledge check — no pass mark' : `Pass mark: ${passmark}%`}</span>
        </div>
      </div>

      <div className="card p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Question {currentQ + 1}
        </p>
        <h2 className="text-base font-bold text-navy leading-snug mb-6">
          {question.question}
        </h2>

        <div className="space-y-3" role="group" aria-label="Answer options">
          {question.options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrect  = question.correct === i
            const showResult = submitted

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={submitted}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-navy/20',
                  !submitted && !isSelected && 'bg-white border-slate-200 hover:border-orange/40 hover:bg-orange/3',
                  !submitted && isSelected  && 'bg-orange/8 border-orange text-navy',
                  submitted && isCorrect                   && 'bg-teal/8 border-teal',
                  submitted && isSelected && !isCorrect    && 'bg-red-50 border-red-400',
                  submitted && !isSelected && !isCorrect   && 'bg-white border-slate-100 opacity-60',
                )}
                aria-pressed={isSelected}
              >
                <div className={cn(
                  'w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all',
                  !submitted && !isSelected && 'border-slate-300 text-slate-400',
                  !submitted && isSelected  && 'border-orange bg-orange text-white',
                  submitted && isCorrect    && 'border-teal bg-teal text-white',
                  submitted && isSelected && !isCorrect && 'border-red-500 bg-red-500 text-white',
                  submitted && !isSelected && !isCorrect && 'border-slate-200 text-slate-300',
                )}>
                  {showResult && isCorrect    ? <CheckCircle2 className="w-4 h-4" /> :
                   showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                   String.fromCharCode(65 + i)}
                </div>
                <span className={cn(
                  'text-sm leading-snug flex-1',
                  !submitted && 'text-slate-700',
                  submitted && isCorrect && 'text-teal font-semibold',
                  submitted && isSelected && !isCorrect && 'text-red-600',
                  submitted && !isSelected && !isCorrect && 'text-slate-400',
                )}>
                  {opt}
                </span>
              </button>
            )
          })}
        </div>

        {beta && !submitted && selected !== null && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2.5">How sure are you?</p>
            <div className="flex items-center gap-2" role="group" aria-label="Confidence level">
              {CONFIDENCE_OPTIONS.map(({ value, label }) => {
                const active = confidence === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setConfidence(value)}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-xl border text-xs font-semibold transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-navy/20',
                      active ? 'bg-navy text-white border-navy' : 'bg-white text-slate-500 border-slate-200 hover:border-navy/40',
                    )}
                    aria-pressed={active}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {submitted && (
          <div className={cn(
            'mt-4 p-4 rounded-xl border text-sm leading-relaxed',
            selected === question.correct
              ? 'bg-teal/8 border-teal/30 text-teal-800'
              : 'bg-amber-50 border-amber-200 text-amber-800',
          )}>
            <p className="font-semibold mb-1">
              {selected === question.correct ? 'Correct!' : 'Not quite —'}
            </p>
            <p className="text-xs leading-relaxed">{question.rationale}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {submitted && selected !== question.correct ? 'Review the rationale before moving on.' : ''}
        </p>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className={cn(
              'btn-primary',
              selected === null && 'opacity-50 cursor-not-allowed',
            )}
            aria-disabled={selected === null}
          >
            Submit Answer
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary flex items-center gap-2">
            {currentQ < demoQuestions.length - 1 ? (
              <><span>Next Question</span><ChevronRight className="w-4 h-4" /></>
            ) : (
              <><span>See Results</span><Trophy className="w-4 h-4" /></>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
