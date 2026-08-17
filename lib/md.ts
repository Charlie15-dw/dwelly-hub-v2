// Managing Directors — admin dashboard grouping.
//
// MDs are set up as ordinary property managers (so their own training progress
// is tracked exactly like everyone else). This allowlist simply tags which of
// those learners are Managing Directors, so the admin dashboard can surface them
// in their own "Managing Directors" section for at-a-glance individual progress.
// Add or remove an MD by editing the emails below (lower-case).
const MD_EMAILS = new Set<string>([
  'beki@lime-property.co.uk',
  'tracey.brown@number1letting.co.uk',
  'richard.burke@brookdale-pms.co.uk',
  'luke@hclettings.co.uk',
  'antony.rummins@parksletting.com',
  'robert@pennington-online.co.uk',
])

export function isMd(email: string | null | undefined): boolean {
  return email ? MD_EMAILS.has(email.trim().toLowerCase()) : false
}
