'use client'

import { useState, useEffect } from 'react'
import { User, Bell, BookOpen, Eye, Shield, Settings as SettingsIcon } from 'lucide-react'
import { CURRENT_USER, ROLE_LABELS } from '@/lib/data'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PortalSettings {
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
}

const DEFAULT_SETTINGS: PortalSettings = {
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
}

const STORAGE_KEY = 'portal_settings'

// ─── Toggle Switch Component ──────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean
  onChange: (val: boolean) => void
  id: string
}) {
  return (
    <label htmlFor={id} className="cursor-pointer select-none">
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 ${
          checked ? 'bg-[#0071E3]' : 'bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </label>
  )
}

// ─── Toggle Row Component ─────────────────────────────────────────────────────

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="pr-4">
        <p className="text-sm font-semibold text-navy">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-[#0071E3]" />
      <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">{title}</h2>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<PortalSettings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PortalSettings>
        setSettings((prev) => ({
          notifications: { ...prev.notifications, ...parsed.notifications },
          learning: { ...prev.learning, ...parsed.learning },
          accessibility: { ...prev.accessibility, ...parsed.accessibility },
        }))
      }
    } catch {
      // Ignore parse errors, fall back to defaults
    }
    setLoaded(true)
  }, [])

  // Persist to localStorage on change (after initial load)
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Ignore storage errors
    }
  }, [settings, loaded])

  // ── Setters ──────────────────────────────────────────────────────────────

  function setNotification<K extends keyof PortalSettings['notifications']>(
    key: K,
    value: PortalSettings['notifications'][K]
  ) {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }

  function setLearning<K extends keyof PortalSettings['learning']>(
    key: K,
    value: PortalSettings['learning'][K]
  ) {
    setSettings((prev) => ({
      ...prev,
      learning: { ...prev.learning, [key]: value },
    }))
  }

  function setAccessibility<K extends keyof PortalSettings['accessibility']>(
    key: K,
    value: PortalSettings['accessibility'][K]
  ) {
    setSettings((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, [key]: value },
    }))
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const initials = CURRENT_USER.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formattedStartDate = new Date(CURRENT_USER.startDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Page Header ── */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-5 h-5 text-[#0071E3]" />
        <div>
          <h1 className="text-xl font-bold text-navy">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your profile and preferences</p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          1. Profile Information
      ───────────────────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <SectionHeader icon={User} title="Profile Information" />

        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-semibold text-slate-600">{initials}</span>
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-sm font-medium text-navy mt-0.5">{CURRENT_USER.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Role</p>
              <p className="text-sm font-medium text-navy mt-0.5">
                {ROLE_LABELS[CURRENT_USER.role]}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium text-navy mt-0.5">{CURRENT_USER.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Start Date</p>
              <p className="text-sm font-medium text-navy mt-0.5">{formattedStartDate}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            disabled
            title="Coming soon"
            className="text-sm border border-slate-200 rounded-lg px-4 py-2 opacity-50 cursor-not-allowed text-navy"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          2. Notification Preferences
      ───────────────────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <SectionHeader icon={Bell} title="Notification Preferences" />

        <div className="divide-y divide-slate-100">
          <ToggleRow
            id="notif-email-digest"
            label="Email Digest"
            description="Receive a weekly summary of your learning progress"
            checked={settings.notifications.emailDigest}
            onChange={(val) => setNotification('emailDigest', val)}
          />
          <ToggleRow
            id="notif-spaced-repetition"
            label="Spaced Repetition Reminders"
            description="Get reminded when recall checks are due"
            checked={settings.notifications.spacedRepetitionReminders}
            onChange={(val) => setNotification('spacedRepetitionReminders', val)}
          />
          <ToggleRow
            id="notif-compliance-alerts"
            label="Compliance Alerts"
            description="Notifications for upcoming compliance deadlines"
            checked={settings.notifications.complianceAlerts}
            onChange={(val) => setNotification('complianceAlerts', val)}
          />
          <ToggleRow
            id="notif-assessment-results"
            label="Assessment Results"
            description="Email notification when assessment results are available"
            checked={settings.notifications.assessmentResults}
            onChange={(val) => setNotification('assessmentResults', val)}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          3. Learning Preferences
      ───────────────────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <SectionHeader icon={BookOpen} title="Learning Preferences" />

        <div className="space-y-5">
          {/* Preferred Learning Time */}
          <div>
            <p className="text-sm font-semibold text-navy mb-2">Preferred Learning Time</p>
            <div className="flex gap-3">
              {(['morning', 'afternoon', 'evening'] as const).map((time) => (
                <label key={time} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="preferred-time"
                    value={time}
                    checked={settings.learning.preferredTime === time}
                    onChange={() => setLearning('preferredTime', time)}
                    className="accent-[#0071E3]"
                  />
                  <span className="text-sm text-navy capitalize">{time}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Weekly Goal */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-navy">Weekly Goal</p>
              <span className="text-sm font-semibold text-[#0071E3]">
                {settings.learning.weeklyGoal} {settings.learning.weeklyGoal === 1 ? 'hour' : 'hours'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={settings.learning.weeklyGoal}
              onChange={(e) => setLearning('weeklyGoal', Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-slate-200 accent-[#0071E3] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 hr</span>
              <span>10 hrs</span>
            </div>
          </div>

          {/* Auto-play Videos */}
          <div className="flex justify-between items-center py-1">
            <div>
              <p className="text-sm font-semibold text-navy">Auto-play Videos</p>
              <p className="text-xs text-slate-500 mt-0.5">Automatically play the next video in a module</p>
            </div>
            <Toggle
              id="learning-autoplay"
              checked={settings.learning.autoPlayVideos}
              onChange={(val) => setLearning('autoPlayVideos', val)}
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          4. Accessibility
      ───────────────────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <SectionHeader icon={Eye} title="Accessibility" />

        <div className="space-y-5">
          {/* Text Size */}
          <div>
            <p className="text-sm font-semibold text-navy mb-2">Text Size</p>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setAccessibility('textSize', size)}
                  className={`px-4 py-1.5 rounded-lg text-sm border transition-colors capitalize ${
                    settings.accessibility.textSize === size
                      ? 'bg-[#0071E3] text-white border-[#0071E3] font-semibold'
                      : 'bg-white text-navy border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="divide-y divide-slate-100">
            <ToggleRow
              id="a11y-reduced-motion"
              label="Reduced Motion"
              description="Minimise animations and transitions throughout the portal"
              checked={settings.accessibility.reducedMotion}
              onChange={(val) => setAccessibility('reducedMotion', val)}
            />
            <ToggleRow
              id="a11y-high-contrast"
              label="High Contrast"
              description="Increase contrast for better readability"
              checked={settings.accessibility.highContrast}
              onChange={(val) => setAccessibility('highContrast', val)}
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          5. Account
      ───────────────────────────────────────────────────────────────────── */}
      <div className="card p-6">
        <SectionHeader icon={Shield} title="Account" />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            disabled
            title="Coming soon"
            className="btn-outline text-sm px-4 py-2 opacity-50 cursor-not-allowed rounded-lg border border-slate-200 text-navy"
          >
            Change Password
          </button>
          <button
            disabled
            title="Coming soon"
            className="text-sm px-4 py-2 opacity-50 cursor-not-allowed rounded-lg border border-red-200 text-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>

    </div>
  )
}
