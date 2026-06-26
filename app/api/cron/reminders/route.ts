import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendSlackDirectMessage } from '@/lib/slack'

// Individual assessments we remind people about. The aggregate Full / Master
// assessments are intentionally excluded so reminders stay focused on the
// core modules people work through, plus the mandatory release quiz.
const REMINDER_ASSESSMENTS: { id: string; label: string }[] = [
  { id: 'mnt-01', label: 'Maintenance 1/2 — Creating a Repair Request' },
  { id: 'mnt-02', label: 'Maintenance 2/2 — Actioning the Maintenance Task' },
  { id: 'cmp-01', label: 'Compliance 1/2 — Creating a Compliance Task' },
  { id: 'cmp-02', label: 'Compliance 2/2 — Actioning the Compliance Task' },
  { id: 'mnt-03', label: 'Inspections 1/2 — Creating an Inspection Task' },
  { id: 'ins-02', label: 'Inspections 2/2 — Completing the Inspection' },
  { id: 'sys-01', label: 'Move-Outs 1/2 — Initiating the Move-Out Process' },
  { id: 'mvt-02', label: 'Move-Outs 2/2 — Completing the Move-Out' },
  { id: 'sys-02', label: 'Support 1/2 — Raising a Support Task' },
  { id: 'sup-02', label: 'Support 2/2 — Actioning the Support Task' },
  { id: 'kno-01', label: 'Knowledge — Difficult Conversations' },
  { id: 'kno-02', label: 'Knowledge — Handling Disrepair Claims' },
  { id: 'kno-03', label: 'Knowledge — Understanding a P&L' },
  { id: 'release-contractor-portal-2026', label: 'New Product Release Quiz — Contractor Portal' },
]

function displayName(fullName: string | null, email: string): string {
  if (fullName) return fullName.split(' ')[0]
  return email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.SLACK_BOT_TOKEN) {
    return NextResponse.json({
      message: 'SLACK_BOT_TOKEN not configured — no reminders sent. Add the bot token to enable Slack reminders.',
      sent: 0,
    })
  }

  // ?dryRun=1 computes who would be reminded without sending any messages.
  const dryRun = new URL(request.url).searchParams.get('dryRun') === '1'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portal.dwelly.group'

  const service = createServiceClient()

  // Trainees who may have outstanding assessments (everyone except admins).
  const { data: profiles, error: profileError } = await service
    .from('user_profiles')
    .select('id, email, full_name, role')
    .neq('role', 'admin')

  if (profileError) {
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 })
  }

  // All passing results, to work out what each user still has outstanding.
  const { data: passes } = await service
    .from('assessment_results')
    .select('user_id, assessment_id')
    .eq('passed', true)

  const passedByUser = new Map<string, Set<string>>()
  for (const p of passes ?? []) {
    if (!passedByUser.has(p.user_id)) passedByUser.set(p.user_id, new Set())
    passedByUser.get(p.user_id)!.add(p.assessment_id)
  }

  let sent = 0
  let noOutstanding = 0
  const skipped: { email: string; reason: string }[] = []
  const wouldSend: { email: string; outstanding: number }[] = []

  for (const profile of profiles ?? []) {
    if (!profile.email) continue

    const passed = passedByUser.get(profile.id) ?? new Set<string>()
    const outstanding = REMINDER_ASSESSMENTS.filter(a => !passed.has(a.id))
    if (outstanding.length === 0) {
      noOutstanding++
      continue
    }

    if (dryRun) {
      wouldSend.push({ email: profile.email, outstanding: outstanding.length })
      continue
    }

    const list = outstanding.map(a => `• ${a.label}`).join('\n')
    const message =
      `Hi ${displayName(profile.full_name, profile.email)}, a quick reminder from the Dwelly Training Portal 👋\n\n` +
      `You still have ${outstanding.length} assessment${outstanding.length !== 1 ? 's' : ''} to complete:\n` +
      `${list}\n\n` +
      `You can pick these up here whenever you have a few minutes: ${siteUrl}/assessments\n\n` +
      `Thanks!`

    const result = await sendSlackDirectMessage(profile.email, message)
    if (result.ok) {
      sent++
    } else {
      skipped.push({ email: profile.email, reason: result.detail ?? result.reason })
    }
  }

  return NextResponse.json({
    message: dryRun ? 'Dry run — no messages sent' : 'Slack reminders processed',
    dryRun,
    sent,
    noOutstanding,
    skippedCount: skipped.length,
    skipped,
    ...(dryRun ? { wouldSend } : {}),
  })
}
