# Dwelly Training Portal — Governance & Security Policy

> Version 1.0 · April 2026 · Owner: Platform Lead  
> Review cycle: Quarterly — next review July 2026

---

## 1. Overview

This document defines the governance controls for the Dwelly Training Portal. All controls apply at the application layer and must be enforced server-side. Client-side validation is supplemental only and must never be the sole enforcement mechanism.

The portal handles personally identifiable data (staff names, assessment scores, CPD records, competency sign-off audit trails) and must operate to standards consistent with UK GDPR, the Data Protection Act 2018, and the internal compliance obligations of a regulated property management environment.

---

## 2. Authentication & Session Controls

### 2.1 Required Controls

| Control | Requirement | Implementation |
|---|---|---|
| Authentication method | Email + password with bcrypt hashing (min cost factor 12) | `next-auth` or equivalent |
| Session token | HTTPOnly, SameSite=Strict, Secure cookies only | Set in `auth()` middleware |
| Session expiry | Idle timeout: 30 minutes; absolute timeout: 8 hours | Enforced server-side |
| Remember me | Max 30-day persistent session; scoped to device | Separate long-lived token |
| Failed login lockout | 5 consecutive failures → 15-minute lockout | Tracked per email, IP |
| MFA (future) | TOTP recommended for manager and admin roles | Phase 2 enhancement |

### 2.2 Route Protection

All portal routes under `/app/(portal)/` must verify an authenticated session before rendering. Unauthenticated requests must redirect to `/` (login).

**Next.js middleware implementation:**

```typescript
// middleware.ts (project root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/modules', '/passport', '/manager', '/quiz', '/dobby']

export function middleware(request: NextRequest) {
  const session = request.cookies.get('dwelly_session')
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Manager-only routes
  if (pathname.startsWith('/manager')) {
    const role = request.cookies.get('dwelly_role')?.value
    if (role !== 'manager' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api/health).*)'],
}
```

### 2.3 Password Policy

- Minimum 10 characters
- Must include at least one uppercase letter, one number, and one special character
- Disallow passwords appearing in the top 10,000 common password list
- Password reset tokens: single-use, expire after 60 minutes, transmitted via email only
- No password hints stored

---

## 3. Rate Limiting

Rate limiting must be enforced at the edge (CDN/reverse proxy) and application layer. Both levels must be active in production.

### 3.1 API Route Limits

| Route | Limit | Window | Scope |
|---|---|---|---|
| `POST /api/auth/login` | 10 requests | 15 minutes | Per IP + email |
| `POST /api/auth/reset-password` | 3 requests | 60 minutes | Per email |
| `POST /api/quiz/submit` | 30 requests | 60 minutes | Per authenticated user |
| `GET /api/modules` | 120 requests | 60 minutes | Per authenticated user |
| `POST /api/dobby/chat` | 20 requests | 60 minutes | Per authenticated user |
| `POST /api/cpd/log` | 10 requests | 60 minutes | Per authenticated user |
| All other API routes | 200 requests | 60 minutes | Per authenticated user |

### 3.2 Implementation (Upstash Redis recommended)

```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const loginRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '15 m'),
  prefix: 'dwelly:ratelimit:login',
})

export const dobbyRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '60 m'),
  prefix: 'dwelly:ratelimit:dobby',
})

// Usage in API route:
// const { success, limit, remaining } = await loginRateLimit.limit(ip)
// if (!success) return Response.json({ error: 'Too many requests' }, { status: 429 })
```

### 3.3 Rate Limit Response

All rate-limited responses must:
- Return HTTP `429 Too Many Requests`
- Include `Retry-After` header (seconds until reset)
- Include `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers
- Return a user-friendly JSON body: `{ "error": "Too many requests. Please try again in X minutes." }`
- Never reveal whether a specific account exists (prevents user enumeration)

---

## 4. Input Validation

All user-supplied input must be validated and sanitised server-side before processing or storage. The following rules apply without exception.

### 4.1 Validation Rules by Field Type

| Field Type | Validation Required |
|---|---|
| Email addresses | RFC 5322 format, max 254 chars, domain checked against allowlist (`dwelly.co.uk`) |
| Names | Alphanumeric + hyphen/apostrophe only, 1–100 chars, no HTML |
| Free text (CPD notes, Dobby input) | Max 2000 chars, strip HTML tags, encode for output |
| Quiz answers | Enum validation — must be integer 0–3, no other values accepted |
| File uploads (future) | Allowlisted MIME types only (PDF, DOCX, MP4), max 50 MB, scanned pre-storage |
| Dates | ISO 8601 format, within reasonable range (2020–2030) |
| Numeric scores | Integer 0–100 only, server-calculated not client-supplied |
| Module IDs | Validated against known ID list; no dynamic path construction |

### 4.2 Validation Library

Use `zod` for all API route validation. Schema validation must occur before any database write or external call.

```typescript
// Example: CPD log entry validation
import { z } from 'zod'

export const CPDEntrySchema = z.object({
  title:  z.string().min(3).max(200).trim(),
  type:   z.enum(['formal', 'technical', 'reflective']),
  hours:  z.number().min(0.25).max(8).multipleOf(0.25),
  source: z.string().min(2).max(200).trim(),
  date:   z.string().datetime().refine(d => new Date(d) <= new Date(), {
    message: 'CPD date cannot be in the future',
  }),
})

