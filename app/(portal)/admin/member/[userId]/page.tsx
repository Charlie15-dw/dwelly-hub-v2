import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { CRM2_LESSONS } from '@/lib/crm2-content'
import { cn } from '@/lib/utils'
import ReassignButton from '@/components/ui/ReassignButton'
import MemberAssessmentCard from '@/components/admin/MemberAssessmentCard'
import OnboardingControl from '@/components/admin/OnboardingControl'
import WrongAnswersPanel from '@/components/ui/WrongAnswersPanel'
import AssignManagerPanel from '@/components/ui/AssignManagerPanel'
import ChangeRolePanel from '@/components/ui/ChangeRolePanel'
import DeleteUserButton from '@/components/ui/DeleteUserButton'

const ALL_ASSESSMENT_IDS = [
  'mnt-01', 'mnt-02', 'cmp-01', 'cmp-02', 'mnt-03', 'ins-02',
  'sys-01', 'mvt-02', 'sys-02', 'sup-02',
  'kno-01', 'kno-02', 'kno-03', 'full-assessment', 'master-assessment',
  'release-contractor-portal-2026',
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
  'kno-01':            'Knowledge — Dwelly Best Practice',
  'kno-02':            'Knowledge — Repairs & Legal Responsibilities',
  'kno-03':            'Knowledge — Property Finances & the Ledger',
  'full-assessment':   'Full Programme Assessment',
  'master-assessment': 'Master Assessment',
  'release-contractor-portal-2026': 'New Product Release Quiz — Contractor Portal',
}

