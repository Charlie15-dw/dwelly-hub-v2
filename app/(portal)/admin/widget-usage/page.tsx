import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import {
  aggregateWidgetUsage,
  WIDGET_RANGES,
  type WidgetEvent,
  type WidgetRange,
} from '@/lib/widget-usage'

// Admin "Widget usage" view — anonymous usage of the Dwelly Context Widget that
// runs inside the CRM. Widget users aren't logged into the Hub, so this reads the
// widget_events table (not activity_events) and counts by anonymous install id.
// Shows overall reach and the SOP-vs-Dobby split. Admin-only + preview-gated.

export const dynamic = 'force-dynamic'

const FETCH_LIMIT = 50000

function isWidgetRange(v: string | undefined): v is WidgetRange {
  return v === '7d' || v === '30d' || v === '6m'
}

export default async function AdminWidgetUsagePage({
  searchParams,
}: {
  searchParams: { range?: string }
}) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' || !isHubPreview(user.email)) redirect('/dashboard')

  const range: WidgetRange = isWidgetRange(searchParams.range) ? searchParams.range : '30d'

  const service = createServiceClient()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data: rows } = await service
    .from('widget_events')
    .select('client_id, event, tab, created_at')
    .gte('created_at', sixMonthsAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(FETCH_LIMIT)

  const events: WidgetEvent[] = (rows ?? []).map(r => ({
    clientId: r.client_id,
    event: r.event,
    tab: r.tab,
    createdAt: r.created_at,
  }))

  const stats = aggregateWidgetUsage(events, range)
  const maxDay = Math.max(1, ...stats.days.map(d => d.count))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-navy">Widget usage</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Anonymous use of the Context Widget inside the CRM — {stats.periodLabel}.
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {WIDGET_RANGES.map(r => (
            <Link
              key={r.value}
              href={`/admin/widget-usage?range=${r.value}`}
              className={
                'px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ' +
                (r.value === range ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy')
              }
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Summary numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active installs', value: stats.installs, hint: 'Distinct browsers using the widget' },
          { label: 'Active sessions', value: stats.engaged, hint: `Genuine use · ${stats.opens.toLocaleString()} raw open${stats.opens === 1 ? '' : 's'}` },
          { label: 'Ask Dobby questions', value: stats.dobbyAsks, hint: `${stats.dobbyInstalls} install${stats.dobbyInstalls === 1 ? '' : 's'}` },
          { label: 'SOP searches', value: stats.sopSearches, hint: `${stats.sopInstalls} install${stats.sopInstalls === 1 ? '' : 's'}` },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className="text-3xl font-bold text-navy">{s.value.toLocaleString()}</div>
            <div className="text-sm font-semibold text-slate-700 mt-1">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.hint}</div>
          </div>
        ))}
      </div>

      {/* Section split — the SOP vs Dobby picture */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-navy">Which sections people use</h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">Share of tab opens across the widget, {stats.periodLabel}.</p>
        {stats.tabs.length === 0 ? (
          <p className="text-sm text-slate-500">No tab activity yet in this period.</p>
        ) : (
          <div className="space-y-3">
            {stats.tabs.map(t => (
              <div key={t.tab}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700">{t.label}</span>
                  <span className="text-slate-500">
                    {t.opens.toLocaleString()} opens · {t.installs} install{t.installs === 1 ? '' : 's'} · {t.pct}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-navy" style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opens per day */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-navy">Active sessions over time</h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">Genuine use (open 10s+ or an interaction), {stats.periodLabel}.</p>
        <div className="flex items-end gap-1 h-32">
          {stats.days.map(d => (
            <div key={d.key} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.count}`}>
              <div
                className="w-full rounded-t bg-navy/80"
                style={{ height: `${Math.round((d.count / maxDay) * 100)}%` }}
              />
              <span className="text-[10px] text-slate-400 mt-1 whitespace-nowrap">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        No personal data is collected — installs are counted by an anonymous random id only.
      </p>
    </div>
  )
}
