import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ClipboardCheck, ChevronRight, Trophy, CheckCircle2, XCircle, RotateCcw, ShieldCheck, Wrench } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { isMaintenancePreview } from '@/lib/preview'
import { CRM2_LESSONS, CRM2_PILLARS, CRM2_CAPSTONE_MODULE_ID, CRM2_CAPSTONE_SAMPLE, type Crm2Lesson, type Crm2Pillar } from '@/lib/crm2-content'
import { MAINTENANCE_LESSONS, MAINTENANCE_PILLARS } from '@/lib/crm2-maintenance-content'
import { QUIZ_QUESTIONS } from '@/lib/data'

// A dedicated home for the CRM 2.0 knowledge checks. Lists every lesson that
// has a quiz, grouped by pillar, so the team can test themselves without
// hunting through the lessons. Gated to the same allow-list as everything else
// in the section. These quizzes are practice — freely retakeable, and they
// don't feed the manager assessment dashboard.
//
// The page is split into two tracks — Compliance (everyone) and Maintenance
// (preview only, and drawn solely from the maintenance guides). The two never
// mix: separate question pools, separate module ids.

export default async function Crm2AssessmentsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')

  const showMaintenance = isMaintenancePreview(user.email)

  const complianceLessons = CRM2_LESSONS.filter((l) => l.quizModuleId)
  const maintenanceLessons = showMaintenance
    ? MAINTENANCE_LESSONS.filter((l) => l.quizModuleId)
    : []
  const questionCount = (moduleId: string) =>
    moduleId === CRM2_CAPSTONE_MODULE_ID
      ? CRM2_CAPSTONE_SAMPLE
      : QUIZ_QUESTIONS.filter((q) => q.moduleId === moduleId).length

  // The two tracks, each grouped by its own pillars. Rendered identically below.
  const tracks: { key: string; label: string; icon: typeof ShieldCheck; pillars: { id: Crm2Pillar; label: string }[]; lessons: Crm2Lesson[] }[] = [
    { key: 'compliance', label: 'Compliance', icon: ShieldCheck, pillars: CRM2_PILLARS, lessons: complianceLessons },
    ...(showMaintenance
      ? [{ key: 'maintenance', label: 'Maintenance', icon: Wrench, pillars: MAINTENANCE_PILLARS, lessons: maintenanceLessons }]
      : []),
  ]

  // Pull this user's results so we can show how many they've passed (X of Y) and
  // mark the ones already completed. These are scored, locking assessments — a
  // pass is permanent once earned, so "ever passed" is the right measure.
  const quizLessons = [...complianceLessons, ...maintenanceLessons]
  const quizModuleIds = quizLessons.map((l) => l.quizModuleId!)
  const { data: myResults } = quizModuleIds.length > 0
    ? await supabase
        .from('assessment_results')
        .select('assessment_id, score, passed, completed_at')
        .eq('user_id', user.id)
        .in('assessment_id', quizModuleIds)
    : { data: [] }

  const passed = new Set<string>()
  const attempted = new Set<string>()
  const bestScore = new Map<string, number>()
  const latestAttemptAt = new Map<string, string>()
  for (const r of myResults ?? []) {
    attempted.add(r.assessment_id)
    if (r.passed) passed.add(r.assessment_id)
    const prev = bestScore.get(r.assessment_id)
    if (prev === undefined || r.score > prev) bestScore.set(r.assessment_id, r.score)
    const prevAt = latestAttemptAt.get(r.assessment_id)
    if (r.completed_at && (!prevAt || Date.parse(r.completed_at) > Date.parse(prevAt))) {
      latestAttemptAt.set(r.assessment_id, r.completed_at)
    }
  }

  // A manager "reassign" grants a retake by inserting an un-consumed reset. Mirror
  // the quiz page's rule: the grant is live (shown as "Retake granted") only until
  // it's used — i.e. until a fresh attempt is recorded after the reset was created.
  const service = createServiceClient()
  const { data: resets } = quizModuleIds.length > 0
    ? await service
        .from('module_resets')
        .select('module_id, created_at')
        .eq('user_id', user.id)
        .is('consumed_at', null)
        .in('module_id', quizModuleIds)
    : { data: [] }

  const retakeGranted = new Set<string>()
  for (const reset of resets ?? []) {
    const attemptAt = latestAttemptAt.get(reset.module_id)
    const usedSince = attemptAt && Date.parse(attemptAt) > Date.parse(reset.created_at)
    if (!usedSince) retakeGranted.add(reset.module_id)
  }
  const passedCount = passed.size
  const totalQuizzes = quizModuleIds.length
  const passedPct = totalQuizzes > 0 ? Math.round((passedCount / totalQuizzes) * 100) : 0

  return (
    <div className="space-y-8 hub-fade">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/hub/crm-2" className="text-[var(--text-secondary)] hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> CRM 2.0
        </Link>
        <span className="text-navy-200">/</span>
        <span className="text-navy font-medium">Assessments</span>
      </div>

      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hub-orb-a absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-orange/30 blur-3xl" />
          <div className="hub-orb-b absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full bg-orange/12 blur-3xl" />
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
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${passedCount === totalQuizzes && totalQuizzes > 0 ? 'rag-green' : 'bg-orange/10 text-orange'}`}>
              <CheckCircle2 className="w-5 h-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-navy">Your assessment progress</p>
              <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                {passedCount === totalQuizzes && totalQuizzes > 0
                  ? 'All assessments passed — nice work.'
                  : `${passedCount} of ${totalQuizzes} assessments passed`}
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-navy tabular-nums flex-shrink-0">{passedPct}%</span>
        </div>
        <div className="progress-track mt-4">
          <div
            className="progress-fill"
            style={{ width: `${passedPct}%`, background: passedPct === 100 ? '#1A7F37' : '#0071E3' }}
          />
        </div>
      </div>

      {/* One block per track (Compliance, then Maintenance for preview users),
          each grouped by its own pillars. The two tracks never share a question
          pool — the maintenance checks are drawn solely from the maintenance
          guides. */}
      {tracks.map((track) => {
        const trackLessons = track.lessons
        if (trackLessons.length === 0) return null
        const TrackIcon = track.icon
        return (
          <section key={track.key} className="space-y-5">
            <div className="flex items-center gap-3 border-b border-navy-100 pb-3">
              <span className="w-9 h-9 rounded-xl bg-navy text-white flex items-center justify-center flex-shrink-0">
                <TrackIcon className="w-5 h-5" aria-hidden />
              </span>
              <h2 className="text-[18px] font-bold text-navy">{track.label}</h2>
              <span className="text-[12.5px] text-[var(--text-secondary)] tabular-nums">
                {trackLessons.length} {trackLessons.length === 1 ? 'check' : 'checks'}
              </span>
            </div>

            {track.pillars.map(({ id, label }) => {
              const lessons = trackLessons.filter((l) => l.pillar === id)
              if (lessons.length === 0) return null
              return (
                <div key={id} className="space-y-3">
                  <h3 className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{label}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {lessons.map((lesson) => {
                const isPassed = passed.has(lesson.quizModuleId!)
                const isGranted = !isPassed && retakeGranted.has(lesson.quizModuleId!)
                const isFailed = !isPassed && !isGranted && attempted.has(lesson.quizModuleId!)
                const score = bestScore.get(lesson.quizModuleId!)
                return (
                  <Link
                    key={lesson.slug}
                    href={`/quiz/${lesson.quizModuleId}`}
                    className="card card-hover p-5 flex items-center gap-4 group"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isPassed ? 'rag-green' : isFailed ? 'rag-red' : 'bg-orange/10 text-orange'}`}>
                      {isPassed
                        ? <CheckCircle2 className="w-5 h-5" aria-hidden />
                        : isFailed
                          ? <XCircle className="w-5 h-5" aria-hidden />
                          : isGranted
                            ? <RotateCcw className="w-5 h-5" aria-hidden />
                            : <ClipboardCheck className="w-5 h-5" aria-hidden />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-navy truncate">{lesson.title}</p>
                      <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                        {questionCount(lesson.quizModuleId!)} questions · 80% to pass
                      </p>
                    </div>
                    {isPassed ? (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[12px] font-semibold rag-green rounded-full px-2.5 py-1 flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
                        Passed{score !== undefined ? ` · ${score}%` : ''}
                      </span>
                    ) : isGranted ? (
                      <span className="hidden sm:inline-flex items-center gap-2 flex-shrink-0">
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold rag-amber rounded-full px-2.5 py-1">
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
                          Retake granted
                        </span>
                        <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-orange group-hover:gap-2 transition-all">
                          Retake <ChevronRight className="w-4 h-4" aria-hidden />
                        </span>
                      </span>
                    ) : isFailed ? (
                      <span className="hidden sm:inline-flex items-center gap-2 flex-shrink-0">
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold rag-red rounded-full px-2.5 py-1">
                          <XCircle className="w-3.5 h-3.5" aria-hidden />
                          Failed{score !== undefined ? ` · ${score}%` : ''}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-orange group-hover:gap-2 transition-all">
                          Retake <ChevronRight className="w-4 h-4" aria-hidden />
                        </span>
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[14px] font-semibold text-orange flex-shrink-0 group-hover:gap-2 transition-all">
                        Start <ChevronRight className="w-4 h-4" aria-hidden />
                      </span>
                    )}
                  </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
