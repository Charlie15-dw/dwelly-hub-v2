import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

// Permanently deletes a user. Admin-only. Deleting the auth user cascades to
// every table keyed on auth.users(id) (user_profiles, assessment_results,
// module_progress, module_resets, learning_profiles, assessment_sessions,
// recall_schedules, content_completions, activity_events, user_settings) and
// null-outs the soft references (manager_id, submitted_by, requested_by), so
// there is nothing to clean up by hand.

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  // Verify the requester is an admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // An admin must not delete their own account — that would lock them out and
  // orphan the org. They can be removed by another admin instead.
  if (userId === user.id) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 })
  }

  const service = createServiceClient()

  // Confirm the target exists before attempting the destructive delete.
  const { data: target } = await service
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { error } = await service.auth.admin.deleteUser(userId)
  if (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
