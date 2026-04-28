'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowRight, ArrowLeft, CheckCircle2, Brain,
  BookOpen, Zap, MessageSquare, Target, Shield,
  TrendingUp, Star, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Questions ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    question: 'How do you prefer to take in new information?',
    options: [
      { value: 'A', label: 'Reading written guides or documentation' },
      { value: 'B', label: 'Watching demonstrations or videos' },
      { value: 'C', label: 'Hands-on practice and trying things myself' },
      { value: 'D', label: 'Listening and discussing with others' },
    ],
  },
  {
    id: 2,
    question: 'When learning something new, what helps you most?',
    options: [
      { value: 'A', label: 'A clear structure with step-by-step instructions' },
      { value: 'B', label: 'Understanding the "why" behind what I\'m doing' },
      { value: 'C', label: 'Seeing real examples and case studies' },
      { value: 'D', label: 'Being able to ask questions as I go' },
    ],
  },
  {
    id: 3,
    question: 'How do you prefer to be assessed on new knowledge?',
    options: [
      { value: 'A', label: 'Written quiz or test' },
      { value: 'B', label: 'Practical scenario or role play' },
      { value: 'C', label: 'Verbal discussion with a manager or trainer' },
      { value: 'D', label: 'Observed doing the task in a real situation' },
    ],
  },
  {
    id: 4,
    question: 'How confident do you feel in the property management sector right now?',
    options: [
      { value: 'A', label: 'Not confident at all — completely new to me' },
      { value: 'B', label: 'I have some awareness but limited experience' },
      { value: 'C', label: 'Fairly confident — I\'ve done similar things before' },
      { value: 'D', label: 'Very confident — I just need a refresher' },
    ],
  },
  {
    id: 5,
    question: 'What tends to get in the way of your learning?',
    options: [
      { value: 'A', label: 'Information overload — too much at once' },
      { value: 'B', label: 'Not enough time to practise what I\'ve learned' },
      { value: 'C', label: 'Unclear expectations of what I need to know' },
      { value: 'D', label: 'Lack of follow-up or support after training' },
    ],
  },
  {
    id: 6,
    question: 'How do you best retain information after training?',
    options: [
      { value: 'A', label: 'Re-reading my notes shortly after' },
      { value: 'B', label: 'Putting it into practice straight away' },
      { value: 'C', label: 'Talking it through with a colleague' },
      { value: 'D', label: 'Quick follow-up quizzes or reminders' },
    ],
  },
  {
    id: 7,
    question: 'What motivates you most in a training session?',
    options: [
      { value: 'A', label: 'Knowing exactly how it links to my day-to-day role' },
      { value: 'B', label: 'Interactive elements rather than just being talked at' },
      { value: 'C', label: 'Learning from others\' experiences and mistakes' },
      { value: 'D', label: 'Clear goals and outcomes from the start' },
    ],
  },
  {
    id: 8,
    question: 'How do you prefer to receive feedback during training?',
    options: [
      { value: 'A', label: 'Written feedback I can refer back to' },
      { value: 'B', label: 'Immediate verbal feedback in the moment' },
      { value: 'C', label: 'A debrief conversation at the end' },
      { value: 'D', label: 'A mix of all of the above' },
    ],
  },
]

// ─── Profile generation ───────────────────────────────────────────────────────

interface LearningProfile {
  styleLabel: string
  styleIcon: string
  styleDescription: string
  recommendedStart: string
  confidenceLabel: string
  confidencePct: number
  confidenceColor: string
  barrier: string
  retention: string
  assessmentPreference: string
  motivationTip: string
  feedbackNote: string
  managerNote: string
}

