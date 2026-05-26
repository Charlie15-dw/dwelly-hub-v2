import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { scheduleId?: string; score?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { scheduleId, score } = body
  if (!scheduleId || typeof scheduleId !== 'string') {
    return NextResponse.json({ error: 'Missing scheduleId' }, { status: 400 })
  }

  const service = createServiceClient()

  // Validate ownership before updating
  const { data: schedule } = await service
    .from('recall_schedules')
    .select('id, user_id')
    .eq('id', scheduleId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!schedule) {
    // Schedule not found or doesn't belong to this user — silently OK (idempotent)
    return NextResponse.json({ ok: true })
  }

  const { error } = await service
    .from('recall_schedules')
    .update({
      completed_at: new Date().toISOString(),
      score: typeof score === 'number' ? score : null,
    })
    .eq('id', scheduleId)

  if (error) {
    console.error('[complete-recall]', error)
    return NextResponse.json({ error: 'Failed to mark complete' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
