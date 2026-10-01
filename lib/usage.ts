// Shared helpers for the Hub "Usage" analytics views (admin org-wide + manager
// team-scoped). Both pages read `activity_events` (user_id, path, created_at)
// and render the same UsageDashboard, so the labelling and time formatting live
// here as a single source of truth.

/** Top-level path segment → friendly area name. */
const AREA_LABELS: Record<string, string> = {
  hub: 'Hub',
  dobby: 'Ask Dobby',
  dashboard: 'Dashboard',
  training: 'Training Guide',
  knowledge: 'Knowledge Base',
  modules: 'Video Modules',
  quiz: 'Assessment',
  assessments: 'Assessments',
  passport: 'Competency Passport',
  glossary: 'Glossary',
  emergency: 'Emergency Procedures',
  recap: 'Recap & Refresh',
  analytics: 'My Analytics',
  'pre-training': 'Learning Profile',
  admin: 'Admin',
  manager: 'Manager',
}

// The CRM 2.0 learning space lives under /hub/crm-2, so by the top-segment rule
// it would fold into "Hub". Treat it as its own area so it can be tracked on its
// own in the usage views.
function isCrm2Path(path: string): boolean {
  return path === '/hub/crm-2' || path.startsWith('/hub/crm-2/')
}

/** Broad area a path belongs to — used for the "most viewed areas" ranking. */
export function areaLabel(path: string): string {
  if (path === '/' || path === '') return 'Home'
  if (isCrm2Path(path)) return 'CRM 2.0'
  const top = path.split('/').filter(Boolean)[0]
  return AREA_LABELS[top] ?? top.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/** Full, human-readable label for a specific path (area + sub-path). */
export function formatPath(path: string): string {
  if (path === '/' || path === '') return 'Home'
  const seg = path.split('/').filter(Boolean)
  const label = areaLabel(path)
  // CRM 2.0 sits two levels deep (/hub/crm-2/…); drop both prefix segments so
  // the sub-path reads cleanly, e.g. "CRM 2.0 · how-it-works".
  const rest = (isCrm2Path(path) ? seg.slice(2) : seg.slice(1)).join(' / ')
  return rest ? `${label} · ${rest}` : label
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** A page-view event with the viewer's identity already resolved. */
export interface UsageEvent {
  userId: string
  path: string
  createdAt: string
  name: string | null
  email: string
}

// Charlie's own accounts — excluded from all usage stats since they're used for
// testing and content changes, so they'd otherwise skew the numbers.
const EXCLUDED_USAGE_EMAILS = new Set([
  'charlie@dwelly.group',
  'charlie@pennington-online.co.uk',
])

/** True if this viewer should be left out of usage analytics. */
export function isExcludedFromUsage(email: string | null | undefined): boolean {
  return email ? EXCLUDED_USAGE_EMAILS.has(email.trim().toLowerCase()) : false
}

export interface AreaStat {
  label: string
  count: number
  /** Share of total views, 0–100. */
  pct: number
}

export interface UserUsageStat {
  userId: string
  name: string | null
  email: string
  views: number
  distinctPages: number
  /** The area this user viewed most in the period, e.g. "CRM 2.0". */
  topArea: string | null
  /** First recorded view within the selected window. */
  firstActive: string
  lastActive: string
}

export interface DayBucket {
  key: string
  label: string
  count: number
}

// The time windows offered by the usage dashboard's range selector.
export type UsageRange = 'today' | '7d' | '30d' | '6m'

export const USAGE_RANGES: { value: UsageRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '6m', label: 'Last 6 months' },
]

const RANGE_PERIOD_LABEL: Record<UsageRange, string> = {
  today: 'today',
  '7d': 'last 7 days',
  '30d': 'last 30 days',
  '6m': 'last 6 months',
}

/** Start of the window for a range (inclusive), relative to `now`. */
function rangeStart(range: UsageRange, now: Date): Date {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  switch (range) {
    case 'today': return d
    case '7d': d.setDate(d.getDate() - 6); return d
    case '30d': d.setDate(d.getDate() - 29); return d
    case '6m': d.setMonth(d.getMonth() - 6); return d
  }
}

/**
 * Build the activity-chart buckets for a range. Granularity adapts to the
 * window: hourly for today, daily for 7/30 days, monthly for 6 months. Labels
 * are left blank on dense charts so the axis stays readable.
 */
function buildBuckets(events: UsageEvent[], range: UsageRange, now: Date): DayBucket[] {
  const buckets: DayBucket[] = []
  const byKey = new Map<string, DayBucket>()
  const add = (key: string, label: string) => {
    const b: DayBucket = { key, label, count: 0 }
    buckets.push(b)
    byKey.set(key, b)
  }

  if (range === 'today') {
    for (let h = 0; h < 24; h++) add(`h${h}`, h % 6 === 0 ? String(h).padStart(2, '0') : '')
    for (const e of events) {
      const d = new Date(e.createdAt)
      if (d.toDateString() === now.toDateString()) {
        const b = byKey.get(`h${d.getHours()}`)
        if (b) b.count += 1
      }
    }
  } else if (range === '6m') {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      add(`${d.getFullYear()}-${d.getMonth()}`, d.toLocaleDateString('en-GB', { month: 'short' }))
    }
    for (const e of events) {
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
    for (const e of events) {
      const b = byKey.get(new Date(e.createdAt).toDateString())
      if (b) b.count += 1
    }
  }
  return buckets
}

export interface UsageAggregate {
  totalViews: number
  activeUsers: number
  avgViewsPerUser: number
  distinctAreas: number
  areas: AreaStat[]
  days: DayBucket[]
  /** Human-readable window label for the chart heading, e.g. "last 7 days". */
  periodLabel: string
  users: UserUsageStat[]
  recent: UsageEvent[]
}

/** Aggregate a flat list of events into everything the dashboard renders. */
export function aggregateUsage(events: UsageEvent[], range: UsageRange = '7d', recentLimit = 40): UsageAggregate {
  const now = new Date()
  const start = rangeStart(range, now).getTime()
  const sorted = events
    .filter(e => !isExcludedFromUsage(e.email))
    .filter(e => new Date(e.createdAt).getTime() >= start)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const totalViews = sorted.length

  // Most viewed areas
  const areaCounts = new Map<string, number>()
  for (const e of sorted) {
    const label = areaLabel(e.path)
    areaCounts.set(label, (areaCounts.get(label) ?? 0) + 1)
  }
  const areas: AreaStat[] = Array.from(areaCounts.entries())
    .map(([label, count]) => ({ label, count, pct: totalViews ? Math.round((count / totalViews) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)

  // Activity buckets across the selected window
  const days = buildBuckets(sorted, range, now)

  // Per-user rollup
  const byUser = new Map<string, {
    name: string | null; email: string; views: number; pages: Set<string>
    areaCounts: Map<string, number>; firstActive: string; lastActive: string
  }>()
  for (const e of sorted) {
    const cur = byUser.get(e.userId) ?? {
      name: e.name, email: e.email, views: 0, pages: new Set<string>(),
      areaCounts: new Map<string, number>(), firstActive: e.createdAt, lastActive: e.createdAt,
    }
    cur.views += 1
    cur.pages.add(e.path)
    const area = areaLabel(e.path)
    cur.areaCounts.set(area, (cur.areaCounts.get(area) ?? 0) + 1)
    if (e.createdAt > cur.lastActive) cur.lastActive = e.createdAt
    if (e.createdAt < cur.firstActive) cur.firstActive = e.createdAt
    byUser.set(e.userId, cur)
  }
  const users: UserUsageStat[] = Array.from(byUser.entries())
    .map(([userId, v]) => ({
      userId,
      name: v.name,
      email: v.email,
      views: v.views,
      distinctPages: v.pages.size,
      topArea: Array.from(v.areaCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
      firstActive: v.firstActive,
      lastActive: v.lastActive,
    }))
    .sort((a, b) => b.views - a.views)

  const activeUsers = users.length

  return {
    totalViews,
    activeUsers,
    avgViewsPerUser: activeUsers ? Math.round(totalViews / activeUsers) : 0,
    distinctAreas: areas.length,
    areas,
    days,
    periodLabel: RANGE_PERIOD_LABEL[range],
    users,
    recent: sorted.slice(0, recentLimit),
  }
}
