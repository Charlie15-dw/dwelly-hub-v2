import Link from 'next/link'
import { Users, MessageSquareDashed, ArrowRight, LifeBuoy } from 'lucide-react'

// "You're never on your own" — a support-network card (beta) that pairs a new
// starter with a buddy and points to the low-friction ways to get unstuck.
//
// Why: the single biggest predictor of a new starter thriving is knowing who to
// ask. This makes that explicit from day one rather than leaving them to guess.
//
// Beta note: the buddy is a hand-set constant for the trial. When we roll this
// out we'll replace it with a real pairing stored per user (mentor assigned by
// their manager), but the UI stays the same.

const BUDDY = {
  name: 'Charlie Lockwood',
  role: 'Your onboarding buddy',
  blurb: 'Here for anything as you settle in — the small questions as much as the big ones.',
  contactHref: 'mailto:charlie@dwelly.group',
  contactLabel: 'Message your buddy',
}

export default function SupportNetwork() {
  return (
    <section className="card p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 text-navy">
          <LifeBuoy className="w-4 h-4" aria-hidden />
        </div>
        <div>
          <h3 className="text-base font-bold text-navy">You&rsquo;re never on your own</h3>
          <p className="text-xs text-slate-500 mt-0.5">Two easy ways to get unstuck — no question is too small.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Buddy */}
        <div className="rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange/10 text-orange border border-orange/20 flex-shrink-0">
              <Users className="w-4 h-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-navy truncate">{BUDDY.name}</p>
              <p className="text-xs text-slate-500">{BUDDY.role}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">{BUDDY.blurb}</p>
          <a
            href={BUDDY.contactHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange mt-3 group"
          >
            {BUDDY.contactLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
          </a>
        </div>

        {/* Anonymous Q&A */}
        <Link href="/hub/ask" className="rounded-2xl border border-slate-100 p-4 group hover:shadow-sm hover:border-slate-200 transition block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 text-navy flex-shrink-0">
              <MessageSquareDashed className="w-4 h-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-navy">Ask anonymously</p>
              <p className="text-xs text-slate-500">No name attached</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Prefer not to put your name to it? Raise any question or idea privately and we&rsquo;ll answer it for the whole team.
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy mt-3 group-hover:gap-2 transition-all">
            Open Anonymous Q&amp;A <ArrowRight className="w-4 h-4" aria-hidden />
          </span>
        </Link>
      </div>
    </section>
  )
}
