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
// New Hub features (guided new-starter journey, first-run welcome, confidence
// scoring, habit streak, buddy/mentor, knowledge freshness) are being trialled
// with a single test account before rolling out to the wider team. Gate every
// new-feature call site behind this so the rest of the team keeps the current,
// stable Hub until we're happy.
const BETA_TESTERS = new Set<string>([
  'charlie@pennington-online.co.uk',
])

export function isHubBeta(email: string | null | undefined): boolean {
  if (!email) return false
  return BETA_TESTERS.has(email.trim().toLowerCase())
}
