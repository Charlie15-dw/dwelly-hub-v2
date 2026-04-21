'use client'

import { Clock, Target, BookOpen, Flame, TrendingUp, Award, BarChart3 } from 'lucide-react'
import SkillsRadar from '@/components/ui/SkillsRadar'
import LearningStreak from '@/components/ui/LearningStreak'
import StatCard from '@/components/ui/StatCard'

// ── Data ─────────────────────────────────────────────────────────────────────

const RADAR_SCORES = [
  { label: 'Maintenance',    value: 85, max: 100 },
  { label: 'Compliance',     value: 45, max: 100 },
  { label: 'Inspections',    value: 30, max: 100 },
  { label: 'Move-Outs',      value: 20, max: 100 },
  { label: 'Support',        value: 25, max: 100 },
  { label: 'Knowledge',      value: 65, max: 100 },
  { label: 'Communication',  value: 70, max: 100 },
]

const ASSESSMENT_HISTORY = [
  { id: 'mnt-01', label: 'MNT-01: Maintenance Basics',   score: 90 },
  { id: 'mnt-02', label: 'MNT-02: Property Inspections', score: 72 },
  { id: 'cmp-02', label: 'CMP-02: Compliance Essentials',score: 78 },
  { id: 'ins-02', label: 'INS-02: Property Inspections', score: 30 },
  { id: 'sup-02', label: 'SUP-02: Tenant Support',       score: 65 },
]

const STRENGTHS = [
  'Maintenance scheduling and contractor coordination',
  'Clear written communication with tenants',
  'General property knowledge and terminology',
]

const DEVELOPMENT_AREAS = [
  'Property inspections — low assessment scores indicate gaps',
  'Move-out process and deposit adjudication procedures',
  'Compliance checks and record-keeping procedures',
]

const RECOMMENDATIONS = [
  { text: 'Revisit the Inspections module — your score of 30% suggests the process needs reinforcement.', icon: '⚠' },
  { text: 'Complete CMP-03: Deposit Adjudication to strengthen your Move-Out understanding.', icon: '📋' },
  { text: 'Review the Compliance section in the Knowledge Base to strengthen your record-keeping procedures.', icon: '✓' },
]

// ── Score colour helper ───────────────────────────────────────────────────────

function scoreColour(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 65) return 'bg-orange'
  return 'bg-amber-400'
}

function scoreTextColour(score: number): string {
  if (score >= 80) return 'text-green-700'
  if (score >= 65) return 'text-orange'
  return 'text-amber-600'
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-12">

      {/* Hero */}
      <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
              Personal
            </p>
            <h1 className="text-3xl font-bold text-navy tracking-tight">My Analytics</h1>
            <p className="text-slate-500 mt-1 text-sm leading-relaxed">
              Track your learning journey and identify areas for development.
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Learning Time"
          value="12.5 hrs"
          icon={<Clock className="w-5 h-5" />}
          accent="orange"
          trend={{ value: '+1.5 hrs this week', positive: true }}
        />
        <StatCard
          label="Assessment Average"
          value="76%"
          icon={<Target className="w-5 h-5" />}
          accent="teal"
          sub="Passing threshold: 80%"
        />
        <StatCard
          label="Modules Completed"
          value="4 / 19"
          icon={<BookOpen className="w-5 h-5" />}
          accent="gold"
          trend={{ value: '1 completed this week', positive: true }}
        />
        <StatCard
          label="Current Streak"
          value="5 days"
          icon={<Flame className="w-5 h-5" />}
          accent="navy"
          sub="Personal best: 7 days"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column — spans 2 */}
        <div className="lg:col-span-2 space-y-6">

          {/* Skills Radar */}
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <h2 className="text-sm font-bold text-navy">Skills Overview</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Competency across all training areas based on assessment performance.
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-orange/20 border border-orange/40" />
                <span className="text-[11px] text-slate-400">Your score</span>
              </div>
            </div>
            <SkillsRadar scores={RADAR_SCORES} />
          </div>

          {/* Assessment Score History */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-orange" aria-hidden />
              <h2 className="text-sm font-bold text-navy">Assessment Score History</h2>
            </div>
            <p className="text-xs text-slate-500 mb-5">Last 5 completed assessments</p>

            <div className="space-y-4">
              {ASSESSMENT_HISTORY.map(({ id, label, score }) => (
                <div key={id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-navy truncate max-w-[75%]">{label}</span>
                    <span className={`text-xs font-bold tabular-nums ${scoreTextColour(score)}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${scoreColour(score)}`}
                      style={{ width: `${score}%` }}
                      role="progressbar"
                      aria-valuenow={score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${label}: ${score}%`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[11px] text-slate-500">80%+ Pass</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange" />
                <span className="text-[11px] text-slate-500">65–79% Near pass</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-[11px] text-slate-500">Below 65%</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-orange" aria-hidden />
              <h2 className="text-sm font-bold text-navy">Recommendations</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Based on your assessment scores, here are suggested focus areas.
            </p>
            <ul className="space-y-3">
              {RECOMMENDATIONS.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-orange/5 border border-orange/15">
                  <span className="flex-shrink-0 text-base leading-none mt-0.5" aria-hidden>{rec.icon}</span>
                  <p className="text-sm text-slate-600 leading-relaxed">{rec.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Learning Streak */}
          <LearningStreak
            currentStreak={5}
            lastSevenDays={[true, true, false, true, true, true, true]}
          />

          {/* Strengths & Development Areas */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-navy mb-4">Strengths & Development</h2>

            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Strengths
              </p>
              <ul className="space-y-2">
                {STRENGTHS.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" aria-hidden />
                    <span className="text-xs text-slate-600 leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Development Areas
              </p>
              <ul className="space-y-2">
                {DEVELOPMENT_AREAS.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" aria-hidden />
                    <span className="text-xs text-slate-600 leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Team Comparison */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-navy mb-1">Team Comparison</h2>
            <p className="text-xs text-slate-500 mb-5">How you rank within your team cohort</p>

            <div className="text-center mb-5">
              <p className="text-3xl font-black text-navy tabular-nums">Top 40%</p>
              <p className="text-xs text-slate-500 mt-1">of your team this month</p>
            </div>

            {/* Percentile bar */}
            <div className="relative mb-3">
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange/40 to-orange transition-all duration-700"
                  style={{ width: '60%' }}
                  role="progressbar"
                  aria-valuenow={60}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="You are in the top 40% of your team"
                />
              </div>
              {/* Marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange border-2 border-white shadow-sm"
                style={{ left: '60%' }}
                aria-hidden
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-4">
              <span>Top 1%</span>
              <span>Avg</span>
              <span>Bottom</span>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Completion rate',   value: '21%', note: '+5% above team avg' },
                { label: 'Avg assessment',    value: '76%', note: '-4% below team avg' },
                { label: 'Streak consistency',value: '71%', note: '+8% above team avg' },
              ].map(({ label, value, note }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-navy">{label}</p>
                    <p className="text-[11px] text-slate-400">{note}</p>
                  </div>
                  <span className="text-sm font-bold text-navy tabular-nums">{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
