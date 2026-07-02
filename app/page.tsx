'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye, EyeOff, ArrowRight, Shield, BookOpen, Award, Command,
  MessageSquareDashed, Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isHubPreview } from '@/lib/preview'

const FEATURES = [
  { icon: BookOpen,            text: 'Role-specific video modules, guides & assessments' },
  { icon: Award,              text: 'Your Competency Passport — an exportable credential' },
  { icon: MessageSquareDashed, text: 'Dwelly updates & anonymous Q&A, all in one place' },
  { icon: Command,             text: 'Press ⌘K to search and jump anywhere instantly' },
]

const STATS = [
  { value: '14+', label: 'Training modules' },
  { value: '90+', label: 'Quiz questions' },
  { value: '5',   label: 'Knowledge pillars' },
]

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
    <div className="relative min-h-screen overflow-hidden bg-navy">
      {/* ── Ambient backdrop: blurred glow orbs + faint grid ────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hub-orb-a absolute -top-32 -right-24 w-[32rem] h-[32rem] rounded-full bg-orange-500/30 blur-3xl" />
        <div className="hub-orb-b absolute top-1/3 -left-32 w-[30rem] h-[30rem] rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-[34rem] h-[34rem] rounded-full bg-white/[0.04] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* ── Left: brand & welcome ─────────────────────────────────────── */}
        <section className="hidden lg:flex lg:w-[56%] flex-col justify-between p-12 xl:p-16 text-white">
          {/* Logo */}
          <div className="hub-fade flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Dwelly"
              width={128}
              height={34}
              className="block"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-white/40 text-lg font-light">/</span>
            <span className="text-sm font-semibold tracking-wide text-white/80">The Hub</span>
          </div>

          {/* Hero */}
          <div className="max-w-xl">
            <div
              className="hub-fade inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm"
              style={{ animationDelay: '0.05s' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-300" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
                Now live for every team
              </span>
            </div>

            <h1
              className="hub-fade text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-balance"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="text-white/70">Welcome to</span>
              <br />
              <span className="hub-shimmer">The Hub.</span>
            </h1>

            <p
              className="hub-fade text-base xl:text-lg leading-relaxed text-white/65 mt-5 max-w-lg"
              style={{ animationDelay: '0.16s' }}
            >
              The home of property management at Dwelly. Everything your team needs to learn the
              craft, master the system and do great work — training, knowledge and compliance,
              all in one place.
            </p>

            {/* Features */}
            <ul className="mt-9 space-y-3.5">
              {FEATURES.map(({ icon: Icon, text }, i) => (
                <li
                  key={text}
                  className="hub-fade flex items-center gap-3.5"
                  style={{ animationDelay: `${0.24 + i * 0.06}s` }}
                >
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10 border border-white/15 backdrop-blur-sm">
                    <Icon className="w-4 h-4 text-orange-200" aria-hidden />
                  </span>
                  <span className="text-sm text-white/80">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div
            className="hub-fade grid grid-cols-3 gap-4 max-w-lg"
            style={{ animationDelay: '0.5s' }}
          >
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl px-4 py-4 bg-white/[0.06] border border-white/10 backdrop-blur-sm"
              >
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs mt-1 text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Right: sign-in ────────────────────────────────────────────── */}
        <section className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md hub-fade" style={{ animationDelay: '0.12s' }}>
            {/* Mobile brand */}
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center gap-2.5 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt="Dwelly"
                  width={108}
                  height={28}
                  className="block"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span className="text-white/40">/</span>
                <span className="text-sm font-semibold text-white/80">The Hub</span>
              </div>
              <h1 className="text-3xl font-black text-white leading-tight">
                Welcome to <span className="hub-shimmer">The Hub.</span>
              </h1>
              <p className="text-sm text-white/60 mt-2 max-w-xs mx-auto">
                The home of property management at Dwelly.
              </p>
            </div>

            <div className="rounded-3xl bg-white shadow-panel ring-1 ring-black/5 p-8 sm:p-9">
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden />
                  <span className="text-[11px] font-semibold text-orange-700">The Hub is now live</span>
                </div>
                <h2 className="text-2xl font-bold text-navy tracking-tight">Sign in to continue</h2>
                <p className="text-sm text-slate-500 mt-1.5">Use your Dwelly work email to enter the Hub.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign in form">
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
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
                  <label htmlFor="password" className="block text-sm font-medium text-navy mb-1.5">
                    Password
                  </label>
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
                  <span>{loading ? 'Signing in…' : 'Enter the Hub'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" aria-hidden />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Access is restricted to authorised Dwelly team members. All activity is logged
                    for compliance purposes.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-white/45 mt-5">
              Problems signing in? Contact{' '}
              <a href="mailto:charlie@dwelly.group" className="text-white/70 hover:text-white underline underline-offset-2">
                charlie@dwelly.group
              </a>
              {' '}or Charlie Lockwood on Slack.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
