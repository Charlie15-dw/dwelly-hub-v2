import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createServerClient()

  // Verify requester is a manager
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'manager') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { userId, action } = body // action: 'assign' | 'unassign'

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 })
  }

  const managerId = action === 'assign' ? user.id : null

  const { error } = await supabase
    .from('user_profiles')
    .update({ manager_id: managerId })
    .eq('id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
