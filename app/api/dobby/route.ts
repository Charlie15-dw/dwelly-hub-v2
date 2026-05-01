import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
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

// ─── Stop words to ignore when scoring ────────────────────────────────────
const STOP_WORDS = new Set([
  'a','an','the','is','it','in','on','at','to','for','of','and','or','but',
  'what','how','when','where','why','who','which','do','does','did','i',
  'my','me','we','our','you','your','be','been','was','are','have','has',
  'had','not','can','will','would','should','could','with','about','that',
  'this','they','them','their','there','if','so','from','by','as','up',
])

// ─── Keyword search: find most relevant sections ───────────────────────────
interface ScoredSection {
  title: string
  text: string
  score: number
}

function scoreText(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  return keywords.reduce((score, kw) => {
    // Exact word match scores 2, partial match scores 1
    const exactRegex = new RegExp(`\\b${kw}\\b`, 'g')
    const exactMatches = (lower.match(exactRegex) ?? []).length
    const partialMatches = lower.includes(kw) ? 1 : 0
    return score + exactMatches * 2 + partialMatches
  }, 0)
}

function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

function findRelevantContent(query: string, topN = 5): string {
  const keywords = extractKeywords(query)
  if (keywords.length === 0) {
    // No useful keywords — return first few sections as fallback
    return TRAINING_PAGES.slice(0, 3)
      .map(p => `[${p.title}]\n${blocksToText(p.content)}`)
      .join('\n\n')
  }

  const sections: ScoredSection[] = []

  for (const page of TRAINING_PAGES) {
    const text = blocksToText(page.content)
    const score = scoreText(page.title + ' ' + text, keywords)
    if (score > 0) sections.push({ title: page.title, text, score })
  }

  for (const article of KNOWLEDGE_ARTICLES) {
    const text = blocksToText(article.content)
    const score = scoreText(article.title + ' ' + text, keywords)
    if (score > 0) sections.push({ title: article.title, text, score })
  }

  // Always include matching glossary terms
  const glossaryMatches = GLOSSARY_TERMS
    .filter(t => keywords.some(kw => t.term.toLowerCase().includes(kw) || t.definition.toLowerCase().includes(kw)))
    .map(t => `${t.term}: ${t.definition}`)
    .join('\n')

  const top = sections
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(s => `[${s.title}]\n${s.text}`)
    .join('\n\n')

  return [top, glossaryMatches ? `GLOSSARY:\n${glossaryMatches}` : '']
    .filter(Boolean)
    .join('\n\n')
}

// ─── System prompt ─────────────────────────────────────────────────────────
const BASE_SYSTEM_PROMPT = `You are Dobby, an internal assistant for the Dwelly Training Portal. You help property managers at Dwelly and its partner agencies with questions about their work.

RULES - follow without exception:
1. Only use the portal knowledge provided below. Do not use outside knowledge or make assumptions.
2. If the answer is not clearly in the knowledge below, say exactly: "I could not find this in the portal. Please raise this with Charlie Lockwood and we'll get that added to my knowledge base."
3. Write in plain sentences only. No bold, no bullet points, no numbered lists, no headers, no markdown formatting of any kind.
4. Keep answers short and clear. Write for someone working in UK residential lettings who is not technical.
5. Do not suggest seeking legal advice unless the portal documents themselves say to do so.
6. You are Dobby. Do not say you are an AI or refer to yourself as Claude or Gemini or Groq.
7. If asked something unrelated to property management or Dwelly, say: "I can only help with questions about Dwelly's processes and training. Please raise anything else with your manager."

RELEVANT PORTAL CONTENT:`

// ─── Route handler ─────────────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  if (!process.env.GROQ_API_KEY) {
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

  // Use the latest user message to find relevant content
  const latestUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content ?? ''
  const relevantContent = findRelevantContent(latestUserMessage)

  const systemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${relevantContent}`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 400,
      temperature: 0.2,
    })

    const text = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json({ message: text })

  } catch (err: unknown) {
    console.error('Dobby API error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
