import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createServerClient } from '@/lib/supabase/server'
import { isHubBeta } from '@/lib/preview'
import { getPracticeScenario } from '@/lib/practice'

// ─── Rate limiter (per IP) ───────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 40

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

// ─── Input validation ────────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 800
const MAX_MESSAGES = 24

function validateMessages(messages: unknown): { role: 'user' | 'assistant'; content: string }[] {
  if (!Array.isArray(messages)) return []
  return messages
    .slice(-MAX_MESSAGES)
    .filter(m =>
      m && typeof m === 'object' &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string'
    )
    .map(m => ({ role: m.role as 'user' | 'assistant', content: (m.content as string).trim().slice(0, MAX_MESSAGE_LENGTH) }))
}

function roleplayPrompt(scenario: ReturnType<typeof getPracticeScenario>) {
  if (!scenario) return ''
  return `You are role-playing a realistic training scenario for a UK residential lettings property manager.

You are playing: ${scenario.persona}

The situation: ${scenario.situation}

RULES:
1. Stay fully in character as ${scenario.persona.split(',')[0]}. Never break character or mention that you are an AI or a simulation.
2. React naturally and emotionally to how the property manager speaks to you. If they are empathetic, clear and take ownership, gradually soften. If they are dismissive, vague or defensive, stay frustrated or push back.
3. Keep each reply short and conversational — one to three sentences, like a real person in a live conversation. No lists, no formatting.
4. Behave like someone in the UK lettings context. Do not give the property manager advice or coaching — you are the other party, not a trainer.
5. Do not resolve everything instantly; make them earn it, but be fair and realistic.`
}

function coachPrompt(scenario: ReturnType<typeof getPracticeScenario>) {
  if (!scenario) return ''
  return `You are an experienced UK lettings training coach. The transcript below is a practice conversation where the property manager (the "user") handled this scenario:

Scenario: ${scenario.title}
Situation: ${scenario.situation}

What good handling looks like:
${scenario.coachingFocus.map(f => `- ${f}`).join('\n')}

Step out of character and give the property manager warm, constructive feedback on how THEY handled it. Structure your feedback in plain text as:

What you did well:
(two or three specific things, referencing what they actually said)

What to work on:
(two or three specific, actionable suggestions)

Overall:
(one encouraging sentence and a rating out of 5)

Be specific and kind. Keep it under 200 words. Do not use markdown symbols like asterisks or hashes.`
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } })
  }

  // Auth + beta gate — this feature is trialled with beta testers only.
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isHubBeta(user.email)) return NextResponse.json({ error: 'Not available' }, { status: 403 })

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { scenarioId, messages: rawMessages, mode } = body as Record<string, unknown>
  const scenario = getPracticeScenario(typeof scenarioId === 'string' ? scenarioId : '')
  if (!scenario) return NextResponse.json({ error: 'Unknown scenario' }, { status: 400 })

  const messages = validateMessages(rawMessages)
  const isCoach = mode === 'coach'

  if (!isCoach && messages.length === 0) {
    return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 })
  }

  const systemPrompt = isCoach ? coachPrompt(scenario) : roleplayPrompt(scenario)

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
        ...(isCoach ? [{ role: 'user' as const, content: 'Please give me your coaching feedback on how I handled that.' }] : []),
      ],
      max_tokens: isCoach ? 500 : 220,
      temperature: isCoach ? 0.3 : 0.75,
    })

    const text = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json({ message: text })
  } catch (err: unknown) {
    console.error('Practice API error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
