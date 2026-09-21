import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Workflow } from 'lucide-react'
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

      <section className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-navy-100">
          <h2 className="text-[16px] font-bold text-navy leading-tight">Get orientated</h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-snug">
            How CRM 2.0 works and how to find your way around it.
          </p>
        </div>
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
      </section>
    </div>
  )
}
