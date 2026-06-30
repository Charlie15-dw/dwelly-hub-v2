import { redirect } from 'next/navigation'
import { Activity, Clock, Eye, Users } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'

// Admin "Usage" view — who is using the Hub and what they're looking at.
// Reads activity_events with the service-role key (bypasses RLS) and joins to
// auth.users for emails and user_profiles for names. Admin-only + preview-gated.

export const dynamic = 'force-dynamic'

const RECENT_LIMIT = 2000

function formatPath(path: string): string {
  if (path === '/' || path === '') return 'Home'
  const seg = path.split('/').filter(Boolean)
  const top = seg[0]
  const TOP: Record<string, string> = {
    hub: 'Hub', dashboard: 'Dashboard', training: 'Training Guide',
    knowledge: 'Knowledge Base', modules: 'Video Modules', quiz: 'Assessment',
    assessments: 'Assessments', passport: 'Competency Passport',
    glossary: 'Glossary', emergency: 'Emergency Procedures', recap: 'Recap & Refresh',
    analytics: 'My Analytics', 'pre-training': 'Learning Profile', admin: 'Admin',
  }
  const label = TOP[top] ?? top.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const rest = seg.slice(1).join(' / ')
  return rest ? `${label} · ${rest}` : label
}

function timeAgo(iso: string): string {
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

interface UserSummary {
  userId: string
  email: string
  name: string | null
  views: number
  distinctPages: number
  lastActive: string
}

export default async function AdminUsagePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' || !isHubPreview(user.email)) redirect('/dashboard')

  const service = createServiceClient()

  const [{ data: events }, { data: profiles }, usersResult] = await Promise.all([
    service
      .from('activity_events')
      .select('user_id, path, created_at')
      .order('created_at', { ascending: false })
      .limit(RECENT_LIMIT),
    service.from('user_profiles').select('id, full_name'),
    service.auth.admin.listUsers({ perPage: 1000 }),
  ])

  const allEvents = events ?? []
  const emailById = new Map<string, string>()
  for (const u of usersResult.data?.users ?? []) {
    if (u.email) emailById.set(u.id, u.email)
  }
  const nameById = new Map<string, string | null>()
  for (const p of profiles ?? []) nameById.set(p.id, p.full_name)

  // Per-user aggregation
  const byUser = new Map<string, { views: number; pages: Set<string>; lastActive: string }>()
  for (const e of allEvents) {
    const cur = byUser.get(e.user_id) ?? { views: 0, pages: new Set<string>(), lastActive: e.created_at }
    cur.views += 1
    cur.pages.add(e.path)
    if (e.created_at > cur.lastActive) cur.lastActive = e.created_at
    byUser.set(e.user_id, cur)
  }

  const summaries: UserSummary[] = Array.from(byUser.entries())
    .map(([userId, v]) => ({
      userId,
      email: emailById.get(userId) ?? '(unknown user)',
      name: nameById.get(userId) ?? null,
      views: v.views,
      distinctPages: v.pages.size,
      lastActive: v.lastActive,
    }))
    .sort((a, b) => b.lastActive.localeCompare(a.lastActive))

  const totalViews = allEvents.length
  const activeUsers = summaries.length
  const recent = allEvents.slice(0, 40)

  const stats = [
    { label: 'People using the Hub', value: activeUsers, icon: Users },
    { label: 'Total page views', value: totalViews, icon: Eye },
    { label: 'Events shown', value: `last ${Math.min(totalViews, RECENT_LIMIT)}`, icon: Activity },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-teal-700 bg-teal-100 border-teal-200">
          <Activity className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Usage</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Who&apos;s using the Hub, and what they&apos;re viewing.
          </p>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Icon className="w-4 h-4" aria-hidden />
              <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold text-navy mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Per-user table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-navy">People</h2>
        </div>
        {summaries.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">No activity recorded yet.</p>
          </div>
        ) : (
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
                {summaries.map(s => (
                  <tr key={s.userId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-navy">{s.name ?? s.email}</p>
                      {s.name && <p className="text-xs text-slate-400">{s.email}</p>}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-600">{s.views}</td>
                    <td className="px-5 py-3 text-right text-slate-600">{s.distinctPages}</td>
                    <td className="px-5 py-3 text-right text-slate-500">{timeAgo(s.lastActive)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent activity feed */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-navy">Recent activity</h2>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">Nothing yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {recent.map((e, i) => (
              <li key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{formatPath(e.path)}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {nameById.get(e.user_id) ?? emailById.get(e.user_id) ?? '(unknown)'}
                  </p>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3" aria-hidden /> {timeAgo(e.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
