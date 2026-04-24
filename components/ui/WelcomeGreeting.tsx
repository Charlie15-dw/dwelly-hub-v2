'use client'

import { useUser } from '@/components/UserProvider'

export default function WelcomeGreeting({ fallbackRole }: { fallbackRole: string }) {
  const { displayName, profile, loading } = useUser()

  const firstName = loading ? '' : displayName.split(' ')[0]
  const roleLabel = profile?.role
    ? (profile.role === 'manager' ? 'Manager' : profile.role === 'senior-pm' ? 'Senior Property Manager' : 'Property Manager')
    : fallbackRole

  return (
    <>
      <p className="text-sm mb-1" style={{ color: '#3A9E98' }}>Welcome back,</p>
      <h2 className="text-2xl font-bold text-[#1D1D1F]">{firstName || '…'}</h2>
      <p className="text-sm mt-1" style={{ color: '#5AADA8' }}>{roleLabel}</p>
    </>
  )
}
