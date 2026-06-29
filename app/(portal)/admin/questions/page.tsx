import { redirect } from 'next/navigation'
import { MessageSquareDashed } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import { HUB_QUESTION_STATUSES, HUB_STATUS_LABELS } from '@/lib/hub'
import AdminQuestionCard from '@/components/hub/AdminQuestionCard'

export default async function AdminQuestionsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()

  // Admin-only, and preview-gated during the Hub preview phase.
  if (profile?.role !== 'admin' || !isHubPreview(user.email)) redirect('/dashboard')

  // Service client bypasses RLS. Crucially, we never select submitted_by, so
  // the author is never exposed through the app — only via the SQL editor.
  const service = createServiceClient()
  const { data: questions } = await service
    .from('hub_questions')
    .select('id, body, category, status, admin_response, created_at')
    .order('created_at', { ascending: false })

  const all = questions ?? []
  const counts = HUB_QUESTION_STATUSES.reduce((acc, s) => {
    acc[s] = all.filter(q => q.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-purple-700 bg-purple-100 border-purple-200">
          <MessageSquareDashed className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Anonymous Questions</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submissions from the team. These are anonymous — the author isn't shown here.
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {HUB_QUESTION_STATUSES.map(s => (
          <span key={s} className="text-xs font-medium text-slate-500 px-3 py-1.5 rounded-lg bg-white border border-slate-200">
            {HUB_STATUS_LABELS[s]}: <span className="font-bold text-navy">{counts[s] ?? 0}</span>
          </span>
        ))}
      </div>

      {all.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-400">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {all.map(q => (
            <AdminQuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  )
}
