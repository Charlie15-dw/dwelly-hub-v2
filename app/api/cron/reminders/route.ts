import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import { buildReminderEmail, ReminderType } from '@/lib/email/reminderTemplate'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'training@dwelly.group'
const TOTAL_ASSESSMENTS = 14

// Days of inactivity before sending a reminder
const INACTIVE_DAYS_THRESHOLD = 5
// Days since sign-up before sending a "not started" reminder
const NOT_STARTED_DAYS_THRESHOLD = 3

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron (or an authorised manual trigger)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const now = new Date()

  try {
    // 1. Fetch all learners (property-manager role only — not managers/admins)
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, full_name, role, created_at')
      .eq('role', 'property-manager')

    if (profilesError) throw profilesError
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: 'No learners found', sent: 0 })
    }

    const userIds = profiles.map(p => p.id)

    // 2. Fetch assessment results for all learners
    const { data: results } = await supabase
      .from('assessment_results')
      .select('user_id, assessment_id, passed, completed_at')
      .in('user_id', userIds)
      .eq('passed', true)

    // 3. Fetch last module activity for all learners
    const { data: progress } = await supabase
      .from('module_progress')
      .select('user_id, last_watched_at')
      .in('user_id', userIds)

    // 4. Fetch emails from Supabase auth admin
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const emailMap = new Map(authUsers.map(u => [u.id, u.email ?? '']))

    // Build per-user summary maps
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

      // Skip users who have completed everything
      if (assessmentsPassed >= TOTAL_ASSESSMENTS) { skipped.push(email); continue }

      let type: ReminderType | null = null

      if (assessmentsPassed === 0 && daysSinceSignUp >= NOT_STARTED_DAYS_THRESHOLD) {
        // Never started — registered at least 3 days ago
        type = 'not_started'
      } else if (
        assessmentsPassed > 0 &&
        assessmentsPassed < TOTAL_ASSESSMENTS &&
        (daysSinceActivity === null || daysSinceActivity >= INACTIVE_DAYS_THRESHOLD)
      ) {
        // Started but stalled
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

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
      })

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
