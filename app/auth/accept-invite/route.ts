import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(`${origin}/auth/set-password?error=missing_token`)
  }

  const service = createServiceClient()

  // Look up the pending invite
  const { data: invite, error: lookupError } = await service
    .from('pending_invites')
    .select('id, email, full_name, role, used_at')
    .eq('id', token)
    .single()

  if (lookupError || !invite) {
    return NextResponse.redirect(`${origin}/auth/set-password?error=invalid_token`)
  }

  if (invite.used_at) {
    return NextResponse.redirect(`${origin}/auth/set-password?error=already_used`)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? origin

  // Generate a fresh Supabase invite token right now — valid from this moment
  const { data: linkData, error: linkError } = await service.auth.admin.generateLink({
    type: 'invite',
    email: invite.email,
    options: {
      redirectTo: `${siteUrl}/auth/confirm`,
      data: invite.full_name ? { full_name: invite.full_name } : undefined,
    },
  })

  if (linkError || !linkData?.properties) {
    console.error('[accept-invite] generateLink failed:', linkError)
    return NextResponse.redirect(`${origin}/auth/set-password?error=invite_failed`)
  }

  // Set role + name on the newly created profile
  const newUserId = linkData.user?.id
  if (newUserId) {
    await service
      .from('user_profiles')
      .update({ role: invite.role, full_name: invite.full_name, email: invite.email })
      .eq('id', newUserId)
  }

  // Mark the pending invite as used
  await service
    .from('pending_invites')
    .update({ used_at: new Date().toISOString() })
    .eq('id', token)

  // Redirect to set-password with the fresh token_hash
  const hashedToken = linkData.properties.hashed_token
  const destination = hashedToken
    ? `${siteUrl}/auth/set-password?token_hash=${hashedToken}&type=invite`
    : linkData.properties.action_link

  return NextResponse.redirect(destination)
}
