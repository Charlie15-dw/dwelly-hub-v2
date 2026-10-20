// Lightweight onboarding gate — the part that runs in middleware.
//
// This module deliberately imports NOTHING from the content data files
// (CRM2_LESSONS, TRAINING_PAGES, MODULES, …). Middleware runs on the edge for
// every request, so pulling those large arrays in would bloat the edge bundle.
// All it needs is: is this user still onboarding, and may they visit this path?
// The richer stage→content map lives in lib/onboarding.ts, used only by the
// getting-started server pages.

export const FIRST_STAGE = 1
export const GRADUATED_STAGE = 7

// Where an onboarding user lives until they graduate.
export const ONBOARDING_HOME = '/getting-started'

export type OnboardingRole = string | null | undefined

export interface OnboardingProfile {
  role: OnboardingRole
  onboarding_stage: number | null | undefined
  onboarding_bypass: boolean | null | undefined
}

// Only property-managers are walked through onboarding. Managers and admins are
// treated as already graduated so they land straight on the full Hub.
export function roleSkipsOnboarding(role: OnboardingRole): boolean {
  return role === 'manager' || role === 'admin'
}

// Has this user finished (or been excused from) onboarding? A missing stage is
// treated as graduated so a failed profile read never traps anyone.
export function isGraduated(profile: OnboardingProfile | null | undefined): boolean {
  if (!profile) return true
  if (profile.onboarding_bypass) return true
  if (roleSkipsOnboarding(profile.role)) return true
  return (profile.onboarding_stage ?? GRADUATED_STAGE) >= GRADUATED_STAGE
}

// Content areas an onboarding user may reach (the real lesson/guide/quiz pages
// live inside the Hub route groups). Everything else — the Hub home, dashboard,
// passport, assessments index, admin, manager, social features — is sealed off
// until they graduate. Reaching a later stage's lesson by guessing a URL is
// harmless: the getting-started shell only surfaces the current stage and stage
// advancement is still gated on completion.
const ALLOWED_PREFIXES = [
  ONBOARDING_HOME, // the stepper shell itself
  '/quiz',         // assessments (deferrable "come back to this")
  '/modules',      // video guides (move-outs / inspections / support)
  '/training',     // written guides
  '/hub/crm-2',    // CRM 2.0 maintenance + compliance lessons
]

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + '/')
}

export function onboardingPathAllowed(pathname: string): boolean {
  return ALLOWED_PREFIXES.some((p) => matchesPrefix(pathname, p))
}

// The redirect decision for an onboarding user. Returns a path to redirect to,
// or null to let the request through. Graduated users are never gated here.
export function onboardingRedirect(
  pathname: string,
  profile: OnboardingProfile | null | undefined,
): string | null {
  if (isGraduated(profile)) return null
  if (onboardingPathAllowed(pathname)) return null
  return ONBOARDING_HOME
}
