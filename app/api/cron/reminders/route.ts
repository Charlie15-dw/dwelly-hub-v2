import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Email reminders disabled — reminders are now sent manually via Slack.
  return NextResponse.json({ message: 'Email reminders disabled — using Slack instead', sent: 0 })
}
