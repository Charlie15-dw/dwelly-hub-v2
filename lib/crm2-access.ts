import type { User } from '@supabase/supabase-js'
import type { createServerClient } from '@/lib/supabase/server'
import { isCrm2Preview } from '@/lib/preview'

type ServerClient = ReturnType<typeof createServerClient>

// Server-side CRM 2.0 gate. The rule (managers/admins + the named early-access
// allow-list) lives in isCrm2Preview; this helper looks up the user's role from
// user_profiles so the pages don't each have to. Use it in place of a bare
// isCrm2Preview(user.email) check on any server page that guards the 2.0 space.
export async function canAccessCrm2(
  supabase: ServerClient,
  user: User | null,
): Promise<boolean> {
  if (!user) return false
  // Named accounts are allowed regardless of role — skip the DB round-trip.
  if (isCrm2Preview(user.email)) return true
  const { data } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  return isCrm2Preview(user.email, data?.role)
}
