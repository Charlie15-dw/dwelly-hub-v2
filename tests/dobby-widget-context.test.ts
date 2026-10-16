// The SOPs the Context Widget sends with a question: validated as untrusted input, then put in
// front of the model so it answers from Dwelly's SOP matrix. The Claude SDK is mocked, so these
// read the prompt Dobby builds without spending anything.
import { describe, it, expect, vi, beforeEach } from 'vitest'

const claudeCreate = vi.fn()
vi.mock('@anthropic-ai/sdk', () => {
  class APIError extends Error {}
  class Anthropic {
    static APIError = APIError
    static RateLimitError = APIError
    static AuthenticationError = APIError
    beta = { messages: { create: claudeCreate } }
  }
  return { default: Anthropic }
})
vi.mock('groq-sdk', () => ({ default: class Groq { chat = { completions: { create: vi.fn() } } } }))

async function load() {
  vi.resetModules()
  process.env.ANTHROPIC_API_KEY = 'test'
  delete process.env.GROQ_API_KEY
  return import('@/lib/dobby')
}
const q = (content: string) => ({ role: 'user' as const, content })
const invoiceSop = {
  title: 'Landlord asking to see invoices before they are charged',
  steps: 'Send a manual email with the invoice for that job.',
  scope: 'All Jobs · all stages',
  appliesHere: true,
}

beforeEach(() => {
  claudeCreate.mockReset()
  claudeCreate.mockResolvedValue({ stop_reason: 'end_turn', content: [{ type: 'text', text: '- ok' }] })
})

describe('validateWidgetContext', () => {
  it('keeps the job and the SOPs, with only the expected fields', async () => {
    const { validateWidgetContext } = await load()
    const ctx = validateWidgetContext({
      job: { type: 'compliance', stage: 'COMPLETED', docType: 'Gas Safety Certificate', extra: 'x' },
      sops: [{ ...invoiceSop, link: 'https://example.invalid' }],
    })
    expect(ctx).toEqual({ job: { type: 'compliance', stage: 'COMPLETED', docType: 'Gas Safety Certificate' }, sops: [invoiceSop] })
  })

  it('caps the number of SOPs and the length of each field', async () => {
    const { validateWidgetContext } = await load()
    const ctx = validateWidgetContext({
      job: { type: 'x'.repeat(500) },
      sops: Array.from({ length: 10 }, () => ({ title: 't'.repeat(1000), steps: 's'.repeat(10000), scope: 'c'.repeat(500) })),
    })!
    expect(ctx.sops).toHaveLength(3)
    expect(ctx.sops[0].title).toHaveLength(300)
    expect(ctx.sops[0].steps).toHaveLength(2000)
    expect(ctx.sops[0].scope).toHaveLength(100)
    expect(ctx.job.type).toHaveLength(100)
  })

  it('treats anything but a literal true as not applying to the job', async () => {
    const { validateWidgetContext } = await load()
    const ctx = validateWidgetContext({ sops: [{ title: 'a', appliesHere: 'yes' }, { title: 'b', appliesHere: 1 }] })!
    expect(ctx.sops.map(s => s.appliesHere)).toEqual([false, false])
  })

  it('drops junk and returns null when nothing useful is left', async () => {
    const { validateWidgetContext } = await load()
    expect(validateWidgetContext(undefined)).toBeNull()
    expect(validateWidgetContext('sops')).toBeNull()
    expect(validateWidgetContext({ job: {}, sops: [] })).toBeNull()
    expect(validateWidgetContext({ sops: [null, 7, { title: 42 }, {}] })).toBeNull()
    expect(validateWidgetContext({ sops: [{ title: { toString: () => 'x' } }, { steps: 'kept' }] })!.sops)
      .toEqual([{ title: '', steps: 'kept', scope: '', appliesHere: false }])
  })
})

describe('the prompt with a widget context', () => {
  it('puts the SOPs and the job in the system prompt, after the training content', async () => {
    const dobby = await load()
    const ctx = dobby.validateWidgetContext({
      job: { type: 'compliance', stage: 'INVOICE_REVIEW', docType: 'Gas Safety Certificate' },
      sops: [invoiceSop, { title: 'Invoice disputed', steps: 'Check the quote.', scope: 'VISIT · all jobs', appliesHere: false }],
    })
    await dobby.generateDobbyAnswer([q('Landlord wants to see the invoice before being charged')], 'dwelly', ctx)
    const system: string = claudeCreate.mock.calls[0][0].system
    expect(system).toContain('THE JOB THE OPERATOR IS ON: compliance · Gas Safety Certificate · INVOICE REVIEW')
    expect(system).toContain('[SOP 1 — applies to this job]\nScenario: Landlord asking to see invoices before they are charged\nWhat to do: Send a manual email')
    expect(system).toContain('[SOP 2 — written for a different stage or job type (VISIT · all jobs), not matched to this job]')
    expect(system).toContain('takes precedence over the process content above')
    // The retrieved content still sits directly under its heading; the SOP block comes after it.
    expect(system.indexOf('RELEVANT DWELLY PROCESS CONTENT:')).toBeLessThan(system.indexOf('DWELLY SOPs RELATED'))
  })

  it('is unchanged without one', async () => {
    const dobby = await load()
    await dobby.generateDobbyAnswer([q('x')], 'dwelly')
    await dobby.generateDobbyAnswer([q('x')], 'dwelly', null)
    const [a, b] = claudeCreate.mock.calls.map(c => c[0].system as string)
    expect(a).toBe(b)
    expect(a).not.toContain('DWELLY SOPs RELATED')
    expect(a).not.toContain('THE JOB THE OPERATOR IS ON')
  })

  it('names the job without an SOP block when no SOP matched', async () => {
    const dobby = await load()
    const ctx = dobby.validateWidgetContext({ job: { type: 'maintenance', stage: 'VISIT' }, sops: [] })
    await dobby.generateDobbyAnswer([q('x')], 'dwelly', ctx)
    const system: string = claudeCreate.mock.calls[0][0].system
    expect(system).toContain('THE JOB THE OPERATOR IS ON: maintenance · VISIT')
    expect(system).not.toContain('DWELLY SOPs RELATED')
  })
})
