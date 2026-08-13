'use client'

import { useState } from 'react'
import { Clock, ChevronDown } from 'lucide-react'
import { formatPath, timeAgo, type UsageEvent } from '@/lib/usage'
import { cn } from '@/lib/utils'

// Collapsible "Recent activity" feed. Shows a short list by default to keep the
// usage page compact, with a toggle to reveal the rest.

const COLLAPSED_COUNT = 6

export default function RecentActivityFeed({ events }: { events: UsageEvent[] }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? events : events.slice(0, COLLAPSED_COUNT)
  const hidden = events.length - COLLAPSED_COUNT

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <h2 className="text-sm font-bold text-navy">Recent activity</h2>
      </div>
      <ul className="divide-y divide-slate-50">
        {shown.map((e, i) => (
          <li key={i} className="px-5 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-navy truncate">{formatPath(e.path)}</p>
              <p className="text-xs text-slate-400 truncate">{e.name ?? e.email}</p>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3" aria-hidden /> {timeAgo(e.createdAt)}
            </span>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="w-full px-5 py-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-700 hover:bg-slate-50 transition-colors"
        >
          {expanded ? 'Show less' : `Show ${hidden} more`}
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-180')} aria-hidden />
        </button>
      )}
    </div>
  )
}
