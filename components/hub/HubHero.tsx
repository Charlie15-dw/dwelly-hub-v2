import Link from 'next/link'
import { ArrowLeft, type LucideIcon } from 'lucide-react'

// Shared Hub page hero — the navy CRM 2.0 hero (blur orbs, dot-grid, glass
// pill) plus a Back-to-Hub breadcrumb. Used by the simpler Hub area pages
// (practice, request training, deposit simulator) so their elevated variants
// share one hero rather than three copies.

export default function HubHero({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  backHref = '/hub',
  backLabel = 'Back to Hub',
}: {
  eyebrow: string
  title: string
  subtitle: string
  icon: LucideIcon
  backHref?: string
  backLabel?: string
}) {
  return (
    <>
      <Link href={backHref} className="hub-fade inline-flex items-center gap-1.5 text-[14px] text-[var(--text-secondary)] hover:text-navy transition-colors">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        {backLabel}
      </Link>

      <section className="hub-fade relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hub-orb-a absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-[#0071E3]/30 blur-3xl" />
          <div className="hub-orb-b absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full bg-[#0071E3]/12 blur-3xl" />
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
        <div className="relative px-7 py-9 sm:px-10 sm:py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Icon className="w-3.5 h-3.5 text-orange-200" aria-hidden />
            {eyebrow}
          </span>
          <h1 className="mt-4 text-[34px] leading-[1.1] font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-3 max-w-[56ch] text-[15px] text-white/70 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>
    </>
  )
}
