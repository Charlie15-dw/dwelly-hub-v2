'use client'

import { useEffect, useState } from 'react'
import { Check, Circle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

// Section-level "Mark as complete" toggle shown at the bottom of the Training
// Guide and Knowledge Base listing pages. One marker per (user, section).
// Persists to content_completions and feeds the ticks on the Hub journey.

// All articles/guides in a section share a single sentinel content_id.
const SECTION_ID = '__section__'

export default function ContentCompletionButton({
  contentType,
  label,
}: {
  contentType: 'training' | 'knowledge'
  label: string
}) {
  const [done, setDone] = useState(false)
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
        .select('id')
        .eq('user_id', user.id)
        .eq('content_type', contentType)
        .eq('content_id', SECTION_ID)
        .maybeSingle()

      if (!active) return
      setDone(!!data)
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [contentType])

  async function toggle() {
    if (!userId || saving) return
    const supabase = createClient()
    setSaving(true)
    setError(false)
    const next = !done
    setDone(next) // optimistic

    if (next) {
      const { error: err } = await supabase
        .from('content_completions')
        .upsert(
          { user_id: userId, content_type: contentType, content_id: SECTION_ID, completed_at: new Date().toISOString() },
          { onConflict: 'user_id,content_type,content_id' },
        )
      if (err) { setDone(false); setError(true) }
    } else {
      const { error: err } = await supabase
        .from('content_completions')
        .delete()
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .eq('content_id', SECTION_ID)
      if (err) { setDone(true); setError(true) }
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
            {done ? `${label} complete` : `Worked through the ${label}?`}
          </p>
          <p className="text-xs text-[#6E6E73]">
            {error
              ? 'Couldn\u2019t save — please try again in a moment.'
              : done
                ? 'This shows as complete on your Hub journey.'
                : 'Mark it complete to tick it off on your Hub journey.'}
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
        {done ? 'Mark as not complete' : 'Mark as complete'}
      </button>
    </div>
  )
}
