// Public "Ask Dobby" endpoint for the Dwelly Jobs panel widget. Unlike the
// in-Hub route, callers here are not logged into the Hub (no Supabase session),
// so access is gated two ways instead: the request Origin must be on the
// allowlist, and — when DOBBY_WIDGET_KEY is set — the request must carry the
// matching x-dobby-key header. It answers through the same shared brain as the
// Hub (lib/dobby.ts), so responses are identical.
import { NextRequest, NextResponse } from 'next/server'
import { checkWidgetRateLimit, validateMessages, generateDobbyReply } from '@/lib/dobby'

// Origins allowed to embed the widget and call this endpoint. The Jobs panel is
// the default; extra origins can be added via DOBBY_WIDGET_ORIGINS (comma-separated).
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

// The widget renders Dobby's reply as plain text (no Markdown parser), so any
// stray emphasis or heading markers the model slips in would show as literal
// characters. Strip them here — keeping the dash bullets, which are what we want.
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')      // **bold** → bold
    .replace(/__([^_]+)__/g, '$1')          // __bold__ → bold
    .replace(/^[ \t]*[*+][ \t]+/gm, '- ')   // *, + list markers → dash bullet
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, '')   // # headings → plain line
    .replace(/`([^`]+)`/g, '$1')            // `code` → code
    .replace(/\*\*|__/g, '')                // any leftover emphasis runs
    .trim()
}

// Build the CORS headers for a given request origin. Only echoes the origin back
// when it is on the allowlist, so disallowed sites get no CORS grant.
function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-dobby-key',
    'Access-Control-Max-Age': '86400',
  }
  if (isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin as string
  return headers
}

// Preflight — browsers send this before the cross-origin POST.
export function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const headers = corsHeaders(origin)

  // Origin must be on the allowlist.
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403, headers })
  }

  // Shared-secret gate. When DOBBY_WIDGET_KEY is configured, the caller must send
  // a matching x-dobby-key header. Left unset in environments that rely on the
  // origin allowlist alone.
  const expectedKey = process.env.DOBBY_WIDGET_KEY
  if (expectedKey) {
    const providedKey = req.headers.get('x-dobby-key')
    if (providedKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }
  }

  // Rate limit: tight per-IP plus a global hourly ceiling (this endpoint is
  // public, so it gets a stricter limiter than the logged-in Hub route).
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
  const { allowed, retryAfter } = checkWidgetRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { ...headers, 'Retry-After': String(retryAfter) } }
    )
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500, headers })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers })
  }

  const { messages: rawMessages } = body as Record<string, unknown>
  const messages = validateMessages(rawMessages)

  if (messages.length === 0) {
    return NextResponse.json({ error: 'No valid messages provided' }, { status: 400, headers })
  }

  try {
    // The widget is a Dwelly-process helper — answer from Dwelly's own process
    // content (move-outs, inspections, 2.0 Maintenance/Compliance), but send
    // general lettings-law questions to the Hub rather than answering them here.
    const text = await generateDobbyReply(messages, 'dwelly')
    return NextResponse.json({ message: stripMarkdown(text) }, { headers })
  } catch (err: unknown) {
    console.error('Dobby widget API error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers })
  }
}
