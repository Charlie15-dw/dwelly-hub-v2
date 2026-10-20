// The widget endpoint's per-connection limit. The whole office shares one connection, so the
// per-IP figure is effectively the team's limit.
import { describe, it, expect, vi } from 'vitest'

vi.mock('@anthropic-ai/sdk', () => ({ default: class {} }))
vi.mock('groq-sdk', () => ({ default: class {} }))

describe('checkWidgetRateLimit', () => {
  it('allows 30 questions a minute from one connection, then asks it to wait', async () => {
    vi.resetModules()
    const { checkWidgetRateLimit } = await import('@/lib/dobby')
    for (let i = 0; i < 30; i++) expect(checkWidgetRateLimit('office').allowed).toBe(true)
    const blocked = checkWidgetRateLimit('office')
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfter).toBeGreaterThan(0)
    expect(blocked.retryAfter).toBeLessThanOrEqual(60)
    // Another connection is counted separately.
    expect(checkWidgetRateLimit('home').allowed).toBe(true)
  })
})
