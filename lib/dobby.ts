// Shared "Ask Dobby" brain. Both the in-Hub chat (app/api/dobby/route.ts) and the
// public widget endpoint used by the Dwelly Jobs panel (app/api/dobby/widget/route.ts)
// answer through this one module, so they always give identical responses from a
// single source of truth. The HTTP concerns (auth, CORS) live in the routes; all
// the retrieval, prompt-building and model-calling lives here.
import Anthropic from '@anthropic-ai/sdk'
import Groq from 'groq-sdk'
import { TRAINING_PAGES, KNOWLEDGE_ARTICLES, ContentBlock } from '@/lib/training-content'
import { CRM2_LESSONS, Crm2Block, Crm2Lesson } from '@/lib/crm2-content'
import { MAINTENANCE_LESSONS } from '@/lib/crm2-maintenance-content'
import { GLOSSARY_TERMS } from '@/lib/glossary-data'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Which slice of the knowledge base an answer may draw on.
//  - 'all'    : the full portal — every training page, knowledge article, CRM 2.0
//               section and glossary, plus general UK-lettings reasoning. In-Hub chat.
//  - 'dwelly' : Dwelly PROCESS content only — the process training pages (move-outs,
//               inspections, navigation, etc.) and the CRM 2.0 Maintenance/Compliance
//               sections. The general-law knowledge articles and outside-knowledge
//               fallback are withheld and pointed to the Hub instead. For maintenance
//               and compliance it uses the 2.0 content, not the legacy 1.0 pages.
//               Used by the Jobs-panel widget.
export type DobbyScope = 'all' | 'dwelly'

// In 'dwelly' scope these legacy CRM 1.0 training pages are withheld: maintenance
// and compliance are answered from the CRM 2.0 content instead, so the older 1.0
// steps can't surface and contradict it. This includes the two "Auto Mode vs On
// Hold" guides — they describe the 1.0 Auto/Pause and "Assign Progress: Certificate
// Issued" flow, which doesn't exist in the 2.0 stage-based process. A question like
// "what do I do when the landlord hasn't responded" matches them strongly, so left
// in scope they pull the widget back to the old flow instead of the current 2.0 SOP.
const DWELLY_SCOPE_EXCLUDED_PAGES = new Set([
  'maintenance',
  'compliance',
  'auto-vs-hold',
  'auto-vs-hold-compliance',
])

// ─── Rate limiter ──────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 30

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)
  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  entry.count++
  return { allowed: true, retryAfter: 0 }
}

// ─── Widget rate limiter ───────────────────────────────────────────────────
// The public widget endpoint is callable by anyone who finds the URL, so it gets
// a tighter limit than the logged-in Hub route: a low per-IP rate plus a global
// ceiling across all callers, so a flood from many IPs still can't run the model
// bill up without bound.
// NOTE: this is an in-memory, best-effort limiter. On serverless each instance
// has its own memory, so it's a backstop, not a hard cap — the real ceilings are
// the Vercel Firewall rate rules and the Anthropic account spending cap (Groq's too, while it
// remains the fallback).
const WIDGET_PER_IP_WINDOW_MS = 60_000      // 1 minute
const WIDGET_PER_IP_MAX = 10                // 10 requests / min / IP
const WIDGET_GLOBAL_WINDOW_MS = 3_600_000   // 1 hour
const WIDGET_GLOBAL_MAX = 300               // 300 requests / hour, all callers

const widgetIpStore = new Map<string, { count: number; resetAt: number }>()
let widgetGlobal = { count: 0, resetAt: 0 }

export function checkWidgetRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now()

  // Global ceiling first — once the hourly total is hit, nothing else gets through
  // regardless of which IP it comes from. A blocked request is not counted.
  if (now >= widgetGlobal.resetAt) {
    widgetGlobal = { count: 0, resetAt: now + WIDGET_GLOBAL_WINDOW_MS }
  }
  if (widgetGlobal.count >= WIDGET_GLOBAL_MAX) {
    return { allowed: false, retryAfter: Math.ceil((widgetGlobal.resetAt - now) / 1000) }
  }

  // Per-IP window.
  const entry = widgetIpStore.get(ip)
  if (!entry || now >= entry.resetAt) {
    widgetIpStore.set(ip, { count: 1, resetAt: now + WIDGET_PER_IP_WINDOW_MS })
    widgetGlobal.count++
    return { allowed: true, retryAfter: 0 }
  }
  if (entry.count >= WIDGET_PER_IP_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  entry.count++
  widgetGlobal.count++
  return { allowed: true, retryAfter: 0 }
}

