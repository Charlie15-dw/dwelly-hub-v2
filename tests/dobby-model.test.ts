// Dobby's model call: the widget's Dobby on Claude Sonnet 5.5 with Groq as the fallback; the
// in-Hub Dobby on Groq. Both SDKs are mocked, so these
// pin the REQUEST Dobby sends and how it reads the response, without spending anything.
import { describe, it, expect, vi, beforeEach } from 'vitest'

const claudeCreate = vi.fn()
const groqCreate = vi.fn()

vi.mock('@anthropic-ai/sdk', () => {
  class APIError extends Error { status: number; constructor(status: number, m = 'api error') { super(m); this.status = status } }
  class RateLimitError extends APIError { constructor() { super(429, 'rate limited') } }
  class AuthenticationError extends APIError { constructor() { super(401, 'bad key') } }
  class Anthropic {
    static APIError = APIError
    static RateLimitError = RateLimitError
    static AuthenticationError = AuthenticationError
    beta = { messages: { create: claudeCreate } }
  }
  return { default: Anthropic }
})
vi.mock('groq-sdk', () => ({
  default: class Groq { chat = { completions: { create: groqCreate } } },
}))

// The clients are created when the module loads, from whichever keys are set — so each scenario
// re-imports it with its own environment.
async function load(env: { anthropic?: boolean; groq?: boolean }) {
  vi.resetModules()
  if (env.anthropic) process.env.ANTHROPIC_API_KEY = 'test'; else delete process.env.ANTHROPIC_API_KEY
  if (env.groq) process.env.GROQ_API_KEY = 'test'; else delete process.env.GROQ_API_KEY
  return import('@/lib/dobby')
}
const claudeSays = (text: string, stop = 'end_turn') => ({
  stop_reason: stop,
  content: [{ type: 'thinking', thinking: '', signature: 'x' }, { type: 'text', text }],
})
const groqSays = (text: string) => ({ choices: [{ message: { content: text } }] })
const q = (content: string) => ({ role: 'user' as const, content })
const a = (content: string) => ({ role: 'assistant' as const, content })

beforeEach(() => { claudeCreate.mockReset(); groqCreate.mockReset(); vi.spyOn(console, 'error').mockImplementation(() => {}); vi.spyOn(console, 'warn').mockImplementation(() => {}) })

