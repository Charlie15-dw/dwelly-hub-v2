import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import ReassignButton from '@/components/ui/ReassignButton'
import WrongAnswersPanel from '@/components/ui/WrongAnswersPanel'
import AssignManagerPanel from '@/components/ui/AssignManagerPanel'

const ALL_ASSESSMENT_IDS = [
  'mnt-01', 'mnt-02', 'cmp-01', 'cmp-02', 'mnt-03', 'ins-02',
  'sys-01', 'mvt-02', 'sys-02', 'sup-02',
  'kno-01', 'kno-02', 'kno-03', 'full-assessment', 'master-assessment',
]

const ASSESSMENT_LABELS: Record<string, string> = {
  'mnt-01':            'Maintenance 1/2 — Creating a Repair Request',
  'mnt-02':            'Maintenance 2/2 — Actioning the Maintenance Task',
  'cmp-01':            'Compliance 1/2 — Creating a Compliance Task',
  'cmp-02':            'Compliance 2/2 — Actioning the Compliance Task',
  'mnt-03':            'Inspections 1/2 — Creating an Inspection Task',
  'ins-02':            'Inspections 2/2 — Completing the Inspection',
  'sys-01':            'Move-Outs 1/2 — Initiating the Move-Out Process',
  'mvt-02':            'Move-Outs 2/2 — Completing the Move-Out',
  'sys-02':            'Support 1/2 — Raising a Support Task',
  'sup-02':            'Support 2/2 — Actioning the Support Task',
  'kno-01':            'Knowledge — Difficult Conversations',
  'kno-02':            'Knowledge — Handling Disrepair Claims',
  'kno-03':            'Knowledge — Understanding a P&L',
  'full-assessment':   'Full Programme Assessment',
  'master-assessment': 'Master Assessment',
}

interface AnswerEntry {
  question: string
  yourAnswer: string
  correctAnswer: string
  isCorrect: boolean
  rationale: string
}

