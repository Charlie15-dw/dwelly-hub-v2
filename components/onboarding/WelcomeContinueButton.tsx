'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { WelcomeStep } from '@/lib/onboarding-gate'

// Marks a welcome step (navigation / role) complete, then sends the user back
// to '/' — middleware recomputes resolveGateRedirect() on that request and
// routes them to whichever gate (or home) comes next. Keeps "what's next"
// logic in one place (lib/onboarding-gate.ts) instead of duplicating it here.
export default function WelcomeContinueButton({
  step,
  label = 'Continue',
}: {
  step: WelcomeStep
  label?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function handleClick() {
    setLoading(true)
    setError(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }

    const { error: err } = await supabase
      .from('content_completions')
      .upsert(
        { user_id: user.id, content_type: 'onboarding', content_id: step, completed_at: new Date().toISOString() },
        { onConflict: 'user_id,content_type,content_id' },
      )

    if (err) {
      setError(true)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div>
      {error && (
        <p className="text-sm text-red-600 mb-3">Couldn&rsquo;t save your progress — please try again.</p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="btn-primary w-full sm:w-auto justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{loading ? 'Saving…' : label}</span>
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
          : <ArrowRight className="w-4 h-4" aria-hidden />
        }
      </button>
    </div>
  )
}
