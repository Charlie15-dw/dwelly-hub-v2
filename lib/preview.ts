// Hub preview gating.
//
// Phase 1 of "The Hub" reframe is gated to specific accounts so it can be
// tested before rolling out to everyone. To launch the Hub for all users,
// remove the calls to isHubPreview() at the call sites (or widen this list).
const HUB_PREVIEW_EMAILS = [
  'charlie@dwelly.group',
]

export function isHubPreview(email: string | null | undefined): boolean {
  if (!email) return false
  return HUB_PREVIEW_EMAILS.includes(email.trim().toLowerCase())
}
