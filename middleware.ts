import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isHubPreview } from '@/lib/preview'
import {
  roleSkipsOnboarding,
  resolveGateRedirect,
  type OnboardingProfile,
} from '@/lib/onboarding-gate'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session — IMPORTANT: do not remove this
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Redirect while preserving any auth cookies that supabase.auth.getUser()
  // refreshed above. Building a bare NextResponse.redirect() would drop the
  // rotated session tokens, so the browser would keep sending the old (now
  // invalidated) token — and every later navigation would fail auth and bounce
  // the user back to the landing page. Copying the cookies keeps the session in
  // sync across the redirect.
  const redirectTo = (path: string) => {
    const response = NextResponse.redirect(new URL(path, request.url))
    for (const cookie of supabaseResponse.cookies.getAll()) {
      response.cookies.set(cookie)
    }
    return response
  }

  // Routes that don't require authentication
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/')

  // If not logged in and trying to access a protected route → redirect to login
  if (!user && !isPublic) {
    return redirectTo('/')
  }

  // Load the onboarding profile + welcome-step completion for signed-in users,
  // so we can both route the landing page and seal the Hub off from anyone
  // still mid-gate. Only fetched where it's actually needed (the landing page
  // or a protected route), and fail-open on any read error so a hiccup never
  // traps a user. Managers/admins skip both gates entirely, so their welcome
  // rows are never fetched.
  let onboarding: OnboardingProfile | null = null
  let completedWelcomeIds: string[] = []
  if (user && (pathname === '/' || !isPublic)) {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('role, department, onboarding_stage, onboarding_bypass')
        .eq('id', user.id)
        .maybeSingle()
      onboarding = (data as OnboardingProfile | null) ?? null

      if (onboarding && !roleSkipsOnboarding(onboarding.role)) {
        const { data: welcomeRows } = await supabase
          .from('content_completions')
          .select('content_id')
          .eq('user_id', user.id)
          .eq('content_type', 'onboarding')
        completedWelcomeIds = (welcomeRows ?? []).map((r) => r.content_id)
      }
    } catch {
      onboarding = null
      completedWelcomeIds = []
    }
  }

  // If already logged in and visiting the login page → redirect to their home.
  // Gated users go to whichever gate they're still in (welcome, then PM's
  // staged journey); otherwise Hub / dashboard.
  if (user && pathname === '/') {
    const dest = resolveGateRedirect(pathname, onboarding, completedWelcomeIds)
    if (dest) return redirectTo(dest)
    const home = isHubPreview(user.email) ? '/hub' : '/dashboard'
    return redirectTo(home)
  }

  // Seal the full Hub off from anyone still mid-gate — they may only reach
  // the welcome steps, or (once past welcome) their stage's content pages.
  if (user && !isPublic) {
    const dest = resolveGateRedirect(pathname, onboarding, completedWelcomeIds)
    if (dest && dest !== pathname) return redirectTo(dest)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, logo.svg, and other static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|logo\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
