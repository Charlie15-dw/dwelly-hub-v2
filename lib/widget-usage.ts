// Aggregation for the admin "Widget usage" view. The Dwelly Context Widget sends
// anonymous events (see /api/widget/event); this turns a flat list of them into
// the handful of numbers the page shows — overall reach, the SOP-vs-Dobby split,
// and a simple day-by-day activity bar. No personal data is involved: installs
// are counted by their random client_id only.

export interface WidgetEvent {
  clientId: string
  event: string            // 'open' | 'tab' | 'dobby_ask' | 'sop_search'
  tab: string | null       // 'sop' | 'dobby' | 'dash' | 'll' | 'prop'
  createdAt: string
}

export type WidgetRange = '7d' | '30d' | '6m'

export const WIDGET_RANGES: { value: WidgetRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '6m', label: 'Last 6 months' },
]

const RANGE_PERIOD_LABEL: Record<WidgetRange, string> = {
  '7d': 'last 7 days',
  '30d': 'last 30 days',
  '6m': 'last 6 months',
}

// Friendly names for the widget's tabs, used in the section breakdown.
const TAB_LABELS: Record<string, string> = {
  sop: 'SOP',
  dobby: 'Ask Dobby',
  dash: 'Dashboards',
  ll: 'Landlord',
  prop: 'Property',
}

export function tabLabel(tab: string): string {
  return TAB_LABELS[tab] ?? tab
}

function rangeStart(range: WidgetRange, now: Date): Date {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  switch (range) {
    case '7d': d.setDate(d.getDate() - 6); return d
    case '30d': d.setDate(d.getDate() - 29); return d
    case '6m': d.setMonth(d.getMonth() - 6); return d
  }
}

export interface TabStat {
  tab: string
  label: string
  /** Tab-open events in the window. */
  opens: number
  /** Distinct installs that opened this tab — the tab's reach. */
  installs: number
  /** Share of all tab-opens, 0–100. */
  pct: number
}

export interface WidgetDayBucket {
  key: string
  label: string
  count: number
}

export interface WidgetUsageAggregate {
  periodLabel: string
  /** Distinct installs active at all in the window. */
  installs: number
  /** 'open' events — how often the widget was shown on a job. */
  opens: number
  /** Questions sent to Ask Dobby. */
  dobbyAsks: number
  /** Distinct installs that asked Dobby at least once. */
  dobbyInstalls: number
  /** SOP searches run. */
  sopSearches: number
  /** Distinct installs that searched the SOPs at least once. */
  sopInstalls: number
  /** Per-tab usage, ranked — the SOP-vs-Dobby picture. */
  tabs: TabStat[]
  /** Opens per day (or per month for the 6-month range). */
  days: WidgetDayBucket[]
}

function buildBuckets(opens: WidgetEvent[], range: WidgetRange, now: Date): WidgetDayBucket[] {
  const buckets: WidgetDayBucket[] = []
  const byKey = new Map<string, WidgetDayBucket>()
  const add = (key: string, label: string) => {
    const b: WidgetDayBucket = { key, label, count: 0 }
    buckets.push(b)
    byKey.set(key, b)
  }

  if (range === '6m') {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      add(`${d.getFullYear()}-${d.getMonth()}`, d.toLocaleDateString('en-GB', { month: 'short' }))
    }
    for (const e of opens) {
      const d = new Date(e.createdAt)
      const b = byKey.get(`${d.getFullYear()}-${d.getMonth()}`)
      if (b) b.count += 1
    }
  } else {
    const n = range === '30d' ? 30 : 7
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const label = n === 7
        ? d.toLocaleDateString('en-GB', { weekday: 'short' })
        : (i % 7 === 0 ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '')
      add(d.toDateString(), label)
    }
    for (const e of opens) {
      const b = byKey.get(new Date(e.createdAt).toDateString())
      if (b) b.count += 1
    }
  }
  return buckets
}

export function aggregateWidgetUsage(events: WidgetEvent[], range: WidgetRange = '30d'): WidgetUsageAggregate {
  const now = new Date()
  const start = rangeStart(range, now).getTime()
  const inWindow = events.filter(e => new Date(e.createdAt).getTime() >= start)

  const installs = new Set(inWindow.map(e => e.clientId)).size
  const opens = inWindow.filter(e => e.event === 'open').length
  const dobbyAskEvents = inWindow.filter(e => e.event === 'dobby_ask')
  const sopSearchEvents = inWindow.filter(e => e.event === 'sop_search')

  // Per-tab opens and reach.
  const tabOpens = new Map<string, number>()
  const tabInstalls = new Map<string, Set<string>>()
  let totalTabOpens = 0
  for (const e of inWindow) {
    if (e.event !== 'tab' || !e.tab) continue
    totalTabOpens += 1
    tabOpens.set(e.tab, (tabOpens.get(e.tab) ?? 0) + 1)
    if (!tabInstalls.has(e.tab)) tabInstalls.set(e.tab, new Set())
    tabInstalls.get(e.tab)!.add(e.clientId)
  }
  const tabs: TabStat[] = Array.from(tabOpens.entries())
    .map(([tab, count]) => ({
      tab,
      label: tabLabel(tab),
      opens: count,
      installs: tabInstalls.get(tab)?.size ?? 0,
      pct: totalTabOpens ? Math.round((count / totalTabOpens) * 100) : 0,
    }))
    .sort((a, b) => b.opens - a.opens)

  return {
    periodLabel: RANGE_PERIOD_LABEL[range],
    installs,
    opens,
    dobbyAsks: dobbyAskEvents.length,
    dobbyInstalls: new Set(dobbyAskEvents.map(e => e.clientId)).size,
    sopSearches: sopSearchEvents.length,
    sopInstalls: new Set(sopSearchEvents.map(e => e.clientId)).size,
    tabs,
    days: buildBuckets(inWindow.filter(e => e.event === 'open'), range, now),
  }
}
