'use client'

import { useState } from 'react'
import { ChevronRight, RotateCcw, Wand2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// An interactive "which button do I press?" advisor for CRM 2.0. It turns the
// cheatsheet's disambiguation table into a two-step guided flow: pick the kind
// of decision, then the exact situation, and it surfaces the right action with
// the reasoning (and a "watch out" note where people trip up). All content is
// grounded in the Buttons & actions / cheatsheet lessons — nothing new here.

interface Situation {
  q: string            // the situation, in the operator's words
  action: string       // the button / action to take
  why: string          // the reasoning
  watch?: string       // a common trap to flag
}

interface Category {
  id: string
  label: string
  blurb: string
  situations: Situation[]
}

const CATEGORIES: Category[] = [
  {
    id: 'dates',
    label: 'Scheduling & dates',
    blurb: 'Booking, rescheduling and confirming visit times.',
    situations: [
      {
        q: 'Both sides have already agreed the appointment',
        action: 'Set Visit Date',
        why: 'It records a slot both parties have confirmed. It is not for passing on information — only for locking in an agreed time.',
      },
      {
        q: 'A party gives a relative time like “morning”',
        action: 'Set Visit Date — manually',
        why: 'The AI won’t accept a relative time as a confirmation. Set it yourself and treat “morning” as 8am–12pm rather than waiting for an exact time.',
      },
      {
        q: 'A new time is agreed (in the thread, or one side proposed it and you confirmed the other by phone)',
        action: 'Reset Visit Date',
        why: 'Both parties have effectively agreed the new time, so you’re updating an existing booking — it notifies both sides automatically.',
        watch: 'Only use this once the new time is actually agreed by both — otherwise Restart Scheduling.',
      },
      {
        q: 'No new time is agreed yet',
        action: 'Restart Scheduling',
        why: 'Kick the brokering off again — pick tenant or provider and write the opening message so the context carries over.',
      },
    ],
  },
  {
    id: 'approval',
    label: 'Landlord approval',
    blurb: 'Authorising the works at the start of a job.',
    situations: [
      {
        q: 'The landlord approves the works by phone',
        action: 'Landlord approved — directly',
        why: 'Use the approval button itself. Add Direct Info is for passing on information, not for recording an approval.',
        watch: 'Don’t route a phone approval through Add Direct Info.',
      },
      {
        q: 'The landlord asks for a price before proceeding',
        action: 'Send Communication (then approve)',
        why: 'Check the cheat sheet for the price, reply to the landlord with Send Communication, then click the appropriate approval button once they say yes.',
      },
      {
        q: 'A CP12 where it’s unclear if they want the boiler service',
        action: 'Ask again before proceeding',
        why: 'The “Add Boiler Service” option is easy to assume. If their response is unclear, confirm with the landlord rather than guessing.',
      },
    ],
  },
  {
    id: 'passing-info',
    label: 'Passing on information',
    blurb: 'Relaying something one party told you to the other.',
    situations: [
      {
        q: 'You’re passing on information you received from one party',
        action: 'Add Direct Info',
        why: 'Write it as the party you got it from and choose the right source (e.g. From Provider) — the agent then processes it as if it received the document itself.',
        watch: 'Write it as the sender, not as an internal note. “11th August 2026 at 2pm”, not “the engineer said 2pm”.',
      },
      {
        q: 'A document arrived out-of-band (e.g. via Slack)',
        action: 'Add Direct Info — with attachment',
        why: 'It now supports attachments, so there’s no need to Take Over just to upload a file. Pick the right source and let the agent process it.',
      },
      {
        q: 'A tenant reschedules by emailing us directly',
        action: 'Set Visit Date to the new slot',
        why: 'It arrives as an escalation. Just record the agreed new time — replying to the tenant won’t break the automated flow.',
      },
    ],
  },
  {
    id: 'certs',
    label: 'Certificates & remedials',
    blurb: 'Reviewing a cert and deciding the remedial path.',
    situations: [
      {
        q: 'You spot a problem with a cert (wrong date/address)',
        action: 'Invalid certificate',
        why: 'Flag it as invalid so the correct document is requested.',
      },
      {
        q: 'A new cert arrived that the agent didn’t recognise',
        action: 'Upload another certificate',
        why: 'Use this to add the cert the agent didn’t pick up, rather than marking the existing one invalid.',
      },
      {
        q: 'Faults that must be fixed for compliance',
        action: 'Need required remedial',
        why: 'This is the mandatory remedial branch — the works have to happen for the property to be compliant.',
      },
      {
        q: 'A satisfactory cert with C3 / optional items only',
        action: 'Optional remedial',
        why: 'The cert stands as satisfactory; the items are nice-to-have. Optional remedial runs the same branch as a required remedial (quote → landlord approval → repeat visit), but the passing cert is saved to file since the property is already compliant. Don’t redirect it into the required path.',
        watch: 'A satisfactory cert doesn’t become unsatisfactory just because one optional item was noted.',
      },
    ],
  },
  {
    id: 'odds',
    label: 'Odds & ends',
    blurb: 'Holds, closed jobs and the admin-only actions.',
    situations: [
      {
        q: 'A job is blocked by a block manager / other third party',
        action: 'Divert to Manual',
        why: 'Manual is the hold state — use it to sit the job outside the automated flow until the information arrives, rather than cancelling and re-creating it.',
      },
      {
        q: 'A provider is away longer than 3 days',
        action: 'Divert to Manual',
        why: '“Wait for response” caps at 3 days. If they’ll be longer than that, divert the job to Manual rather than repeatedly re-setting the wait.',
      },
      {
        q: 'A closed job gets a thank-you or unrelated email',
        action: 'Provide Instructions (“do nothing”)',
        why: 'The instruction is simply to do nothing so the agent doesn’t act on it.',
        watch: 'Provide Instructions is admin-only — consult an admin before using it.',
      },
    ],
  },
]

export default function ButtonAdvisor() {
  const [catId, setCatId] = useState<string | null>(null)
  const [sitIdx, setSitIdx] = useState<number | null>(null)

  const category = CATEGORIES.find((c) => c.id === catId) ?? null
  const situation = category && sitIdx !== null ? category.situations[sitIdx] : null

  function reset() {
    setCatId(null)
    setSitIdx(null)
  }

  return (
    <div className="rounded-2xl border border-[#E8E8ED] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-[#F5F5F7] border-b border-[#E8E8ED]">
        <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center flex-shrink-0">
          <Wand2 className="w-4 h-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#1D1D1F]">Which button? — advisor</p>
          <p className="text-xs text-[#6E6E73] mt-0.5">Answer two quick questions and I’ll point you to the right action.</p>
        </div>
        {(catId || sitIdx !== null) && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden /> Start over
          </button>
        )}
      </div>

      <div className="p-5">
        {/* Step 1 — pick a category */}
        {!category && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#AEAEB2] mb-3">What are you trying to do?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setCatId(c.id); setSitIdx(null) }}
                  className="text-left rounded-xl border border-[#E8E8ED] p-3.5 hover:border-[#0071E3]/40 hover:bg-[#F0F7FF] transition group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#1D1D1F]">{c.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#D2D2D7] group-hover:text-[#0071E3] transition flex-shrink-0" aria-hidden />
                  </div>
                  <p className="text-xs text-[#6E6E73] mt-1 leading-relaxed">{c.blurb}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 2 — pick the situation */}
        {category && !situation && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#AEAEB2] mb-3">{category.label} — which fits?</p>
            <div className="space-y-2.5">
              {category.situations.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSitIdx(i)}
                  className="w-full text-left rounded-xl border border-[#E8E8ED] p-3.5 hover:border-[#0071E3]/40 hover:bg-[#F0F7FF] transition group flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-[#1D1D1F] leading-relaxed">{s.q}</span>
                  <ChevronRight className="w-4 h-4 text-[#D2D2D7] group-hover:text-[#0071E3] transition flex-shrink-0" aria-hidden />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCatId(null)}
              className="mt-4 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition"
            >
              ← Different kind of decision
            </button>
          </>
        )}

        {/* Result */}
        {situation && (
          <div className="hub-fade">
            <p className="text-xs text-[#6E6E73] leading-relaxed">{situation.q}</p>
            <div className="mt-3 rounded-xl border border-[#B0EACC] bg-[#F0FFF4] p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden />
                <p className="text-sm font-bold text-[#1D1D1F]">{situation.action}</p>
              </div>
              <p className="text-sm text-[#3A3A3C] leading-relaxed mt-2">{situation.why}</p>
            </div>
            {situation.watch && (
              <div className="mt-2.5 rounded-xl border border-[#FFE4B0] bg-[#FFFBF0] p-3.5 flex gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden />
                <p className="text-sm text-[#3A3A3C] leading-relaxed"><span className="font-semibold">Watch out:</span> {situation.watch}</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSitIdx(null)}
              className="mt-4 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition"
            >
              ← Back to {category?.label.toLowerCase()}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
