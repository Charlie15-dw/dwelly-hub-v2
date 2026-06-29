'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Shield, BookOpen, Award, Brain } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isHubPreview } from '@/lib/preview'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push(isHubPreview(email) ? '/hub' : '/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden" style={{ backgroundColor: '#E0F7F4' }}>
        <div className="absolute top-16 left-8 w-64 h-64 rounded-full bg-white/40" />
        <div className="absolute top-40 left-28 w-96 h-96 rounded-full bg-white/25" />
        <div className="absolute bottom-16 right-8 w-48 h-48 rounded-full bg-white/35" />
        <div className="absolute right-0 inset-y-0 w-1 bg-white/60" />

        <div className="relative flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex flex-col gap-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Dwelly" width={120} height={32} className="block" />
            <p className="text-xs font-medium text-[#1D1D1F] pl-0.5">Training Portal</p>
          </div>

          {/* Hero */}
          <div className="mt-auto">
            <h1 className="text-4xl font-black text-[#1D1D1F] leading-tight mb-4 text-balance">
              Built for<br />
              <span className="text-[#1D1D1F]">property excellence.</span>
            </h1>
            <p className="text-base leading-relaxed max-w-sm text-[#1D1D1F]/70">
              Your central hub for training, knowledge and compliance — everything your team needs
              to learn the Dwelly system, build confidence, and stay up to date.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '14+', label: 'Training Modules' },
                { value: '90+', label: 'Quiz Questions' },
                { value: '12',  label: 'Knowledge Guides' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-xl p-4 text-center shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.85)' }}>
                  <p className="text-2xl font-black text-[#1D1D1F]">{value}</p>
                  <p className="text-xs mt-1 text-[#1D1D1F]/55">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-3">
            {[
              { icon: BookOpen, text: 'Role-specific video modules & written guides' },
              { icon: Brain,    text: 'Spaced repetition to lock in knowledge' },
              { icon: Award,    text: 'Competency passport & sign-off gates' },
              { icon: Shield,   text: 'Compliance sign-off gates' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.60)' }}>
                  <Icon className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden />
                </div>
                <span className="text-sm text-[#1D1D1F]/75">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Dwelly" width={100} height={26} className="block" />
          </div>

          <div className="card p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-navy">Sign in to your portal</h2>
              <p className="text-sm text-slate-500 mt-1">Use your Dwelly work email to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign in form">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input"
                  placeholder="you@dwelly.co.uk"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-navy">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="input pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-navy"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" aria-hidden />
                      : <Eye className="w-4 h-4" aria-hidden />
                    }
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-between group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Signing in…' : 'Sign in'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" aria-hidden />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Access is restricted to authorised Dwelly team members. All activity is logged for compliance purposes.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Problems signing in? Contact{' '}
            <a href="mailto:charlie@dwelly.group" className="text-teal hover:underline">
              charlie@dwelly.group
            </a>
            {' '}or Charlie Lockwood on Slack
          </p>
        </div>
      </div>
    </div>
  )
}
