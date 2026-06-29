'use client'

import { useState, useEffect } from 'react'
import { Lock, Unlock, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getLockedAttempts, unlockAssessment, type AttemptRecord } from '@/lib/assessmentStorage'

const MODULE_LABELS: Record<string, string> = {
  'master-assessment': 'Master Assessment',
  'full-assessment':   'Full Assessment — Video Modules',
  'mnt-02': 'Maintenance',
  'cmp-02': 'Compliance',
  'mvt-02': 'Move-Outs',
  'ins-02': 'Inspections',
  'sup-02': 'Support',
  'kno-01': 'Dwelly Best Practice',
  'kno-02': 'Repairs & Legal Responsibilities',
  'kno-03': 'Property Finances & the Ledger',
}

export default function AssessmentUnlockPanel() {
  const [lockedAttempts, setLockedAttempts] = useState<AttemptRecord[]>([])
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null)

  useEffect(() => {
    setLockedAttempts(getLockedAttempts())
  }, [])

  function handleUnlock(moduleId: string) {
    unlockAssessment(moduleId)
    setLockedAttempts(prev => prev.filter(a => a.moduleId !== moduleId))
    setJustUnlocked(moduleId)
    setTimeout(() => setJustUnlocked(null), 3500)
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-orange" aria-hidden />
          <h2 className="text-sm font-bold text-navy">Assessment Retake Requests</h2>
        </div>
        {lockedAttempts.length > 0 && (
          <span className="text-xs font-semibold text-white bg-orange rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
            {lockedAttempts.length}
          </span>
        )}
      </div>

      {/* Success toast */}
      {justUnlocked && (
        <div className="mb-3 p-3 rounded-xl bg-teal/8 border border-teal/20 text-xs font-medium text-teal flex items-center gap-2">
          <Unlock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
          <span>
            <strong>{MODULE_LABELS[justUnlocked] ?? justUnlocked}</strong> unlocked — the learner can now retake.
          </span>
        </div>
      )}

      {lockedAttempts.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Unlock className="w-5 h-5 text-slate-400" aria-hidden />
          </div>
          <p className="text-sm text-slate-500">No assessments awaiting unlock</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Locked assessments appear here after a team member completes one
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {lockedAttempts.map(attempt => (
              <div
                key={attempt.moduleId}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-3.5 h-3.5 text-slate-400" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">Sarah Mitchell</p>
                    <p className="text-xs text-slate-500 truncate">
                      {MODULE_LABELS[attempt.moduleId] ?? attempt.moduleId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className={cn(
                      'text-sm font-bold tabular-nums',
                      attempt.passed ? 'text-teal' : 'text-red-500',
                    )}>
                      {attempt.score}%
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnlock(attempt.moduleId)}
                    className="btn-teal text-xs flex items-center gap-1.5"
                    aria-label={`Grant retake for ${MODULE_LABELS[attempt.moduleId] ?? attempt.moduleId}`}
                  >
                    <Unlock className="w-3.5 h-3.5" aria-hidden />
                    Grant Retake
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Granting a retake allows the learner to attempt the assessment once more. It will lock again after completion.
          </p>
        </>
      )}
    </div>
  )
}
