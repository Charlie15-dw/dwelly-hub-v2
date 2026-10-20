import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

const ROLES = ['property-manager', 'manager', 'admin'] as const
type Role = (typeof ROLES)[number]

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: callerProfile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
  }

  let body: { userId?: string; role?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const userId = body.userId?.trim()
  const role = body.role?.trim() as Role | undefined

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }
  if (!role || !ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // An admin can't change their own role — this prevents locking yourself out
  // of admin access by accident.
  if (userId === user.id) {
    return NextResponse.json({ error: 'You cannot change your own role' }, { status: 400 })
  }

  const service = createServiceClient()

  const { error } = await service
    .from('user_profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    console.error('[admin/role] update failed:', error)
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, role })
}
