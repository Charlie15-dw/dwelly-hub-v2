'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Records a page view once the authenticated user has stayed on a page for at
// least DWELL_MS. Invisible — no UI. Powers the admin "Usage" view. The dwell
// threshold means simply clicking through the Hub doesn't inflate the numbers —
// only pages someone actually spends time on count. Records for all signed-in
// users (that's the whole point of usage tracking); the data is only ever read
// back by admins.

// Minimum time (ms) a user must remain on a page before it counts as a view.
const DWELL_MS = 10_000

export default function ActivityTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (lastPath.current === pathname) return // guard against double-fire
    lastPath.current = pathname

    const supabase = createClient()
    let active = true

    // Only record if the user is still here after the dwell threshold. If they
    // navigate away sooner, the cleanup clears the timer and nothing is logged.
    const timer = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!active || !user) return
      await supabase.from('activity_events').insert({
        user_id: user.id,
        path: pathname,
      })
    }, DWELL_MS)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [pathname])

  return null
}
