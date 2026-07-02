'use client'

import { useUser } from '@/components/UserProvider'

export default function WelcomeGreeting({
  fallbackRole,
  tone = 'dark',
}: {
  fallbackRole: string
  tone?: 'dark' | 'light'
}) {
  const { displayName, profile, loading } = useUser()

  const firstName = loading ? '' : displayName.split(' ')[0]
  const roleLabel = profile?.role
    ? (profile.role === 'manager' ? 'Manager' : profile.role === 'senior-pm' ? 'Senior Property Manager' : 'Property Manager')
    : fallbackRole

  if (tone === 'light') {
    return (
      <>
        <p className="text-sm mb-1 text-white/70">Welcome back,</p>
        <h2 className="text-3xl font-bold text-white">{firstName || '…'}</h2>
        <p className="text-sm mt-1 text-white/60">{roleLabel}</p>
      </>
    )
  }

  return (
    <>
      <p className="text-sm mb-1 text-orange">Welcome back,</p>
      <h2 className="text-2xl font-bold text-navy">{firstName || '…'}</h2>
      <p className="text-sm mt-1 text-slate-500">{roleLabel}</p>
    </>
  )
}
