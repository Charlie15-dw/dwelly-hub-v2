import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

const RECALL_INTERVALS = [3, 7, 30]

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { assessmentId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { assessmentId } = body
  if (!assessmentId || typeof assessmentId !== 'string') {
    return NextResponse.json({ error: 'Missing assessmentId' }, { status: 400 })
  }

  const service = createServiceClient()
  const today = new Date()

  // Clear any existing pending schedules for this user + assessment so retakes
  // don't accumulate duplicate recall chains
  await service
    .from('recall_schedules')
    .delete()
    .eq('user_id', user.id)
    .eq('assessment_id', assessmentId)
    .is('completed_at', null)

  const rows = RECALL_INTERVALS.map(days => {
    const due = new Date(today)
    due.setDate(due.getDate() + days)
    return {
      user_id: user.id,
      assessment_id: assessmentId,
      interval_days: days,
      due_date: due.toISOString().split('T')[0],
    }
  })

  const { error } = await service.from('recall_schedules').insert(rows)

  if (error) {
    console.error('[schedule-recall]', error)
    return NextResponse.json({ error: 'Failed to schedule recalls' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
