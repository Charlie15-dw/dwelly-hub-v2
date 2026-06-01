'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, CheckCircle2, XCircle, ChevronRight,
  Clock, Trophy, ArrowRight, ClipboardCheck, RefreshCw, BookOpen, Lock,
} from 'lucide-react'
import { QUIZ_QUESTIONS, MODULES, RECAP_ROUNDS, PRODUCT_RELEASE_QUIZZES, PRODUCT_RELEASE_QUESTIONS } from '@/lib/data'
import { cn } from '@/lib/utils'
import { isLocked, getLastAttempt, saveAttempt, unlockAssessment, getInProgress, saveInProgress, clearInProgress, type AttemptRecord } from '@/lib/assessmentStorage'
import { createClient } from '@/lib/supabase/client'
import { hashStr, seededShuffle, getBrowserKey } from '@/lib/shuffle'

/** Shuffle the options of a question and recalculate the correct index */
function shuffleOptions(q: typeof QUIZ_QUESTIONS[0], seed: number): typeof QUIZ_QUESTIONS[0] {
  const newOrder = seededShuffle(Array.from({ length: q.options.length }, (_, i) => i), seed)
  return {
    ...q,
    options: newOrder.map(i => q.options[i]),
    correct: newOrder.indexOf(q.correct),
  }
}

