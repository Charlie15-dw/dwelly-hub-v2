'use client'

import { useMemo, useState } from 'react'
import { Activity, Eye, Users, Layers, TrendingUp, Download } from 'lucide-react'
import { aggregateUsage, timeAgo, USAGE_RANGES, type UsageEvent, type UsageRange } from '@/lib/usage'
import { cn } from '@/lib/utils'
import RecentActivityFeed from './RecentActivityFeed'

// Wrap a CSV cell: escape quotes and wrap in quotes so commas/newlines are safe.
function csvCell(value: string | number): string {
  const s = String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

// Shared, in-depth Hub usage view. Given a resolved list of page-view events it
// renders: headline stats, a "most viewed areas" ranking, an activity chart, a
// per-user table, and a recent-activity feed. A range selector (today / 7 days
// / 30 days / 6 months) re-filters everything client-side. Used by both the
// org-wide admin view and the team-scoped manager view.

interface Props {
  events: UsageEvent[]
  title: string
  subtitle: string
  /** Empty-state hint shown when there are no events. */
  emptyHint?: string
}

export default function UsageDashboard({ events, title, subtitle, emptyHint }: Props) {
  const [range, setRange] = useState<UsageRange>('7d')

  const { totalViews, activeUsers, avgViewsPerUser, distinctAreas, areas, days, periodLabel, users, recent } =
    useMemo(() => aggregateUsage(events, range), [events, range])

  const stats = [
    { label: 'Active people', value: activeUsers, icon: Users },
    { label: 'Total page views', value: totalViews, icon: Eye },
    { label: 'Avg views / person', value: avgViewsPerUser, icon: TrendingUp },
    { label: 'Areas visited', value: distinctAreas, icon: Layers },
  ]

  const maxDay = Math.max(1, ...days.map(d => d.count))
  const dense = days.length > 10

  const rangeLabel = USAGE_RANGES.find(r => r.value === range)?.label ?? periodLabel

  function downloadReport() {
    const lines: string[] = []
    lines.push(`${title} — usage report`)
    lines.push(`Range,${csvCell(rangeLabel)}`)
    lines.push(`Generated,${csvCell(new Date().toLocaleString('en-GB'))}`)
    lines.push('')
    lines.push('Summary')
    lines.push(`Active people,${activeUsers}`)
    lines.push(`Total page views,${totalViews}`)
    lines.push(`Avg views per person,${avgViewsPerUser}`)
    lines.push(`Areas visited,${distinctAreas}`)
    lines.push('')
    lines.push('Most viewed areas')
    lines.push('Area,Views,Share %')
    for (const a of areas) lines.push(`${csvCell(a.label)},${a.count},${a.pct}`)
    lines.push('')
    lines.push('Usage per person')
    lines.push('Name,Email,Views,Pages,Top area,First active,Last active')
    for (const u of users) {
      lines.push([
        csvCell(u.name ?? ''),
        csvCell(u.email),
        u.views,
        u.distinctPages,
        csvCell(u.topArea ?? ''),
        csvCell(new Date(u.firstActive).toLocaleString('en-GB')),
        csvCell(new Date(u.lastActive).toLocaleString('en-GB')),
      ].join(','))
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const stamp = new Date().toISOString().slice(0, 10)
    a.download = `${slug || 'usage'}-${range}-${stamp}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-teal-700 bg-teal-100 border-teal-200">
          <Activity className="w-5 h-5" aria-hidden />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-navy">{title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <label>
            <span className="sr-only">Time range</span>
            <select
              value={range}
              onChange={e => setRange(e.target.value as UsageRange)}
              className="text-sm font-medium text-navy bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              {USAGE_RANGES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={downloadReport}
            disabled={totalViews === 0}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download this report as a CSV"
          >
            <Download className="w-4 h-4" aria-hidden />
            Download
          </button>
        </div>
      </div>

      {totalViews === 0 ? (
        <div className="card p-10 text-center">
          <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" aria-hidden />
          <p className="text-sm font-semibold text-slate-500">No activity recorded yet</p>
          <p className="text-xs text-slate-400 mt-1">{emptyHint ?? 'Page views will appear here as people use the Hub.'}</p>
        </div>
      ) : (
        <>
          {/* Stat tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="card p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Icon className="w-4 h-4" aria-hidden />
                  <span className="text-xs font-medium">{label}</span>
                </div>
                <p className="text-2xl font-bold text-navy mt-1 tabular-nums">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most viewed areas */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal" aria-hidden />
                <h2 className="text-sm font-bold text-navy">Most viewed areas</h2>
              </div>
              <div className="p-5 space-y-3">
                {areas.slice(0, 10).map(area => (
                  <div key={area.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-navy">{area.label}</span>
                      <span className="text-slate-400 tabular-nums">
                        {area.count} <span className="text-slate-300">· {area.pct}%</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal"
                        style={{ width: `${areas[0].count ? Math.round((area.count / areas[0].count) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity — selected range */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" aria-hidden />
                <h2 className="text-sm font-bold text-navy">Activity — {periodLabel}</h2>
              </div>
              <div className="p-5">
                <div className={cn('flex items-end justify-between h-40', dense ? 'gap-0.5' : 'gap-2')}>
                  {days.map(day => (
                    <div
                      key={day.key}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                      title={day.label ? `${day.label}: ${day.count}` : `${day.count} views`}
                    >
                      {!dense && <span className="text-[11px] font-semibold text-slate-500 tabular-nums">{day.count}</span>}
                      <div
                        className={cn('w-full rounded-t-md min-h-[4px]', day.count > 0 ? 'bg-indigo-500' : 'bg-slate-100')}
                        style={{ height: `${Math.round((day.count / maxDay) * 100)}%` }}
                        aria-hidden
                      />
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">{day.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Per-user table — the full report for the selected range */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" aria-hidden />
              <h2 className="text-sm font-bold text-navy">Usage per person — {periodLabel}</h2>
              <span className="ml-auto text-xs text-slate-400">{users.length} active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="px-5 py-2.5 text-left font-semibold">User</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Views</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Pages</th>
                    <th className="px-5 py-2.5 text-left font-semibold">Top area</th>
                    <th className="px-5 py-2.5 text-right font-semibold">First active</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Last active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map(u => (
                    <tr key={u.userId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-navy">{u.name ?? u.email}</p>
                        {u.name && <p className="text-xs text-slate-400">{u.email}</p>}
                      </td>
                      <td className="px-5 py-3 text-right text-slate-600 tabular-nums">{u.views}</td>
                      <td className="px-5 py-3 text-right text-slate-600 tabular-nums">{u.distinctPages}</td>
                      <td className="px-5 py-3 text-left text-slate-600">{u.topArea ?? '—'}</td>
                      <td className="px-5 py-3 text-right text-slate-500">{timeAgo(u.firstActive)}</td>
                      <td className="px-5 py-3 text-right text-slate-500">{timeAgo(u.lastActive)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent activity feed */}
          <RecentActivityFeed events={recent} />
        </>
      )}
    </div>
  )
}
