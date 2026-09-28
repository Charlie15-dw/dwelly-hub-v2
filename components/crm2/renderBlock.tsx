import { ChevronDown } from 'lucide-react'
import { type Crm2Block } from '@/lib/crm2-content'
import { headingAnchor } from '@/lib/search-index'
import AnnotatedImage from '@/components/crm2/AnnotatedImage'
import ButtonAdvisor from '@/components/crm2/ButtonAdvisor'
import ScenarioDrills from '@/components/crm2/ScenarioDrills'
import GlossaryText, { type GlossaryEntry } from '@/components/crm2/GlossaryText'
import Callout, { type CalloutVariant } from '@/components/ui/Callout'
import { cn } from '@/lib/utils'

// Shared block renderer for the CRM 2.0 lesson pages. Both the Compliance track
// ([slug]) and the Maintenance track (maintenance/[slug]) render the same
// Crm2Block shapes, so the switch lives here as one source of truth. Pass an
// empty glossary to skip inline term tooltips.

// A two-column table whose second column is long prose reads far better as
// stacked definition rows than as cramped cells. Decide per block on cell
// length — matches the Training Guide's treatment so the two feel like one app.
export function isProseTable(block: Crm2Block): boolean {
  return (
    block.headers?.length === 2 &&
    !!block.rows?.some((r) => (r[1]?.length ?? 0) > 120)
  )
}

export function renderBlock(block: Crm2Block, i: number, glossary: GlossaryEntry[], ledeIndex: number) {
  const withGlossary = (text: string) =>
    glossary.length > 0 ? <GlossaryText text={text} glossary={glossary} /> : text

  switch (block.type) {

    case 'heading':
      // A slim accent bar turns a long guide into clearly scannable sections.
      return (
        <h2
          key={i}
          id={headingAnchor(block.text ?? '')}
          className="scroll-mt-24 flex items-center gap-3 text-[25px] font-bold tracking-tight text-navy leading-[1.2] mt-14 mb-4"
        >
          <span className="h-[26px] w-[3.5px] rounded-full bg-orange flex-shrink-0" aria-hidden />
          {block.text}
        </h2>
      )

    case 'subheading':
      return (
        <h3 key={i} className="text-[19px] font-semibold text-navy leading-[1.3] mt-8 mb-3">
          {block.text}
        </h3>
      )

    case 'paragraph':
      // The first paragraph reads as a lede — a touch larger and lighter.
      if (i === ledeIndex) {
        return (
          <p key={i} className="text-[19.5px] leading-[1.6] text-navy-700 max-w-[68ch] mt-5">
            {block.text ? withGlossary(block.text) : null}
          </p>
        )
      }
      return (
        <p key={i} className="text-[17px] leading-[1.75] text-navy-800 max-w-[68ch] mt-5">
          {block.text ? withGlossary(block.text) : null}
        </p>
      )

    case 'bullets':
      return (
        <ul key={i} className="mt-5 flex flex-col gap-3">
          {block.items?.map((item, j) => (
            <li key={j} className="flex gap-3.5 items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-navy mt-[11px]" />
              <p className="text-[17px] leading-[1.7] text-navy-800 max-w-[64ch]">{withGlossary(item)}</p>
            </li>
          ))}
        </ul>
      )

    case 'steps':
      return (
        <ol key={i} className="mt-5 flex flex-col gap-4">
          {block.items?.map((item, j) => {
            const emphasised = block.emphasisIndex === j
            return (
              <li
                key={j}
                className={cn(
                  'flex gap-4 items-start',
                  emphasised && 'rounded-xl bg-[#F0F7FF]/60 border border-[#CCE4FF] -mx-3.5 px-3.5 py-3',
                )}
              >
                <span
                  className={cn(
                    'flex-shrink-0 w-7 h-7 rounded-full text-white text-[14px] font-semibold flex items-center justify-center mt-0.5',
                    emphasised ? 'bg-orange' : 'bg-navy',
                  )}
                >
                  {j + 1}
                </span>
                <p className={cn('text-[17px] leading-[1.7] max-w-[64ch] flex-1', emphasised ? 'text-navy font-medium' : 'text-navy-800')}>
                  {withGlossary(item)}
                </p>
              </li>
            )
          })}
        </ol>
      )

    case 'callout':
      return (
        <Callout key={i} variant={(block.variant ?? 'info') as CalloutVariant} className="mt-6">
          {block.text ? withGlossary(block.text) : null}
        </Callout>
      )

    case 'table': {
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
    }

    case 'faq':
      // A themed group of questions as native disclosure rows — scannable at a
      // glance, one open at a time by the reader, no client JS required.
      if (!block.faqs || block.faqs.length === 0) return null
      return (
        <div key={i} className="mt-5 flex flex-col gap-2.5">
          {block.faqs.map((f, j) => (
            <details
              key={j}
              className="group rounded-2xl border border-navy-100 bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer list-none flex items-start gap-3 px-5 py-4 hover:bg-navy-50/40 transition-colors">
                <span className="flex-1 text-[16.5px] font-semibold text-navy leading-snug">{f.q}</span>
                <ChevronDown
                  className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 mt-1 transition-transform duration-200 group-[[open]]:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="px-5 pb-4 -mt-0.5">
                <p className="text-[16px] leading-[1.7] text-navy-800 max-w-[68ch]">{withGlossary(f.a)}</p>
              </div>
            </details>
          ))}
        </div>
      )

    case 'divider':
      return <hr key={i} className="mt-8 border-navy-100" />

    case 'image':
      if (!block.src) return null
      if (block.hotspots && block.hotspots.length > 0) {
        return <AnnotatedImage key={i} src={block.src} caption={block.text} hotspots={block.hotspots} />
      }
      return (
        <figure key={i} className="mt-6">
          <div className="rounded-2xl border border-navy-100 overflow-hidden bg-navy-50">
            {/* Static screenshot from the playbook; next/image is unnecessary here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt={block.text ?? ''} className="w-full h-auto block" loading="lazy" />
          </div>
          {block.text && (
            <figcaption className="text-[13px] text-[var(--text-secondary)] mt-2 text-center leading-relaxed">{block.text}</figcaption>
          )}
        </figure>
      )

    case 'widget':
      if (block.widget === 'button-advisor') return <ButtonAdvisor key={i} />
      if (block.widget === 'scenario-drills') return <ScenarioDrills key={i} />
      return null

    default:
      return null
  }
}
