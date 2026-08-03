import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ClipboardCheck, ChevronRight, Trophy, CheckCircle2 } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isCrm2Preview } from '@/lib/preview'
import { CRM2_LESSONS, CRM2_PILLARS } from '@/lib/crm2-content'
import { QUIZ_QUESTIONS } from '@/lib/data'

// A dedicated home for the CRM 2.0 knowledge checks. Lists every lesson that
// has a quiz, grouped by pillar, so the team can test themselves without
// hunting through the lessons. Gated to the same allow-list as everything else
// in the section. These quizzes are practice — freely retakeable, and they
// don't feed the manager assessment dashboard.

export default async function Crm2AssessmentsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isCrm2Preview(user.email)) redirect('/hub')

  const quizLessons = CRM2_LESSONS.filter((l) => l.quizModuleId)
  const questionCount = (moduleId: string) =>
    QUIZ_QUESTIONS.filter((q) => q.moduleId === moduleId).length

  // Pull this user's results so we can show how many they've passed (X of Y) and
  // mark the ones already completed. These are scored, locking assessments — a
  // pass is permanent once earned, so "ever passed" is the right measure.
  const quizModuleIds = quizLessons.map((l) => l.quizModuleId!)
  const { data: myResults } = quizModuleIds.length > 0
    ? await supabase
        .from('assessment_results')
        .select('assessment_id, score, passed')
        .eq('user_id', user.id)
        .in('assessment_id', quizModuleIds)
    : { data: [] }

  const passed = new Set<string>()
  const bestScore = new Map<string, number>()
  for (const r of myResults ?? []) {
    if (r.passed) passed.add(r.assessment_id)
    const prev = bestScore.get(r.assessment_id)
    if (prev === undefined || r.score > prev) bestScore.set(r.assessment_id, r.score)
  }
  const passedCount = passed.size
  const totalQuizzes = quizModuleIds.length
  const passedPct = totalQuizzes > 0 ? Math.round((passedCount / totalQuizzes) * 100) : 0

  return (
    <div className="space-y-8 hub-fade">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/hub/crm-2" className="text-slate-500 hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> CRM 2.0
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-navy font-medium">Assessments</span>
      </div>

      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hub-orb-a absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-orange/30 blur-3xl" />
          <div className="hub-orb-b absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full bg-indigo-500/20 blur-3xl" />
        </div>
        <div className="relative px-7 py-10 sm:px-10 sm:py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Trophy className="w-3.5 h-3.5 text-orange-200" aria-hidden />
            Test yourself
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-white">CRM 2.0 Assessments</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
            Short knowledge checks for the key lessons. Each has an 80% pass mark, shows the reasoning
            behind every answer, and you can retake them as often as you like.
          </p>
        </div>
      </section>

      {/* Progress — how many of these you've passed */}
      <div className="card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-navy">Your assessment progress</p>
              <p className="text-sm text-slate-500 mt-0.5">
                {passedCount === totalQuizzes && totalQuizzes > 0
                  ? 'All assessments passed — nice work.'
                  : `${passedCount} of ${totalQuizzes} assessments passed`}
              </p>
            </div>
          </div>
          <span className="text-2xl font-black text-navy tabular-nums flex-shrink-0">{passedPct}%</span>
        </div>
        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal rounded-full transition-all"
            style={{ width: `${passedPct}%` }}
          />
        </div>
      </div>

      {/* Assessments grouped by pillar */}
      {CRM2_PILLARS.map(({ id, label }) => {
        const lessons = quizLessons.filter((l) => l.pillar === id)
        if (lessons.length === 0) return null
        return (
          <section key={id} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">{label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lessons.map((lesson) => {
                const isPassed = passed.has(lesson.quizModuleId!)
                const score = bestScore.get(lesson.quizModuleId!)
                return (
                  <Link
                    key={lesson.slug}
                    href={`/quiz/${lesson.quizModuleId}`}
                    className="card card-hover p-5 flex items-center gap-4 group"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isPassed ? 'bg-teal/10 text-teal' : 'bg-[#0071E3]/10 text-[#0071E3]'}`}>
                      {isPassed
                        ? <CheckCircle2 className="w-5 h-5" aria-hidden />
                        : <ClipboardCheck className="w-5 h-5" aria-hidden />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy truncate">{lesson.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {questionCount(lesson.quizModuleId!)} questions · 80% to pass
                      </p>
                    </div>
                    {isPassed ? (
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-1 flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
                        Passed{score !== undefined ? ` · ${score}%` : ''}
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#0071E3] flex-shrink-0 group-hover:gap-2 transition-all">
                        Start <ChevronRight className="w-4 h-4" aria-hidden />
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
