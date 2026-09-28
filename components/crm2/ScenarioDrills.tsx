'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  MessageSquareText, ChevronRight, RotateCcw, CheckCircle2, XCircle, Trophy,
} from 'lucide-react'

// Branching roleplay drills for CRM 2.0. Each scenario is a short, realistic
// job situation broken into decision points. At each step the operator picks
// an action and gets immediate feedback (right or wrong, with the reasoning),
// then moves on. It tests judgement in context rather than recall — everything
// is grounded in the feature lessons and the worked example.

interface Choice {
  label: string
  correct: boolean
  feedback: string
}

interface Step {
  prompt: string
  choices: Choice[]
}

interface Scenario {
  id: string
  title: string
  intro: string
  steps: Step[]
}

const SCENARIOS: Scenario[] = [
  {
    id: 'cp12-remedial',
    title: 'A gas safety job with a twist',
    intro: 'A CP12 has been carried out and the certificate has just landed in your queue at Certificate review.',
    steps: [
      {
        prompt: 'The job is at Certificate review. What do you do first?',
        choices: [
          {
            label: 'Check the address, dates and numbers, and read the “Safe to use” column',
            correct: true,
            feedback: 'Right. Certificate review is your checkpoint — verify the cert is for this property, the issue/expiry dates are present, the totals add up, and read the per-appliance “Safe to use” column.',
          },
          {
            label: 'Assume it’s fine and close the job — the agent got the cert',
            correct: false,
            feedback: 'No. The agent chases the cert, but the review is a human checkpoint. Skipping it is how wrong-property or mis-dated certs slip through.',
          },
          {
            label: 'Take Over so you can call the engineer about it',
            correct: false,
            feedback: 'No need. There’s no new urgent info to process — just review the document in front of you.',
          },
        ],
      },
      {
        prompt: 'Every appliance reads “Safe to use: YES” except one — a missing flame supervision device on an old hob. Is the certificate satisfactory?',
        choices: [
          {
            label: 'Yes — satisfactory, with a recommended remedial alongside it',
            correct: true,
            feedback: 'Correct. A CP12 categorises each appliance rather than the whole cert. Every other item is YES, so the cert is satisfactory; the flagged hob is a remedial that rides alongside it.',
          },
          {
            label: 'No — the whole certificate is unsatisfactory',
            correct: false,
            feedback: 'Not quite. One flagged appliance doesn’t make the whole cert unsatisfactory when everything else is “Safe to use: YES”.',
          },
          {
            label: 'It’s invalid — send it back',
            correct: false,
            feedback: 'No. There’s nothing wrong with the document itself — it correctly records a real finding.',
          },
        ],
      },
      {
        prompt: 'You decide the remedial is worth doing and the landlord agrees to pay. What’s the order of the remedial branch?',
        choices: [
          {
            label: 'Quotation awaiting → Quotation review → Landlord quote approval → repeat visit',
            correct: true,
            feedback: 'Spot on. The agent gets a quote, you review it, the landlord approves the cost, then a repeat visit completes the works.',
          },
          {
            label: 'Landlord quote approval → repeat visit → Quotation review',
            correct: false,
            feedback: 'Out of order — you can’t approve a cost before there’s a quote to approve.',
          },
          {
            label: 'Straight to a repeat visit — skip the quote',
            correct: false,
            feedback: 'No. The contractor quotes first and the landlord approves the spend before any works go ahead.',
          },
        ],
      },
    ],
  },
  {
    id: 'scheduling-morning',
    title: 'Pinning down a vague time',
    intro: 'You’re brokering a visit. The provider has offered slots and you’re waiting on the tenant.',
    steps: [
      {
        prompt: 'The tenant replies: “mornings are best for me”. What do you do?',
        choices: [
          {
            label: 'Set Visit Date manually, treating “morning” as 8am–12pm',
            correct: true,
            feedback: 'Right. The AI won’t accept a relative time like “morning” as a confirmation, so set it yourself rather than waiting for an exact time.',
          },
          {
            label: 'Wait for the tenant to send an exact time',
            correct: false,
            feedback: 'That can stall the job. A relative time won’t be treated as a confirmation, so you’d be waiting on something the system can’t use.',
          },
          {
            label: 'Use Add Direct Info to pass “morning” to the provider',
            correct: false,
            feedback: 'Not here — the appointment effectively needs pinning down, which is a Set Visit Date job, not a passing-on-info one.',
          },
        ],
      },
      {
        prompt: 'The provider then sends the gas certificate to us over Slack, outside the normal email flow. How do you get it onto the job?',
        choices: [
          {
            label: 'Add Direct Info with the attachment, source “From Provider”',
            correct: true,
            feedback: 'Correct. Add Direct Info supports attachments — choose the right source and the agent processes it as if it received the document itself. No need to Take Over.',
          },
          {
            label: 'Take Over the job just to upload the file',
            correct: false,
            feedback: 'Unnecessary now. Add Direct Info handles attachments, so Take Over is overkill for a file upload.',
          },
          {
            label: 'Ignore it — only accept certs through email',
            correct: false,
            feedback: 'No. The document is valid; get it onto the job via Add Direct Info so the agent can proceed.',
          },
        ],
      },
    ],
  },
  {
    id: 'closed-job-email',
    title: 'The job that won’t stay shut',
    intro: 'A gas safety job closed cleanly last week. This morning a new email lands on it.',
    steps: [
      {
        prompt: 'The email is just the landlord saying “thanks, great service”. The agent wants to act on it. What’s the right call?',
        choices: [
          {
            label: 'Provide Instructions “do nothing” — but check with an admin first',
            correct: true,
            feedback: 'Right. The instruction is simply to do nothing so the agent doesn’t re-open activity. Provide Instructions is admin-only now, so consult an admin before using it.',
          },
          {
            label: 'Provide Instructions “do nothing” yourself, straight away',
            correct: false,
            feedback: 'Close — “do nothing” is the correct instruction, but Provide Instructions is admin-only. You’ll be asked to contact an admin.',
          },
          {
            label: 'Reopen the job and reply to the landlord',
            correct: false,
            feedback: 'No — there’s no action needed. Reopening just creates noise on a finished job.',
          },
        ],
      },
    ],
  },
]

