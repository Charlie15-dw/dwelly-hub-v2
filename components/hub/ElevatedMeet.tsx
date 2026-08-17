import Link from 'next/link'
import { ArrowLeft, Check, Sparkles, MessageSquarePlus, ArrowRight, Users } from 'lucide-react'

// Elevated Monthly PM Meet — the handoff replaces a flat "Coming soon" with an
// agenda-collection lifecycle. We show the honest current stage: the first meet
// has not been booked, so we are *Collecting* topics. We deliberately do NOT
// fabricate a booked date, an agenda list, or a "you submitted" state — there
// is no store for any of that yet. Contributing a topic routes to the existing
// anonymous Q&A channel rather than pretending to write somewhere new.

type StageKey = 'collecting' | 'booked' | 'published' | 'decisions'

const STAGES: { key: StageKey; label: string; blurb: string }[] = [
  { key: 'collecting', label: 'Collecting agenda', blurb: 'Topics the team wants to cover' },
  { key: 'booked',     label: 'Session booked',    blurb: 'Date set, agenda locked' },
  { key: 'published',  label: 'Published',          blurb: 'Recording and notes shared' },
  { key: 'decisions',  label: 'Decisions',          blurb: 'Actions captured in one place' },
]

// Honest current position: we are gathering topics for a meet that hasn't run.
const CURRENT: StageKey = 'collecting'
const CURRENT_INDEX = STAGES.findIndex(s => s.key === CURRENT)

export default function ElevatedMeet() {
  return (
    <div className="max-w-[880px] space-y-6">
      <Link href="/hub/connect" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Connect
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
        <div className="relative px-7 py-9 sm:px-10 sm:py-10 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Users className="w-3.5 h-3.5 text-orange-200" aria-hidden />
            Monthly PM Meet
          </span>
          <h1 className="text-[34px] leading-[1.1] font-bold tracking-tight text-white">
            The whole team, once a month
          </h1>
          <p className="text-[15px] text-white/70 max-w-[440px]">
            A monthly forum for the property management team — share what&rsquo;s working, raise what isn&rsquo;t, and align on how we manage properties.
          </p>
        </div>
      </section>

      {/* Gold "first ever" card — this genuinely hasn't happened before */}
      <div className="hub-fade-1 relative overflow-hidden rounded-3xl px-7 py-6 text-[#3D2E00] shadow-panel" style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E9C767 100%)' }}>
        <div className="relative flex items-start gap-3">
          <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden />
          <div className="space-y-1">
            <p className="text-[15px] font-semibold">This has never happened before.</p>
            <p className="text-[14px] leading-relaxed text-[#3D2E00]/80 max-w-[520px]">
              The very first Monthly PM Meet is being shaped right now. What goes on the agenda is up to the team — add a topic and you help decide what the first session covers.
            </p>
          </div>
        </div>
      </div>

      {/* Lifecycle stepper — shows the honest current stage */}
      <div className="hub-fade-2 card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Where we are</h2>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full status-progress">Collecting agenda</span>
        </div>

        <ol className="space-y-4">
          {STAGES.map((s, i) => {
            const done = i < CURRENT_INDEX
            const current = i === CURRENT_INDEX
            return (
              <li key={s.key} className="flex items-start gap-3.5">
                <span className={
                  'flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 mt-0.5 ' +
                  (done ? 'bg-[#0071E3] text-white' : current ? 'bg-[#0071E3]/15 text-[#0071E3] ring-2 ring-[#0071E3]/30' : 'bg-[#E8E8ED] text-[var(--text-tertiary)]')
                }>
                  {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden /> : <span className="text-[11px] font-bold">{i + 1}</span>}
                </span>
                <div className="min-w-0">
                  <p className={'text-[15px] ' + (current ? 'font-semibold text-navy' : done ? 'font-medium text-navy' : 'font-medium text-[var(--text-tertiary)]')}>{s.label}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{s.blurb}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Contribute a topic — routes to the existing anonymous channel */}
      <Link href="/hub/ask" className="hub-fade-3 card card-hover p-5 flex items-center gap-4 group">
        <div className="w-11 h-11 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center flex-shrink-0">
          <MessageSquarePlus className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-navy">Add a topic for the first meet</p>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Goes in anonymously through Q&amp;A — no name attached.</p>
        </div>
        <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[#0071E3] transition-colors flex-shrink-0" aria-hidden />
      </Link>

      <p className="text-[13px] text-[var(--text-tertiary)]">
        Nothing booked yet. When the first Monthly PM Meet is scheduled, the date and agenda will appear here.
      </p>
    </div>
  )
}