function generateProfile(answers: Record<number, string>): LearningProfile {
  const styleMap: Record<string, { label: string; icon: string; description: string; start: string }> = {
    A: {
      label: 'Reading & Documentation',
      icon: '📖',
      description: 'You absorb information best through well-structured written content.',
      start: 'Begin with the written Training Guides for each section before moving to video modules.',
    },
    B: {
      label: 'Visual & Demonstration',
      icon: '🎥',
      description: 'You learn most effectively by watching processes demonstrated in real time.',
      start: 'Prioritise the video modules first, then reinforce with the written training guides.',
    },
    C: {
      label: 'Hands-on Practice',
      icon: '🛠️',
      description: 'You cement learning by doing — practical application is where things click for you.',
      start: 'Get into the Dwelly system as soon as possible after each module to practise what you\'ve learned.',
    },
    D: {
      label: 'Discussion & Collaboration',
      icon: '💬',
      description: 'You learn through conversation, questions, and shared experiences.',
      start: 'Work through modules alongside a colleague, or arrange a debrief call with your manager after each section.',
    },
  }

  const confidenceMap: Record<string, { label: string; pct: number; color: string }> = {
    A: { label: 'Beginner',        pct: 10, color: 'text-red-600' },
    B: { label: 'Some Awareness',  pct: 35, color: 'text-orange' },
    C: { label: 'Fairly Confident', pct: 72, color: 'text-teal' },
    D: { label: 'Refresher Needed', pct: 88, color: 'text-navy' },
  }

  const barrierMap: Record<string, string> = {
    A: 'Take modules one at a time. Don\'t rush ahead — let each section settle before moving on.',
    B: 'Build in dedicated practice time after each module before progressing to the next.',
    C: 'Check the module objectives before you start each session so you know exactly what you\'re aiming for.',
    D: 'Flag any gaps to your manager after each module so follow-up support can be arranged promptly.',
  }

  const retentionMap: Record<string, string> = {
    A: 'Revisit the training guide notes shortly after each module while the content is fresh.',
    B: 'Apply each new skill in Dwelly immediately after completing the module — don\'t wait.',
    C: 'Talk through what you\'ve covered with a colleague after each session to consolidate understanding.',
    D: 'Use the built-in spaced repetition quizzes — they are designed specifically for how you retain information.',
  }

  const assessmentMap: Record<string, string> = {
    A: 'Written module assessments',
    B: 'Practical scenario exercises',
    C: 'Verbal debrief with your manager',
    D: 'Observed practice on live tasks',
  }

  const motivationMap: Record<string, string> = {
    A: 'Each module introduction explains exactly how the content connects to your role — read this section first.',
    B: 'Engage actively with quizzes and scenario questions rather than just reading through passively.',
    C: 'Pay particular attention to the scenario examples — they draw on real situations you\'ll encounter.',
    D: 'Review the module objectives before starting each session to set a clear goal for the session.',
  }

  const feedbackMap: Record<string, string> = {
    A: 'Your assessment results and rationale feedback are saved within each module for you to revisit.',
    B: 'The quiz interface gives you immediate feedback with rationale after each answer.',
    C: 'After completing a section, arrange a brief debrief conversation with your manager.',
    D: 'You\'ll benefit from all feedback channels — written results, in-quiz feedback, and manager debriefs.',
  }

  const managerNoteMap: Record<string, string> = {
    A: 'This learner prefers structure. Ensure step-by-step guides are available and allow reading time during training sessions.',
    B: 'This learner is visual. Supplement portal modules with live system demonstrations where possible.',
    C: 'This learner is hands-on. Build in supervised practical time on Dwelly early in the programme.',
    D: 'This learner is collaborative. Schedule regular debrief touchpoints and pair them with a buddy if possible.',
  }

  const q1 = answers[1] ?? 'A'
  const q3 = answers[3] ?? 'A'
  const q4 = answers[4] ?? 'A'
  const q5 = answers[5] ?? 'A'
  const q6 = answers[6] ?? 'A'
  const q7 = answers[7] ?? 'A'
  const q8 = answers[8] ?? 'A'

  const style = styleMap[q1]
  const confidence = confidenceMap[q4]

  return {
    styleLabel: style.label,
    styleIcon: style.icon,
    styleDescription: style.description,
    recommendedStart: style.start,
    confidenceLabel: confidence.label,
    confidencePct: confidence.pct,
    confidenceColor: confidence.color,
    barrier: barrierMap[q5],
    retention: retentionMap[q6],
    assessmentPreference: assessmentMap[q3],
    motivationTip: motivationMap[q7],
    feedbackNote: feedbackMap[q8],
    managerNote: managerNoteMap[q1],
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PreTrainingPage() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  const question = QUESTIONS[current]
  const totalQ = QUESTIONS.length
  const progress = (current / totalQ) * 100

  function handleSelect(value: string) {
    setSelected(value)
  }

  function handleNext() {
    if (!selected) return
    const newAnswers = { ...answers, [question.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    if (current < totalQ - 1) {
      setCurrent(c => c + 1)
    } else {
      setStep('result')
    }
  }

  function handleBack() {
    if (current === 0) {
      setStep('intro')
      setSelected(null)
    } else {
      const prev = current - 1
      setCurrent(prev)
      setSelected(answers[QUESTIONS[prev].id] ?? null)
    }
  }

  const profile = step === 'result' ? generateProfile(answers) : null

  // Save to Supabase when results are shown
  useEffect(() => {
    if (step !== 'result' || !profile) return
    async function save() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('learning_profiles').upsert({
        user_id: user.id,
        answers,
        style_label: profile!.styleLabel,
        style_icon: profile!.styleIcon,
        confidence_label: profile!.confidenceLabel,
        confidence_pct: profile!.confidencePct,
        manager_note: profile!.managerNote,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    }
    save()
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Intro ──
  if (step === 'intro') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0071E3]/10 flex items-center justify-center mx-auto mb-5">
            <Brain className="w-7 h-7 text-[#0071E3]" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold text-[#1D1D1F] mb-2">Learning Style Assessment</h1>
          <p className="text-[#6E6E73] text-sm leading-relaxed max-w-md mx-auto mb-6">
            Before you start the full training programme, answer 8 short questions about how you
            prefer to learn. Your answers shape how we recommend you work through the modules —
            and give your manager useful context to support you effectively.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { icon: '⏱️', label: '3–4 minutes', sub: 'to complete' },
              { icon: '🎯', label: '8 questions', sub: 'multiple choice' },
              { icon: '✨', label: 'Your profile', sub: 'generated instantly' },
            ].map(item => (
              <div key={item.label} className="rounded-2xl bg-[#F5F5F7] p-4">
                <p className="text-2xl mb-1">{item.icon}</p>
                <p className="text-sm font-semibold text-[#1D1D1F]">{item.label}</p>
                <p className="text-xs text-[#6E6E73]">{item.sub}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('quiz')}
            className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
          >
            Start Assessment
            <ArrowRight className="w-4 h-4" aria-hidden />
          </button>

          <p className="text-xs text-[#AEAEB2] mt-4">
            There are no right or wrong answers. Be honest — it helps us tailor your experience.
          </p>
        </div>

        {/* Where this fits */}
        <div className="card p-5">
          <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-3">Recommended learning order</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: '1. Training Guides', done: true },
              { label: '2. This Assessment', active: true },
              { label: '3. Video Modules' },
              { label: '4. Assessments' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border',
                  item.done   && 'bg-teal/10 text-teal border-teal/20',
                  item.active && 'bg-[#0071E3]/10 text-[#0071E3] border-[#0071E3]/20',
                  !item.done && !item.active && 'bg-[#F5F5F7] text-[#6E6E73] border-[#E8E8ED]',
                )}>
                  {item.done && <CheckCircle2 className="w-3 h-3" aria-hidden />}
                  {item.label}
                </div>
                {i < 3 && <ChevronRight className="w-3 h-3 text-[#AEAEB2]" aria-hidden />}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Quiz ──
  if (step === 'quiz') {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Progress header */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-[#6E6E73] mb-0.5">Learning Style Assessment</p>
              <p className="text-sm font-bold text-[#1D1D1F]">Question {current + 1} of {totalQ}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[#1D1D1F] tabular-nums">
                {Math.round(((current + (selected ? 1 : 0)) / totalQ) * 100)}%
              </p>
              <p className="text-xs text-[#6E6E73]">complete</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-[#E8E8ED] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0071E3] rounded-full transition-all duration-500"
              style={{ width: `${progress + (selected ? (1 / totalQ) * 100 : 0)}%` }}
              aria-hidden
            />
          </div>
          {/* Dots */}
          <div className="flex items-center gap-1 mt-2.5">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 h-1 rounded-full transition-all duration-300',
                  i < current  ? 'bg-[#0071E3]' :
                  i === current ? 'bg-[#0071E3]/40' :
                  'bg-[#E8E8ED]',
                )}
                aria-hidden
              />
            ))}
          </div>
        </div>

        {/* Question card */}
        <div className="card p-6">
          <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest mb-3">
            Question {current + 1}
          </p>
          <h2 className="text-lg font-bold text-[#1D1D1F] leading-snug mb-6">
            {question.question}
          </h2>

          <div className="space-y-2.5" role="group" aria-label="Answer options">
            {question.options.map((opt) => {
              const isSelected = selected === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'w-full flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20',
                    isSelected
                      ? 'bg-[#0071E3]/8 border-[#0071E3] shadow-sm'
                      : 'bg-white border-[#E8E8ED] hover:border-[#0071E3]/40 hover:bg-[#F5F5F7]',
                  )}
                  aria-pressed={isSelected}
                >
                  {/* Letter badge */}
                  <div className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    'text-sm font-bold transition-all duration-150',
                    isSelected
                      ? 'border-[#0071E3] bg-[#0071E3] text-white'
                      : 'border-[#D1D1D6] text-[#6E6E73]',
                  )}>
                    {isSelected ? <CheckCircle2 className="w-4 h-4" /> : opt.value}
                  </div>
                  <span className={cn(
                    'text-sm leading-snug flex-1 transition-colors',
                    isSelected ? 'text-[#1D1D1F] font-medium' : 'text-[#3A3A3C]',
                  )}>
                    {opt.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="btn-secondary flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            {current === 0 ? 'Back to intro' : 'Previous'}
          </button>

          <button
            onClick={handleNext}
            disabled={!selected}
            className={cn(
              'btn-primary flex items-center gap-2',
              !selected && 'opacity-40 cursor-not-allowed',
            )}
            aria-disabled={!selected}
          >
            {current < totalQ - 1 ? (
              <><span>Next Question</span><ArrowRight className="w-4 h-4" /></>
            ) : (
              <><span>See My Profile</span><Star className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    )
  }

  // ── Results ──
  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Hero result card */}
      <div className="card p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/10 flex items-center justify-center flex-shrink-0 text-2xl">
            {profile.styleIcon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#0071E3] uppercase tracking-wide mb-1">Your Learning Profile</p>
            <h2 className="text-xl font-bold text-[#1D1D1F] leading-tight">{profile.styleLabel}</h2>
            <p className="text-sm text-[#6E6E73] mt-1 leading-relaxed">{profile.styleDescription}</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="bg-[#F5F5F7] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[#3A3A3C]">Starting confidence level</p>
            <span className={cn('text-sm font-bold', profile.confidenceColor)}>
              {profile.confidenceLabel}
            </span>
          </div>
          <div className="h-2 bg-[#E8E8ED] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0071E3] rounded-full transition-all duration-700"
              style={{ width: `${profile.confidencePct}%` }}
            />
          </div>
          <p className="text-[11px] text-[#AEAEB2] mt-1.5">
            This will be tracked throughout your programme.
          </p>
        </div>

        {/* Where to start */}
        <div className="rounded-2xl bg-[#0071E3]/6 border border-[#0071E3]/15 p-4">
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-[#0071E3] flex-shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="text-xs font-bold text-[#0071E3] mb-1">Recommended starting point</p>
              <p className="text-sm text-[#3A3A3C] leading-relaxed">{profile.recommendedStart}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile detail cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-[#6E6E73]" aria-hidden />
            <p className="text-xs font-semibold text-[#3A3A3C] uppercase tracking-wide">Watch out for</p>
          </div>
          <p className="text-sm text-[#3A3A3C] leading-relaxed">{profile.barrier}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#6E6E73]" aria-hidden />
            <p className="text-xs font-semibold text-[#3A3A3C] uppercase tracking-wide">Best retention method</p>
          </div>
          <p className="text-sm text-[#3A3A3C] leading-relaxed">{profile.retention}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#6E6E73]" aria-hidden />
            <p className="text-xs font-semibold text-[#3A3A3C] uppercase tracking-wide">Assessment preference</p>
          </div>
          <p className="text-sm text-[#3A3A3C] leading-relaxed">{profile.assessmentPreference}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-[#6E6E73]" aria-hidden />
            <p className="text-xs font-semibold text-[#3A3A3C] uppercase tracking-wide">What motivates you</p>
          </div>
          <p className="text-sm text-[#3A3A3C] leading-relaxed">{profile.motivationTip}</p>
        </div>

        <div className="card p-5 sm:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-[#6E6E73]" aria-hidden />
            <p className="text-xs font-semibold text-[#3A3A3C] uppercase tracking-wide">Feedback style</p>
          </div>
          <p className="text-sm text-[#3A3A3C] leading-relaxed">{profile.feedbackNote}</p>
        </div>
      </div>

      {/* Manager note */}
      <div className="rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] p-5">
        <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wide mb-1.5">Note for your manager</p>
        <p className="text-sm text-[#3A3A3C] leading-relaxed">{profile.managerNote}</p>
        <p className="text-xs text-[#AEAEB2] mt-2">
          This profile is visible on the Manager Dashboard alongside your module progress.
        </p>
      </div>

      {/* CTA */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#1D1D1F]">Ready to start your modules</p>
          <p className="text-xs text-[#6E6E73] mt-0.5">Your learning profile has been saved. Head to Video Modules to begin.</p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => { setStep('intro'); setCurrent(0); setAnswers({}); setSelected(null) }}
            className="btn-secondary text-sm"
          >
            Retake
          </button>
          <Link href="/modules" className="btn-primary flex items-center gap-2 text-sm">
            Go to Modules
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}
