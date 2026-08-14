import Link from 'next/link'
import {
  ArrowLeft, Clock, ExternalLink, ChevronRight, ChevronLeft,
  BookOpen, AlertTriangle, Info, Lightbulb,
} from 'lucide-react'
import {
  getTrainingPage, getAdjacentPages, TRAINING_PAGES, COMPLIANCE_IDS,
  type ContentBlock,
} from '@/lib/training-content'
import { headingAnchor } from '@/lib/search-index'
import GuideContents from '@/components/training/GuideContents'
import MarkGuideRead from '@/components/training/MarkGuideRead'
import { cn } from '@/lib/utils'

// Redesigned Training Guide page — readability pass (17px body, contents
// sidebar, per-section read state). Gated to the two review accounts; the
// route renders the original for everyone else.

const ALL_GUIDE_IDS = TRAINING_PAGES.map(p => p.id)

// A two-column table whose second column is long prose isn't really tabular —
// it reads far better as stacked definition rows. Decide per block on cell
// length, not per page.
function isProseTable(block: ContentBlock): boolean {
  return (
    block.headers?.length === 2 &&
    !!block.rows?.some(r => (r[1]?.length ?? 0) > 120)
  )
}

export default function ElevatedTrainingGuide({ id }: { id: string }) {
  const page = getTrainingPage(id)
  if (!page) return null

  const { prev, next } = getAdjacentPages(id)
  const isCompliance = COMPLIANCE_IDS.includes(page.id)
  const hasContent = page.content.length > 0

  const sorted = [...TRAINING_PAGES].sort((a, b) => a.order - b.order)
  const guideNumber = sorted.findIndex(p => p.id === page.id) + 1
  const total = sorted.length

  const headings = page.content
    .filter(b => b.type === 'heading' && b.text)
    .map(b => ({ text: b.text as string, anchor: headingAnchor(b.text as string) }))

  return (
    <div className="max-w-[1000px] space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[14px]">
        <Link href="/training" className="text-[var(--text-secondary)] hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden /> Training Guide
        </Link>
        <span className="text-navy-200">/</span>
        <span className="text-navy font-medium">{page.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_244px] gap-9 items-start">

        {/* ── Main column ─────────────────────────────────────────────── */}
        <div className="min-w-0 space-y-6">

          {/* Header card */}
          <div className="card p-8">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Guide {String(guideNumber).padStart(2, '0')} of {total}
              </span>
              {isCompliance && (
                <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full rag-red">
                  Compliance required
                </span>
              )}
            </div>
            <h1 className="text-[34px] font-semibold tracking-tight text-navy leading-[1.15] mt-3">
              {page.title}
            </h1>
            <p className="text-[18px] leading-[1.6] text-[var(--text-secondary)] max-w-[60ch] mt-2">
              {page.subtitle}
            </p>
            <div className="flex items-center gap-6 flex-wrap border-t border-navy-100 mt-5 pt-4">
              <span className="flex items-center gap-2 text-[14.5px] text-[var(--text-secondary)]">
                <Clock className="w-4 h-4" aria-hidden /> {page.readTime}
              </span>
              {page.notionUrl && (
                <a
                  href={page.notionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[14.5px] font-medium text-orange hover:underline"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden />
                  Open in Notion
                </a>
              )}
            </div>
          </div>

          {/* Content card */}
          {hasContent ? (
            <article className="card p-9 [&>*:first-child]:mt-0">
              {page.content.map((block, i) => {
                switch (block.type) {

                  case 'heading':
                    return (
                      <h2
                        key={i}
                        id={block.text ? headingAnchor(block.text) : undefined}
                        className="scroll-mt-8 text-[24px] font-semibold tracking-tight text-navy leading-[1.25] mt-10 mb-3.5"
                      >
                        {block.text}
                      </h2>
                    )

                  case 'subheading':
                    return (
                      <h3 key={i} className="text-[19px] font-semibold text-navy leading-[1.3] mt-7 mb-3">
                        {block.text}
                      </h3>
                    )

                  case 'paragraph':
                    return (
                      <p key={i} className="text-[17px] leading-[1.7] text-navy-800 max-w-[68ch] mt-4">
                        {block.text}
                      </p>
                    )

                  case 'steps':
                    return (
                      <ol key={i} className="mt-5 flex flex-col gap-4">
                        {block.items?.map((item, j) => (
                          <li key={j} className="flex gap-4 items-start">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-navy text-white text-[14px] font-semibold flex items-center justify-center mt-0.5">
                              {j + 1}
                            </span>
                            <p className="text-[17px] leading-[1.7] text-navy-800 max-w-[64ch] flex-1">{item}</p>
                          </li>
                        ))}
                      </ol>
                    )

                  case 'bullets':
                    return (
                      <ul key={i} className="mt-5 flex flex-col gap-3">
                        {block.items?.map((item, j) => (
                          <li key={j} className="flex gap-3.5 items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-navy mt-[11px]" />
                            <p className="text-[17px] leading-[1.7] text-navy-800 max-w-[64ch]">{item}</p>
                          </li>
                        ))}
                      </ul>
                    )

                  case 'callout':
                  case 'warning': {
                    // Three variants only, all on real RAG / phase tokens. The
                    // old red "important" panel folds into amber "warning"; the
                    // standalone `warning` block renders the same amber callout.
                    const variant =
                      block.type === 'warning' ? 'warning'
                      : block.variant === 'important' ? 'warning'
                      : block.variant ?? 'info'
                    const styles = {
                      info:    { klass: 'phase-onboarding', Icon: Info },
                      tip:     { klass: 'rag-green',        Icon: Lightbulb },
                      warning: { klass: 'rag-amber',        Icon: AlertTriangle },
                    }[variant as 'info' | 'tip' | 'warning'] ?? { klass: 'phase-onboarding', Icon: Info }
                    const { klass, Icon } = styles
                    return (
                      <div key={i} className={cn('mt-6 rounded-2xl p-5 flex gap-3.5 items-start', klass)}>
                        <Icon className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" aria-hidden />
                        <p className="text-[16.5px] leading-[1.65] max-w-[64ch]">{block.text}</p>
                      </div>
                    )
                  }

                  case 'table':
                    if (!block.headers || !block.rows) return null
                    // Long-prose two-column tables → stacked definition rows.
                    if (isProseTable(block)) {
                      return (
                        <div key={i} className="mt-6 rounded-2xl border border-navy-100 overflow-hidden">
                          <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-6 bg-navy-50 border-b border-navy-100 px-5 py-3">
                            {block.headers.map((h, j) => (
                              <span key={j} className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{h}</span>
                            ))}
                          </div>
                          {block.rows.map((row, j) => (
                            <div
                              key={j}
                              className={cn(
                                'grid grid-cols-[200px_minmax(0,1fr)] gap-6 px-5 py-4',
                                j > 0 && 'border-t border-navy-100',
                              )}
                            >
                              <span className="text-[16px] font-semibold text-navy">{row[0]}</span>
                              <p className="text-[16px] leading-[1.65] text-navy-800">{row[1]}</p>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    // Genuinely tabular data keeps a real table, at 16px.
                    return (
                      <div key={i} className="mt-6 overflow-x-auto rounded-2xl border border-navy-100">
                        <table className="w-full text-[16px]">
                          <thead>
                            <tr className="bg-navy-50 border-b border-navy-100">
                              {block.headers.map((h, j) => (
                                <th key={j} className="px-5 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-navy-100">
                            {block.rows.map((row, j) => (
                              <tr key={j}>
                                {row.map((cell, k) => (
                                  <td key={k} className="px-5 py-4 text-navy-800 leading-[1.6] align-top">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )

                  case 'divider':
                    return <hr key={i} className="mt-8 border-navy-100" />

                  default:
                    return null
                }
              })}
            </article>
          ) : (
            /* Placeholder — shown until Notion content is loaded */
            <div className="card p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-[var(--text-tertiary)]" aria-hidden />
              </div>
              <h2 className="text-[17px] font-semibold text-navy mb-2">Content loading soon</h2>
              <p className="text-[14.5px] text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto mb-6">
                The full written guide for this section is being imported from Notion.
                In the meantime, you can read it directly on the Notion page.
              </p>
              {page.notionUrl && (
                <a href={page.notionUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                  Read on Notion
                  <ExternalLink className="w-4 h-4" aria-hidden />
                </a>
              )}
            </div>
          )}

          {/* End of guide — mark as read */}
          {hasContent && (
            <MarkGuideRead guideId={page.id} allGuideIds={ALL_GUIDE_IDS} guideTitle={page.title} />
          )}

          {/* Prev / next */}
          <div className="grid grid-cols-2 gap-3">
            {prev ? (
              <Link href={`/training/${prev.id}`} className="card card-hover p-4 flex items-center gap-3 group">
                <ChevronLeft className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 group-hover:text-orange transition-colors" aria-hidden />
                <div className="min-w-0">
                  <p className="text-[13px] text-[var(--text-secondary)]">Previous</p>
                  <p className="text-[16px] font-semibold text-navy truncate mt-0.5">{prev.title}</p>
                </div>
              </Link>
            ) : <div />}

            {next ? (
              <Link href={`/training/${next.id}`} className="card card-hover p-4 flex items-center justify-end gap-3 text-right group">
                <div className="min-w-0">
                  <p className="text-[13px] text-[var(--text-secondary)]">Next</p>
                  <p className="text-[16px] font-semibold text-navy truncate mt-0.5">{next.title}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 group-hover:text-orange transition-colors" aria-hidden />
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-4 sticky top-0">
          {headings.length > 0 && <GuideContents headings={headings} />}

          {next && (
            <Link href={`/training/${next.id}`} className="card card-hover p-5 flex flex-col gap-1.5 group">
              <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Up next</span>
              <span className="text-[14.5px] font-semibold text-navy group-hover:text-orange transition-colors">{next.title}</span>
              <span className="text-[13px] text-[var(--text-secondary)]">{next.readTime}</span>
            </Link>
          )}
        </aside>
      </div>
    </div>
  )
}
