// Public, anonymous usage-tracking endpoint for the Dwelly Context Widget. The
// widget runs inside the CRM where the operator is NOT logged into the Hub, so
// there is no session to attribute events to. Instead the widget sends a random
// per-install client_id and a small event name ('open', 'tab', 'dobby_ask',
// 'sop_search'); we store one row per event in widget_events via the service-role
// key. No personal data is collected. Access is gated the same way as the Dobby
// widget endpoint: the request Origin must be on the allowlist, and the call is
// rate-limited per IP.
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/dobby'
import { createServiceClient } from '@/lib/supabase/server'

const DEFAULT_ALLOWED_ORIGINS = ['https://panel.dwelly.team']

function allowedOrigins(): string[] {
  const extra = (process.env.DOBBY_WIDGET_ORIGINS ?? '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean)
  return [...DEFAULT_ALLOWED_ORIGINS, ...extra]
}

function isAllowedOrigin(origin: string | null): boolean {
  return !!origin && allowedOrigins().includes(origin)
}

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
  if (isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin as string
  return headers
}

// The only event names and tab ids the widget sends — anything else is dropped so
// the table can't be filled with arbitrary strings from a spoofed caller.
const ALLOWED_EVENTS = new Set(['open', 'tab', 'dobby_ask', 'sop_search'])
const ALLOWED_TABS = new Set(['sop', 'dobby', 'dash', 'll', 'prop'])

export function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const headers = corsHeaders(origin)

  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403, headers })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
  const { allowed, retryAfter } = checkRateLimit(`widget-event:${ip}`)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { ...headers, 'Retry-After': String(retryAfter) } }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers })
  }

  const { clientId, event, tab } = body as Record<string, unknown>

  const clientIdStr = typeof clientId === 'string' ? clientId.trim().slice(0, 100) : ''
  const eventStr = typeof event === 'string' ? event.trim() : ''
  const tabStr = typeof tab === 'string' ? tab.trim() : ''

  if (!clientIdStr || !ALLOWED_EVENTS.has(eventStr)) {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400, headers })
  }

  try {
    const service = createServiceClient()
    await service.from('widget_events').insert({
      client_id: clientIdStr,
      event: eventStr,
      tab: ALLOWED_TABS.has(tabStr) ? tabStr : null,
    })
    // 204 — the widget fires these fire-and-forget and ignores the body.
    return new NextResponse(null, { status: 204, headers })
  } catch (err: unknown) {
    console.error('Widget event API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers })
  }
}
