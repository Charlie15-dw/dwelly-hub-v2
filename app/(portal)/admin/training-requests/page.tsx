import { redirect } from 'next/navigation'
import { GraduationCap } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import { TRAINING_REQUEST_STATUSES, TRAINING_STATUS_LABELS } from '@/lib/training-requests'
import AdminTrainingRequestCard, { type TrainingRequest } from '@/components/hub/AdminTrainingRequestCard'

export default async function AdminTrainingRequestsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()

  // Admin-only, and preview-gated during the Hub preview phase.
  if (profile?.role !== 'admin' || !isHubPreview(user.email)) redirect('/dashboard')

  const service = createServiceClient()
  const { data: rows } = await service
    .from('hub_training_requests')
    .select('id, request_type, focus_area, subject_name, details, urgency, status, admin_notes, created_at, requested_by')
    .order('created_at', { ascending: false })

  const all = rows ?? []

  // Resolve requester name/email. These are attributed requests (unlike the
  // anonymous Q&A), so the admin needs to know who to follow up with.
  const requesterIds = Array.from(new Set(all.map(r => r.requested_by).filter(Boolean))) as string[]
  const profilesById = new Map<string, { full_name: string | null; email: string | null }>()
  if (requesterIds.length > 0) {
    const { data: profiles } = await service
      .from('user_profiles')
      .select('id, full_name, email')
      .in('id', requesterIds)
    for (const p of profiles ?? []) {
      profilesById.set(p.id, { full_name: p.full_name, email: p.email })
    }
  }

  const requests: TrainingRequest[] = all.map(r => {
    const p = r.requested_by ? profilesById.get(r.requested_by) : undefined
    return {
      id: r.id,
      request_type: r.request_type,
      focus_area: r.focus_area,
      subject_name: r.subject_name,
      details: r.details,
      urgency: r.urgency,
      status: r.status,
      admin_notes: r.admin_notes,
      created_at: r.created_at,
      requester_name: p?.full_name ?? null,
      requester_email: p?.email ?? null,
    }
  })

  const counts = TRAINING_REQUEST_STATUSES.reduce((acc, s) => {
    acc[s] = requests.filter(r => r.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-orange bg-orange/10 border-orange/20">
          <GraduationCap className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Training requests</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Requests from managers — further training for existing team members and new starter setups.
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TRAINING_REQUEST_STATUSES.map(s => (
          <span key={s} className="text-xs font-medium text-slate-500 px-3 py-1.5 rounded-lg bg-white border border-slate-200">
            {TRAINING_STATUS_LABELS[s]}: <span className="font-bold text-navy">{counts[s] ?? 0}</span>
          </span>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-400">No training requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <AdminTrainingRequestCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </div>
  )
}
