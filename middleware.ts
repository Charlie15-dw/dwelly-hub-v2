import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isHubPreview } from '@/lib/preview'
import {
  ONBOARDING_HOME,
  isGraduated,
  onboardingRedirect,
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

  // Load the onboarding profile for signed-in users, so we can both route the
  // landing page and seal the Hub off from anyone still in onboarding. Only
  // fetched where it's actually needed (the landing page or a protected route),
  // and fail-open on any read error so a hiccup never traps a user.
  let onboarding: OnboardingProfile | null = null
  if (user && (pathname === '/' || !isPublic)) {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('role, onboarding_stage, onboarding_bypass')
        .eq('id', user.id)
        .maybeSingle()
      onboarding = (data as OnboardingProfile | null) ?? null
    } catch {
      onboarding = null
    }
  }

  // If already logged in and visiting the login page → redirect to their home.
  // Onboarding users go to their staged journey; otherwise Hub / dashboard.
  if (user && pathname === '/') {
    if (!isGraduated(onboarding)) return redirectTo(ONBOARDING_HOME)
    const home = isHubPreview(user.email) ? '/hub' : '/dashboard'
    return redirectTo(home)
  }

  // Seal the full Hub off from users still in onboarding — they may only reach
  // their stage's content pages and the getting-started shell.
  if (user && !isPublic) {
    const dest = onboardingRedirect(pathname, onboarding)
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
