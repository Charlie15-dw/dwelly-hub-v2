import { describe, it, expect } from 'vitest'
import { computeFocusAreas, type FocusModule } from '@/lib/recap-focus'

const MODULES: FocusModule[] = [
  { id: 'mnt-01', title: 'Maintenance 1', section: 'maintenance', passmark: 80 },
  { id: 'cmp-01', title: 'Compliance 1', section: 'compliance', passmark: 80 },
  { id: 'kno-01', title: 'Best Practice', section: 'knowledge', passmark: 80 },
]

describe('computeFocusAreas', () => {
  it('returns nothing when there are no results', () => {
    expect(computeFocusAreas([], MODULES)).toEqual([])
  })

  it('flags only modules scored below their pass mark', () => {
    const areas = computeFocusAreas(
      [
        { assessment_id: 'mnt-01', score: 60 },
        { assessment_id: 'cmp-01', score: 95 },
      ],
      MODULES,
    )
    expect(areas.map(a => a.moduleId)).toEqual(['mnt-01'])
  })

  it('orders weakest first and caps at the limit', () => {
    const areas = computeFocusAreas(
      [
        { assessment_id: 'mnt-01', score: 70 },
        { assessment_id: 'cmp-01', score: 40 },
        { assessment_id: 'kno-01', score: 55 },
      ],
      MODULES,
      2,
    )
    expect(areas.map(a => a.moduleId)).toEqual(['cmp-01', 'kno-01'])
  })

  it('uses the most recent attempt per module', () => {
    const areas = computeFocusAreas(
      [
        { assessment_id: 'mnt-01', score: 50, completed_at: '2026-01-01' },
        { assessment_id: 'mnt-01', score: 90, completed_at: '2026-02-01' },
      ],
      MODULES,
    )
    // Latest attempt passed, so no focus area.
    expect(areas).toEqual([])
  })

  it('ignores assessment ids that are not modules (full/master/recap/release)', () => {
    const areas = computeFocusAreas(
      [
        { assessment_id: 'full-assessment', score: 10 },
        { assessment_id: 'recap-apr-2026', score: 5 },
        { assessment_id: 'release-2026-01', score: 0 },
      ],
      MODULES,
    )
    expect(areas).toEqual([])
  })
})
