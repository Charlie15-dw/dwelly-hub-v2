import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, MessagesSquare } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview, isHubBeta } from '@/lib/preview'
import PracticeStudio from '@/components/hub/PracticeStudio'

export default async function PracticePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')
  if (!isHubBeta(user.email)) redirect('/hub')

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-orange bg-orange/10 border-orange/20">
          <MessagesSquare className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Conversation practice</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Rehearse the tough conversations in a safe space. Pick a scenario, handle it in your own words,
            then get instant coaching on how you did.
          </p>
        </div>
      </div>

      <PracticeStudio />
    </div>
  )
}
