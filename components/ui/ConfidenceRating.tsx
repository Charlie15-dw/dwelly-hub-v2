'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function ConfidenceRating({
  moduleId,
  initialRating,
}: {
  moduleId: string
  initialRating: number | null
}) {
  const [selected, setSelected] = useState<number>(initialRating ?? 0)
  const [saving, setSaving] = useState(false)

  async function handleRate(value: number) {
    if (saving) return
    setSelected(value)
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase
        .from('module_progress')
        .upsert(
          { user_id: user.id, module_id: moduleId, confidence_rating: value },
          { onConflict: 'user_id,module_id' }
        )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold text-navy mb-3">Rate Your Confidence</h3>
      <p className="text-xs text-slate-500 mb-3">After completing this module, how confident do you feel?</p>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => handleRate(n)}
            disabled={saving}
            className={cn(
              'flex-1 h-8 rounded-lg border text-xs font-semibold transition-all',
              n === selected
                ? 'bg-orange text-white border-orange'
                : 'bg-white text-slate-500 border-slate-200 hover:border-orange/40 hover:text-orange',
              saving && 'opacity-60 cursor-not-allowed',
            )}
            aria-label={`Rate confidence ${n} out of 5`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 mt-2 text-center">
        {selected > 0
          ? `You rated ${selected}/5${saving ? ' — saving…' : ' — saved'}`
          : '1 = Not confident · 5 = Very confident'}
      </p>
    </div>
  )
}
