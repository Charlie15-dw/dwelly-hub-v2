import { describe, it, expect } from 'vitest'
import {
  computeSectionCompetency,
  buildAssessmentRecord,
  computeSummary,
  certificationStatus,
  latestByAssessment,
  ALL_PASSPORT_IDS,
  type ResultRow,
} from '@/lib/passport'

describe('latestByAssessment', () => {
  it('keeps the most recent attempt per assessment', () => {
    const results: ResultRow[] = [
      { assessment_id: 'mnt-01', score: 50, passed: false, completed_at: '2026-01-01' },
      { assessment_id: 'mnt-01', score: 90, passed: true, completed_at: '2026-02-01' },
    ]
    const latest = latestByAssessment(results)
    expect(latest.get('mnt-01')?.score).toBe(90)
  })
})

describe('computeSectionCompetency', () => {
  it('reports not-started sections when there are no attempts', () => {
    const comp = computeSectionCompetency([])
    expect(comp.every(c => c.status === 'not-started')).toBe(true)
    expect(comp.every(c => c.avgScore === null)).toBe(true)
  })

  it('marks a section proficient only when every assessment is passed', () => {
    const results: ResultRow[] = [
      { assessment_id: 'mnt-01', score: 85, passed: true },
      { assessment_id: 'mnt-02', score: 82, passed: true },
    ]
    const maintenance = computeSectionCompetency(results).find(c => c.section === 'Maintenance')!
    expect(maintenance.status).toBe('proficient')
    expect(maintenance.complete).toBe(true)
    expect(maintenance.avgScore).toBe(84)
  })

  it('marks a section developing when some assessments are not yet passed', () => {
    const results: ResultRow[] = [
      { assessment_id: 'mnt-01', score: 85, passed: true },
      { assessment_id: 'mnt-02', score: 60, passed: false },
    ]
    const maintenance = computeSectionCompetency(results).find(c => c.section === 'Maintenance')!
    expect(maintenance.status).toBe('developing')
    expect(maintenance.passed).toBe(1)
    expect(maintenance.total).toBe(2)
  })
})

describe('buildAssessmentRecord', () => {
  it('lists every programme assessment, marking un-attempted ones', () => {
    const record = buildAssessmentRecord([{ assessment_id: 'mnt-01', score: 90, passed: true }])
    expect(record.length).toBe(ALL_PASSPORT_IDS.length)
    const mnt01 = record.find(r => r.id === 'mnt-01')!
    expect(mnt01.attempted).toBe(true)
    expect(mnt01.score).toBe(90)
    const cmp01 = record.find(r => r.id === 'cmp-01')!
    expect(cmp01.attempted).toBe(false)
    expect(cmp01.score).toBeNull()
  })

  it('tags milestone assessments distinctly', () => {
    const record = buildAssessmentRecord([])
    const master = record.find(r => r.id === 'master-assessment')!
    expect(master.section).toBe('Milestone')
  })
})

describe('computeSummary', () => {
  it('counts unique passed assessments and derives progress', () => {
    const results: ResultRow[] = [
      { assessment_id: 'mnt-01', score: 90, passed: true },
      { assessment_id: 'mnt-01', score: 40, passed: false }, // duplicate id, still one pass
      { assessment_id: 'cmp-01', score: 85, passed: true },
    ]
    const summary = computeSummary(results)
    expect(summary.passedCount).toBe(2)
    expect(summary.totalCount).toBe(15)
    expect(summary.progressPct).toBe(Math.round((2 / 15) * 100))
    expect(summary.certified).toBe(false)
  })

  it('flags certified when all assessments are passed', () => {
    const results: ResultRow[] = ALL_PASSPORT_IDS.map(id => ({ assessment_id: id, score: 90, passed: true }))
    const summary = computeSummary(results)
    expect(summary.certified).toBe(true)
    expect(summary.progressPct).toBe(100)
  })

  it('returns null averages with no results', () => {
    const summary = computeSummary([])
    expect(summary.avgScore).toBeNull()
    expect(summary.passRate).toBeNull()
  })
})

describe('certificationStatus', () => {
  it('is not-started with no passes', () => {
    expect(certificationStatus(computeSummary([]), 200)).toBe('not-started')
  })

  it('is in-training when some but not all are passed', () => {
    const summary = computeSummary([{ assessment_id: 'mnt-01', score: 90, passed: true }])
    expect(certificationStatus(summary, 200)).toBe('in-training')
  })

  it('is certified when complete and re-cert is not yet due', () => {
    const summary = computeSummary(ALL_PASSPORT_IDS.map(id => ({ assessment_id: id, score: 90, passed: true })))
    expect(certificationStatus(summary, 200)).toBe('certified')
  })

  it('is recert-due when complete but the window has passed', () => {
    const summary = computeSummary(ALL_PASSPORT_IDS.map(id => ({ assessment_id: id, score: 90, passed: true })))
    expect(certificationStatus(summary, -5)).toBe('recert-due')
  })
})
