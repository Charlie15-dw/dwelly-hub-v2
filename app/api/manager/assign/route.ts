import { NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isManager = profile?.role === 'manager'
  const isAdmin = profile?.role === 'admin'

  if (!isManager && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  // Managers: action='assign'|'unassign', managerId not required (defaults to self)
  // Admins: pass explicit managerId (or null to unassign)
  const { userId, action, managerId: targetManagerId } = body

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 })
  }

  let newManagerId: string | null

  if (isAdmin) {
    // Admin can assign to any manager or unassign (pass managerId: null)
    newManagerId = targetManagerId ?? null
  } else {
    // Manager can only assign to themselves or unassign
    newManagerId = action === 'assign' ? user.id : null
  }

  // Use service client so RLS doesn't block the update
  const service = createServiceClient()
  const { error } = await service
    .from('user_profiles')
    .update({ manager_id: newManagerId })
    .eq('id', userId)

  if (error) return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 })

  return NextResponse.json({ success: true })
}
