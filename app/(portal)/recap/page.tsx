import Link from 'next/link'
import {
  RefreshCw, Calendar, Flame, CheckCircle2, ChevronRight,
  ArrowRight, Newspaper, BookOpen, Zap, Target,
} from 'lucide-react'
import { RECAP_ROUNDS, PORTAL_UPDATES, PRODUCT_RELEASE_QUIZZES, MODULES, SECTION_LABELS, type ModuleSection } from '@/lib/data'
import { KNOWLEDGE_ARTICLES } from '@/lib/training-content'
import { computeFocusAreas } from '@/lib/recap-focus'
import { cn } from '@/lib/utils'
import { createServerClient } from '@/lib/supabase/server'
import VideoLibraryTabs from './VideoLibraryTabs'

// ─── Category metadata ────────────────────────────────────────────────────────

const UPDATE_CATEGORY_META = {
  system:     { label: 'System',     colour: 'bg-blue-50 text-blue-700 border-blue-200' },
  compliance: { label: 'Compliance', colour: 'bg-amber-50 text-amber-700 border-amber-200' },
  content:    { label: 'Content',    colour: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  process:    { label: 'Process',    colour: 'bg-slate-100 text-slate-600 border-slate-200' },
} as const

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RecapPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch this user's completed recap rounds and release quizzes from assessment_results
  const completedByRound: Record<string, { score: number; completedAt: string }> = {}
  const completedReleaseIds = new Set<string>()
  let allResults: { assessment_id: string; score: number; passed: boolean; completed_at: string }[] = []

  if (user) {
    const { data: results } = await supabase
      .from('assessment_results')
      .select('assessment_id, score, passed, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: true })

    allResults = results ?? []

    for (const r of allResults) {
      if (r.assessment_id.startsWith('recap-')) {
        if (!completedByRound[r.assessment_id] || r.completed_at > completedByRound[r.assessment_id].completedAt) {
          completedByRound[r.assessment_id] = { score: r.score, completedAt: r.completed_at }
        }
      }
      if (r.assessment_id.startsWith('release-') && r.passed) {
        completedReleaseIds.add(r.assessment_id)
      }
    }
  }

  // Personalised focus areas: modules the user most recently scored below the
  // pass mark on. Empty (and the panel hidden) when there's nothing to flag.
  const focusAreas = computeFocusAreas(
    allResults,
    MODULES.map(m => ({ id: m.id, title: m.title, section: m.section, passmark: m.passmark })),
  )

  const completedIds = new Set(Object.keys(completedByRound))

  // First uncompleted round = current; completed ones shown as past
  const currentRound = RECAP_ROUNDS.find(r => !completedIds.has(r.id))
  const pastRounds = RECAP_ROUNDS
    .filter(r => completedIds.has(r.id))
    .map(r => ({
      ...r,
      completedDate: completedByRound[r.id].completedAt,
      score: completedByRound[r.id].score,
    }))
    .reverse()

  const lastCheckIn = pastRounds[0]?.completedDate ?? null
  const streak = pastRounds.length

  const legalArticles = KNOWLEDGE_ARTICLES.filter(a => a.category === 'legal')
  const opsArticles   = KNOWLEDGE_ARTICLES.filter(a => (['finance', 'standards'] as string[]).includes(a.category))
  const commsArticles = KNOWLEDGE_ARTICLES.filter(a => (['communication', 'landlord'] as string[]).includes(a.category))

  const refresherCols = [
    { label: 'Legal & Compliance', articles: legalArticles },
    { label: 'Operations',         articles: opsArticles },
    { label: 'Communication',      articles: commsArticles },
  ]

  return (
    <div className="space-y-6 max-w-[1200px]">

      {/* ── 0. Mandatory Product Release Quizzes ─────────────────────────────── */}
      {PRODUCT_RELEASE_QUIZZES.filter(q => q.mandatory).map(quiz => {
        const completed = completedReleaseIds.has(quiz.id)
        return (
          <div
            key={quiz.id}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: completed
                ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'
                : 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
              border: completed ? '1px solid #BBF7D0' : '2px solid #FDBA74',
            }}
          >
            <div className="absolute right-6 top-4 w-24 h-24 rounded-full bg-white/30 pointer-events-none" />
            <div className="flex items-start justify-between gap-4 flex-wrap relative">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: completed ? '#16A34A' : '#EA580C' }}
                >
                  {completed
                    ? <CheckCircle2 className="w-5 h-5 text-white" aria-hidden />
                    : <Zap className="w-5 h-5 text-white" aria-hidden />
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                      style={completed
                        ? { background: '#DCFCE7', color: '#16A34A', borderColor: '#BBF7D0' }
                        : { background: '#FFEDD5', color: '#EA580C', borderColor: '#FDBA74' }
                      }
                    >
                      {completed ? 'Completed' : 'Mandatory'}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[#1D1D1F]">{quiz.title}</h2>
                  <p className="text-sm text-[#1D1D1F]/60 mt-0.5">{quiz.subtitle}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#6E6E73]">
                    <span>12 questions</span>
                    <span>·</span>
                    <span>Pass mark {quiz.passmark}%</span>
                    <span>·</span>
                    <span>Required for all staff</span>
                  </div>
                </div>
              </div>
              {!completed && (
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white flex-shrink-0 transition-opacity hover:opacity-90"
                  style={{ background: '#EA580C' }}
                >
                  Start Quiz
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              )}
            </div>
          </div>
        )
      })}

      {/* ── 1. Header banner ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #EDE9FE 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute right-10 top-4 w-32 h-32 rounded-full bg-white/40 pointer-events-none" />
        <div className="absolute right-24 bottom-0 w-20 h-20 rounded-full bg-white/30 pointer-events-none" />
        <div className="absolute right-4 bottom-6 w-10 h-10 rounded-full bg-white/25 pointer-events-none" />

        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-3.5 h-3.5" style={{ color: '#4F46E5' }} aria-hidden />
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5', borderColor: 'rgba(79,70,229,0.25)' }}
              >
                For Experienced PMs
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#1D1D1F] mb-1">Recap &amp; Refresh</h1>
            <p className="text-sm text-[#1D1D1F]/60">Stay sharp. Stay current. Keep your knowledge up to date.</p>
          </div>

          {/* Streak + last check-in pills */}
          <div className="flex items-center gap-3 flex-wrap">
            {lastCheckIn && (
              <div className="flex items-center gap-2 bg-white/80 border border-white rounded-xl px-4 py-2.5 shadow-sm">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4F46E5' }} aria-hidden />
                <div>
                  <p className="text-[10px] text-[#6E6E73] leading-none mb-0.5">Last check-in</p>
                  <p className="text-xs font-semibold text-[#1D1D1F]">
                    {new Date(lastCheckIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/80 border border-white rounded-xl px-4 py-2.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" aria-hidden />
              <div>
                <p className="text-[10px] text-[#6E6E73] leading-none mb-0.5">Monthly streak</p>
                <p className="text-xs font-semibold text-[#1D1D1F]">{streak} month{streak !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. This month's check-in ─────────────────────────────────────────── */}
      <div className="card p-6" style={{ borderLeft: '4px solid #4F46E5' }}>
        <p className="text-xs font-bold text-[#1D1D1F] uppercase tracking-widest mb-5">
          This Month&apos;s Check-In
        </p>

        {currentRound ? (
          /* Active round */
          <div
            className="rounded-2xl p-5 mb-5"
            style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)', border: '1px solid rgba(79,70,229,0.2)' }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5', borderColor: 'rgba(79,70,229,0.2)' }}
                  >
                    {currentRound.label}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Available now
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#1D1D1F] mb-2">{currentRound.theme}</h2>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {currentRound.focus.map(f => (
                    <span
                      key={f}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/90 border border-indigo-100 text-indigo-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6E6E73]">
                  <span>{currentRound.questionCount} questions</span>
                  <span>·</span>
                  <span>~20 min</span>
                  <span>·</span>
                  <span>No pass mark — knowledge check only</span>
                </div>
              </div>

              <Link
                href={`/quiz/${currentRound.id}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white flex-shrink-0 transition-opacity hover:opacity-90"
                style={{ background: '#4F46E5' }}
              >
                Start {currentRound.month} Check-In
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        ) : (
          /* All rounds complete */
          <div className="rounded-2xl p-5 mb-5 text-center" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" aria-hidden />
            <p className="text-sm font-bold text-emerald-800 mb-1">All check-ins complete!</p>
            <p className="text-xs text-emerald-600">You&apos;re fully up to date. New rounds are added each month.</p>
          </div>
        )}

        {/* Past rounds */}
        {pastRounds.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-[#AEAEB2] uppercase tracking-widest mb-3">
              Previous Check-Ins
            </p>
            <div className="space-y-2">
              {pastRounds.map(round => (
                <div
                  key={round.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E8ED] bg-[#F9F9FB]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1D1D1F] truncate">
                        {round.label} — {round.theme}
                      </p>
                      {round.completedDate && (
                        <p className="text-xs text-[#AEAEB2] mt-0.5">
                          Completed {new Date(round.completedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                  {round.score !== undefined && (
                    <span
                      className={cn(
                        'text-sm font-bold tabular-nums px-3 py-1 rounded-full flex-shrink-0',
                        round.score >= 80
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      )}
                    >
                      {round.score}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 2b. Your focus areas ─────────────────────────────────────────────── */}
      {focusAreas.length > 0 && (
        <div className="card p-6" style={{ borderLeft: '4px solid #EA580C' }}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 flex-shrink-0 text-orange-600" aria-hidden />
            <p className="text-xs font-bold text-[#1D1D1F] uppercase tracking-widest">Your Focus Areas</p>
          </div>
          <p className="text-xs text-[#6E6E73] mb-5">
            Based on your latest assessment scores — the areas where a quick refresh would help most.
          </p>
          <div className="space-y-2">
            {focusAreas.map(area => (
              <div
                key={area.moduleId}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#F5D9C4] bg-[#FFF7ED]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#F5D9C4] text-orange-700">
                      {SECTION_LABELS[area.section as ModuleSection]}
                    </span>
                    <span className="text-xs font-bold text-orange-700 tabular-nums">
                      Last score {area.score}%
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1D1D1F] truncate">{area.title}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/modules/${area.moduleId}`}
                    className="text-xs font-semibold px-3 py-2 rounded-lg border border-[#E8E8ED] bg-white text-[#6E6E73] hover:border-[#1D1D1F]/30 transition"
                  >
                    Rewatch
                  </Link>
                  <Link
                    href={`/quiz/${area.moduleId}`}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                    style={{ background: '#EA580C' }}
                  >
                    Revise <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. What's New ────────────────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <Newspaper className="w-4 h-4 flex-shrink-0" style={{ color: '#4F46E5' }} aria-hidden />
          <p className="text-xs font-bold text-[#1D1D1F] uppercase tracking-widest">What&apos;s New</p>
        </div>

        <div className="space-y-2">
          {PORTAL_UPDATES.map(update => {
            const meta = UPDATE_CATEGORY_META[update.category]
            return (
              <details key={update.id} className="group rounded-xl border border-[#E8E8ED] overflow-hidden">
                <summary className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-[#F5F5F7] transition-colors list-none">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0', meta.colour)}>
                    {meta.label}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-[#1D1D1F] leading-snug min-w-0">
                    {update.title}
                  </span>
                  {update.isNew && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex-shrink-0">
                      New
                    </span>
                  )}
                  <span className="text-xs text-[#AEAEB2] flex-shrink-0 hidden sm:block">
                    {new Date(update.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                  <ChevronRight
                    className="w-3.5 h-3.5 text-[#D2D2D7] flex-shrink-0 transition-transform duration-200 group-open:rotate-90"
                    aria-hidden
                  />
                </summary>
                <div className="px-4 py-3 text-sm text-[#6E6E73] leading-relaxed border-t border-[#E8E8ED] bg-[#F9F9FB]">
                  {update.description}
                </div>
              </details>
            )
          })}
        </div>
      </div>

      {/* ── 4. Video Library ─────────────────────────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: '#4F46E5' }} aria-hidden />
          <p className="text-xs font-bold text-[#1D1D1F] uppercase tracking-widest">Video Library</p>
        </div>
        <p className="text-xs text-[#6E6E73] mb-5">
          Rewatch any module at any time — click a section to filter.
        </p>
        <VideoLibraryTabs />
      </div>

      {/* ── 5. Quick Refreshers ───────────────────────────────────────────────── */}
      <div className="card p-5">
        <p className="text-xs font-bold text-[#1D1D1F] uppercase tracking-widest mb-5">
          Quick Refreshers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {refresherCols.map(col => (
            <div key={col.label}>
              <p className="text-[10px] font-semibold text-[#AEAEB2] uppercase tracking-widest mb-3">
                {col.label}
              </p>
              <div className="space-y-1">
                {col.articles.map(article => (
                  <Link
                    key={article.id}
                    href={`/knowledge/${article.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors group"
                  >
                    <span className="text-lg leading-none flex-shrink-0" aria-hidden>{article.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1D1D1F] leading-snug line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-[11px] text-[#AEAEB2] mt-0.5">{article.readTime}</p>
                    </div>
                    <ChevronRight
                      className="w-3.5 h-3.5 text-[#D2D2D7] group-hover:text-[#4F46E5] transition-colors flex-shrink-0"
                      aria-hidden
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
