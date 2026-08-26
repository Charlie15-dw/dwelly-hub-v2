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

// Reduce a word to a rough stem so query terms match related forms in the
// content (e.g. "owes"→"owe", "refusing"→"refus", "payments"→"payment"). Crude
// but effective at improving recall for the keyword search.
function stem(word: string): string {
  if (word.length <= 4) return word
  for (const suffix of ['ing', 'edly', 'edly', 'ies', 'ied', 'ed', 'es', 's']) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      return word.slice(0, word.length - suffix.length)
    }
  }
  return word
}

function extractKeywords(query: string): string[] {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
  // Include both the original word and its stem to widen matching.
  const expanded = new Set<string>()
  for (const w of words) {
    expanded.add(w)
    expanded.add(stem(w))
  }
  return Array.from(expanded)
}

// Budgets that keep the injected context well under the model's tokens-per-minute
// limit no matter how large the knowledge base grows. Groq counts input + output
// tokens together, so we cap the retrieved context (roughly 4 chars per token).
const MAX_SECTIONS = 5          // most relevant articles/pages to include
const MAX_SECTION_CHARS = 1500  // truncate each section so one long article can't dominate
const MAX_GLOSSARY_TERMS = 4    // matching glossary definitions to append
const MAX_GLOSSARY_CHARS = 300  // truncate each glossary definition
const MAX_CONTEXT_CHARS = 8000  // hard ceiling on the whole retrieved block

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

function findRelevantContent(query: string, topN = MAX_SECTIONS): string {
  const keywords = extractKeywords(query)
  if (keywords.length === 0) {
    // No useful keywords — return a couple of trimmed sections as fallback
    return TRAINING_PAGES.slice(0, 2)
      .map(p => `[${p.title}]\n${truncate(blocksToText(p.content), MAX_SECTION_CHARS)}`)
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

  // Matching glossary terms, ranked by score, capped and truncated
  const glossaryMatches = GLOSSARY_TERMS
    .map(t => ({ t, score: scoreText(t.term + ' ' + t.definition, keywords) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_GLOSSARY_TERMS)
    .map(({ t }) => `${t.term}: ${truncate(t.definition, MAX_GLOSSARY_CHARS)}`)
    .join('\n')

  const ranked = sections.sort((a, b) => b.score - a.score).slice(0, topN)

  // Greedily add sections until the overall character budget is reached, so the
  // request can never exceed the model's tokens-per-minute limit.
  const parts: string[] = []
  let used = 0
  for (const s of ranked) {
    const block = `[${s.title}]\n${truncate(s.text, MAX_SECTION_CHARS)}`
    if (used + block.length > MAX_CONTEXT_CHARS) break
    parts.push(block)
    used += block.length
  }

  const top = parts.join('\n\n')

  return [top, glossaryMatches ? `GLOSSARY:\n${glossaryMatches}` : '']
    .filter(Boolean)
    .join('\n\n')
}

// ─── System prompt ─────────────────────────────────────────────────────────
const BASE_SYSTEM_PROMPT = `You are Dobby, the expert assistant for the Dwelly Training Portal. You help property managers at Dwelly and its partner agencies with UK residential lettings (England) and their day-to-day work. Think and answer like an experienced, knowledgeable property professional.

HOW TO ANSWER:
1. Use the portal knowledge provided below as your primary source, and prefer it whenever it is relevant to the question.
2. You are a knowledgeable UK residential lettings professional. When the portal content does not fully cover a question, apply well-established general knowledge of UK residential lettings law and best practice (England, under the Renters' Rights Act 2025 framework) to give a practical, accurate and genuinely helpful answer. Never invent Dwelly-specific processes, figures, names, forms or policies that are not in the portal.
3. Be specific and practical. Give the actual steps the person should take, and reason through the situation even if it is an unusual or edge-case scenario. It is far better to give clear, careful guidance than to refuse.
4. For legal, financial or high-risk situations, give practical guidance and then recommend escalating to a manager or the MD, or suggest the landlord or tenant take independent legal advice, where that is genuinely warranted.
5. Only if the question is genuinely outside UK residential lettings and property management, or you truly cannot help, say: "I could not find this in the portal. Please raise this with Charlie Lockwood and we'll get that added to my knowledge base." Use this as a last resort, never for a question you can reasonably help with.
6. Write in plain sentences only. No bold, no bullet points, no numbered lists, no headers, no markdown formatting of any kind.
7. Keep answers clear and reasonably concise. Write for someone working in UK residential lettings who is not a lawyer.
8. You are Dobby. Never say you are an AI, and never refer to yourself as Claude, Gemini or Groq.

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
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 700,
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