// In API route:
// const result = CPDEntrySchema.safeParse(req.body)
// if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })
```

### 4.3 Output Encoding

- All user-generated content rendered in the browser must be HTML-encoded
- Never use `dangerouslySetInnerHTML` with user data
- Use React's default JSX escaping for all dynamic content

### 4.4 SQL / ORM Safety

- Use parameterised queries exclusively — no string concatenation with user input
- If using Prisma or Drizzle, use the ORM query builder; never raw SQL with interpolated values

---

## 5. Usage Caps & Quotas

### 5.1 AI / Dobby Usage

Dobby is powered by an LLM API with per-token costs. The following caps apply to prevent abuse and control spend:

| Cap | Limit | Enforcement |
|---|---|---|
| Daily messages per user | 50 messages / day | Redis counter, resets midnight UTC |
| Message length | Max 500 characters input | Server-side validation + client hint |
| Response length | Max 800 tokens output | API parameter `max_tokens` |
| Monthly team total | 10,000 messages / month | Admin dashboard alert at 80% |

Usage above caps must return a clear, non-technical error message pointing to the manager for escalation.

### 5.2 Quiz Attempt Caps

To prevent score gaming and preserve assessment integrity:

| Control | Rule |
|---|---|
| Attempts per module per day | Maximum 3 attempts; 4-hour cooldown after 3rd failure |
| Minimum time per quiz | Reject submissions under 30 seconds (prevents rapid-fire guessing) |
| Score recording | Best score within 3 attempts is recorded; all attempts logged for audit |
| Cooldown period | 4 hours after exhausting daily attempts |

### 5.3 File / Export Quotas

| Operation | Limit |
|---|---|
| Competency Passport exports | 5 exports per 24 hours per user |
| Manager report exports | 10 exports per 24 hours per manager |
| Bulk data exports (admin) | Require explicit admin approval; logged |

---

## 6. Audit Logging

### 6.1 Events That Must Be Logged

All of the following events must produce an immutable, tamper-evident log entry:

| Event | Data to Log |
|---|---|
| Login (success/failure) | User ID or attempted email, IP, timestamp, outcome |
| Password change/reset | User ID, IP, timestamp |
| Module completion | User ID, module ID, score, attempt number, timestamp |
| Competency sign-off | User ID, competency area, signing manager, timestamp |
| CPD entry created/edited | User ID, entry details, timestamp, source |
| Dobby query | User ID, question hash (not full text), timestamp |
| Admin role changes | Admin performing change, affected user, old/new role, timestamp |
| Failed rate limit | IP, route, timestamp |
| Data export | Exporting user, export type, record count, timestamp |

### 6.2 Log Retention

- All audit logs: minimum 7 years (aligned with property management regulatory requirements)
- Session logs: 90 days
- Error logs: 12 months

---

## 7. Data Protection (UK GDPR)

| Requirement | Implementation |
|---|---|
| Lawful basis | Legitimate interest (staff training and competency management) documented |
| Data minimisation | Only collect data needed for training pathway and compliance audit |
| Right to access | Staff can request their full competency record export at any time |
| Right to erasure | Leavers: anonymise assessment scores, delete PII within 30 days of departure |
| Data residency | All data stored on UK/EU servers only |
| Encryption at rest | AES-256 for database storage |
| Encryption in transit | TLS 1.2 minimum; TLS 1.3 preferred |
| Third-party processors | Dobby AI provider must be under a Data Processing Agreement |

---

## 8. Security Headers

The following HTTP security headers must be set on all responses via `next.config.js`:

```javascript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',       value: 'on' },
  { key: 'Strict-Transport-Security',    value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options',              value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',       value: 'nosniff' },
  { key: 'Referrer-Policy',              value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',           value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",   // Tighten once nonce-based CSP is implemented
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://api.anthropic.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]
```

---

## 9. Environment Variables & Secrets

**Never commit secrets to version control.** All sensitive values must be stored in environment variables and injected at deployment time.

| Variable | Purpose | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Production |
| `NEXTAUTH_SECRET` | Session signing key (min 32 chars random) | Production |
| `NEXTAUTH_URL` | Canonical site URL | Production |
| `ANTHROPIC_API_KEY` | Dobby / Claude API key | Production |
| `UPSTASH_REDIS_REST_URL` | Rate limiting Redis | Production |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting Redis auth | Production |

`.env.local` must be in `.gitignore`. A `.env.example` file with placeholder values must be maintained.

---

## 10. Governance Check Procedure

Run the following checks before each production deployment:

```bash
# 1. Dependency audit
npm audit --audit-level=high

# 2. TypeScript strict check
npx tsc --noEmit

# 3. Lint check
npx eslint . --ext .ts,.tsx --max-warnings 0

# 4. Security headers check (once deployed)
# curl -I https://training.dwelly.co.uk | grep -E "Strict-Transport|X-Frame|Content-Security"

# 5. Rate limit smoke test (login route)
# for i in {1..11}; do curl -X POST /api/auth/login -d '{"email":"test@test.com","password":"wrong"}'; done
# 11th request should return 429

# 6. Auth bypass test (unauthenticated request to protected route)
# curl -I https://training.dwelly.co.uk/dashboard
# Should return 302 → /
```

---

## 11. Incident Response

| Severity | Definition | Response Time | Owner |
|---|---|---|---|
| P1 — Critical | Unauthorised data access, auth bypass | 1 hour | Platform Lead + DPO |
| P2 — High | Rate limit bypass, injection attempt detected | 4 hours | Platform Lead |
| P3 — Medium | Repeated failed login campaigns | 24 hours | Platform Lead |
| P4 — Low | Minor input validation gaps | Next sprint | Dev Team |

All P1/P2 incidents must be reported to the Data Protection Officer and documented in the incident log.

---

*Dwelly Training Portal · Built to financial industry standards · Last updated: April 2026*
