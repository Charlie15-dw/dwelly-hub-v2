import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { buildReminderEmail, ReminderType } from '@/lib/email/reminderTemplate'

const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? 'charlie@dwelly.group'
const FROM_NAME = 'Dwelly Training'
const TOTAL_ASSESSMENTS = 14
const INACTIVE_DAYS_THRESHOLD = 5
const NOT_STARTED_DAYS_THRESHOLD = 3

async function sendEmail(to: string, toName: string, subject: string, html: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Brevo error ${res.status}: ${err}`)
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const now = new Date()

  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, full_name, role, created_at')
      .eq('role', 'property-manager')

    if (profilesError) throw profilesError
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: 'No learners found', sent: 0 })
    }

    const userIds = profiles.map(p => p.id)

    const { data: results } = await supabase
      .from('assessment_results')
      .select('user_id, passed')
      .in('user_id', userIds)
      .eq('passed', true)

    const { data: progress } = await supabase
      .from('module_progress')
      .select('user_id, last_watched_at')
      .in('user_id', userIds)

    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const emailMap = new Map(authUsers.map(u => [u.id, u.email ?? '']))

    const passedByUser = new Map<string, number>()
    for (const r of results ?? []) {
      passedByUser.set(r.user_id, (passedByUser.get(r.user_id) ?? 0) + 1)
    }

    const lastActivityByUser = new Map<string, Date>()
    for (const p of progress ?? []) {
      const d = new Date(p.last_watched_at)
      const existing = lastActivityByUser.get(p.user_id)
      if (!existing || d > existing) lastActivityByUser.set(p.user_id, d)
    }

    const sent: string[] = []
    const skipped: string[] = []

    for (const profile of profiles) {
      const email = emailMap.get(profile.id)
      if (!email) { skipped.push(profile.id); continue }

      const assessmentsPassed = passedByUser.get(profile.id) ?? 0
      const lastActivity = lastActivityByUser.get(profile.id) ?? null
      const signedUpAt = new Date(profile.created_at)
      const daysSinceSignUp = Math.floor((now.getTime() - signedUpAt.getTime()) / 86_400_000)
      const daysSinceActivity = lastActivity
        ? Math.floor((now.getTime() - lastActivity.getTime()) / 86_400_000)
        : null

      if (assessmentsPassed >= TOTAL_ASSESSMENTS) { skipped.push(email); continue }

      let type: ReminderType | null = null

      if (assessmentsPassed === 0 && daysSinceSignUp >= NOT_STARTED_DAYS_THRESHOLD) {
        type = 'not_started'
      } else if (
        assessmentsPassed > 0 &&
        assessmentsPassed < TOTAL_ASSESSMENTS &&
        (daysSinceActivity === null || daysSinceActivity >= INACTIVE_DAYS_THRESHOLD)
      ) {
        type = assessmentsPassed >= Math.floor(TOTAL_ASSESSMENTS * 0.7)
          ? 'nearly_there'
          : 'in_progress'
      }

      if (!type) { skipped.push(email); continue }

      const { subject, html } = buildReminderEmail({
        name: profile.full_name ?? 'there',
        email,
        type,
        assessmentsPassed,
        totalAssessments: TOTAL_ASSESSMENTS,
        daysSinceActivity,
      })

      await sendEmail(email, profile.full_name ?? '', subject, html)
      sent.push(email)
    }

    return NextResponse.json({
      message: `Reminders sent: ${sent.length}, skipped: ${skipped.length}`,
      sent,
      skipped,
    })
  } catch (err) {
    console.error('[cron/reminders]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
