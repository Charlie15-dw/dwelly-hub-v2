import Link from 'next/link'
import { Award, Check, Lock } from 'lucide-react'
import type { ElevatedHome as ElevatedData, NeedsYouItem } from '@/lib/hub-progress'
import type { CompetencyStatus, CertificationStatus } from '@/lib/passport'
import NeedsYou from '@/components/hub/NeedsYou'

// The gated "Today first" elevated Hub home. Recognition, not ranking: nothing
// here compares one Property Manager to another. Every number is passed in from
// getHubHome() so the hero ring, the Passport card and the Passport preview can
// never disagree. All motion is decorative and zeroed by html.reduce-motion.

const RING_R = 64
const RING_C = 2 * Math.PI * RING_R // circumference ≈ 402

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const CERT_LABEL: Record<CertificationStatus, string> = {
  certified: 'Certified',
  'recert-due': 'Recert due',
  'in-training': 'In training',
  'not-started': 'Not started',
}

// Section bar fill colour by competency: gold for proficient (earned), blue for
// developing (in progress), nothing for not-started.
function sectionFill(status: CompetencyStatus): string {
  if (status === 'proficient') return 'linear-gradient(90deg,#E9C767,#C9A84C)'
  if (status === 'developing') return '#0071E3'
  return 'rgba(255,255,255,0.25)'
}

