import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId, moduleId } = await req.json()
  if (!userId || !moduleId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Verify requester is a manager or admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isManager = profile?.role === 'manager'
  const isAdmin   = profile?.role === 'admin'

  if (!isManager && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Fetch the target user's role and manager_id
  const { data: targetProfile } = await supabase
    .from('user_profiles')
    .select('role, manager_id')
    .eq('id', userId)
    .single()

  if (isManager) {
    // Managers can only reassign property-managers in their own team
    if (targetProfile?.role !== 'property-manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (targetProfile?.manager_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  // Admins can reassign anyone (PMs and managers)

  // Clear any existing pending resets first so we never pile up duplicate
  // rows (which previously broke single-row detection on the quiz page).
  await supabase
    .from('module_resets')
    .delete()
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .is('consumed_at', null)

  // Insert reset record (quiz page will detect and consume this on next load)
  const { error } = await supabase
    .from('module_resets')
    .insert({ user_id: userId, module_id: moduleId, manager_id: user.id })

  if (error) return NextResponse.json({ error: 'Failed to reset module' }, { status: 500 })

  // Reset module progress so the module shows as incomplete
  await supabase
    .from('module_progress')
    .upsert(
      { user_id: userId, module_id: moduleId, progress: 0, completed: false },
      { onConflict: 'user_id,module_id' }
    )

  return NextResponse.json({ ok: true })
}
