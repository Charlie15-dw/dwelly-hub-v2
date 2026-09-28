import type { createServerClient } from '@/lib/supabase/server'

// CRM 2.0 lesson completions live in the shared `content_completions` table —
// the same store the Training Guide and Knowledge Base use — rather than in
// localStorage. That means progress follows the reader between devices, survives
// a cleared cache, and is visible to a manager, exactly like their quiz results.
//
// content_type is 'crm2'; content_id is `crm2-<slug>` (arbitrary content_ids are
// already used elsewhere, e.g. 'kb-tenancy-law'), so this is a swap, not a
// schema migration.

export const CRM2_CONTENT_TYPE = 'crm2'

export const crm2ContentId = (slug: string) => `crm2-${slug}`
export const crm2SlugFromContentId = (id: string) =>
  id.startsWith('crm2-') ? id.slice('crm2-'.length) : id

/** Slugs this user has marked complete, read server-side under RLS. */
export async function getCrm2CompletedSlugs(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
): Promise<Set<string>> {
  const { data } = await supabase
    .from('content_completions')
    .select('content_id')
    .eq('user_id', userId)
    .eq('content_type', CRM2_CONTENT_TYPE)
  return new Set((data ?? []).map((r) => crm2SlugFromContentId(r.content_id)))
}

// Maintenance completions live under their OWN content_type so they never touch
// compliance progress, the certificate count, or the capstone — the two tracks
// share slugs (e.g. "how-...-works"), so isolating them by content_type is what
// keeps them apart.
export const MAINTENANCE_CONTENT_TYPE = 'crm2-maint'

export const maintenanceContentId = (slug: string) => `crm2-maint-${slug}`
export const maintenanceSlugFromContentId = (id: string) =>
  id.startsWith('crm2-maint-') ? id.slice('crm2-maint-'.length) : id

/** Maintenance slugs this user has marked complete, read server-side under RLS. */
export async function getMaintenanceCompletedSlugs(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
): Promise<Set<string>> {
  const { data } = await supabase
    .from('content_completions')
    .select('content_id')
    .eq('user_id', userId)
    .eq('content_type', MAINTENANCE_CONTENT_TYPE)
  return new Set((data ?? []).map((r) => maintenanceSlugFromContentId(r.content_id)))
}