// ─── Input validation ──────────────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 800
const MAX_MESSAGES = 20

function sanitiseString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

export function validateMessages(messages: unknown): ChatMessage[] {
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

// ─── CRM 2.0 content → searchable sections ─────────────────────────────────
// The CRM 2.0 compliance material lives in CRM2_LESSONS with a slightly richer
// block set than the training pages (it adds image/widget/faq). Rather than
// treat a whole lesson as one blob — the FAQ lesson alone is thousands of
// characters and would be truncated to nothing useful — we flatten each lesson
// into granular sections: one per heading, plus one per FAQ question/answer
// pair. That keeps every piece of the content individually retrievable, so a
// specific 2.0 question surfaces the exact answer instead of a truncated lesson.
function crm2BlockToText(block: Crm2Block): string {
  switch (block.type) {
    case 'heading':
    case 'subheading':
    case 'paragraph':
    case 'callout':
    case 'image': // `text` is the caption
      return block.text ?? ''
    case 'bullets':
    case 'steps':
      return (block.items ?? []).join('. ')
    case 'table':
      if (!block.headers || !block.rows) return ''
      return block.rows.map(r => r.join(': ')).join('. ')
    case 'faq':
      return (block.faqs ?? []).map(f => `${f.q} ${f.a}`).join(' ')
    default: // divider, widget
      return ''
  }
}

function buildCrm2Sections(lessons: Crm2Lesson[], track: string): { title: string; text: string }[] {
  const out: { title: string; text: string }[] = []
  for (const lesson of lessons) {
    // Practice/capstone are drills and assessment meta ("80% to pass"), not
    // knowledge — skip them so they don't pollute answers.
    if (lesson.kind === 'practice') continue

    const base = `CRM 2.0 ${track} — ${lesson.title}`
    let heading = base
    let buffer: string[] = [lesson.summary]

    const flush = () => {
      const text = buffer.filter(Boolean).join(' ').trim()
      if (text) out.push({ title: heading, text })
      buffer = []
    }

    for (const block of lesson.content) {
      if (block.type === 'heading') {
        flush()
        heading = block.text ? `${base}: ${block.text}` : base
        continue
      }
      // Each FAQ pair becomes its own section — the question text is a strong
      // keyword-match target, so the exact answer can surface on its own.
      if (block.type === 'faq') {
        for (const f of block.faqs ?? []) {
          out.push({ title: `${base} (FAQ)`, text: `${f.q} ${f.a}` })
        }
        continue
      }
      const t = crm2BlockToText(block)
      if (t) buffer.push(t)
    }
    flush()
  }
  return out
}

// Precomputed once at module load — the lesson set is static per deploy. Both
// 2.0 tracks (compliance and maintenance) are flattened so Dobby can answer from
// either; each section is tagged with its track in the title.
const CRM2_SECTIONS = [
  ...buildCrm2Sections(CRM2_LESSONS, 'Compliance'),
  ...buildCrm2Sections(MAINTENANCE_LESSONS, 'Maintenance'),
]

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
// limit no matter how large the knowledge base grows, and the per-question cost bounded
// (input tokens are billed on every request), so we cap the retrieved context (roughly 4 chars
// per token).
const MAX_SECTIONS = 5          // most relevant articles/pages to include
const MAX_SECTION_CHARS = 1500  // truncate each section so one long article can't dominate
const MAX_GLOSSARY_TERMS = 4    // matching glossary definitions to append
const MAX_GLOSSARY_CHARS = 300  // truncate each glossary definition
const MAX_CONTEXT_CHARS = 8000  // hard ceiling on the whole retrieved block

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

export function findRelevantContent(query: string, scope: DobbyScope = 'all', topN = MAX_SECTIONS): string {
  // In 'dwelly' scope the knowledge is Dwelly process only: the process training
  // pages (minus the legacy 1.0 maintenance/compliance pages) and the CRM 2.0
  // sections. The general-law knowledge articles are withheld — pointed to the Hub.
  const dwellyOnly = scope === 'dwelly'
  const includePage = (id: string) => !dwellyOnly || !DWELLY_SCOPE_EXCLUDED_PAGES.has(id)

  const keywords = extractKeywords(query)
  if (keywords.length === 0) {
    // No useful keywords — return a couple of trimmed sections as fallback.
    return TRAINING_PAGES.filter(p => includePage(p.id)).slice(0, 2)
      .map(p => `[${p.title}]\n${truncate(blocksToText(p.content), MAX_SECTION_CHARS)}`)
      .join('\n\n')
  }

  const sections: ScoredSection[] = []

  for (const page of TRAINING_PAGES) {
    if (!includePage(page.id)) continue
    const text = blocksToText(page.content)
    const score = scoreText(page.title + ' ' + text, keywords)
    if (score > 0) sections.push({ title: page.title, text, score })
  }

  // General-law knowledge articles only in the full in-Hub scope.
  if (!dwellyOnly) {
    for (const article of KNOWLEDGE_ARTICLES) {
      const text = blocksToText(article.content)
      const score = scoreText(article.title + ' ' + text, keywords)
      if (score > 0) sections.push({ title: article.title, text, score })
    }
  }

  for (const section of CRM2_SECTIONS) {
    const score = scoreText(section.title + ' ' + section.text, keywords)
    if (score > 0) sections.push({ title: section.title, text: section.text, score })
  }

  // Matching glossary terms, ranked by score, capped and truncated. Kept in both
  // scopes — these are Dwelly's own terminology, which helps process answers.
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
// The two framing paragraphs both prompts share — they keep Dobby from mixing up
// Dwelly's systems, which matters just as much in the 2.0-only widget.
const SYSTEM_FRAMING = `TWO DWELLY SYSTEMS — NEVER CONFUSE THEM:
Dwelly has two separate systems that both handle jobs, and they must never be mixed up.
- The internal Dwelly CRM is what Property Managers and Team Coordinators use. This is where "Auto mode", "On Hold" / "Pause mode", the Job Chat, provider instruction and the automated reminder flows live. These are Dwelly-side controls that only staff see — a contractor never sees any of them.
- The Maintenance Provider Portal (provider.dwelly.group) is what external contractors and providers use. It has only Active Jobs, Closed Jobs, Schedule and Earnings, and its job statuses are Awaiting Appointment, Awaiting Completion, Awaiting Invoice and Quote Sent. It has NO "Auto mode", NO "On Hold" and NO "Job Chat".
When a question is about what a contractor or provider does in their portal, answer only in terms of the provider portal. Never tell a contractor to check for "Auto mode" or "On Hold", or to use a "Job Chat" — those do not exist on their side. A contractor treats every job that appears in Active Jobs as a live work order: they book the visit with the tenant, carry out the work, then upload their invoice, certificate and completion photos (or reply to the job email) to close it and get paid.

CRM 2.0 (COMPLIANCE AND MAINTENANCE):
CRM 2.0 is Dwelly's newer, agent-driven version of the internal staff CRM. It runs two tracks: Compliance (certificate jobs — Gas Safety/CP12, EICR, EPC and so on) and Maintenance (repair jobs — a leak, a broken boiler, a blocked drain). In both, an AI agent runs the routine end to end and the operator steps in only at the human checkpoints. For compliance those are mainly Certificate review and Invoice review; for maintenance they are tidying the report at tenant triage, choosing the provider, and approving the invoice. One crucial difference between the tracks: in maintenance the agent NEVER picks the provider — provider selection is always a human choice in the picker — whereas in compliance the system can auto-assign a provider if the landlord is unresponsive. When content below is labelled "CRM 2.0 Compliance" or "CRM 2.0 Maintenance", it describes this staff-facing 2.0 system, not CRM 1.0 and not the provider portal. Answer CRM 2.0 questions from that content, keep the two tracks distinct, and if a 2.0 process differs from the older CRM, follow the 2.0 content. For maintenance and compliance, CRM 2.0 is the current, live process — treat it as the default and describe only the 2.0 stages, buttons and resolutions that appear in the 2.0 content. Do NOT blend in the older CRM 1.0 mechanics unless the person has explicitly asked about CRM 1.0 or the older/legacy system: in particular, "Assign Progress → Certificate Issued", manually setting a job to "On Hold" / "Pause mode", and the "LL pays directly" invoice step are CRM 1.0 ways of working and are wrong for a 2.0 answer. When a landlord arranges the work themselves in 2.0, that is the "Landlord DIY" resolution the operator selects; follow the 2.0 content for how it behaves and never invent a step the 2.0 content does not state.`

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

${SYSTEM_FRAMING}

RELEVANT PORTAL CONTENT:`

// Dwelly-process prompt for the Jobs-panel widget. Dobby here is a focused process
// helper: it answers from Dwelly's own process content provided below (move-outs,
// inspections, navigation and the like, plus the CRM 2.0 Maintenance and Compliance
// workflow), but it does NOT give general UK lettings law or best-practice guidance
// — those go to the Hub. For maintenance and compliance the content is the 2.0
// version, so this prompt and the retrieval scope reinforce each other.
const DWELLY_SYSTEM_PROMPT = `You are Dobby, the assistant inside the Dwelly Jobs panel. In here you help the team carry out Dwelly's own day-to-day processes — the things they do in the CRM on a live job. Answer like someone who knows the Dwelly workflow inside out.

HOW TO ANSWER:
1. Answer from the Dwelly process content provided below — how Dwelly handles move-outs, inspections, navigation and other day-to-day work, and the CRM 2.0 Maintenance and Compliance workflow. That content is your single source of truth.
2. For maintenance and compliance, use the CRM 2.0 content provided — that is the current process, and the only one. Keep the Maintenance and Compliance tracks distinct. Describe only the stages, buttons and resolutions that actually appear in that 2.0 content. Never fall back to the older CRM 1.0 way of working: do not tell the operator to use "Assign Progress → Certificate Issued", to manually set a job to "On Hold" / "Pause mode", or to set the invoice to "LL pays directly" — those are 1.0 mechanics and are wrong for 2.0. When a landlord arranges the work themselves, that is the "Landlord DIY" resolution the operator selects; follow the 2.0 content for how it then behaves, and if the content does not spell a step out, do not invent one.
3. Be specific and practical about the Dwelly steps — the exact buttons, stages, tags, checkpoints and SOP actions the operator should take.
4. Do NOT answer general UK residential lettings law, legislation or best-practice questions in here, even though you know them. That includes things like Section 8/Section 21 notices, deposit schemes, HMO licensing, Right to Rent law, disrepair and Awaab's Law, tenancy agreements and the like. For anything like that, say exactly: "That's general lettings guidance rather than a Dwelly process — head to the Hub and ask me there for the full detail." Do not give the legal answer here.
5. If a question is a genuine Dwelly process but the content below does not cover it, say exactly: "I could not find that process in my Dwelly content. Please head to the Hub or raise it with Charlie Lockwood." Do not fill the gap from outside knowledge.
6. Format answers as a short, scannable bullet list. Put each point on its own line starting with "- " (a dash and a space), and keep each bullet to one short line — ideally the exact button, stage or action. No bold, no numbered lists, no headers, no other markdown; just dash bullets and plain text.
7. Be brief — this is a quick in-job helper, not a full guide. Lead with the key action and aim for 2–5 short bullets. Only add a single short lead-in or closing line if it is genuinely needed; skip it otherwise.
8. You are Dobby. Never say you are an AI, and never refer to yourself as Claude, Gemini or Groq.

${SYSTEM_FRAMING}

RELEVANT DWELLY PROCESS CONTENT:`

// ─── Model call ────────────────────────────────────────────────────────────
// The Jobs-panel widget's Dobby (scope 'dwelly') answers through Claude Sonnet 5.5 (Anthropic);
// it moved off Groq's gpt-oss-120b in October 2026. The in-Hub Dobby (scope 'all') stays on Groq
// for now. For the widget, Groq is a FALLBACK, used when no ANTHROPIC_API_KEY is configured or a
// Claude call fails (outage, rate limit, a rejected request), so a problem on the Claude side
// degrades Dobby to the old model rather than taking it down. Every fallback is logged, and the
// routes report the model that answered in an X-Dobby-Model header, so a silent fallback shows up.
const DOBBY_MODEL = 'claude-sonnet-5-5'
// Thinking is on (adaptive, the model's default) and counts toward max_tokens, so this is set
// well above the length of a short bullet answer: at Groq's old 700 the thinking could crowd out
// the answer itself. Reply length is governed by the prompt, not by truncation.
const DOBBY_MAX_TOKENS = 2000

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null

/** Only the widget's Dobby uses Claude; the in-Hub Dobby is Groq-only until it moves too. */
function usesClaude(scope: DobbyScope): boolean {
  return scope === 'dwelly'
}

/**
 * Whether a model is configured for this scope. The routes answer 500 "Server configuration
 * error" if not.
 */
export function dobbyConfigured(scope: DobbyScope = 'all'): boolean {
  return !!groq || (usesClaude(scope) && !!anthropic)
}

// Shown in place of an answer when Claude's safety classifiers decline a question. Dobby is a
// lettings-process helper, so this should be rare; it must still read as a reply, not an error.
const REFUSAL_REPLY =
  "I can't help with that one here. Please check the Hub or ask your team lead."

// Claude's Messages API needs the conversation to start with the user and to end with the user's
// question: a trailing assistant turn would be read as a prefill, which Sonnet 5.5 rejects with a
// 400. validateMessages keeps only the last 20, which can begin on an assistant turn, and an empty
// message is rejected too. Groq accepted all three, so callers have never had to care.
function forClaude(messages: ChatMessage[]): ChatMessage[] {
  const out = messages.filter(m => m.content.length > 0)
  while (out.length && out[0].role === 'assistant') out.shift()
  while (out.length && out[out.length - 1].role === 'assistant') out.pop()
  return out
}

/**
 * Run a validated conversation through the Dobby brain and return its reply.
 * Retrieval is keyed off the latest user message. The scope selects which slice
 * of the knowledge base (and which system prompt) is used: 'all' for the full
 * in-Hub assistant, 'dwelly' for the Dwelly-process Jobs-panel widget. Throws if
 * the model call fails; callers decide how to surface that.
 */
export async function generateDobbyReply(
  messages: ChatMessage[],
  scope: DobbyScope = 'all'
): Promise<string> {
  return (await generateDobbyAnswer(messages, scope)).text
}

export interface DobbyAnswer {
  text: string
  /** The model that produced the text: 'claude-sonnet-5-5', or the Groq fallback's. */
  model: string
}

/** As generateDobbyReply, but also says which model answered — for the routes' header. */
export async function generateDobbyAnswer(
  messages: ChatMessage[],
  scope: DobbyScope = 'all'
): Promise<DobbyAnswer> {
  const latestUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content ?? ''
  const relevantContent = findRelevantContent(latestUserMessage, scope)
  const basePrompt = scope === 'dwelly' ? DWELLY_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT
  const systemPrompt = `${basePrompt}\n\n${relevantContent}`

  if (anthropic && usesClaude(scope)) {
    const conversation = forClaude(messages)
    if (!conversation.length) return { text: '', model: DOBBY_MODEL }
    try {
      const response = await anthropic.beta.messages.create({
        model: DOBBY_MODEL,
        max_tokens: DOBBY_MAX_TOKENS,
        system: systemPrompt,
        messages: conversation,
        // 'low' is the recommended starting point for chat on Sonnet 5.5: short, grounded answers
        // don't repay deeper thinking, and it keeps cost and latency down. No temperature — Sonnet
        // 5.5 rejects non-default sampling values; consistency comes from the prompt.
        output_config: { effort: 'low' },
        // On a safety decline in a category it covers, the API re-runs the request on a fallback
        // model inside the same call. Requires the beta endpoint and this exact header.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
      })
      if (response.stop_reason === 'refusal') return { text: REFUSAL_REPLY, model: DOBBY_MODEL }
      // Read by block type: with thinking on, the response can begin with a thinking block.
      const text = response.content
        .map(block => (block.type === 'text' ? block.text : ''))
        .join('')
        .trim()
      return { text, model: DOBBY_MODEL }
    } catch (err) {
      // Typed errors, most specific first, so the logs say which kind of failure it was.
      if (err instanceof Anthropic.RateLimitError) {
        console.error('Dobby: Claude rate limit reached', err.status)
      } else if (err instanceof Anthropic.AuthenticationError) {
        console.error('Dobby: ANTHROPIC_API_KEY was rejected')
      } else if (err instanceof Anthropic.APIError) {
        console.error('Dobby: Claude API error', err.status, err.message)
      } else {
        console.error('Dobby: Claude call failed', err)
      }
      if (!groq) throw err
      console.warn('Dobby: falling back to Groq after the Claude failure above')
    }
  } else if (usesClaude(scope)) {
    console.warn('Dobby: ANTHROPIC_API_KEY is not set; answering with Groq')
  }

  if (!groq) throw new Error('No Dobby model configured')
  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    max_tokens: 700,
    temperature: 0.2,
  })

  return { text: completion.choices[0]?.message?.content ?? '', model: 'groq/openai/gpt-oss-120b' }
}
