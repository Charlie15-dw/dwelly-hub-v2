import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { buildInviteEmail } from '@/lib/email/inviteTemplate'

const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? 'charlie@dwelly.group'
const FROM_NAME = 'Dwelly Training'

async function sendInviteEmail(to: string, toName: string, subject: string, html: string) {
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
  const redirectTo = `${siteUrl}/auth/confirm`

  try {
    const service = createServiceClient()

    // Generate an invite link without triggering Supabase's email sending.
    const { data: linkData, error: linkError } = await service.auth.admin.generateLink({
      type: 'invite',
      email,
      options: {
        redirectTo,
        data: fullName ? { full_name: fullName } : undefined,
      },
    })

    if (linkError || !linkData?.properties) {
      console.error('[admin/invite] generateLink failed:', linkError)
      return NextResponse.json(
        { error: linkError?.message ?? 'Failed to generate invite link' },
        { status: 500 },
      )
    }

    // Build our own confirm URL using the hashed_token so we hit /auth/confirm
    // and route through the existing /auth/set-password flow.
    const hashedToken = linkData.properties.hashed_token
    const inviteLink = hashedToken
      ? `${siteUrl}/auth/confirm?token_hash=${hashedToken}&type=invite`
      : linkData.properties.action_link

    const newUserId = linkData.user?.id

    // Set role + full name on the newly-created profile (trigger creates the row).
    if (newUserId) {
      await service
        .from('user_profiles')
        .update({ role, full_name: fullName, email })
        .eq('id', newUserId)
    }

    const { subject, html } = buildInviteEmail({
      inviteeName: fullName,
      inviteLink,
      invitedBy: callerProfile.full_name ?? callerProfile.email ?? null,
    })

    await sendInviteEmail(email, fullName ?? email, subject, html)

    return NextResponse.json({ ok: true, email, userId: newUserId ?? null })
  } catch (err) {
    console.error('[admin/invite]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
