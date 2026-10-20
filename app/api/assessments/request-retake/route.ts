import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

// A learner asks their assigned manager for a retake on a locked assessment.
// The request is routed to their manager_id; if none is assigned we say so
// rather than silently dropping it. Granting the retake still happens manager-
// side via module_resets.
export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { assessmentId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const assessmentId = body.assessmentId?.trim()
  if (!assessmentId) {
    return NextResponse.json({ error: 'An assessmentId is required' }, { status: 400 })
  }

  const service = createServiceClient()

  const { data: profile } = await service
    .from('user_profiles')
    .select('manager_id')
    .eq('id', user.id)
    .single()

  if (!profile?.manager_id) {
    // No one to route this to. Tell the learner so they can chase an admin.
    return NextResponse.json({ ok: false, reason: 'no_manager' })
  }

  // Don't pile up duplicates — a live pending request is enough.
  const { data: existing } = await service
    .from('retake_requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('assessment_id', assessmentId)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ ok: true, alreadyRequested: true })
  }

  const { error } = await service
    .from('retake_requests')
    .insert({ user_id: user.id, assessment_id: assessmentId, manager_id: profile.manager_id })

  if (error) {
    console.error('[assessments/request-retake] insert failed:', error)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
