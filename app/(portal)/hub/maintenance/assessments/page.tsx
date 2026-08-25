import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, ClipboardCheck } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isMaintenancePreview } from '@/lib/preview'

// Maintenance assessments — the scaffold for the section's knowledge checks.
// Mirrors the CRM 2.0 Compliance assessments layout; the grid of checks fills
// in once the maintenance content exists. Locked to the same single account as
// the rest of the Maintenance space while it's being built.

export default async function MaintenanceAssessmentsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isMaintenancePreview(user.email)) redirect('/hub')

  return (
    <div className="space-y-8 hub-fade">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/hub/maintenance" className="text-[var(--text-secondary)] hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Maintenance
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
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-white">Maintenance Assessments</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
            Short knowledge checks for the key maintenance lessons. These will appear here as the
            content is added.
          </p>
        </div>
      </section>

      {/* Empty state — checks list in here once maintenance content exists */}
      <section className="card p-10 flex flex-col items-center text-center">
        <span className="w-14 h-14 rounded-2xl bg-orange/10 text-orange flex items-center justify-center">
          <ClipboardCheck className="w-7 h-7" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-bold text-navy">No knowledge checks yet</h2>
        <p className="mt-2 max-w-md text-[14px] text-[var(--text-secondary)] leading-relaxed">
          Maintenance knowledge checks are on the way. Once they&rsquo;re added they&rsquo;ll be
          listed here, grouped just like the CRM 2.0 Compliance checks.
        </p>
      </section>
    </div>
  )
}
