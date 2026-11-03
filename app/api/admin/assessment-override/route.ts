import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { DEPARTMENTS } from '@/lib/departments'

async function requireAdmin() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { data: callerProfile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 }) }
  }
  return { user }
}

// Grant a department (or single-assessment) override to a user — lets them sit
// assessment(s) outside their own department without changing their department
// or role. See scripts/supabase-departments.sql for the matching RLS policy.
export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: { userId?: string; department?: string; assessmentId?: string | null }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const userId = body.userId?.trim()
  const department = body.department?.trim()
  const assessmentId = body.assessmentId?.trim() || null

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }
  if (!department || !DEPARTMENTS.includes(department as (typeof DEPARTMENTS)[number])) {
    return NextResponse.json({ error: 'Invalid department' }, { status: 400 })
  }

  const service = createServiceClient()

  const { error } = await service
    .from('assessment_overrides')
    .upsert(
      { user_id: userId, department, assessment_id: assessmentId, granted_by: auth.user.id, granted_at: new Date().toISOString() },
      { onConflict: 'user_id,department,assessment_id' },
    )

  if (error) {
    console.error('[admin/assessment-override] insert failed:', error)
    return NextResponse.json({ error: 'Failed to grant override' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// Revoke a previously-granted override.
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  let body: { id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const id = body.id?.trim()
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const service = createServiceClient()
  const { error } = await service
    .from('assessment_overrides')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[admin/assessment-override] delete failed:', error)
    return NextResponse.json({ error: 'Failed to revoke override' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