export default async function AdminMemberDetailPage({
  params,
}: {
  params: { userId: string }
}) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: currentProfile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if (currentProfile?.role !== 'admin') redirect('/dashboard')

  // Use service client to bypass RLS
  const service = createServiceClient()

  const { data: memberProfile } = await service
    .from('user_profiles')
    .select('id, full_name, email, role, created_at, manager_id')
    .eq('id', params.userId)
    .maybeSingle()

  if (!memberProfile) notFound()

  const { data: managerProfile } = memberProfile.manager_id
    ? await service
        .from('user_profiles')
        .select('full_name, email')
        .eq('id', memberProfile.manager_id)
        .maybeSingle()
    : { data: null }

  const managerName = managerProfile?.full_name
    || managerProfile?.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    || 'Unassigned'

  const [{ data: results }, { data: learningProfile }, { data: allManagers }] = await Promise.all([
    service
      .from('assessment_results')
      .select('assessment_id, score, passed, answers, completed_at')
      .eq('user_id', params.userId)
      .order('completed_at', { ascending: false }),
    service
      .from('learning_profiles')
      .select('style_label, style_icon, confidence_label, confidence_pct, answers, completed_at, manager_note')
      .eq('user_id', params.userId)
      .maybeSingle(),
    service
      .from('user_profiles')
      .select('id, full_name, email')
      .eq('role', 'manager'),
  ])

  const allResults = results ?? []

  const displayName = memberProfile.full_name
    || memberProfile.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    || 'Unknown'
  const memberInitials = displayName.split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2)
  const joinDate = memberProfile.created_at
    ? new Date(memberProfile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  const byAssessment = new Map<string, typeof allResults>()
  for (const r of allResults) {
    if (!byAssessment.has(r.assessment_id)) byAssessment.set(r.assessment_id, [])
    byAssessment.get(r.assessment_id)!.push(r)
  }

  const completedIds = new Set(
    allResults.filter(r => r.passed && ALL_ASSESSMENT_IDS.includes(r.assessment_id)).map(r => r.assessment_id)
  )
  const completedCount = completedIds.size
  const avgScore = allResults.length > 0
    ? Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length)
    : null

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/admin"
          className="mt-1 p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
          aria-label="Back to admin overview"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </Link>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
            <span className="text-white text-base font-bold">{memberInitials}</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-navy">{displayName}</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {memberProfile.email ?? '—'} · Joined {joinDate}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Manager: <span className="text-slate-500 font-medium">{managerName}</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4 text-center flex-shrink-0">
            <div>
              <p className="text-2xl font-black text-navy tabular-nums">{completedCount}/{ALL_ASSESSMENT_IDS.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Assessments passed</p>
            </div>
            {avgScore !== null && (
              <div>
                <p className={cn('text-2xl font-black tabular-nums', {
                  'text-teal': avgScore >= 80,
                  'text-amber-500': avgScore >= 65 && avgScore < 80,
                  'text-red-500': avgScore < 65,
                })}>{avgScore}%</p>
                <p className="text-xs text-slate-400 mt-0.5">Avg score</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign to Manager — admin only, property-managers only */}
      {memberProfile.role === 'property-manager' && (
        <AssignManagerPanel
          userId={params.userId}
          currentManagerId={memberProfile.manager_id ?? null}
          managers={allManagers ?? []}
        />
      )}

      {/* Learning Profile */}
      {learningProfile ? (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg leading-none">{learningProfile.style_icon}</span>
            <div>
              <h2 className="text-sm font-bold text-navy">Learning Profile</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Completed {learningProfile.completed_at
                  ? new Date(learningProfile.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
              </p>
            </div>
          </div>
          <div className="p-5 space-y-5">
            {/* Style + Confidence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Learning Style</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">{learningProfile.style_icon}</span>
                  <p className="text-sm font-bold text-navy">{learningProfile.style_label}</p>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Starting Confidence</p>
                <p className="text-sm font-bold text-navy mb-2">{learningProfile.confidence_label}</p>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full"
                    style={{ width: `${learningProfile.confidence_pct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{learningProfile.confidence_pct}%</p>
              </div>
            </div>

            {/* Question answers */}
            {learningProfile.answers && typeof learningProfile.answers === 'object' && (
              <div>
                <p className="text-xs font-semibold text-navy mb-3">Quiz Responses</p>
                <div className="space-y-2">
                  {([
                    { id: 1, question: 'How do you prefer to take in new information?', options: { A: 'Reading written guides or documentation', B: 'Watching demonstrations or videos', C: 'Hands-on practice and trying things myself', D: 'Listening and discussing with others' } },
                    { id: 2, question: 'When learning something new, what helps you most?', options: { A: 'A clear structure with step-by-step instructions', B: 'Understanding the "why" behind what I\'m doing', C: 'Seeing real examples and case studies', D: 'Being able to ask questions as I go' } },
                    { id: 3, question: 'How do you prefer to be assessed on new knowledge?', options: { A: 'Written quiz or test', B: 'Practical scenario or role play', C: 'Verbal discussion with a manager or trainer', D: 'Observed doing the task in a real situation' } },
                    { id: 4, question: 'How confident do you feel in the property management sector right now?', options: { A: 'Not confident at all — completely new to me', B: 'I have some awareness but limited experience', C: 'Fairly confident — I\'ve done similar things before', D: 'Very confident — I just need a refresher' } },
                    { id: 5, question: 'What tends to get in the way of your learning?', options: { A: 'Information overload — too much at once', B: 'Not enough time to practise what I\'ve learned', C: 'Unclear expectations of what I need to know', D: 'Lack of follow-up or support after training' } },
                    { id: 6, question: 'How do you best retain information after training?', options: { A: 'Re-reading my notes shortly after', B: 'Putting it into practice straight away', C: 'Talking it through with a colleague', D: 'Quick follow-up quizzes or reminders' } },
                    { id: 7, question: 'What motivates you most in a training session?', options: { A: 'Knowing exactly how it links to my day-to-day role', B: 'Interactive elements rather than just being talked at', C: 'Learning from others\' experiences and mistakes', D: 'Clear goals and outcomes from the start' } },
                    { id: 8, question: 'How do you prefer to receive feedback during training?', options: { A: 'Written feedback I can refer back to', B: 'Immediate verbal feedback in the moment', C: 'A debrief conversation at the end', D: 'A mix of all of the above' } },
                  ] as const).map(({ id, question, options }) => {
                    const saved = learningProfile.answers as Record<string, string>
                    const letterAnswer = saved[id] ?? saved[String(id)]
                    if (!letterAnswer) return null
                    const fullAnswer = options[letterAnswer as keyof typeof options] ?? letterAnswer
                    return (
                      <div key={id} className="flex items-start gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
                        <span className="text-[10px] font-bold text-slate-400 mt-0.5 flex-shrink-0 w-4">Q{id}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 leading-snug">{question}</p>
                          <p className="text-xs font-semibold text-navy mt-0.5">{fullAnswer}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Manager note */}
            {learningProfile.manager_note && (
              <div className="rounded-xl bg-white border border-slate-100 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Manager Note</p>
                <p className="text-xs text-slate-600 leading-relaxed">{learningProfile.manager_note}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <span className="text-base">🧠</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Learning profile not completed</p>
            <p className="text-xs text-slate-400 mt-0.5">{displayName} has not yet completed the learning profile quiz.</p>
          </div>
        </div>
      )}

      {allResults.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-sm font-semibold text-slate-500">No assessments completed yet</p>
          <p className="text-xs text-slate-400 mt-1">{displayName} has not submitted any assessments.</p>
        </div>
      )}

      <div className="space-y-4">
        {ALL_ASSESSMENT_IDS.map(assessmentId => {
          const attempts = byAssessment.get(assessmentId) ?? []
          if (attempts.length === 0) return null

          return (
            <div key={assessmentId} className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-navy truncate">{ASSESSMENT_LABELS[assessmentId] ?? assessmentId}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{attempts.length} attempt{attempts.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {attempts[0].passed ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-teal bg-teal/10 border border-teal/20 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                      <XCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                  )}
                  <span className={cn('text-lg font-black tabular-nums', {
                    'text-teal': attempts[0].score >= 80,
                    'text-amber-500': attempts[0].score >= 65 && attempts[0].score < 80,
                    'text-red-500': attempts[0].score < 65,
                  })}>
                    {attempts[0].score}%
                  </span>
                </div>
              </div>

              {attempts.map((attempt, attemptIdx) => {
                const answers: AnswerEntry[] = Array.isArray(attempt.answers) ? attempt.answers : []
                const completedDate = attempt.completed_at
                  ? new Date(attempt.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : '—'
                const correctCount = answers.filter(a => a.isCorrect).length

                return (
                  <div key={attemptIdx} className={cn('border-b border-slate-50 last:border-b-0', attemptIdx > 0 && 'bg-slate-50/40')}>
                    <div className="px-5 py-3 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium text-slate-500">
                        {attempts.length > 1 ? `Attempt ${attempts.length - attemptIdx}` : 'Latest attempt'} · {completedDate}
                      </span>
                      {answers.length > 0 && <span>{correctCount}/{answers.length} correct</span>}
                    </div>

                    {answers.length > 0 ? (
                      <div className="px-5 pb-5 space-y-3">
                        {answers.map((ans, qi) => (
                          <div
                            key={qi}
                            className={cn(
                              'rounded-xl border p-4',
                              ans.isCorrect ? 'border-teal/20 bg-teal/3' : 'border-red-200 bg-red-50/40',
                            )}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="mt-0.5 flex-shrink-0">
                                {ans.isCorrect
                                  ? <CheckCircle2 className="w-4 h-4 text-teal" />
                                  : <XCircle className="w-4 h-4 text-red-500" />
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-navy leading-snug">{ans.question}</p>
                                <div className="mt-2 space-y-1.5">
                                  <div className="flex items-start gap-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 w-20 flex-shrink-0 mt-0.5">Their answer</span>
                                    <span className={cn('text-xs leading-relaxed', ans.isCorrect ? 'text-teal font-medium' : 'text-red-600 font-medium')}>
                                      {ans.yourAnswer}
                                    </span>
                                  </div>
                                  {!ans.isCorrect && (
                                    <div className="flex items-start gap-2">
                                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 w-20 flex-shrink-0 mt-0.5">Correct</span>
                                      <span className="text-xs text-teal font-medium leading-relaxed">{ans.correctAnswer}</span>
                                    </div>
                                  )}
                                  {ans.rationale && (
                                    <div className="flex items-start gap-2 mt-1 pt-2 border-t border-slate-100">
                                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 w-20 flex-shrink-0 mt-0.5">Rationale</span>
                                      <span className="text-xs text-slate-500 leading-relaxed">{ans.rationale}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="px-5 pb-4 text-xs text-slate-400">No answer detail available for this attempt.</p>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Reassignment panel — failed assessments */}
      {(() => {
        const failedModules = ALL_ASSESSMENT_IDS
          .filter(id => byAssessment.has(id))
          .map(id => {
            const attempts = byAssessment.get(id)!
            const latest = attempts[0]
            return { assessmentId: id, score: latest.score, passed: latest.passed }
          })
          .filter(r => !r.passed)

        if (failedModules.length === 0) return null
        return (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-500" aria-hidden />
              <h2 className="text-sm font-bold text-navy">Reassignment Actions</h2>
              <span className="ml-auto text-xs text-slate-400">Grant a retake for failed assessments</span>
            </div>
            <div className="p-5 flex flex-wrap gap-3">
              {failedModules.map(f => (
                <div key={f.assessmentId} className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 flex items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-navy truncate max-w-[200px]">{ASSESSMENT_LABELS[f.assessmentId] ?? f.assessmentId}</p>
                    <p className="text-[11px] text-red-500">Score: {f.score}% · Failed</p>
                  </div>
                  <ReassignButton
                    userId={params.userId}
                    moduleId={f.assessmentId}
                    moduleName={ASSESSMENT_LABELS[f.assessmentId] ?? f.assessmentId}
                  />
                </div>
              ))}
            </div>
            <div className="px-5 pb-4">
              {failedModules.map(f => (
                <WrongAnswersPanel
                  key={f.assessmentId}
                  userId={params.userId}
                  moduleId={f.assessmentId}
                  moduleName={ASSESSMENT_LABELS[f.assessmentId] ?? f.assessmentId}
                  score={f.score}
                />
              ))}
            </div>
          </div>
        )
      })()}

      {/* Not yet attempted */}
      {(() => {
        const notAttempted = ALL_ASSESSMENT_IDS.filter(id => !byAssessment.has(id))
        if (notAttempted.length === 0) return null
        return (
          <div className="card p-5">
            <p className="text-sm font-bold text-navy mb-3">Not yet attempted ({notAttempted.length})</p>
            <div className="space-y-2">
              {notAttempted.map(id => (
                <div key={id} className="flex items-center gap-2.5 py-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 flex-shrink-0" />
                  <span className="text-sm text-slate-400">{ASSESSMENT_LABELS[id] ?? id}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

    </div>
  )
}
