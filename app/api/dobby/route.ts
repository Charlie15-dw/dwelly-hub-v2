import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { checkRateLimit, validateMessages, generateDobbyAnswer, dobbyConfigured } from '@/lib/dobby'

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  if (!dobbyConfigured()) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { messages: rawMessages } = body as Record<string, unknown>
  const messages = validateMessages(rawMessages)

  if (messages.length === 0) {
    return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 })
  }

  try {
    const answer = await generateDobbyAnswer(messages)
    return NextResponse.json({ message: answer.text }, { headers: { 'X-Dobby-Model': answer.model } })
  } catch (err: unknown) {
    // Logged in full; the caller gets a generic message. The model provider's error text can
    // name internals (model, request ids, account limits) that have no business in a client.
    console.error('Dobby API error:', err)
    return NextResponse.json({ error: 'Dobby is unavailable right now' }, { status: 500 })
  }
}