// Shuffle helper — randomises question order for recap quizzes
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// Video module sections (3 questions each for combined assessments)
const VIDEO_MODULE_IDS = ['mnt-02', 'cmp-02', 'mvt-02', 'ins-02', 'sup-02']
// Knowledge base sections
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
  const recapRound         = isRecapQuiz ? RECAP_ROUNDS.find(r => r.id === moduleId) : undefined
  const isReleaseQuiz      = moduleId.startsWith('release-')
  const releaseQuiz        = isReleaseQuiz ? PRODUCT_RELEASE_QUIZZES.find(r => r.id === moduleId) : undefined

  // Recall quiz: recall-{baseAssessmentId}-{intervalDays} e.g. recall-mnt-01-3
  const isRecallQuiz  = moduleId.startsWith('recall-')
  const recallMatch   = isRecallQuiz ? moduleId.match(/^recall-(.+)-(\d+)$/) : null
  const recallBase    = recallMatch?.[1] ?? null
  const recallDays    = recallMatch ? parseInt(recallMatch[2]) : 0
  const recallLabel   = recallDays === 3 ? '3-day' : recallDays === 7 ? '7-day' : '30-day'
  const recallModuleTitle = recallBase ? (MODULES.find(m => m.id === recallBase)?.title ?? recallBase) : ''

  const module = isMasterAssessment
    ? { id: 'master-assessment', title: 'Master Assessment — All Sections', passmark: 80 }
    : isFullAssessment
      ? { id: 'full-assessment', title: 'Full Assessment — Video Modules', passmark: 80 }
      : isRecapQuiz
        ? { id: moduleId, title: `Monthly Recap — ${recapRound?.label ?? ''}`, passmark: 0 }
        : isRecallQuiz
          ? { id: moduleId, title: `Recall Check — ${recallModuleTitle}`, passmark: 0 }
          : isReleaseQuiz
            ? { id: moduleId, title: releaseQuiz?.title ?? 'Product Release Quiz', passmark: releaseQuiz?.passmark ?? 80 }
            : MODULES.find(m => m.id === moduleId)

  // Stable question list — computed once on mount so re-renders don't reshuffle.
  // For regular module assessments, question order AND option order are shuffled
  // using a per-browser seed (stable for the same device, different across devices).
  const [demoQuestions] = useState(() => {
    const browserKey = getBrowserKey()

    if (isMasterAssessment) {
      return [...VIDEO_MODULE_IDS, ...KNOWLEDGE_IDS].flatMap(mid =>
        QUIZ_QUESTIONS.filter(q => q.moduleId === mid && q.tier === 'master')
      )
    }
    if (isFullAssessment) {
      return VIDEO_MODULE_IDS.flatMap(mid =>
        QUIZ_QUESTIONS.filter(q => q.moduleId === mid && !q.tier).slice(0, PER_SECTION)
      )
    }
    if (isRecapQuiz) {
      if (!recapRound) return []
      const perModule = Math.ceil(recapRound.questionCount / recapRound.questionModuleIds.length)
      const sampled = recapRound.questionModuleIds.flatMap(mid =>
        shuffle(QUIZ_QUESTIONS.filter(q => q.moduleId === mid && q.tier === 'recap')).slice(0, perModule)
      )
      return shuffle(sampled).slice(0, recapRound.questionCount)
    }
    if (isRecallQuiz) {
      if (!recallBase) return []
      const pool = QUIZ_QUESTIONS.filter(q => q.moduleId === recallBase && !q.tier)
      return shuffle(pool).slice(0, 3)
    }
    if (isReleaseQuiz) {
      const pool = PRODUCT_RELEASE_QUESTIONS.filter(q => q.releaseId === moduleId)
      if (!browserKey) return pool
      return seededShuffle(pool, hashStr(browserKey + moduleId)).map(q => shuffleOptions(q, hashStr(browserKey + q.id)))
    }

    // Regular module assessment — shuffle question order and option order per browser,
    // then sample down to the assessment's target question count
    const pool = QUIZ_QUESTIONS.filter(q => q.moduleId === moduleId && !q.tier)
    const sampleSize = ASSESSMENT_QUESTION_COUNTS[moduleId] ?? pool.length
    if (!browserKey) return pool.slice(0, sampleSize) // server render: no shuffle (hydration safe)
    const shuffledPool = seededShuffle(pool, hashStr(browserKey + moduleId))
    return shuffledPool.slice(0, sampleSize).map(q => shuffleOptions(q, hashStr(browserKey + q.id)))
  })

  const backHref  = isMasterAssessment || isFullAssessment ? '/assessments' : isRecapQuiz ? '/recap' : isRecallQuiz ? '/assessments' : isReleaseQuiz ? '/recap' : `/modules/${moduleId}`
  const backLabel = isMasterAssessment || isFullAssessment ? 'Back to Assessments' : isRecapQuiz ? 'Back to Recap & Refresh' : isRecallQuiz ? 'Back to Assessments' : isReleaseQuiz ? 'Back to Recap & Refresh' : 'Back to Module'

  const [currentQ, setCurrentQ]       = useState(0)
  const [selected, setSelected]        = useState<number | null>(null)
  const [submitted, setSubmitted]      = useState(false)
  const [answers, setAnswers]          = useState<(number | null)[]>(new Array(demoQuestions.length).fill(null))
  const [showResults, setShowResults]  = useState(false)
  const [lockedByStorage, setLockedByStorage] = useState(false)
  const [lastAttempt, setLastAttempt]  = useState<AttemptRecord | null>(null)
  const [quizStarted, setQuizStarted]  = useState(false) // true once first answer submitted
  const [scheduleId, setScheduleId]    = useState<string | null>(null) // recall schedule UUID from URL

  // Read scheduleId from URL on mount (recall quizzes only)
  useEffect(() => {
    if (!isRecallQuiz) return
    const params = new URLSearchParams(window.location.search)
    setScheduleId(params.get('schedule'))
  }, [isRecallQuiz])

  // Check lock status on mount — also checks Supabase for manager-triggered resets
  // and restores any in-progress session (Supabase takes priority over localStorage)
  useEffect(() => {
    if (isRecapQuiz || isRecallQuiz || isReleaseQuiz) return
    async function checkLockAndReset() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check for a pending reset granted by the manager
        const { data: reset } = await supabase
          .from('module_resets')
          .select('id')
          .eq('user_id', user.id)
          .eq('module_id', moduleId)
          .is('consumed_at', null)
          .maybeSingle()

        if (reset) {
          // Consume the reset and clear all saved state
          await supabase
            .from('module_resets')
            .update({ consumed_at: new Date().toISOString() })
            .eq('id', reset.id)
          await supabase
            .from('assessment_sessions')
            .delete()
            .eq('user_id', user.id)
            .eq('module_id', moduleId)
          unlockAssessment(moduleId)
          clearInProgress(moduleId)
          return // allow the quiz to start fresh
        }
      }

      // No reset — check if fully locked first
      if (isLocked(moduleId)) {
        setLockedByStorage(true)
        setLastAttempt(getLastAttempt(moduleId))
        return
      }

      // Restore from localStorage only — question shuffle is browser-specific so
      // cross-device Supabase restore would map answer indices to the wrong questions.
      // We still save to Supabase so managers can see in-progress state.
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
    }
    checkLockAndReset()
  }, [moduleId, isRecapQuiz])

  // Save recall result to Supabase and mark schedule complete
  useEffect(() => {
    if (!showResults || !isRecallQuiz) return
    async function saveRecallResult() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('assessment_results').insert({
        user_id: user.id,
        assessment_id: moduleId,
        score,
        passed: true, // recall checks have no pass/fail
        completed_at: new Date().toISOString(),
      })
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
      await supabase.from('assessment_results').insert({
        user_id: user.id,
        assessment_id: moduleId,
        score,
        passed: true, // recap has no pass/fail
        completed_at: new Date().toISOString(),
      })
    }
    saveRecapToSupabase()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults])

  // Save attempt to localStorage AND Supabase when the results screen appears
  useEffect(() => {
    if (!showResults || isRecapQuiz || isRecallQuiz || isReleaseQuiz) return
    clearInProgress(moduleId)
    saveAttempt({ moduleId, completedAt: new Date().toISOString(), score, passed })

    // Also persist to Supabase so managers and analytics can see real data
    async function saveToSupabase() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Clear the in-progress session from Supabase
      await supabase
        .from('assessment_sessions')
        .delete()
        .eq('user_id', user.id)
        .eq('module_id', moduleId)

      // Build full answers payload for manager review
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

      // Save assessment result
      await supabase.from('assessment_results').insert({
        user_id: user.id,
        assessment_id: moduleId,
        score,
        passed,
        answers: allAnswers,
        completed_at: new Date().toISOString(),
      })

      // If passed a module-level assessment, mark that module as completed
      if (passed && !isFullAssessment && !isMasterAssessment) {
        await supabase.from('module_progress').upsert({
          user_id: user.id,
          module_id: moduleId,
          progress: 100,
          completed: true,
          last_watched_at: new Date().toISOString(),
        }, { onConflict: 'user_id,module_id' })
      }

      // Schedule 3/7/30-day recall checks for passed module-level assessments
      if (passed && !isFullAssessment && !isMasterAssessment) {
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
  if (lockedByStorage) {
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
  const correctCount = answers.filter((a, i) => a === demoQuestions[i]?.correct).length
  const score = Math.round((correctCount / demoQuestions.length) * 100)
  const passed = score >= (module?.passmark ?? 80)

  function handleSelect(idx: number) {
    if (submitted) return
    setSelected(idx)
  }

  function handleSubmit() {
    if (selected === null) return
    const newAnswers = [...answers]
    newAnswers[currentQ] = selected
    setAnswers(newAnswers)
    setSubmitted(true)
    setQuizStarted(true)
    // Persist in-progress state so navigating away doesn't allow a restart
    if (!isRecapQuiz) {
      saveInProgress({
        moduleId,
        startedAt: new Date().toISOString(),
        answers: newAnswers,
        submittedUpTo: currentQ,
      })
      // Also save to Supabase for cross-device persistence (fire-and-forget)
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
    } else {
      setShowResults(true)
    }
  }

  // ── Recap results screen (no pass/fail — shows areas to revisit) ─────────────
  if (showResults && isRecapQuiz) {
    const moduleScores = (recapRound?.questionModuleIds ?? []).map(mid => {
      const moduleQs = demoQuestions.filter(q => q.moduleId === mid)
      const correct  = moduleQs.filter((q) => {
        const qIdx = demoQuestions.indexOf(q)
        return answers[qIdx] === q.correct
      }).length
      const moduleTitle = MODULES.find(m => m.id === mid)?.title ?? mid
      return { mid, label: moduleTitle, correct, total: moduleQs.length }
    }).filter(s => s.total > 0)

    const toRevisit = moduleScores.filter(s => s.correct < s.total)
    const onTrack   = moduleScores.filter(s => s.correct === s.total)

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card p-8">
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ background: 'rgba(79,70,229,0.1)' }}
          >
            <RefreshCw className="w-9 h-9" style={{ color: '#4F46E5' }} aria-hidden />
          </div>

          <h2 className="text-2xl font-bold text-navy mb-1 text-center">Monthly Recap Complete</h2>
          <p className="text-slate-500 text-sm mb-6 text-center">
            {recapRound?.label} — {recapRound?.theme}
          </p>

          {/* Score display */}
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

          {/* Areas to revisit */}
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

          {/* On track */}
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

          {/* Answer review */}
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

          {/* Actions */}
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

  // ── Recall results screen (no pass/fail — 3-question knowledge check) ──────────
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

          {/* Answer review */}
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

  // ── Standard results screen (pass/fail — modules & master assessment) ──────────
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
              ? `Great work. You scored ${score}% — above the ${module?.passmark ?? 80}% pass threshold.`
              : `You scored ${score}%. The pass threshold is ${module?.passmark ?? 80}%. Review the module and try again.`
            }
          </p>

          {/* Score ring */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-4xl font-black tabular-nums" style={{ color: passed ? '#1D7874' : '#ef4444' }}>
                {score}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Your Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-slate-300 tabular-nums">{module?.passmark ?? 80}%</p>
              <p className="text-xs text-slate-400 mt-1">Pass Mark</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-navy tabular-nums">{correctCount}/{demoQuestions.length}</p>
              <p className="text-xs text-slate-400 mt-1">Correct</p>
            </div>
          </div>

          {/* Answers review */}
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

          {/* Spaced rep confirmation */}
          {passed && (
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-bold text-navy mb-1">Recall checks scheduled ✓</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                To beat the forgetting curve, you&apos;ll receive a 3-question email recall check in{' '}
                <strong>3 days</strong>, <strong>7 days</strong>, and <strong>30 days</strong>.
                Each check takes under 2 minutes and won&apos;t affect your score.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href={backHref} className="btn-secondary flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" aria-hidden /> {backLabel}
            </Link>
            <Link href="/assessments" className="btn-primary flex items-center gap-1.5">
              All Assessments <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back — hidden once quiz is underway to prevent answer resets */}
      {!quizStarted && (
        <Link href={backHref} className="text-sm text-slate-500 hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>
      )}

      {/* Header */}
      <div className="card p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">{isRecapQuiz ? 'Monthly Recap' : isRecallQuiz ? `${recallLabel} Recall Check` : 'Assessment'}</p>
            <h1 className="text-base font-bold text-navy">{module?.title ?? 'Knowledge Check'}</h1>
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

        {/* Progress dots */}
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
          <span>{isRecapQuiz || isRecallQuiz ? 'Knowledge check — no pass mark' : `Pass mark: ${module?.passmark ?? 80}%`}</span>
        </div>
      </div>

      {/* Question */}
      <div className="card p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Question {currentQ + 1}
        </p>
        <h2 className="text-base font-bold text-navy leading-snug mb-6">
          {question.question}
        </h2>

        {/* Options */}
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

        {/* Rationale */}
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

      {/* Actions */}
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
