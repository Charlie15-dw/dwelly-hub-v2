import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { NeedsYouItem, NeedsStage } from '@/lib/hub-progress'

// "Today first" — the card that answers "what needs me today" before anything
// else. Capped at five rows; the single most urgent item gets the one primary
// button, the rest are outline. The empty state is deliberately a visible card
// ("Nothing needs you today.") because most PMs will hit it most days — its
// absence would read as a bug. Rows are whole-row links; the trailing button is
// decoration inside the link, not a nested interactive element.

const CAP = 5

const DOT: Record<NeedsStage, string> = {
  overdue: 'bg-[#CC0000]',
  due: 'bg-[#995500]',
  resolved: 'bg-[#1A7F37]',
}

export default function NeedsYou({ items }: { items: NeedsYouItem[] }) {
  const shown = items.slice(0, CAP)
  const extra = items.length - shown.length

  return (
    <section id="needs-you" className="card overflow-hidden scroll-mt-6">
      <div className="px-6 py-[18px] flex items-center justify-between">
        <h3 className="text-[17px] font-semibold text-navy">Needs you</h3>
        <span className="text-sm text-slate-400">Clears as you go</span>
      </div>

      {shown.length === 0 ? (
        <div className="border-t border-slate-100 py-8 text-center">
          <p className="text-sm text-slate-500">Nothing needs you today.</p>
        </div>
      ) : (
        <>
          {shown.map((item, i) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center gap-[18px] px-6 py-[18px] border-t border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT[item.stage]}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[15.5px] font-semibold text-navy truncate">{item.title}</p>
                <p className="text-[13px] text-slate-500 mt-0.5 truncate">{item.meta}</p>
              </div>
              <span className={(i === 0 ? 'btn-primary' : 'btn-outline') + ' text-[13px] flex-shrink-0'}>
                {item.cta}
                <ChevronRight className="w-3.5 h-3.5" aria-hidden />
              </span>
            </Link>
          ))}
          {extra > 0 && (
            <Link
              href="/recap"
              className="block border-t border-slate-100 px-6 py-[14px] text-[13px] font-semibold text-orange hover:bg-slate-50 transition-colors"
            >
              See all {items.length}
            </Link>
          )}
        </>
      )}
    </section>
  )
}