export default function ElevatedHome({
  firstName,
  roleLabel = 'Property Manager',
  needsYou,
  data,
}: {
  firstName: string
  roleLabel?: string
  needsYou: NeedsYouItem[]
  data: ElevatedData
}) {
  const { fullName, summary, sections, achievements, milestones, certification, avgScore } = data

  const pct = summary.progressPct
  const ringOffset = RING_C * (1 - pct / 100)
  const remaining = summary.totalCount - summary.passedCount

  const heroLine =
    remaining === 0
      ? 'Every assessment passed. Your Competency Passport is signed, dated and yours to keep.'
      : `${remaining} assessment${remaining === 1 ? '' : 's'} left. Pass ${remaining === 1 ? 'it' : 'them'} and the Competency Passport is yours — signed, dated, and yours to keep.`

  const earnedCount = achievements.filter(a => a.earned).length
  const shelf = [...achievements.filter(a => a.earned), ...achievements.filter(a => !a.earned)].slice(0, 5)

  const passportTitle =
    remaining === 0
      ? 'Your Competency Passport is complete'
      : remaining <= 2
        ? `${remaining} away from your Competency Passport`
        : 'Your Competency Passport is taking shape'
  const passportPill = remaining === 0 ? 'Complete' : remaining <= 2 ? 'Nearly there' : 'In progress'

  return (
    <div className="space-y-8 max-w-[900px]">
      {/* 1 — Hero: greeting, one honest sentence, progress ring */}
      <section className="hub-fade relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel px-9 py-8">
        <div className="hub-orb-a pointer-events-none absolute -top-28 -right-16 w-[300px] h-[300px] rounded-full bg-[#0071E3]/30 blur-3xl" aria-hidden />
        <div className="hub-orb-b pointer-events-none absolute -bottom-32 -left-10 w-[300px] h-[300px] rounded-full bg-[#C9A84C]/20 blur-3xl" aria-hidden />

        <div className="relative flex items-center gap-11 flex-wrap">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-sm text-white/70">{greeting()},</p>
            <h2 className="hub-shimmer text-[38px] font-bold leading-none">{firstName || '…'}</h2>
            <p className="text-[15px] leading-relaxed text-white/75 max-w-[420px] pt-1.5">{heroLine}</p>
            <div className="flex items-center gap-2.5 flex-wrap pt-3">
              {avgScore != null && (
                <span className="text-[12.5px] font-semibold text-white bg-white/12 border border-white/20 px-3 py-1.5 rounded-full">
                  {avgScore}% average
                </span>
              )}
              <span className="text-[12.5px] font-semibold text-white bg-white/12 border border-white/20 px-3 py-1.5 rounded-full">
                {earnedCount} of {achievements.length} achievements
              </span>
            </div>
          </div>

          <div className="relative w-[176px] h-[176px] flex-shrink-0 flex items-center justify-center">
            <svg width="176" height="176" viewBox="0 0 196 196" className="absolute inset-0">
              <circle cx="98" cy="98" r={RING_R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" />
              <circle
                cx="98"
                cy="98"
                r={RING_R}
                fill="none"
                stroke="#0071E3"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                transform="rotate(-90 98 98)"
                className="hub-arc"
                style={{ ['--arc-offset' as string]: `${ringOffset}`, strokeDashoffset: ringOffset }}
              />
            </svg>
            <div className="relative flex flex-col items-center">
              <span className="text-[44px] font-bold leading-none tabular-nums">{pct}%</span>
              <span className="text-[12.5px] text-white/60 mt-1">complete</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Needs you */}
      <div className="hub-fade-1">
        <NeedsYou items={needsYou} />
      </div>

      {/* 3 — Passport progress, in gold (earned, never a button colour) */}
      <section
        className="hub-fade-2 relative overflow-hidden bg-white rounded-2xl border shadow-card px-7 py-6 flex items-center gap-7"
        style={{ borderColor: '#E8DCC0' }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#C9A84C,transparent)' }} aria-hidden />
        <div className="hub-sheen absolute top-0 bottom-0 w-24" style={{ background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.14),transparent)' }} aria-hidden />

        <span
          className="relative flex-shrink-0 rounded-2xl flex items-center justify-center text-white"
          style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#E9C767,#C9A84C)', boxShadow: '0 4px 14px rgba(201,168,76,0.35)' }}
        >
          <Award className="w-6 h-6" aria-hidden />
        </span>

        <div className="relative flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[18px] font-semibold text-navy">{passportTitle}</span>
            <span
              className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
              style={{ background: '#FDF8EC', color: '#8A6D22', border: '1px solid #E8DCC0' }}
            >
              {passportPill}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F1EADA' }}>
            <span className="hub-bar block h-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#E9C767,#C9A84C)' }} />
          </div>
          <p className="text-[13.5px] text-[var(--text-secondary)]">
            {summary.passedCount} of {summary.totalCount} assessments passed · the Passport is a signed, dated PDF you can take anywhere
          </p>
        </div>

        <Link href="/passport" className="relative btn-primary bg-navy hover:bg-navy/90 text-[14px] flex-shrink-0">
          Preview it
        </Link>
      </section>

      {/* 4 — Achievement shelf */}
      <section className="hub-fade-3 space-y-3.5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Your shelf · {earnedCount} of {achievements.length}
          </h3>
          <Link href="/passport" className="text-[13.5px] font-semibold text-orange hover:underline">See all</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {shelf.map((a, i) => (
            <div
              key={a.id}
              className={
                a.earned
                  ? 'relative overflow-hidden bg-white border border-[#E8E8ED] rounded-2xl px-3 py-[18px] flex flex-col items-center gap-2 shadow-card'
                  : 'relative bg-[#F5F5F7] border border-[#E8E8ED] rounded-2xl px-3 py-[18px] flex flex-col items-center gap-2'
              }
            >
              {a.earned ? (
                <>
                  <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#C9A84C,transparent)' }} aria-hidden />
                  <span
                    className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full flex items-center justify-center text-white"
                    style={{ background: 'linear-gradient(135deg,#E9C767,#C9A84C)' }}
                  >
                    <Check className="w-2.5 h-2.5" strokeWidth={3.5} aria-hidden />
                  </span>
                  <span className="hub-medal text-[28px] leading-none" style={{ animationDelay: `${0.4 + i * 0.08}s` }}>{a.icon}</span>
                  <span className="text-[12.5px] font-semibold text-center leading-tight text-navy">{a.title}</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">Earned</span>
                </>
              ) : (
                <>
                  <span className="absolute top-2 right-2 text-[var(--text-tertiary)]"><Lock className="w-3 h-3" aria-hidden /></span>
                  <span className="text-[28px] leading-none grayscale opacity-40">{a.icon}</span>
                  <span className="text-[12.5px] font-semibold text-center leading-tight text-[var(--text-secondary)]">{a.title}</span>
                  <span className="text-[11px] text-[var(--text-secondary)] text-center leading-tight">{a.description}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5 — Passport preview: the artefact, with the learner's name on it */}
      <section className="hub-fade-4 space-y-3.5">
        <h3 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">What you&apos;re working towards</h3>
        <div className="relative overflow-hidden rounded-3xl bg-navy shadow-panel px-9 py-8 text-white">
          <div className="hub-orb-a pointer-events-none absolute -top-28 -right-20 w-[280px] h-[280px] rounded-full bg-[#C9A84C]/20 blur-3xl" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'linear-gradient(90deg,transparent,#C9A84C,transparent)' }} aria-hidden />

          <div className="relative flex items-start justify-between gap-8 flex-wrap">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#C9A84C' }}>Dwelly Competency Passport</span>
              <span className="text-[28px] font-bold tracking-tight">{fullName || firstName}</span>
              <span className="text-sm text-white/60">
                {roleLabel} · <span className="font-semibold" style={{ color: '#C9A84C' }}>{CERT_LABEL[certification]}</span> · {summary.passedCount} of {summary.totalCount} · issued as a verifiable PDF on completion
              </span>
            </div>
            <span
              className="w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg,#E9C767,#C9A84C)', boxShadow: '0 6px 20px rgba(201,168,76,0.4)' }}
            >
              <Award className="w-6 h-6" aria-hidden />
            </span>
          </div>

          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8 pt-6 border-t border-white/12">
            {sections.map(s => (
              <div key={s.section} className="flex flex-col gap-2">
                <span className="text-[11.5px] font-semibold text-white/60">{s.section}</span>
                <div className="h-[5px] rounded-full overflow-hidden bg-white/15">
                  <span className="hub-bar block h-full" style={{ width: `${s.total > 0 ? (s.passed / s.total) * 100 : 0}%`, background: sectionFill(s.status) }} />
                </div>
                <span className="text-xs font-semibold">
                  {s.passed} / {s.total} <span className="font-medium text-white/50">· {s.status === 'not-started' ? 'not started' : s.status}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="relative flex items-center gap-3 mt-5 pt-5 border-t border-white/12 flex-wrap">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-white/50">Milestones</span>
            {milestones.map(m =>
              m.passed ? (
                <span
                  key={m.id}
                  className="flex items-center gap-2 text-[12.5px] font-semibold text-white px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.4)' }}
                >
                  <Check className="w-3 h-3" style={{ color: '#E9C767' }} strokeWidth={3} aria-hidden />
                  {m.label}
                </span>
              ) : (
                <span
                  key={m.id}
                  className="flex items-center gap-2 text-[12.5px] font-medium text-white/55 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/15"
                >
                  <Lock className="w-3 h-3" aria-hidden />
                  {m.label}
                </span>
              ),
            )}
            <span className="flex-1" />
            <span className="text-[12.5px] text-white/60">Re-certifies annually</span>
          </div>
        </div>
      </section>
    </div>
  )
}
