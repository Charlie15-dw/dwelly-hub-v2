// Departments — the new cross-business IA.
//
// `department` (set in Supabase, see scripts/supabase-departments.sql) decides
// which role-overview and training content a user sees, and locks assessment
// access to that track (DB-enforced via RLS, not just a UI hide). It is
// separate from `role`, which is the permission tier (property-manager /
// manager / admin) and is untouched by any of this.
//
// Content below is drawn from real material already gathered for the
// business-wide training coordination plan (Eishan for Tenant Find, Alexey for
// Finance, Matan for Property Specialists). Property Management is the fully
// built track; the others are deliberately honest about what's built vs. what
// isn't yet — matching the hosted "Dwelly Onboarding Training Programme" plan,
// not inventing content ahead of it.

export type Department =
  | 'property-management'
  | 'tenant-find'
  | 'finance'
  | 'property-specialist'

export const DEPARTMENTS: Department[] = [
  'property-management',
  'tenant-find',
  'finance',
  'property-specialist',
]

export interface DepartmentMeta {
  id: Department
  label: string
  shortLabel: string
  icon: string // emoji, consistent with the rest of the Hub's content metadata
  colour: string // Tailwind badge classes
  summary: string
  whatGoodLooksLike: string[]
  expectations: string[]
  crossovers: string[]
  trainingStatus: 'built' | 'early' | 'not-started'
  trainingStatusNote: string
  // Assessment ids belonging to this department, for the department-lock
  // check. Only Property Management has real assessments today — see
  // lib/data.ts / lib/crm2-content.ts / lib/crm2-maintenance-content.ts.
  assessmentIdPrefixes: string[]
}

export const DEPARTMENT_META: Record<Department, DepartmentMeta> = {
  'property-management': {
    id: 'property-management',
    label: 'Property Management',
    shortLabel: 'PM',
    icon: '🏠',
    colour: 'bg-[#EEF3FE] text-[#2C68ED] border border-[#D5E1FB]',
    summary: 'Keeps every managed property compliant, maintained and running day to day once a tenancy is live.',
    whatGoodLooksLike: [
      'Compliance certificates (gas, EICR, EPC) never lapse',
      'Maintenance requests triaged and actioned promptly, contractor choice is judgement-led',
      'Inspections completed on schedule with clear, actionable reports',
      'Deposit disputes handled well and won on the evidence',
      'SOP adherence — the right process followed, not just the right outcome',
    ],
    expectations: [
      'Work every CRM 2.0 queue (maintenance, compliance, move-outs) to the published SOP',
      'Escalate anything outside your authority rather than guessing',
      'Keep landlords and tenants informed at each step of a case',
    ],
    crossovers: [
      'Tenant Find hands over a new tenancy to you at move-in — the condition and information they pass on sets up your first 90 days',
      'Finance relies on you to flag arrears, deposit deductions and contractor invoices accurately and on time',
      'Property Specialists carry out the inspections and visits you schedule — their reports are your evidence',
    ],
    trainingStatus: 'built',
    trainingStatusNote: 'Fully built: 6 modules, CRM 2.0 compliance + maintenance tracks, tiered assessments, and the full supporting-tools set (Glossary, Ask Dobby, Deposit Simulator, Law & Legislation Feed, Emergency Procedures, Recap & Refresh).',
    assessmentIdPrefixes: ['mnt-', 'cmp-', 'ins-', 'mvt-', 'sys-', 'sup-', 'kno-', 'crm2-', 'full-assessment', 'master-assessment', 'release-'],
  },
  'tenant-find': {
    id: 'tenant-find',
    label: 'Tenant Find',
    shortLabel: 'TF',
    icon: '🔑',
    colour: 'bg-[#F2F2F3] text-[#101010] border border-[#C8C8CC]',
    summary: 'Lets properties — from instruction and marketing through referencing, contracts and move-in.',
    whatGoodLooksLike: [
      'Properties let quickly, with minimal void days',
      'Referencing and right-to-rent checks completed correctly, every time',
      'Applicants and landlords kept to the correct deposit-scheme and compliance timelines',
      'A clean, complete handover to Property Management at move-in',
      'By week 3, navigating TAOS and letting properties independently (edge cases still expected to need support after that — not a training failure)',
    ],
    expectations: [
      'Follow the TF/TAOS SOP library for your stage of the letting journey',
      'Escalate anything outside your authority to a Team Lead or Senior Negotiator',
      'Hit the week-1 (operating TAOS), week-2 (progressing properties with a buddy) and week-3 (independent) milestones',
    ],
    crossovers: [
      'You hand a new tenancy to Property Management at move-in — what you capture and confirm there is their starting point',
      'Finance needs accurate move-in payment and deposit-registration detail from you',
      'Property Specialists may carry out move-in inspections that originate from your instruction',
    ],
    trainingStatus: 'early',
    trainingStatusNote: 'Real curriculum exists (Eishan\'s 10-day structure: Days 1–5 teach/practice on 4 dummy properties, Days 6–10 supervised real-property ramp) but is not yet built into the Hub as interactive modules/assessments. Known gaps: telephony module (no owner), compliance test (no owner for 5+ weeks), "property isn\'t letting" conversation (no owner), LN scorecard (only a stale grid exists — not reproduced here), 4 of 7 SOP library sections still marked TBC by Tenant Find itself.',
    assessmentIdPrefixes: [],
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    shortLabel: 'FIN',
    icon: '💷',
    colour: 'bg-[#F2F2F3] text-[#404044] border border-[#C8C8CC]',
    summary: 'Runs reconciliation, invoicing and landlord/tenant money movement accurately and on time.',
    whatGoodLooksLike: [
      'Daily reconciliation and balancing completed without errors',
      'Invoicing and money movement processed correctly, including corner cases',
      'Arrears chased and NRLL/Direct Debit processing kept current',
      'Statements (landlord, tenant, contractor) accurate and on schedule',
      'Working alone within 10 days of starting (down from today\'s 3 weeks)',
    ],
    expectations: [
      'Work self-study material before shadowing live agencies',
      'Flag corner cases rather than guessing — this is the single biggest current gap (shadowing doesn\'t reliably cover them today)',
      'Keep up to date within 2 days of any feature release affecting your work',
    ],
    crossovers: [
      'Property Management flags arrears, deductions and contractor invoices into your queue — their accuracy is your starting point',
      'Tenant Find\'s move-in payment and deposit-registration detail feeds directly into your reconciliation',
      'You touch every stage of the property/tenancy lifecycle — this is deliberately taught as one shared walkthrough, not a Finance-only view',
    ],
    trainingStatus: 'early',
    trainingStatusNote: 'Real module library exists (8 modules: Daily reconciliation & balancing, Invoicing & money movement, Move-ins & move-outs, Direct Debits, NRLL, Statements, Communication, General business) drawn from Alexey\'s self-study → shadowing → supervised-processing structure, including real source guides (Reconciliation procedure). Not yet built into the Hub as interactive modules/assessments. Known gap: no practice/test environment with corner-case data exists yet.',
    assessmentIdPrefixes: [],
  },
  'property-specialist': {
    id: 'property-specialist',
    label: 'Property Specialists',
    shortLabel: 'PS',
    icon: '🧰',
    colour: 'bg-[#F2F2F3] text-[#7D7C86] border border-[#C8C8CC]',
    summary: 'Carries out on-site visits — inspections, check-ins and check-outs — to a consistent standard.',
    whatGoodLooksLike: [
      'Report quality consistent against a shared standard, not whoever\'s doing the visit',
      'Clean-visit percentage and SLA hit rate on target',
      'A full solo diary run within roughly 6 weeks of starting',
      'On-site compliance checks performed correctly, every visit',
    ],
    expectations: [
      'Follow the visit-type standard once it exists (see training status below — this is still being built)',
      'Flag anything outside the standard rather than falling back to "how I\'ve always done it"',
    ],
    crossovers: [
      'Your inspection and visit reports are Property Management\'s evidence — report quality is their starting point for every decision that follows',
      'Tenant Find\'s move-in instructions can originate the visits you carry out',
    ],
    trainingStatus: 'not-started',
    trainingStatusNote: 'Earliest-stage track. Matan (Field Ops/PS owner) has shared initial thoughts only — no single Dwelly-wide "good" standard exists yet (every agency currently works differently), no structured curriculum, no named content owner. A joint brainstorm with Matan is the next step before any curriculum can be built here — this page will stay a gap list, not invented content, until that happens.',
    assessmentIdPrefixes: [],
  },
}

