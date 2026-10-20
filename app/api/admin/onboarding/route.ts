import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { FIRST_STAGE, GRADUATED_STAGE } from '@/lib/onboarding-gate'

// Admin control over a member's staged onboarding. Lets an admin skip a new
// starter straight to the full Hub, or restart their journey from stage 1.
export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: caller } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (caller?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
  }

  let body: { userId?: string; action?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const userId = body.userId?.trim()
  const action = body.action
  if (!userId) {
    return NextResponse.json({ error: 'A userId is required' }, { status: 400 })
  }
  if (action !== 'skip' && action !== 'restart') {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }

  // skip → graduate + set bypass so role changes can't drop them back in.
  // restart → back to stage 1 with bypass cleared.
  const patch = action === 'skip'
    ? { onboarding_stage: GRADUATED_STAGE, onboarding_bypass: true }
    : { onboarding_stage: FIRST_STAGE, onboarding_bypass: false }

  const service = createServiceClient()
  const { error } = await service
    .from('user_profiles')
    .update(patch)
    .eq('id', userId)

  if (error) {
    console.error('[admin/onboarding] update failed:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, ...patch })
}
