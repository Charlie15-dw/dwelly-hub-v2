import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ChevronRight, Target, Check, Search, BarChart3, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createServerClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { isMaintenancePreview } from '@/lib/preview'
import {
  CRM2_PILLARS, CRM2_GUIDE_COUNT, getCrm2GuideNumber, getCrm2Guides,
} from '@/lib/crm2-content'
import { getCrm2DashboardData } from '@/lib/crm2-dashboard'
import ProgressRing from '@/components/crm2/ProgressRing'
import ResumeCard from '@/components/crm2/ResumeCard'
import GuideRow from '@/components/crm2/GuideRow'
import CertificateProgress from '@/components/crm2/CertificateProgress'

// CRM 2.0 → Compliance. The guides, progress and practice for the compliance
// track, reached by clicking "Compliance" on the 2.0 tab. The 2.0 tab itself is
// now a chooser (Maintenance vs Compliance); this holds what used to sit on the
// landing. Gated to the same allow-list as the chooser split for now.
export default async function Crm2CompliancePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')
  // The Maintenance/Compliance split is preview-only; anyone outside it lands
  // back on the (still single-page) 2.0 tab.
  if (!isMaintenancePreview(user.email)) redirect('/hub/crm-2')

  const { data: roleRow } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).maybeSingle()
  const isAdmin = roleRow?.role === 'admin'

  const {
    hasCertificate, guidesDone, outstandingGuides, nextGuide, minutesLeft, pillarProgress, completed,
  } = await getCrm2DashboardData(supabase, user.id)

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
          <ShieldCheck className="w-6 h-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-[26px] font-bold text-navy leading-tight tracking-tight">Compliance</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
            Run the agent-led compliance flow with confidence — {CRM2_GUIDE_COUNT} guides, then prove it.
          </p>
        </div>
      </header>

      {/* Admin-only — jump to the org-wide assessment command centre */}
      {isAdmin && (
        <Link
          href="/hub/crm-2/overview"
          className="card card-hover p-5 flex items-center gap-4 group"
        >
          <span className="w-11 h-11 rounded-xl bg-navy text-white flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5" aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-navy">Assessment overview</p>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
              Admin · track everyone&rsquo;s knowledge-check results and grant retakes
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-orange flex-shrink-0 group-hover:gap-2 transition-all">
            Open <ChevronRight className="w-4 h-4" aria-hidden />
          </span>
        </Link>
      )}

      {/* Where was I + how far in am I */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4 items-stretch">
        <ResumeCard
          next={nextGuide ? { slug: nextGuide.slug, title: nextGuide.title, minutes: nextGuide.minutes } : null}
          guidesDone={guidesDone}
          guidesTotal={CRM2_GUIDE_COUNT}
          minutesLeft={minutesLeft}
          outstanding={outstandingGuides.length}
          hasCertificate={hasCertificate}
        />
        <ProgressRing done={guidesDone} total={CRM2_GUIDE_COUNT} pillars={pillarProgress} />
      </div>

      {/* The guides, as one row group per pillar */}
      {CRM2_PILLARS.map(({ id, label, description }, pillarIndex) => {
        const guides = getCrm2Guides(id)
        if (guides.length === 0) return null
        const done = guides.filter((g) => completed.has(g.slug)).length
        const minutes = guides.reduce((s, g) => s + g.minutes, 0)
        const complete = done === guides.length
        return (
          <section key={id} className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-navy-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center text-[15px] font-bold tabular-nums flex-shrink-0',
                    complete ? 'rag-green' : 'bg-navy text-white',
                  )}
                >
                  {complete ? <Check className="w-4 h-4" strokeWidth={2.5} aria-hidden /> : pillarIndex + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[16px] font-bold text-navy leading-tight">{label}</h2>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-snug">{description}</p>
                </div>
              </div>
              <span className="text-[12.5px] font-medium text-[var(--text-secondary)] tabular-nums whitespace-nowrap flex-shrink-0">
                {minutes} min · {done} of {guides.length} read
              </span>
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
        )
      })}

      {/* Prove it — practice and the certificate */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-navy">Prove it</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          <Link href="/hub/crm-2/practice" className="card card-hover p-6 flex flex-col justify-between group">
            <div className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-2xl bg-orange/10 text-orange flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[18px] font-bold text-navy leading-snug">Practice drills</p>
                <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                  Work realistic jobs decision-by-decision. No score recorded — pure practice.
                </p>
              </div>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-orange self-start group-hover:gap-2 transition-all">
              Start practising <ChevronRight className="w-4 h-4" aria-hidden />
            </span>
          </Link>

          <CertificateProgress guidesDone={guidesDone} guidesTotal={CRM2_GUIDE_COUNT} hasCertificate={hasCertificate} />
        </div>
        <Link
          href="/hub/crm-2/assessments"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-secondary)] hover:text-navy transition-colors"
        >
          <Search className="w-3.5 h-3.5" aria-hidden /> Browse all knowledge checks
        </Link>
      </section>
    </div>
  )
}
