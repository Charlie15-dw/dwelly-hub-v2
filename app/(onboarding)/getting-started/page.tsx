import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { isGraduated } from '@/lib/onboarding-gate'
import { ONBOARDING_STAGES, getStageState, FIRST_STAGE } from '@/lib/onboarding'
import { KNOWLEDGE_COURSES, KNOWLEDGE_COURSE_IDS } from '@/lib/data'
import OnboardingTabs from './OnboardingTabs'

export default async function GettingStartedPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, role, onboarding_stage, onboarding_bypass')
    .eq('id', user.id)
    .maybeSingle()

  // Graduated (or excused) users don't belong here — send them to the full Hub.
  if (isGraduated(profile ?? null)) redirect('/hub')

  const stage = profile?.onboarding_stage ?? FIRST_STAGE
  const state = await getStageState(supabase, user.id, stage)
  if (!state) redirect('/hub') // out-of-range stage — fail safe to the Hub

  const firstName = profile?.full_name?.trim().split(' ')[0] ?? null
  const totalStages = ONBOARDING_STAGES.length

  // Completed stages (everything before the current one) are resolved too, so the
  // learner can click back into them for a read-only review of the guides/videos.
  const completedStages = (
    await Promise.all(
      ONBOARDING_STAGES.filter((s) => s.n < stage).map(async (s) => {
        const st = await getStageState(supabase, user.id, s.n)
        return st ? { n: s.n, ...serialisable(st) } : null
      }),
    )
  ).filter((s): s is NonNullable<typeof s> => s !== null)

  // Certified knowledge-base courses are available throughout onboarding, not
  // tied to a stage. Resolve each course's passed state for the current user.
  const { data: courseResults } = await supabase
    .from('assessment_results')
    .select('assessment_id, passed')
    .eq('user_id', user.id)
    .in('assessment_id', KNOWLEDGE_COURSE_IDS as string[])
  const coursePassed = new Set((courseResults ?? []).filter(r => r.passed).map(r => r.assessment_id))
  const courses = KNOWLEDGE_COURSES.map(c => ({
    id: c.id,
    title: c.title,
    blurb: c.blurb,
    href: `/quiz/${c.id}`,
    passed: coursePassed.has(c.id),
  }))

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-widest text-orange">
          Getting started · Step {stage} of {totalStages}
        </p>
        <h1 className="mt-2 text-[30px] sm:text-[34px] font-bold tracking-tight text-navy leading-[1.1]">
          {firstName ? `Welcome, ${firstName}` : 'Welcome to Dwelly'}
        </h1>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-[1.6] text-[var(--text-secondary)]">
          We&rsquo;ll take you through your training one area at a time. Work through each
          stage&rsquo;s guides, and the full Hub unlocks once you&rsquo;ve finished them all.
        </p>
      </div>

      {/* Tabs: guided training vs. certified Knowledge Base courses */}
      <OnboardingTabs
        stages={ONBOARDING_STAGES.map((s) => ({ n: s.n, label: s.label }))}
        currentStage={stage}
        state={serialisable(state)}
        completedStages={completedStages}
        totalStages={totalStages}
        courses={courses}
      />
    </div>
  )
}

// The state object is passed into a client component, so strip it to plain data.
function serialisable(state: NonNullable<Awaited<ReturnType<typeof getStageState>>>) {
  return {
    label: state.def.label,
    blurb: state.def.blurb,
    guides: state.guides.map((g) => ({ title: g.title, href: g.href, done: g.done })),
    videos: state.videos.map((v) => ({ title: v.title, href: v.href })),
    assessments: state.assessments.map((a) => ({ title: a.title, href: a.href, passed: a.passed })),
    guidesComplete: state.guidesComplete,
    assessmentsUnlocked: state.assessmentsUnlocked,
    assessmentsComplete: state.assessmentsComplete,
    canAdvance: state.canAdvance,
  }
}
