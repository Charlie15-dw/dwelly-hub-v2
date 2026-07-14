import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import {
  TRAINING_REQUEST_TYPES,
  TRAINING_FOCUS_AREAS,
  TRAINING_URGENCIES,
  TRAINING_REQUEST_STATUSES,
  TRAINING_REQUEST_MAX_LENGTH,
  canAccessTrainingRequests,
} from '@/lib/training-requests'

// POST — submit a training request. Managers and admins only; property managers
// have no access. The requester's id is stored and (unlike the anonymous Q&A)
// deliberately surfaced to admins so they know who to follow up with.
export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!canAccessTrainingRequests(profile?.role)) {
    return NextResponse.json({ error: 'Forbidden — managers and admins only' }, { status: 403 })
  }

  let payload: {
    requestType?: string
    focusArea?: string
    subjectName?: string
    details?: string
    urgency?: string
  }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const requestType = payload.requestType?.trim()
  if (!requestType || !TRAINING_REQUEST_TYPES.includes(requestType as never)) {
    return NextResponse.json({ error: 'A valid request type is required' }, { status: 400 })
  }

  const details = payload.details?.trim()
  if (!details) {
    return NextResponse.json({ error: 'Please describe what training is needed' }, { status: 400 })
  }
  if (details.length > TRAINING_REQUEST_MAX_LENGTH) {
    return NextResponse.json({ error: 'Details are too long' }, { status: 400 })
  }

  const focusArea = payload.focusArea?.trim() || null
  if (focusArea && !TRAINING_FOCUS_AREAS.includes(focusArea as never)) {
    return NextResponse.json({ error: 'Invalid focus area' }, { status: 400 })
  }

  const urgency = payload.urgency?.trim() || 'normal'
  if (!TRAINING_URGENCIES.includes(urgency as never)) {
    return NextResponse.json({ error: 'Invalid urgency' }, { status: 400 })
  }

  const subjectName = payload.subjectName?.trim() || null

  const service = createServiceClient()
  const { error } = await service
    .from('hub_training_requests')
    .insert({
      request_type: requestType,
      focus_area: focusArea,
      subject_name: subjectName,
      details,
      urgency,
      requested_by: user.id,
    })

  if (error) {
    console.error('[hub/training-requests] insert failed:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// PATCH — admin updates a request's status and/or private notes.
export async function PATCH(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
  }

  let payload: { id?: string; status?: string; adminNotes?: string }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!payload.id || typeof payload.id !== 'string') {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const update: {
    status?: string
    admin_notes?: string | null
    updated_at: string
  } = {
    updated_at: new Date().toISOString(),
  }

  if (payload.status !== undefined) {
    if (!TRAINING_REQUEST_STATUSES.includes(payload.status as never)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    update.status = payload.status
  }

  if (payload.adminNotes !== undefined) {
    update.admin_notes = payload.adminNotes.trim() || null
  }

  const service = createServiceClient()
  const { error } = await service
    .from('hub_training_requests')
    .update(update)
    .eq('id', payload.id)

  if (error) {
    console.error('[hub/training-requests] update failed:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
