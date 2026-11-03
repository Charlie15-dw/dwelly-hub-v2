import { redirect } from 'next/navigation'
import { CheckCircle2, Target, Users2 } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { roleSkipsOnboarding } from '@/lib/onboarding-gate'
import { departmentMeta } from '@/lib/departments'
import WelcomeContinueButton from '@/components/onboarding/WelcomeContinueButton'

// Step 2 of 2 of the welcome gate. Pulls the learner's own department's
// real overview from lib/departments.ts (DEPARTMENT_META) — same content
// source the rest of the department rebuild uses, so this never drifts out
// of sync with it.
export default async function WelcomeRolePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, role, department')
    .eq('id', user.id)
    .maybeSingle()

  if (roleSkipsOnboarding(profile?.role)) redirect('/hub')

  const meta = departmentMeta(profile?.department)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-widest text-orange">
          Welcome · Step 2 of 2
        </p>
        <h1 className="mt-2 text-[30px] sm:text-[34px] font-bold tracking-tight text-navy leading-[1.1]">
          Your role: {meta.label}
        </h1>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-[1.6] text-[var(--text-secondary)]">
          {meta.summary}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#EEF3FE] text-orange">
              <CheckCircle2 className="w-4.5 h-4.5" aria-hidden />
            </span>
            <h2 className="font-bold text-navy">What good looks like</h2>
          </div>
          <ul className="space-y-2">
            {meta.whatGoodLooksLike.map((line) => (
              <li key={line} className="text-sm text-navy leading-relaxed flex gap-2">
                <span className="text-orange flex-shrink-0">•</span>{line}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#F2F2F3] text-navy">
              <Target className="w-4.5 h-4.5" aria-hidden />
            </span>
            <h2 className="font-bold text-navy">Expectations</h2>
          </div>
          <ul className="space-y-2">
            {meta.expectations.map((line) => (
              <li key={line} className="text-sm text-navy leading-relaxed flex gap-2">
                <span className="text-navy/40 flex-shrink-0">•</span>{line}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5 sm:col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#F2F2F3] text-navy">
              <Users2 className="w-4.5 h-4.5" aria-hidden />
            </span>
            <h2 className="font-bold text-navy">How your work connects to other teams</h2>
          </div>
          <ul className="space-y-2">
            {meta.crossovers.map((line) => (
              <li key={line} className="text-sm text-navy leading-relaxed flex gap-2">
                <span className="text-navy/40 flex-shrink-0">•</span>{line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {meta.trainingStatus !== 'built' && (
        <div className="card p-5 bg-[#F2F2F3] border-none">
          <p className="text-sm font-semibold text-navy mb-1">
            {meta.trainingStatus === 'early' ? 'Training is being built' : 'Training hasn\u2019t started yet'}
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{meta.trainingStatusNote}</p>
        </div>
      )}

      <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          That&rsquo;s the welcome tour done — next you&rsquo;ll head into your training.
        </p>
        <WelcomeContinueButton step="role" label="Enter the Hub" />
      </div>
    </div>
  )
}
