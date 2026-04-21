import Link from 'next/link'
import {
  Users, TrendingUp, AlertTriangle, CheckCircle2,
  Clock, ChevronRight, Bell, BarChart3, Download,
} from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import StatCard from '@/components/ui/StatCard'
import AssessmentUnlockPanel from '@/components/ui/AssessmentUnlockPanel'
import { TEAM_MEMBERS, ROLE_LABELS, PHASES } from '@/lib/data'
import { cn, formatDate, getRAGLabel } from '@/lib/utils'

const ragCounts = {
  green: TEAM_MEMBERS.filter(m => m.ragStatus === 'green').length,
  amber: TEAM_MEMBERS.filter(m => m.ragStatus === 'amber').length,
  red:   TEAM_MEMBERS.filter(m => m.ragStatus === 'red').length,
}

const avgScore = Math.round(
  TEAM_MEMBERS.reduce((s, m) => s + m.assessmentScore, 0) / TEAM_MEMBERS.length
)
const avgProgress = Math.round(
  TEAM_MEMBERS.reduce((s, m) => s + m.overallProgress, 0) / TEAM_MEMBERS.length
)

const RAG_DOT: Record<string, string> = {
  red:   'bg-red-500',
  amber: 'bg-amber-400',
  green: 'bg-green-500',
}

const RAG_ROW: Record<string, string> = {
  red:   'border-red-200 bg-red-50/40',
  amber: 'border-amber-200 bg-amber-50/40',
  green: 'border-teal/20 bg-teal/3',
}

