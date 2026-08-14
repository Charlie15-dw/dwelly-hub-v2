import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Users, CalendarClock, FileText, ListChecks } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview, isHubElevated } from '@/lib/preview'
import ElevatedMeet from '@/components/hub/ElevatedMeet'

// Monthly PM Meet — placeholder for the monthly conference-style forum.
// Honest "coming soon" landing page: describes intent, no fabricated dates,
// recordings or decisions. Preview-gated.

export default async function MeetPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  // Gated elevated variant for the two review accounts.
  if (isHubElevated(user.email)) return <ElevatedMeet />

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/hub/connect" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Connect
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-navy bg-slate-50 border-slate-100">
          <Users className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy">Monthly PM Meet</h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              Coming soon
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            A monthly conference-style forum for the whole property management team.
          </p>
        </div>
      </div>

      <div className="card p-6 space-y-5">
        <p className="text-sm text-slate-600 leading-relaxed">
          The Monthly PM Meet is where the team comes together to share what&apos;s working,
          raise what isn&apos;t, and align on how we manage properties. This page will become the
          home for it once the first session runs.
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-50 text-navy border border-slate-100 flex-shrink-0">
              <CalendarClock className="w-4 h-4" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">Agenda</p>
              <p className="text-xs text-slate-500 mt-0.5">What&apos;s on the table for each session, published ahead of time.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-50 text-navy border border-slate-100 flex-shrink-0">
              <FileText className="w-4 h-4" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">Recordings &amp; notes</p>
              <p className="text-xs text-slate-500 mt-0.5">Catch up if you missed a session, or revisit what was covered.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-50 text-navy border border-slate-100 flex-shrink-0">
              <ListChecks className="w-4 h-4" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">Captured decisions</p>
              <p className="text-xs text-slate-500 mt-0.5">The decisions and actions that came out of each meeting, in one place.</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Nothing scheduled yet. When the first Monthly PM Meet is booked, the agenda will appear here.
      </p>
    </div>
  )
}
