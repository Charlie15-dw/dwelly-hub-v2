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
// The "2.0" section is a work-in-progress learning area that should only be
// visible to Charlie while the content is being built. Restricted to the two
// listed accounts; everyone else neither sees the nav entry nor can reach the
// page. Widen this set (or replace it with a role/flag) when it's ready to roll
// out more broadly.
const CRM2_ALLOWED_EMAILS = new Set([
  'charlie@dwelly.group',
  'charlie@pennington-online.co.uk',
  'walter@dwelly.group',
])

export function isCrm2Preview(email: string | null | undefined): boolean {
  return email ? CRM2_ALLOWED_EMAILS.has(email.trim().toLowerCase()) : false
}