export default function ManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy">Manager Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Team progress — 2026–2027 Training Programme</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline text-xs flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" aria-hidden /> Export Report
          </button>
          <button className="btn-primary text-xs flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" aria-hidden /> Send Reminders
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Team Members Active"
          value={TEAM_MEMBERS.length}
          sub="Current programme cohort"
          icon={<Users className="w-5 h-5" />}
          accent="navy"
        />
        <StatCard
          label="Avg Progress"
          value={`${avgProgress}%`}
          sub="Across all pathways"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="teal"
          trend={{ value: '+8% this month', positive: true }}
        />
        <StatCard
          label="Avg Assessment Score"
          value={`${avgScore}%`}
          sub="Pass threshold: 80%"
          icon={<BarChart3 className="w-5 h-5" />}
          accent="orange"
        />
        <StatCard
          label="Needing Attention"
          value={ragCounts.red}
          sub={`${ragCounts.amber} in progress, ${ragCounts.green} on track`}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent="gold"
          trend={{ value: '1 new this week', positive: false }}
        />
      </div>

      {/* RAG summary */}
      <div className="grid grid-cols-3 gap-4">
        {(['green', 'amber', 'red'] as const).map(status => (
          <div key={status} className={cn('card p-5 border-l-4', {
            'border-l-green-500': status === 'green',
            'border-l-amber-400': status === 'amber',
            'border-l-red-500':   status === 'red',
          })}>
            <div className="flex items-center gap-2 mb-1">
              <div className={cn('w-3 h-3 rounded-full', RAG_DOT[status])} aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {getRAGLabel(status)}
              </span>
            </div>
            <p className="text-3xl font-black text-navy tabular-nums">{ragCounts[status]}</p>
            <p className="text-xs text-slate-400 mt-0.5">team members</p>
          </div>
        ))}
      </div>

      {/* Team table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy">Team Progress</h2>
          <span className="text-xs text-slate-400">{TEAM_MEMBERS.length} members</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {['Team Member', 'Role', 'Phase', 'Progress', 'Score', 'CPD Hours', 'Status', 'Last Active', ''].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap"
                    scope="col"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TEAM_MEMBERS.sort((a, b) => {
                const order = { red: 0, amber: 1, green: 2 }
                return order[a.ragStatus] - order[b.ragStatus]
              }).map(member => (
                <tr key={member.id} className={cn('transition-colors hover:bg-slate-50/60', RAG_ROW[member.ragStatus])}>
                  {/* Name */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">{member.name}</p>
                        <p className="text-[11px] text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-slate-600">{ROLE_LABELS[member.role]}</span>
                  </td>

                  {/* Phase */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full capitalize', {
                      'bg-teal/10 text-teal border border-teal/20':         member.phase === 'foundation',
                      'bg-orange/10 text-orange border border-orange/20':   member.phase === 'onboarding',
                      'bg-gold/20 text-yellow-700 border border-gold/30':   member.phase === 'embedding',
                      'bg-navy/10 text-navy border border-navy/20':         member.phase === 'optimise',
                    })}>
                      {member.phase}
                    </span>
                  </td>

                  {/* Progress */}
                  <td className="px-4 py-3">
                    <div className="w-24">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">{member.modulesCompleted}/{member.modulesTotal}</span>
                        <span className="font-semibold text-navy">{member.overallProgress}%</span>
                      </div>
                      <ProgressBar value={member.overallProgress} size="sm" color={
                        member.overallProgress >= 60 ? 'teal' : member.overallProgress >= 30 ? 'gold' : 'red'
                      } />
                    </div>
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={cn('text-sm font-bold tabular-nums', {
                      'text-teal':   member.assessmentScore >= 80,
                      'text-amber-500': member.assessmentScore >= 65 && member.assessmentScore < 80,
                      'text-red-500': member.assessmentScore < 65,
                    })}>
                      {member.assessmentScore}%
                    </span>
                  </td>

                  {/* CPD */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-slate-600 tabular-nums">{member.cpdHours}h</span>
                    <span className="text-slate-300 mx-1">/</span>
                    <span className="text-xs text-slate-400">{member.cpdTarget}h</span>
                  </td>

                  {/* RAG */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className={cn('w-2 h-2 rounded-full flex-shrink-0', RAG_DOT[member.ragStatus])} aria-hidden />
                      <span className={cn('text-xs font-semibold', {
                        'text-green-700': member.ragStatus === 'green',
                        'text-amber-700': member.ragStatus === 'amber',
                        'text-red-700':   member.ragStatus === 'red',
                      })}>
                        {getRAGLabel(member.ragStatus)}
                      </span>
                    </div>
                  </td>

                  {/* Last active */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-slate-400">{formatDate(member.lastActive)}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <button
                        className="text-[11px] text-teal hover:text-teal-700 font-medium px-2 py-1 rounded hover:bg-teal/10 transition-colors focus:outline-none focus:ring-2 focus:ring-teal/30"
                        aria-label={`View ${member.name}'s profile`}
                      >
                        View
                      </button>
                      {member.ragStatus !== 'green' && (
                        <button
                          className="text-[11px] text-orange hover:text-orange-600 font-medium px-2 py-1 rounded hover:bg-orange/10 transition-colors focus:outline-none focus:ring-2 focus:ring-orange/30"
                          aria-label={`Chase ${member.name}`}
                        >
                          Chase
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessment unlock requests */}
      <AssessmentUnlockPanel />

      {/* Pending sign-offs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-amber-500" aria-hidden />
            <h2 className="text-sm font-bold text-navy">Pending Manager Sign-Offs</h2>
          </div>
          <div className="space-y-3">
            {TEAM_MEMBERS.filter(m => m.pendingSignOffs.length > 0).map(member => (
              <div key={member.id} className="flex items-start justify-between gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50/50">
                <div>
                  <p className="text-sm font-semibold text-navy">{member.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {member.pendingSignOffs.slice(0, 3).map(signOff => (
                      <span key={signOff} className="text-[11px] font-medium text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                        {signOff}
                      </span>
                    ))}
                    {member.pendingSignOffs.length > 3 && (
                      <span className="text-[11px] text-slate-500">+{member.pendingSignOffs.length - 3} more</span>
                    )}
                  </div>
                </div>
                <button className="btn-teal text-xs flex-shrink-0">Review</button>
              </div>
            ))}
          </div>
        </div>

        {/* Phase distribution */}
        <div className="card p-5">
          <h2 className="text-sm font-bold text-navy mb-4">Phase Distribution</h2>
          <div className="space-y-3">
            {PHASES.map(phase => {
              const count = TEAM_MEMBERS.filter(m => m.phase === phase.id).length
              const pct = Math.round((count / TEAM_MEMBERS.length) * 100)
              return (
                <div key={phase.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', {
                        'bg-teal/10 text-teal':         phase.id === 'foundation',
                        'bg-orange/10 text-orange':     phase.id === 'onboarding',
                        'bg-gold/20 text-yellow-700':   phase.id === 'embedding',
                        'bg-navy/10 text-navy':         phase.id === 'optimise',
                      })}>
                        {phase.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-navy tabular-nums">{count} <span className="text-slate-400 font-normal text-xs">members</span></span>
                  </div>
                  <ProgressBar
                    value={count}
                    max={TEAM_MEMBERS.length}
                    color={phase.id === 'foundation' ? 'teal' : phase.id === 'onboarding' ? 'orange' : phase.id === 'embedding' ? 'gold' : 'navy'}
                    size="md"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
