import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Workflow, Bot, UserCheck, GitBranch } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { isMaintenancePreview } from '@/lib/preview'
import { getCrm2GuideNumber, getCrm2Guides } from '@/lib/crm2-content'
import { getCrm2DashboardData } from '@/lib/crm2-dashboard'
import GuideRow from '@/components/crm2/GuideRow'

// CRM 2.0 → How it works. The shared overview both tracks start from: the
// "Get orientated" guides describe the agent model, the job screen and the
// human checkpoints, none of which are compliance- or maintenance-specific.
// Pulling them out of the Compliance list stops the same content living in two
// places. Progress still counts these guides towards the same certificate, so
// this page reads the shared dashboard data for its read/in-progress states.
//
// This page is preview-gated (maintenance allow-list), so it can safely name
// both tracks — the general overview below is the one place that describes 2.0
// as a single model spanning compliance and maintenance.
export default async function Crm2GettingStartedPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')
  if (!isMaintenancePreview(user.email)) redirect('/hub/crm-2')

  const { completed, nextGuide, guidesDone } = await getCrm2DashboardData(supabase, user.id)
  const guides = getCrm2Guides('orientate')

  return (
    <div className="mx-auto max-w-[880px] space-y-7 hub-fade">
      <Link
        href="/hub/crm-2"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden /> CRM 2.0
      </Link>

      <header className="flex items-start gap-4">
        <span className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center flex-shrink-0">
          <Workflow className="w-6 h-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-[26px] font-bold text-navy leading-tight tracking-tight">How CRM 2.0 works</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
            The shared model behind both tracks — the agent, the job screen and the checkpoints
            that are always yours. Get this first, then dive into maintenance or compliance.
          </p>
        </div>
      </header>

      {/* General overview — 2.0 as one model across both tracks. This is the
          only page that names both, so it stays here rather than in the shared
          how-it-works lesson (which every compliance user sees). */}
      <section className="card p-6 sm:p-7 space-y-5">
        <div>
          <h2 className="text-[19px] font-bold text-navy leading-snug">One system, two kinds of work</h2>
          <p className="text-[15px] text-navy-800 leading-relaxed mt-2 max-w-[68ch]">
            CRM 2.0 runs two kinds of job — <strong className="font-semibold text-navy">compliance</strong> (getting a
            certificate: gas, electrical, EPC) and <strong className="font-semibold text-navy">maintenance</strong> (fixing
            a repair) — and it runs both the same way. Learn the shared model once and you can work either track.
          </p>
        </div>

        {/* What's the same */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-navy-100 bg-navy-50/40 p-4">
            <Bot className="w-5 h-5 text-orange" aria-hidden />
            <p className="text-[14px] font-semibold text-navy mt-2.5">An agent runs the routine</p>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed mt-1">
              One AI agent drives the job end to end: it asks the landlord to approve, lines up the provider,
              brokers the visit, chases the paperwork and closes it.
            </p>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-navy-50/40 p-4">
            <UserCheck className="w-5 h-5 text-orange" aria-hidden />
            <p className="text-[14px] font-semibold text-navy mt-2.5">You own the checkpoints</p>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed mt-1">
              You step in only at the handful of points that need judgement. The agent chases on a set cadence,
              then escalates to you if it stalls.
            </p>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-navy-50/40 p-4">
            <GitBranch className="w-5 h-5 text-orange" aria-hidden />
            <p className="text-[14px] font-semibold text-navy mt-2.5">Same screen, same branches</p>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed mt-1">
              Both tracks share the job screen, the buttons, and the side branches when a job leaves the happy
              path: landlord DIY, move to manual, and cancel.
            </p>
          </div>
        </div>

        {/* Where they differ */}
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2.5">
            Where the two tracks differ
          </p>
          <div className="overflow-x-auto rounded-2xl border border-navy-100">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-navy-50 border-b border-navy-100">
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide" />
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Compliance</th>
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Maintenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                <tr>
                  <td className="px-4 py-3 font-semibold text-navy align-top">The job</td>
                  <td className="px-4 py-3 text-navy-800 leading-relaxed align-top">One certificate — CP12, EICR, EPC</td>
                  <td className="px-4 py-3 text-navy-800 leading-relaxed align-top">One repair — a leak, a boiler, a blockage</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-navy align-top">Who picks the provider</td>
                  <td className="px-4 py-3 text-navy-800 leading-relaxed align-top">The agent finds the contractor</td>
                  <td className="px-4 py-3 text-navy-800 leading-relaxed align-top">You always pick the provider — never automatic</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-navy align-top">Your checkpoints</td>
                  <td className="px-4 py-3 text-navy-800 leading-relaxed align-top">Two — certificate review, invoice review</td>
                  <td className="px-4 py-3 text-navy-800 leading-relaxed align-top">Three — tenant triage, provider selection, invoice check</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The shared orientate guides */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-bold text-navy">Start here — the shared guides</h2>
        <div className="card overflow-hidden">
          <div>
            {guides.map((g) => (
              <GuideRow
                key={g.slug}
                slug={g.slug}
                number={getCrm2GuideNumber(g.slug) ?? 0}
                title={g.title}
                summary={g.summary}
                minutes={g.minutes}
                read={completed.has(g.slug)}
                inProgress={nextGuide?.slug === g.slug && guidesDone > 0}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
