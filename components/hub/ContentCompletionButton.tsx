'use client'

import { useEffect, useState } from 'react'
import { Check, Circle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

// A "Mark as read" toggle shown at the bottom of Training Guides and Knowledge
// Base articles. Persists per-user to content_completions and reflects the
// saved state on load. Clicking again un-marks it. Feeds the Hub journey ticks.

export default function ContentCompletionButton({
  contentType,
  contentId,
}: {
  contentType: 'training' | 'knowledge'
  contentId: string
}) {
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        .select('id')
        .eq('user_id', user.id)
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .maybeSingle()

      if (!active) return
      setDone(!!data)
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [contentType, contentId])

  async function toggle() {
    if (!userId || saving) return
    const supabase = createClient()
    setSaving(true)
    const next = !done
    setDone(next) // optimistic

    if (next) {
      const { error } = await supabase
        .from('content_completions')
        .upsert(
          { user_id: userId, content_type: contentType, content_id: contentId, completed_at: new Date().toISOString() },
          { onConflict: 'user_id,content_type,content_id' },
        )
      if (error) setDone(false)
    } else {
      const { error } = await supabase
        .from('content_completions')
        .delete()
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .eq('content_id', contentId)
      if (error) setDone(true)
    }
    setSaving(false)
  }

  // Don't render anything for signed-out static views.
  if (!loading && !userId) return null

  return (
    <div className={cn(
      'card p-5 flex items-center justify-between gap-4 flex-wrap transition-colors',
      done ? 'border-[#34C759]/30 bg-[#F0FFF4]' : '',
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          done ? 'bg-[#34C759]/15 text-[#34C759]' : 'bg-[#F5F5F7] text-[#AEAEB2]',
        )}>
          {done ? <Check className="w-5 h-5" aria-hidden /> : <Circle className="w-5 h-5" aria-hidden />}
        </div>
        <div>
          <p className="text-sm font-bold text-[#1D1D1F]">
            {done ? 'Marked as read' : 'Finished reading?'}
          </p>
          <p className="text-xs text-[#6E6E73]">
            {done ? 'This shows as complete on your Hub journey.' : 'Mark this as read to track it on your Hub journey.'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={loading || saving}
        className={cn(
          'text-sm font-semibold rounded-xl px-4 py-2.5 transition flex items-center gap-2 flex-shrink-0 disabled:opacity-60',
          done
            ? 'bg-white border border-[#D2D2D7] text-[#6E6E73] hover:bg-[#F5F5F7]'
            : 'bg-[#1D1D1F] text-white hover:bg-[#1D1D1F]/90',
        )}
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
        {done ? 'Mark as unread' : 'Mark as read'}
      </button>
    </div>
  )
}
