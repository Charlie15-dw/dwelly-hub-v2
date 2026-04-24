// ─── Types ────────────────────────────────────────────────────────────────────

export type Phase = 'foundation' | 'onboarding' | 'embedding' | 'optimise'
export type RAGStatus = 'red' | 'amber' | 'green'
export type Role = 'property_manager' | 'maintenance_coordinator' | 'lettings_negotiator'
export type ModuleSection =
  | 'maintenance'
  | 'compliance'
  | 'move-outs'
  | 'inspections'
  | 'support'
  | 'knowledge'

export interface Module {
  id: string
  title: string
  section: ModuleSection
  phase: Phase
  duration: string
  description: string
  videoLength: string
  passmark: number
  completed: boolean
  progress: number
  locked: boolean
  quizCount: number
  roles: Role[]
  tags: string[]
  spacedRepetitionDue?: string | null
  confidenceRating?: number | null
}

export interface TeamMember {
  id: string
  name: string
  role: Role
  email: string
  startDate: string
  phase: Phase
  overallProgress: number
  ragStatus: RAGStatus
  modulesCompleted: number
  modulesTotal: number
  assessmentScore: number
  cpdHours: number
  cpdTarget: number
  lastActive: string
  competenciesSignedOff: string[]
  pendingSignOffs: string[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  rationale: string
  moduleId: string
  tier?: 'master' | 'recap'  // 'master' = master assessment only, 'recap' = recap quiz only
}

export interface CPDEntry {
  id: string
  date: string
  title: string
  type: 'formal' | 'technical' | 'reflective'
  hours: number
  source: string
  verified: boolean
}

export interface SignOffGate {
  id: string
  area: string
  description: string
  risk: 'high' | 'medium'
  signedOff: boolean
  signedOffBy?: string
  signedOffDate?: string
  requiredModules: string[]
}

// ─── Portal Phases ─────────────────────────────────────────────────────────────

export const PHASES: { id: Phase; label: string; months: string; description: string; color: string }[] = [
  { id: 'foundation',  label: 'Foundation',  months: 'Months 1–3',   description: 'Portal build, Dobby setup, checklist framework & compliance foundations', color: 'teal' },
  { id: 'onboarding',  label: 'Onboarding',  months: 'Months 4–6',   description: 'Structured intake pathway, knowledge assessments and system training', color: 'orange' },
  { id: 'embedding',   label: 'Embedding',   months: 'Months 7–9',   description: 'Video-led training modules, progress tracking at 100% & manager dashboards', color: 'gold' },
  { id: 'optimise',    label: 'Optimise',    months: 'Months 10–12', description: 'Refresh cycles, change management, ongoing knowledge library & performance review', color: 'navy' },
]

// ─── Modules ──────────────────────────────────────────────────────────────────

export const MODULES: Module[] = [
  // MAINTENANCE
  {
    id: 'mnt-01', title: 'Maintenance 1/2 — Creating a Repair Request', section: 'maintenance', phase: 'onboarding',
    duration: '25 min', videoLength: '4 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 6,
    roles: ['property_manager', 'maintenance_coordinator'],
    description: 'Step-by-step guide to logging, categorising and tracking repair requests in Dwelly.',
    tags: ['repairs', 'maintenance', 'system'], spacedRepetitionDue: '2026-04-12', confidenceRating: 5,
  },
  {
    id: 'mnt-02', title: 'Maintenance 2/2 — Actioning the Maintenance Task', section: 'maintenance', phase: 'onboarding',
    duration: '30 min', videoLength: '4 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 10,
    roles: ['property_manager', 'maintenance_coordinator'],
    description: 'Quoting, instructing, chasing and reviewing contractor work. Handling disputes.',
    tags: ['contractors', 'quotes', 'disputes'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'mnt-03', title: 'Inspections 1/2 — Creating an Inspection Task', section: 'inspections', phase: 'embedding',
    duration: '35 min', videoLength: '6 min', passmark: 80, completed: false, progress: 0, locked: true, quizCount: 5,
    roles: ['property_manager'],
    description: 'What to look for, how to evidence it, photo standards and report writing.',
    tags: ['inspections', 'evidence', 'reporting'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'ins-02', title: 'Inspections 2/2 — Completing the Inspection', section: 'inspections', phase: 'embedding',
    duration: '30 min', videoLength: '5 min', passmark: 80, completed: false, progress: 0, locked: true, quizCount: 6,
    roles: ['property_manager'],
    description: 'How to complete the inspection within Dwelly — uploading the report, recording findings, and raising follow-up jobs.',
    tags: ['inspections', 'reporting', 'evidence'], spacedRepetitionDue: null, confidenceRating: null,
  },

  // COMPLIANCE
  {
    id: 'cmp-01', title: 'Compliance 1/2 — Creating a Compliance Task', section: 'compliance', phase: 'foundation',
    duration: '40 min', videoLength: '6 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 6,
    roles: ['property_manager'],
    description: 'Legal obligations for gas safety checks, certification timelines, and non-compliance escalation.',
    tags: ['gas', 'safety', 'legal', 'certificates'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'cmp-02', title: 'Compliance 2/2 — Actioning the Compliance Task', section: 'compliance', phase: 'foundation',
    duration: '35 min', videoLength: '5 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 26,
    roles: ['property_manager', 'lettings_negotiator'],
    description: 'TDS/DPS/mydeposits schemes, 30-day rule, prescribed information requirements.',
    tags: ['deposits', 'TDS', 'legal'], spacedRepetitionDue: null, confidenceRating: null,
  },
  // MOVE-OUTS / SUPPORT
  {
    id: 'sys-01', title: 'Move-Outs 1/2 — Initiating the Move-Out Process', section: 'move-outs', phase: 'onboarding',
    duration: '45 min', videoLength: '7 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 5,
    roles: ['property_manager'],
    description: 'Full end of tenancy workflow in Dwelly — checkout, deposit return, re-marketing.',
    tags: ['EOT', 'checkout', 'deposits'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'mvt-02', title: 'Move-Outs 2/2 — Completing the Move-Out', section: 'move-outs', phase: 'onboarding',
    duration: '30 min', videoLength: '5 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 8,
    roles: ['property_manager'],
    description: 'How to action and complete the move-out process in Dwelly — checkout, deposit return, and re-marketing.',
    tags: ['EOT', 'checkout', 'deposits'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'sys-02', title: 'Support 1/2 — Raising a Support Task', section: 'support', phase: 'embedding',
    duration: '35 min', videoLength: '5 min', passmark: 80, completed: false, progress: 0, locked: true, quizCount: 5,
    roles: ['property_manager', 'lettings_negotiator'],
    description: 'The full renewal process from landlord conversation to agreement. Market positioning.',
    tags: ['renewals', 'rent-reviews', 'landlords'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'sup-02', title: 'Support 2/2 — Actioning the Support Task', section: 'support', phase: 'embedding',
    duration: '25 min', videoLength: '4 min', passmark: 80, completed: false, progress: 0, locked: true, quizCount: 6,
    roles: ['property_manager', 'lettings_negotiator'],
    description: 'How to action renewal and support tasks within Dwelly — processing the renewal, updating rent, and confirming tenancy terms.',
    tags: ['renewals', 'rent-reviews', 'landlords'], spacedRepetitionDue: null, confidenceRating: null,
  },

  // KNOWLEDGE
  {
    id: 'kno-01', title: 'Difficult Conversations', section: 'knowledge', phase: 'embedding',
    duration: '40 min', videoLength: '6 min', passmark: 80, completed: false, progress: 0, locked: true, quizCount: 5,
    roles: ['property_manager', 'lettings_negotiator'],
    description: 'Handling rent arrears conversations, complaint calls, and confrontational tenants.',
    tags: ['communication', 'arrears', 'conflict'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'kno-02', title: 'Handling Disrepair Claims', section: 'knowledge', phase: 'embedding',
    duration: '45 min', videoLength: '7 min', passmark: 80, completed: false, progress: 0, locked: true, quizCount: 7,
    roles: ['property_manager'],
    description: 'Legal obligations, timescales, evidence requirements and escalation to specialists.',
    tags: ['disrepair', 'legal', 'evidence'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'kno-03', title: 'Understanding a P&L', section: 'knowledge', phase: 'embedding',
    duration: '30 min', videoLength: '5 min', passmark: 75, completed: false, progress: 0, locked: true, quizCount: 5,
    roles: ['property_manager'],
    description: 'Basic financial literacy — service charges, deductions, and explaining costs to landlords.',
    tags: ['finance', 'P&L', 'landlords'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'kno-04', title: 'Property Manager FAQs (Dobby-linked)', section: 'knowledge', phase: 'foundation',
    duration: 'Always-on', videoLength: 'Various', passmark: 0, completed: false, progress: 0, locked: false, quizCount: 0,
    roles: ['property_manager', 'maintenance_coordinator', 'lettings_negotiator'],
    description: 'Live knowledge base powered by Dobby. Ask anything, get instant answers with video links.',
    tags: ['FAQ', 'Dobby', 'knowledge-base'], spacedRepetitionDue: null, confidenceRating: null,
  },
]

// ─── Team Members ─────────────────────────────────────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-01', name: 'Sarah Mitchell', role: 'property_manager', email: 'sarah.mitchell@dwelly.co.uk',
    startDate: '2026-01-06', phase: 'onboarding', overallProgress: 68, ragStatus: 'green',
    modulesCompleted: 8, modulesTotal: 13, assessmentScore: 87, cpdHours: 12, cpdTarget: 20,
    lastActive: '2026-04-07',
    competenciesSignedOff: ['Portal Induction', 'Repair Logging', 'Gas Safety'],
    pendingSignOffs: ['Deposit Protection'],
  },
  {
    id: 'tm-02', name: 'James Okafor', role: 'property_manager', email: 'james.okafor@dwelly.co.uk',
    startDate: '2026-01-06', phase: 'foundation', overallProgress: 32, ragStatus: 'amber',
    modulesCompleted: 4, modulesTotal: 13, assessmentScore: 72, cpdHours: 5, cpdTarget: 20,
    lastActive: '2026-04-03',
    competenciesSignedOff: ['Portal Induction'],
    pendingSignOffs: ['Repair Logging', 'Gas Safety', 'Deposit Protection'],
  },
  {
    id: 'tm-03', name: 'Priya Sharma', role: 'lettings_negotiator', email: 'priya.sharma@dwelly.co.uk',
    startDate: '2026-02-03', phase: 'onboarding', overallProgress: 55, ragStatus: 'green',
    modulesCompleted: 6, modulesTotal: 10, assessmentScore: 91, cpdHours: 8, cpdTarget: 20,
    lastActive: '2026-04-08',
    competenciesSignedOff: ['Portal Induction', 'Compliance Checklist'],
    pendingSignOffs: ['Deposit Protection'],
  },
  {
    id: 'tm-04', name: 'Tom Blackwell', role: 'maintenance_coordinator', email: 'tom.blackwell@dwelly.co.uk',
    startDate: '2026-01-20', phase: 'foundation', overallProgress: 18, ragStatus: 'red',
    modulesCompleted: 2, modulesTotal: 7, assessmentScore: 58, cpdHours: 2, cpdTarget: 20,
    lastActive: '2026-03-25',
    competenciesSignedOff: ['Portal Induction'],
    pendingSignOffs: ['Repair Logging', 'Contractor Management'],
  },
  {
    id: 'tm-05', name: 'Amara Nwosu', role: 'property_manager', email: 'amara.nwosu@dwelly.co.uk',
    startDate: '2026-03-03', phase: 'foundation', overallProgress: 22, ragStatus: 'amber',
    modulesCompleted: 3, modulesTotal: 13, assessmentScore: 79, cpdHours: 3, cpdTarget: 20,
    lastActive: '2026-04-06',
    competenciesSignedOff: ['Portal Induction'],
    pendingSignOffs: ['Compliance Checklist', 'Repair Logging'],
  },
  {
    id: 'tm-06', name: 'Daniel Hughes', role: 'lettings_negotiator', email: 'daniel.hughes@dwelly.co.uk',
    startDate: '2026-03-03', phase: 'foundation', overallProgress: 45, ragStatus: 'green',
    modulesCompleted: 5, modulesTotal: 10, assessmentScore: 84, cpdHours: 6, cpdTarget: 20,
    lastActive: '2026-04-08',
    competenciesSignedOff: ['Portal Induction', 'Compliance Checklist'],
    pendingSignOffs: ['Deposit Protection'],
  },
]

// ─── Quiz Questions ────────────────────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [

  // ─── ONB-01: Portal & System Orientation ─────────────────────────────────

  {
    id: 'q-onb-01-1', moduleId: 'onb-01',
    question: 'What does "Pause" mode mean on a job in Dwelly?',
    options: [
      'The job is on hold waiting for a third party',
      'The system is waiting for YOU to take the next action',
      'All automated messages have been suspended',
      'The job has been escalated to a manager',
    ],
    correct: 1,
    rationale: 'Pause mode means Dwelly is waiting for YOU to take the next step. Complete the required action, then return the job to Auto mode.',
  },
  {
    id: 'q-onb-01-2', moduleId: 'onb-01',
    question: 'What is the expectation for clearing your My Jobs task queue?',
    options: ['By 12pm each day', 'By the end of each working day', 'Within 48 hours', 'Weekly during team meetings'],
    correct: 1,
    rationale: 'The expectation for all PMs is to clear their task queue at the end of each working day, ensuring no jobs are left unattended overnight.',
  },
  {
    id: 'q-onb-01-3', moduleId: 'onb-01',
    question: 'What does "Auto" mode mean for a job in Dwelly?',
    options: [
      'The job is automatically closed',
      'A contractor has been automatically assigned',
      'The system or someone else is handling the next step — the job leaves your queue',
      'The landlord has been automatically notified',
    ],
    correct: 2,
    rationale: 'Auto mode means the system or another party is responsible for the next action. The job disappears from your My Jobs view until it requires your input again.',
  },
  {
    id: 'q-onb-01-4', moduleId: 'onb-01',
    question: 'Which Dwelly tab is described as your personal daily task list?',
    options: ['Properties', 'Property Management', 'My Jobs', 'Finance'],
    correct: 2,
    rationale: 'My Jobs is your personal daily task list. It shows all active tasks assigned to you, sorted from most to least urgent, and updates in real time.',
  },
  {
    id: 'q-onb-01-5', moduleId: 'onb-01',
    question: 'What is a "Flow" in the context of Dwelly jobs?',
    options: [
      'The order in which contractors are contacted',
      'The category of the job — what type of issue it is',
      'The payment flow for a maintenance invoice',
      'The sequence of tenants in a property',
    ],
    correct: 1,
    rationale: 'A Flow is the category of the job — it works like the subject line of an email. The main flows are Maintenance, Compliance, Inspection, Move Out, Support, Right-to-Rent, and Rent Arrears.',
  },
  {
    id: 'q-onb-01-6', moduleId: 'onb-01',
    question: 'Where in the Dwelly job screen can you find all communications, stage changes, and internal notes?',
    options: ['The Task List', 'The Chat section', 'The Notes tab on the property', 'The File Manager'],
    correct: 1,
    rationale: 'The Chat section is both the timeline and inbox for every job. It records all messages sent to tenants/landlords/contractors, email replies, call recordings, system stage updates, and internal notes.',
  },

  // ─── ONB-03: Pre-Onboarding Compliance Checklist ──────────────────────────

  {
    id: 'q-onb-03-1', moduleId: 'onb-03',
    question: 'What property status means a tenant has been chosen and the holding deposit has been paid?',
    options: ['Published', 'Tenanted', 'Let Agreed', 'Prospect'],
    correct: 2,
    rationale: 'Let Agreed means a tenant has been selected and has paid the holding deposit. The property moves to Tenanted once the tenant physically moves in.',
  },
  {
    id: 'q-onb-03-2', moduleId: 'onb-03',
    question: 'Which property status indicates the property is live on Dwelly and portals such as Rightmove and Zoopla?',
    options: ['New', 'Prospect', 'Let Agreed', 'Published'],
    correct: 3,
    rationale: 'Published means the property is live on Dwelly and classified portals. A New property has been added to the system but not yet published.',
  },
  {
    id: 'q-onb-03-3', moduleId: 'onb-03',
    question: 'What does "Offboarding" status mean for a property?',
    options: [
      'The property is being listed on a new portal',
      'The property is leaving Dwelly but some actions are still pending',
      'The tenant has given notice and the checkout is booked',
      'The landlord has paused the listing',
    ],
    correct: 1,
    rationale: 'Offboarding means the property is leaving Dwelly\'s management, but some actions are still in progress — such as returning keys, handling deposits, or completing outstanding jobs.',
  },
  {
    id: 'q-onb-03-4', moduleId: 'onb-03',
    question: 'In the Dwelly File Manager, where would you find Right-to-Rent check documents?',
    options: ['Property / Landlord Files', 'Archived Files', 'Tenancy Files', 'All Files'],
    correct: 2,
    rationale: 'Right-to-Rent checks and referencing reports are stored under Tenancy Files, alongside the AST and other documents related to the active tenancy.',
  },
  {
    id: 'q-onb-03-5', moduleId: 'onb-03',
    question: 'What warning appears for a landlord in the Dwelly Ledger if they are missing a physical address?',
    options: [
      'Their account is frozen until the address is added',
      'Their address will be excluded from generated statements',
      'They cannot receive any payments until it is corrected',
      'Their properties will be unpublished automatically',
    ],
    correct: 1,
    rationale: 'If a landlord is missing a physical address, a warning message appears and the address will be excluded from generated statements. Similarly, a missing email means they won\'t receive automated Statements or Receipts.',
  },
  {
    id: 'q-onb-03-6', moduleId: 'onb-03',
    question: 'Which tab in the property view covers compliance certificates, Gas Safety, EICR and licence records?',
    options: ['Publications', 'Ledger', 'Maintenance', 'File Manager'],
    correct: 2,
    rationale: 'The Maintenance tab (specifically the Primary sub-tab) is where compliance certificates are uploaded and viewed, along with landlord preferences and payment settings.',
  },
  {
    id: 'q-onb-03-7', moduleId: 'onb-03',
    question: 'What is a Prop ID in Dwelly?',
    options: [
      'A portal reference number used on Rightmove listings',
      'A unique number used to quickly search for and identify a property',
      'The landlord\'s internal reference code',
      'The HMRC property registration number',
    ],
    correct: 1,
    rationale: 'The Prop ID is a unique system identifier for every property. It\'s the fastest way to find a specific property in Dwelly, especially when multiple properties share a similar address.',
  },
  {
    id: 'q-onb-03-8', moduleId: 'onb-03',
    question: 'Internal notes left in the Dwelly Notes tab — who can see them?',
    options: [
      'The tenant via the tenant portal',
      'The landlord via their landlord portal',
      'Only internal Dwelly staff — they cannot be seen externally',
      'Any user with Supervisor access or above',
    ],
    correct: 2,
    rationale: 'Notes in the Dwelly system are internal and cannot be seen or accessed by anyone externally, including through the tenant or landlord portals.',
  },

  // ─── CMP-04: Right to Rent Checks ─────────────────────────────────────────

  {
    id: 'q-cmp-04-1', moduleId: 'cmp-04',
    question: 'What is the legal purpose of a Right to Rent check?',
    options: [
      'To verify the tenant\'s credit score before renting',
      'To confirm that a prospective tenant has the legal right to live in the UK',
      'To check the tenant\'s employment status and income',
      'To comply with GDPR data processing requirements',
    ],
    correct: 1,
    rationale: 'Right to Rent checks are a legal requirement under the Immigration Act 2014. They verify that prospective tenants have the right to reside in the UK, and therefore the right to rent a property.',
  },
  {
    id: 'q-cmp-04-2', moduleId: 'cmp-04',
    question: 'What is a share code in the context of Right to Rent checks?',
    options: [
      'A code to share the property listing with referral partners',
      'A government-issued code allowing agents to verify a tenant\'s immigration status online',
      'A code used to transfer deposit funds between tenancy schemes',
      'A landlord portal access code for the Home Office system',
    ],
    correct: 1,
    rationale: 'A share code is generated by tenants who hold a biometric residence permit, EU Settlement Scheme status, or other digital immigration status. Landlords use it on the Home Office online checking service to verify the tenant\'s right to rent.',
  },
  {
    id: 'q-cmp-04-3', moduleId: 'cmp-04',
    question: 'What must be retained as evidence that a Right to Rent check has been completed?',
    options: [
      'Only the tenant\'s verbal confirmation',
      'A clear copy of the documents checked and the date the check was carried out',
      'A signed declaration by the tenant',
      'The contractor\'s verification report',
    ],
    correct: 1,
    rationale: 'You must retain clear copies of the documents checked and record the date the check was carried out. This evidence must be kept for the duration of the tenancy and for one year after it ends.',
  },
  {
    id: 'q-cmp-04-4', moduleId: 'cmp-04',
    question: 'What is a "visual likeness check" in the Right to Rent process?',
    options: [
      'A check to ensure the property photographs match the actual property',
      'A comparison between the person presenting themselves and the photo on their identity document',
      'An automated AI check of the tenant\'s document photos',
      'A check required when multiple tenants share the same name',
    ],
    correct: 1,
    rationale: 'A visual likeness check involves physically comparing the person in front of you with the photograph on their identity document, to confirm they are the same individual.',
  },
  {
    id: 'q-cmp-04-5', moduleId: 'cmp-04',
    question: 'What is the civil penalty for renting to a tenant who does not have the right to rent in England?',
    options: ['Up to £1,000 per tenant', 'Up to £3,000 per tenant', 'Up to £5,000 per tenant', 'Up to £20,000 per tenant'],
    correct: 3,
    rationale: 'Civil penalties for renting to an illegal migrant have significantly increased. As of recent legislation, landlords can face penalties of up to £20,000 per tenant for a first breach, rising to £80,000 for repeat offences.',
  },
  {
    id: 'q-cmp-04-6', moduleId: 'cmp-04',
    question: 'How is a Right to Rent check tracked in the Dwelly system?',
    options: [
      'Via a separate Home Office integration module',
      'Through a Right-to-Rent flow job with defined stages',
      'It is logged manually in the Notes tab only',
      'Through the compliance certificates section in the Maintenance tab',
    ],
    correct: 1,
    rationale: 'Dwelly manages Right to Rent checks through a dedicated Right-to-Rent flow. The job tracks each step from creation through to verification, share code submission, and visual likeness confirmation.',
  },
  {
    id: 'q-cmp-04-7', moduleId: 'cmp-04',
    question: 'When must a Right to Rent check be carried out?',
    options: [
      'Within 28 days of the tenant moving in',
      'Before the tenancy begins — not after the tenant has moved in',
      'At the first inspection after move-in',
      'Any time during the first 12 months of the tenancy',
    ],
    correct: 1,
    rationale: 'Right to Rent checks must be completed before the tenancy starts. Conducting checks after the tenant has moved in means you are already in breach of the requirement.',
  },

  // ─── MNT-01: Logging a Repair Request ────────────────────────────────────

  {
    id: 'q-mnt-01-1', moduleId: 'mnt-02',
    question: 'When a tenant reports a boiler fault on a Friday evening and the landlord is unresponsive, what should you do first?',
    options: [
      'Wait until Monday to contact the landlord',
      'Instruct an emergency contractor and document the decision',
      'Advise the tenant to contact a contractor themselves',
      'Close the repair request and re-open on Monday',
    ],
    correct: 1,
    rationale: 'Emergency repairs affecting habitability must be actioned immediately. Document all decisions and attempts to contact the landlord to protect all parties.',
  },
  {
    id: 'q-mnt-01-2', moduleId: 'mnt-02',
    question: 'What is the maximum timeframe for logging a repair request after it is reported by a tenant?',
    options: ['Same working day', '24 hours', '48 hours', '72 hours'],
    correct: 0,
    rationale: 'All repair requests must be logged in Dwelly on the same working day to maintain an accurate audit trail and ensure the job is tracked from the moment it is raised.',
  },
  {
    id: 'q-mnt-01-3', moduleId: 'mnt-02',
    question: 'When putting a Maintenance job "On Hold", what must you always select?',
    options: [
      'A new deadline for the job',
      'An alternative contractor',
      'A reason from the dropdown: Waiting for Landlord, Tenant, Provider, or Other',
      'The escalation level (P1–P4)',
    ],
    correct: 2,
    rationale: 'When putting a Maintenance or Compliance job on hold, you must select a reason: Waiting for Landlord, Waiting for Tenant, Waiting for Provider, or Other. If Other is selected, a mandatory comment is required.',
  },
  {
    id: 'q-mnt-01-4', moduleId: 'mnt-02',
    question: 'Once a job type has been closed in Dwelly, what happens?',
    options: [
      'It can be reopened within 7 days',
      'It can be reopened by a Supervisor or Admin',
      'It cannot be reopened under any circumstances',
      'It is archived and can be accessed for 30 days',
    ],
    correct: 2,
    rationale: 'Once any job type has been closed, it cannot be reopened under any circumstances. No further edits can be made after closure, which is why accuracy before closing is critical.',
  },
  {
    id: 'q-mnt-01-5', moduleId: 'mnt-02',
    question: 'What does the "Assign Progress" button do on a Dwelly job?',
    options: [
      'Assigns the job to a different Property Manager',
      'Sends an automated progress update to the landlord',
      'Pushes the job to the next stage or allows you to skip a stage',
      'Marks the job as completed',
    ],
    correct: 2,
    rationale: 'The Assign Progress button moves the job forward through its stages. It can either push to the next stage or allow you to skip a stage when appropriate.',
  },

  // ─── MNT-02: Contractor Management ───────────────────────────────────────

  {
    id: 'q-mnt-02-1', moduleId: 'mnt-02',
    question: 'Before instructing a contractor for non-emergency works, what must you obtain?',
    options: [
      'A minimum of three written quotes',
      'Written authorisation from the landlord',
      'The tenant\'s written consent',
      'A formal risk assessment from the contractor',
    ],
    correct: 1,
    rationale: 'Written landlord authorisation is required before instructing works above your threshold. This protects against disputes over costs and contractor instruction.',
  },
  {
    id: 'q-mnt-02-2', moduleId: 'mnt-02',
    question: 'What is the first step when onboarding a new provider (contractor) onto Dwelly?',
    options: [
      'Add them directly to the system and assign a geo zone',
      'Align with a relevant coordinator or supervisor first',
      'Send them the GDPR data processing agreement',
      'Request three references from previous agencies',
    ],
    correct: 1,
    rationale: 'Before adding a new provider to Dwelly, you must first align with the relevant coordinator or supervisor to ensure the provider is appropriate and meets Dwelly\'s requirements.',
  },
  {
    id: 'q-mnt-02-3', moduleId: 'mnt-02',
    question: 'What is a "geo zone" in the context of provider management?',
    options: [
      'A pricing band based on the cost of living in the area',
      'A geographic zone that defines a provider\'s service area',
      'A compliance zone for licensing requirements',
      'A zone that groups properties by the same postcode district',
    ],
    correct: 1,
    rationale: 'A geo zone defines the geographic area in which a provider operates. It ensures that when a job is created, only providers covering the relevant area are available for assignment.',
  },
  {
    id: 'q-mnt-02-4', moduleId: 'mnt-02',
    question: 'What does "Manual" mode mean on a Dwelly job?',
    options: [
      'The job was created manually rather than automatically',
      'No automations will be sent — the PM handles all communications manually',
      'The contractor has been manually assigned',
      'The landlord has requested manual management only',
    ],
    correct: 1,
    rationale: 'Manual mode suspends all automated messages and actions. In Manual mode, the PM is responsible for handling all communications and steps directly, without system automation.',
  },
  {
    id: 'q-mnt-02-5', moduleId: 'mnt-02',
    question: 'In the Dwelly job chat, what does a "Failed" delivery status on an email indicate?',
    options: [
      'The recipient\'s inbox was full',
      'The email was blocked by a spam filter',
      'Email delivery failed — hover over the status to see the specific error reason',
      'The email was sent to the wrong address',
    ],
    correct: 2,
    rationale: 'A Failed delivery status means the email was not successfully delivered. You can hover over the status in the chat panel to see the specific reason for the failure.',
  },

  // ─── MNT-03: Property Inspection Quality ─────────────────────────────────

  {
    id: 'q-mnt-03-1', moduleId: 'ins-02',
    question: 'How are most property inspection jobs created in Dwelly?',
    options: [
      'Manually by the Property Manager each time',
      'Automatically by the system based on inspection frequency settings',
      'By the tenant submitting an inspection request',
      'By the landlord via their landlord portal',
    ],
    correct: 1,
    rationale: 'Inspection jobs are typically created automatically by Dwelly based on the inspection frequency set in the Fees section of the property. This ensures no inspections are missed.',
  },
  {
    id: 'q-mnt-03-2', moduleId: 'ins-02',
    question: 'Where is inspection frequency configured for a property in Dwelly?',
    options: ['The Maintenance tab', 'The Publications tab', 'The Fees section', 'The Property tab'],
    correct: 2,
    rationale: 'Inspection frequency is set in the Fees section of a property. This controls how regularly the system automatically triggers an inspection job.',
  },
  {
    id: 'q-mnt-03-3', moduleId: 'ins-02',
    question: 'After an inspection report is uploaded in Dwelly, what is the next step?',
    options: [
      'The job is automatically closed',
      'Results are processed and follow-up maintenance jobs may be created',
      'The tenant receives a copy automatically',
      'The landlord must approve the report before it is filed',
    ],
    correct: 1,
    rationale: 'Once the inspection report is uploaded, the results are processed. If issues are found, follow-up maintenance or compliance jobs may be created to address them.',
  },
  {
    id: 'q-mnt-03-4', moduleId: 'ins-02',
    question: 'What are the two types of inspector that can be used for a Dwelly inspection?',
    options: [
      'Internal PM inspector and external inventory clerk',
      'RICS surveyor and in-house assessor',
      'Local authority inspector and letting agent inspector',
      'Full inspection and drive-by inspection',
    ],
    correct: 0,
    rationale: 'Inspections can be conducted by an internal PM or by an external inspector such as an inventory clerk. The choice depends on the type of inspection and landlord preference.',
  },
  {
    id: 'q-mnt-03-5', moduleId: 'ins-02',
    question: 'What is the primary purpose of producing a thorough, well-evidenced inspection report?',
    options: [
      'To justify increasing the rent at renewal',
      'To protect all parties in case of a dispute over condition or dilapidations',
      'To satisfy the landlord\'s insurance requirements',
      'To comply with ARLA annual reporting requirements',
    ],
    correct: 1,
    rationale: 'A thorough inspection report with photos and clear condition notes protects the tenant, landlord, and agency in any future dispute regarding property condition, fair wear and tear, or dilapidations claims.',
  },
  {
    id: 'q-mnt-03-6', moduleId: 'ins-02',
    question: 'What should you do if an inspection needs to be rescheduled in Dwelly?',
    options: [
      'Close the job and create a new inspection job manually',
      'Use the rescheduling function within the inspection job itself',
      'Email the tenant directly and update the notes tab',
      'Ask a manager to reassign the job to a different PM',
    ],
    correct: 1,
    rationale: 'Rescheduling should be done within the inspection job using Dwelly\'s rescheduling function. This keeps the job\'s audit trail intact and ensures the system reflects the correct next action date.',
  },

  // ─── CMP-01: Gas Safety & Certification ──────────────────────────────────

  {
    id: 'q-cmp-01-1', moduleId: 'cmp-02',
    question: 'How often must a gas safety check be carried out at a rented property?',
    options: ['Every 6 months', 'Every 12 months', 'Every 2 years', 'Only at the start of tenancy'],
    correct: 1,
    rationale: 'Gas safety checks must be carried out every 12 months by a Gas Safe registered engineer. This is a legal requirement under the Gas Safety (Installation and Use) Regulations 1998.',
  },
  {
    id: 'q-cmp-01-2', moduleId: 'cmp-02',
    question: 'Within how many days of issue must the tenant receive a copy of the gas safety certificate?',
    options: ['7 days', '14 days', '28 days', '30 days'],
    correct: 2,
    rationale: 'A copy of the gas safety certificate must be provided to existing tenants within 28 days of the check being carried out. New tenants must receive a copy before they move in.',
  },
  {
    id: 'q-cmp-01-3', moduleId: 'cmp-02',
    question: 'Who must carry out a gas safety inspection at a rented property?',
    options: [
      'Any qualified plumber',
      'A Gas Safe registered engineer',
      'An RICS accredited surveyor',
      'Any Dwelly-approved contractor',
    ],
    correct: 1,
    rationale: 'Gas safety checks must be carried out exclusively by a Gas Safe registered engineer. Using any other contractor would invalidate the certificate and leave the landlord in breach of the law.',
  },
  {
    id: 'q-cmp-01-4', moduleId: 'cmp-02',
    question: 'In Dwelly, where are compliance certificates such as gas safety records uploaded and stored?',
    options: [
      'The Publications tab',
      'The Maintenance tab > Primary sub-tab',
      'The File Manager > Archived Files',
      'The Ledger under compliance charges',
    ],
    correct: 1,
    rationale: 'Compliance certificates are uploaded and viewed in the Maintenance tab under the Primary sub-tab. This is also where you can set landlord preferences and record compliance-related information.',
  },
  {
    id: 'q-cmp-01-5', moduleId: 'cmp-02',
    question: 'What is the Compliance flow in Dwelly used to manage?',
    options: [
      'Maintenance repairs and contractor jobs',
      'Certificates, licences, and safety checks',
      'Rent arrears and tenant payment plans',
      'Move-out inspections and inventory checks',
    ],
    correct: 1,
    rationale: 'The Compliance flow in Dwelly is specifically for managing certificates, licences, and safety checks — such as Gas Safety, EICR, EPC, and property licences.',
  },
  {
    id: 'q-cmp-01-6', moduleId: 'cmp-02',
    question: 'What must you do when a compliance job is completed in Dwelly?',
    options: [
      'Send a manual notification to the tenant',
      'Upload the certificate and mark the job as complete',
      'Create a follow-up job scheduled for the following year',
      'Request manager sign-off before closing',
    ],
    correct: 1,
    rationale: 'When a compliance job is completed, you must upload the certificate into Dwelly and mark the job as complete. The system will then schedule the next renewal automatically.',
  },
  {
    id: 'q-cmp-01-7', moduleId: 'cmp-02',
    question: 'What must a landlord provide before compliance work can be instructed to a contractor?',
    options: [
      'A copy of their mortgage statement',
      'Consent or authorisation for the works',
      'Their buildings insurance schedule',
      'A signed copy of the Terms of Business',
    ],
    correct: 1,
    rationale: 'Landlord consent or authorisation is required before instructing a contractor for compliance works. This is tracked through the compliance job stages in Dwelly.',
  },
  {
    id: 'q-cmp-01-8', moduleId: 'cmp-02',
    question: 'What is the consequence of a rented property not having a valid gas safety certificate?',
    options: [
      'The landlord is given a formal warning and 30 days to comply',
      'The property is automatically withdrawn from portals',
      'The landlord is in breach of the law and may face prosecution',
      'The tenant can withhold rent until the certificate is obtained',
    ],
    correct: 2,
    rationale: 'Failure to hold a valid gas safety certificate puts the landlord in breach of the Gas Safety (Installation and Use) Regulations 1998. This is a criminal offence and can result in prosecution, fines, or imprisonment.',
  },

  // ─── CMP-02: Deposit Protection Rules ────────────────────────────────────

  {
    id: 'q-cmp-02-1', moduleId: 'cmp-02',
    question: 'How many days does a landlord have to protect a tenancy deposit under an approved scheme?',
    options: ['14 days', '21 days', '30 days', '60 days'],
    correct: 2,
    rationale: 'Under the Housing Act 2004, deposits must be protected within 30 days of receipt. Failure to do so can result in a court-ordered penalty of 1–3x the deposit amount.',
  },
  {
    id: 'q-cmp-02-2', moduleId: 'cmp-02',
    question: 'Which of the following is NOT an approved deposit protection scheme in England?',
    options: ['Tenancy Deposit Scheme (TDS)', 'Deposit Protection Service (DPS)', 'mydeposits', 'SafeDeposits England'],
    correct: 3,
    rationale: 'SafeDeposits Scotland is an approved scheme but only operates in Scotland. The three England/Wales approved schemes are TDS, DPS, and mydeposits.',
  },
  {
    id: 'q-cmp-02-3', moduleId: 'cmp-02',
    question: 'What must be given to the tenant alongside deposit protection?',
    options: [
      'A copy of the Energy Performance Certificate',
      'Prescribed information about the scheme',
      'The landlord\'s mortgage agreement',
      'A signed copy of the inventory report',
    ],
    correct: 1,
    rationale: 'Alongside protecting the deposit, landlords must provide "prescribed information" — details about the protection scheme, how to reclaim the deposit, and the dispute resolution process.',
  },
  {
    id: 'q-cmp-02-4', moduleId: 'cmp-02',
    question: 'What is the maximum penalty a court can award against a landlord for failing to protect a deposit?',
    options: ['1x the deposit amount', '2x the deposit amount', '3x the deposit amount', '5x the deposit amount'],
    correct: 2,
    rationale: 'Courts can award a penalty of between 1x and 3x the deposit amount where a landlord has failed to protect a deposit correctly or on time.',
  },
  {
    id: 'q-cmp-02-5', moduleId: 'cmp-02',
    question: 'Under which Act are tenancy deposit protection rules governed in England and Wales?',
    options: ['Landlord and Tenant Act 1985', 'Housing Act 2004', 'Renters Reform Act 2025', 'Deregulation Act 2015'],
    correct: 1,
    rationale: 'Tenancy deposit protection is governed by the Housing Act 2004, which introduced mandatory deposit protection schemes for assured shorthold tenancies.',
  },
  {
    id: 'q-cmp-02-6', moduleId: 'cmp-02',
    question: 'Where are deposit-related documents stored in Dwelly?',
    options: ['Ledger tab', 'File Manager > Property / Landlord Files', 'Maintenance tab > Primary', 'Deals tab'],
    correct: 1,
    rationale: 'Deposit-related documents, including the deposit protection confirmation and prescribed information, are stored in the File Manager under Property / Landlord Files.',
  },
  {
    id: 'q-cmp-02-7', moduleId: 'cmp-02',
    question: 'What is a "custodial" deposit protection scheme?',
    options: [
      'A scheme where the landlord holds the deposit in a separate bank account',
      'A scheme where the deposit is held by the scheme itself until the end of the tenancy',
      'A scheme requiring a guarantor to act as custodian of the deposit',
      'A scheme only available to portfolio landlords',
    ],
    correct: 1,
    rationale: 'In a custodial scheme, the deposit is physically held by the scheme provider until the tenancy ends. The Deposit Protection Service (DPS) offers a free custodial option. In contrast, insured schemes allow the landlord to hold the deposit.',
  },

  // ─── SYS-01: End of Tenancy Process ──────────────────────────────────────

  {
    id: 'q-sys-01-1', moduleId: 'mvt-02',
    question: 'What does "dilapidations" mean in the context of an end of tenancy?',
    options: [
      'The process of re-marketing a property after a tenancy ends',
      'Damage beyond fair wear and tear that can be charged to the outgoing tenant',
      'The legal term for returning a deposit in full',
      'Outstanding maintenance jobs that must be completed before re-let',
    ],
    correct: 1,
    rationale: 'Dilapidations are damages to the property that go beyond fair wear and tear. These can be claimed from the tenant\'s deposit but must be clearly evidenced by comparing the check-in and check-out inventory reports.',
  },
  {
    id: 'q-sys-01-2', moduleId: 'mvt-02',
    question: 'What is the difference between fair wear and tear and damage?',
    options: [
      'Fair wear and tear can be charged to the tenant; damage cannot',
      'Fair wear and tear is the expected natural deterioration of a property; damage is caused by misuse or neglect',
      'There is no legal distinction between the two in England',
      'Damage only applies to structural elements; wear and tear applies to fixtures and fittings',
    ],
    correct: 1,
    rationale: 'Fair wear and tear is the expected, gradual deterioration of a property through normal use over time — this cannot be charged to a tenant. Damage caused by neglect, misuse, or accidents is considered a dilapidation and may be deductible from the deposit.',
  },
  {
    id: 'q-sys-01-3', moduleId: 'mvt-02',
    question: 'What is the purpose of a checkout inspection in the move-out process?',
    options: [
      'To calculate the new rent price for the next tenancy',
      'To verify the condition of the property at the end of the tenancy and compare it to the check-in report',
      'To ensure the contractor has completed all maintenance tasks',
      'To confirm the tenant\'s new forwarding address',
    ],
    correct: 1,
    rationale: 'The checkout inspection compares the property\'s current condition against the check-in inventory. This comparison determines what, if any, deductions can be made from the tenant\'s deposit.',
  },
  {
    id: 'q-sys-01-4', moduleId: 'mvt-02',
    question: 'How many defined steps are in the Dwelly full move-out process?',
    options: ['5', '7', '10', '12'],
    correct: 2,
    rationale: 'The Dwelly move-out process has 10 defined steps, covering everything from job creation through key collection, checkout, deposit negotiation, and finally marking the property as ready for re-let.',
  },
  {
    id: 'q-sys-01-5', moduleId: 'mvt-02',
    question: 'Which Dwelly property status indicates a property is leaving management but some actions are still pending?',
    options: ['Withdrawn', 'Offboarding', 'Let Agreed', 'Prospect'],
    correct: 1,
    rationale: 'Offboarding is the status used when a property is leaving Dwelly\'s management but outstanding tasks — such as key returns, deposit releases, or final maintenance jobs — have not yet been completed.',
  },
  {
    id: 'q-sys-01-6', moduleId: 'mvt-02',
    question: 'Why is it important to confirm key return as part of the move-out process?',
    options: [
      'It triggers the automatic re-marketing of the property on portals',
      'It provides evidence that the tenant has formally vacated and access has been regained',
      'It is required to initiate the deposit protection scheme release',
      'It automatically closes all open maintenance jobs on the property',
    ],
    correct: 1,
    rationale: 'Confirming key return is essential evidence that the tenant has formally vacated the property and the landlord has regained access. This is important for any subsequent deposit dispute or legal proceedings.',
  },
  {
    id: 'q-sys-01-7', moduleId: 'mvt-02',
    question: 'Where should condition assessment results from a checkout inspection be recorded in Dwelly?',
    options: [
      'In the Notes tab of the property',
      'Within the move-out job itself',
      'In the File Manager under Archived Files',
      'In the landlord\'s profile page',
    ],
    correct: 1,
    rationale: 'All condition assessment findings from the checkout should be recorded within the move-out job in Dwelly. This keeps the full audit trail for the tenancy in one place.',
  },
  {
    id: 'q-sys-01-8', moduleId: 'mvt-02',
    question: 'What is the primary risk of releasing a deposit before the checkout report has been completed?',
    options: [
      'The deposit protection scheme will charge a fee',
      'You may lose the ability to claim for any dilapidations if issues are found later',
      'The landlord will be notified automatically',
      'The property cannot be re-marketed until the deposit is released',
    ],
    correct: 1,
    rationale: 'Releasing a deposit before completing the checkout report removes any ability to make deductions for dilapidations. Always complete and agree the checkout report before initiating a deposit release.',
  },

  // ─── SYS-02: Tenancy Renewals & Rent Reviews ──────────────────────────────

  {
    id: 'q-sys-02-1', moduleId: 'sup-02',
    question: 'What is a periodic tenancy?',
    options: [
      'A tenancy with a fixed, non-negotiable rent review date',
      'A tenancy that continues on a rolling basis after the fixed term expires',
      'A tenancy specifically for short-term or holiday lets',
      'A tenancy where rent is paid at irregular intervals',
    ],
    correct: 1,
    rationale: 'A periodic tenancy arises automatically when a fixed-term tenancy expires and no new agreement is signed. It rolls on a month-to-month (or week-to-week) basis on the same terms as the original agreement.',
  },
  {
    id: 'q-sys-02-2', moduleId: 'sup-02',
    question: 'When should renewal conversations with a landlord typically begin?',
    options: [
      'Only once the tenant has given notice to leave',
      'At least 2–3 months before the tenancy expiry date',
      'On the day the tenancy expires',
      'At the annual inspection',
    ],
    correct: 1,
    rationale: 'Renewal conversations should begin 2–3 months before expiry. This gives enough time to negotiate terms, agree on any rent increase, arrange paperwork, and avoid the tenancy falling into a periodic unnecessarily.',
  },
  {
    id: 'q-sys-02-3', moduleId: 'sup-02',
    question: 'What does a "Let Agreed" status mean for a property in Dwelly?',
    options: [
      'The landlord has agreed to let the property through Dwelly',
      'A tenant has been selected and the holding deposit has been paid',
      'The tenancy agreement has been signed by both parties',
      'The property is ready for marketing on portals',
    ],
    correct: 1,
    rationale: 'Let Agreed means a tenant has been chosen and has paid the holding deposit. The property status changes to Tenanted once the tenant physically moves in and the tenancy commences.',
  },
  {
    id: 'q-sys-02-4', moduleId: 'sup-02',
    question: 'What factors should be considered when recommending a rent increase to a landlord?',
    options: [
      'Only the landlord\'s mortgage costs',
      'Market conditions, comparable rents in the area, and the tenant\'s payment history',
      'The original rent agreed when the landlord joined Dwelly',
      'The CPI inflation rate only',
    ],
    correct: 1,
    rationale: 'A rent review recommendation should consider current market conditions, comparable properties in the area, the tenant\'s reliability and payment history, and the landlord\'s objectives. Relying on a single factor leads to poor advice.',
  },
  {
    id: 'q-sys-02-5', moduleId: 'sup-02',
    question: 'What is the risk of allowing too many tenancies to fall into periodic without proactive renewal management?',
    options: [
      'The landlord is required to reduce the rent under periodic tenancy law',
      'The property is automatically re-listed on portals',
      'Either party can end the tenancy with short notice, creating instability',
      'Compliance certificates must be renewed immediately when periodic begins',
    ],
    correct: 2,
    rationale: 'Under a periodic tenancy, either the landlord or tenant can end the tenancy with relatively short notice (one rental period). This creates unnecessary instability and void risk for the landlord compared to a renewed fixed-term agreement.',
  },
  {
    id: 'q-sys-02-6', moduleId: 'sup-02',
    question: 'Where in Dwelly would you find financial records and transaction history for a tenancy?',
    options: ['The Notes tab', 'The Deals tab', 'The Ledger', 'The Maintenance tab'],
    correct: 2,
    rationale: 'The Ledger holds all financial records for the property, landlord, and each individual tenant. Each tenant has their own tab within the Ledger showing transfers, payments, and transaction history.',
  },

  // ─── KNO-01: Difficult Conversations ──────────────────────────────────────

  {
    id: 'q-kno-01-1', moduleId: 'kno-01',
    question: 'What is Dwelly\'s expectation regarding internal notes in the job chat?',
    options: [
      'Internal notes are visible to all parties including the tenant',
      'Internal notes are private and cannot be seen or accessed externally',
      'Internal notes are only visible to managers and supervisors',
      'Internal notes are automatically sent to the landlord as a summary',
    ],
    correct: 1,
    rationale: 'Internal notes in Dwelly\'s chat system are private. They are not sent to any party and cannot be seen externally — they exist purely as an internal record for the team.',
  },
  {
    id: 'q-kno-01-2', moduleId: 'kno-01',
    question: 'When chasing a landlord or tenant in Dwelly, what should every attempt be accompanied by?',
    options: [
      'A formal letter of demand',
      'A documented record in the job chat or notes',
      'Manager approval before sending',
      'A copy sent to the Home Office compliance team',
    ],
    correct: 1,
    rationale: 'Every chasing attempt must be documented in the job chat or notes. This creates an auditable record that protects Dwelly and all parties in any future dispute, and demonstrates due diligence.',
  },
  {
    id: 'q-kno-01-3', moduleId: 'kno-01',
    question: 'What does the delivery status "No status" on an automated email in Dwelly indicate?',
    options: [
      'The email was not sent due to a system error',
      'An automated email was triggered but the recipient has no email address in the system',
      'The email is still being processed',
      'The recipient has unsubscribed from all communications',
    ],
    correct: 1,
    rationale: '"No status" appears when an automated email was triggered for a user who does not have an email address recorded in Dwelly. The message was never sent. This is a prompt to add a valid email address.',
  },
  {
    id: 'q-kno-01-4', moduleId: 'kno-01',
    question: 'What does best practice guidance say about PMs who keep most of their jobs in Auto mode?',
    options: [
      'They are at risk of missing important tasks',
      'They are consistently the top performers, spending time only on genuine decision-making',
      'They have fewer jobs assigned to them than average',
      'They rely too heavily on the system rather than relationship management',
    ],
    correct: 1,
    rationale: 'Property Managers who keep jobs in Auto wherever possible are consistently top performers. Auto mode means the system handles routine steps, freeing PMs to focus time only where human judgment is required.',
  },
  {
    id: 'q-kno-01-5', moduleId: 'kno-01',
    question: 'When a tenant is unresponsive, what is the recommended approach?',
    options: [
      'Escalate immediately to the manager for all cases',
      'Follow the documented chasing cadence and record every attempt',
      'Contact the landlord to advise them directly',
      'Put the job on hold until the tenant responds',
    ],
    correct: 1,
    rationale: 'Dwelly\'s best practice guidance requires following a documented chasing cadence and recording every attempt in the job chat. This demonstrates due diligence and protects the agency if the matter escalates.',
  },

  // ─── KNO-02: Handling Disrepair Claims ────────────────────────────────────

  {
    id: 'q-kno-02-1', moduleId: 'kno-02',
    question: 'What is a Category 1 hazard under the Housing Health and Safety Rating System (HHSRS)?',
    options: [
      'A minor issue requiring attention within 28 days',
      'A cosmetic defect affecting the property\'s marketability',
      'A serious hazard posing a significant risk to the health or safety of occupants',
      'Any hazard identified by a tenant in writing',
    ],
    correct: 2,
    rationale: 'Under the HHSRS, Category 1 hazards are those posing the most serious risk to occupants\' health or safety. Local authorities have a duty to take action on Category 1 hazards, and landlords must address them urgently.',
  },
  {
    id: 'q-kno-02-2', moduleId: 'kno-02',
    question: 'What is the most important type of documentation for defending a disrepair claim?',
    options: [
      'The original Terms of Business signed by the landlord',
      'Job logs, photos, and communication records showing timely action was taken',
      'The tenant\'s referencing report from move-in',
      'The most recent inspection report only',
    ],
    correct: 1,
    rationale: 'Defending a disrepair claim relies heavily on evidence that action was taken promptly and proportionately. Job logs in Dwelly, timestamped photos, and complete communication records from the chat are essential.',
  },
  {
    id: 'q-kno-02-3', moduleId: 'kno-02',
    question: 'Where in Dwelly is the complete history of all job communications stored?',
    options: ['The Notes tab on the property', 'The Chat section within each job', 'The File Manager', 'The Ledger'],
    correct: 1,
    rationale: 'Every communication, stage change, internal note, call recording, and system notification related to a job is stored in that job\'s Chat section. This is the complete, auditable record for the job.',
  },
  {
    id: 'q-kno-02-4', moduleId: 'kno-02',
    question: 'What is the landlord\'s repairing obligation under Section 11 of the Landlord and Tenant Act 1985?',
    options: [
      'To redecorate the property every three years',
      'To maintain the structure, exterior, and services (heating, water, gas, electricity) of the property',
      'To replace all white goods and appliances within 5 years',
      'To maintain only the common areas of an HMO',
    ],
    correct: 1,
    rationale: 'Section 11 of the Landlord and Tenant Act 1985 requires landlords to maintain the structure and exterior of the property, and to keep in repair and proper working order the installations for water, gas, electricity, and heating.',
  },
  {
    id: 'q-kno-02-5', moduleId: 'kno-02',
    question: 'How does Dwelly\'s job tracking system help in defending against disrepair claims?',
    options: [
      'It automatically generates legal defence documents',
      'It creates a timestamped, auditable record of every action taken on a maintenance job',
      'It blocks tenants from raising new jobs while a claim is active',
      'It notifies the local authority of all repairs completed',
    ],
    correct: 1,
    rationale: 'Dwelly\'s job tracking system creates a timestamped, auditable record showing exactly when a report was received, what action was taken, and when it was resolved. This evidence is invaluable in disrepair claim defences.',
  },
  {
    id: 'q-kno-02-6', moduleId: 'kno-02',
    question: 'What should a PM do if a tenant reports a damp or mould issue in the property?',
    options: [
      'Advise the tenant it is caused by lifestyle and take no further action',
      'Log the job immediately, arrange an inspection, and escalate to compliance if needed',
      'Wait for the next routine inspection to assess the issue',
      'Instruct a contractor without notifying the landlord first',
    ],
    correct: 1,
    rationale: 'Damp and mould must be treated as a potential Category 1 hazard following the Homes (Fitness for Human Habitation) Act 2018. Log the job immediately, arrange an inspection, and take timely action. Delayed responses are a major risk in disrepair claims.',
  },
  {
    id: 'q-kno-02-7', moduleId: 'kno-02',
    question: 'What legislation requires rented homes to be fit for human habitation throughout the tenancy?',
    options: [
      'Housing Act 2004',
      'Landlord and Tenant Act 1985',
      'Homes (Fitness for Human Habitation) Act 2018',
      'Environmental Protection Act 1990',
    ],
    correct: 2,
    rationale: 'The Homes (Fitness for Human Habitation) Act 2018 requires that privately rented homes are fit for human habitation at the start of and throughout the tenancy. It gives tenants the right to take action in the county court if the property is unfit.',
  },

  // ─── KNO-03: Understanding a P&L ─────────────────────────────────────────

  {
    id: 'q-kno-03-1', moduleId: 'kno-03',
    question: 'What does the Ledger in Dwelly display?',
    options: [
      'Property listings and portal publication details',
      'Financial records for the property, landlord, and tenant transactions',
      'Compliance certificate expiry dates and renewal schedules',
      'Contractor invoice history only',
    ],
    correct: 1,
    rationale: 'The Ledger shows all financial records relating to the property and landlord, as well as tenant transaction history. Each tenant has their own tab within the Ledger.',
  },
  {
    id: 'q-kno-03-2', moduleId: 'kno-03',
    question: 'What appears in the Dwelly Ledger if a landlord is missing a physical address?',
    options: [
      'Their account is suspended until the address is provided',
      'A warning that the address will be excluded from generated statements',
      'Their properties are automatically unpublished',
      'An automatic request is sent to the landlord to update their details',
    ],
    correct: 1,
    rationale: 'When a landlord is missing a physical address in Dwelly, a warning appears in the Ledger indicating that the address will be excluded from generated statements. This affects the accuracy of landlord documents.',
  },
  {
    id: 'q-kno-03-3', moduleId: 'kno-03',
    question: 'What controls appear in the Ledger when a property has a high volume of transactions?',
    options: ['An export button for downloading a CSV', 'Pagination controls for navigating multiple pages', 'A summary view with totals only', 'A filter by transaction type'],
    correct: 1,
    rationale: 'For ledgers with a high volume of transactions, pagination controls appear automatically, allowing users to navigate through multiple pages and access historical transaction data.',
  },
  {
    id: 'q-kno-03-4', moduleId: 'kno-03',
    question: 'What types of charges are shown in the Fees section of a property in Dwelly?',
    options: [
      'Only the monthly management fee',
      'Agency commission, deposit information, inspection frequency, and other management charges',
      'Contractor invoices and maintenance costs only',
      'Portal listing fees for Rightmove and Zoopla',
    ],
    correct: 1,
    rationale: 'The Fees section shows all charges linked to managing the property — including agency commission fees, deposit information, inspection frequency settings, and more.',
  },
  {
    id: 'q-kno-03-5', moduleId: 'kno-03',
    question: 'When explaining a landlord\'s statement to them, which section of Dwelly provides the source of truth for all financial transactions?',
    options: ['The Notes tab', 'The Deals tab', 'The Ledger', 'The Maintenance tab'],
    correct: 2,
    rationale: 'The Ledger is the definitive source for all financial transactions in Dwelly. When explaining a landlord\'s statement, always refer to the Ledger to verify figures and provide an accurate explanation.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER ASSESSMENT — Harder scenario-based questions (tier: 'master')
  // These do NOT appear in the video modules or per-section assessments.
  // They test applied judgement, edge cases, and cross-area reasoning.
  // ═══════════════════════════════════════════════════════════════════════════

  // ── MASTER: Portal & System (onb-01) ──────────────────────────────────────

  {
    id: 'q-m-onb-01-1', moduleId: 'onb-01', tier: 'master',
    question: 'A job has been in Pause mode for 7 days with no response from the landlord. What is the correct next step?',
    options: [
      'Return the job to Auto mode so the system resumes chasing the landlord automatically on your behalf',
      'Close the job and open a new one, carrying over the notes so the timeline resets cleanly',
      'Document all chasing attempts in the job chat, escalate internally, and reassess whether the job requires emergency action',
      'Put the job on hold with "Waiting for Landlord" selected and diarise a review in a further 7 days',
    ],
    correct: 2,
    rationale: 'A job stuck in Pause mode does not resolve itself. You must document all chasing attempts in the job chat, escalate internally if the landlord remains unresponsive, and assess urgency. Closing and recreating a job destroys the audit trail — never do this.',
  },
  {
    id: 'q-m-onb-01-2', moduleId: 'onb-01', tier: 'master',
    question: 'You receive a call from a tenant reporting an emergency repair at 4:45pm on a Friday. The landlord has a strict policy of authorising all works first. What should you do?',
    options: [
      'Log the job in Dwelly under Manual mode and contact the landlord first thing Monday morning before instructing anyone',
      'Instruct an emergency contractor immediately, document all decisions and attempts to reach the landlord, and inform them as soon as they are reachable',
      'Advise the tenant to contact the landlord directly, as the authorisation policy means the repair cannot be instructed out of hours',
      'Contact the landlord\'s emergency number and, if no response within two hours, escalate to your manager before instructing any contractor',
    ],
    correct: 1,
    rationale: 'Emergency repairs affecting habitability (heating, water, security) must be actioned without delay regardless of the landlord\'s standard authorisation policy. Document every action, every attempted call to the landlord, and your reasoning. Waiting until Monday for a genuine emergency is a serious failure of duty.',
  },
  {
    id: 'q-m-onb-01-3', moduleId: 'onb-01', tier: 'master',
    question: 'A colleague asks you to reassign one of their Dwelly jobs to themselves after it was accidentally assigned to you. You have already taken one action in the job. What is the key risk?',
    options: [
      'The tenant will receive a duplicate automated notification when the job is reassigned to a different PM',
      'The system will block the reassignment until a supervisor approves it in the access settings',
      'The job will revert to its original stage when transferred, undoing the progress you have made',
      'Any actions already logged in the job are recorded against you; reassigning without a supervisor review could create an unclear accountability trail',
    ],
    correct: 3,
    rationale: 'Every action in a Dwelly job is logged against the user who performed it. If you have taken any steps in the job before realising the mismatch, the audit trail records those actions as yours. Always confirm with a supervisor before reassigning jobs where prior actions have already been taken.',
  },

  // ── MASTER: Pre-Onboarding Compliance (prv-02) ────────────────────────────

  {
    id: 'q-m-prv-02-1', moduleId: 'prv-02', tier: 'master',
    question: 'During pre-onboarding, you discover the property requires a selective licence and the landlord has a pending application but no licence yet. What is the correct position on publishing the property?',
    options: [
      'Publish the property and note the licence as pending in the Maintenance tab — the application demonstrates good faith',
      'The property cannot be published until the licence is confirmed; a pending application does not satisfy the legal requirement',
      'Publish the property for viewings only, with a condition in the tenancy that completion is subject to the licence being granted',
      'Contact the local authority to confirm the application is valid and proceed to publish once they verbally confirm receipt',
    ],
    correct: 1,
    rationale: 'A property requiring a selective licence must not be marketed or let until the licence is in place. Letting an unlicensed property is a criminal offence for the landlord, exposes the agency, and prevents a valid Section 21 being served. A pending application is not a licence — you must not publish until the licence is confirmed.',
  },
  {
    id: 'q-m-prv-02-2', moduleId: 'prv-02', tier: 'master',
    question: 'A new landlord\'s EPC rating comes back as F. The property is vacant and ready to let. What is the correct advice?',
    options: [
      'The property can be marketed immediately; the EPC requirement only applies when a tenancy is renewed, not at the outset',
      'The property can be let if the landlord registers a valid exemption with the PRS Exemptions Register and a valid reason applies',
      'The EPC rating becomes an issue only if a tenant raises it — market the property and monitor',
      'The EPC rating has no bearing on residential lettings unless the property falls below a G rating',
    ],
    correct: 1,
    rationale: 'Under MEES, properties rated F or G cannot legally be let for new tenancies in England and Wales unless a valid exemption has been registered. If no exemption applies, the landlord must improve the property to at least an E rating before letting. Marketing an F-rated property without an exemption exposes the landlord and agency.',
  },
  {
    id: 'q-m-prv-02-3', moduleId: 'prv-02', tier: 'master',
    question: 'A landlord states they will conduct Right to Rent checks themselves and do not want the agency involved. What must the agency establish before agreeing?',
    options: [
      'Nothing — landlords always retain the right to manage Right to Rent checks regardless of agency involvement',
      'Whether the landlord has completed the government\'s Right to Rent online training module within the last 12 months',
      'That this is explicitly documented in the Terms of Business, as without a written contractual transfer of responsibility the agency may share liability for any failure',
      'That the landlord holds professional indemnity insurance sufficient to cover Right to Rent penalties',
    ],
    correct: 2,
    rationale: 'When an agency acts as letting agent, Right to Rent responsibilities can be delegated to the landlord — but only if formally agreed in writing in the Terms of Business. A verbal understanding is insufficient. Without a written contractual transfer, the agency may share liability under the Immigration Act 2014 if a failure occurs.',
  },

  // ── MASTER: Maintenance (mnt-02) ──────────────────────────────────────────

  {
    id: 'q-m-mnt-02-1', moduleId: 'mnt-02', tier: 'master',
    question: 'A contractor invoices £950 for a repair that was only authorised at £600. The landlord is disputing it. What is the correct immediate action?',
    options: [
      'Approve and pay the full invoice immediately to preserve the working relationship, then raise a separate charge to the landlord for the overspend with a written explanation',
      'Reject the invoice entirely, close the job, and advise the landlord that the contractor breached the agreed authorisation limit and no payment will be made',
      'Process the authorised amount of £600 and advise the landlord to negotiate the remaining £350 directly with the contractor through separate correspondence',
      'Contact the contractor to request a full breakdown of the additional costs, withhold payment above the authorised amount until the discrepancy is investigated, documented, and re-authorised by the landlord if legitimate',
    ],
    correct: 3,
    rationale: 'You must never pay above the authorised amount without querying it first. Contact the contractor for a full breakdown of the additional costs. Do not process payment until the discrepancy is investigated, documented, and — if legitimate — re-authorised by the landlord. The landlord\'s instruction controls your authority to spend.',
  },
  {
    id: 'q-m-mnt-02-2', moduleId: 'mnt-02', tier: 'master',
    question: 'A tenant reports a maintenance issue. The same contractor has attended three times over two months without resolving it. What should you do?',
    options: [
      'Book the same contractor for a fourth visit and create a recurring maintenance tag in the job to flag the pattern for the next quarterly review cycle',
      'Escalate internally, commission a different specialist contractor or surveyor to assess the underlying cause, and document the full history — a recurring unresolved issue may indicate a structural problem and significantly raises disrepair claim risk',
      'Advise the landlord in writing that the ongoing issue constitutes fair wear and tear and may not be recoverable as a tenant-caused defect, then log the job as tenant-related and close it',
      'Close the current job and open a fresh maintenance request, noting that the previous contractor\'s work was unsatisfactory — a new job allows the landlord to select a different contractor with a clean audit record',
    ],
    correct: 1,
    rationale: 'Repeated contractor visits without resolution are a serious warning sign. The pattern may indicate a structural issue beyond a general contractor\'s scope, or the wrong contractor type being used. Escalate, document the history, and commission a specialist. A recurring unresolved issue significantly increases disrepair claim risk.',
  },
  {
    id: 'q-m-mnt-02-3', moduleId: 'mnt-02', tier: 'master',
    question: 'A landlord explicitly instructs you in writing not to carry out a repair that you believe poses a risk to the tenant\'s health and safety. What is your professional obligation?',
    options: [
      'Follow the landlord\'s written instruction and document it in the job — an owner\'s explicit direction in writing provides full protection for the agency against any future claim arising from the unrepaired defect',
      'Carry out the repair immediately using standard authorisation limits to prevent harm to the tenant, then invoice the landlord retrospectively — emergency circumstances override the need for prior authorisation in health and safety situations',
      'Document the landlord\'s refusal in the job, advise them in writing of the legal consequences, escalate to a senior manager, and assess whether your professional obligation requires you to act regardless of the landlord\'s position where health and safety is at risk',
      'Advise the tenant to raise the matter directly with the landlord and contact the local environmental health department if they remain concerned — inter-party safety disputes fall outside property management responsibilities',
    ],
    correct: 2,
    rationale: 'A landlord\'s instruction does not override your legal and professional obligations. If a repair poses a genuine health and safety risk, you must document the landlord\'s refusal in writing, advise them of the consequences (including potential HHSRS enforcement and disrepair claims), and escalate. In some circumstances you may be obliged to act to protect the tenant regardless of the landlord\'s position.',
  },

  // ── MASTER: Inspections (ins-02) ──────────────────────────────────────────

  {
    id: 'q-m-ins-02-1', moduleId: 'ins-02', tier: 'master',
    question: 'During a property inspection, you notice a strong smell of gas in the kitchen. The tenant is not present. What is the correct immediate action?',
    options: [
      'Open all windows immediately to disperse the smell, check the gas meter for anomalies, and call the landlord\'s preferred Gas Safe contractor from within the property before leaving',
      'Note the smell in the inspection report, complete the remainder of the inspection from a different part of the property, and raise an emergency maintenance job in Dwelly before departing',
      'Contact the landlord immediately from inside the property, describe the smell and location, and await their instruction before taking any action — as the property owner they must authorise all emergency responses',
      'Leave the property immediately without operating any switches, call the National Gas Emergency Service (0800 111 999) from outside, and ensure nobody re-enters until the property is declared safe by the emergency service',
    ],
    correct: 3,
    rationale: 'A gas smell is a life-safety emergency. Leave immediately without operating any switches or creating a spark. Call the National Gas Emergency Service (0800 111 999) from outside. Do not re-enter until the property has been declared safe. No inspection task takes precedence over life safety.',
  },
  {
    id: 'q-m-ins-02-2', moduleId: 'ins-02', tier: 'master',
    question: 'During an inspection, you notice the tenant has a dog and the AST contains a no-pets clause. The tenant says they got verbal approval from the landlord. What is the correct action?',
    options: [
      'Document the finding in the inspection report, advise the landlord, and ensure any permission to keep a pet is formalised as a written deed of variation — verbal approvals are not enforceable and do not protect either party in a future dispute',
      'Accept the tenant\'s account of verbal approval and note it in the inspection report with a flag for the landlord to confirm in writing at their convenience before the next scheduled inspection',
      'Disregard the finding as a matter solely between the landlord and tenant — the agency\'s inspection role is limited to property condition and enforcement of tenancy terms is outside your remit',
      'Issue the tenant with a formal written notice to remove the pet within 14 days and advise them that continued breach may result in service of a Section 8 notice under Ground 12',
    ],
    correct: 0,
    rationale: 'Verbal approvals for variations to the AST terms are not enforceable. Document the finding, notify the landlord, and advise that any consent to keep a pet must be formalised as a deed of variation or addendum to the tenancy agreement. This protects all parties if a future dispute arises.',
  },
  {
    id: 'q-m-ins-02-3', moduleId: 'ins-02', tier: 'master',
    question: 'A checkout inspection reveals a large stain on the lounge carpet not recorded in the check-in inventory. The outgoing tenant insists it was there when they moved in. What is the definitive piece of evidence?',
    options: [
      'The tenant\'s verbal statement carries significant weight at adjudication — the principle of benefit of the doubt means the tenant does not need documentary evidence to successfully dispute the deduction',
      'The most recent periodic inspection report is treated as the most contemporaneous evidence by the adjudicator, as it reflects the property\'s condition closest to the end of the tenancy',
      'The check-in inventory and accompanying photographs taken at the start of the tenancy are the legally accepted baseline — if the stain is not recorded there, the tenant\'s claim that it pre-existed is very difficult to substantiate in adjudication',
      'The contractor\'s written quote for replacing the carpet, supported by a statement from the checkout clerk, constitutes sufficient evidence to uphold the full deduction regardless of what the check-in record shows',
    ],
    correct: 2,
    rationale: 'The check-in inventory — and specifically the photographs taken at that time — is the legally accepted baseline for determining the property\'s condition at the start of the tenancy. If the stain is not recorded or visible in the check-in evidence, the tenant\'s claim that it pre-existed will be very difficult to substantiate in adjudication.',
  },

  // ── MASTER: Compliance (cmp-02) ───────────────────────────────────────────

  {
    id: 'q-m-cmp-02-1', moduleId: 'cmp-02', tier: 'master',
    question: 'An EICR report comes back with a C1 (danger present) observation. What is the required response and timeframe?',
    options: [
      'A C1 observation denotes immediate danger — notify the landlord and tenant without delay, arrange urgent remediation, and the property may be unsafe to occupy until the issue is resolved; this is not a routine follow-up item',
      'A C1 observation triggers the standard 28-day remedial period under EICR regulations — instruct the landlord to arrange a return visit within 28 days and update the certificate status in Dwelly when complete',
      'Log the C1 observation in the Compliance tab and schedule a follow-up EICR at the next standard renewal date; C1 items are recorded for monitoring but do not require emergency action unless the tenant reports active electrical faults',
      'Notify only the landlord of the C1 observation and await their written authorisation before instructing any electrician — the landlord\'s consent is required before the agency can instruct emergency compliance works',
    ],
    correct: 0,
    rationale: 'A C1 observation on an EICR means danger is present — the risk of injury is immediate. The landlord must arrange urgent remediation. The property may not be safe to occupy until the C1 issue is resolved. Notify both landlord and tenant, and document all actions. A C1 is not a routine follow-up item.',
  },
  {
    id: 'q-m-cmp-02-2', moduleId: 'cmp-02', tier: 'master',
    question: 'A landlord instructs you not to renew the gas safety certificate because "the boiler is switched off and we don\'t use gas." What is the correct response?',
    options: [
      'Respect the landlord\'s instruction — the Gas Safety Regulations contain an active-use exemption that allows landlords to defer annual checks where the gas installation has been isolated and is not in operational use by the tenant',
      'Carry out the check but note the landlord\'s objection in the compliance record; the check is technically required but the landlord\'s written direction provides sufficient mitigation against enforcement action',
      'Advise the landlord to have the boiler formally decommissioned and capped off by a Gas Safe engineer, which removes the legal obligation for annual safety checks on that installation going forward',
      'The Gas Safety (Installation and Use) Regulations 1998 require an annual check on all gas installations regardless of whether they are in active use — this is a legal obligation the landlord cannot override, and non-compliance is a criminal offence',
    ],
    correct: 3,
    rationale: 'The Gas Safety (Installation and Use) Regulations 1998 require an annual gas safety check on all gas installations at a rented property — this applies whether or not the gas is in active use. A landlord cannot opt out of this obligation. Failure to comply is a criminal offence and exposes both the landlord and agency to prosecution.',
  },
  {
    id: 'q-m-cmp-02-3', moduleId: 'cmp-02', tier: 'master',
    question: 'A landlord failed to provide the latest version of the How to Rent guide when it was updated mid-tenancy. Could this affect future possession proceedings?',
    options: [
      'No — the landlord\'s obligation is to provide the How to Rent guide once at the commencement of the tenancy; no further distributions are required when updated versions are published during the tenancy term',
      'Only if the updated guide contained information that materially altered the tenant\'s rights; a mere version update without substantive changes has no legal effect',
      'Yes — landlords are advised to provide the current version of the How to Rent guide at all times; failure to provide an updated version issued during the tenancy can affect the landlord\'s ability to seek possession',
      'No — digital publication by the government satisfies any ongoing distribution obligation regardless of whether a new copy was sent to the tenant',
    ],
    correct: 2,
    rationale: 'Government guidance and case law indicate that if the How to Rent guide has been updated since the tenancy began, the landlord should provide the latest version. Failure to do so can affect future possession proceedings. Always provide the most current version at tenancy start and on renewal.',
  },

  // ── MASTER: Right to Rent (rtr-02) ────────────────────────────────────────

  {
    id: 'q-m-rtr-02-1', moduleId: 'rtr-02', tier: 'master',
    question: 'A tenant presents a visa expiring in 6 months as evidence of their right to rent. When is the latest a follow-up check must be completed?',
    options: [
      'At the point of tenancy renewal, regardless of when the document expires',
      'Within 28 days after the visa expiry date, once it is confirmed whether they have renewed their leave',
      'Before the visa expires or 12 months after the initial check — whichever date falls first',
      'Only if the landlord requests a follow-up; the initial check provides a statutory excuse for the full tenancy duration',
    ],
    correct: 2,
    rationale: 'Where a tenant has a time-limited right to rent, a follow-up check must be carried out before the earlier of the document expiry or 12 months from the original check. Missing a follow-up check removes the statutory excuse that protects the landlord from civil penalty.',
  },
  {
    id: 'q-m-rtr-02-2', moduleId: 'rtr-02', tier: 'master',
    question: 'A Right to Rent check reveals one of three joint tenants has no right to rent in the UK. The other two have valid status. What must happen?',
    options: [
      'The tenancy can proceed — Right to Rent is satisfied where the majority of tenants have valid status',
      'The issue must be reported to the Home Office within 14 days, after which the tenancy may proceed with appropriate monitoring',
      'The tenancy cannot proceed with that individual named as a tenant — all named adults must have the right to rent; the tenancy must be renegotiated or that person removed',
      'The landlord may proceed at their discretion, provided they obtain written indemnity from the two tenants with valid status',
    ],
    correct: 2,
    rationale: 'Every adult living at the property must have the right to rent. Where a joint tenant does not, the tenancy cannot proceed as structured. You cannot rely on the majority having valid status. The tenancy must be renegotiated without that individual, or the application declined.',
  },
  {
    id: 'q-m-rtr-02-3', moduleId: 'rtr-02', tier: 'master',
    question: 'A landlord asks you to conduct a Right to Rent check by reviewing a passport scan emailed to your inbox. Does this satisfy the legal requirement?',
    options: [
      'Yes — a clear, legible digital copy is equivalent to examining the original for Right to Rent purposes',
      'Yes — the Home Office confirmed in 2020 that email-based checks are permanently acceptable for all document types',
      'Only if you supplement the email scan with a video call during which the tenant holds up the original document to the camera',
      'No — you must check the original document in person, use a certified Identity Service Provider (IDSP), or follow the adjusted video process; an emailed scan provides no statutory excuse',
    ],
    correct: 3,
    rationale: 'A scanned copy emailed to you does not constitute a valid Right to Rent check. You must either: check the original document in person, use a certified IDSP for eligible documents, or use the approved video call process. An emailed scan provides no statutory excuse and leaves the landlord exposed to civil penalty.',
  },

  // ── MASTER: Move Outs (mvt-02) ────────────────────────────────────────────

  {
    id: 'q-m-mvt-02-1', moduleId: 'mvt-02', tier: 'master',
    question: 'A tenant vacates early without giving notice and leaves significant belongings in the property. What must you NOT do?',
    options: [
      'Attempt to contact the tenant using all available details to confirm whether they have formally surrendered the tenancy before taking any re-letting action',
      'Document the condition of the property immediately with dated photographs and a written room-by-room record to establish a clear baseline for any subsequent deposit or dilapidations claim',
      'Dispose of or remove the belongings without delay and re-let the property as soon as possible, as maintaining an abandoned property incurs ongoing costs the landlord should not have to bear',
      'Contact the landlord, seek legal advice, and follow the Torts (Interference with Goods) Act 1977 abandonment notice procedure before making any decisions about the belongings or re-letting',
    ],
    correct: 2,
    rationale: 'Even when a tenant has abandoned the property, you must not dispose of their belongings without following the correct legal process. The Torts (Interference with Goods) Act 1977 requires you to serve a formal notice and allow the tenant a reasonable time to collect their property before disposal. Acting without this process exposes the agency and landlord to civil liability.',
  },
  {
    id: 'q-m-mvt-02-2', moduleId: 'mvt-02', tier: 'master',
    question: 'A checkout identifies £700 of dilapidations but the tenant\'s deposit is only £500. The tenant disputes all the deductions. What is the correct process?',
    options: [
      'Cap the deduction claim at £500 — the deposit protection scheme legally limits the total recoverable amount to the sum held, and any amount above this cannot be pursued through adjudication or the courts',
      'Withhold the full £500 immediately from the protected deposit and advise the landlord to pursue the remaining £200 directly with the outgoing tenant via a debt recovery letter, keeping both processes entirely separate',
      'Submit only a £500 claim to the adjudication service to match the deposit amount — a claim exceeding the deposit will be automatically rejected by the scheme, so it is more efficient to limit the claim from the outset',
      'Submit the full £700 claim to the deposit scheme\'s adjudication service; if the adjudicator awards the full amount, the scheme pays up to the £500 deposit and the landlord must pursue the remaining £200 shortfall through the county court separately',
    ],
    correct: 3,
    rationale: 'The deposit is a cap on what the scheme can award, not a cap on the landlord\'s overall entitlement to compensation. If the claim exceeds the deposit, the adjudicator can award up to the deposit amount and the landlord may pursue the remaining shortfall through the small claims court. Both routes must be pursued and documented separately.',
  },
  {
    id: 'q-m-mvt-02-3', moduleId: 'mvt-02', tier: 'master',
    question: 'The landlord wants to deduct the full cost of repainting every wall in the property after a 4-year tenancy. The check-in report shows the walls were in good condition at the start. Is this deduction likely to be upheld in adjudication?',
    options: [
      'Unlikely — adjudicators apply fair wear and tear principles, and after a 4-year tenancy some deterioration of paintwork is expected; deductions are typically prorated against the expected lifespan of the decoration and its documented condition at the start of the tenancy',
      'Very likely — check-in evidence showing good condition at the start of the tenancy places the full burden of proof on the tenant to demonstrate that the deterioration occurred within normal wear and tear parameters',
      'Fully upheld — where the check-in inventory records the walls as being in good condition and the checkout identifies repainting is required, the landlord is entitled to recover the full cost of returning the property to its documented condition',
      'Dependent entirely on whether the tenant smoked inside the property — nicotine damage is always considered beyond fair wear and tear and would justify a full repaint deduction regardless of tenancy length',
    ],
    correct: 0,
    rationale: 'Adjudicators apply fair wear and tear principles rigorously. Decoration has an expected lifespan — typically 3–5 years for paintwork. After a 4-year tenancy, some deterioration is expected and cannot be fully charged to the tenant. Any deduction would be prorated against the age and condition at the start. A full repaint claim after 4 years is unlikely to be awarded in full.',
  },

  // ── MASTER: Renewals & Tenant Support (sup-02) ────────────────────────────

  {
    id: 'q-m-sup-02-1', moduleId: 'sup-02', tier: 'master',
    question: 'A landlord wants to increase rent by 25% at renewal. The tenant disputes it and triggers the Section 13 statutory rent increase procedure. What happens next?',
    options: [
      'The landlord can enforce the rent increase with immediate effect because they have followed the statutory Section 13 procedure — once properly served, the new rent becomes binding from the date specified in the notice regardless of any tenant challenge',
      'The tenant must continue paying the proposed increased amount while the dispute is being reviewed — failure to pay the new rent during the Tribunal process constitutes a breach of the tenancy agreement',
      'The tenancy automatically converts to a periodic tenancy upon receipt of the Section 13 notice, during which period neither the original rent nor the proposed increase is enforceable until both parties reach a written agreement',
      'The tenant can refer the notice to the First-tier Tribunal (Property Chamber), which will independently determine a market rent — the proposed increase is suspended during the referral and cannot be enforced until the Tribunal issues its determination',
    ],
    correct: 3,
    rationale: 'Under Section 13 of the Housing Act 1988, a tenant can refer a landlord\'s rent increase notice to the First-tier Tribunal (Property Chamber) for an independent market rent determination. The proposed increase is suspended during the referral. The Tribunal sets the rent based on open market evidence — which could be lower than, equal to, or higher than the landlord\'s proposed increase.',
  },
  {
    id: 'q-m-sup-02-2', moduleId: 'sup-02', tier: 'master',
    question: 'A tenant discloses during a support call that they have lost their job and are likely to fall into rent arrears next month. They have not yet missed a payment. What is the best practice response?',
    options: [
      'Acknowledge the disclosure proactively, explore support options including payment plans and Universal Credit signposting, document the conversation fully, and inform the landlord — early intervention significantly improves outcomes and demonstrates agency due diligence',
      'Wait until the first payment is missed before contacting the landlord — acting on a prediction of future arrears before a payment has been skipped is premature and may be perceived as harassment',
      'Begin pre-emptive possession proceedings by serving a Section 8 Notice Seeking Possession on grounds of anticipated breach — early service preserves the landlord\'s position and the notice can always be withdrawn if arrears do not materialise',
      'Advise the tenant to contact the local housing authority directly and remove yourself from the conversation — welfare support referrals fall outside property management responsibilities and create liability if the advice proves inaccurate',
    ],
    correct: 0,
    rationale: 'Early disclosure of financial difficulty is an opportunity, not a problem. Proactive intervention — exploring payment plans, Universal Credit, or local housing support — produces far better outcomes than waiting for arrears to accumulate. Document everything and keep the landlord informed. Early action also demonstrates agency due diligence.',
  },
  {
    id: 'q-m-sup-02-3', moduleId: 'sup-02', tier: 'master',
    question: 'Both landlord and tenant verbally agree to renew the tenancy but no paperwork is signed before the fixed term expires. What is the legal status of the tenancy?',
    options: [
      'The tenancy ends automatically on the fixed-term expiry date — without a signed renewal agreement, both parties revert to no tenancy and the property is legally available for re-letting from the next day',
      'The tenancy becomes a statutory periodic tenancy automatically on expiry, continuing on the same terms as the original agreement on a rolling month-to-month basis — neither party needs to take any action for this to occur',
      'A new fixed-term tenancy is created by operation of law based on the verbal agreement to renew — courts treat verbal agreements to renew residential tenancies as binding contracts under the Housing Act 1988',
      'The landlord must serve a formal notice to legally terminate the expired fixed-term tenancy before any new periodic or fixed-term agreement can commence, regardless of whether both parties intend to continue',
    ],
    correct: 1,
    rationale: 'Where a fixed-term AST expires without a new agreement being signed, the tenancy automatically becomes a statutory periodic tenancy under the Housing Act 1988, continuing on the same terms on a rolling basis. Neither party is required to do anything — the periodic tenancy arises automatically. This is why proactive renewal management is essential.',
  },

  // ── MASTER: Knowledge — Difficult Conversations (kno-01) ──────────────────

  {
    id: 'q-m-kno-01-1', moduleId: 'kno-01', tier: 'master',
    question: 'During a call about rent arrears, a tenant discloses they are experiencing domestic abuse. What is the appropriate immediate response?',
    options: [
      'Continue with the arrears conversation and note the personal matter in the file — personal circumstances do not affect the legal rent obligation and mixing welfare issues with financial discussions may cause confusion for both parties',
      'Transfer the call immediately to a manager without explaining why — the agency has no formal welfare remit and escalating without context allows the manager to approach the conversation without preconceptions',
      'Advise the tenant to speak directly to their landlord about their personal circumstances and, if necessary, seek advice from a Citizens Advice Bureau before the next scheduled arrears review',
      'Pause the arrears discussion, acknowledge what they have disclosed with empathy, signpost them to appropriate support services such as Refuge or the local authority, and escalate internally — this disclosure may require a different approach to the arrears situation',
    ],
    correct: 3,
    rationale: 'Disclosure of domestic abuse must be handled with immediate sensitivity and compassion. Pause the arrears conversation, acknowledge the disclosure, and signpost appropriate support. Internally escalate so the team can consider whether standard arrears processes remain appropriate. Many agencies have specific protocols for vulnerability disclosures — always follow them.',
  },
  {
    id: 'q-m-kno-01-2', moduleId: 'kno-01', tier: 'master',
    question: 'A tenant becomes verbally abusive on a call, using threatening language. How should you respond?',
    options: [
      'Maintain a neutral tone and continue engaging with the substance of their concern regardless of their language — staff are trained to de-escalate and disengaging from the call could be perceived as poor service or a refusal to address a legitimate complaint',
      'Calmly inform the tenant that you cannot continue the call while they are using abusive language, offer to call them back when they are ready to speak respectfully, and end the call if the behaviour continues — document the full incident including direct quotes',
      'Immediately transfer the call to a manager without notifying the tenant, as escalating to senior staff is the correct response to any threatening language without the need to first attempt de-escalation yourself',
      'Match the tenant\'s assertiveness to demonstrate that the agency takes their concern seriously — showing a calm but firm directness in response to aggressive language is recognised as an effective de-escalation technique in property management',
    ],
    correct: 1,
    rationale: 'Staff are never required to accept verbal abuse. Calmly and clearly state your position, give the tenant the opportunity to change their tone, and end the call if they do not. Always document the incident fully in the job chat, including direct quotes if possible. An internal note of the conversation protects the team and creates an accurate record.',
  },
  {
    id: 'q-m-kno-01-3', moduleId: 'kno-01', tier: 'master',
    question: 'A tenant alleges that their maintenance issues are being deprioritised compared to other tenants of a different ethnicity, and raises a potential discrimination complaint. What is the correct immediate action?',
    options: [
      'Treat this as a formal complaint, acknowledge receipt in writing, conduct an objective review of the job records and timelines, and escalate to a senior manager — any allegation of discrimination must be investigated properly regardless of how confident you are that it is unfounded',
      'Respond immediately by explaining that all jobs are handled on the same basis and providing the tenant with a summary of your standard prioritisation procedure — clear communication about process often resolves discrimination concerns without the need for formal escalation',
      'Log the allegation as a tenant conduct matter and refer them to the landlord\'s complaints procedure — discrimination allegations relating to property management decisions are a matter between the tenant and the property owner, not the agency',
      'Document the allegation as potentially vexatious behaviour and proceed with the maintenance schedule as normal — making changes to job prioritisation in response to an unsubstantiated allegation could create precedent for future claims',
    ],
    correct: 0,
    rationale: 'Any allegation of discrimination — even where you are confident it is unfounded — must be taken seriously and investigated properly. Acknowledge receipt, review the objective job records, and escalate internally. Dismissing it without investigation exposes the agency to significant legal and reputational risk under the Equality Act 2010.',
  },

  // ── MASTER: Knowledge — Disrepair (kno-02) ────────────────────────────────

  {
    id: 'q-m-kno-02-1', moduleId: 'kno-02', tier: 'master',
    question: 'A tenant\'s solicitor sends a Pre-Action Protocol letter for Housing Disrepair. What is the standard response window and consequence of missing it?',
    options: [
      'The standard window is 7 working days for acknowledgement and 28 days for a full response — missing these deadlines means the court will treat the matter as uncontested and may issue a default judgment in the tenant\'s favour',
      'The protocol requires a 14-day acknowledgement window; if no response is received within 14 days, the tenant\'s solicitor may apply for an expedited hearing and the landlord loses the right to dispute the scope of works claimed',
      'The Pre-Action Protocol requires acknowledgement within 20 working days and a full response within 3 months — failure to meet these timelines will be taken into account by the court and may result in adverse cost orders against the landlord or agent',
      'There is no formally mandated response window in the Pre-Action Protocol — solicitors commonly use 28-day deadlines as a courtesy convention, but missing them carries no formal court consequence provided a substantive response is eventually provided',
    ],
    correct: 2,
    rationale: 'The Pre-Action Protocol for Housing Conditions Claims sets specific timelines: acknowledgement within 20 working days and a full response within 3 months. Failure to comply will be taken into account by the court and can result in adverse cost orders. Escalate immediately to a senior manager and the landlord\'s legal team upon receipt.',
  },
  {
    id: 'q-m-kno-02-2', moduleId: 'kno-02', tier: 'master',
    question: 'A landlord tells you they have decided not to repair a damp issue as they plan to sell the property at the end of the tenancy. The tenant has been living with the problem for 3 months. What is the correct action?',
    options: [
      'Respect the landlord\'s decision and record it in the job notes — as the property owner they have full authority to defer maintenance decisions while continuing to exercise their rights under the tenancy agreement, including seeking possession for sale',
      'Advise the tenant that a resolution is planned after the sale completes, provide an estimated timeline, and flag the job as deferred pending sale in Dwelly — this manages tenant expectations while respecting the landlord\'s strategic property decision',
      'Close the maintenance job and document the landlord\'s decision as a business instruction, noting that any future disrepair claim arising from this period would be the landlord\'s sole liability as they provided written instruction overriding the agency\'s recommendation',
      'Document the landlord\'s refusal in writing, advise them formally that a planned sale does not suspend repairing obligations during an active tenancy, and escalate to senior management — continued refusal may require you to consider whether you can continue managing the property',
    ],
    correct: 3,
    rationale: 'A planned sale does not suspend a landlord\'s repairing obligations during an active tenancy. The tenant\'s right to a habitable property under Section 11 of the Landlord and Tenant Act 1985 and the Homes (Fitness for Human Habitation) Act 2018 continues regardless. Document the refusal, advise the landlord formally, and escalate — you may need to consider whether you can continue to manage the property.',
  },
  {
    id: 'q-m-kno-02-3', moduleId: 'kno-02', tier: 'master',
    question: 'Which combination of evidence is MOST likely to successfully defend a disrepair claim?',
    options: [
      'A signed statement from the landlord confirming they authorised and monitored all repair works, supported by the contractor\'s invoice, as it demonstrates consistent landlord oversight and willingness to invest in the property',
      'Timestamped Dwelly job logs covering the report date, all chasing attempts, contractor attendance records, completion evidence, and full communications with both landlord and tenant — a complete contemporaneous audit trail is the strongest possible defence',
      'A witness statement from the attending contractor confirming the repair was completed to a satisfactory standard, alongside the final invoice, providing the clearest technical evidence that the agency met its obligations regardless of the speed of the initial response',
      'The check-in inventory confirming the property was in good condition at the start of the tenancy, which shifts the burden of proof back to the tenant to demonstrate that the disrepair arose during the tenancy term',
    ],
    correct: 1,
    rationale: 'A strong disrepair defence requires a complete, contemporaneous audit trail: when the issue was reported, what action was taken and when, who was contacted, what delays occurred and why, and when the issue was resolved. Dwelly\'s job chat creates exactly this record. A single invoice or verbal account is far weaker without the full timeline.',
  },

  // ── MASTER: Knowledge — Financial Literacy (kno-03) ───────────────────────

  {
    id: 'q-m-kno-03-1', moduleId: 'kno-03', tier: 'master',
    question: 'A landlord contacts you frustrated because their net payment this month is £340 lower than their usual amount. What should you check first in Dwelly?',
    options: [
      'Check the tenant\'s payment record to confirm whether the rent has been paid in full and on time — a shortfall in the landlord\'s net payment most commonly indicates a late or partial rent payment rather than a deduction applied by the agency',
      'Review the Publications tab to check whether the property was unexpectedly re-listed or re-marketed during the month, which can trigger an automatic agency fee recalculation that would reduce the landlord\'s net payment',
      'Open the Notes tab to check whether any previous property manager left an explanation for anticipated deductions — historic notes often record agreed maintenance or compliance spend that was always expected to affect the month\'s payment',
      'Pull up the Ledger and review all transactions for the month — the shortfall will always be explained by a specific line item such as a contractor invoice, compliance charge, fee adjustment, or arrears offset, and you must be able to walk the landlord through each item',
    ],
    correct: 3,
    rationale: 'The Ledger is the source of truth for all financial transactions. A shortfall in the landlord\'s payment will always be explained by a transaction visible in the Ledger — contractor invoice, compliance fee, arrears deduction, or management fee adjustment. Always check the Ledger first and be prepared to walk the landlord through each line item.',
  },
  {
    id: 'q-m-kno-03-2', moduleId: 'kno-03', tier: 'master',
    question: 'A landlord asks you to explain why their annual profit from the property is lower than the gross rent collected. Which of the following is the most complete and accurate explanation?',
    options: [
      'The difference between gross rent and annual profit is entirely attributable to the agency management fee — the landlord\'s gross rent and net income would be equal if they self-managed the property without agency involvement',
      'Gross rent is reduced to net income primarily through mortgage interest and capital repayment charges — the other property costs such as maintenance and compliance certificates are minor and would not produce a significant gap between headline rent and actual profit',
      'Net profit equals gross rent minus all outgoings: mortgage interest, void periods, maintenance costs, compliance certificate renewals, management fees, insurance, and other authorised expenditure — understanding and explaining this full breakdown to landlords is a core property management skill',
      'The gap between gross rent and net profit is caused by the deposit protection scheme temporarily holding funds equivalent to 5–6 weeks\' rent — once the tenancy ends and the deposit is released, the landlord\'s overall returns reconcile to match the gross rent figure',
    ],
    correct: 2,
    rationale: 'A landlord\'s net profit from a rental property is gross rent minus all outgoings: mortgage interest (if applicable), void periods, routine maintenance, compliance certificates, property management fees, insurance, and any other authorised costs. Understanding and explaining this breakdown to landlords clearly is a core PM skill.',
  },
  {
    id: 'q-m-kno-03-3', moduleId: 'kno-03', tier: 'master',
    question: 'A landlord calls to say their statement shows a £450 maintenance deduction they did not authorise. What is the correct process?',
    options: [
      'Pull up the relevant job in Dwelly and review the authorisation trail in the job chat — determine whether the landlord\'s approval was correctly obtained and documented; if not, escalate internally and arrange a credit or appropriate resolution with the landlord',
      'Advise the landlord that once a contractor payment has been processed it cannot be reversed, but offer to raise the matter with the contractor directly to explore whether any portion of the charge can be refunded or credited against future works',
      'Escalate directly to the contractor, suspend them from the agency\'s preferred list pending review, and advise the landlord that a full investigation is under way — contractor conduct issues take priority over the internal authorisation review',
      'Log the landlord\'s dispute as a formal complaint, generate a credit note for £450 immediately as a goodwill gesture, and conduct the authorisation review separately — prompt financial resolution prevents escalation and preserves the landlord relationship',
    ],
    correct: 0,
    rationale: 'Every maintenance payment should have a documented authorisation trail in the Dwelly job chat. Pull up the relevant job, review the records, and determine whether authorisation was correctly obtained. If authorisation was not recorded or was insufficient, escalate immediately. This is both a financial and operational failure that must be addressed transparently.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RECAP QUIZ — Advanced scenario-based questions for experienced PMs (tier: 'recap')
  // These do NOT appear in standard module or master assessments.
  // ═══════════════════════════════════════════════════════════════════════════

  // ── RECAP: Compliance (cmp-02) ─────────────────────────────────────────────

  {
    id: 'q-r-cmp-02-1', moduleId: 'cmp-02', tier: 'recap',
    question: 'A gas safety certificate is due to expire in 4 days. The landlord\'s preferred engineer has no availability for 2 weeks. What is the correct action?',
    options: [
      'Instruct an alternative Gas Safe registered engineer immediately to ensure the certificate is renewed before expiry — landlord preference does not override the legal requirement, and letting a property with an expired certificate is a criminal offence regardless of the reason for the delay',
      'Contact the landlord\'s preferred engineer and request an emergency appointment, escalating the urgency — Gas Safe Regulations allow a 14-day grace period after expiry for renewal provided the appointment was booked before the expiry date',
      'Advise the landlord in writing that their preferred engineer is unavailable and request authorisation to use an alternative — proceed only once the landlord confirms in writing, as instructing a different contractor without authorisation exceeds the PM\'s standard authority',
      'Schedule the preferred engineer for the earliest available date in 2 weeks and serve the tenant with a temporary gas safety notice advising that the certificate will be briefly expired — the tenant\'s acknowledgement of the notice provides interim compliance cover',
    ],
    correct: 0,
    rationale: 'There is no grace period for gas safety certificate expiry — it is a criminal offence to let a property without a valid certificate. An alternative Gas Safe registered engineer must be instructed immediately if the preferred engineer is unavailable. The "14-day grace period" distractor is the most dangerous wrong answer because no such grace period exists in the Gas Safety (Installation and Use) Regulations.',
  },
  {
    id: 'q-r-cmp-02-2', moduleId: 'cmp-02', tier: 'recap',
    question: 'A landlord asks you to backdate a gas safety certificate to cover a 3-day gap where the previous certificate had expired before the new check was completed. What should you do?',
    options: [
      'Comply with the request but ensure the backdated certificate is clearly marked as covering the gap period — Gas Safe engineers can issue certificates with a retrospective start date provided the inspection confirmed no issues during the gap',
      'Advise the landlord that while backdating is not standard practice, the gap is minor and unlikely to attract enforcement attention — record the actual dates internally but allow the engineer to amend the certificate date if they are willing',
      'Refuse — backdating a gas safety certificate is fraud and a criminal offence. Document the gap with actual dates, advise the landlord in writing of the implications, and escalate to senior management as the agency may need to self-report if a tenancy was active during the gap',
      'Contact the Gas Safe engineer and ask whether they can reissue the certificate with adjusted dates as a professional courtesy — the decision to backdate sits with the certified engineer, not the agency, and their professional judgement should be respected',
    ],
    correct: 2,
    rationale: 'Backdating a gas safety certificate is fraud and a criminal offence. The PM must refuse, document the gap with actual dates, and escalate internally. The "defer to the engineer\'s professional judgement" distractor is subtly wrong because it frames fraud as a discretionary professional decision — neither the engineer nor the agency has the authority to backdate a safety certificate under any circumstances.',
  },
  {
    id: 'q-r-cmp-02-3', moduleId: 'cmp-02', tier: 'recap',
    question: 'A tenant\'s deposit was protected within 30 days of receipt but the prescribed information was served on day 32. The tenant\'s solicitor has now raised the late service in a dispute. What is the exposure?',
    options: [
      'The exposure is limited — prescribed information must be served within a \'reasonable time\' after deposit protection, and 32 days is within the tolerance accepted by most courts provided the deposit itself was protected within the statutory 30-day window',
      'The solicitor\'s argument has no merit — the 30-day requirement applies only to the act of protecting the deposit with the scheme, not to the service of prescribed information, which has a separate 14-day window from the date of protection confirmation',
      'The exposure is a potential compliance flag on the agency\'s record with the deposit scheme, but it does not affect the validity of the deposit protection itself — the tenant\'s solicitor cannot claim compensation for late prescribed information if the deposit was protected on time',
      'The prescribed information must also be served within 30 days. Late service — even by 2 days — means the deposit is not validly protected under the legislation, exposing the landlord to compensation of 1x to 3x the deposit value and affecting the landlord\'s ability to seek possession until the situation is remedied',
    ],
    correct: 3,
    rationale: 'Both the deposit protection and service of prescribed information must be completed within 30 days of receipt. Serving prescribed information on day 32 — even just 2 days late — means the deposit is not validly protected, exposing the landlord to compensation of 1x to 3x the deposit and affecting the landlord\'s ability to seek possession. The "reasonable time" distractor is wrong because the 30-day deadline is statutory and absolute with no tolerance.',
  },
  {
    id: 'q-r-cmp-02-4', moduleId: 'cmp-02', tier: 'recap',
    question: 'An EICR report returns as \'unsatisfactory\' with C2 observations (potentially dangerous). The landlord asks whether the tenancy can continue while remedial works are scheduled. What is the correct position?',
    options: [
      'The tenancy must be suspended immediately and the tenant temporarily relocated — a C2 observation means the property is not safe to occupy, and the landlord must provide alternative accommodation until all observations are remedied and the EICR is re-certified as satisfactory',
      'The tenancy can continue, but the landlord is legally required to complete remedial works within 28 days or the period specified by the inspector, and must provide evidence of completion to the local authority — failure to do so is a criminal offence under the Electrical Safety Standards regulations',
      'The tenancy can continue indefinitely as C2 observations are advisory recommendations, not mandatory requirements — only C1 observations (danger present) require immediate action, and C2 items can be addressed at the next scheduled EICR renewal',
      'The tenancy can continue for a maximum of 90 days while works are scheduled, after which the local authority must be notified of the outstanding observations — the 90-day window is a statutory provision allowing landlords reasonable time to arrange specialist electrical contractors',
    ],
    correct: 1,
    rationale: 'The tenancy can continue but remedial works for C2 observations must be completed within 28 days (or the period specified by the inspector), with evidence of completion provided to the local authority. Failure to comply is a criminal offence. The "C2 is advisory" distractor is dangerously wrong — C2 observations are legally mandatory requirements, not optional recommendations, and must be remedied within the specified timeframe.',
  },
  {
    id: 'q-r-cmp-02-5', moduleId: 'cmp-02', tier: 'recap',
    question: 'A tenant reports that their smoke alarm was beeping and they removed the battery. During your next visit you confirm the alarm is non-functional. Who is responsible for ensuring it works?',
    options: [
      'The tenant is solely responsible once the tenancy has commenced — the Smoke and Carbon Monoxide Alarm Regulations place the obligation on the landlord only at the start of each new tenancy, and mid-tenancy maintenance of alarms is entirely the tenant\'s duty',
      'The landlord is solely responsible for all smoke alarm maintenance throughout the tenancy under the current regulations — the tenant has no obligation to maintain, test, or replace batteries in any safety equipment provided by the landlord',
      'The landlord must ensure alarms work at each tenancy start, but tenants have a reasonable duty to replace batteries and report faults. If the alarm is hardwired or has a unit fault rather than a flat battery, repair falls to the landlord — document the finding and instruct the appropriate repair',
      'Neither party bears direct responsibility mid-tenancy — smoke alarm regulations create a \'point in time\' obligation at tenancy commencement only, and neither the landlord nor tenant can be penalised for a non-functional alarm discovered during a routine mid-tenancy inspection',
    ],
    correct: 2,
    rationale: 'Responsibility is shared: the landlord must ensure alarms are functional at the start of each tenancy, while tenants have a reasonable duty to replace batteries and report faults during the tenancy. If the fault is with the unit itself (not just a battery), repair falls to the landlord. The "tenant solely responsible" distractor is partially right about battery replacement but wrong to exclude the landlord entirely from mid-tenancy responsibility for unit faults.',
  },
  {
    id: 'q-r-cmp-02-6', moduleId: 'cmp-02', tier: 'recap',
    question: 'A landlord owns two flats in the same building. Flat A has a valid gas safety certificate but Flat B\'s has expired. The landlord asks you to \'extend\' the Flat A certificate to cover Flat B since they share the same boiler system. Is this possible?',
    options: [
      'This is possible where the flats share a communal boiler system — the Gas Safe engineer can issue a single certificate covering both flats provided the shared installation is documented and both properties are inspected during the same visit',
      'This is possible provided the Gas Safe engineer confirms in writing that the shared boiler system has been tested from both flats\' connection points — a supplementary letter attached to the Flat A certificate extends coverage to Flat B for the remainder of Flat A\'s certificate period',
      'This is possible under the communal installations provision of the Gas Safety Regulations, which allows a single certificate to cover multiple dwellings served by the same gas installation — the landlord simply needs to register both properties against the same certificate reference number',
      'This is not possible — each property requires its own individual gas safety inspection and certificate regardless of shared systems. The installation in each flat must be separately inspected, tested, and certified. Instruct a separate inspection for Flat B immediately',
    ],
    correct: 3,
    rationale: 'Each property requires its own individual gas safety certificate regardless of shared boiler systems. A certificate for Flat A cannot be extended, shared, or applied to Flat B. The "communal installations provision" distractor is the most plausible wrong answer because it uses real-sounding regulatory language, but no such provision exists — each dwelling must be separately inspected and certified.',
  },
  {
    id: 'q-r-cmp-02-7', moduleId: 'cmp-02', tier: 'recap',
    question: 'The government announces a change to deposit protection legislation taking effect in 60 days. Your portfolio has 120 active tenancies. What should the agency do during the transition period?',
    options: [
      'Conduct a full audit of all 120 deposits against the new requirements, identify tenancies that will become non-compliant, create an action plan with individual deadlines, and implement all changes before the effective date — waiting until the deadline creates concentrated risk',
      'Focus on new tenancies commencing after the effective date only — existing tenancies are protected by transitional provisions that allow landlords up to 12 months from the effective date to bring their deposit arrangements into compliance with the new rules',
      'Wait for formal guidance from the deposit protection schemes before taking any action — the schemes will contact each landlord individually with specific instructions for their portfolio, and premature action risks creating compliance issues if the guidance differs from the legislation',
      'Implement changes immediately across all 120 tenancies without waiting for the effective date — early compliance demonstrates best practice and the deposit schemes will process changes at any point, so there is no benefit to waiting for the official start date',
    ],
    correct: 0,
    rationale: 'The agency should conduct a full audit of all deposits against the new requirements, identify non-compliant tenancies, create an action plan, and implement changes before the effective date. Waiting creates concentrated risk. The "transitional provisions" distractor is plausible because transitional provisions do sometimes exist in legislation, but assuming they apply without verifying is a dangerous compliance gamble.',
  },
  {
    id: 'q-r-cmp-02-8', moduleId: 'cmp-02', tier: 'recap',
    question: 'A landlord wants to switch deposit protection schemes mid-tenancy because they found a cheaper provider. What must happen to ensure continuous compliance?',
    options: [
      'Advise the landlord that switching schemes mid-tenancy is not possible — the deposit must remain with the original scheme for the duration of the tenancy, and can only be transferred at the point of tenancy renewal when a new prescribed information notice is due in any event',
      'The deposit must be returned from the original scheme and re-protected with the new scheme within 30 days, with new prescribed information served on the tenant within the same timeframe — the original protection must remain in place until the new scheme confirms protection is active',
      'The deposit can be transferred directly between schemes using the inter-scheme transfer process, which maintains continuous protection without any gap — the tenant does not need to be notified as the transfer is administrative and does not affect their rights',
      'The landlord can switch schemes but only at the next rent review date, as the prescribed information includes the scheme details and can only be lawfully re-served at a point where other tenancy terms are also being reviewed or amended',
    ],
    correct: 1,
    rationale: 'Switching deposit schemes mid-tenancy is possible but requires careful management: the deposit must be returned from the original scheme and re-protected with the new scheme within 30 days, with new prescribed information served on the tenant. Crucially, the original protection must remain active until the new scheme confirms coverage. The "not possible mid-tenancy" distractor is incorrect — there is no legal barrier to switching schemes, but the process must be managed to avoid any gap in protection.',
  },

  // ── RECAP: Maintenance (mnt-02) ───────────────────────────────────────────
  {
    id: 'q-r-mnt-02-1', moduleId: 'mnt-02', tier: 'recap',
    question: 'A contractor attends a repair and reports that the issue is far more extensive than anticipated — the £200 authorised job is actually an £1,800 structural repair. The tenant is elderly and distressed. What is the correct process?',
    options: [
      'Authorise the full £1,800 immediately under the emergency escalation provision — the tenant\'s vulnerability and the structural nature of the repair justify bypassing standard authorisation limits, and the landlord can be invoiced retrospectively with a full explanation',
      'Instruct the contractor to proceed with the structural repair using the agency\'s emergency maintenance fund, which covers overspends up to 5x the original authorisation on repairs affecting the property\'s structural integrity or tenant safety',
      'Stop work beyond the authorised amount, make the area safe if possible, and contact the landlord immediately with the contractor\'s findings and a full cost breakdown — do not authorise additional spend without landlord approval regardless of the tenant\'s distress',
      'Proceed with the repair up to 3x the original authorisation (£600) under standard escalation rules, then pause and seek landlord approval for the remaining amount — PMs have discretion to authorise up to three times the original quote where the scope materially changes on site',
    ],
    correct: 2,
    rationale: 'Regardless of the tenant\'s vulnerability or the nature of the repair, authorisation limits exist for a reason. Stop work beyond the approved amount, make safe, and contact the landlord with full details. Option 0 is wrong because no emergency escalation provision permits a PM to authorise a 9x overspend without landlord approval.',
  },
  {
    id: 'q-r-mnt-02-2', moduleId: 'mnt-02', tier: 'recap',
    question: 'A landlord insists on using a family member as their sole contractor. The family member is not Gas Safe registered, has no public liability insurance, and no professional qualifications. What should you advise?',
    options: [
      'Advise the landlord in writing that the agency cannot instruct an unqualified, unregistered, and uninsured contractor — using an uninsured contractor exposes them to personal liability, gas work by an unregistered person is criminal, and the agency\'s own insurance may be voided',
      'Accept the landlord\'s instruction for non-gas general maintenance work only, and use the agency\'s approved contractors for gas, electrical, and compliance-related work — the landlord\'s choice of contractor is their prerogative for routine repairs that do not involve regulated installations',
      'Advise the landlord of the risks but ultimately comply with their instruction as the property owner — the agency\'s role is advisory, and a documented recommendation against using the contractor protects the agency\'s position if a claim subsequently arises',
      'Request that the family member obtains public liability insurance and a basic DBS check within 14 days, after which they can be added to the agency\'s approved contractor list — Gas Safe registration is only required for gas-specific work and does not affect general maintenance eligibility',
    ],
    correct: 0,
    rationale: 'The agency must refuse to instruct an uninsured, unqualified contractor. Gas work by an unregistered person is a criminal offence, and lack of insurance exposes both landlord and agency. Option 1 is wrong because even non-gas work by an uninsured contractor creates unacceptable liability for the agency if injury or damage occurs on site.',
  },
  {
    id: 'q-r-mnt-02-3', moduleId: 'mnt-02', tier: 'recap',
    question: 'A tenant reports a leak from the flat above which is damaging their ceiling and belongings. The upstairs flat is managed by a different agency. What is your responsibility?',
    options: [
      'Your responsibility ends at documenting the damage for your tenant\'s records — inter-property leaks are a matter between the two freeholders or their respective managing agents, and you should direct your tenant to contact the upstairs flat\'s agent themselves',
      'Instruct your approved plumber to access the upstairs flat and repair the leak at source — the emergency nature of water damage gives the managing agent of the affected property an implied right of access to the source property to prevent further damage',
      'Raise the matter with the building\'s freeholder or managing company only, as communal building issues fall outside the scope of individual flat management — the freeholder bears responsibility for inter-flat leaks and must coordinate between both managing agents',
      'Document the damage with photographs, raise an emergency job to prevent further water ingress where possible, contact the managing agent of the upstairs flat or the freeholder immediately, and advise your tenant to document losses for a potential insurance claim — you cannot access or instruct works in a property you do not manage, but must advocate actively for your tenant',
    ],
    correct: 3,
    rationale: 'The PM must actively advocate for their tenant: document damage, mitigate where possible, contact the other agent or freeholder, and advise on insurance. Option 0 is wrong because simply documenting and directing the tenant to handle it themselves falls far short of the managing agent\'s duty of care to their tenant.',
  },
  {
    id: 'q-r-mnt-02-4', moduleId: 'mnt-02', tier: 'recap',
    question: 'A routine inspection reveals suspected asbestos-containing materials in the property\'s artex ceiling. The property was built in 1975. What is the immediate protocol?',
    options: [
      'Take a small sample of the artex material using a sealed bag and send it to a testing laboratory for analysis — identifying whether asbestos is present is the priority, and a physical sample test provides a definitive answer within 48 hours',
      'Do not disturb the suspected material under any circumstances — leave the area, prevent access, and commission an asbestos survey from a UKAS-accredited laboratory before any further work is carried out. Undisturbed asbestos in good condition may be managed in situ with a management plan',
      'Arrange immediate removal of the artex ceiling by a licensed asbestos removal contractor — any property built before 1980 with artex ceilings must be treated as containing asbestos and the material should be removed as a precautionary measure to protect the tenant',
      'Inform the tenant that artex ceilings in properties of this age commonly contain asbestos but that it is only dangerous when disturbed — advise them not to sand, drill, or scrape the ceiling and schedule a risk assessment within the next quarterly inspection cycle',
    ],
    correct: 1,
    rationale: 'Suspected asbestos must never be disturbed. The correct response is to leave the area, prevent access, and commission a UKAS-accredited survey. Option 0 is critically wrong because taking a sample of suspected asbestos-containing material without specialist training and equipment risks releasing fibres and is illegal without proper licensing.',
  },
  {
    id: 'q-r-mnt-02-5', moduleId: 'mnt-02', tier: 'recap',
    question: 'Three separate tenants in your portfolio report boiler breakdowns on the same day during a January cold snap. All three are classified as emergency repairs. How should you prioritise?',
    options: [
      'Assess vulnerability first — households with elderly residents, young children, or medical conditions take priority. Instruct emergency engineers for all three immediately without waiting for landlord authorisation, and provide temporary heating where engineers cannot attend within 24 hours',
      'Prioritise in order of report time — the first tenant to report receives the first available engineer, followed by the second and third. This ensures fair and transparent allocation that cannot be challenged, and all three tenancies receive equal treatment under the agency\'s SLA',
      'Escalate all three to the senior maintenance manager for prioritisation — triple-emergency situations require management oversight, and the PM should not make independent priority decisions when multiple tenants have equally urgent needs competing for limited contractor availability',
      'Instruct one engineer to attend all three properties sequentially on the same day, prioritised by geographical proximity to minimise travel time — this is the most efficient deployment of a scarce emergency resource and ensures all three tenants are seen within the same working day',
    ],
    correct: 0,
    rationale: 'Vulnerability must drive prioritisation for competing emergencies. Elderly, young children, and medical conditions take precedence. Temporary heating must be provided if engineers cannot attend within 24 hours. Option 1 is wrong because chronological order ignores vulnerability — a household with an elderly resident in freezing conditions is more urgent than a healthy adult who reported first.',
  },
  {
    id: 'q-r-mnt-02-6', moduleId: 'mnt-02', tier: 'recap',
    question: 'A contractor completes a repair but the tenant calls the same day to report the issue has returned. The contractor insists their work was satisfactory and refuses to return without a new call-out fee. What is the correct approach?',
    options: [
      'Pay the new call-out fee to ensure the tenant\'s issue is resolved quickly, then deduct the fee from the contractor\'s next invoice as a goodwill recovery — the tenant\'s comfort takes priority over the commercial dispute with the contractor',
      'Advise the tenant that the contractor has confirmed the work is satisfactory and that a recurrence on the same day is likely a separate underlying issue — instruct a different contractor for a fresh diagnostic visit and treat it as a new job with a new authorisation',
      'The initial repair carries a reasonable defects liability — a same-day recurrence is a callback under the original job, not a new instruction. Contact the contractor formally, reference the original job, and request a return at no additional cost; if they refuse, dispute the original invoice and consider removing them from the approved list',
      'Accept the contractor\'s position and close the original job as completed, then open a new maintenance job for the recurrence — each reported issue must be treated as a separate job for audit trail purposes, and the new job will have its own authorisation and invoicing process',
    ],
    correct: 2,
    rationale: 'A same-day recurrence is a defect in the original repair, not a new job. The contractor has a defects liability and must return at no additional cost. Option 0 is wrong because paying a second call-out fee for defective work sets a poor precedent and the cost should not be incurred when the original repair was inadequate.',
  },
  {
    id: 'q-r-mnt-02-7', moduleId: 'mnt-02', tier: 'recap',
    question: 'A landlord asks you to arrange a loft conversion as part of \'improving the property.\' This falls well outside routine maintenance. How should you handle this?',
    options: [
      'Accept the instruction and manage the loft conversion as a major works project under the property management agreement — the management fee may need to be renegotiated to reflect the additional project management scope, but this falls within the agency\'s responsibilities as managing agent',
      'Explain that major property improvements and structural alterations are outside the standard property management agreement and maintenance scope — the landlord should engage a specialist project manager or architect directly, and the agency should not manage a loft conversion under the maintenance budget',
      'Decline to manage the project yourself but offer to subcontract the project management to a third-party building consultancy through the agency — this keeps the relationship within the agency while ensuring qualified specialists handle the structural work',
      'Arrange a meeting between the landlord and three approved building contractors to discuss the loft conversion scope and obtain quotes — while the agency does not directly manage major works, facilitating the initial contractor selection is within the PM\'s advisory role',
    ],
    correct: 1,
    rationale: 'Loft conversions are major structural works outside the scope of a standard property management agreement. The landlord should engage a specialist directly. Option 0 is wrong because managing a loft conversion under a standard PMA exposes the agency to significant professional liability for a project type it is neither qualified nor insured to oversee.',
  },
  {
    id: 'q-r-mnt-02-8', moduleId: 'mnt-02', tier: 'recap',
    question: 'A tenant reports persistent damp and mould in the bedroom. A contractor has attended twice and applied anti-mould treatment both times. The problem returns within weeks each time. What should happen next?',
    options: [
      'Arrange a third anti-mould treatment using a different product — some mould strains are resistant to standard treatments, and a specialist anti-fungal application may achieve a more lasting result. If the third treatment also fails, then escalate to a specialist survey',
      'Advise the tenant that the recurring mould is likely caused by their lifestyle — inadequate ventilation from not opening windows and drying clothes indoors are the most common causes of bedroom mould, and a formal letter reminding them of their obligations to ventilate the property should be sent',
      'Close the maintenance job and refer the matter to the landlord\'s buildings insurance as a potential damp claim — two failed repair attempts indicate the issue is beyond routine maintenance and should be handled through the insurance claims process rather than the management budget',
      'Two failed surface treatments indicate the root cause is not being addressed. Commission a specialist damp survey — the issue may be penetrating damp, rising damp, or condensation from inadequate ventilation or insulation. The landlord must be advised that continuing surface treatments raises disrepair claim risk significantly',
    ],
    correct: 3,
    rationale: 'Two failed surface treatments clearly indicate the root cause is unaddressed. A specialist damp survey is essential to identify whether the issue is penetrating damp, rising damp, or condensation. Option 1 is wrong because blaming the tenant without a proper survey is both unprofessional and legally risky — if the cause is structural, the landlord faces a disrepair claim.',
  },

  // ── RECAP: Move-Outs (mvt-02) ────────────────────────────────────────────
  {
    id: 'q-r-mvt-02-1', moduleId: 'mvt-02', tier: 'recap',
    question: 'A tenant gives notice to vacate but changes their mind 5 days before the move-out date. The landlord has already agreed a new tenancy starting immediately after. What is the legal position?',
    options: [
      'The tenant has an automatic right to withdraw their notice at any time before the actual move-out date — a notice to quit is revocable until the tenant physically vacates, and the landlord must cancel the incoming tenancy if the existing tenant wishes to remain',
      'The tenant can withdraw their notice unilaterally provided they do so more than 48 hours before the move-out date — the 48-hour rule gives both parties a reasonable final decision window, and the landlord must accommodate the withdrawal if it falls within this period',
      'Once the tenant has served a valid notice and the landlord has acted on it by agreeing a new tenancy, the notice cannot be unilaterally withdrawn — both parties must agree to revoke it. The landlord is not obligated to allow the tenant to remain',
      'The tenant\'s notice becomes irrevocable only when the replacement tenant has signed a tenancy agreement and paid a holding deposit — until that point, the existing tenant can withdraw their notice without the landlord\'s consent, and the incoming applicant has no enforceable right',
    ],
    correct: 2,
    rationale: 'Once a valid notice has been served and the landlord has acted on it, the notice cannot be unilaterally withdrawn — mutual agreement is required. Option 0 is wrong because a notice to quit is not automatically revocable; once the landlord has relied on it and entered commitments, unilateral withdrawal would prejudice the landlord\'s position.',
  },
  {
    id: 'q-r-mvt-02-2', moduleId: 'mvt-02', tier: 'recap',
    question: 'During a checkout inspection, the inventory clerk notes damage that matches items already flagged in a mid-tenancy inspection report as needing landlord action. Can the landlord claim these as tenant damage at checkout?',
    options: [
      'No — if the damage was identified during a mid-tenancy inspection and the landlord failed to address it, it cannot be attributed to the tenant at checkout. The mid-tenancy report serves as evidence that the landlord was on notice of the issue and chose not to repair',
      'Yes — the mid-tenancy report records the damage but does not determine liability. The damage may have been caused by the tenant before the mid-tenancy inspection, and the landlord\'s failure to repair during the tenancy does not absolve the tenant of their original responsibility',
      'The landlord can claim only for any deterioration that occurred between the mid-tenancy inspection and the checkout — the mid-tenancy report establishes a new baseline, and only additional damage beyond what was already recorded can be charged to the tenant\'s deposit',
      'The landlord can claim the full cost provided they issue a formal notice to the tenant at the point of checkout acknowledging that the damage was flagged mid-tenancy but confirming that the tenant remains liable under the terms of the AST regardless of the landlord\'s decision not to repair',
    ],
    correct: 0,
    rationale: 'Damage flagged in a mid-tenancy inspection as needing landlord action cannot later be claimed as tenant damage at checkout. The report is evidence the landlord was on notice and chose not to act. Option 1 is wrong because regardless of who caused the damage, the landlord\'s documented decision not to repair when notified undermines any subsequent claim against the tenant\'s deposit.',
  },
  {
    id: 'q-r-mvt-02-3', moduleId: 'mvt-02', tier: 'recap',
    question: 'A tenant vacates and the property requires a professional clean. The check-in inventory recorded the property as \'professionally cleaned\' at the start of the tenancy. The tenant argues they cleaned it themselves and it is \'reasonable.\' What determines the deduction?',
    options: [
      'The tenant\'s argument has merit — \'reasonable\' cleanliness is the legal standard applied by adjudicators, and a professional clean at check-in does not create an obligation for the tenant to return the property to a professional clean standard at checkout',
      'The standard required at checkout mirrors the standard recorded at check-in. If the property was professionally cleaned at the start and this is documented, the landlord is entitled to deduct the cost of a professional clean if the tenant\'s own cleaning does not meet that standard',
      'The deduction depends on the length of the tenancy — for tenancies over 2 years, fair wear and tear adjustments reduce the professional clean requirement proportionally, and an adjudicator would apply a percentage reduction based on the tenancy duration',
      'The tenant is correct — the Tenant Fees Act prohibits charging tenants for professional cleaning at the end of a tenancy, regardless of the check-in standard. The landlord must absorb the cost of any professional clean as part of their normal letting expenses',
    ],
    correct: 1,
    rationale: 'The checkout standard mirrors the check-in standard. If professionally cleaned at the start and documented, the landlord can deduct for a professional clean if the tenant\'s cleaning falls short. Option 3 is wrong because the Tenant Fees Act does not prohibit cleaning deductions from deposits — it restricts upfront fees, not legitimate deposit claims for restoring the property to its documented check-in condition.',
  },
  {
    id: 'q-r-mvt-02-4', moduleId: 'mvt-02', tier: 'recap',
    question: 'The landlord wants to charge the outgoing tenant the full cost of replacing a 9-year-old carpet with significant wear. The check-in inventory records the carpet as \'good condition — approximately 2 years old\' at the start of the 7-year tenancy. What is the likely adjudication outcome?',
    options: [
      'The full replacement cost will be upheld — the check-in inventory proves the carpet was in good condition when the tenant took possession, and 7 years of tenant use has rendered it beyond repair, establishing clear liability for the full deterioration',
      'The full cost will be awarded but reduced by 20% for fair wear and tear — adjudicators apply a standard 20% deduction on any betterment claim where the landlord receives a new item replacing a used one, regardless of the item\'s age or remaining lifespan',
      'The claim will be rejected entirely — a 7-year tenancy exceeds the standard fair wear and tear threshold for carpet claims, and adjudicators will not award any deduction for carpet deterioration where the tenancy lasted more than 5 years',
      'The claim will likely be reduced significantly — the carpet is now approximately 9 years old, approaching its expected 8-10 year lifespan. An adjudicator would apply betterment and fair wear and tear principles, prorating any award against the carpet\'s remaining useful life at the start of the tenancy',
    ],
    correct: 3,
    rationale: 'An adjudicator will apply betterment and fair wear and tear. A 9-year-old carpet near the end of its lifespan means the landlord receives a new carpet replacing one with minimal remaining life, so any award is heavily prorated. Option 0 is wrong because full replacement cost ignores betterment — the landlord would receive a brand-new carpet at the tenant\'s expense when the original was nearly at end of life.',
  },
  {
    id: 'q-r-mvt-02-5', moduleId: 'mvt-02', tier: 'recap',
    question: 'A joint tenant serves notice to leave but the other joint tenant wants to remain in the property. What are the implications for the tenancy?',
    options: [
      'One joint tenant\'s notice terminates the entire joint tenancy — the remaining tenant has no automatic right to stay. The landlord can choose to grant a new tenancy to the remaining individual, which would be a new agreement requiring a fresh deposit arrangement',
      'The departing tenant\'s notice only terminates their interest in the tenancy — the remaining tenant\'s rights are protected under the Housing Act 1988, and the tenancy continues as a sole tenancy with the remaining individual automatically becoming the sole tenant',
      'The notice is invalid — a joint tenancy can only be terminated by all joint tenants acting together, and a unilateral notice from one tenant has no legal effect. Both tenants must serve notice or the tenancy continues until its natural expiry',
      'The tenancy converts to a sole periodic tenancy for the remaining tenant automatically on the date the departing tenant vacates — no new agreement is needed, but the deposit must be recalculated for a single tenant and the prescribed information re-served within 30 days',
    ],
    correct: 0,
    rationale: 'One joint tenant\'s valid notice terminates the entire joint tenancy (Hammersmith v Monk). The remaining tenant has no automatic right to stay but the landlord may offer a new tenancy. Option 2 is wrong because the established legal principle is that one joint tenant can end the tenancy unilaterally — mutual agreement is not required for notice.',
  },
  {
    id: 'q-r-mvt-02-6', moduleId: 'mvt-02', tier: 'recap',
    question: 'A tenant disputes a dilapidation charge and submits their own undated photographs as counter-evidence. The photographs do not match the property layout shown in the checkout report. Should these be considered in the dispute?',
    options: [
      'The photographs must be given equal weight to the checkout report — adjudicators are required to consider all evidence submitted by both parties equally, and the tenant\'s photographs create a genuine evidential conflict that may result in the claim being split',
      'The photographs should be excluded from the adjudication entirely — undated images that do not match the property layout are inadmissible evidence under deposit scheme rules, and the adjudicator will disregard them automatically during the assessment',
      'The photographs carry little evidential weight — the adjudicator will prioritise contemporaneous dated evidence from the checkout report and check-in inventory taken by an independent clerk. Advise the tenant that undated evidence with layout inconsistencies is given significantly less weight',
      'The photographs are admissible but create reasonable doubt — any evidential uncertainty in a deposit dispute is resolved in the tenant\'s favour under the legal principle that the landlord bears the burden of proof, meaning the undated photos would likely result in the claim being reduced',
    ],
    correct: 2,
    rationale: 'Adjudicators prioritise contemporaneous, dated evidence from independent sources. Undated photographs with layout inconsistencies carry very little weight. Option 3 is wrong because while the landlord bears the burden of proof, undated photos with inconsistencies do not create sufficient reasonable doubt to overcome a professional, dated checkout report.',
  },
  {
    id: 'q-r-mvt-02-7', moduleId: 'mvt-02', tier: 'recap',
    question: 'A tenant has vacated but left a large sofa and a washing machine, saying they \'don\'t want them anymore.\' The landlord wants them removed immediately to prepare for re-letting. What is the correct procedure?',
    options: [
      'The tenant\'s statement that they don\'t want the items constitutes a verbal surrender of ownership — the landlord can remove and dispose of the items immediately at the tenant\'s cost, with the disposal charges deducted from the deposit as a legitimate end-of-tenancy expense',
      'Even with the tenant\'s verbal statement, follow the Torts (Interference with Goods) Act 1977: send a formal written notice to the tenant\'s forwarding address giving them a reasonable period (typically 14-21 days) to collect. Only after this period expires can you dispose of the items',
      'Photograph the items, send a text message to the tenant confirming you will dispose of them unless they respond within 7 days, and proceed with removal if no response is received — digital communication constitutes valid notice under the modern interpretation of the Torts Act',
      'The tenant\'s verbal instruction to dispose of the items is sufficient authority to proceed with immediate removal — obtain the instruction in writing via email for your records, then arrange disposal and charge the cost to the tenant\'s deposit under the dilapidations schedule',
    ],
    correct: 1,
    rationale: 'The Torts (Interference with Goods) Act 1977 requires formal written notice and a reasonable collection period before disposal, even if the tenant says they don\'t want the items. Option 0 is wrong because verbal surrender of ownership is insufficient — without formal written notice and a reasonable collection period, disposing of the goods could expose the landlord to a tortious interference claim.',
  },
  {
    id: 'q-r-mvt-02-8', moduleId: 'mvt-02', tier: 'recap',
    question: 'A tenant\'s deposit is held in a custodial scheme. The landlord and tenant cannot agree on deductions. The landlord wants to delay submitting to adjudication because they are \'gathering more evidence.\' It has been 8 weeks since the tenancy ended. What is the risk?',
    options: [
      'There is no risk in waiting — custodial deposit schemes impose no deadline for initiating the adjudication process, and the landlord is entitled to take as long as necessary to compile comprehensive evidence before submitting their claim to the adjudicator',
      'The only risk is that the tenant may raise a formal complaint with the deposit scheme about the delayed return of their undisputed portion — however, the landlord\'s right to the disputed amount is preserved indefinitely while evidence is being gathered',
      'The risk is limited to the tenant\'s ability to claim interest on the withheld deposit — after 6 weeks, statutory interest begins accruing on any undisputed portion that has not been returned, but this does not affect the disputed amount or the adjudication outcome',
      'Unreasonable delay risks adverse inference from the adjudicator and potential time-bar — most custodial schemes require disputes to be raised within a specific window. The tenant may also complain about delayed return of undisputed funds. Advise the landlord to submit now with available evidence rather than risk prejudicing the claim',
    ],
    correct: 3,
    rationale: 'Custodial schemes impose time limits for raising disputes, and unreasonable delay risks adverse inference from the adjudicator. The landlord should submit with available evidence now. Option 0 is wrong because custodial schemes do impose deadlines — failing to raise the dispute within the required window can result in the full deposit being returned to the tenant by default.',
  },

  // ── RECAP: Inspections (ins-02) ────────────────────────────────────────────

  {
    id: 'q-r-ins-02-1', moduleId: 'ins-02', tier: 'recap',
    question: 'During a routine inspection, you notice the tenant has installed a lock on one of the bedroom doors that wasn\'t there at check-in. The tenant says it\'s for their child\'s safety. What should you do?',
    options: [
      'Instruct the tenant to remove the lock immediately and restore the door to its original condition — any alteration, however minor, constitutes a breach of the standard AST prohibition on modifications and must be reversed before the next inspection',
      'Ignore the alteration as it is a minor domestic modification with no impact on the property\'s condition — raising it formally could damage the landlord-tenant relationship over an issue that would not realistically result in any end-of-tenancy deduction',
      'Photograph the lock and raise a formal AST breach notice requiring the tenant to either remove the lock within 14 days or provide evidence that the landlord consented in writing — standard breach notice procedures apply regardless of the tenant\'s stated reason',
      'Document the alteration in the inspection report with photographs. Advise the tenant that alterations require written landlord consent, note it for the landlord\'s attention, and recommend that the lock is either formally approved via a written variation or removed before the end of tenancy to avoid a dilapidation charge',
    ],
    correct: 3,
    rationale: 'The correct approach is proportionate: document, advise, and escalate to the landlord for a decision. Demanding immediate removal (option 0) is disproportionate and ignores the landlord\'s right to consent to alterations. Ignoring it entirely (option 1) fails to protect the landlord\'s interest and leaves the tenant exposed to an end-of-tenancy charge.',
  },
  {
    id: 'q-r-ins-02-2', moduleId: 'ins-02', tier: 'recap',
    question: 'You arrive for a scheduled inspection and the tenant refuses entry, saying they don\'t feel well and want to rearrange. This is the third consecutive cancelled inspection in 6 months. What is the correct approach?',
    options: [
      'You cannot force entry — the tenant\'s right to quiet enjoyment must be respected. Write to the tenant formally explaining that inspections are a tenancy condition and required for their protection and the landlord\'s compliance, offer multiple alternative dates, and advise that continued refusal will be escalated. Inform the landlord',
      'After three refusals, the agency has grounds to enter the property using the landlord\'s key with 24 hours\' written notice — the AST inspection clause creates a contractual right of access that overrides the tenant\'s quiet enjoyment after repeated non-compliance',
      'Treat the third refusal as a formal breach of the tenancy agreement and serve the tenant with a Section 8 notice under Ground 12 (breach of obligation) — three consecutive inspection refusals constitute persistent breach sufficient to seek possession',
      'Arrange for the inspection to be conducted by a different member of staff on the basis that the tenant may feel more comfortable with someone new — the refusal pattern may indicate the tenant has a personal issue with their assigned PM rather than a genuine reluctance to allow inspections',
    ],
    correct: 0,
    rationale: 'A tenant\'s right to quiet enjoyment is paramount — you can never force entry for a routine inspection regardless of how many times they refuse. The correct response is formal written communication offering alternatives and escalating to the landlord. Option 1 is wrong because an AST clause cannot override the tenant\'s statutory right to quiet enjoyment, and forced entry would be unlawful.',
  },
  {
    id: 'q-r-ins-02-3', moduleId: 'ins-02', tier: 'recap',
    question: 'During an inspection, you notice the tenant is using a portable gas heater with a bottled gas cylinder. There is no fixed gas supply in the property. What are the safety concerns?',
    options: [
      'There are no safety concerns provided the heater is a modern model with an oxygen depletion sensor (ODS) — portable gas heaters with ODS are approved for indoor domestic use and do not require a gas safety certificate as they are classified as portable appliances',
      'The primary concern is insurance invalidation — notify the landlord\'s buildings insurer immediately, as most policies exclude properties where bottled gas is used. The tenant should be advised to switch to electric heating, but there is no immediate safety action required',
      'Portable bottled gas heaters present serious risks including carbon monoxide poisoning, fire hazard, and increased condensation causing damp and mould. The property\'s insurance may not cover portable gas appliances. Advise the tenant in writing and recommend the landlord provides adequate fixed heating under the Homes Act',
      'The only significant risk is condensation — portable gas heaters produce large amounts of moisture that will accelerate mould growth. Advise the tenant to increase ventilation, but the fire and gas safety risks are minimal with modern portable heaters that have automatic shut-off mechanisms',
    ],
    correct: 2,
    rationale: 'Portable bottled gas heaters pose multiple serious risks: carbon monoxide poisoning from incomplete combustion, fire hazard, and significant condensation leading to damp and mould. The full range of risks must be communicated. Option 0 is dangerously wrong because even modern portable gas heaters are not considered safe for indoor domestic use without adequate ventilation, and the absence of a fixed gas supply does not eliminate CO risk.',
  },
  {
    id: 'q-r-ins-02-4', moduleId: 'ins-02', tier: 'recap',
    question: 'An inspection reveals significant condensation and early mould growth around single-glazed windows. The tenant insists they ventilate regularly and use the extractor fan. The property has no mechanical ventilation in the bedrooms. Who bears primary responsibility?',
    options: [
      'The tenant bears primary responsibility — condensation is predominantly a lifestyle issue caused by cooking, bathing, and drying clothes indoors. The absence of mechanical ventilation does not shift liability to the landlord where the tenant has reasonable means to ventilate through openable windows',
      'Where a property has inadequate ventilation infrastructure — no mechanical ventilation and single-glazed windows — the landlord bears primary responsibility. A tenant cannot reasonably be expected to prevent condensation caused by structural deficiencies through lifestyle alone. This is a habitability issue under the Homes Act',
      'Responsibility is shared equally — the landlord must provide the infrastructure and the tenant must use it correctly. An adjudicator would apportion liability 50/50 between the structural deficiency (landlord) and the lifestyle contribution (tenant)',
      'Neither party bears direct responsibility for condensation — it is a natural consequence of temperature differentials between indoor and outdoor environments. The landlord should offer practical advice to the tenant on managing humidity, but neither party has a legal obligation to eliminate condensation entirely',
    ],
    correct: 1,
    rationale: 'Where the property lacks adequate ventilation infrastructure (no mechanical ventilation, single glazing), the landlord bears primary responsibility under the Homes (Fitness for Human Habitation) Act. A tenant who is ventilating and using extractors cannot reasonably do more. Option 0 is wrong because it places an unreasonable burden on the tenant to compensate for structural deficiencies the landlord should address.',
  },
  {
    id: 'q-r-ins-02-5', moduleId: 'ins-02', tier: 'recap',
    question: 'You complete an inspection and take 45 photographs. The tenant later challenges your report, claiming you photographed areas selectively to make the property look worse. How do you defend the report?',
    options: [
      'A well-conducted inspection report should include systematic room-by-room photographs of every room and feature, not just problem areas. If the report follows this structure, the systematic coverage is its own defence. Going forward, always photograph every room regardless of condition',
      'The photographs are evidence of what the PM observed during the visit, and there is no obligation to photograph areas that are in satisfactory condition — the purpose of inspection photographs is to document defects and concerns, not to create a comprehensive property portfolio',
      'Offer the tenant the opportunity to submit their own photographs to supplement the inspection report — this creates a balanced record that reflects both parties\' perspectives, and the combined photographic evidence will be more defensible than either set alone',
      'The inspection report is an agency document and its methodology is not subject to tenant challenge — the PM\'s professional judgement about which areas to photograph is protected by the agency\'s standard operating procedures, and the tenant has no right to dispute the inspection methodology',
    ],
    correct: 0,
    rationale: 'Systematic room-by-room photography of every area — not just defects — is the best defence against claims of selective reporting. Comprehensive coverage demonstrates objectivity. Option 1 is wrong because only photographing defects creates exactly the selective bias the tenant is alleging and leaves the report vulnerable to challenge.',
  },
  {
    id: 'q-r-ins-02-6', moduleId: 'ins-02', tier: 'recap',
    question: 'During an inspection, you discover the tenant has a large 500-litre fish tank in an upstairs bedroom. The AST has no specific clause about fish tanks. What should you consider?',
    options: [
      'The absence of a specific AST clause means the fish tank is permitted — the tenant is entitled to keep pets and hobby items unless the agreement explicitly prohibits them, and a fish tank does not fall within the standard definition of \'pets\' for AST purposes',
      'Report the fish tank as an unauthorised alteration to the property — the installation of a 500-litre tank on an upper floor constitutes a material change to the room\'s usage that requires landlord consent, regardless of whether the AST mentions fish tanks specifically',
      'A 500-litre fish tank weighs approximately 500kg when filled — this is a significant structural load concern for an upper floor. Report to the landlord with a recommendation to check whether the floor can support the weight, and note that the building\'s insurance may not cover water damage from a non-standard installation',
      'Note the fish tank in the inspection report as an observation but take no further action — a PM\'s inspection role is limited to documenting the property\'s condition, and assessing structural load bearing capacity or insurance implications falls outside the inspection scope',
    ],
    correct: 2,
    rationale: 'A 500-litre fish tank weighs roughly half a tonne when filled — a serious structural load concern for an upper floor that may not be designed for concentrated point loads of that magnitude. Water damage from a potential failure is also an insurance concern. Option 0 is wrong because the absence of a specific clause does not eliminate the PM\'s duty to flag potential property damage risks to the landlord.',
  },
  {
    id: 'q-r-ins-02-7', moduleId: 'ins-02', tier: 'recap',
    question: 'You conduct an inspection and the property is in good condition, but you notice a strong smell of cannabis throughout. You see no plants or paraphernalia. How should you handle this?',
    options: [
      'Contact the local police non-emergency line to report suspected drug use at the property — cannabis use is a criminal offence and the agency has a duty to report suspected criminal activity at properties it manages to the relevant authorities',
      'Document the observation factually in the inspection report: \'a strong smell consistent with cannabis was noted throughout.\' Photograph any relevant environmental evidence. Report the finding to the landlord, advising that cannabis use may breach the AST and could affect their insurance — do not contact the police',
      'Raise the smell directly with the tenant during the inspection and ask for an explanation — the tenant\'s response should be recorded verbatim in the inspection report, and their explanation will determine whether further action is necessary or the matter can be closed',
      'Do not include the observation in the written inspection report as it is subjective and could be challenged — instead, call the landlord verbally to discuss the finding and let them decide whether to take action based on your verbal account',
    ],
    correct: 1,
    rationale: 'The PM should document the observation factually in writing and report it to the landlord with advice on the tenancy and insurance implications. Contacting the police (option 0) is not the PM\'s role for a smell alone — it is for the landlord to decide how to proceed. Omitting the observation from the written report (option 3) removes the evidential record and is poor practice.',
  },
  {
    id: 'q-r-ins-02-8', moduleId: 'ins-02', tier: 'recap',
    question: 'The landlord asks you to conduct inspections every month instead of quarterly because they \'don\'t trust the tenant.\' The tenant has not breached any tenancy terms. Is this appropriate?',
    options: [
      'Monthly inspections are appropriate if the landlord requests them in writing — the property owner has the right to determine inspection frequency for their own asset, and the AST inspection clause permits visits \'at reasonable intervals\' which can include monthly visits',
      'Monthly inspections are acceptable for the first 6 months of a new tenancy as an enhanced monitoring period — many agencies adopt a monthly schedule for new tenants before reverting to quarterly, and the landlord\'s request aligns with this common industry practice',
      'Monthly inspections are permissible provided the agency gives the correct 24 hours\' written notice each time — the frequency of inspections is not legislatively restricted, and the tenant\'s remedy for excessive inspections is to raise a complaint rather than refuse access',
      'Monthly inspections without cause would likely constitute harassment under the Protection from Eviction Act 1977 and infringe the tenant\'s quiet enjoyment. Advise the landlord that increasing frequency without evidence of breach is inappropriate and could expose them to a harassment claim',
    ],
    correct: 3,
    rationale: 'Excessive inspections without justification can amount to harassment under the Protection from Eviction Act 1977 and breach the tenant\'s right to quiet enjoyment. Quarterly is the industry standard; monthly requires a genuine reason. Option 0 is wrong because the landlord\'s preference does not override the tenant\'s statutory protections, and \'reasonable intervals\' would not typically include monthly visits without cause.',
  },

  // ── RECAP: Support & Renewals (sup-02) ─────────────────────────────────────

  {
    id: 'q-r-sup-02-1', moduleId: 'sup-02', tier: 'recap',
    question: 'A tenant on a fixed-term AST contacts you 4 months before expiry saying they want to leave early because they\'ve bought a house. Their completion date is uncertain. What are the options?',
    options: [
      'The tenant can give 2 months\' notice at any point during a fixed-term AST, terminating the tenancy early — the Housing Act 1988 gives tenants the right to end a fixed-term tenancy with proper notice regardless of the remaining term',
      'The tenant must continue paying rent until the fixed term expires with no exceptions — early termination of a fixed-term AST is not possible under any circumstances, and the tenant is liable for the full rent regardless of whether they remain in occupation',
      'The tenant is bound by the fixed term but options include: negotiating a mutual surrender if the landlord agrees, assigning the tenancy if the AST permits it, or the tenant leaving early while remaining liable for rent until the term expires or a replacement tenant is found — the landlord has a duty to mitigate loss by re-letting',
      'The tenant can invoke the early termination clause that is present in all standard ASTs, which typically requires 1 month\'s notice plus a fee equivalent to one month\'s rent — check the specific AST terms to confirm the break clause conditions and process',
    ],
    correct: 2,
    rationale: 'A fixed-term AST binds the tenant for the full term, but practical options exist: mutual surrender by agreement, assignment if permitted, or the tenant leaving early while remaining liable until re-let. The landlord must mitigate loss. Option 0 is wrong because the Housing Act 1988 does not give tenants a unilateral right to end a fixed term early with notice — that right applies only to periodic tenancies.',
  },
  {
    id: 'q-r-sup-02-2', moduleId: 'sup-02', tier: 'recap',
    question: 'A landlord wants to increase rent by 15% at renewal. The current rent is already at market rate and the tenant has been reliable for 3 years with no arrears. What should you advise?',
    options: [
      'Advise that an above-market increase risks losing a reliable tenant, incurring void costs, re-letting fees, and potential deposit disputes that would far exceed the marginal rent gain. Present a market comparison and recommend an increase of 3-5% in line with market movement',
      'Support the landlord\'s instruction and serve the 15% increase — the PM\'s role is to implement the landlord\'s commercial decisions, and advising against a rent increase could be seen as prioritising the tenant\'s interests over the client landlord\'s instructions',
      'Serve the 15% increase as instructed but advise the landlord to expect the tenant to trigger the Section 13 Tribunal process — prepare market evidence for the Tribunal hearing, as the Tribunal may set the rent at a different level from either the current rent or the proposed increase',
      'Advise the landlord that rent increases during a renewal are limited to the lesser of CPI inflation or 5% under the Tenant Fees Act 2019 cap on mid-tenancy rent increases — a 15% increase exceeds the statutory maximum and would be unenforceable',
    ],
    correct: 0,
    rationale: 'The PM\'s professional duty includes advising the landlord on the commercial risks of their decisions. A 15% above-market increase risks losing a reliable tenant, creating voids, and incurring re-letting costs that outweigh the rent gain. Option 3 is wrong because the Tenant Fees Act does not cap rent increases — there is no statutory maximum for rent at renewal.',
  },
  {
    id: 'q-r-sup-02-3', moduleId: 'sup-02', tier: 'recap',
    question: 'A tenant reports during a support call that they have been a victim of stalking and asks you not to share their address with anyone, including the landlord\'s mortgage company who has written to the property. What is your obligation?',
    options: [
      'Redirect the mortgage correspondence to the landlord but also provide the mortgage company with the tenant\'s details as required under the standard data sharing provisions in the management agreement — the mortgage company has a legitimate interest in knowing who occupies the secured property',
      'Advise the tenant that while you sympathise, the agency is legally required to share occupier information with the landlord\'s mortgage company when requested under the terms of the mortgage deed — the tenant\'s consent is not required for this disclosure',
      'Record the vulnerability disclosure and restrict the tenant\'s address from all external communications, including correspondence with the landlord — the tenant\'s safety overrides the landlord\'s right to know the property\'s status, and the PM should manage the tenancy without sharing any information with the landlord',
      'Take the disclosure seriously. Do not share the tenant\'s personal information with third parties beyond what the tenancy agreement requires. Redirect mortgage correspondence to the landlord directly. Consider whether the property should be removed from online listings, escalate internally, and flag the vulnerability on the tenant\'s file',
    ],
    correct: 3,
    rationale: 'Vulnerability disclosures must be taken seriously with immediate practical steps: restrict unnecessary data sharing, redirect third-party correspondence to the landlord, review online visibility, and flag the file. Option 2 is wrong because completely withholding information from the landlord goes too far — the landlord still needs to manage their property, and the PM should balance safety with the landlord\'s legitimate interests.',
  },
  {
    id: 'q-r-sup-02-4', moduleId: 'sup-02', tier: 'recap',
    question: 'A tenant requests permission to sublet one bedroom while they travel abroad for work for 6 months. The AST contains a standard prohibition on subletting. What should you advise?',
    options: [
      'Advise the tenant that subletting a bedroom while remaining the tenant of record is permitted under the AST — the subletting prohibition applies to the entire property only, and partial subletting of individual rooms is treated as a lodging arrangement rather than a sublet',
      'The AST prohibition means the tenant cannot sublet without the landlord\'s explicit written consent. If approved, this must be formalised in a deed of variation specifying the period and sub-tenant details, with a right to rent check on the sub-tenant. HMO licensing implications must also be assessed',
      'Advise the tenant to proceed with the subletting arrangement informally — a 6-month absence is temporary, the original tenant remains liable for the rent, and formalising the arrangement would create unnecessary administrative complexity for all parties',
      'Refuse the request outright — any form of subletting during a fixed-term AST is grounds for immediate possession proceedings under Section 8 Ground 12, and the agency must issue a formal warning to the tenant that subletting will result in eviction action regardless of the landlord\'s view',
    ],
    correct: 1,
    rationale: 'The AST prohibition on subletting requires the landlord\'s explicit written consent. If the landlord agrees, the arrangement must be formalised with a deed of variation, and a right to rent check on the sub-tenant is mandatory. HMO licensing must also be considered. Option 0 is wrong because partial subletting is still subletting — the distinction between subletting a room and the whole property does not exist in most standard ASTs.',
  },
  {
    id: 'q-r-sup-02-5', moduleId: 'sup-02', tier: 'recap',
    question: 'A tenant calls in distress saying their landlord has turned up at the property unannounced and let themselves in using their own key. The tenant feels their privacy has been violated. What should you do?',
    options: [
      'This is a serious matter — the landlord has potentially committed an offence under the Protection from Eviction Act 1977. Document the tenant\'s account, contact the landlord to establish the facts, advise them in writing that unannounced entry is unlawful and 24 hours\' notice is required, and offer to change the locks if necessary',
      'Advise the tenant that while unannounced visits are discouraged, the landlord retains a common law right of access to their own property — the Protection from Eviction Act does not apply to visits by the property owner themselves, only to agents or third parties acting on the landlord\'s behalf',
      'Log the tenant\'s complaint as an internal note but take no formal action — landlord-tenant disputes about access are a private matter between the parties, and the agency should not intervene in the landlord\'s relationship with their tenant on issues of property access',
      'Contact the landlord and request that they return their key to the agency immediately — once a tenancy is in place, the landlord must not hold a key to the property under the Housing Act 1988, and possession of a key by the landlord constitutes a potential Section 8 Ground 14 breach',
    ],
    correct: 0,
    rationale: 'Unannounced entry by the landlord is a potential offence under the Protection from Eviction Act 1977 and a breach of the tenant\'s right to quiet enjoyment. The PM must document the incident, formally advise the landlord, and offer practical remedies including changing the locks. Option 1 is wrong because no common law right of access overrides the tenant\'s statutory protections once a tenancy is granted.',
  },
  {
    id: 'q-r-sup-02-7', moduleId: 'sup-02', tier: 'recap',
    question: 'A tenant contacts you saying they\'ve seen mice in the property. They want the landlord to pay for pest control. The landlord says vermin are the tenant\'s responsibility. Who is correct?',
    options: [
      'The landlord is correct — pest control is always the tenant\'s responsibility under the standard AST. Vermin are classified as a lifestyle issue rather than a property defect, and the landlord has no obligation to pay for pest control regardless of the cause of the infestation',
      'It depends on the cause. If the infestation is due to a structural defect (gaps in walls, damaged pipework entry points) allowing entry, the landlord is responsible for the repair and initial treatment. If caused by poor housekeeping, the tenant may be responsible. Inspect the property to determine the likely cause',
      'The tenant is correct — under the Homes (Fitness for Human Habitation) Act 2018, the landlord has an absolute obligation to maintain the property free from pest infestation throughout the tenancy. The cause of the infestation is irrelevant to the landlord\'s statutory duty',
      'Neither party is solely responsible — pest control in residential property is a shared obligation by default. The recommended approach is to split the cost of the initial treatment equally between landlord and tenant, with ongoing prevention costs allocated based on the pest controller\'s assessment of the cause',
    ],
    correct: 1,
    rationale: 'Responsibility for pest control depends on the cause. If mice are entering through structural defects (gaps in walls, damaged pipework), the landlord must repair the defect and pay for initial treatment. If caused by the tenant\'s housekeeping, they may be responsible. Option 0 is wrong because blanket statements about tenant responsibility ignore the landlord\'s obligation to maintain the property structure.',
  },
  {
    id: 'q-r-sup-02-8', moduleId: 'sup-02', tier: 'recap',
    question: 'A tenant asks for a rent reduction because roadworks outside the property have been causing noise and disruption for 3 months. The landlord refuses. Does the tenant have any grounds?',
    options: [
      'Yes — under the implied covenant of quiet enjoyment, the landlord is responsible for ensuring the tenant can enjoy the property without unreasonable disturbance. Three months of roadworks constitutes a material breach, and the tenant is entitled to a proportionate rent reduction for the affected period',
      'Yes — the landlord should apply to the local authority for a council tax reduction on the property and pass the savings through to the tenant as a rent adjustment. External works affecting property amenity are a recognised ground for council tax rebanding, which indirectly reduces the tenant\'s housing costs',
      'Yes — the tenant can apply to the First-tier Tribunal for a rent determination citing the reduced amenity value of the property during the roadworks. The Tribunal can set a lower market rent reflecting the temporary noise impact, which would apply until the works are completed',
      'No automatic right — the landlord is not responsible for noise from third-party works outside their control. The tenant can report a statutory nuisance to environmental health. A goodwill reduction is a commercial decision for the landlord, not a legal obligation — but maintaining goodwill during disruption is good practice',
    ],
    correct: 3,
    rationale: 'The landlord has no liability for disruption caused by third-party roadworks outside their control. The covenant of quiet enjoyment (option 0) relates to interference by the landlord or those claiming under them, not external third parties. The tenant\'s remedies are environmental health complaints and negotiating goodwill concessions, not legal entitlement to a rent reduction.',
  },

  // ── RECAP: Portal & System (onb-01) ────────────────────────────────────────

  {
    id: 'q-r-onb-01-1', moduleId: 'onb-01', tier: 'recap',
    question: 'A PM has two urgent jobs in their queue — one is a gas leak reported 20 minutes ago sitting in Auto mode, the other is a rent arrears case in Pause for 3 days with a landlord chasing for an update. What determines priority?',
    options: [
      'Address the rent arrears case first as it has been waiting longer and the landlord is actively chasing — a 3-day delay represents a greater service failure than a 20-minute-old report that is still within the standard response window',
      'Escalate both jobs simultaneously to a senior manager and await their instruction on prioritisation — dual-urgency situations require management oversight before a PM takes independent action on either matter',
      'Respond to the landlord chasing the arrears case with a holding update, then investigate the gas leak report to assess whether it requires contractor attendance or can be resolved with tenant guidance on the emergency gas shutoff',
      'The gas leak takes absolute priority as a Category 1 life-safety hazard regardless of job mode, landlord pressure, or how long other jobs have been waiting — life safety overrides all operational considerations without exception',
    ],
    correct: 3,
    rationale: 'A gas leak is a Category 1 life-safety emergency and must take absolute priority regardless of how long other jobs have been waiting or how much pressure exists on the arrears case. Life safety overrides all operational considerations. The arrears landlord should receive a brief holding message, but the gas leak must be acted on immediately.',
  },
  {
    id: 'q-r-onb-01-2', moduleId: 'onb-01', tier: 'recap',
    question: 'You notice a job has been automatically moved from Auto to Pause by the Dwelly system without any PM intervention. What is the most likely trigger for this automatic status change?',
    options: [
      'The job has exceeded its standard SLA timeframe while in Auto mode, triggering an automatic escalation to Pause status so that a PM must manually review and reassign the job before it can progress further',
      'The system detected a condition requiring human decision-making — such as a landlord authorisation threshold being exceeded, a compliance document expiry flagged against the property, or a contractor query that cannot be auto-resolved',
      'An internal audit process automatically moves a random sample of Auto jobs to Pause each week for quality assurance review, ensuring that PMs are actively checking job progress rather than relying entirely on automation',
      'The tenant or landlord submitted a response through the portal that contained keywords flagged by the system\'s content filter, requiring a PM to review the communication before the job can proceed in Auto mode',
    ],
    correct: 1,
    rationale: 'Auto-to-Pause transitions occur when the system encounters a condition it cannot resolve automatically — such as a spend authorisation threshold being reached, a compliance document expiring, or a contractor query requiring human input. Random auditing and content filtering are not part of the job mode logic.',
  },
  {
    id: 'q-r-onb-01-3', moduleId: 'onb-01', tier: 'recap',
    question: 'A PM is going on annual leave for two weeks. Their job queue contains 47 active jobs across Auto and Pause modes. What is the correct handover protocol?',
    options: [
      'Review every Pause job individually with the covering PM, flag all time-sensitive actions with deadlines, update each job\'s internal notes with current status and next steps, and formally reassign all jobs in Dwelly with a detailed handover note',
      'Batch-reassign all 47 jobs to the covering PM in Dwelly with a single summary note, prioritising speed of transfer over individual job context — the covering PM can review each job\'s history in the system when they pick them up',
      'Leave Auto jobs running without reassignment as they require no intervention, and only hand over the Pause jobs — this reduces the covering PM\'s workload and keeps the original PM\'s name on the audit trail for continuity when they return',
      'Send the covering PM a spreadsheet summary of the top 10 most urgent jobs and leave the remaining 37 in their current state — experienced PMs can assess priority from the Dwelly dashboard without individual handover notes',
    ],
    correct: 0,
    rationale: 'A thorough handover requires individual review of every Pause job with the covering PM, time-sensitive flags, updated internal notes in each job, and formal reassignment in Dwelly. Leaving Auto jobs without reassignment creates accountability gaps. Speed of transfer is never a justification for inadequate context.',
  },
  {
    id: 'q-r-onb-01-4', moduleId: 'onb-01', tier: 'recap',
    question: 'A landlord calls asking why they can see a job on their portal that the PM thought was closed two weeks ago. What is the most likely explanation?',
    options: [
      'The Dwelly portal has a 30-day visibility buffer on closed jobs, meaning landlords can still see completed jobs for one month after closure — the job is genuinely closed but remains visible during the standard retention window',
      'The landlord is viewing a different job with a similar description that was automatically created by the system when a related compliance certificate triggered a follow-up task on the same property',
      'The job was moved to a resolved status but not formally closed in Dwelly — resolved jobs remain visible on the landlord portal until the PM completes the full closure workflow including confirmation of all invoices, documentation, and final status update',
      'A system synchronisation delay between the PM\'s view and the landlord portal means the closure has not yet propagated — this typically resolves within 48 hours and the landlord should be advised to check again after the weekend',
    ],
    correct: 2,
    rationale: 'The most likely explanation is that the job was moved to a resolved or near-complete status but not formally closed through the full Dwelly closure workflow. Until all steps are completed and the job is formally closed, it remains visible on the landlord portal. System sync delays are rare and not a standard explanation.',
  },
  {
    id: 'q-r-onb-01-5', moduleId: 'onb-01', tier: 'recap',
    question: 'Two separate tenants in a block report the same communal heating failure. Should these be logged as one job or two in Dwelly?',
    options: [
      'Log as a single job under the communal areas property record with both tenants tagged as affected parties — this prevents duplicate contractor visits and ensures a single invoice is processed for the same issue',
      'Log as two separate jobs to maintain individual audit trails and communication records for each tenant, but cross-reference both jobs and link them to the same contractor attendance to avoid duplicate visits and double invoicing',
      'Log as a single job under whichever tenant reported first and add the second tenant\'s report as a note in the job chat — this maintains a clean job history while acknowledging both reports in the same timeline',
      'Log as two separate jobs with no cross-referencing, as each tenant\'s experience and communication must remain completely independent under data protection rules — the contractor will attend twice and each visit is invoiced separately',
    ],
    correct: 1,
    rationale: 'Two separate jobs maintain individual audit trails and communication histories for each tenant — important if their experience of the issue or resolution differs. Cross-referencing the jobs and linking them to a single contractor visit prevents duplicate attendance and double invoicing. Data protection does not prevent cross-referencing job references.',
  },
  {
    id: 'q-r-onb-01-6', moduleId: 'onb-01', tier: 'recap',
    question: 'A PM receives an automated Dwelly notification that a job has breached its SLA. The job is in Pause mode awaiting landlord authorisation that was requested 5 days ago. What should the PM document?',
    options: [
      'Record the SLA breach in the job chat with a full timeline of all chasing attempts, confirm the specific instruction being awaited, and escalate internally — an SLA breach while awaiting landlord response must still be documented to protect the agency\'s position',
      'No documentation is needed for SLA breaches caused by landlord delays — the system automatically records that the job was in Pause mode at the time of the breach, which provides a complete audit defence without additional PM input',
      'Reset the SLA timer in Dwelly by moving the job briefly to Auto and back to Pause, which accurately reflects that the delay is landlord-caused rather than agency-caused — this prevents the breach from appearing in the agency\'s performance metrics',
      'Send a formal written complaint to the landlord advising that their delay has caused an SLA breach, request immediate authorisation within 24 hours, and note in the job that failure to respond will result in the job being closed as landlord-abandoned',
    ],
    correct: 0,
    rationale: 'Even where a landlord is causing the delay, an SLA breach must be documented in the job chat with a full timeline of chasing attempts and escalated internally. The system\'s Pause status record alone is insufficient. Resetting the SLA timer is manipulating records and must never be done.',
  },
  {
    id: 'q-r-onb-01-7', moduleId: 'onb-01', tier: 'recap',
    question: 'A colleague asks you to update one of their Dwelly jobs to \'completed\' while they are on a call, saying "just close it off for me — the contractor confirmed it\'s done." What is the risk?',
    options: [
      'There is minimal risk provided you add a note in the job chat confirming your colleague verbally instructed the closure — Dwelly\'s audit trail attributes the action to your login but the note provides sufficient context for any future query',
      'The primary risk is that the contractor\'s verbal confirmation may not have been verified against the original scope of work, but the job can always be reopened if the tenant reports a recurrence — the closure is easily reversible',
      'Completing a job you haven\'t managed creates personal accountability for the closure decision — if the job was not genuinely resolved, the audit trail shows you as the person who confirmed completion, making you liable for any subsequent complaint or claim',
      'The main concern is data protection — you may not have authorisation to access your colleague\'s jobs, and closing a job assigned to another PM could trigger a system permissions alert that flags the action to compliance',
    ],
    correct: 2,
    rationale: 'Completing a job assigned to another PM places personal accountability on you for that closure decision. If the issue was not genuinely resolved, the audit trail records you as having confirmed completion — making you directly responsible for any subsequent complaint, disrepair claim, or service failure arising from the premature closure.',
  },
  {
    id: 'q-r-onb-01-8', moduleId: 'onb-01', tier: 'recap',
    question: 'A tenant contacts the office claiming they reported a repair three weeks ago but have heard nothing. You cannot find any job in Dwelly matching their description. What should you do?',
    options: [
      'Advise the tenant that without a Dwelly job reference the report cannot be verified, ask them to resubmit the repair request through the proper channel, and log the new report with today\'s date as the official start of the response timeline',
      'Check only the current week\'s incoming calls and emails — if no record exists within the most recent correspondence, the tenant has likely confused the timeline or reported to the wrong agency, and you should advise them to check their records',
      'Create a new job using today\'s date as the report date, add a note that the tenant claims an earlier report, and proceed with standard response times from today — the agency cannot be held responsible for reports that were not properly logged in the system',
      'Create a new job immediately documenting the tenant\'s claimed original report date, search all closed and archived jobs and check call logs and email records for any match, and treat the report date as the date the tenant states until evidence proves otherwise — the agency bears the burden of demonstrating it was not reported',
    ],
    correct: 3,
    rationale: 'The agency bears the burden of demonstrating a report was not made — not the tenant. Create a new job using the tenant\'s claimed date, conduct a thorough search of all records, and treat the report as having been made three weeks ago. Using today\'s date without investigating the claimed original report creates a false timeline.',
  },

  // ── RECAP: Pre-Onboarding Compliance (prv-02) ─────────────────────────────

  {
    id: 'q-r-prv-02-1', moduleId: 'prv-02', tier: 'recap',
    question: 'During property onboarding, a landlord provides a gas safety certificate dated 11 months ago. The property is ready to let. Should you accept it?',
    options: [
      'Reject the certificate and instruct a new gas safety inspection before marketing — any certificate older than 6 months should be renewed at onboarding to ensure the incoming tenant has maximum coverage from the start of their tenancy',
      'Accept the certificate only if the landlord provides written confirmation from the Gas Safe engineer that the installation has not been modified since the inspection — an 11-month-old certificate requires supplementary assurance before the agency can rely on it',
      'Accept the certificate as it is valid for 12 months from the date of inspection, but immediately schedule the renewal to ensure continuity — a gap in gas safety certification would prevent any new tenancy being granted and constitutes a criminal offence',
      'Accept the certificate and schedule renewal for the anniversary date, but advise the landlord that the new gas safety check can be carried out up to 2 months early without losing the expiry date — this backdating provision gives flexibility for scheduling',
    ],
    correct: 2,
    rationale: 'A gas safety certificate is valid for 12 months from the date of the check. An 11-month-old certificate is still legally valid and can be accepted, but the renewal must be immediately scheduled to prevent a gap. The 2-month early renewal provision exists but does not change the certificate\'s legal expiry date.',
  },
  {
    id: 'q-r-prv-02-2', moduleId: 'prv-02', tier: 'recap',
    question: 'A property being onboarded has a valid HMO licence but the licence names the previous managing agent. Can you proceed with letting?',
    options: [
      'You cannot proceed until the licence is updated to reflect the current managing agent or confirms the licence holder is the landlord — operating under a licence naming a different agent creates enforcement risk and may mean the licence conditions are not being met',
      'Proceed with letting immediately as the HMO licence attaches to the property, not the managing agent — the licence remains valid regardless of which agent manages the property, and the local authority only requires notification of the change within 28 days',
      'Proceed with letting but send a courtesy notification to the local authority within 14 days advising of the change in managing agent — the licence transfers automatically under the Housing Act 2004 and does not require formal amendment',
      'Proceed with marketing only and halt the letting process at the point of tenancy agreement signing until the licence is amended — the licence must be current at the point the tenancy commences but does not need to be updated during the marketing phase',
    ],
    correct: 0,
    rationale: 'An HMO licence naming a different managing agent creates enforcement risk. The licence conditions may specify obligations on the named agent, and operating without updating the licence could mean those conditions are not being met by the new agency. The licence must be updated before proceeding.',
  },
  {
    id: 'q-r-prv-02-3', moduleId: 'prv-02', tier: 'recap',
    question: 'The landlord provides all compliance documents except the EICR, claiming the property was fully rewired last year and "doesn\'t need an EICR." Is this correct?',
    options: [
      'This is correct — a full rewire completed by a qualified electrician within the last 12 months is accepted by local authorities as equivalent to a satisfactory EICR, as the rewire process includes testing that exceeds the standard EICR inspection scope',
      'This is correct provided the electrician who completed the rewire issues a signed letter confirming the installation meets current regulations — this letter serves as an interim EICR equivalent until the next standard 5-yearly inspection is due',
      'This is partially correct — a rewire within the last 5 years means an EICR is not legally required until the 5-year anniversary of the rewire completion, so the landlord can let the property and schedule the EICR for 4 years\' time',
      'This is incorrect — a rewire does not replace the legal requirement for an EICR. A satisfactory Electrical Installation Condition Report must be in place before letting regardless of recent electrical work; the rewire should have included an EICR as part of the completion certification',
    ],
    correct: 3,
    rationale: 'A rewire does not substitute for an EICR. The Electrical Safety Standards Regulations require a satisfactory EICR before any new tenancy regardless of how recently electrical work was carried out. A competent rewire should have included testing and an EICR as part of completion — if one was not issued, one must be obtained before letting.',
  },
  {
    id: 'q-r-prv-02-4', moduleId: 'prv-02', tier: 'recap',
    question: 'During pre-onboarding you discover the property\'s freeholder requires written consent before any subletting or letting on an AST. The landlord dismisses this as "just a formality." What is the risk?',
    options: [
      'The risk is minimal — most freeholder consent clauses are legacy provisions that are rarely enforced, and the landlord\'s confirmation that consent is a formality is sufficient comfort for the agency to proceed with marketing while the paperwork catches up',
      'Proceeding without written freeholder consent could render the tenancy in breach of the head lease, potentially leading to forfeiture proceedings — the agency must see written consent or a lease clause expressly permitting subletting before the property can be marketed',
      'The risk applies only if the freeholder becomes aware of the letting and actively objects — unless the freeholder has served a formal objection notice, the agency can rely on implied consent from the absence of any complaint about previous lettings at the property',
      'The risk is limited to the landlord personally — the agency has no exposure to forfeiture proceedings as they are not a party to the head lease, and the tenant\'s AST remains valid regardless of any breach of the freeholder\'s consent clause',
    ],
    correct: 1,
    rationale: 'Proceeding without freeholder consent where it is required by the head lease creates a real forfeiture risk. The agency cannot rely on the landlord\'s characterisation of it as a formality. Written consent or a lease provision expressly permitting subletting must be confirmed before marketing. The agency is not immune from the consequences of facilitating a lease breach.',
  },
  {
    id: 'q-r-prv-02-5', moduleId: 'prv-02', tier: 'recap',
    question: 'A landlord wants to let a property where the previous tenant\'s deposit has not yet been returned or formally adjudicated. Can a new tenancy begin?',
    options: [
      'A new tenancy cannot begin until the previous deposit is fully resolved — the deposit protection scheme requires that all disputes are settled before the property can be re-let, as the new deposit must be registered to the same scheme account',
      'A new tenancy cannot begin because the agency must demonstrate a clean financial position on the property before accepting new funds — outstanding deposit disputes create an accounting conflict that must be resolved before a new deposit is taken',
      'A new tenancy can legally begin as the previous deposit must be resolved independently — the agency must not hold funds from the new tenant\'s deposit to offset prior tenancy costs, and any outstanding adjudication must continue on its own timeline',
      'A new tenancy can begin only if the previous tenant consents in writing to the new letting proceeding while their deposit is unresolved — without this consent, the outgoing tenant could claim the new tenancy prejudices their ongoing dispute',
    ],
    correct: 2,
    rationale: 'A new tenancy can legally begin while a previous deposit dispute is ongoing. The two deposits and their respective processes are entirely separate. The agency must not commingle funds or use the new deposit to offset any prior costs. The previous tenancy\'s deposit adjudication continues independently on its own timeline.',
  },
  {
    id: 'q-r-prv-02-6', moduleId: 'prv-02', tier: 'recap',
    question: 'You are onboarding a property that was previously self-managed by the landlord. They hand you a folder of paper compliance certificates. What is the first thing you should verify?',
    options: [
      'Verify the authenticity and validity of every certificate — check Gas Safe numbers against the Gas Safe Register, confirm the EICR was conducted by a qualified person, and validate the EPC on the government register; self-managed properties frequently have expired or unverifiable documentation',
      'Check that the dates on all certificates fall within the required renewal periods and file them in Dwelly — if the dates are within range, the certificates can be accepted at face value as the landlord has a legal duty to ensure their accuracy',
      'Contact each contractor listed on the certificates to confirm they carried out the work — paper certificates from self-managed properties are unreliable and must be independently verified through direct contractor confirmation before the agency can rely on them',
      'Scan and upload all certificates to Dwelly immediately to ensure digital copies exist, then schedule fresh inspections for all certificates older than 6 months — the agency\'s onboarding standard requires certificates to be less than 6 months old regardless of their statutory validity period',
    ],
    correct: 0,
    rationale: 'Self-managed properties carry a higher risk of incomplete, expired, or unverifiable compliance documentation. The first step is to verify authenticity — Gas Safe numbers can be checked on the Gas Safe Register and EPCs on the government register. Accepting paper certificates at face value without verification is an onboarding risk the agency must manage.',
  },
  {
    id: 'q-r-prv-02-7', moduleId: 'prv-02', tier: 'recap',
    question: 'A landlord insists on using their own tenancy agreement template rather than the agency\'s standard AST. What are the key risks the PM must assess?',
    options: [
      'The primary risk is inconsistency with other tenancies in the agency\'s portfolio, which complicates portfolio-wide compliance audits — advise the landlord that a non-standard AST creates additional administrative burden but poses no direct legal risk if the landlord takes responsibility',
      'The key risk is that the agency\'s professional indemnity insurance may not cover tenancies managed under a non-standard AST — confirm with the insurer before accepting the template, and charge the landlord an additional fee for the legal review required',
      'The risk is limited to the landlord personally — the agency is not liable for defects in a landlord-supplied AST provided the agency keeps a written record confirming the landlord chose to use their own template against the agency\'s recommendation',
      'The template must be reviewed for compliance with the Tenant Fees Act, Consumer Rights Act, and all prescribed information requirements — a non-standard AST may contain unlawful clauses or miss mandatory provisions, any of which could invalidate a Section 21 notice',
    ],
    correct: 3,
    rationale: 'A landlord\'s own AST template must be reviewed for legal compliance before it is used. It may contain unlawful clauses under the Tenant Fees Act or Consumer Rights Act, or omit mandatory prescribed information. Any defect could expose both landlord and agency and may invalidate a Section 21. The agency cannot simply disclaim liability for using a template it has agreed to manage under.',
  },
  {
    id: 'q-r-prv-02-8', moduleId: 'prv-02', tier: 'recap',
    question: 'A landlord\'s property has an EPC rating of E — the legal minimum. They plan to install a new boiler, which may temporarily affect the rating during reassessment. Should you delay marketing?',
    options: [
      'Delay marketing until the new boiler is installed and a fresh EPC is obtained confirming the rating has not dropped below E — marketing a property where a planned modification could lower the EPC below the legal minimum exposes the agency to enforcement risk',
      'Do not delay — the current valid EPC of E meets MEES requirements, and there is no obligation to obtain a new EPC before the existing one expires unless a modification legally triggers a reassessment; a boiler replacement alone does not require a new EPC',
      'Market the property but include a disclaimer in the listing that the EPC is subject to change due to planned works — this protects the agency if the rating drops below E after the boiler installation and a new EPC is subsequently required',
      'Delay marketing until the boiler installation is complete, as any structural or mechanical modification to the property automatically invalidates the existing EPC and a new assessment must be obtained before the property can be legally marketed for letting',
    ],
    correct: 1,
    rationale: 'The current valid EPC of E meets MEES requirements for letting. A boiler replacement does not automatically require a new EPC — a new assessment is only needed if the existing certificate has expired or if the modification is of a type that legally triggers reassessment. Marketing on a valid E-rated EPC while the boiler is replaced is permissible.',
  },

  // ── RECAP: Right to Rent (rtr-02) ─────────────────────────────────────────

  {
    id: 'q-r-rtr-02-1', moduleId: 'rtr-02', tier: 'recap',
    question: 'A prospective tenant presents a Biometric Residence Permit (BRP) that expires in 3 months. They claim a replacement card is being processed by the Home Office. Can you proceed with the tenancy?',
    options: [
      'You cannot proceed until the replacement BRP has been received and verified — a document with only 3 months\' validity remaining does not provide a sufficient basis for a right to rent check, as the check must be valid for at least 6 months from the tenancy start date',
      'You can proceed with the current BRP as it grants a valid time-limited right to rent, but you must schedule a follow-up check before the BRP expiry date — the tenant\'s claim about a pending replacement does not extend the current document\'s validity for check purposes',
      'You can proceed and no follow-up check is needed — once a BRP has been verified as genuine and the initial check is complete, the statutory excuse persists for the full duration of the tenancy regardless of the document\'s expiry date',
      'You cannot proceed using the BRP alone — when a replacement document is known to be in process, you must verify status through the Home Office Landlord Checking Service online rather than relying on the physical document, as the BRP may have been flagged as superseded',
    ],
    correct: 1,
    rationale: 'A BRP with 3 months\' remaining validity grants a valid time-limited right to rent and the tenancy can proceed. A follow-up check must be scheduled before the BRP expires. The tenant\'s claim about a replacement being processed is noted but does not affect the validity of the initial check or the obligation to follow up.',
  },
  {
    id: 'q-r-rtr-02-2', moduleId: 'rtr-02', tier: 'recap',
    question: 'A tenant\'s right to rent expires during a periodic tenancy. You conduct a follow-up check and discover they no longer have the right to rent in the UK. What is the required process?',
    options: [
      'Serve the tenant with immediate notice to vacate — once a right to rent check confirms the tenant no longer has legal status, the tenancy is automatically void and the tenant must leave within 14 days under Home Office deportation protocols',
      'Continue collecting rent but immediately stop all maintenance and management activity for the property — the agency\'s obligations under the management agreement are suspended from the date the failed right to rent check is documented',
      'Contact the local authority housing team and request they take over management of the tenant\'s occupancy, as a tenant without right to rent becomes the responsibility of the local housing authority rather than the private landlord or their managing agent',
      'Report the tenant to the Home Office within 28 days using the prescribed process. Continue to collect rent and manage the property normally while the Home Office process proceeds — only the Home Office can serve a notice requiring the tenant to leave, and you must not disclose their immigration status to any third party',
    ],
    correct: 3,
    rationale: 'When a follow-up check reveals the tenant no longer has the right to rent, the landlord must report to the Home Office within 28 days using the prescribed process. Normal property management continues while that process proceeds. The landlord cannot unilaterally evict and must not disclose immigration status to third parties. Only the Home Office can direct the tenant to leave.',
  },
  {
    id: 'q-r-rtr-02-3', moduleId: 'rtr-02', tier: 'recap',
    question: 'A prospective tenant provides a share code for an online right to rent check. The online system confirms a right to rent but the photograph does not match the person standing in front of you. What should you do?',
    options: [
      'Do not proceed — the visual likeness check is mandatory. If the photograph does not match the person, the check has failed. Request alternative documentation, ask the applicant to explain the discrepancy, and if it cannot be resolved, the tenancy cannot be granted',
      'Proceed with the tenancy as the online system has confirmed the right to rent — the visual likeness check is a recommended best practice step but is not a statutory requirement, and refusing the tenancy based on appearance alone could constitute discrimination',
      'Ask the applicant to provide a second form of photo ID to corroborate their identity — if two documents match the person in front of you, the share code discrepancy can be overridden and the check recorded as satisfactory with a note about the photo mismatch',
      'Contact the Home Office Landlord Checking Service to report the mismatch and request a manual verification — the Service will arrange a face-to-face identity check within 48 hours, during which time you should hold the application without granting or refusing the tenancy',
    ],
    correct: 0,
    rationale: 'The visual likeness check is a mandatory component of the right to rent check process. A failure to match the photograph on record means the check has not been satisfactorily completed. The system confirming a right to rent does not override the failure of the identity verification step. The tenancy cannot proceed until the discrepancy is resolved.',
  },
  {
    id: 'q-r-rtr-02-4', moduleId: 'rtr-02', tier: 'recap',
    question: 'A landlord instructs you to conduct right to rent checks only on applicants who "look foreign" but not on those who "appear British." What is the correct response?',
    options: [
      'Follow the landlord\'s instruction but document it in writing as a landlord direction — the landlord bears ultimate responsibility for right to rent compliance, and an agent acting under written landlord instruction has a defence against any subsequent penalty',
      'Conduct checks on all applicants as standard practice but do not raise the landlord\'s instruction formally — challenging a client\'s direction on a sensitive topic risks the commercial relationship, and quietly applying correct procedure achieves the same compliance outcome',
      'Refuse the instruction and advise the landlord in writing that selective checking based on appearance constitutes direct racial discrimination under the Equality Act 2010 — right to rent checks must be conducted on all prospective tenants equally, and failure to do so exposes both landlord and agency to discrimination claims',
      'Escalate the instruction to the agency\'s legal team for a formal opinion before responding — discrimination issues require specialist legal advice, and the PM should not make a determination on the lawfulness of the landlord\'s instruction without qualified legal guidance',
    ],
    correct: 2,
    rationale: 'Selective right to rent checks based on appearance or perceived nationality constitute direct racial discrimination under the Equality Act 2010 and are explicitly prohibited. The agency must refuse the instruction and advise the landlord in writing. Conducting checks on all applicants quietly without raising the issue is insufficient — the instruction itself must be challenged and documented.',
  },
  {
    id: 'q-r-rtr-02-5', moduleId: 'rtr-02', tier: 'recap',
    question: 'An EU national applies for a tenancy and presents their EU passport as evidence of right to rent. Post-Brexit, is this sufficient?',
    options: [
      'An EU passport remains valid for right to rent checks under the transitional provisions of the EU Settlement Scheme, which continue to accept EU passports as standalone documents until the scheme\'s final application deadline has passed and all outstanding applications are resolved',
      'An EU passport alone is no longer sufficient since 1 July 2021 — EU nationals must demonstrate immigration status through the Home Office online service using a share code from their settled or pre-settled status, or provide alternative acceptable documentation',
      'An EU passport is acceptable as primary identification but must be supported by a utility bill or bank statement confirming UK residence for at least 12 months — this combination satisfies the post-Brexit right to rent requirements for EU nationals with established UK residence',
      'An EU passport is sufficient if the applicant also provides their National Insurance number, which the agency can use to verify their employment status and by extension their right to reside and rent in the UK through the HMRC verification service',
    ],
    correct: 1,
    rationale: 'Since 1 July 2021, EU nationals can no longer use their EU passport alone to demonstrate a right to rent. They must use the Home Office online checking service with a share code confirming their EU Settlement Scheme (settled or pre-settled) status, or provide other acceptable documentation. Transitional provisions ended on 30 June 2021.',
  },
  {
    id: 'q-r-rtr-02-6', moduleId: 'rtr-02', tier: 'recap',
    question: 'A tenant\'s partner moves into the property 6 months into the tenancy. The partner is not named on the tenancy agreement. Does a right to rent check need to be conducted on the partner?',
    options: [
      'Yes — any adult aged 18 or over who will use the property as their only or main home must have a right to rent check conducted before they move in, regardless of whether they are named on the tenancy agreement. An unchecked adult occupier removes the landlord\'s statutory excuse',
      'No — right to rent checks are only required for persons named on the tenancy agreement. An occupier who is not a party to the tenancy falls outside the scope of the Immigration Act 2014 right to rent provisions, as the legal obligation attaches to tenants, not occupiers',
      'Only if the partner will be contributing to the rent — the right to rent legislation distinguishes between paying occupiers (who require checks) and non-paying household members (who are exempt), as the statutory obligation relates to persons with a financial interest in the tenancy',
      'Only if the landlord becomes formally aware of the partner\'s occupation — the right to rent obligation is triggered by the landlord\'s knowledge, and an agent who has not been informed of the new occupier cannot be penalised for failing to conduct a check on a person they did not know about',
    ],
    correct: 0,
    rationale: 'Right to rent checks are required for every adult aged 18 or over who occupies the property as their only or main home — not just those named on the tenancy agreement. A partner moving in mid-tenancy must have a check conducted before they move in. Failing to check an adult occupier removes the statutory excuse regardless of whether they are a named tenant.',
  },
  {
    id: 'q-r-rtr-02-7', moduleId: 'rtr-02', tier: 'recap',
    question: 'You conduct an online right to rent check using a share code and the system returns a "status not available" error. The applicant says this has happened before and always resolves within 48 hours. What should you do?',
    options: [
      'Grant the tenancy with a conditional clause requiring the applicant to provide a successful check result within 5 working days — the system error is a Home Office technical issue and should not delay a tenancy where the applicant has provided a valid share code in good faith',
      'Accept the share code as evidence of a valid attempt to verify status and proceed with the tenancy — a documented system error provides a reasonable defence against a civil penalty, as the landlord has taken all reasonable steps to conduct the check',
      'Wait 48 hours as the applicant suggests and retry the check — Home Office system errors are common and typically resolve within this timeframe, and there is no obligation to pursue alternative verification until the online system has been retried at least twice',
      'Do not grant the tenancy until a valid check is complete. Contact the Home Office Landlord Checking Service directly to resolve the error and obtain a definitive status response — the applicant\'s assurance does not constitute a valid check and you have no statutory excuse until it is successfully completed',
    ],
    correct: 3,
    rationale: 'A system error does not provide a statutory excuse. The tenancy must not proceed until a valid check is completed. Contact the Home Office Landlord Checking Service directly to resolve the error rather than relying on the applicant\'s assurance. An applicant\'s share code submission is not itself a completed check — successful verification is required.',
  },
  {
    id: 'q-r-rtr-02-8', moduleId: 'rtr-02', tier: 'recap',
    question: 'A prospective tenant provides a Certificate of Application (COA) issued by the Home Office as evidence of a pending asylum claim. Does this grant a right to rent?',
    options: [
      'Yes — a Certificate of Application automatically grants a 12-month right to rent from the date of issue, renewable upon application to the Home Office. The COA is listed in the Immigration Act 2014 as a Group 2 document conferring a time-limited right to rent',
      'Yes — any document issued by the Home Office confirming receipt of an immigration application grants an automatic right to rent for the duration of the application processing period, as the applicant\'s presence in the UK is lawful while their claim is being considered',
      'Not automatically — you must verify the COA through the Home Office Landlord Checking Service, which will confirm whether the individual has a right to rent based on their asylum application status. Some applicants with pending claims are granted permission to rent; others are not',
      'No — a COA confirms only that an asylum claim has been received and does not confer any right to rent. Applicants with pending asylum claims are specifically excluded from the private rented sector under the Immigration Act 2014 until their claim is determined',
    ],
    correct: 2,
    rationale: 'A Certificate of Application does not automatically confer a right to rent. The landlord must verify through the Home Office Landlord Checking Service, which will confirm the individual\'s actual status. Some asylum applicants are granted a time-limited right to rent; others are not. The COA alone is insufficient evidence.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW MODULE QUESTIONS — Standard questions for modules with 0 prior questions
  // ═══════════════════════════════════════════════════════════════════════════

  // ── ONB-03: Pre-Onboarding Setup ─────────────────────────────────────────

  {
    id: 'q-onb-03-n1', moduleId: 'onb-03',
    question: 'What must be confirmed about a property\'s ARLA compliance status before it can be onboarded in Dwelly?',
    options: [
      'The property must have a minimum EPC rating of C and a valid HMO licence regardless of property type',
      'The landlord must provide a copy of their ARLA membership certificate before any property can be listed',
      'All mandatory compliance certificates (gas safety, EICR, EPC) must be in date and uploaded, and any required licences must be confirmed before the property is published',
      'ARLA compliance only requires a signed Terms of Business from the landlord and a completed anti-money laundering check',
    ],
    correct: 2,
    rationale: 'ARLA Propertymark standards require that all mandatory compliance documentation is verified before a property is marketed. This includes valid gas safety certificates, EICRs, EPCs, and any applicable property licences. Publishing a property without these in place exposes the agency to regulatory and legal risk.',
  },
  {
    id: 'q-onb-03-n2', moduleId: 'onb-03',
    question: 'What is the purpose of a landlord instruction letter during the pre-onboarding process?',
    options: [
      'It authorises the tenant to make changes to the property during the tenancy without further landlord approval',
      'It formally confirms the landlord\'s agreement for Dwelly to manage the property and sets out the terms of the agency relationship including fees, responsibilities, and authority limits',
      'It is a legal document required by the Land Registry to transfer management rights from one agent to another',
      'It notifies the local authority that the property is being let through a managing agent for council tax purposes',
    ],
    correct: 1,
    rationale: 'The landlord instruction letter is a formal document that confirms the landlord\'s agreement for Dwelly to manage their property. It sets out the terms of the relationship including management fees, the scope of the agency\'s authority, and any specific landlord preferences. Without this, the agency has no formal mandate to act on the landlord\'s behalf.',
  },
  {
    id: 'q-onb-03-n3', moduleId: 'onb-03',
    question: 'When setting up a new property file in Dwelly, which of the following must be completed before the property can move to Published status?',
    options: [
      'The tenant referencing report must be uploaded and the holding deposit must be received in the Dwelly ledger',
      'The property address, landlord details, compliance certificates, photos, and listing description must all be entered and verified',
      'Only the property address and rent amount are required — all other details can be added after publication',
      'The property must have at least three viewings booked in the Dwelly calendar before it can be published to portals',
    ],
    correct: 1,
    rationale: 'Before a property can move to Published status in Dwelly, the property file must be fully set up with the correct address, linked landlord details, all compliance certificates uploaded and verified, professional photos, and a complete listing description. Missing any of these creates compliance gaps and poor-quality listings.',
  },
  {
    id: 'q-onb-03-n4', moduleId: 'onb-03',
    question: 'How should a PM verify the current status of a property during the pre-onboarding process?',
    options: [
      'Contact the local authority to confirm whether the property is currently registered as a rental property in their area',
      'Check the Dwelly property record for the current status field, confirm all compliance certificates are valid and in date, and verify the property is not subject to any outstanding enforcement action or licence requirements',
      'Ask the landlord to confirm the property status verbally during the onboarding call and record their answer in the Notes tab',
      'Review the property\'s Rightmove listing history to determine whether it has been previously marketed and at what rent level',
    ],
    correct: 1,
    rationale: 'Property status verification requires checking the Dwelly system record, confirming all compliance certificates are current, and ensuring no outstanding enforcement actions or missing licences exist. Verbal confirmation alone is insufficient — PMs must verify against documentary evidence held in the system.',
  },
  {
    id: 'q-onb-03-n5', moduleId: 'onb-03',
    question: 'Which documents must be stored in the Dwelly File Manager as part of the pre-onboarding documentation pack?',
    options: [
      'Only the signed AST and the tenant\'s referencing report are required at the pre-onboarding stage',
      'The landlord\'s mortgage statement, buildings insurance schedule, and a copy of the freehold title deed must all be uploaded',
      'The signed Terms of Business, landlord identification documents, proof of ownership, compliance certificates, and any applicable licence confirmations',
      'A single PDF containing the landlord\'s self-declaration of compliance is sufficient to satisfy the pre-onboarding file requirements',
    ],
    correct: 2,
    rationale: 'The pre-onboarding documentation pack must include the signed Terms of Business, landlord ID for anti-money laundering purposes, proof of ownership, all current compliance certificates, and any applicable licence confirmations. These documents form the foundation of the agency\'s relationship with the landlord and ensure regulatory compliance from day one.',
  },

  // ── CMP-04: Setting Up Right to Rent Check ───────────────────────────────

  {
    id: 'q-cmp-04-n1', moduleId: 'cmp-04',
    question: 'What is a Home Office share code used for in the Right to Rent check process?',
    options: [
      'It is a code used to share the property listing with the Home Office for approval before the tenancy can commence',
      'It is a code generated by the prospective tenant that allows the agent to verify their immigration status online through the Home Office checking service',
      'It is a reference number assigned to the agency by the Home Office that must be quoted on all Right to Rent check records',
      'It is a code used by the deposit protection scheme to confirm the tenant\'s identity before the deposit can be registered',
    ],
    correct: 1,
    rationale: 'A share code is generated by prospective tenants who hold digital immigration status (such as EU Settlement Scheme, biometric residence permits, or visa holders with online records). The agent enters the share code on the Home Office online checking service to verify the tenant\'s right to rent. The code is time-limited and must be used promptly.',
  },
  {
    id: 'q-cmp-04-n2', moduleId: 'cmp-04',
    question: 'What is the difference between Group A and Group B documents for a Right to Rent check?',
    options: [
      'Group A documents are originals and Group B documents are certified copies — either group can be used independently to satisfy the check',
      'Group A documents (such as a UK passport or biometric residence permit) establish the right to rent on their own, while Group B documents require a combination of two documents to be presented together',
      'Group A applies to UK nationals only and Group B applies to all non-UK nationals, regardless of their immigration status',
      'Group A documents are checked in person and Group B documents are checked digitally through the Home Office online service',
    ],
    correct: 1,
    rationale: 'Group A documents are standalone documents that establish the right to rent on their own — examples include a UK or Irish passport, or a biometric residence permit. Group B documents do not establish the right to rent individually and must be presented as a combination of two acceptable documents. Understanding this distinction is essential to conducting a valid check.',
  },

  // ── MNT-01: Creating a Repair Request ────────────────────────────────────

  {
    id: 'q-mnt-01-n1', moduleId: 'mnt-01',
    question: 'How should a PM categorise a tenant reporting that their boiler has stopped producing hot water in December?',
    options: [
      'Routine — the repair can be scheduled within the standard 28-day maintenance window as boiler issues are common',
      'Urgent — loss of hot water requires action within 3-5 working days but does not constitute an immediate risk to safety',
      'Emergency — loss of heating or hot water during winter months is classified as an emergency requiring same-day or next-day response',
      'Non-urgent — advise the tenant to use an electric heater and kettle as interim measures and schedule a contractor visit within 14 days',
    ],
    correct: 2,
    rationale: 'Loss of heating or hot water is classified as an emergency repair, particularly during winter months, as it directly affects the habitability of the property. Emergency repairs require same-day or next-day contractor attendance. Delaying action risks a disrepair claim and breaches the landlord\'s repairing obligations under Section 11 of the Landlord and Tenant Act 1985.',
  },
  {
    id: 'q-mnt-01-n2', moduleId: 'mnt-01',
    question: 'What information must be recorded when logging a new repair request in Dwelly?',
    options: [
      'Only the tenant\'s name and a brief description of the issue — the contractor will provide full details after their first visit',
      'The property address, a detailed description of the fault, the category (emergency/urgent/routine), the date reported, any photos or evidence provided by the tenant, and the tenant\'s availability for access',
      'The contractor\'s name, their quote for the repair, and the landlord\'s pre-approved spending limit',
      'The tenant\'s phone number and a note confirming they have been advised to contact the landlord directly',
    ],
    correct: 1,
    rationale: 'A complete repair request log in Dwelly must include the property address, a detailed description of the fault, the correct urgency category, the date reported, any photographic evidence from the tenant, and the tenant\'s availability for contractor access. Incomplete logging leads to delays, miscategorisation, and a weaker audit trail if the matter escalates.',
  },
  {
    id: 'q-mnt-01-n3', moduleId: 'mnt-01',
    question: 'When is landlord authorisation required before instructing a contractor for a repair?',
    options: [
      'Landlord authorisation is required for every repair regardless of cost or urgency — no works should ever be instructed without explicit written approval',
      'Authorisation is only required when the total repair cost exceeds £5,000 — below this threshold the PM has full discretion',
      'For non-emergency works above the agreed spend threshold, landlord authorisation must be obtained and documented in the job chat before instructing the contractor',
      'Landlord authorisation is never required as the Terms of Business grant the agency full authority over all maintenance decisions',
    ],
    correct: 2,
    rationale: 'For non-emergency repairs that exceed the agreed spend threshold, landlord authorisation must be obtained and recorded in the Dwelly job chat before a contractor is instructed. Emergency repairs affecting health, safety, or habitability can be actioned immediately with the landlord notified as soon as possible. The authorisation trail protects both the agency and the landlord.',
  },
  {
    id: 'q-mnt-01-n4', moduleId: 'mnt-01',
    question: 'What is the purpose of SLA tracking on a repair request in Dwelly?',
    options: [
      'SLA tracking automatically calculates the contractor\'s invoice amount based on the time spent on the repair',
      'It monitors whether the repair is being progressed within the agreed timeframes for its category, flagging overdue jobs so PMs can take action before service levels are breached',
      'SLA tracking is used exclusively by the finance team to calculate penalty charges against contractors who miss deadlines',
      'It generates a weekly report for the landlord showing all open repairs and their estimated completion dates',
    ],
    correct: 1,
    rationale: 'SLA tracking in Dwelly monitors whether each repair is progressing within the expected timeframe for its urgency category. When a job approaches or exceeds its SLA, the system flags it so PMs can intervene before service levels are breached. This prevents jobs from stalling unnoticed and supports proactive workload management.',
  },
  {
    id: 'q-mnt-01-n5', moduleId: 'mnt-01',
    question: 'What should a PM communicate to the tenant after logging a repair request in Dwelly?',
    options: [
      'Nothing — Dwelly automatically sends the tenant a full update including the contractor\'s name, phone number, and estimated visit date without PM involvement',
      'A confirmation that the repair has been logged, the category it has been assigned, what happens next (e.g. landlord authorisation or contractor instruction), and expected timescales for the next update',
      'Only the repair reference number — all further communication should go through the contractor directly to avoid duplicating messages',
      'An email advising the tenant to contact the landlord directly if they want the repair progressed more quickly',
    ],
    correct: 1,
    rationale: 'After logging a repair, the PM should confirm to the tenant that the issue has been recorded, explain the category assigned, outline the next steps (such as landlord authorisation or contractor instruction), and set clear expectations on timescales. Good tenant communication at the outset reduces chase calls and demonstrates professional service.',
  },
  {
    id: 'q-mnt-01-n6', moduleId: 'mnt-01',
    question: 'Why is photo evidence important when a tenant reports a repair?',
    options: [
      'Photos are only needed for insurance claims — standard maintenance repairs do not require visual evidence at the point of report',
      'Photographs help the PM confirm the issue is genuine before logging it in the system, as verbal reports alone are not accepted by Dwelly',
      'Photo evidence at the point of report establishes the condition and severity of the issue, supports accurate categorisation, helps contractors prepare for the visit, and strengthens the audit trail if the matter escalates to a dispute or claim',
      'Photos are required solely to calculate the contractor\'s quote before they attend the property',
    ],
    correct: 2,
    rationale: 'Photo evidence taken at the point of report serves multiple purposes: it establishes a baseline of the issue\'s condition and severity, supports accurate categorisation of urgency, helps contractors prepare appropriately for their visit, and forms part of the audit trail if the repair later becomes the subject of a dispute or disrepair claim.',
  },

  // ── MNT-03: Creating an Inspection Task ──────────────────────────────────

  {
    id: 'q-mnt-03-n1', moduleId: 'mnt-03',
    question: 'How far in advance must a tenant be notified before a mid-term property inspection can take place?',
    options: [
      'No advance notice is required for routine inspections as the tenancy agreement grants the landlord the right to inspect at any time',
      'At least 24 hours\' written notice must be given to the tenant, specifying the date and time of the inspection, and the visit must be at a reasonable time of day',
      'At least 7 working days\' notice is required by law, and the tenant must provide written consent before the inspection can proceed',
      'Notice requirements depend entirely on the landlord\'s preference — some landlords request 48 hours while others accept same-day notification',
    ],
    correct: 1,
    rationale: 'Under Section 11 of the Landlord and Tenant Act 1985, a landlord must give at least 24 hours\' written notice before entering a property and the visit must be at a reasonable time. Even where the tenancy agreement specifies different notice periods, the statutory minimum of 24 hours always applies. Inspecting without proper notice is trespass.',
  },
  {
    id: 'q-mnt-03-n2', moduleId: 'mnt-03',
    question: 'What is the difference between a mid-term inspection and a pre-checkout inspection?',
    options: [
      'There is no practical difference — both inspections follow the same template and serve the same purpose of checking the property condition',
      'A mid-term inspection assesses the property\'s condition during an active tenancy to identify maintenance issues and breaches, while a pre-checkout inspection takes place near the end of the tenancy to prepare the tenant for the formal checkout and highlight potential deposit deductions',
      'A mid-term inspection is carried out by the PM while a pre-checkout inspection must always be conducted by an external inventory clerk',
      'Mid-term inspections are only required for HMO properties, whereas pre-checkout inspections apply to all tenancy types',
    ],
    correct: 1,
    rationale: 'A mid-term inspection is a routine check during an active tenancy to assess property condition, identify maintenance needs, and spot any tenancy breaches. A pre-checkout inspection occurs near the end of the tenancy to prepare the tenant for the formal checkout, highlight areas that need attention, and reduce the risk of deposit disputes. Each serves a distinct purpose at a different stage of the tenancy lifecycle.',
  },
  {
    id: 'q-mnt-03-n3', moduleId: 'mnt-03',
    question: 'What photo standards must be met when recording an inspection in Dwelly?',
    options: [
      'A single wide-angle photo of each room is sufficient as long as the overall condition is visible',
      'Photos should be well-lit, in focus, taken from consistent angles, cover all key areas of each room including floors, walls, ceilings, and fixtures, and any specific issues should be photographed close-up with context shots',
      'Photos are optional for mid-term inspections — only the written report is required in the Dwelly system',
      'Only photos of areas with damage or issues need to be taken; rooms in good condition do not require photographic evidence',
    ],
    correct: 1,
    rationale: 'Inspection photos must be well-lit, in focus, and taken from consistent angles to provide a reliable record. Every key area of each room should be captured including floors, walls, ceilings, and fixtures. Any specific issues require both a close-up and a wider context shot. Comprehensive photo evidence protects all parties in the event of a later dispute.',
  },
  {
    id: 'q-mnt-03-n4', moduleId: 'mnt-03',
    question: 'How are inspection tasks typically scheduled in Dwelly?',
    options: [
      'PMs must manually create a new inspection job for every property each quarter using the Create Job function',
      'The system automatically generates inspection jobs based on the inspection frequency set in the property\'s Fees section, ensuring no scheduled inspections are missed',
      'Inspections are only triggered when the tenant submits a request through the tenant portal or reports a maintenance issue',
      'The landlord schedules all inspections directly through their landlord portal and the PM receives a notification to attend',
    ],
    correct: 1,
    rationale: 'Dwelly automatically creates inspection jobs based on the frequency configured in the Fees section of each property record. This automation ensures that inspections are never missed due to manual oversight. PMs should verify that the correct frequency is set during onboarding so that the system generates jobs at the right intervals.',
  },
  {
    id: 'q-mnt-03-n5', moduleId: 'mnt-03',
    question: 'Which report template should be used when completing a mid-term inspection in Dwelly?',
    options: [
      'Any format is acceptable as long as the key findings are recorded in the Notes tab of the property',
      'The Dwelly standard inspection report template must be used, which includes room-by-room condition assessment, photo uploads, maintenance actions required, and compliance observations',
      'A simple email summary sent to the landlord is sufficient for mid-term inspections — formal reports are only required for checkout inspections',
      'The PM should use the landlord\'s preferred template, which varies by landlord and is stored in the File Manager',
    ],
    correct: 1,
    rationale: 'Mid-term inspections must be completed using the Dwelly standard inspection report template. This ensures consistency across all properties, captures room-by-room condition assessments with photos, records any maintenance actions required, and notes compliance observations. Using a standardised template also makes it easier to compare condition over time.',
  },

  // ── CMP-01: Creating a Compliance Task ───────────────────────────────────

  {
    id: 'q-cmp-01-n1', moduleId: 'cmp-01',
    question: 'What is the legal requirement for the frequency of gas safety checks at a rented property?',
    options: [
      'Every 6 months for properties with tenants who have children or vulnerable occupants',
      'Every 12 months — a gas safety check must be carried out annually by a Gas Safe registered engineer, and the certificate must be renewed before the previous one expires',
      'Every 2 years for properties where the boiler was installed within the last 5 years, and annually for older installations',
      'Only when the tenancy changes — a valid certificate from the previous tenancy can be carried over to a new tenant',
    ],
    correct: 1,
    rationale: 'The Gas Safety (Installation and Use) Regulations 1998 require a gas safety check every 12 months at all rented properties with gas installations. The check must be carried out by a Gas Safe registered engineer and the certificate must be renewed before the previous one expires. There are no exemptions based on boiler age or occupant type.',
  },
  {
    id: 'q-cmp-01-n2', moduleId: 'cmp-01',
    question: 'How often must an Electrical Installation Condition Report (EICR) be carried out at a privately rented property?',
    options: [
      'Every 12 months, on the same schedule as the gas safety check',
      'Every 3 years, aligned with the typical fixed-term tenancy length',
      'Every 5 years, or more frequently if the previous report recommends it — and the report must be provided to tenants within 28 days of the inspection',
      'Only at the start of a new tenancy — there is no requirement to renew during an ongoing tenancy',
    ],
    correct: 2,
    rationale: 'The Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020 require an EICR at least every 5 years. If the report recommends a shorter interval, the next inspection must be carried out by that date. A copy must be provided to existing tenants within 28 days and to new tenants before they move in.',
  },
  {
    id: 'q-cmp-01-n3', moduleId: 'cmp-01',
    question: 'How is a compliance job created in Dwelly for an upcoming gas safety renewal?',
    options: [
      'The PM must manually create a new compliance job 30 days before each certificate expiry date',
      'Dwelly automatically creates a compliance job when the certificate approaches its expiry date based on the renewal reminder settings, giving the PM lead time to arrange the check',
      'The landlord creates the compliance job through their portal when they receive a reminder email from the gas safety scheme',
      'Compliance jobs are only created when the local authority issues an enforcement notice for an expired certificate',
    ],
    correct: 1,
    rationale: 'Dwelly automatically generates compliance jobs ahead of certificate expiry dates based on the system\'s reminder settings (currently 90 days before expiry). This gives the PM sufficient lead time to contact the landlord, instruct a contractor, and complete the renewal before the existing certificate expires.',
  },
  {
    id: 'q-cmp-01-n4', moduleId: 'cmp-01',
    question: 'Where should compliance certificates be stored once they have been received from the contractor?',
    options: [
      'In the PM\'s personal email folder with a copy forwarded to the landlord for their records',
      'In the Dwelly File Manager under the property\'s Tenancy Files section alongside the AST',
      'In the Maintenance tab under the Primary sub-tab, where all compliance certificates are uploaded, viewed, and tracked against expiry dates',
      'In a shared drive outside of Dwelly, with a link added to the Notes tab for reference',
    ],
    correct: 2,
    rationale: 'Compliance certificates must be uploaded to the Maintenance tab under the Primary sub-tab in Dwelly. This is the central location where all compliance documents are stored, viewed, and tracked against their expiry dates. Storing certificates outside the system or in personal folders breaks the audit trail and creates a risk of certificates being lost or overlooked at renewal.',
  },
  {
    id: 'q-cmp-01-n5', moduleId: 'cmp-01',
    question: 'Who is legally permitted to issue a Gas Safety Certificate (CP12) for a rented property?',
    options: [
      'Any qualified plumber or heating engineer who holds a relevant NVQ qualification',
      'Only a Gas Safe registered engineer — no other qualification or registration permits a person to carry out a gas safety check or issue a CP12 at a rented property',
      'Any contractor listed on the Dwelly approved provider panel, regardless of their specific registration or accreditation',
      'A qualified electrician can issue a combined gas and electrical safety certificate if they hold dual trade qualifications',
    ],
    correct: 1,
    rationale: 'Only a Gas Safe registered engineer is legally permitted to carry out a gas safety check and issue a CP12 certificate. Using any other contractor, regardless of their qualifications or experience, would invalidate the certificate and place the landlord in breach of the Gas Safety (Installation and Use) Regulations 1998.',
  },
  {
    id: 'q-cmp-01-n6', moduleId: 'cmp-01',
    question: 'What happens in Dwelly when a compliance certificate expiry reminder is triggered?',
    options: [
      'The system sends an automated email to the landlord asking them to arrange the renewal directly with their preferred contractor',
      'A compliance job is automatically created and assigned to the responsible PM, giving them lead time to instruct a contractor and arrange the renewal before the current certificate expires',
      'The property is automatically unpublished from all portals until the certificate is renewed and uploaded',
      'A notification is sent to the local authority informing them that the certificate is due for renewal within the next 30 days',
    ],
    correct: 1,
    rationale: 'When an expiry reminder triggers, Dwelly automatically creates a compliance job and assigns it to the responsible PM. This ensures the renewal is tracked within the system, the PM has clear visibility of the upcoming deadline, and the job follows the standard compliance workflow through to completion and certificate upload.',
  },

  // ── SYS-01: Initiating Move-Out ──────────────────────────────────────────

  {
    id: 'q-sys-01-n1', moduleId: 'sys-01',
    question: 'What is the first step when initiating the move-out process in Dwelly?',
    options: [
      'Send the tenant a final rent statement and request they return all keys by the tenancy end date',
      'Create a move-out job in Dwelly linked to the property, which triggers the structured move-out workflow covering all required steps from notice through to deposit return and re-marketing',
      'Contact the landlord to confirm whether they want to re-let the property or withdraw it from management before any move-out actions are taken',
      'Book the checkout inspection with an external inventory clerk and notify the tenant of the inspection date',
    ],
    correct: 1,
    rationale: 'The first step is to create a move-out job in Dwelly linked to the property. This triggers the structured move-out workflow, which guides the PM through all required steps — from initial creation through key collection, checkout inspection, deposit negotiation, and re-marketing. Working outside the system creates gaps in the audit trail.',
  },
  {
    id: 'q-sys-01-n2', moduleId: 'sys-01',
    question: 'What is the statutory timeframe for returning a tenant\'s deposit after the tenancy ends?',
    options: [
      'There is no statutory deadline — the landlord can return the deposit whenever any outstanding disputes are resolved',
      'The deposit must be returned within 10 days of both parties agreeing how much should be returned, or within 10 days of a court or adjudicator decision',
      'The deposit must be returned within 30 days of the tenancy end date regardless of any ongoing disputes',
      'The deposit must be returned within 5 working days of the tenant returning all keys to the agency',
    ],
    correct: 1,
    rationale: 'Under deposit protection legislation, the deposit (or the agreed portion) must be returned within 10 days of both parties reaching agreement on the amount. If the matter goes to adjudication or court, the scheme must return the deposit within 10 days of the decision. PMs must ensure the process moves swiftly to avoid unnecessary delays.',
  },
  {
    id: 'q-sys-01-n3', moduleId: 'sys-01',
    question: 'When should re-marketing of a property begin during the move-out process?',
    options: [
      'Re-marketing should only begin after the checkout inspection is complete and any required remedial works have been carried out',
      'Re-marketing should begin as soon as the tenant gives notice, subject to the landlord\'s instruction — this maximises the chance of minimising the void period between tenancies',
      'Re-marketing should start exactly 14 days before the tenancy end date as standard practice across all properties',
      'Re-marketing is the landlord\'s responsibility and should not be initiated by the PM without a separate written instruction from the landlord',
    ],
    correct: 1,
    rationale: 'Re-marketing should begin as soon as the tenant gives notice, subject to the landlord\'s instruction and agreement. Early marketing maximises the chance of finding a replacement tenant quickly and minimises the void period. The PM should discuss timing and strategy with the landlord as part of the move-out job workflow.',
  },
  {
    id: 'q-sys-01-n4', moduleId: 'sys-01',
    question: 'How should a checkout inspection be scheduled during the move-out process?',
    options: [
      'The checkout should be scheduled for the same day the tenant returns the keys, with the inspection taking place immediately after key handover',
      'The checkout inspection should be scheduled as close to the tenancy end date as possible, with the tenant given adequate notice and the opportunity to attend or be represented',
      'The checkout should take place at least 7 days before the tenancy end date so the tenant has time to address any issues identified',
      'The checkout can be carried out at any point within 28 days of the tenancy end date — the deposit scheme allows a 28-day window for checkout completion',
    ],
    correct: 1,
    rationale: 'The checkout inspection should be scheduled as close to the tenancy end date as possible to accurately reflect the property\'s condition at the end of the tenancy. The tenant should be given adequate notice and the opportunity to attend or be represented. A checkout conducted too early or too late weakens its evidential value in any subsequent deposit dispute.',
  },
  {
    id: 'q-sys-01-n5', moduleId: 'sys-01',
    question: 'What is a dilapidation assessment in the context of a move-out?',
    options: [
      'A financial assessment of the landlord\'s total costs for managing the property during the tenancy, used to calculate any amounts owed to the agency',
      'A comparison between the check-in inventory and the checkout report to identify any damage beyond fair wear and tear that may be deductible from the tenant\'s deposit',
      'An assessment carried out by a surveyor to determine whether the property meets minimum habitability standards before it can be re-let',
      'A mandatory report required by the deposit protection scheme before any deposit deductions can be processed',
    ],
    correct: 1,
    rationale: 'A dilapidation assessment compares the property\'s condition at checkout against the check-in inventory to identify any damage that goes beyond fair wear and tear. Only damage evidenced by this comparison can be claimed from the tenant\'s deposit. The quality of both the check-in and checkout records directly determines the strength of any dilapidation claim.',
  },

  // ── SYS-02: Raising a Support Task ───────────────────────────────────────

  {
    id: 'q-sys-02-n1', moduleId: 'sys-02',
    question: 'How is a tenancy renewal managed within Dwelly?',
    options: [
      'The PM emails the landlord and tenant separately with the proposed new terms and uploads the signed agreement to the File Manager once agreed',
      'A support task is created in Dwelly for the renewal, which tracks the process from initial landlord discussion through to agreement on terms, rent review, document preparation, and tenant confirmation',
      'Renewals are handled entirely outside Dwelly using a separate renewal management spreadsheet maintained by the lettings team',
      'The system automatically renews all tenancies on the same terms unless the landlord logs into their portal and selects alternative options before the expiry date',
    ],
    correct: 1,
    rationale: 'Tenancy renewals are managed through a support task in Dwelly. This task tracks every step from the initial landlord discussion about renewal intentions and rent review, through to agreement on terms, document preparation, and final tenant confirmation. Managing renewals within the system ensures nothing is missed and creates a complete audit trail.',
  },
  {
    id: 'q-sys-02-n2', moduleId: 'sys-02',
    question: 'When should a PM begin the rent review discussion with the landlord ahead of a tenancy renewal?',
    options: [
      'On the day the tenancy expires, when the renewal terms must be confirmed immediately to avoid the tenancy becoming periodic',
      'At least 2-3 months before the tenancy expiry date, giving sufficient time to research comparable rents, discuss options with the landlord, and negotiate with the tenant',
      'Only when the tenant requests a rent reduction — if neither party raises the issue, the rent automatically carries forward unchanged',
      'At the annual inspection, regardless of where the tenancy is in its term, as this is the most natural point to discuss property performance',
    ],
    correct: 1,
    rationale: 'Rent review discussions should begin at least 2-3 months before the tenancy expiry date. This allows time to research comparable market rents, discuss the landlord\'s objectives, prepare a recommendation, and negotiate with the tenant. Starting too late risks the tenancy falling into a periodic without agreed renewal terms.',
  },
  {
    id: 'q-sys-02-n3', moduleId: 'sys-02',
    question: 'What types of tasks can be created using the Support flow in Dwelly?',
    options: [
      'Only tenancy renewal tasks — all other support activities are managed through the Maintenance or Compliance flows',
      'Support tasks cover a range of non-maintenance, non-compliance activities including tenancy renewals, rent reviews, landlord queries, tenant welfare referrals, and other ad hoc property management tasks that need tracking',
      'Support tasks are exclusively for tenant complaints and must be escalated to a manager within 24 hours of creation',
      'Support tasks are used only for financial queries such as rent arrears, payment plans, and landlord statement disputes',
    ],
    correct: 1,
    rationale: 'The Support flow in Dwelly covers a broad range of property management activities that fall outside the Maintenance and Compliance flows. This includes tenancy renewals, rent reviews, landlord queries, tenant welfare referrals, and other ad hoc tasks. Creating support tasks ensures these activities are tracked, auditable, and visible in the PM\'s workload.',
  },
  {
    id: 'q-sys-02-n4', moduleId: 'sys-02',
    question: 'How should a PM communicate renewal terms to the landlord?',
    options: [
      'Verbally during a phone call, with the agreed terms confirmed by the landlord sending a text message or WhatsApp reply',
      'Through the Dwelly job chat within the support task, providing a written summary of the proposed terms including any rent change, tenancy length, and any special conditions — ensuring there is a documented record of the landlord\'s agreement',
      'By posting a letter to the landlord\'s registered address, as digital communication does not constitute formal instruction for tenancy terms',
      'Via the landlord portal only — PMs should not discuss renewal terms directly but instead update the portal and wait for the landlord to review and approve',
    ],
    correct: 1,
    rationale: 'Renewal terms should be communicated through the Dwelly job chat within the relevant support task. This creates a documented, timestamped record of the proposed terms and the landlord\'s response. Written confirmation through the system protects the agency if there is any later dispute about what was agreed. Verbal agreements alone are insufficient.',
  },
  {
    id: 'q-sys-02-n5', moduleId: 'sys-02',
    question: 'Why is it important to link support tasks to the correct property in Dwelly?',
    options: [
      'Linking is optional and only affects how tasks appear in the weekly team report — unlinked tasks still function normally',
      'Linking tasks to the correct property ensures all activity is recorded against the property record, creating a complete audit trail, enabling accurate reporting, and ensuring the task is visible to any PM who manages that property',
      'Tasks must be linked to a property only when they involve a financial transaction such as a rent change or invoice',
      'Linking is required by GDPR to ensure personal data processing is associated with the correct data subject',
    ],
    correct: 1,
    rationale: 'Linking support tasks to the correct property in Dwelly is essential for maintaining a complete audit trail. It ensures that all activity — renewals, rent reviews, landlord communications — is recorded against the property record. This means any PM who subsequently manages the property can see the full history, and reporting accurately reflects the property\'s management activity.',
  },
]

// ─── CPD Entries ───────────────────────────────────────────────────────────────

export const CPD_ENTRIES: CPDEntry[] = [
  { id: 'cpd-01', date: '2026-01-15', title: 'Welcome to Dwelly Portal', type: 'formal', hours: 0.5, source: 'Dwelly Portal', verified: true },
  { id: 'cpd-02', date: '2026-01-22', title: 'Dwelly System Navigation & General Overview', type: 'formal', hours: 1.0, source: 'Dwelly Portal', verified: true },
  { id: 'cpd-03', date: '2026-02-05', title: 'Repair Logging Module', type: 'formal', hours: 0.5, source: 'Dwelly Portal', verified: true },
  { id: 'cpd-04', date: '2026-02-18', title: 'ARLA Propertymark: Lettings Law Update', type: 'technical', hours: 3.0, source: 'ARLA Propertymark', verified: true },
  { id: 'cpd-05', date: '2026-03-10', title: 'Difficult Tenant Conversation (Reflective Log)', type: 'reflective', hours: 0.5, source: 'Self-reported', verified: false },
  { id: 'cpd-06', date: '2026-03-25', title: 'Pre-Onboarding Compliance Checklist', type: 'formal', hours: 1.0, source: 'Dwelly Portal', verified: true },
]

// ─── Sign-Off Gates ────────────────────────────────────────────────────────────

export const SIGN_OFF_GATES: SignOffGate[] = [
  {
    id: 'sog-01', area: 'Gas Safety', risk: 'high',
    description: 'Must demonstrate understanding of gas safety obligations before managing a property with a gas appliance solo.',
    signedOff: false, requiredModules: ['cmp-01'],
  },
  {
    id: 'sog-02', area: 'Deposit Protection', risk: 'high',
    description: 'Must correctly process a deposit through an approved scheme before handling deposits independently.',
    signedOff: false, requiredModules: ['cmp-02'],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<Role, string> = {
  property_manager: 'Property Manager',
  maintenance_coordinator: 'Maintenance Coordinator',
  lettings_negotiator: 'Lettings Negotiator',
}

export const SECTION_LABELS: Record<ModuleSection, string> = {
  'maintenance':        'Maintenance',
  'compliance':         'Compliance',
  'move-outs':          'Move-Outs',
  'inspections':        'Inspections',
  'support':            'Support',
  'knowledge':          'Knowledge',
}

export const SECTION_COLORS: Record<ModuleSection, string> = {
  'maintenance':        'text-orange bg-orange/10 border-orange/20',
  'compliance':         'text-red-600 bg-red-50 border-red-200',
  'move-outs':          'text-navy bg-navy/10 border-navy/20',
  'inspections':        'text-orange bg-orange/10 border-orange/20',
  'support':            'text-teal bg-teal/10 border-teal/20',
  'knowledge':          'text-gold-700 bg-gold/10 border-gold/30',
}

export const CURRENT_USER = TEAM_MEMBERS[0]

// ─── Recap & Refresh ──────────────────────────────────────────────────────────

export interface RecapRound {
  id: string                   // e.g. 'recap-jan-2026'
  month: string                // e.g. 'January'
  label: string                // e.g. 'January 2026'
  theme: string                // e.g. 'Maintenance & Compliance'
  focus: string[]              // topic pill labels
  questionModuleIds: string[]  // which module IDs to sample from
  questionCount: number        // target question count (15)
  completed: boolean
  score?: number               // percentage, if completed
  completedDate?: string       // ISO date string
}

export const RECAP_ROUNDS: RecapRound[] = [
  {
    id: 'recap-feb-2026',
    month: 'February',
    label: 'February 2026',
    theme: 'Compliance & Deposits',
    focus: ['Gas Safety', 'Deposit Protection', 'TDS Schemes'],
    questionModuleIds: ['cmp-02'],
    questionCount: 15,
    completed: false,
  },
  {
    id: 'recap-mar-2026',
    month: 'March',
    label: 'March 2026',
    theme: 'Maintenance & Move-Outs',
    focus: ['Contractor Management', 'Dilapidations', 'End of Tenancy', 'Fair Wear & Tear'],
    questionModuleIds: ['mnt-02', 'mvt-02'],
    questionCount: 15,
    completed: false,
  },
  {
    id: 'recap-apr-2026',
    month: 'April',
    label: 'April 2026',
    theme: 'Inspections & Right to Rent',
    focus: ['Inspection Reports', 'Share Codes', 'Digital Checks', 'Visual Likeness'],
    questionModuleIds: ['ins-02', 'sup-02'],
    questionCount: 15,
    completed: false,
  },
]

export interface PortalUpdate {
  id: string
  date: string                                               // ISO date
  title: string
  category: 'system' | 'content' | 'compliance' | 'process'
  description: string
  isNew?: boolean                                            // within last ~14 days
}

export const PORTAL_UPDATES: PortalUpdate[] = [
  {
    id: 'upd-001',
    date: '2026-04-08',
    title: 'New: Right to Rent digital check process updated',
    category: 'compliance',
    description: 'The Home Office digital verification service has updated its share code format. PMs must now complete visual likeness checks within 7 days of share code submission rather than 14 days. Updated guidance is in the Right to Rent training guide.',
    isNew: true,
  },
  {
    id: 'upd-002',
    date: '2026-04-03',
    title: 'Dwelly: Job reassignment audit trail improvement',
    category: 'system',
    description: 'When a job is reassigned between PMs, the system now creates a permanent audit entry in the job chat recording the previous PM, new PM, and reason for reassignment. All existing reassignment processes remain unchanged.',
    isNew: true,
  },
  {
    id: 'upd-003',
    date: '2026-03-28',
    title: 'Updated: How to Rent guide (v3.2)',
    category: 'compliance',
    description: 'The government\'s How to Rent guide has been updated to v3.2. All new tenancies must be served the current version at move-in. Serving an outdated version may affect future possession proceedings — always download the latest version from gov.uk.',
    isNew: false,
  },
  {
    id: 'upd-004',
    date: '2026-03-20',
    title: 'MEES update: EPC E rating enforcement extended',
    category: 'compliance',
    description: 'The deadline for existing tenancies to meet EPC E minimum has been extended to December 2027. New lets still require a minimum EPC E from April 2026. The Knowledge Base article on Property Standards has been updated to reflect this.',
    isNew: false,
  },
  {
    id: 'upd-005',
    date: '2026-03-14',
    title: 'Dwelly: Compliance certificate expiry notifications improved',
    category: 'system',
    description: 'Gas Safety and EICR expiry reminders now trigger 90 days before expiry (previously 60 days), giving more lead time for scheduling. Jobs are auto-created at the 90-day mark. No action required — this is a background system change.',
    isNew: false,
  },
  {
    id: 'upd-006',
    date: '2026-03-01',
    title: 'Process: Updated rent arrears escalation threshold',
    category: 'process',
    description: 'The internal escalation threshold for rent arrears has moved from 14 days to 10 days overdue. PMs should update their chase cadences accordingly. Updated guidance is available in the Training Guide under Support.',
    isNew: false,
  },
  {
    id: 'upd-007',
    date: '2026-02-18',
    title: 'New module added: Inspections 2/2 — Completing the Inspection',
    category: 'content',
    description: 'The second inspections video module is now live in the portal. If you completed onboarding before February, revisit this module to catch the updated Dwelly inspection submission flow and new photo requirements.',
    isNew: false,
  },
  {
    id: 'upd-008',
    date: '2026-02-05',
    title: 'Renters Rights Bill: Abolition of fixed-term tenancies — what to know',
    category: 'compliance',
    description: 'The Renters Rights Bill is progressing through Parliament. A new knowledge article covering what abolishing fixed-term ASTs means for PMs managing renewals and periodic tenancies has been added to the Knowledge Base.',
    isNew: false,
  },
]
