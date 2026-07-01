'use client'

import { Sparkles, X } from 'lucide-react'
import { useSettings } from '@/components/SettingsProvider'

// The new-starter nudge shown on the Hub home. Dismissible, with the
// dismissal persisted in the shared settings blob so it stays gone across
// sessions and devices. Rendered only for new starters (gated by the parent).
export default function WelcomeTip() {
  const { settings, loaded, dismissWelcome } = useSettings()

  // Avoid a flash before settings load, and stay hidden once dismissed.
  if (!loaded || settings.onboarding.welcomeDismissed) return null

  return (
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-orange/20 bg-orange/5 px-4 py-3">
      <Sparkles className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" aria-hidden />
      <p className="text-sm text-slate-600 flex-1">
        New here? Start with your <span className="font-semibold text-navy">Learning Profile</span> —
        it takes a couple of minutes and tailors the rest of your training to how you learn best.
      </p>
      <button
        type="button"
        onClick={dismissWelcome}
        className="p-1 -m-1 rounded-lg text-orange/60 hover:text-orange hover:bg-orange/10 transition flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" aria-hidden />
      </button>
    </div>
  )
}
