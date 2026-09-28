'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Award, Check, Loader2, ThumbsUp, ThumbsDown, ClipboardCheck, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

// The single end-of-guide card. It replaces the old separate "mark complete" +
// "test yourself" + nav stack with one clear next step.
//
// Completion is now Supabase-backed (content_completions, content_type 'crm2',
// content_id 'crm2-<slug>'), so it follows the reader between devices and a
// manager can see it. Only guides count towards the certificate, so the "n of N
// towards Certified Operator" line and the gold treatment are guide-only.
//
// "Was this helpful?" stays in localStorage — it's a private nicety, not
// progress, and there's no reader-facing consequence to losing it.

const FEEDBACK_KEY = 'crm2_feedback'

function readMap(key: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export default function LessonActions({
  slug,
  isGuide,
  guideCount,
  guideSlugs,
  quizModuleId,
  quizCount,
  contentType = 'crm2',
  progressSuffix = 'towards Certified Operator',
}: {
  slug: string
  isGuide: boolean
  guideCount: number
  guideSlugs: string[]
  quizModuleId?: string
  quizCount?: number
  /** Which content_completions bucket to read/write. Maintenance uses its own
   *  ('crm2-maint') so it never mixes with compliance progress. */
  contentType?: string
  /** The phrase after "n of N" in the progress line (guides only). */
  progressSuffix?: string
}) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)
  const [done, setDone] = useState(false)
  const [guidesDone, setGuidesDone] = useState(0)
  const [vote, setVote] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let active = true

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!active) return
      if (!user) { setLoading(false); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('content_completions')
        .select('content_id')
        .eq('user_id', user.id)
        .eq('content_type', contentType)

      if (!active) return
      const prefix = `${contentType}-`
      const doneSlugs = new Set((data ?? []).map((r) => r.content_id.startsWith(prefix) ? r.content_id.slice(prefix.length) : r.content_id))
      setDone(doneSlugs.has(slug))
      setGuidesDone(guideSlugs.filter((s) => doneSlugs.has(s)).length)
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [slug, guideSlugs, contentType])

  useEffect(() => {
    const fb = readMap(FEEDBACK_KEY)[slug]
    setVote(fb === 'up' || fb === 'down' ? fb : null)
  }, [slug])

  async function toggle() {
    if (!userId || saving) return
    const supabase = createClient()
    setSaving(true)
    setError(false)
    const next = !done
    setDone(next) // optimistic
    if (isGuide) setGuidesDone((n) => Math.max(0, n + (next ? 1 : -1)))

    if (next) {
      const { error: err } = await supabase.from('content_completions').upsert(
        { user_id: userId, content_type: contentType, content_id: `${contentType}-${slug}`, completed_at: new Date().toISOString() },
        { onConflict: 'user_id,content_type,content_id' },
      )
      if (err) {
        setDone(false)
        if (isGuide) setGuidesDone((n) => Math.max(0, n - 1))
        setError(true); setSaving(false); return
      }
    } else {
      const { error: err } = await supabase
        .from('content_completions')
        .delete()
        .eq('user_id', userId)
        .eq('content_type', contentType)
        .eq('content_id', `${contentType}-${slug}`)
      if (err) {
        setDone(true)
        if (isGuide) setGuidesDone((n) => n + 1)
        setError(true); setSaving(false); return
      }
    }

    setSaving(false)
    // Refresh so the landing page's progress reflects the change on return.
    router.refresh()
  }

  function castVote(next: 'up' | 'down') {
    const map = readMap(FEEDBACK_KEY)
    const applied = vote === next ? undefined : next
    if (applied) map[slug] = applied
    else delete map[slug]
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(map))
    } catch { /* ignore storage errors */ }
    setVote(applied ?? null)
  }

  // Signed-out static views have nothing to persist to.
  if (!loading && !userId) return null

  const quizHref = quizModuleId ? `/quiz/${quizModuleId}` : null

  return (
    <div className="relative overflow-hidden card p-6">
      {/* Gold accent — a read guide is an earned step towards the certificate. */}
      {isGuide && done && (
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
          aria-hidden
        />
      )}

      <div className="flex items-center gap-5">
        {isGuide && (
          <span
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
              done ? 'text-white' : 'bg-navy-50 text-[var(--text-tertiary)]',
            )}
            style={done ? { background: 'linear-gradient(135deg, #E9C767, #C9A84C)' } : undefined}
          >
            {done ? <Check className="w-6 h-6" strokeWidth={2.5} aria-hidden /> : <Award className="w-6 h-6" aria-hidden />}
          </span>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-semibold text-navy">
            {isGuide
              ? (done ? 'Guide read' : 'Mark this guide as read')
              : (done ? 'Marked as read' : 'Mark as read')}
          </p>
          <p className="text-[14px] text-[var(--text-secondary)] mt-0.5">
            {error
              ? 'Couldn\u2019t save — please try again in a moment.'
              : isGuide
                ? `${guidesDone} of ${guideCount} ${progressSuffix}`
                : 'References don\u2019t count towards your progress — read it whenever you need it.'}
          </p>
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={loading || saving}
          className={cn('flex-shrink-0 disabled:opacity-60', done ? 'btn-outline' : 'btn-primary')}
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
          {done ? 'Mark as unread' : 'Mark as read'}
        </button>
      </div>

      {/* Next step: the quiz this guide unlocks. */}
      {quizHref && (
        <Link
          href={quizHref}
          className="mt-5 pt-5 border-t border-navy-100 flex items-center gap-3 group"
        >
          <span className="w-9 h-9 rounded-xl bg-orange/10 text-orange flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-4 h-4" aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-navy">Test yourself</p>
            <p className="text-[13px] text-[var(--text-secondary)]">
              {quizCount ? `${quizCount} questions · 80% to pass` : 'A short knowledge check'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-orange flex-shrink-0 group-hover:gap-2 transition-all">
            Start <ChevronRight className="w-4 h-4" aria-hidden />
          </span>
        </Link>
      )}

      {/* Was this helpful? — local only. */}
      <div className="mt-5 pt-5 border-t border-navy-100 flex items-center justify-between gap-3">
        <span className="text-[13px] text-[var(--text-secondary)]">
          {vote ? 'Thanks for the feedback' : 'Was this helpful?'}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => castVote('up')}
            aria-label="Yes, this was helpful"
            aria-pressed={vote === 'up'}
            className={cn(
              'p-2 rounded-lg border transition',
              vote === 'up'
                ? 'rag-green'
                : 'bg-white text-[var(--text-secondary)] border-navy-100 hover:text-navy hover:border-navy-200',
            )}
          >
            <ThumbsUp className={cn('w-4 h-4', vote === 'up' && 'fill-current')} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => castVote('down')}
            aria-label="No, this needs improvement"
            aria-pressed={vote === 'down'}
            className={cn(
              'p-2 rounded-lg border transition',
              vote === 'down'
                ? 'rag-red'
                : 'bg-white text-[var(--text-secondary)] border-navy-100 hover:text-navy hover:border-navy-200',
            )}
          >
            <ThumbsDown className={cn('w-4 h-4', vote === 'down' && 'fill-current')} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