describe('Dobby on Claude', () => {
  it('asks Claude Sonnet 5.5 at low effort, with no temperature', async () => {
    const dobby = await load({ anthropic: true, groq: true })
    claudeCreate.mockResolvedValue(claudeSays('- Call the landlord'))
    const answer = await dobby.generateDobbyAnswer([q('How do I chase a quote?')], 'dwelly')
    const req = claudeCreate.mock.calls[0][0]
    expect(req.model).toBe('claude-sonnet-5-5')
    expect(req.output_config).toEqual({ effort: 'low' })
    // Sonnet 5.5 rejects non-default sampling values with a 400.
    expect(req).not.toHaveProperty('temperature')
    expect(req.fallbacks).toBe('default')
    expect(req.betas).toEqual(['server-side-fallback-2026-07-01'])
    expect(typeof req.system).toBe('string')
    expect(answer).toEqual({ text: '- Call the landlord', model: 'claude-sonnet-5-5' })
    expect(groqCreate).not.toHaveBeenCalled()
  })

  it('leaves room for thinking: the token cap is well above Groq\'s old 700', async () => {
    const dobby = await load({ anthropic: true })
    claudeCreate.mockResolvedValue(claudeSays('ok'))
    await dobby.generateDobbyAnswer([q('x')], 'dwelly')
    expect(claudeCreate.mock.calls[0][0].max_tokens).toBeGreaterThan(700)
  })

  it('reads the answer by block type, skipping the leading thinking block', async () => {
    const dobby = await load({ anthropic: true })
    claudeCreate.mockResolvedValue(claudeSays('The answer'))
    expect((await dobby.generateDobbyAnswer([q('x')], 'dwelly')).text).toBe('The answer')
  })

  it('starts the conversation on a user turn and ends on one', async () => {
    // validateMessages keeps the last 20, which can begin on an assistant turn; a trailing
    // assistant turn would be read as a prefill, which Sonnet 5.5 rejects.
    const dobby = await load({ anthropic: true })
    claudeCreate.mockResolvedValue(claudeSays('ok'))
    await dobby.generateDobbyAnswer([a('old reply'), q('first'), a('reply'), q('second'), a('dangling')], 'dwelly')
    expect(claudeCreate.mock.calls[0][0].messages).toEqual([q('first'), a('reply'), q('second')])
  })

  it('drops empty messages, which Claude rejects', async () => {
    const dobby = await load({ anthropic: true })
    claudeCreate.mockResolvedValue(claudeSays('ok'))
    await dobby.generateDobbyAnswer([q(''), q('real question')], 'dwelly')
    expect(claudeCreate.mock.calls[0][0].messages).toEqual([q('real question')])
  })

  it('answers a refusal with a polite reply, not an error', async () => {
    const dobby = await load({ anthropic: true })
    claudeCreate.mockResolvedValue({ stop_reason: 'refusal', content: [] })
    const answer = await dobby.generateDobbyAnswer([q('x')], 'dwelly')
    expect(answer.text).toMatch(/can't help with that/i)
    expect(answer.model).toBe('claude-sonnet-5-5')
  })
})

describe('Groq fallback', () => {
  it('answers with Groq when a Claude call fails, and says so', async () => {
    const dobby = await load({ anthropic: true, groq: true })
    const { default: Anthropic } = await import('@anthropic-ai/sdk') as any
    claudeCreate.mockRejectedValue(new Anthropic.RateLimitError())
    groqCreate.mockResolvedValue(groqSays('From Groq'))
    const answer = await dobby.generateDobbyAnswer([q('x')], 'dwelly')
    expect(answer).toEqual({ text: 'From Groq', model: 'groq/openai/gpt-oss-120b' })
    expect(console.error).toHaveBeenCalled()
  })

  it('answers with Groq when no Anthropic key is configured', async () => {
    const dobby = await load({ groq: true })
    groqCreate.mockResolvedValue(groqSays('From Groq'))
    expect((await dobby.generateDobbyAnswer([q('x')], 'dwelly')).model).toBe('groq/openai/gpt-oss-120b')
    expect(claudeCreate).not.toHaveBeenCalled()
  })

  it('rethrows a Claude failure when there is no Groq to fall back to', async () => {
    const dobby = await load({ anthropic: true })
    claudeCreate.mockRejectedValue(new Error('down'))
    await expect(dobby.generateDobbyAnswer([q('x')], 'dwelly')).rejects.toThrow('down')
  })

  it('reports whether a model is configured for each Dobby', async () => {
    expect((await load({})).dobbyConfigured('dwelly')).toBe(false)
    expect((await load({ anthropic: true })).dobbyConfigured('dwelly')).toBe(true)
    expect((await load({ groq: true })).dobbyConfigured('dwelly')).toBe(true)
    // The in-Hub Dobby only uses Groq, so an Anthropic key alone isn't enough for it.
    expect((await load({ anthropic: true })).dobbyConfigured()).toBe(false)
    expect((await load({ groq: true })).dobbyConfigured()).toBe(true)
  })

  it('generateDobbyReply still returns just the text, for any other caller', async () => {
    const dobby = await load({ anthropic: true })
    claudeCreate.mockResolvedValue(claudeSays('plain'))
    expect(await dobby.generateDobbyReply([q('x')], 'dwelly')).toBe('plain')
  })
})

describe('In-Hub Dobby', () => {
  it('stays on Groq even when an Anthropic key is configured', async () => {
    const dobby = await load({ anthropic: true, groq: true })
    groqCreate.mockResolvedValue(groqSays('From Groq'))
    vi.mocked(console.warn).mockClear()
    expect(await dobby.generateDobbyAnswer([q('x')])).toEqual({ text: 'From Groq', model: 'groq/openai/gpt-oss-120b' })
    expect(claudeCreate).not.toHaveBeenCalled()
    expect(console.warn).not.toHaveBeenCalled()
  })
})
