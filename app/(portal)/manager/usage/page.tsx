import { redirect } from 'next/navigation'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import UsageDashboard from '@/components/usage/UsageDashboard'
import type { UsageEvent } from '@/lib/usage'

// Manager "Usage" view — the same in-depth analytics as the admin view, but
// scoped strictly to the manager's own team (user_profiles.manager_id = me).
// Managers see only their people; the org-wide picture stays admin-only.

export const dynamic = 'force-dynamic'

const RECENT_LIMIT = 2000

export default async function ManagerUsagePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'manager' || !isHubPreview(user.email)) redirect('/dashboard')

  // Who's on my team?
  const service = createServiceClient()
  const { data: team } = await service
    .from('user_profiles')
    .select('id, full_name, email')
    .eq('manager_id', user.id)

  const teamIds = (team ?? []).map(m => m.id)
  const nameById = new Map<string, string | null>()
  const emailById = new Map<string, string>()
  for (const m of team ?? []) {
    nameById.set(m.id, m.full_name)
    if (m.email) emailById.set(m.id, m.email)
  }

  // Activity for my team only.
  const { data: events } = teamIds.length > 0
    ? await service
        .from('activity_events')
        .select('user_id, path, created_at')
        .in('user_id', teamIds)
        .order('created_at', { ascending: false })
        .limit(RECENT_LIMIT)
    : { data: [] }

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
      title="Team Usage"
      subtitle="What your team is viewing on the Hub, and how active they are."
      emptyHint="Once your team members start using the Hub, their activity will show here."
    />
  )
}
