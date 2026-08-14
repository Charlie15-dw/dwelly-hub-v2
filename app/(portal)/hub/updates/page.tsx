import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Megaphone } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview, isHubElevated } from '@/lib/preview'
import { hubUpdatesSorted } from '@/lib/updates'
import UpdatesCarousel from '@/components/hub/UpdatesCarousel'
import ElevatedUpdates from '@/components/hub/ElevatedUpdates'

export default async function UpdatesPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  const updates = hubUpdatesSorted()

  // Gated elevated variant for the two review accounts.
  if (isHubElevated(user.email)) return <ElevatedUpdates updates={updates} />

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-indigo-700 bg-indigo-100 border-indigo-200">
          <Megaphone className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Dwelly Updates</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            What&rsquo;s changing across Dwelly &mdash; newest first. Use the arrows to browse.
          </p>
        </div>
      </div>

      <UpdatesCarousel updates={updates} />
    </div>
  )
}
