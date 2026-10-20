import { NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { GRADUATED_STAGE, FIRST_STAGE, getStageState } from '@/lib/onboarding'
import { isGraduated } from '@/lib/onboarding-gate'

// Advance the signed-in user to the next onboarding stage. Guarded server-side:
// a stage only advances once its written guides are actually complete, so the
// client can't skip ahead by calling this directly. Outstanding assessments do
// NOT block advancing — they can be returned to later.
export async function POST() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = createServiceClient()
  const { data: profile } = await service
    .from('user_profiles')
    .select('role, onboarding_stage, onboarding_bypass')
    .eq('id', user.id)
    .maybeSingle()

  // Already graduated or excused — nothing to do, report it idempotently.
  if (isGraduated(profile ?? null)) {
    return NextResponse.json({ ok: true, graduated: true })
  }

  const stage = profile?.onboarding_stage ?? FIRST_STAGE
  const state = await getStageState(supabase, user.id, stage)
  if (!state) {
    return NextResponse.json({ error: 'Unknown stage' }, { status: 400 })
  }
  if (!state.canAdvance) {
    return NextResponse.json(
      { error: 'Finish this stage\u2019s guides before moving on.' },
      { status: 409 },
    )
  }

  const nextStage = Math.min(stage + 1, GRADUATED_STAGE)
  const { error: updateError } = await service
    .from('user_profiles')
    .update({ onboarding_stage: nextStage })
    .eq('id', user.id)

  if (updateError) {
    console.error('[onboarding/advance] update failed:', updateError)
    return NextResponse.json({ error: 'Couldn\u2019t save your progress.' }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    stage: nextStage,
    graduated: nextStage >= GRADUATED_STAGE,
  })
}
