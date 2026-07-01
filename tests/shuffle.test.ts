import { describe, it, expect } from 'vitest'
import { hashStr, seededShuffle } from '@/lib/shuffle'

describe('hashStr', () => {
  it('is deterministic for the same input', () => {
    expect(hashStr('dwelly-general-navigation')).toBe(hashStr('dwelly-general-navigation'))
  })

  it('produces different hashes for different inputs', () => {
    expect(hashStr('module-a')).not.toBe(hashStr('module-b'))
  })

  it('returns an unsigned 32-bit integer', () => {
    const h = hashStr('anything')
    expect(Number.isInteger(h)).toBe(true)
    expect(h).toBeGreaterThanOrEqual(0)
    expect(h).toBeLessThanOrEqual(0xffffffff)
  })
})

describe('seededShuffle', () => {
  it('is deterministic for the same seed', () => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    expect(seededShuffle(arr, 12345)).toEqual(seededShuffle(arr, 12345))
  })

  it('produces different orders for different seeds', () => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    // Extremely unlikely to coincide for a 10-element array across two seeds.
    expect(seededShuffle(arr, 1)).not.toEqual(seededShuffle(arr, 2))
  })

  it('is a permutation — same elements, no additions or drops', () => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const shuffled = seededShuffle(arr, 999)
    expect([...shuffled].sort((a, b) => a - b)).toEqual(arr)
    expect(shuffled).toHaveLength(arr.length)
  })

  it('does not mutate the input array', () => {
    const arr = [1, 2, 3, 4, 5]
    const copy = [...arr]
    seededShuffle(arr, 42)
    expect(arr).toEqual(copy)
  })

  it('handles empty and single-element arrays', () => {
    expect(seededShuffle([], 1)).toEqual([])
    expect(seededShuffle([7], 1)).toEqual([7])
  })
})
