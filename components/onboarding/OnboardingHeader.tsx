'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// The slim navy bar that tops every onboarding screen. Deliberately has no Hub
// navigation — new starters only see their staged journey until they graduate.
// `backHref` is shown on the content pages (a way back to the stepper); the
// getting-started shell itself omits it.
export default function OnboardingHeader({ backHref }: { backHref?: string }) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="relative overflow-hidden bg-navy text-white sticky top-0 z-30">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hub-orb-a absolute -top-24 right-12 w-64 h-64 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>

      <div className="relative flex items-center justify-between gap-3 px-4 sm:px-6 h-16 max-w-[1100px] mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          {backHref ? (
            <Link
              href={backHref}
              className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Back to your training
            </Link>
          ) : (
            <div className="min-w-0">
              <p className="text-base font-bold tracking-tight leading-tight">Dwelly</p>
              <p className="text-[11px] text-white/55 leading-none mt-0.5">Getting started</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition text-sm text-white/80 hover:text-white"
        >
          <LogOut className="w-4 h-4" aria-hidden />
          <span className="hidden sm:block">Sign out</span>
        </button>
      </div>
    </header>
  )
}
