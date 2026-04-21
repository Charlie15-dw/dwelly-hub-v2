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
    const systemPrompt = `You are roleplaying as a tenant named ${scenario.tenantName} in a UK residential property managed by Dwelly, a property management company. The property manager (the user) is dealing with you in a real conversation.

SCENARIO: ${scenario.title}
SITUATION: ${scenario.situation}
YOUR EMOTIONAL STATE: ${scenario.mood}
YOUR BACKGROUND: ${scenario.background}

ROLEPLAY RULES:
- Stay completely in character as this tenant throughout the entire conversation. Never break character.
- Respond naturally and realistically as this tenant would — use British English, be conversational.
- Match your emotional state to the scenario: ${scenario.moodInstructions}
- React authentically to how the property manager speaks to you. If they are empathetic and professional, slowly become more cooperative. If they are dismissive or cold, become more frustrated.
- Raise realistic concerns, give realistic excuses or explanations that a real tenant in this situation would give.
- Do NOT make it too easy — this is a training exercise. Create realistic friction and complexity.
- Keep responses concise (2–4 sentences typically) as this is a phone/chat conversation simulation.
- Occasionally mention real details: the property address is 14 Birchwood Avenue, the landlord is Mr. Patel, the rent is £1,200/month.
- If the property manager handles the situation well (shows empathy, clear next steps, stays professional), acknowledge progress and show the conversation moving toward resolution.
- If pressed for a resolution, be specific about what you need or are willing to do.
- Do NOT narrate your actions — only speak as the tenant would speak.`

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
