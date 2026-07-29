import { Activity, Clock, Eye, Users, Layers, TrendingUp } from 'lucide-react'
import { aggregateUsage, formatPath, timeAgo, type UsageEvent } from '@/lib/usage'
import { cn } from '@/lib/utils'

// Shared, in-depth Hub usage view. Given a resolved list of page-view events it
// renders: headline stats, a "most viewed areas" ranking, a 7-day activity
// chart, a per-user table, and a recent-activity feed. Used by both the
// org-wide admin view and the team-scoped manager view.

interface Props {
  events: UsageEvent[]
  title: string
  subtitle: string
  /** Empty-state hint shown when there are no events. */
  emptyHint?: string
}

export default function UsageDashboard({ events, title, subtitle, emptyHint }: Props) {
  const { totalViews, activeUsers, avgViewsPerUser, distinctAreas, areas, days, users, recent } =
    aggregateUsage(events)

  const stats = [
    { label: 'Active people', value: activeUsers, icon: Users },
    { label: 'Total page views', value: totalViews, icon: Eye },
    { label: 'Avg views / person', value: avgViewsPerUser, icon: TrendingUp },
    { label: 'Areas visited', value: distinctAreas, icon: Layers },
  ]

  const maxDay = Math.max(1, ...days.map(d => d.count))

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-teal-700 bg-teal-100 border-teal-200">
          <Activity className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">{title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
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

            {/* Activity — last 7 days */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" aria-hidden />
                <h2 className="text-sm font-bold text-navy">Activity — last 7 days</h2>
              </div>
              <div className="p-5">
                <div className="flex items-end justify-between gap-2 h-40">
                  {days.map(day => (
                    <div key={day.key} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[11px] font-semibold text-slate-500 tabular-nums">{day.count}</span>
                      <div
                        className={cn('w-full rounded-t-md min-h-[4px]', day.count > 0 ? 'bg-indigo-500' : 'bg-slate-100')}
                        style={{ height: `${Math.round((day.count / maxDay) * 100)}%` }}
                        aria-hidden
                      />
                      <span className="text-[11px] text-slate-400">{day.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Per-user table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" aria-hidden />
              <h2 className="text-sm font-bold text-navy">People</h2>
              <span className="ml-auto text-xs text-slate-400">{users.length} active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="px-5 py-2.5 text-left font-semibold">User</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Views</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Pages</th>
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
                      <td className="px-5 py-3 text-right text-slate-500">{timeAgo(u.lastActive)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent activity feed */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-navy">Recent activity</h2>
            </div>
            <ul className="divide-y divide-slate-50">
              {recent.map((e, i) => (
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
          </div>
        </>
      )}
    </div>
  )
}
