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

// CRM 2.0 Compliance learning space — now live for all users.
//
// It began as a review area gated to the management team and a handful of
// early-access accounts ahead of the wider launch. It's now been rolled out to
// the whole team, so any authenticated user can see the nav entry, reach the
// content and sit the assessments. The function is retained (with its role
// parameter) so existing call sites keep working; it now returns true for any
// authenticated user. Maintenance stays private via isMaintenancePreview below.
export function isCrm2Preview(
  email: string | null | undefined,
  _role?: string | null,
): boolean {
  return Boolean(email)
}

// Maintenance learning space — private early-access gate.
//
// The "Maintenance" section is the sibling track to CRM 2.0 Compliance. It's
// being scaffolded ahead of any content, so for now it's locked to a single
// account while it's built out. Widen this allow-list (or fold it into the
// CRM 2.0 rule) once there's content ready to share.
const MAINTENANCE_ALLOWED_EMAILS = new Set([
  'charlie@dwelly.group',
])

export function isMaintenancePreview(email: string | null | undefined): boolean {
  return email ? MAINTENANCE_ALLOWED_EMAILS.has(email.trim().toLowerCase()) : false
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
