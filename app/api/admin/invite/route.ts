import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: callerProfile } = await supabase
    .from('user_profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })
  }

  let body: { email?: string; fullName?: string; role?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const fullName = body.fullName?.trim() || null
  const role = (body.role?.trim() || 'property-manager') as 'property-manager' | 'manager' | 'admin'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 })
  }
  if (!['property-manager', 'manager', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portal.dwelly.group'

  try {
    const service = createServiceClient()

    // Store a pending invite — no Supabase token generated yet.
    // The Supabase token is generated fresh when the user clicks the link,
    // so the email link itself never expires.
    const { data: invite, error: insertError } = await service
      .from('pending_invites')
      .insert({
        email,
        full_name: fullName,
        role,
        invited_by: callerProfile.full_name ?? callerProfile.email ?? null,
      })
      .select('id')
      .single()

    if (insertError || !invite) {
      console.error('[admin/invite] insert pending_invite failed:', insertError)
      return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 })
    }

    const inviteLink = `${siteUrl}/auth/accept-invite?token=${invite.id}`

    // Email sending disabled — return the invite link for manual sharing via Slack
    return NextResponse.json({ ok: true, email, inviteLink })
  } catch (err) {
    console.error('[admin/invite]', err)
    return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 })
  }
}
