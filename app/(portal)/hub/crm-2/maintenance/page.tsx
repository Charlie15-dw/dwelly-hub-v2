import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ChevronRight, Wrench, Clock, BookOpen, Target,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { isMaintenancePreview } from '@/lib/preview'
import {
  MAINTENANCE_PILLARS, MAINTENANCE_GUIDE_COUNT, MAINTENANCE_GUIDE_MINUTES,
  getMaintenanceGuideNumber, getMaintenanceGuides,
} from '@/lib/crm2-maintenance-content'
import GuideRow from '@/components/crm2/GuideRow'

// CRM 2.0 → Maintenance. The sibling track to Compliance, reached from the 2.0
// tab chooser. Lists the maintenance guides grouped by pillar, in the same style
// as the compliance landing — minus the progress / certificate machinery, which
// is compliance-only. Gated to the same preview allow-list as the split.
export default async function Crm2MaintenancePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')
  if (!isMaintenancePreview(user.email)) redirect('/hub/crm-2')

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
          <Wrench className="w-6 h-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-[26px] font-bold text-navy leading-tight tracking-tight">Maintenance</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
            Run a repair end to end the agent-led way — {MAINTENANCE_GUIDE_COUNT} guides across the ten stages.
          </p>
        </div>
      </header>

      {/* At-a-glance — the shape of the track */}
      <div className="card p-5 flex items-center gap-6 flex-wrap">
        <span className="flex items-center gap-2.5 text-[14px] text-navy-800">
          <BookOpen className="w-4 h-4 text-orange" aria-hidden />
          <span className="font-semibold">{MAINTENANCE_GUIDE_COUNT}</span> guides
        </span>
        <span className="hidden sm:block w-px h-4 bg-navy-100" aria-hidden />
        <span className="flex items-center gap-2.5 text-[14px] text-navy-800">
          <Clock className="w-4 h-4 text-orange" aria-hidden />
          <span className="font-semibold">{MAINTENANCE_GUIDE_MINUTES}</span> min end to end
        </span>
        <span className="hidden sm:block w-px h-4 bg-navy-100" aria-hidden />
        <span className="flex items-center gap-2.5 text-[14px] text-navy-800">
          <Target className="w-4 h-4 text-orange" aria-hidden />
          <span className="font-semibold">3</span> human checkpoints
        </span>
      </div>

      {/* The guides, as one row group per pillar. */}
      {MAINTENANCE_PILLARS.map(({ id, label, description }, pillarIndex) => {
        const guides = getMaintenanceGuides(id)
        if (guides.length === 0) return null
        const minutes = guides.reduce((s, g) => s + g.minutes, 0)
        return (
          <section key={id} className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-navy-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-navy text-white flex items-center justify-center text-[15px] font-bold tabular-nums flex-shrink-0">
                  {pillarIndex + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[16px] font-bold text-navy leading-tight">{label}</h2>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-snug">{description}</p>
                </div>
              </div>
              <span className="text-[12.5px] font-medium text-[var(--text-secondary)] tabular-nums whitespace-nowrap flex-shrink-0">
                {minutes} min · {guides.length} guides
              </span>
            </div>
            <div>
              {guides.map((g) => (
                <GuideRow
                  key={g.slug}
                  slug={g.slug}
                  href={`/hub/crm-2/maintenance/${g.slug}`}
                  number={getMaintenanceGuideNumber(g.slug) ?? 0}
                  title={g.title}
                  summary={g.summary}
                  minutes={g.minutes}
                  read={false}
                  inProgress={false}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Prove it — the maintenance knowledge checks live in the shared
          assessments home, alongside the compliance ones. */}
      <Link href="/hub/crm-2/assessments" className="card card-hover p-5 flex items-center gap-4 group">
        <span className="w-11 h-11 rounded-xl bg-orange/10 text-orange flex items-center justify-center flex-shrink-0">
          <Target className="w-5 h-5" aria-hidden />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-navy">Test yourself</p>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Short knowledge checks on the maintenance guides — 80% to pass, retake as often as you like.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[14px] font-semibold text-orange flex-shrink-0 group-hover:gap-2 transition-all">
          Open <ChevronRight className="w-4 h-4" aria-hidden />
        </span>
      </Link>
    </div>
  )
}
