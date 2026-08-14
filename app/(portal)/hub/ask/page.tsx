import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, MessageSquareDashed } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { isHubPreview, isHubElevated } from '@/lib/preview'
import AskQuestionForm from '@/components/hub/AskQuestionForm'
import ElevatedAsk, { type YourQuestion } from '@/components/hub/ElevatedAsk'

export default async function AskPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  // Gated elevated variant for the two review accounts. We fetch this user's
  // own submissions server-side (service client), never exposing submitted_by
  // to the client — only the rows this user authored are returned to them.
  if (isHubElevated(user.email)) {
    const service = createServiceClient()
    const { data } = await service
      .from('hub_questions')
      .select('id, body, category, status, admin_response, published_at, created_at, submitted_by')
      .eq('submitted_by', user.id)
      .order('created_at', { ascending: false })

    const yours: YourQuestion[] = (data ?? []).map(q => {
      let stage: YourQuestion['stage'] = 'received'
      if (q.published_at) stage = 'published'
      else if (q.status === 'answered' || q.admin_response) stage = 'answered'
      else if (q.status === 'reviewing') stage = 'reviewing'
      return {
        id: q.id,
        body: q.body,
        category: q.category,
        stage,
        admin_response: q.admin_response,
        created_at: q.created_at,
      }
    })

    return <ElevatedAsk yours={yours} />
  }

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
