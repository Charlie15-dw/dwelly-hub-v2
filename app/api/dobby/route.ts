import { GoogleGenerativeAI } from '@google/generative-ai'
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
const MAX_MESSAGES = 20

function sanitiseString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function validateMessages(messages: unknown): { role: 'user' | 'assistant'; content: string }[] {
  if (!Array.isArray(messages)) return []
  return messages
    .slice(-MAX_MESSAGES)
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
        return block.text ?? ''
      case 'paragraph':
        return block.text ?? ''
      case 'bullets':
        return (block.items ?? []).join('. ')
      case 'steps':
        return (block.items ?? []).join('. ')
      case 'callout':
      case 'warning':
        return block.text ?? ''
      case 'table':
        if (!block.headers || !block.rows) return ''
        return block.rows.map(r => r.join(': ')).join('. ')
      default:
        return ''
    }
  }).filter(Boolean).join(' ')
}

// ─── Build system prompt ───────────────────────────────────────────────────
function buildSystemPrompt(): string {
  const trainingContent = TRAINING_PAGES.map(page =>
    `[${page.title}] ${blocksToText(page.content)}`
  ).join('\n\n')

  const knowledgeContent = KNOWLEDGE_ARTICLES.map(article =>
    `[${article.title}] ${blocksToText(article.content)}`
  ).join('\n\n')

  const glossaryContent = GLOSSARY_TERMS.map(term =>
    `${term.term}: ${term.definition}`
  ).join('\n')

  return `You are Dobby, an internal assistant for the Dwelly Training Portal. You help property managers at Dwelly and its partner agencies with questions about their work.

RULES - follow without exception:
1. Only use the portal knowledge provided below. Do not use outside knowledge or make assumptions about anything not clearly stated.
2. If the answer is not clearly in the knowledge below, say exactly this: "I could not find this in the portal. Please raise this with Charlie Lockwood and we'll get that added to my knowledge base."
3. Write in plain sentences only. No bold, no bullet points, no numbered lists, no headers, no markdown formatting of any kind.
4. Keep answers short and clear. Write for someone working in UK residential lettings who is not technical.
5. Do not suggest seeking legal advice unless the portal documents themselves say to do so.
6. You are Dobby. Do not say you are an AI or refer to yourself as Claude or Gemini.
7. If asked something unrelated to property management or Dwelly, say: "I can only help with questions about Dwelly's processes and training. Please raise anything else with your manager."

PORTAL KNOWLEDGE:

${trainingContent}

${knowledgeContent}

GLOSSARY:
${glossaryContent}`
}

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

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
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
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: getSystemPrompt(),
    })

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const lastMessage = messages[messages.length - 1].content

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(lastMessage)
    const text = result.response.text()

    return NextResponse.json({ message: text })
  } catch (err: unknown) {
    console.error('Dobby API error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
