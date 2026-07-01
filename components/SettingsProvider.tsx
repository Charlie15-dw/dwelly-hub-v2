'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PortalSettings {
  notifications: {
    emailDigest: boolean
    spacedRepetitionReminders: boolean
    complianceAlerts: boolean
    assessmentResults: boolean
  }
  learning: {
    preferredTime: 'morning' | 'afternoon' | 'evening'
    weeklyGoal: number
    autoPlayVideos: boolean
  }
  accessibility: {
    textSize: 'small' | 'medium' | 'large'
    reducedMotion: boolean
    highContrast: boolean
  }
  // Knowledge Base article ids the user has saved for quick access.
  bookmarks: string[]
  onboarding: {
    welcomeDismissed: boolean
  }
}

export const DEFAULT_SETTINGS: PortalSettings = {
  notifications: {
    emailDigest: true,
    spacedRepetitionReminders: true,
    complianceAlerts: true,
    assessmentResults: false,
  },
  learning: {
    preferredTime: 'morning',
    weeklyGoal: 4,
    autoPlayVideos: true,
  },
  accessibility: {
    textSize: 'medium',
    reducedMotion: false,
    highContrast: false,
  },
  bookmarks: [],
  onboarding: {
    welcomeDismissed: false,
  },
}

const STORAGE_KEY = 'portal_settings'

interface SettingsContextValue {
  settings: PortalSettings
  loaded: boolean
  setNotification: <K extends keyof PortalSettings['notifications']>(
    key: K,
    value: PortalSettings['notifications'][K]
  ) => void
  setLearning: <K extends keyof PortalSettings['learning']>(
    key: K,
    value: PortalSettings['learning'][K]
  ) => void
  setAccessibility: <K extends keyof PortalSettings['accessibility']>(
    key: K,
    value: PortalSettings['accessibility'][K]
  ) => void
  isBookmarked: (id: string) => boolean
  toggleBookmark: (id: string) => void
  dismissWelcome: () => void
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  setNotification: () => {},
  setLearning: () => {},
  setAccessibility: () => {},
  isBookmarked: () => false,
  toggleBookmark: () => {},
  dismissWelcome: () => {},
})

// ─── Helpers ────────────────────────────────────────────────────────────────

// Merge a partial (possibly stale/partial) settings object onto the defaults so
// missing keys always resolve to a sane value.
function mergeSettings(partial: Partial<PortalSettings> | null | undefined): PortalSettings {
  return {
    notifications: { ...DEFAULT_SETTINGS.notifications, ...partial?.notifications },
    learning: { ...DEFAULT_SETTINGS.learning, ...partial?.learning },
    accessibility: { ...DEFAULT_SETTINGS.accessibility, ...partial?.accessibility },
    bookmarks: Array.isArray(partial?.bookmarks) ? partial!.bookmarks : DEFAULT_SETTINGS.bookmarks,
    onboarding: { ...DEFAULT_SETTINGS.onboarding, ...partial?.onboarding },
  }
}

// Apply the accessibility settings to the document root so they take effect
// across every page, not just the settings screen.
function applyAccessibility(a: PortalSettings['accessibility']) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.textSize = a.textSize
  root.classList.toggle('reduce-motion', a.reducedMotion)
  root.classList.toggle('high-contrast', a.highContrast)
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PortalSettings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 1. Instant load from localStorage (avoids a flash of default settings),
  //    then reconcile with Supabase (the cross-device source of truth).
  useEffect(() => {
    let active = true

    let initial = DEFAULT_SETTINGS
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) initial = mergeSettings(JSON.parse(stored) as Partial<PortalSettings>)
    } catch {
      // Ignore parse errors, fall back to defaults
    }
    setSettings(initial)
    applyAccessibility(initial.accessibility)

    async function loadRemote() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !active) {
        if (active) setLoaded(true)
        return
      }
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!active) return
      if (!error && data?.settings) {
        const remote = mergeSettings(data.settings as Partial<PortalSettings>)
        setSettings(remote)
        applyAccessibility(remote.accessibility)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote))
        } catch {
          // Ignore storage errors
        }
      }
      setLoaded(true)
    }

    loadRemote()
    return () => {
      active = false
    }
  }, [])

  // 2. Persist on change (after the initial load), to localStorage immediately
  //    and to Supabase debounced.
  useEffect(() => {
    if (!loaded) return

    applyAccessibility(settings.accessibility)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Ignore storage errors
    }

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase
        .from('user_settings')
        .upsert(
          { user_id: user.id, settings, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
      if (error) console.error('Failed to save settings to Supabase:', error.message)
    }, 600)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [settings, loaded])

  const setNotification = useCallback(
    <K extends keyof PortalSettings['notifications']>(
      key: K,
      value: PortalSettings['notifications'][K]
    ) => {
      setSettings((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: value },
      }))
    },
    []
  )

  const setLearning = useCallback(
    <K extends keyof PortalSettings['learning']>(
      key: K,
      value: PortalSettings['learning'][K]
    ) => {
      setSettings((prev) => ({
        ...prev,
        learning: { ...prev.learning, [key]: value },
      }))
    },
    []
  )

  const setAccessibility = useCallback(
    <K extends keyof PortalSettings['accessibility']>(
      key: K,
      value: PortalSettings['accessibility'][K]
    ) => {
      setSettings((prev) => ({
        ...prev,
        accessibility: { ...prev.accessibility, [key]: value },
      }))
    },
    []
  )

  const isBookmarked = useCallback(
    (id: string) => settings.bookmarks.includes(id),
    [settings.bookmarks]
  )

  const toggleBookmark = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(id)
        ? prev.bookmarks.filter((b) => b !== id)
        : [...prev.bookmarks, id],
    }))
  }, [])

  const dismissWelcome = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      onboarding: { ...prev.onboarding, welcomeDismissed: true },
    }))
  }, [])

  return (
    <SettingsContext.Provider
      value={{ settings, loaded, setNotification, setLearning, setAccessibility, isBookmarked, toggleBookmark, dismissWelcome }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
