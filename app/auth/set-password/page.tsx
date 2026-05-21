'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function SetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as 'invite' | 'recovery' | null
    const errorParam = searchParams.get('error')

    if (errorParam) {
      const messages: Record<string, string> = {
        missing_token: 'This invite link is incomplete.',
        invalid_token: 'This invite link is invalid or has already been used.',
        already_used:  'This invite link has already been used. Please ask an admin to send a new one.',
        invite_failed: 'Something went wrong processing your invite. Please ask an admin to send a new one.',
      }
      setError(messages[errorParam] ?? 'This invite link is invalid.')
      setVerifying(false)
      return
    }

    if (!token_hash || !type) {
      // No token — assume already authenticated (e.g. password recovery via /auth/confirm)
      setVerified(true)
      setVerifying(false)
      return
    }

    const supabase = createClient()
    supabase.auth.verifyOtp({ token_hash, type }).then(({ error: verifyError }) => {
      if (verifyError) {
        setError(verifyError.message)
      } else {
        setVerified(true)
      }
      setVerifying(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="w-full max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Dwelly" width={100} height={26} className="block mb-8" />

        <div className="card p-8">
          {verifying ? (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500">Verifying your invite link…</p>
            </div>
          ) : !verified ? (
            <div>
              <h2 className="text-xl font-bold text-navy mb-2">Link expired or invalid</h2>
              <p className="text-sm text-slate-500">{error ?? 'This invite link is no longer valid. Please ask an admin to send a new one.'}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-navy">Set your password</h2>
                <p className="text-sm text-slate-500 mt-1">Choose a password to access your training portal.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-navy mb-1.5">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="input pr-10"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-navy mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm"
                      name="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="input pr-10"
                      placeholder="Repeat your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-between group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Setting password…' : 'Set password & sign in'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Your password is encrypted and stored securely. Choose something memorable but strong.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    }>
      <SetPasswordForm />
    </Suspense>
  )
}
