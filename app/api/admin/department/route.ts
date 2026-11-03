import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { DEPARTMENTS } from '@/lib/departments'

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

  let body: { userId?: string; department?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const userId = body.userId?.trim()
  const department = body.department?.trim()

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }
  if (!department || !DEPARTMENTS.includes(department as (typeof DEPARTMENTS)[number])) {
    return NextResponse.json({ error: 'Invalid department' }, { status: 400 })
  }

  const service = createServiceClient()

  const { error } = await service
    .from('user_profiles')
    .update({ department })
    .eq('id', userId)

  if (error) {
    console.error('[admin/department] update failed:', error)
    return NextResponse.json({ error: 'Failed to update department' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, department })
}
