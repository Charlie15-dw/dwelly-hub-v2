import { redirect } from 'next/navigation'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import UsageDashboard from '@/components/usage/UsageDashboard'
import type { UsageEvent } from '@/lib/usage'

// Admin "Usage" view — org-wide picture of who is using the Hub and what
// they're looking at. Reads activity_events with the service-role key (bypasses
// RLS) and joins to auth.users for emails and user_profiles for names.
// Admin-only + preview-gated.

export const dynamic = 'force-dynamic'

const RECENT_LIMIT = 2000

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

  const emailById = new Map<string, string>()
  for (const u of usersResult.data?.users ?? []) {
    if (u.email) emailById.set(u.id, u.email)
  }
  const nameById = new Map<string, string | null>()
  for (const p of profiles ?? []) nameById.set(p.id, p.full_name)

  const usageEvents: UsageEvent[] = (events ?? []).map(e => ({
    userId: e.user_id,
    path: e.path,
    createdAt: e.created_at,
    name: nameById.get(e.user_id) ?? null,
    email: emailById.get(e.user_id) ?? '(unknown user)',
  }))

  return (
    <UsageDashboard
      events={usageEvents}
      title="Usage"
      subtitle="Across the whole organisation — who's using the Hub, and what they're viewing."
    />
  )
}
