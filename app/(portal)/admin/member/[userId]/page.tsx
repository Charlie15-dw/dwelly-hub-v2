import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import ReassignButton from '@/components/ui/ReassignButton'
import WrongAnswersPanel from '@/components/ui/WrongAnswersPanel'

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

  const { data: results } = await service
    .from('assessment_results')
    .select('assessment_id, score, passed, answers, completed_at')
    .eq('user_id', params.userId)
    .order('completed_at', { ascending: false })

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
