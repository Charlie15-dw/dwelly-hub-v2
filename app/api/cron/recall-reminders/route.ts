import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { buildRecallEmail } from '@/lib/email/recallTemplate'

const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? 'charlie@dwelly.group'
const FROM_NAME = 'Dwelly Training'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portal.dwelly.group'

// Human-readable titles for assessment IDs — used in email subject/body
const ASSESSMENT_TITLES: Record<string, string> = {
  'mnt-01': 'Maintenance & Repairs — Reporting',
  'mnt-02': 'Maintenance & Repairs — Video',
  'mnt-03': 'Maintenance & Repairs — Gas Safety',
  'cmp-01': 'Compliance Essentials',
  'cmp-02': 'Compliance — Video',
  'ins-02': 'Inspections & Property Visits',
  'sys-01': 'Systems & Processes',
  'sys-02': 'Systems & Processes — Advanced',
  'mvt-02': 'Move-In & Move-Out',
  'sup-02': 'Supplier & Contractor Management',
  'kno-01': 'Knowledge Base — Tenancy Law',
  'kno-02': 'Knowledge Base — Deposits',
  'kno-03': 'Knowledge Base — Safety Regulations',
  'full-assessment': 'Full Assessment — Video Modules',
  'master-assessment': 'Master Assessment',
}

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
      to: [{ email: to, name: toName || to }],
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

  const service = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  try {
    // Find all recall checks due today or overdue and not yet completed
    const { data: dueRecalls, error: recallError } = await service
      .from('recall_schedules')
      .select('id, user_id, assessment_id, interval_days')
      .lte('due_date', today)
      .is('completed_at', null)

    if (recallError) throw recallError
    if (!dueRecalls || dueRecalls.length === 0) {
      return NextResponse.json({ message: 'No recalls due today', sent: 0 })
    }

    // Collect unique user IDs
    const userIdSet = new Set(dueRecalls.map(r => r.user_id))
    const userIds = Array.from(userIdSet)

    // Get user profiles (name)
    const { data: profiles } = await service
      .from('user_profiles')
      .select('id, full_name')
      .in('id', userIds)

    // Get user emails from auth
    const { data: { users: authUsers } } = await service.auth.admin.listUsers({ perPage: 1000 })
    const emailMap = new Map(authUsers.map(u => [u.id, u.email ?? '']))
    const nameMap = new Map((profiles ?? []).map(p => [p.id, p.full_name ?? '']))

    const sent: string[] = []
    const skipped: string[] = []

    for (const recall of dueRecalls) {
      const email = emailMap.get(recall.user_id)
      if (!email) { skipped.push(recall.user_id); continue }

      const name = nameMap.get(recall.user_id) || email
      const assessmentTitle = ASSESSMENT_TITLES[recall.assessment_id] ?? recall.assessment_id

      // Deep link: /quiz/recall-{assessmentId}-{intervalDays}?schedule={scheduleId}
      const quizLink = `${SITE_URL}/quiz/recall-${recall.assessment_id}-${recall.interval_days}?schedule=${recall.id}`

      const { subject, html } = buildRecallEmail({
        name,
        assessmentTitle,
        intervalDays: recall.interval_days,
        quizLink,
      })

      try {
        await sendEmail(email, name, subject, html)
        sent.push(email)
      } catch (emailErr) {
        console.error(`[recall-reminders] Failed to email ${email}:`, emailErr)
        skipped.push(email)
      }
    }

    return NextResponse.json({
      message: `Recall reminders sent: ${sent.length}, skipped: ${skipped.length}`,
      sent,
      skipped,
    })
  } catch (err) {
    console.error('[cron/recall-reminders]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
