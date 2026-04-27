import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

// ─── In-memory rate limiter ────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 20           // 20 requests per IP per minute

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { allowed: true, retryAfter: 0 }
}

// ─── Input validation ──────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 1000
const MAX_MESSAGES = 50

function sanitiseString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function validateMessages(messages: unknown): { role: 'user' | 'assistant'; content: string }[] {
  if (!Array.isArray(messages)) return []
  return messages
    .slice(0, MAX_MESSAGES)
    .filter(
      (m) =>
        m &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
    )
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: sanitiseString(m.content, MAX_MESSAGE_LENGTH),
    }))
}

function validateScenario(scenario: unknown): Record<string, string> | null {
  if (!scenario || typeof scenario !== 'object') return null
  const s = scenario as Record<string, unknown>
  const required = ['tenantName', 'title', 'situation', 'mood', 'moodInstructions', 'background']
  if (!required.every((k) => typeof s[k] === 'string')) return null
  return Object.fromEntries(required.map((k) => [k, sanitiseString(s[k] as string)]))
}

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  // API key check
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  // Parse and validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { messages: rawMessages, scenario: rawScenario } = body as Record<string, unknown>
  const messages = validateMessages(rawMessages)
  const scenario = validateScenario(rawScenario)

  if (!scenario) {
    return NextResponse.json({ error: 'Invalid scenario' }, { status: 400 })
  }
  if (messages.length === 0) {
    return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 })
  }

  // Call Anthropic
  const client = new Anthropic({ apiKey })
  try {
    const systemPrompt = `You are roleplaying as a tenant named ${scenario.tenantName} in a UK residential property managed by Dwelly, a property management company. The property manager (the user) is training by having a realistic conversation with you.

SCENARIO: ${scenario.title}
YOUR SITUATION: ${scenario.situation}
YOUR BACKGROUND: ${scenario.background}
YOUR EMOTIONAL STATE: ${scenario.mood}
HOW TO PLAY YOUR MOOD: ${scenario.moodInstructions}

CRITICAL RULES — follow these exactly:
1. Stay completely in character at all times. Never break character, never acknowledge you are an AI.
2. Read what the property manager actually says and respond directly to it — pick up on specific words, questions, and offers they make.
3. If they ask you a direct question, answer it specifically — do not ignore it or give a vague response.
4. If they make a specific offer or proposal (e.g. a payment plan, a specific date, an amount), react to that specific offer.
5. If they show empathy and professionalism, gradually soften — but don't flip overnight. Progress naturally over several turns.
6. If they are dismissive, cold, or make threats, become more defensive or upset.
7. Keep responses short — 2 to 4 sentences maximum. This is a phone or live chat conversation.
8. Speak in natural, colloquial British English. Use filler words occasionally (Right, Okay, Look, I mean, Yeah). Do not sound formal.
9. Do NOT narrate your actions or emotions in brackets — only speak the words the tenant would say out loud.
10. Do not resolve the situation too quickly — this is a training exercise. Maintain realistic friction unless the PM has handled things very well across multiple turns.
11. Property details if you need them: the address is 14 Birchwood Avenue, the landlord is Mr. Patel, rent is £1,200 per month.`

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ message: text })
  } catch (err) {
    console.error('Roleplay API error:', err)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
