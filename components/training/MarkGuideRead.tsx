'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

// End-of-guide "Mark as read" card. Writes one per-guide row into
// content_completions (content_type 'training', content_id = the guide id),
// which drives the read counts and dates on the index.
//
// The whole-section marker the Hub journey reads (content_id '__section__') is
// kept *derived*: whenever the last outstanding guide is marked read we write
// it, and when a guide is un-read we remove it. So "Training Guide complete" on
// the journey now means every guide has actually been read, not a single
// manual click.

const SECTION_ID = '__section__'

export default function MarkGuideRead({
  guideId,
  allGuideIds,
  guideTitle,
}: {
  guideId: string
  allGuideIds: string[]
  guideTitle: string
}) {
  const [done, setDone] = useState(false)
  const [readDate, setReadDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let active = true

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!active) return
      if (!user) { setLoading(false); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('content_completions')
        .select('content_id, completed_at')
        .eq('user_id', user.id)
        .eq('content_type', 'training')
        .eq('content_id', guideId)
        .maybeSingle()

      if (!active) return
      setDone(!!data)
      setReadDate(data?.completed_at ?? null)
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [guideId])

  // Keep the '__section__' sentinel in sync with the per-guide rows so the Hub
  // journey's "Training Guide complete" stays truthful.
  async function reconcileSection(supabase: ReturnType<typeof createClient>, uid: string) {
    const { data } = await supabase
      .from('content_completions')
      .select('content_id')
      .eq('user_id', uid)
      .eq('content_type', 'training')

    const readIds = new Set((data ?? []).map(r => r.content_id))
    const allRead = allGuideIds.every(id => readIds.has(id))

    if (allRead) {
      await supabase
        .from('content_completions')
        .upsert(
          { user_id: uid, content_type: 'training', content_id: SECTION_ID, completed_at: new Date().toISOString() },
          { onConflict: 'user_id,content_type,content_id' },
        )
    } else {
      await supabase
        .from('content_completions')
        .delete()
        .eq('user_id', uid)
        .eq('content_type', 'training')
        .eq('content_id', SECTION_ID)
    }
  }

  async function toggle() {
    if (!userId || saving) return
    const supabase = createClient()
    setSaving(true)
    setError(false)
    const next = !done
    setDone(next) // optimistic

    if (next) {
      const now = new Date().toISOString()
      const { error: err } = await supabase
        .from('content_completions')
        .upsert(
          { user_id: userId, content_type: 'training', content_id: guideId, completed_at: now },
          { onConflict: 'user_id,content_type,content_id' },
        )
      if (err) { setDone(false); setError(true); setSaving(false); return }
      setReadDate(now)
    } else {
      const { error: err } = await supabase
        .from('content_completions')
        .delete()
        .eq('user_id', userId)
        .eq('content_type', 'training')
        .eq('content_id', guideId)
      if (err) { setDone(true); setError(true); setSaving(false); return }
      setReadDate(null)
    }

    await reconcileSection(supabase, userId)
    setSaving(false)
  }

  // Nothing to show for signed-out static views.
  if (!loading && !userId) return null

  const dateLabel = readDate
    ? new Date(readDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : null

  return (
    <div className="relative overflow-hidden card p-6 flex items-center gap-5">
      {/* Gold accent — earned/complete only, per the "gold for earned" rule */}
      {done && (
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
          aria-hidden
        />
      )}

      <span
        className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
          done ? 'text-white' : 'bg-navy-50 text-[var(--text-tertiary)]',
        )}
        style={done ? { background: 'linear-gradient(135deg, #E9C767, #C9A84C)' } : undefined}
      >
        <Check className="w-5 h-5" strokeWidth={done ? 2.5 : 2} aria-hidden />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[17px] font-semibold text-navy">
          {done ? `Read${dateLabel ? ` · ${dateLabel}` : ''}` : `That\u2019s the end of ${guideTitle}`}
        </p>
        <p className="text-[14px] text-[var(--text-secondary)] mt-0.5">
          {error
            ? 'Couldn\u2019t save — please try again in a moment.'
            : done
              ? 'This guide is ticked off on your Hub journey.'
              : 'Mark it read to tick it off on your Hub journey.'}
        </p>
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={loading || saving}
        className={cn(
          'flex-shrink-0 disabled:opacity-60',
          done ? 'btn-outline' : 'btn-primary',
        )}
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
        {done ? 'Mark as unread' : 'Mark as read'}
      </button>
    </div>
  )
}