export default function ScenarioDrills() {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  function start(s: Scenario) {
    setScenario(s)
    setStepIdx(0)
    setPicked(null)
    setCorrectCount(0)
  }

  function reset() {
    setScenario(null)
    setStepIdx(0)
    setPicked(null)
    setCorrectCount(0)
  }

  const step = scenario?.steps[stepIdx]
  const answered = picked !== null
  const isLast = scenario ? stepIdx === scenario.steps.length - 1 : false
  const finished = scenario && stepIdx >= scenario.steps.length

  function choose(i: number) {
    if (answered || !step) return
    setPicked(i)
    if (step.choices[i].correct) setCorrectCount((c) => c + 1)
  }

  function next() {
    setPicked(null)
    setStepIdx((i) => i + 1)
  }

  return (
    <div className="rounded-2xl border border-[#E8E8ED] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-[#F5F5F7] border-b border-[#E8E8ED]">
        <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center flex-shrink-0">
          <MessageSquareText className="w-4 h-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#1D1D1F]">Scenario drills</p>
          <p className="text-xs text-[#6E6E73] mt-0.5">Work a real job decision-by-decision and get instant feedback.</p>
        </div>
        {scenario && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden /> Pick another
          </button>
        )}
      </div>

      <div className="p-5">
        {/* Scenario picker */}
        {!scenario && (
          <div className="space-y-2.5">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => start(s)}
                className="w-full text-left rounded-xl border border-[#E8E8ED] p-3.5 hover:border-[#0071E3]/40 hover:bg-[#F0F7FF] transition group"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-[#1D1D1F]">{s.title}</span>
                  <ChevronRight className="w-4 h-4 text-[#D2D2D7] group-hover:text-[#0071E3] transition flex-shrink-0" aria-hidden />
                </div>
                <p className="text-xs text-[#6E6E73] mt-1 leading-relaxed">{s.intro}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#AEAEB2] mt-2">
                  {s.steps.length} {s.steps.length === 1 ? 'decision' : 'decisions'}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Active step */}
        {scenario && step && !finished && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#AEAEB2]">
                {scenario.title} · decision {stepIdx + 1} of {scenario.steps.length}
              </p>
            </div>
            {stepIdx === 0 && (
              <p className="text-sm text-[#6E6E73] leading-relaxed mb-3 italic">{scenario.intro}</p>
            )}
            <p className="text-sm font-semibold text-[#1D1D1F] leading-relaxed">{step.prompt}</p>

            <div className="mt-3 space-y-2.5">
              {step.choices.map((c, i) => {
                const isPicked = picked === i
                const showState = answered && (isPicked || c.correct)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => choose(i)}
                    disabled={answered}
                    className={cn(
                      'w-full text-left rounded-xl border p-3.5 transition flex items-start gap-3',
                      !answered && 'border-[#E8E8ED] hover:border-[#0071E3]/40 hover:bg-[#F0F7FF]',
                      showState && c.correct && 'border-[#B0EACC] bg-[#F0FFF4]',
                      answered && isPicked && !c.correct && 'border-red-200 bg-red-50',
                      answered && !isPicked && !c.correct && 'border-[#E8E8ED] opacity-60',
                    )}
                  >
                    {answered && c.correct && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" aria-hidden />}
                    {answered && isPicked && !c.correct && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden />}
                    <span className="text-sm text-[#1D1D1F] leading-relaxed">{c.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {answered && picked !== null && (
              <div className={cn(
                'mt-3 rounded-xl border p-3.5 text-sm leading-relaxed hub-fade',
                step.choices[picked].correct
                  ? 'border-[#B0EACC] bg-[#F0FFF4] text-[#3A3A3C]'
                  : 'border-[#FFE4B0] bg-[#FFFBF0] text-[#3A3A3C]',
              )}>
                {step.choices[picked].feedback}
              </div>
            )}

            {/* Continue */}
            {answered && (
              <button
                type="button"
                onClick={next}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0071E3] hover:gap-2.5 transition-all"
              >
                {isLast ? 'See how you did' : 'Next decision'} <ChevronRight className="w-4 h-4" aria-hidden />
              </button>
            )}
          </div>
        )}

        {/* Summary */}
        {scenario && finished && (
          <div className="text-center py-4 hub-fade">
            <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7" aria-hidden />
            </div>
            <p className="text-lg font-bold text-[#1D1D1F] mt-3">
              {correctCount} of {scenario.steps.length} right
            </p>
            <p className="text-sm text-[#6E6E73] mt-1">
              {correctCount === scenario.steps.length
                ? 'Nailed it — that’s exactly how the job should run.'
                : 'Good effort — revisit the feedback and try it again.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => start(scenario)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl border border-[#E8E8ED] bg-white text-[#1D1D1F] hover:border-[#1D1D1F]/30 transition"
              >
                <RotateCcw className="w-4 h-4" aria-hidden /> Try again
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-[#0071E3] text-white hover:bg-[#0077ED] transition"
              >
                Another scenario <ChevronRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
