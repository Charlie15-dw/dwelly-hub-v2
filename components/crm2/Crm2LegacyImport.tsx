'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// One-time bridge from the old localStorage completion model to Supabase.
//
// Progress used to live under `crm2_completed` in localStorage. The day this
// ships, anyone who had read lessons would otherwise see zero. On first load we
// read that key once, upsert whatever's there into content_completions, then
// remove the key so this never runs again — nobody loses their place.

const LEGACY_KEY = 'crm2_completed'

export default function Crm2LegacyImport({ knownSlugs }: { knownSlugs: string[] }) {
  const router = useRouter()

  useEffect(() => {
    let raw: string | null = null
    try {
      raw = localStorage.getItem(LEGACY_KEY)
    } catch {
      return // storage unavailable — nothing to import
    }
    if (!raw) return

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      // Corrupt value — clear it so we don't keep trying.
      try { localStorage.removeItem(LEGACY_KEY) } catch { /* ignore */ }
      return
    }
    const legacy = Array.isArray(parsed) ? (parsed as string[]) : []
    const valid = legacy.filter((s) => knownSlugs.includes(s))

    let cancelled = false
    async function run() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return

      if (user && valid.length > 0) {
        const now = new Date().toISOString()
        const { error } = await supabase.from('content_completions').upsert(
          valid.map((slug) => ({
            user_id: user.id,
            content_type: 'crm2',
            content_id: `crm2-${slug}`,
            completed_at: now,
          })),
          { onConflict: 'user_id,content_type,content_id' },
        )
        // Only retire the legacy key once the import has actually succeeded, so
        // a transient failure doesn't silently drop someone's progress.
        if (error) return
      }

      try { localStorage.removeItem(LEGACY_KEY) } catch { /* ignore */ }
      if (valid.length > 0) router.refresh()
    }

    run()
    return () => { cancelled = true }
  }, [knownSlugs, router])

  return null
}
