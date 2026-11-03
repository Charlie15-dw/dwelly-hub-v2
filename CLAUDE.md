# dwelly-hub-v2

Rebuild of the Dwelly Hub/Training Portal — cloned from the original Portal
repo as a starting scaffold, now diverging: (1) full re-theme to the real
dwelly.group brand, (2) department-aware IA (role vs. department split,
welcome gate, department-scoped content/assessments).

## Stack
- Next.js 14 (app router), React 18, TypeScript
- Tailwind CSS 3.4
- Supabase (`@supabase/ssr`) — auth, profiles, content completions, assessments
- Vitest for tests

## Folder structure
- `app/(onboarding)/` — route group, gated onboarding/welcome flow
- `app/(portal)/` — route group, main signed-in Hub/Portal
- `app/api/` — route handlers (server-side writes via service-role client)
- `middleware.ts` + `lib/onboarding-gate.ts` — gates every request; redirects
  based on `role`, `department`, `onboarding_stage`, and welcome-step
  completion (reads `user_profiles` + `content_completions`)
- `lib/departments.ts` — `Department` type + `DEPARTMENT_META` (per-department
  copy/colours/assessment prefixes), `canSitAssessment()` logic
- `lib/onboarding.ts` — PM's 6-stage curriculum map (existing, pre-rebuild)
- `scripts/supabase-departments.sql` — department enum/column, `assessment_overrides`
  table + RLS, mirrors `canSitAssessment()` in SQL (keep both in sync)
- `components/hub/ContentCompletionButton.tsx` — reference pattern for
  "mark complete" against `content_completions` (user_id, content_type, content_id)

## Brand palette (dwelly.group)
- Black: `#101010` (near-black, text/dark surfaces — was `navy`)
- Grey: `#7D7C86` (bombay grey, secondary text/muted — was `teal`)
- Dark grey: `#404044` (tertiary accents — was `gold`)
- Accent blue: `#2C68ED` (primary CTA/active state — was `orange`/Apple blue `#0071E3`)
- Secondary gradient: pink `#FF3264` → orange `#FF850A` (`sunset` token, new)
- White: `#FFFFFF`

`navy`/`teal`/`gold` are now three *identical* neutral 50–900 scales anchored
on black/grey (kept as three token names for backward-compat with existing
class usage, not because they differ). `orange` is the real blue accent scale.

Full old→new hex remap (Apple palette → brand palette), for literal
`bg-[#...]`-style Tailwind arbitrary values scattered through components:
```
#F5F5F7 → #F2F2F3   #E8E8ED → #E2E2E4   #D2D2D7 → #C8C8CC
#AEAEB2 → #AEAEB4   #8E8E93 → #94949C   #636366 → #7D7C86
#48484A → #5E5E65   #3A3A3C → #404044   #2C2C2E → #262628
#1D1D1F → #101010
#0071E3 → #2C68ED   #0077ED → #3D74EE
#CCE4FF → #D5E1FB   #F0F7FF → #EEF3FE   #99C8FF → #ABC3F8
#66ADFF → #80A4F4   #3391FF → #5686F1   #0064CC → #295DD2
#0056B3 → #2551B4   #004A99 → #214595   #003D80 → #1D3873
```
Leave unchanged (semantic, not brand): RAG status colors (`.rag-red/amber/green`)
and the iOS success green `#34C759`.

## Fonts
Inter, via `next/font/google` in `app/layout.tsx` exposed as CSS var
`--font-inter` (already wired into `tailwind.config.ts` → `fontFamily.sans`).
Fallback stack after Inter: `-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif`.

## Working rules for this rebuild
- Re-theme is global config/CSS first (`tailwind.config.ts`, `globals.css`
  `:root` vars + `@layer components`), then a scripted hex find-and-replace
  across `app/`/`components`/`lib` for literal arbitrary-value hex classes —
  not manual per-file edits.
- Department rebuild: `role` = permission tier (member/manager/admin),
  `department` = content track (property-management/tenant-find/finance/
  property-specialist). Don't conflate them.
- Non-PM departments skip PM's staged onboarding curriculum entirely
  (`isGraduated()` short-circuits on `department !== 'property-management'`).
- `/welcome/navigation` and `/welcome/role` are referenced by the gate logic
  but **do not exist yet** — known gap, next thing to build.
- Keep `scripts/supabase-departments.sql` and `lib/departments.ts` in sync
  whenever department-gating logic changes.
