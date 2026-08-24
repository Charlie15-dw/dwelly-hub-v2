// Hub rollout.
//
// "The Hub" reframe is now live for all users: every signed-in account lands
// on /hub, sees the Hub navigation and can reach every Hub page. The function
// below is retained so existing call sites keep working; it now returns true
// for any authenticated user. (Admin-only pages remain gated by their own
// role check, which is unaffected by this.)
export function isHubPreview(email: string | null | undefined): boolean {
  return Boolean(email)
}

// Beta feature gate.
//
// The full wave of enhanced Hub features (guided new-starter journey, first-run
// welcome, confidence scoring, habit streak, buddy/mentor, knowledge freshness,
// conversation practice, embedded Deposit Simulator, law & legislation feed,
// smart refreshers and the manager competency heatmap) is now rolled out to the
// whole team. The function is retained so existing call sites keep working; it
// now returns true for any authenticated user.
export function isHubBeta(email: string | null | undefined): boolean {
  return Boolean(email)
}

// CRM 2.0 learning space — private early-access gate.
//
// The "2.0" section is a review area rolled out ahead of the wider launch. It's
// open to every manager/admin (so the whole management team can review the
// content and sit the assessments) plus a handful of named accounts who had
// early access. The wider group stays locked out — they neither see the nav
// entry nor can reach the page. When it's ready for everyone, drop the gate.
const CRM2_ALLOWED_EMAILS = new Set([
  'charlie@dwelly.group',
  'charlie@pennington-online.co.uk',
  'walter@dwelly.group',
  'veronica@dwelly.group',
  'mariia@dwelly.group',
  'ivan@dwelly.group',
  'fei@edenharper.com',
  'lisandra@edenharper.com',
])

// Roles that get CRM 2.0 access by virtue of being on the management team.
const CRM2_ALLOWED_ROLES = new Set(['manager', 'admin'])

// `role` comes from user_profiles.role. Managers and admins always have access;
// otherwise fall back to the named allow-list of early-access accounts.
export function isCrm2Preview(
  email: string | null | undefined,
  role?: string | null,
): boolean {
  if (role && CRM2_ALLOWED_ROLES.has(role)) return true
  return email ? CRM2_ALLOWED_EMAILS.has(email.trim().toLowerCase()) : false
}

// Elevated Hub — now live for all users.
//
// The elevated redesign (the "Today first" home with its hero + progress ring,
// Needs you, the gold Passport-progress card, the achievement shelf and the
// Passport preview, plus the redesigned Updates and Monthly PM Meet pages) has
// been reviewed and rolled out to the whole team. The function is retained so
// existing call sites keep working; it now returns true for any authenticated
// user.
export function isHubElevated(email: string | null | undefined): boolean {
  return Boolean(email)
}
