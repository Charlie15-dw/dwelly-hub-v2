import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, GraduationCap } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview, isHubElevated } from '@/lib/preview'
import { canAccessTrainingRequests } from '@/lib/training-requests'
import RequestTrainingForm from '@/components/hub/RequestTrainingForm'
import HubHero from '@/components/hub/HubHero'

export default async function RequestTrainingPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  // Managers and admins only — property managers have no access.
  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if (!canAccessTrainingRequests(profile?.role)) redirect('/hub')

  if (isHubElevated(user.email)) {
    return (
      <div className="max-w-[880px] space-y-6">
        <HubHero
          eyebrow="Request training"
          title="Set up the next PM"
          subtitle="Ask for further training for an existing team member, or set up training for a new starter. Requests go straight to the Dwelly team."
          icon={GraduationCap}
        />
        <div className="hub-fade-1">
          <RequestTrainingForm />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-orange bg-orange/10 border-orange/20">
          <GraduationCap className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Request training</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ask for further training for an existing team member, or set up training for a new starter.
            Requests go straight to the Dwelly team.
          </p>
        </div>
      </div>

      <RequestTrainingForm />
    </div>
  )
}
