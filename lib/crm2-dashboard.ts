import type { createServerClient } from '@/lib/supabase/server'
import {
  CRM2_PILLARS, CRM2_GUIDES, CRM2_CAPSTONE_MODULE_ID, getCrm2Guides,
  type Crm2Lesson,
} from '@/lib/crm2-content'
import { getCrm2CompletedSlugs } from '@/lib/crm2-completions'
import type { PillarProgress } from '@/components/crm2/ProgressRing'

// Per-user CRM 2.0 progress, computed once and shared by the pages that need it
// (the 2.0 landing and the compliance detail page). Keeping the queries in one
// place means both surfaces show the same "how far in am I" numbers.
export interface Crm2DashboardData {
  completed: Set<string>
  hasCertificate: boolean
  guidesDone: number
  outstandingGuides: Crm2Lesson[]
  nextGuide: Crm2Lesson | null
  minutesLeft: number
  pillarProgress: PillarProgress[]
}

export async function getCrm2DashboardData(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
): Promise<Crm2DashboardData> {
  const completed = await getCrm2CompletedSlugs(supabase, userId)

  // Has this user passed the capstone? If so, a certificate is available.
  const { data: capstonePass } = await supabase
    .from('assessment_results')
    .select('id')
    .eq('user_id', userId)
    .eq('assessment_id', CRM2_CAPSTONE_MODULE_ID)
    .eq('passed', true)
    .limit(1)
  const hasCertificate = (capstonePass?.length ?? 0) > 0

  // Progress is measured across the guides only.
  const guidesDone = CRM2_GUIDES.filter((g) => completed.has(g.slug)).length
  const outstandingGuides = CRM2_GUIDES.filter((g) => !completed.has(g.slug))
  const nextGuide = outstandingGuides[0] ?? null
  const minutesLeft = outstandingGuides.reduce((s, g) => s + g.minutes, 0)

  const pillarProgress: PillarProgress[] = CRM2_PILLARS.map(({ id, label }) => {
    const guides = getCrm2Guides(id)
    return { label, done: guides.filter((g) => completed.has(g.slug)).length, total: guides.length }
  })

  return { completed, hasCertificate, guidesDone, outstandingGuides, nextGuide, minutesLeft, pillarProgress }
}