export function departmentMeta(department: Department | string | null | undefined): DepartmentMeta {
  if (department && department in DEPARTMENT_META) return DEPARTMENT_META[department as Department]
  return DEPARTMENT_META['property-management']
}

export function isValidDepartment(value: string | null | undefined): value is Department {
  return !!value && DEPARTMENTS.includes(value as Department)
}

// Does this assessment id belong to the given department? Mirrors the
// assessment_department() SQL function in scripts/supabase-departments.sql —
// keep the two in sync if the id scheme changes.
export function assessmentDepartment(assessmentId: string): Department | null {
  for (const dept of DEPARTMENTS) {
    const meta = DEPARTMENT_META[dept]
    if (meta.assessmentIdPrefixes.some((prefix) => assessmentId.startsWith(prefix) || assessmentId === prefix)) {
      return dept
    }
  }
  return null // unrecognised id — not department-gated (forward-compatible)
}

export interface OverrideRow {
  department: Department
  assessment_id: string | null
}

// Can this person sit this assessment? True for their own department, for
// admins, or if an explicit admin override exists for it (whole-department or
// this specific assessment). The DB enforces the same rule independently via
// RLS — this is for the UI to hide/show the right CTA, not the source of truth.
export function canSitAssessment(
  userDepartment: Department | string | null | undefined,
  role: string | null | undefined,
  assessmentId: string,
  overrides: OverrideRow[],
): boolean {
  if (role === 'admin') return true
  const dept = assessmentDepartment(assessmentId)
  if (dept === null) return true // not a department-gated id
  if (dept === userDepartment) return true
  return overrides.some((o) => o.department === dept && (o.assessment_id === null || o.assessment_id === assessmentId))
}
