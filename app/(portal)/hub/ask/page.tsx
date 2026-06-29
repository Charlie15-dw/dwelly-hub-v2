import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, MessageSquareDashed } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import AskQuestionForm from '@/components/hub/AskQuestionForm'

export default async function AskPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-purple-700 bg-purple-100 border-purple-200">
          <MessageSquareDashed className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Anonymous Q&amp;A</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Raise questions, ideas and sticking points honestly — no name attached.
          </p>
        </div>
      </div>

      <AskQuestionForm />

      <p className="text-xs text-slate-400">
        Answered questions are published on the{' '}
        <Link href="/hub/answered" className="text-teal hover:underline">You said, we did</Link> feed.
      </p>
    </div>
  )
}
