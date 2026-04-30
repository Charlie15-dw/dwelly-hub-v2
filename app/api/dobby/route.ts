import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { TRAINING_PAGES, KNOWLEDGE_ARTICLES, ContentBlock } from '@/lib/training-content'
import { GLOSSARY_TERMS } from '@/lib/glossary-data'

// ─── Rate limiter ──────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 30

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
const MAX_MESSAGE_LENGTH = 800
const MAX_MESSAGES = 40

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

// ─── Content extractor ─────────────────────────────────────────────────────
function blocksToText(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'heading':
      case 'subheading':
        return `\n${block.text}\n`
      case 'paragraph':
        return block.text ?? ''
      case 'bullets':
        return (block.items ?? []).map(i => `- ${i}`).join('\n')
      case 'steps':
        return (block.items ?? []).map((i, idx) => `${idx + 1}. ${i}`).join('\n')
      case 'callout':
      case 'warning':
        return block.text ? `Note: ${block.text}` : ''
      case 'table':
        if (!block.headers || !block.rows) return ''
        const header = block.headers.join(' | ')
        const rows = block.rows.map(r => r.join(' | ')).join('\n')
        return `${header}\n${rows}`
      default:
        return ''
    }
  }).filter(Boolean).join('\n')
}

// ─── Build system prompt ───────────────────────────────────────────────────
function buildSystemPrompt(): string {
  const trainingContent = TRAINING_PAGES.map(page =>
    `=== TRAINING GUIDE: ${page.title} ===\n${blocksToText(page.content)}`
  ).join('\n\n')

  const knowledgeContent = KNOWLEDGE_ARTICLES.map(article =>
    `=== KNOWLEDGE ARTICLE: ${article.title} ===\n${blocksToText(article.content)}`
  ).join('\n\n')

  const glossaryContent = GLOSSARY_TERMS.map(term =>
    `${term.term}: ${term.definition} Context: ${term.context}`
  ).join('\n')

  return `You are Dobby, an internal assistant for the Dwelly Training Portal. You help property managers at Dwelly and its partner agencies with questions about their work.

IMPORTANT RULES — follow these exactly without exception:

1. Only use the information contained in the portal documents provided below. Do not use any outside knowledge, do not make assumptions, and do not infer or guess anything that is not clearly stated in the documents.

2. If you cannot find the answer clearly in the portal documents, say exactly this and nothing else: "I could not find this in the portal. Please raise this with Charlie Lockwood and we'll get that added to my knowledge base."

3. Never use bold text, bullet points with dashes or asterisks, numbered lists, headers, or any other markdown formatting. Write in plain, clear sentences only.

4. Keep answers concise and to the point. Write as if speaking to someone who is not particularly technical and works in UK residential lettings. Use plain, everyday English.

5. Do not add disclaimers, warnings, or suggestions to seek legal advice unless that specific advice is contained in the portal documents themselves.

6. Do not refer to yourself as Claude or an AI. You are Dobby, the Dwelly portal assistant.

7. If someone asks something outside of property management or Dwelly's processes, say: "I can only help with questions about Dwelly's processes and training. Please raise anything else with your manager."

---

PORTAL CONTENT:

${trainingContent}

${knowledgeContent}

GLOSSARY:
${glossaryContent}`
}

// Cache the system prompt — it is static
let cachedSystemPrompt: string | null = null

function getSystemPrompt(): string {
  if (!cachedSystemPrompt) {
    cachedSystemPrompt = buildSystemPrompt()
  }
  return cachedSystemPrompt
}

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'your-api-key-here') {
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

  const client = new Anthropic({ apiKey })

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: getSystemPrompt(),
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ message: text })
  } catch (err) {
    console.error('Dobby API error:', err)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
