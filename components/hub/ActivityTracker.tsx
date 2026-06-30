'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Records a page view each time the authenticated user navigates within the
// portal. Invisible — no UI. Powers the admin "Usage" view. Records for all
// signed-in users (that's the whole point of usage tracking); the data is only
// ever read back by admins.

export default function ActivityTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (lastPath.current === pathname) return // guard against double-fire
    lastPath.current = pathname

    const supabase = createClient()
    let active = true

    async function record() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!active || !user) return
      await supabase.from('activity_events').insert({
        user_id: user.id,
        path: pathname,
      })
    }

    record()
    return () => { active = false }
  }, [pathname])

  return null
}
