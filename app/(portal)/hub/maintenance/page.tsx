import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Wrench, ClipboardCheck, ChevronRight, Hammer } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isMaintenancePreview } from '@/lib/preview'

// Maintenance — the sibling learning space to CRM 2.0 Compliance. This is the
// scaffold: the section, hero and navigation are in place so guides and
// knowledge checks can be dropped in going forward. Locked to a single account
// (see isMaintenancePreview) while there's no content to share yet.

export default async function MaintenancePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isMaintenancePreview(user.email)) redirect('/hub')

  return (
    <div className="mx-auto max-w-[880px] space-y-7 hub-fade">
      {/* Hero — mirrors the CRM 2.0 Compliance landing */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hub-orb-a absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-orange/30 blur-3xl" />
          <div className="hub-orb-b absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full bg-orange/12 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
              backgroundSize: '30px 30px',
              maskImage: 'radial-gradient(ellipse at 75% 0%, #000 0%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 75% 0%, #000 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative px-7 py-9 sm:px-10 sm:py-11">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Wrench className="w-3.5 h-3.5 text-orange-200" aria-hidden />
            In build
          </span>

          <h1 className="mt-4 text-[40px] leading-[1.05] font-bold tracking-tight text-white">
            Master <span className="hub-shimmer">Maintenance</span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-white/70 leading-relaxed">
            Everything you need to run the maintenance flow with confidence, one guide at a time.
          </p>
        </div>
      </section>

      {/* Empty state — the shell is ready; content drops in here going forward */}
      <section className="card p-10 flex flex-col items-center text-center">
        <span className="w-14 h-14 rounded-2xl bg-navy-50 text-navy flex items-center justify-center">
          <Hammer className="w-7 h-7" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-bold text-navy">Content coming soon</h2>
        <p className="mt-2 max-w-md text-[14px] text-[var(--text-secondary)] leading-relaxed">
          The Maintenance guides and knowledge checks are being written. They&rsquo;ll appear here as
          they&rsquo;re added — the structure is ready so nothing else needs to change.
        </p>
        <Link
          href="/hub/maintenance/assessments"
          className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-orange group"
        >
          <ClipboardCheck className="w-4 h-4" aria-hidden /> Maintenance assessments
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
        </Link>
      </section>
    </div>
  )
}
