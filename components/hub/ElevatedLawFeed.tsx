import Link from 'next/link'
import { ArrowLeft, Scale, CircleCheck, Clock, Lightbulb, BookOpen } from 'lucide-react'
import { lawFeedSorted, LAW_STATUS_LABELS, type LawStatus } from '@/lib/law-feed'
import { getKnowledgeArticle } from '@/lib/training-content'
import Callout from '@/components/ui/Callout'

// Elevated Law & legislation feed — matches the CRM 2.0 style: navy hero,
// accent-bar item headings, status chips on RAG/phase tokens, and the shared
// Callout for the disclaimer. Gated to the review accounts.

const STATUS_STYLES: Record<LawStatus, string> = {
  'in-force': 'rag-green',
  'upcoming': 'rag-amber',
  'proposed': 'bg-navy-50 text-[var(--text-secondary)] border border-navy-100',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ElevatedLawFeed() {
  const items = lawFeedSorted()
  const inForce = items.filter(i => i.status === 'in-force').length
  const upcoming = items.filter(i => i.status === 'upcoming').length

  return (
    <div className="space-y-6 max-w-[880px]">
      <Link href="/hub" className="hub-fade inline-flex items-center gap-1.5 text-[14px] text-[var(--text-secondary)] hover:text-navy transition-colors">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      {/* Hero */}
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
            <Scale className="w-3.5 h-3.5 text-orange-200" aria-hidden />
            Law &amp; legislation
          </span>
          <h1 className="mt-4 text-[34px] leading-[1.1] font-bold tracking-tight text-white">
            The changes that matter
          </h1>
          <p className="mt-3 max-w-[54ch] text-[15px] text-white/70 leading-relaxed">
            UK lettings law in plain English — each change paired with what it means for your day-to-day.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <span className="font-bold text-white tabular-nums">{items.length} tracked</span>
            <span className="hidden sm:block w-px h-4 bg-white/15" aria-hidden />
            <span className="text-white/70">{inForce} in force</span>
            <span className="hidden sm:block w-px h-4 bg-white/15" aria-hidden />
            <span className="text-white/70">{upcoming} upcoming</span>
          </div>
        </div>
      </section>

      <div className="hub-fade-1">
        <Callout variant="info">
          These are training summaries to help you stay current — not legal advice. Always check the official
          guidance and raise anything unclear with your manager.
        </Callout>
      </div>

      <div className="hub-fade-2 space-y-4">
        {items.map(item => (
          <article key={item.id} className="card p-6 sm:p-7 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${STATUS_STYLES[item.status]}`}>
                  {LAW_STATUS_LABELS[item.status]}
                </span>
                <span className="text-[11px] font-semibold text-[var(--text-secondary)] px-2.5 py-0.5 rounded-full bg-navy-50 border border-navy-100">
                  {item.category}
                </span>
                <span className="text-[12px] text-[var(--text-tertiary)]">{formatDate(item.date)}</span>
              </div>
              <h2 className="flex items-start gap-3 text-[20px] font-bold tracking-tight text-navy leading-[1.25]">
                <span className="mt-[5px] h-[20px] w-[3.5px] rounded-full bg-orange flex-shrink-0" aria-hidden />
                {item.title}
              </h2>
              <p className="text-[15.5px] leading-[1.6] text-navy-800">{item.summary}</p>
              {item.effectiveFrom && (
                <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)]">
                  <Clock className="w-3.5 h-3.5" aria-hidden /> Effective: {item.effectiveFrom}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text-tertiary)] mb-2.5">
                  <CircleCheck className="w-3.5 h-3.5" aria-hidden /> What changed
                </p>
                <ul className="space-y-2">
                  {item.whatChanged.map((point, i) => (
                    <li key={i} className="text-[14px] leading-[1.6] text-navy-800 flex gap-2.5">
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-navy flex-shrink-0" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl phase-onboarding p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide mb-2.5">
                  <Lightbulb className="w-3.5 h-3.5" aria-hidden /> What this means for you
                </p>
                <ul className="space-y-2">
                  {item.whatThisMeans.map((point, i) => (
                    <li key={i} className="text-[14px] leading-[1.6] flex gap-2.5">
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {item.related && item.related.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-navy-100">
                <span className="text-[12px] font-semibold text-[var(--text-tertiary)] inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" aria-hidden /> Learn more:
                </span>
                {item.related.map(id => {
                  const article = getKnowledgeArticle(id)
                  if (!article) return null
                  return (
                    <Link
                      key={id}
                      href={`/knowledge/${id}`}
                      className="text-[12.5px] font-semibold text-[#0071E3] hover:underline"
                    >
                      {article.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
