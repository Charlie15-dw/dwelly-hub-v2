import Link from 'next/link'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// One guide, as a row inside a pillar group. Number chips (01–12 in reading
// order) give the landing page a single icon system — no emoji beside Lucide.
// A read row is quietened (tinted background, secondary title, a green check
// chip) but keeps its minutes at one steady contrast down the metadata column.
// The guide the reader is currently on gets a left accent and an "In progress"
// pill so their place is obvious at a glance.

export default function GuideRow({
  slug,
  number,
  title,
  summary,
  minutes,
  read,
  inProgress,
}: {
  slug: string
  number: number
  title: string
  summary: string
  minutes: number
  read: boolean
  inProgress: boolean
}) {
  return (
    <Link
      href={`/hub/crm-2/${slug}`}
      className={cn(
        'flex items-center gap-4 pr-5 py-4 border-b border-navy-100 last:border-b-0 border-l-[3px] transition-colors',
        read ? 'bg-[#FAFAFB]' : 'hover:bg-navy-50/60',
        inProgress ? 'border-l-orange bg-[#F0F7FF]/40' : 'border-l-transparent',
        'pl-[17px]',
      )}
    >
      {/* Number / read chip */}
      <span
        className={cn(
          'w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[13px] font-bold tabular-nums flex-shrink-0',
          read ? 'rag-green' : 'bg-navy-50 text-navy',
        )}
      >
        {read ? <Check className="w-4 h-4" strokeWidth={2.5} aria-hidden /> : String(number).padStart(2, '0')}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={cn('text-[17px] font-semibold truncate', read ? 'text-[var(--text-secondary)]' : 'text-navy')}>
            {title}
          </h4>
          {inProgress && (
            <span className="phase-onboarding text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0">
              In progress
            </span>
          )}
        </div>
        <p className="text-[14.5px] text-[var(--text-secondary)] leading-snug truncate mt-0.5">{summary}</p>
      </div>

      <span className="text-[13px] text-[var(--text-secondary)] tabular-nums flex-shrink-0 whitespace-nowrap">
        {minutes} min
      </span>
    </Link>
  )
}