// CRM 2.0 assessments live in their own learning space. Their ids and labels
// are derived straight from the lesson data so this list stays in step
// automatically as lessons are added or renamed — no second list to maintain.
// (This is a server component, so importing the data module here has no cost to
// the client bundle.)
const CRM2_QUIZ_LESSONS = CRM2_LESSONS.filter(l => l.quizModuleId)
const CRM2_ASSESSMENT_IDS = CRM2_QUIZ_LESSONS.map(l => l.quizModuleId as string)
const CRM2_ASSESSMENT_LABELS: Record<string, string> = Object.fromEntries(
  CRM2_QUIZ_LESSONS.map(l => [l.quizModuleId as string, l.title]),
)

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
    .select('id, full_name, email, role, created_at, manager_id, onboarding_stage, onboarding_bypass')
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

  const [{ data: results }, { data: learningProfile }, { data: allSupervisors }, { data: pendingResets }] = await Promise.all([
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
      .select('id, full_name, email, role')
      .in('role', ['manager', 'admin']),
    service
      .from('module_resets')
      .select('module_id')
      .eq('user_id', params.userId)
      .is('consumed_at', null),
  ])

  const allResults = results ?? []
  const pendingResetIds = new Set((pendingResets ?? []).map(r => r.module_id))

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

      {/* Danger zone — permanently remove this user. Hidden for the admin's
          own account (they can't delete themselves). */}
      {params.userId !== user.id && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50/40 px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy">Delete this user</p>
            <p className="text-xs text-slate-500 mt-0.5">Permanently removes {displayName} and all of their records. This cannot be undone.</p>
          </div>
          <DeleteUserButton userId={params.userId} userName={displayName} userEmail={memberProfile.email ?? null} />
        </div>
      )}

      {/* Change role — admin only. Hidden for the admin's own account so they
          can't accidentally demote themselves out of admin access. */}
      {params.userId !== user.id && (
        <ChangeRolePanel
          userId={params.userId}
          currentRole={memberProfile.role as 'property-manager' | 'manager' | 'admin'}
        />
      )}

      {/* Staged onboarding — admin control over a new starter's journey.
          Only property-managers go through it (managers/admins skip). */}
      {memberProfile.role === 'property-manager' && (
        <OnboardingControl
          userId={params.userId}
          stage={memberProfile.onboarding_stage ?? 7}
          bypass={memberProfile.onboarding_bypass ?? false}
        />
      )}

      {/* Assign supervisor — admin only, property-managers only.
          Supervisors can be either managers or admins. */}
      {memberProfile.role === 'property-manager' && (
        <AssignManagerPanel
          userId={params.userId}
          currentManagerId={memberProfile.manager_id ?? null}
          supervisors={allSupervisors ?? []}
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
            <MemberAssessmentCard
              key={assessmentId}
              label={ASSESSMENT_LABELS[assessmentId] ?? assessmentId}
              attempts={attempts}
            />
          )
        })}
      </div>

      {/* CRM 2.0 Assessments — the private learning space's own knowledge checks
          and capstone. Kept in a separate section (and out of the header's
          passed-count, which is the core programme) so the two don't blur.
          Admin-only, like the rest of this page. Failed attempts surface here
          with their own reassignment panel, mirroring the core programme. */}
      {(() => {
        const crm2Attempted = CRM2_ASSESSMENT_IDS.filter(id => byAssessment.has(id))
        if (crm2Attempted.length === 0) return null
        const crm2Passed = CRM2_ASSESSMENT_IDS.filter(id => byAssessment.get(id)?.[0]?.passed).length
        const crm2Failed = CRM2_ASSESSMENT_IDS
          .filter(id => byAssessment.has(id))
          .map(id => {
            const latest = byAssessment.get(id)![0]
            return { assessmentId: id, score: latest.score, passed: latest.passed }
          })
          .filter(r => !r.passed)
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-indigo-500" aria-hidden />
              <h2 className="text-sm font-bold text-navy">CRM 2.0 Assessments</h2>
              <span className="ml-auto text-xs text-slate-400">{crm2Passed}/{CRM2_ASSESSMENT_IDS.length} passed</span>
            </div>
            {CRM2_ASSESSMENT_IDS.map(id => {
              const attempts = byAssessment.get(id) ?? []
              if (attempts.length === 0) return null
              return (
                <MemberAssessmentCard
                  key={id}
                  label={CRM2_ASSESSMENT_LABELS[id] ?? id}
                  attempts={attempts}
                />
              )
            })}

            {/* Reassignment — failed CRM 2.0 assessments. Same control and reset
                flow as the core programme (crm2-* ids work through the same
                /api/manager/reassign endpoint and quiz unlock logic). */}
            {crm2Failed.length > 0 && (
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-500" aria-hidden />
                  <h2 className="text-sm font-bold text-navy">CRM 2.0 Reassignment Actions</h2>
                  <span className="ml-auto text-xs text-slate-400">Grant a retake for failed CRM 2.0 assessments</span>
                </div>
                <div className="p-5 flex flex-wrap gap-3">
                  {crm2Failed.map(f => (
                    <div key={f.assessmentId} className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 flex items-center gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-navy truncate max-w-[200px]">{CRM2_ASSESSMENT_LABELS[f.assessmentId] ?? f.assessmentId}</p>
                        <p className="text-[11px] text-red-500">Score: {f.score}% · Failed</p>
                      </div>
                      <ReassignButton
                        userId={params.userId}
                        moduleId={f.assessmentId}
                        moduleName={CRM2_ASSESSMENT_LABELS[f.assessmentId] ?? f.assessmentId}
                        pending={pendingResetIds.has(f.assessmentId)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })()}

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
                    pending={pendingResetIds.has(f.assessmentId)}
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

      {/* Recap & Refresh scores */}
      {(() => {
        const recapResults = allResults.filter(r => r.assessment_id.startsWith('recap-'))
        if (recapResults.length === 0) return null
        // Deduplicate — keep best score per round
        const bestByRound = new Map<string, typeof recapResults[0]>()
        for (const r of recapResults) {
          const existing = bestByRound.get(r.assessment_id)
          if (!existing || r.score > existing.score) bestByRound.set(r.assessment_id, r)
        }
        const rounds = Array.from(bestByRound.values()).sort((a, b) => b.completed_at.localeCompare(a.completed_at))
        return (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-500" aria-hidden />
              <h2 className="text-sm font-bold text-navy">Recap &amp; Refresh</h2>
              <span className="ml-auto text-xs text-slate-400">{rounds.length} round{rounds.length !== 1 ? 's' : ''} completed</span>
            </div>
            <div className="divide-y divide-slate-50">
              {rounds.map(r => {
                const label = r.assessment_id.replace('recap-', '').replace(/-(\d+)$/, ' $1').replace(/\b\w/g, (c: string) => c.toUpperCase())
                const date = r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
                return (
                  <div key={r.assessment_id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-semibold text-navy">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{date}</p>
                    </div>
                    <span className={cn('text-sm font-bold tabular-nums px-3 py-1 rounded-full', {
                      'bg-teal/10 text-teal border border-teal/20': r.score >= 80,
                      'bg-amber-50 text-amber-600 border border-amber-200': r.score >= 60 && r.score < 80,
                      'bg-red-50 text-red-600 border border-red-200': r.score < 60,
                    })}>
                      {r.score}%
                    </span>
                  </div>
                )
              })}
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
                <div key={id} className="flex items-center justify-between gap-2.5 py-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 flex-shrink-0" />
                    <span className="text-sm text-slate-400">{ASSESSMENT_LABELS[id] ?? id}</span>
                  </div>
                  <ReassignButton
                    userId={params.userId}
                    moduleId={id}
                    moduleName={ASSESSMENT_LABELS[id] ?? id}
                    pending={pendingResetIds.has(id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })()}

    </div>
  )
}
