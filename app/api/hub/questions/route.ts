import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import {
  HUB_QUESTION_CATEGORIES,
  HUB_QUESTION_STATUSES,
  HUB_QUESTION_MAX_LENGTH,
} from '@/lib/hub'

// POST — submit an anonymous question/opinion.
// Any authenticated user may submit. The submitter's id is stored only for
// moderation (see the SQL migration); it is never returned to any client.
export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let payload: { body?: string; category?: string }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const body = payload.body?.trim()
  if (!body) {
    return NextResponse.json({ error: 'A question or comment is required' }, { status: 400 })
  }
  if (body.length > HUB_QUESTION_MAX_LENGTH) {
    return NextResponse.json({ error: 'Submission is too long' }, { status: 400 })
  }

  const category = payload.category?.trim() || null
  if (category && !HUB_QUESTION_CATEGORIES.includes(category as never)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const service = createServiceClient()
  const { error } = await service
    .from('hub_questions')
    .insert({ body, category, submitted_by: user.id })

  if (error) {
    console.error('[hub/questions] insert failed:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// PATCH — admin updates a submission's status and/or written response.
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

  let payload: { id?: string; status?: string; adminResponse?: string }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!payload.id || typeof payload.id !== 'string') {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const update: { status?: string; admin_response?: string | null; updated_at: string } = {
    updated_at: new Date().toISOString(),
  }

  if (payload.status !== undefined) {
    if (!HUB_QUESTION_STATUSES.includes(payload.status as never)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    update.status = payload.status
  }

  if (payload.adminResponse !== undefined) {
    update.admin_response = payload.adminResponse.trim() || null
  }

  const service = createServiceClient()
  const { error } = await service
    .from('hub_questions')
    .update(update)
    .eq('id', payload.id)

  if (error) {
    console.error('[hub/questions] update failed:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
