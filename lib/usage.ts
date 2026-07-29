// Shared helpers for the Hub "Usage" analytics views (admin org-wide + manager
// team-scoped). Both pages read `activity_events` (user_id, path, created_at)
// and render the same UsageDashboard, so the labelling and time formatting live
// here as a single source of truth.

/** Top-level path segment → friendly area name. */
const AREA_LABELS: Record<string, string> = {
  hub: 'Hub',
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

/** Broad area a path belongs to — used for the "most viewed areas" ranking. */
export function areaLabel(path: string): string {
  if (path === '/' || path === '') return 'Home'
  const top = path.split('/').filter(Boolean)[0]
  return AREA_LABELS[top] ?? top.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/** Full, human-readable label for a specific path (area + sub-path). */
export function formatPath(path: string): string {
  if (path === '/' || path === '') return 'Home'
  const seg = path.split('/').filter(Boolean)
  const label = areaLabel(path)
  const rest = seg.slice(1).join(' / ')
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
  lastActive: string
}

export interface DayBucket {
  key: string
  label: string
  count: number
}

export interface UsageAggregate {
  totalViews: number
  activeUsers: number
  avgViewsPerUser: number
  distinctAreas: number
  areas: AreaStat[]
  days: DayBucket[]
  users: UserUsageStat[]
  recent: UsageEvent[]
}

/** Aggregate a flat list of events into everything the dashboard renders. */
export function aggregateUsage(events: UsageEvent[], recentLimit = 40): UsageAggregate {
  const sorted = events
    .filter(e => !isExcludedFromUsage(e.email))
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

  // Activity over the last 7 days
  const now = new Date()
  const days: DayBucket[] = []
  const dayByKey = new Map<string, DayBucket>()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const bucket: DayBucket = {
      key: d.toDateString(),
      label: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      count: 0,
    }
    days.push(bucket)
    dayByKey.set(bucket.key, bucket)
  }
  for (const e of sorted) {
    const bucket = dayByKey.get(new Date(e.createdAt).toDateString())
    if (bucket) bucket.count += 1
  }

  // Per-user rollup
  const byUser = new Map<string, { name: string | null; email: string; views: number; pages: Set<string>; lastActive: string }>()
  for (const e of sorted) {
    const cur = byUser.get(e.userId) ?? { name: e.name, email: e.email, views: 0, pages: new Set<string>(), lastActive: e.createdAt }
    cur.views += 1
    cur.pages.add(e.path)
    if (e.createdAt > cur.lastActive) cur.lastActive = e.createdAt
    byUser.set(e.userId, cur)
  }
  const users: UserUsageStat[] = Array.from(byUser.entries())
    .map(([userId, v]) => ({
      userId,
      name: v.name,
      email: v.email,
      views: v.views,
      distinctPages: v.pages.size,
      lastActive: v.lastActive,
    }))
    .sort((a, b) => b.lastActive.localeCompare(a.lastActive))

  const activeUsers = users.length

  return {
    totalViews,
    activeUsers,
    avgViewsPerUser: activeUsers ? Math.round(totalViews / activeUsers) : 0,
    distinctAreas: areas.length,
    areas,
    days,
    users,
    recent: sorted.slice(0, recentLimit),
  }
}
