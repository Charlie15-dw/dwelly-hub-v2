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
    duration: '35 min', videoLength: '6 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 5,
    roles: ['property_manager'],
    description: 'What to look for, how to evidence it, photo standards and report writing.',
    tags: ['inspections', 'evidence', 'reporting'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'ins-02', title: 'Inspections 2/2 — Completing the Inspection', section: 'inspections', phase: 'embedding',
    duration: '30 min', videoLength: '5 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 6,
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
    duration: '35 min', videoLength: '5 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 8,
    roles: ['property_manager', 'lettings_negotiator'],
    description: 'Actioning a compliance job in Dwelly — assigning providers, handling the landlord\'s own contractor, certificates and remedial works.',
    tags: ['gas', 'EICR', 'certificates', 'compliance'], spacedRepetitionDue: null, confidenceRating: null,
  },
  // MOVE-OUTS / SUPPORT
  {
    id: 'sys-01', title: 'Move-Outs 1/2 — Initiating the Move-Out Process', section: 'move-outs', phase: 'onboarding',
    duration: '45 min', videoLength: '7 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 5,
    roles: ['property_manager'],
    description: 'Full end of tenancy workflow in Dwelly — checkout, deposit return, and handing the property over to Lettings for re-marketing.',
    tags: ['EOT', 'checkout', 'deposits'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'mvt-02', title: 'Move-Outs 2/2 — Completing the Move-Out', section: 'move-outs', phase: 'onboarding',
    duration: '30 min', videoLength: '5 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 8,
    roles: ['property_manager'],
    description: 'How to action and complete the move-out process in Dwelly — checkout, deposit return, and handing over to Lettings for re-marketing.',
    tags: ['EOT', 'checkout', 'deposits'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'sys-02', title: 'Support 1/2 — Raising a Support Task', section: 'support', phase: 'embedding',
    duration: '35 min', videoLength: '5 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 5,
    roles: ['property_manager', 'lettings_negotiator'],
    description: 'How to raise a support task in Dwelly for non-maintenance, non-compliance requests — logging landlord queries, tenant welfare referrals, and other ad hoc tasks, and tracking them through to resolution.',
    tags: ['support-tasks', 'landlords', 'tenants'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'sup-02', title: 'Support 2/2 — Actioning the Support Task', section: 'support', phase: 'embedding',
    duration: '25 min', videoLength: '4 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 6,
    roles: ['property_manager', 'lettings_negotiator'],
    description: 'How to action a support task in Dwelly — progressing landlord queries, tenant welfare referrals, and other ad hoc requests, escalating where needed, and recording the outcome.',
    tags: ['support-tasks', 'tenants', 'landlords'], spacedRepetitionDue: null, confidenceRating: null,
  },

  // KNOWLEDGE
  {
    id: 'kno-01', title: 'Dwelly Best Practice', section: 'knowledge', phase: 'embedding',
    duration: '40 min', videoLength: '6 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 5,
    roles: ['property_manager', 'lettings_negotiator'],
    description: 'Dwelly best practice — internal notes, documented chasing cadence, email delivery statuses, and using Auto mode well.',
    tags: ['best-practice', 'communication', 'documentation'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'kno-02', title: 'Repairs & Legal Responsibilities', section: 'knowledge', phase: 'embedding',
    duration: '45 min', videoLength: '7 min', passmark: 80, completed: false, progress: 0, locked: false, quizCount: 7,
    roles: ['property_manager'],
    description: 'Legal obligations, timescales, evidence requirements and escalation to specialists.',
    tags: ['disrepair', 'legal', 'evidence'], spacedRepetitionDue: null, confidenceRating: null,
  },
  {
    id: 'kno-03', title: 'Property Finances & the Ledger', section: 'knowledge', phase: 'embedding',
    duration: '30 min', videoLength: '5 min', passmark: 75, completed: false, progress: 0, locked: false, quizCount: 5,
    roles: ['property_manager'],
    description: 'Basic financial literacy — service charges, deductions, and explaining costs to landlords.',
    tags: ['finance', 'P&L', 'landlords'], spacedRepetitionDue: null, confidenceRating: null,
  },
]

// ─── Team Members ─────────────────────────────────────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-01', name: 'Sarah Mitchell', role: 'property_manager', email: 'sarah.mitchell@dwelly.co.uk',
    startDate: '2026-01-06', phase: 'onboarding', overallProgress: 0, ragStatus: 'green',
    modulesCompleted: 0, modulesTotal: 15, assessmentScore: 0,
    lastActive: '2026-04-07',
    competenciesSignedOff: [],
    pendingSignOffs: [],
  },
  {
    id: 'tm-02', name: 'James Okafor', role: 'property_manager', email: 'james.okafor@dwelly.co.uk',
    startDate: '2026-01-06', phase: 'foundation', overallProgress: 32, ragStatus: 'amber',
    modulesCompleted: 4, modulesTotal: 13, assessmentScore: 72,
    lastActive: '2026-04-03',
    competenciesSignedOff: ['Portal Induction'],
    pendingSignOffs: ['Repair Logging', 'Gas Safety', 'Deposit Protection'],
  },
  {
    id: 'tm-03', name: 'Priya Sharma', role: 'lettings_negotiator', email: 'priya.sharma@dwelly.co.uk',
    startDate: '2026-02-03', phase: 'onboarding', overallProgress: 55, ragStatus: 'green',
    modulesCompleted: 6, modulesTotal: 10, assessmentScore: 91,
    lastActive: '2026-04-08',
    competenciesSignedOff: ['Portal Induction', 'Compliance Checklist'],
    pendingSignOffs: ['Deposit Protection'],
  },
  {
    id: 'tm-04', name: 'Tom Blackwell', role: 'maintenance_coordinator', email: 'tom.blackwell@dwelly.co.uk',
    startDate: '2026-01-20', phase: 'foundation', overallProgress: 18, ragStatus: 'red',
    modulesCompleted: 2, modulesTotal: 7, assessmentScore: 58,
    lastActive: '2026-03-25',
    competenciesSignedOff: ['Portal Induction'],
    pendingSignOffs: ['Repair Logging', 'Contractor Management'],
  },
  {
    id: 'tm-05', name: 'Amara Nwosu', role: 'property_manager', email: 'amara.nwosu@dwelly.co.uk',
    startDate: '2026-03-03', phase: 'foundation', overallProgress: 22, ragStatus: 'amber',
    modulesCompleted: 3, modulesTotal: 13, assessmentScore: 79,
    lastActive: '2026-04-06',
    competenciesSignedOff: ['Portal Induction'],
    pendingSignOffs: ['Compliance Checklist', 'Repair Logging'],
  },
  {
    id: 'tm-06', name: 'Daniel Hughes', role: 'lettings_negotiator', email: 'daniel.hughes@dwelly.co.uk',
    startDate: '2026-03-03', phase: 'foundation', overallProgress: 45, ragStatus: 'green',
    modulesCompleted: 5, modulesTotal: 10, assessmentScore: 84,
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
    question: 'How do you manually create a maintenance job in Dwelly?',
    options: [
      'Properties tab → Maintenance sub-tab → + New Job',
      'Property Management tab → + Add Request → Maintenance Request → enter address, name, description, files → Create Job',
      'My Jobs → + Add Task → Maintenance',
      'Global Search → find property → + Add Maintenance',
    ],
    correct: 1,
    rationale: 'Manual maintenance jobs are created from the Property Management tab → + Add Request → Maintenance Request. Enter the address, job name, description, and any relevant files, then click Create Job.',
  },
  {
    id: 'q-mnt-01-2', moduleId: 'mnt-02',
    question: 'When a tenant submits a fault report through the Dwelly Tenant Portal, what happens automatically?',
    options: [
      'An email is sent to the landlord requesting consent before any job is created',
      'Dwelly creates the maintenance job and assigns it to the responsible Property Manager',
      'The job is created and placed in the manager queue for review before assignment',
      'A quote request is sent to the nearest available provider',
    ],
    correct: 1,
    rationale: 'When a tenant submits a report through the Tenant Portal, Dwelly automatically creates a maintenance job and assigns it to the Property Manager responsible for that property — no manual intervention is needed.',
  },
  {
    id: 'q-mnt-01-3', moduleId: 'mnt-02',
    question: 'What does "Submit and Launch Triggered Flow" do when instructing a provider?',
    options: [
      'Sends the quote to the landlord for approval before instructing the contractor',
      'Assigns the provider but holds all communications until you manually release them',
      'Engages Auto Mode — sends visit notifications to the tenant and contractor, with automated reminders at 24, 48, and 96 hours',
      'Closes the current job and creates a follow-up task for the PM',
    ],
    correct: 2,
    rationale: 'Submit and Launch Triggered Flow is the standard way to instruct a provider. It puts the job in Auto Mode, sending visit notifications to the tenant and contractor, with automated reminders at 24, 48, and 96 hours if no response is received.',
  },
  {
    id: 'q-mnt-01-4', moduleId: 'mnt-02',
    question: 'How do you confirm a quote has been approved by the landlord in Dwelly?',
    options: [
      'Send an internal note to your Team Coordinator with the approval details',
      'Click Assign Progress → Quote is approved → upload the quote → Submit',
      'Change the job mode from Pause to Auto to progress it forward',
      'Update the job description with the landlord\'s approval message',
    ],
    correct: 1,
    rationale: 'Once the landlord approves a quote, go to Assign Progress → select Quote is approved → upload the quote from the provider → click Submit. The job returns to Auto Mode and the contractor is notified to contact the tenant again.',
  },
  {
    id: 'q-mnt-01-5', moduleId: 'mnt-02',
    question: 'How do you change the provider assigned to a maintenance job?',
    options: [
      'Close the job and create a new one with the correct provider assigned',
      'Contact your Team Coordinator to reassign — provider changes require Supervisor access',
      'Select the new provider in the job and submit — automated messages resend to the new provider automatically',
      'Email the new provider directly and update the notes section to reflect the change',
    ],
    correct: 2,
    rationale: 'To change the provider, select the new provider within the job and submit. If the job is in Auto Mode, automated messages resend to the new provider automatically — there is no need to close or recreate the job.',
  },
  {
    id: 'q-mnt-01-6', moduleId: 'mnt-02',
    question: 'After a maintenance visit has occurred, what three outcome options are available in Dwelly?',
    options: [
      'Job Completed, Quote Required, Escalate to Compliance',
      'Job Completed, Quote Approved, Request Additional Quote',
      'Completed, Partial Completion, Not Completed',
      'Job Closed, Awaiting Invoice, Remedial Works Required',
    ],
    correct: 1,
    rationale: 'Once the visit has occurred, the three outcome options in Dwelly are: Job Completed, Quote Approved (if the landlord has approved a quoted amount), and Request Additional Quote (if the landlord wants a second quote).',
  },

  // ─── MNT-02: Contractor Management ───────────────────────────────────────

  {
    id: 'q-mnt-02-1', moduleId: 'mnt-02',
    question: 'When a maintenance job is completed, where in Dwelly do you record who is paying for the invoice?',
    options: [
      'In the job description field at the top of the page',
      'In the Ledger under the property\'s financial records',
      'In the Payment Allocation section — selecting agency pays for LL, LL pays directly, or tenant pays',
      'In the Notes tab with a comment flagged to the finance team',
    ],
    correct: 2,
    rationale: 'Payment allocation is recorded in the Payment Allocation section of the completed job. The three options are: We pay for LL (most common — cost deducted from next rent), LL pays directly, or Tenant pays. Upload the invoice and confirm keys returned before closing.',
  },
  {
    id: 'q-mnt-02-2', moduleId: 'mnt-02',
    question: 'A provider has not responded to three automated reminders over 5 days and the job has returned to Pause. What is the recommended next step?',
    options: [
      'Place the job on a two-week hold and wait for the provider to respond',
      'Use "Resume waiting for visit date (5 days)" to re-engage the waiting period while keeping the job in Auto Mode',
      'Close the job and raise a new one with a different provider',
      'Switch the job to Manual mode and chase the provider by email only',
    ],
    correct: 1,
    rationale: 'When a provider doesn\'t respond after automated reminders, use Assign Progress → Resume waiting for visit date (5 days). This keeps the task in Auto Mode so the system returns it to your queue the moment an update is received, rather than leaving it stuck.',
  },
  {
    id: 'q-mnt-02-3', moduleId: 'mnt-02',
    question: 'What is the recommended On Hold duration when awaiting a response from a landlord or tenant?',
    options: ['24 hours', '48 hours', '5 days', '7 days'],
    correct: 1,
    rationale: '48 hours is the recommended On Hold duration when awaiting a response. When the hold expires it is a prompt to call or follow up directly — do not apply another consecutive hold without first attempting contact.',
  },
  {
    id: 'q-mnt-02-4', moduleId: 'mnt-02',
    question: 'Where must all communications for a maintenance job be recorded?',
    options: [
      'In the Notes tab on the property page',
      'In a separate email thread with the landlord copied in',
      'In the Job Chat — all messages, calls, emails, and notes are logged here',
      'In the team Slack channel #pm-questions',
    ],
    correct: 2,
    rationale: 'All communication for any job must be sent and recorded inside the Job Chat. Using external tools like Outlook means Dwelly cannot capture the information, resulting in an incomplete job history, broken automations, and missing audit trail.',
  },

  // ─── MNT-03: Inspections ──────────────────────────────────────────────────

  {
    id: 'q-mnt-03-1', moduleId: 'ins-02',
    question: 'How far in advance does Dwelly automatically create an inspection job before it is due?',
    options: ['30 days', '21 days', '14 days', '7 days'],
    correct: 2,
    rationale: 'Dwelly automatically creates an inspection job 14 days before the inspection is due, giving the PM time to schedule the visit and notify the tenant.',
  },
  {
    id: 'q-mnt-03-2', moduleId: 'ins-02',
    question: 'When booking an inspection with an internal Property Specialist, how does scheduling work in Dwelly?',
    options: [
      'Email the Property Specialist and manually enter the agreed date into the job',
      'The Property Specialist self-assigns the slot via their own My Jobs tab',
      'The integrated Google Calendar view is shown on the job — select an available slot directly',
      'Raise a Support job requesting a booking from the Inspections team',
    ],
    correct: 2,
    rationale: 'For internal Property Specialists, Dwelly displays their integrated Google Calendar directly on the inspection job. Select an available slot and the event is automatically added to their calendar. The tenant receives a booking confirmation automatically.',
  },
  {
    id: 'q-mnt-03-3', moduleId: 'ins-02',
    question: 'How do you reschedule an inspection visit in Dwelly?',
    options: [
      'Close the current inspection job and create a new one with the updated date',
      'Edit the visit date field directly and save the change',
      'Take the job off Auto Mode → Assign Progress → Change Inspection Time → enter the new agreed date',
      'Ask your Team Coordinator to update the date as it requires Supervisor access',
    ],
    correct: 2,
    rationale: 'To reschedule: take the job out of Auto Mode to pause automations, then go to Assign Progress → Change Inspection Time → enter the new agreed date. Do not close and recreate — this destroys the audit trail.',
  },
  {
    id: 'q-mnt-03-4', moduleId: 'ins-02',
    question: 'After uploading an inspection report where no issues were found, what should you do?',
    options: [
      'Create a completion note in the Notes tab and set the job to Closed',
      'Select "No" and submit — the job closes and the landlord is automatically notified with the report attached',
      'The job closes automatically as soon as the report is uploaded',
      'Request sign-off from your Team Coordinator before the job can be closed',
    ],
    correct: 1,
    rationale: 'If no issues are found, select "No" and submit. The job is considered closed and the landlord is automatically notified of the outcome with the inspection report attached.',
  },
  {
    id: 'q-mnt-03-5', moduleId: 'ins-02',
    question: 'What must you do if issues are identified during an inspection?',
    options: [
      'Record the issues in the landlord profile notes and add a calendar reminder',
      'Contact the tenant directly to agree on the remedial works',
      'Select "Yes", complete the Comment for LL field (sent to landlord automatically), and create a separate maintenance job for any works',
      'Add an internal note to the inspection job and set it to On Hold pending landlord response',
    ],
    correct: 2,
    rationale: 'If issues are found, select "Yes" and complete the Comment for LL field — this message is automatically sent to the landlord. Any works required must be raised as a separate maintenance job so they are tracked and actioned correctly.',
  },
  {
    id: 'q-mnt-03-6', moduleId: 'ins-02',
    question: 'After an inspection is booked, what automated communication does the tenant receive before the visit?',
    options: [
      'A letter posted to the property address 7 days before',
      'An email 48 hours before the visit',
      'An SMS reminder 24 hours before the visit',
      'A phone call from the Property Specialist on the morning of the visit',
    ],
    correct: 2,
    rationale: 'Once an inspection is booked, the tenant receives a booking confirmation. Dwelly then automatically sends an SMS reminder to the tenant 24 hours before the scheduled visit.',
  },

  // ─── CMP-01: Compliance Job Flow in Dwelly ───────────────────────────────

  {
    id: 'q-cmp-01-1', moduleId: 'cmp-02',
    question: 'How far in advance does Dwelly automatically create a compliance renewal job?',
    options: ['14 days before expiry', '21 days before expiry', '30 days before expiry', '60 days before expiry'],
    correct: 2,
    rationale: 'Dwelly automatically generates a compliance renewal job 30 days before the certificate expiry date, giving enough time to obtain landlord consent, assign a provider, and schedule the visit.',
  },
  {
    id: 'q-cmp-01-2', moduleId: 'cmp-02',
    question: 'How do you manually create a compliance job in Dwelly?',
    options: [
      'Properties tab → Maintenance sub-tab → + New Compliance',
      'Property Management tab → + Add Request → Compliance → enter address → select compliance type → Create Job',
      'My Jobs → + Add Task → Compliance → enter property details',
      'Global Search → find property → Maintenance tab → + Add Certificate',
    ],
    correct: 1,
    rationale: 'To manually create a compliance job: go to Property Management tab → + Add Request → Compliance → enter the address → select the compliance type (e.g. Gas Safety, EICR) → click Create Job.',
  },
  {
    id: 'q-cmp-01-3', moduleId: 'cmp-02',
    question: 'What happens if the landlord does not respond to a compliance consent request with less than 2 weeks until expiry?',
    options: [
      'The job enters MP_TIME_FORCE mode and is escalated to a manager',
      'Proceed to book the compliance job without approval',
      'The job is placed on a 7-day hold awaiting landlord response',
      'Send a final written notice by email before taking any action',
    ],
    correct: 1,
    rationale: 'If the property is managed and the landlord does not respond within 2 weeks of expiry, you should proceed to book the compliance job without approval. Compliance cannot lapse waiting for a non-responsive landlord.',
  },
  {
    id: 'q-cmp-01-4', moduleId: 'cmp-02',
    question: 'How do you handle a compliance job where the landlord wants to use their own contractor?',
    options: [
      'Assign the landlord\'s contractor from the provider list and instruct as normal',
      'Do not select a provider — use Assign Progress → Certificate Issued, then set On Hold while waiting for the landlord to send the certificate',
      'Close the compliance job and create a maintenance job for the landlord\'s contractor',
      'Switch the job to Manual mode and email the landlord\'s contractor directly',
    ],
    correct: 1,
    rationale: 'When the landlord uses their own contractor, do not select a provider. Use Assign Progress → Certificate Issued to move the job to the certificate upload stage. Set On Hold while waiting for the landlord to arrange their contractor and send the certificate through.',
  },
  {
    id: 'q-cmp-01-5', moduleId: 'cmp-02',
    question: 'What is MP_TIME_FORCE mode and when does it activate?',
    options: [
      'A mode where the system automatically books the nearest available contractor',
      'A mode where all automations are paused and the PM must take direct control — activates when a certificate is within 14 days of expiry, or the property is vacant',
      'A mode that escalates the job to a Team Coordinator automatically',
      'A mode triggered when the landlord has been unresponsive for more than 30 days',
    ],
    correct: 1,
    rationale: 'MP_TIME_FORCE mode pauses all automations and requires the PM to take full manual control. It triggers automatically when a certificate expiry is less than 14 days away, or when a compliance job is created at a vacant property where the tenant cannot be contacted.',
  },
  {
    id: 'q-cmp-01-6', moduleId: 'cmp-02',
    question: 'Where must you upload an unsatisfactory certificate when remedial works are required?',
    options: [
      'Directly on the compliance job so all parties are notified immediately',
      'Via File Manager on the property page — not on the job itself — to prevent it being served to all parties',
      'In the Notes tab with a comment for the TC to action',
      'In a new maintenance job created specifically for the remedial works',
    ],
    correct: 1,
    rationale: 'An unsatisfactory certificate must be uploaded via File Manager on the property — not directly on the compliance job. Uploading it to the job would trigger automatic serving to the landlord and tenant, which is not appropriate when remedial works are still required.',
  },
  {
    id: 'q-cmp-01-7', moduleId: 'cmp-02',
    question: 'Once a compliant certificate and invoice are uploaded and accepted, what does Dwelly do automatically?',
    options: [
      'The PM must manually notify the tenant and landlord before closing',
      'The job remains open for 48 hours to allow for any queries before closing',
      'Dwelly sends the certificate to the tenant and landlord, notifies the contractor, and closes the job',
      'The TC is notified to review and approve closure of the compliance job',
    ],
    correct: 2,
    rationale: 'Once the certificate and invoice are uploaded and accepted, Dwelly automatically serves the certificate to the tenant and landlord, sends job acceptance confirmation to the contractor, and closes the job. No manual notification is needed.',
  },
  {
    id: 'q-cmp-01-8', moduleId: 'cmp-02',
    question: 'When should a compliance job be in On Hold mode rather than Auto Mode?',
    options: [
      'Whenever you are awaiting a visit date confirmation from the provider',
      'Only in two situations: the landlord is using their own provider, or remedial works are required before a compliant certificate can be issued',
      'Whenever the landlord has not yet responded to the consent request',
      'Whenever the certificate expiry is more than 14 days away',
    ],
    correct: 1,
    rationale: 'The golden rule for compliance: use Auto Mode at every stage except two — (1) the landlord is using their own provider (no provider to assign), or (2) an unsatisfactory certificate was returned and remedial works are required. All other stages should remain in Auto Mode.',
  },

  // ─── SYS-01: Move-Out Process in Dwelly ──────────────────────────────────

  {
    id: 'q-sys-01-1', moduleId: 'mvt-02',
    question: 'How do you manually create a move-out request in Dwelly?',
    options: [
      'Properties tab → find the property → Tenancy tab → + Create Move-Out',
      'Property Management tab → + Add Request → Move-Out Request → enter address, proposed date, and description → Create Job',
      'My Jobs → + Add Task → Move-Out → select property from dropdown',
      'Global Search → find tenancy → End Tenancy button',
    ],
    correct: 1,
    rationale: 'Manual move-out requests are created from Property Management tab → + Add Request → Move-Out Request → enter the property address, proposed move-out date, and a short description → click Create Job.',
  },
  {
    id: 'q-sys-01-2', moduleId: 'mvt-02',
    question: 'Why is it critical to keep the move-out date up to date in Dwelly?',
    options: [
      'It triggers automatic invoice cancellation on the move-out date',
      'Lettings Negotiators rely on this date to start the re-letting process',
      'It automatically notifies utility companies of the tenancy end date',
      'It locks the property from new maintenance jobs being raised',
    ],
    correct: 1,
    rationale: 'The move-out date in Dwelly gives Lettings Negotiators the visibility they need to begin remarketing the property. If the date is wrong or out of date, it directly delays the re-let and extends the void period.',
  },
  {
    id: 'q-sys-01-3', moduleId: 'mvt-02',
    question: 'What are the three property condition assessments available at checkout in Dwelly, and what do they mean?',
    options: [
      'Pass, Fail, Refer — determining whether the deposit is returned, withheld, or disputed',
      'Green (clean, full deposit return), Yellow (cleaning required — costs assigned), Red (damage found — repair costs calculated)',
      'Acceptable, Minor Issues, Major Issues — used to generate the deposit deduction report',
      'Completed, Partial, Outstanding — tracking which remedial works have been finished',
    ],
    correct: 1,
    rationale: 'The three condition options at checkout are: Green (property is clean and in previous condition — deposit returned in full), Yellow (property needs cleaning — cleaning costs are assigned), Red (damage found — repair costs are calculated and deducted from the deposit).',
  },
  {
    id: 'q-sys-01-4', moduleId: 'mvt-02',
    question: 'What does clicking "Tenancy Ended" in the move-out job do?',
    options: [
      'Closes the move-out job and archives all associated records',
      'Confirms the checkout inspection is complete and the report has been uploaded',
      'Stops invoice generation from that point onward — must be clicked promptly when the tenant vacates',
      'Releases the deposit back to the tenant automatically',
    ],
    correct: 2,
    rationale: '"Tenancy Ended" stops invoice generation from that point onward. It must be clicked promptly when the tenant physically vacates — it does not happen automatically, and failing to click it means the system continues generating rent invoices.',
  },
  {
    id: 'q-sys-01-5', moduleId: 'mvt-02',
    question: 'How does Dwelly calculate the deposit return amount?',
    options: [
      'The PM manually enters the return figure based on the checkout report',
      'Dwelly automatically calculates it based on the condition assessment and maintenance job payment allocations',
      'The figure is agreed between landlord and tenant outside the system and entered manually',
      'The deposit scheme calculates the return and sends the figure to Dwelly',
    ],
    correct: 1,
    rationale: 'Dwelly automatically calculates how much the tenant should receive from their deposit based on the property condition assessment selected and the maintenance jobs raised, with their payment allocations entered.',
  },
  {
    id: 'q-sys-01-6', moduleId: 'mvt-02',
    question: 'In the move-out job, what does "Mediation Finished" confirm?',
    options: [
      'The property is physically ready and can be shown to new applicants',
      'The financial side is resolved — the deposit return has been agreed and settled',
      'All key sets have been returned and the job can be permanently closed',
      'The final rent invoice has been generated and sent to the tenant',
    ],
    correct: 1,
    rationale: '"Mediation Finished" marks the financial/deposit side of the move-out as resolved — the deposit return has been agreed and settled. It is separate from "Property Ready" (the physical condition and re-let readiness) and from confirming all keys are returned, which is the step that finally closes the job.',
  },
  {
    id: 'q-sys-01-7', moduleId: 'mvt-02',
    question: 'What does the "Property Ready" button signify in the move-out job?',
    options: [
      'The deposit has been fully resolved and released to the tenant',
      'The physical condition of the property is complete — Lettings Negotiators can see it is ready for move-in',
      'All keys have been returned and the property is secured',
      'All compliance certificates at the property are current and valid',
    ],
    correct: 1,
    rationale: '"Property Ready" confirms the physical condition of the property is complete — it signals to Lettings Negotiators that the property can be shown and re-let. It is separate from Mediation Finished, which refers to the financial/deposit resolution.',
  },
  {
    id: 'q-sys-01-8', moduleId: 'mvt-02',
    question: 'What is the final action that permanently closes a move-out job in Dwelly?',
    options: [
      'Clicking "Mediation Finished" once the deposit is agreed',
      'Uploading the final invoice and marking the job complete',
      'Confirming all key sets have been returned, then clicking "Everything is ready"',
      'Requesting manager sign-off via the Assign Progress button',
    ],
    correct: 2,
    rationale: 'The final step is confirming all key sets have been returned. Only once keys are confirmed does Dwelly show the "Everything is ready" button. Clicking this permanently closes the move-out job — no further edits can be made after this point.',
  },

  // ─── SUP-02: Actioning the Support Task ───────────────────────────────────

  {
    id: 'q-sys-02-1', moduleId: 'sup-02',
    question: 'When a PM picks up a newly raised support task in Dwelly, what should they do first?',
    options: [
      'Close the task straight away if the request looks minor, so it does not clutter the workload',
      'Review the details and any attachments, confirm the request is correctly categorised as a support task, and acknowledge it so the requester knows it is being actioned',
      'Reassign it to the Maintenance flow without reading it, as support tasks are usually repairs in disguise',
      'Wait for the requester to chase before starting, in case the issue resolves itself',
    ],
    correct: 1,
    rationale: 'The first step in actioning a support task is to understand it: review the details and any attachments, confirm it genuinely belongs in the Support flow rather than Maintenance or Compliance, and acknowledge it so the requester knows it is in hand. Acknowledging early sets expectations and starts the audit trail; closing or ignoring a task before understanding it risks missing the real issue.',
  },
  {
    id: 'q-sys-02-2', moduleId: 'sup-02',
    question: 'A PM has several open support tasks at once. How should they decide which to action first?',
    options: [
      'Always work strictly oldest-first, regardless of what each task involves',
      'Prioritise by urgency and impact — for example a vulnerable tenant\'s welfare concern ahead of a routine document request — while keeping every task moving and updating expected timescales',
      'Action whichever tasks are quickest to close first, to keep the open-task count low',
      'Only action the tasks that the landlord or tenant has chased',
    ],
    correct: 1,
    rationale: 'Support tasks should be prioritised by urgency and impact, not simply by age or how quickly they can be closed. A vulnerable tenant\'s welfare concern outranks a routine document request. The PM should keep all tasks progressing and update requesters on realistic timescales rather than letting lower-priority items stall or cherry-picking the easy wins.',
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
    question: 'A support task will take longer to resolve than expected because the PM is waiting on a third party. What is best practice?',
    options: [
      'Say nothing to the requester until the task is fully resolved, to avoid raising concerns prematurely',
      'Update the task status and post a brief note in the job chat explaining the delay and the expected next step, so the requester has visibility',
      'Close the task now and reopen it once the third party responds',
      'Remove the task from the active list so it does not appear overdue',
    ],
    correct: 1,
    rationale: 'When a support task is delayed by a third party, the PM should keep the requester informed: update the task status and add a short job-chat note explaining the delay and the next step. Visibility maintains trust and a clear audit trail. Going silent, closing and reopening, or hiding the task all break that trail and leave the requester in the dark.',
  },
  {
    id: 'q-sys-02-5', moduleId: 'sup-02',
    question: 'Under the Renters\' Rights Act 2025, how much notice must a tenant give to end a tenancy, and when can they first serve it?',
    options: [
      'One month\'s written notice at any point during the tenancy',
      'Two months\' written notice, which cannot be served during the first four months of the tenancy',
      'One rental period\'s notice at any time after the first month',
      'Three months\' written notice, aligned with the new Ground 8 arrears threshold',
    ],
    correct: 1,
    rationale: 'Under the Renters\' Rights Act 2025, tenants on an Assured Periodic Tenancy can end the tenancy by serving two months\' written notice. However, they cannot serve this notice during the first four months of the tenancy — providing landlords with a minimum six-month occupancy. Landlords can no longer serve Section 21 notices and must rely on one of 37 Section 8 grounds to seek possession.',
  },
  {
    id: 'q-sys-02-6', moduleId: 'sup-02',
    question: 'Where in Dwelly would you find financial records and transaction history for a tenancy?',
    options: ['The Notes tab', 'The Deals tab', 'The Ledger', 'The Maintenance tab'],
    correct: 2,
    rationale: 'The Ledger holds all financial records for the property, landlord, and each individual tenant. Each tenant has their own tab within the Ledger showing transfers, payments, and transaction history.',
  },

  // ─── KNO-01: Dwelly Best Practice ─────────────────────────────────────────

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

  // ─── KNO-02: Repairs & Legal Responsibilities ─────────────────────────────

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

  // ─── KNO-03: Property Finances & the Ledger ──────────────────────────────

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

  // ── PORTALS — Tenant, Landlord & Maintenance Provider portals (kno-portals) ──
  // Tests knowledge of how the three external-facing portals work, so PMs can
  // set the right expectations with tenants, landlords and contractors.
  {
    id: 'q-kno-portals-1', moduleId: 'kno-portals',
    question: 'When does a tenant first get access to the Tenant Portal?',
    options: [
      'As soon as they enquire about the property',
      'Once first monies are paid',
      'When the tenancy agreement is signed but before any payment',
      'Only after they have physically moved in',
    ],
    correct: 1,
    rationale: 'Tenants receive access to the Tenant Portal once first monies are paid. Access is then authorised via the tenant\'s registered phone number, and only the main tenant receives the email containing the portal link.',
  },
  {
    id: 'q-kno-portals-2', moduleId: 'kno-portals',
    question: 'On which management type can a moved-in tenant submit a maintenance request through the Tenant Portal?',
    options: [
      'Fully Managed only',
      'Rent Collection only',
      'Let Only only',
      'All management types',
    ],
    correct: 0,
    rationale: 'Submitting a maintenance request through the portal is only available on Fully Managed properties, because maintenance is only handled by Dwelly under that arrangement. On Rent Collection or Let Only, repairs are the landlord\'s responsibility.',
  },
  {
    id: 'q-kno-portals-3', moduleId: 'kno-portals',
    question: 'Which Tenant Portal action is available to tenants regardless of how the property is managed?',
    options: [
      'Submitting a maintenance request',
      'Submitting a move-out request',
      'Approving contractor quotes',
      'Viewing the landlord\'s statements',
    ],
    correct: 1,
    rationale: 'Submitting a move-out request is available on Fully Managed, Rent Collection and Let Only. Submitting a maintenance request, by contrast, is Fully Managed only.',
  },
  {
    id: 'q-kno-portals-4', moduleId: 'kno-portals',
    question: 'A tenant reports a fault through the Tenant Portal. What happens in Dwelly?',
    options: [
      'The report sits in the portal until a PM manually copies it across',
      'Dwelly automatically creates a maintenance job and assigns it to the responsible Property Manager',
      'The landlord is emailed directly and the PM is not involved',
      'Nothing until the tenant also phones the office to confirm',
    ],
    correct: 1,
    rationale: 'When a tenant reports a fault in the portal, Dwelly automatically creates a maintenance job and assigns it to the responsible PM — a portal request is the same as a job landing in your queue.',
  },
  {
    id: 'q-kno-portals-5', moduleId: 'kno-portals',
    question: 'In the Landlord Portal, which of the three navigation buttons holds rental income statements and payment records?',
    options: ['Documents', 'Statements', 'Maintenance Requests', 'Portfolio'],
    correct: 1,
    rationale: 'The three blue buttons are Documents (guides, invoices, lease agreements), Statements (rental income statements, payment records and financial summaries) and Maintenance Requests (current jobs, statuses and past activity).',
  },
  {
    id: 'q-kno-portals-6', moduleId: 'kno-portals',
    question: 'A landlord asks you why they can\'t see the full detailed history of a maintenance job in their portal. What is the correct explanation?',
    options: [
      'Their portal access must be broken — raise a support ticket to fix it',
      'The portal only shows current jobs, their statuses and past activity; the detailed job history comes from you, not the portal',
      'Detailed history is hidden until the job is fully closed and invoiced',
      'Only managers can view job history, so they need to upgrade their account',
    ],
    correct: 1,
    rationale: 'Landlords cannot see the full job history through their portal — only current jobs, their statuses, and past activity. If a landlord wants the detailed history of a job, that comes from the PM, not the portal.',
  },
  {
    id: 'q-kno-portals-7', moduleId: 'kno-portals',
    question: 'Who can open a maintenance provider\'s portal from inside the Dwelly system, and where?',
    options: [
      'Any PM, from the job chat',
      'Only Team Coordinators, via Property Management → Service Providers',
      'Only admins, from the Settings page',
      'The provider themselves, by inviting a PM',
    ],
    correct: 1,
    rationale: 'Only Team Coordinators can open a provider\'s portal from inside Dwelly, via Property Management → Service Providers at the top of the page. If a contractor can\'t log in, point them at the office rather than resetting it yourself.',
  },
  {
    id: 'q-kno-portals-8', moduleId: 'kno-portals',
    question: 'In the provider portal, what does the job status "Quote Sent" mean?',
    options: [
      'The contractor has sent their final invoice and is awaiting payment',
      'A quote has gone to the landlord and we are waiting on their approval',
      'The visit has been booked and is waiting to take place',
      'The job is complete and just needs a compliance certificate',
    ],
    correct: 1,
    rationale: '"Quote Sent" means a quote from the contractor has gone to the landlord and Dwelly is waiting on their approval. This is why some jobs sit at this status while the landlord decides.',
  },
  {
    id: 'q-kno-portals-9', moduleId: 'kno-portals',
    question: 'At a maintenance visit, when can a contractor "Fix It Now" rather than submitting a quote?',
    options: [
      'Whenever they judge the repair to be urgent',
      'Only if the work is within the call-out fee, within an approved budget, or specifically approved by the office that day',
      'Any time the tenant is present and agrees to the work',
      'Never — all maintenance work requires a quote first',
    ],
    correct: 1,
    rationale: 'A contractor should only fix work on the spot when it\'s within the call-out fee, within an approved budget, or specifically approved by the office that day. Anything beyond that needs a quote and landlord approval before the work goes ahead.',
  },
  {
    id: 'q-kno-portals-10', moduleId: 'kno-portals',
    question: 'A tenant complains that a contractor "never called". Knowing how the provider portal works, what is the likely explanation?',
    options: [
      'The contractor forgot to call and should be reported',
      'The contractor reaches the tenant through the main office number plus an extension, not a direct line — so the call comes from the main Dwelly number',
      'The tenant\'s number is wrong and must be re-collected',
      'Contractors are not allowed to call tenants directly at all',
    ],
    correct: 1,
    rationale: 'Contractors call tenants via the main office number and the tenant\'s extension, not a direct line. The tenant should expect the call to come from the main Dwelly number, so a call they didn\'t recognise may well have been the contractor.',
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
    rationale: 'A property requiring a selective licence must not be marketed or let until the licence is in place. Letting an unlicensed property is a criminal offence for the landlord, exposes the agency, and undermines any possession proceedings. A pending application is not a licence — you must not publish until the licence is confirmed.',
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
    question: 'During an inspection, you notice the tenant has a dog and the tenancy agreement contains a no-pets clause. The tenant says they requested permission but have not received a formal response. What is the correct action under the Renters\' Rights Act 2025?',
    options: [
      'Document the finding in the inspection report, advise the landlord that the tenant has a statutory right to request a pet under the RRA 2025, and ensure the landlord formally responds in writing within 28 days — consent cannot be unreasonably withheld and any approval should be confirmed as a written deed of variation',
      'Accept the tenant\'s account and note it in the inspection report for the landlord to confirm at their convenience — no statutory right applies until the tenant has been in the property for 12 months',
      'Disregard the finding as a matter solely between the landlord and tenant — the agency\'s inspection role is limited to property condition',
      'Issue the tenant with a formal written notice to remove the pet within 14 days regardless of any pending request',
    ],
    correct: 0,
    rationale: 'Under the Renters\' Rights Act 2025, tenants have a statutory right to request permission to keep a pet. The landlord must respond in writing within 28 days and cannot unreasonably refuse. Document the observation, advise the landlord they must formally respond, and if consent is given formalise it as a written deed of variation. Issuing a removal notice without considering the statutory right may itself be unlawful.',
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
    question: 'The How to Rent guide has been replaced from 1 May 2026. What must landlords now provide to tenants at the start of a new tenancy?',
    options: [
      'A copy of the original How to Rent guide — it remains valid as a historical document for tenancies that pre-date May 2026',
      'The Renters\' Rights Act Information Sheet 2026, downloaded directly from GOV.UK immediately before serving to ensure the latest version is used',
      'A copy of the Renters\' Rights Act 2025 in full — the legislation itself acts as the prescribed information document',
      'No prescribed information document is required — the Renters\' Rights Act replaced the prescribed documentation regime entirely',
    ],
    correct: 1,
    rationale: 'From 1 May 2026, the How to Rent guide has been replaced by the Renters\' Rights Act Information Sheet 2026. Landlords must provide this document to tenants at the start of every new tenancy. Always download the latest version directly from GOV.UK rather than using saved copies — versions change. If a tenancy converts and the document has been updated since it was last served, re-issue the latest version.',
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

  // ── MASTER: Actioning Support Tasks & Tenant Support (sup-02) ─────────────

  {
    id: 'q-m-sup-02-1', moduleId: 'sup-02', tier: 'master',
    question: 'A landlord raises a support request that the PM cannot resolve within their own authority because it needs a policy decision from the agency. The landlord is pressing for an answer. What is the correct action?',
    options: [
      'Give the landlord a best-guess answer immediately to keep them satisfied, and correct it later if the policy turns out to be different',
      'Close the task as "cannot action" since it falls outside the PM\'s authority, and advise the landlord to take it up elsewhere',
      'Document what has been done so far, escalate to a senior team member or manager through the task, and keep the landlord informed of the status — without letting the task stall',
      'Leave the task open without escalating, on the basis that someone more senior will eventually notice it',
    ],
    correct: 2,
    rationale: 'When a support request exceeds the PM\'s authority, the task must not stall. The PM should record what has been done, escalate it through the task to a senior colleague or manager, and keep the landlord updated on where it stands. Guessing at a policy answer risks giving wrong information, closing it abdicates the agency\'s duty, and leaving it un-escalated means it simply drifts.',
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
    question: 'What must a PM ensure before marking a support task as complete in Dwelly?',
    options: [
      'Only that a reply of some kind has been sent to the requester',
      'That the requester\'s issue has actually been resolved or the agreed action taken, the outcome is documented in the job chat, and any necessary follow-up is scheduled',
      'That at least seven days have passed since the task was raised, regardless of progress',
      'That the task has been assigned to someone — assignment is the point at which a task can be closed',
    ],
    correct: 1,
    rationale: 'A support task should only be closed once the underlying issue is genuinely resolved or the agreed action has been carried out, the outcome is recorded in the job chat, and any follow-up is scheduled. Closing on the basis of a single reply, an elapsed timer, or mere assignment leaves the requester\'s problem unsolved and the record incomplete.',
  },

  // ── MASTER: Knowledge — Dwelly Best Practice (kno-01) ─────────────────────

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

  // ── MASTER: Knowledge — Repairs & Legal Responsibilities (kno-02) ─────────

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

  // ── MASTER: Knowledge — Property Finances & the Ledger (kno-03) ───────────

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

  // ── MASTER: Portals (kno-portals) ─────────────────────────────────────────
  {
    id: 'q-m-kno-portals-1', moduleId: 'kno-portals', tier: 'master',
    question: 'A tenant on a Rent Collection property phones, frustrated that the maintenance option is missing from their Tenant Portal and insisting Dwelly must fix "their broken boiler". What is the correct response?',
    options: [
      'Explain that maintenance is only handled by Dwelly on Fully Managed properties, so the missing option is expected on Rent Collection — direct the tenant to the landlord for the repair, and record the contact',
      'Raise a maintenance job on their behalf in Dwelly so the repair is captured, since a boiler fault is an emergency that overrides the management-type restriction on all arrangements',
      'Tell the tenant their portal access is faulty and log a support ticket to have the maintenance option re-enabled for their account as a priority fix',
      'Advise the tenant to submit a move-out request instead, as that is the only portal action available to them and it will prompt the landlord to act on the boiler',
    ],
    correct: 0,
    rationale: 'On Rent Collection and Let Only, submitting a maintenance request through the portal is deliberately unavailable — maintenance is only handled by Dwelly on Fully Managed properties. The missing option is expected, not a fault. The tenant should be directed to the landlord for repairs, and the contact recorded.',
  },
  {
    id: 'q-m-kno-portals-2', moduleId: 'kno-portals', tier: 'master',
    question: 'A landlord is angry that a repair "has had no progress for a week" and demands the full job history, which they say the Landlord Portal does not show. What is the best-practice handling?',
    options: [
      'Explain the portal only shows current jobs, their statuses and past activity — not the full detailed history — then pull the authorisation and communication trail from the job in Dwelly and talk the landlord through it yourself',
      'Tell the landlord the portal is the single source of truth, so if it shows no progress then no progress has been made, and open a complaint against the contractor',
      'Grant the landlord temporary elevated portal access so they can view the complete job history directly and reach their own conclusions',
      'Advise the landlord that detailed job history is confidential to Dwelly and the contractor, and cannot be shared with landlords under data protection rules',
    ],
    correct: 0,
    rationale: 'Landlords cannot see the full job history in their portal — only current jobs, statuses and past activity. The detailed history comes from the PM, not the portal. The right move is to explain that limit and then use the job record in Dwelly to talk the landlord through exactly what has happened.',
  },
  {
    id: 'q-m-kno-portals-3', moduleId: 'kno-portals', tier: 'master',
    question: 'A contractor says they attended a maintenance visit, found the work would exceed the call-out fee, and "just got on with it" to save time — now they have submitted an invoice far above the call-out fee. What went wrong and what happens next?',
    options: [
      'The contractor should only "Fix It Now" within the call-out fee, an approved budget, or with same-day office approval — without that, the work needed a quote and landlord approval first, so the excess cannot simply be paid and must be escalated and reviewed against the authorisation rules',
      'Nothing went wrong — contractors are trusted to use their judgement on the day, so the invoice should be processed in full to maintain the working relationship',
      'The contractor breached the rules, so the job should be closed with no payment at all and the contractor removed from the panel immediately',
      'The tenant authorised the work by letting the contractor in, so the tenant is liable for the portion of the invoice above the call-out fee',
    ],
    correct: 0,
    rationale: 'A contractor may only fix on the spot when the work is within the call-out fee, within an approved budget, or specifically approved by the office that day. Beyond that, a quote and landlord approval are required before work proceeds. An invoice above the call-out fee with no prior approval breaches that process and must be escalated and reviewed — not paid automatically.',
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

  // ── RECAP: Support Tasks & Tenant Support (sup-02) ─────────────────────────

  {
    id: 'q-r-sup-02-1', moduleId: 'sup-02', tier: 'recap',
    question: 'A tenant reports a significant water leak from the ceiling on a Saturday evening. The Dwelly auto-response has received the report. You cannot reach the landlord by phone or email. The estimated repair cost is £900 — above your emergency authorisation threshold of £500. What should you do?',
    options: [
      'Wait until Monday when the landlord can be reached before instructing any contractor — work above the authorisation threshold requires explicit landlord approval, and a ceiling leak does not meet the criteria for immediate emergency action without that authorisation',
      'Instruct an emergency contractor immediately and authorise up to the cost required to make safe — an uncontactable landlord during an active water leak does not remove the PM\'s duty to prevent damage. The authorisation limit applies to routine maintenance, not active emergencies causing structural damage',
      'Advise the tenant to turn off the water at the mains and wait for a contractor on Monday — the risk of spend above the threshold is the primary concern, and the tenant isolating the water supply means the situation does not meet the emergency threshold for independent overspend',
      'Contact the agency\'s out-of-hours duty manager and hand the decision to them — emergency spend decisions above the standard threshold must always be escalated rather than taken independently by the managing PM regardless of urgency',
    ],
    correct: 1,
    rationale: 'An active water leak causing ceiling damage is an emergency requiring immediate contractor instruction regardless of landlord unavailability. PMs have implied authority to authorise emergency works to prevent structural damage. Option 0 is critically wrong — waiting until Monday while water continues to cause damage prioritises a process rule over the landlord\'s property interest. Option 2 is wrong because isolating the water supply is a temporary measure, not a substitute for proper emergency repair.',
  },
  {
    id: 'q-r-sup-02-2', moduleId: 'sup-02', tier: 'recap',
    question: 'A tenant who is in dispute with the landlord over delayed repairs sends a formal Data Subject Access Request (DSAR) to the agency, asking for all records, communications, and internal notes held about them. What are the agency\'s obligations under UK GDPR?',
    options: [
      'The DSAR applies only to the tenant\'s personal contact details and payment records — internal communications, inspection notes, and internal job history are exempt from disclosure as agency business records rather than personal data about the individual',
      'Comply by providing all personal data held about the data subject within one calendar month — this includes relevant communications, inspection reports, and internal notes. Redact any third-party personal data and immediately escalate to the agency\'s data protection lead',
      'Request a reasonable fee before commencing the search — UK GDPR permits data controllers to charge an administrative fee for complex requests where large volumes of data must be retrieved and reviewed',
      'Advise the tenant that DSARs must be submitted directly to the landlord, not the managing agent — the agency processes data on the landlord\'s behalf as a data processor and carries no independent obligation to respond to individual data subject requests',
    ],
    correct: 1,
    rationale: 'Under UK GDPR, data subjects are entitled to receive all personal data held about them within one calendar month at no charge. This includes inspection reports, correspondence, and internal notes that contain personal data — assessments of the tenant\'s conduct, maintenance records attributed to them, and communications referencing them all constitute personal data. Option 0 is wrong because internal notes routinely contain personal data. Option 3 is wrong because managing agents typically act as joint data controllers, not purely as processors, and have independent GDPR obligations.',
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
      'The template must be reviewed for compliance with the Tenant Fees Act, Consumer Rights Act, and all prescribed information requirements — a non-standard AST may contain unlawful clauses or miss mandatory provisions, any of which could undermine possession proceedings or expose the agency to liability',
    ],
    correct: 3,
    rationale: 'A landlord\'s own AST template must be reviewed for legal compliance before it is used. It may contain unlawful clauses under the Tenant Fees Act or Consumer Rights Act, or omit mandatory prescribed information. Any defect could expose both landlord and agency to liability. The agency cannot simply disclaim responsibility for using a template it has agreed to manage under.',
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
      'Dwelly automatically creates a compliance job 30 days before the certificate expiry date, giving the PM lead time to arrange the check',
      'The landlord creates the compliance job through their portal when they receive a reminder email from the gas safety scheme',
      'Compliance jobs are only created when the local authority issues an enforcement notice for an expired certificate',
    ],
    correct: 1,
    rationale: 'Dwelly automatically generates compliance jobs 30 days before the certificate expiry date. This gives the PM sufficient lead time to contact the landlord, instruct a contractor, and complete the renewal before the existing certificate expires.',
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
      'Create a move-out job in Dwelly linked to the property, which triggers the structured move-out workflow covering all required steps from notice through to deposit return and the hand-over to Lettings for re-marketing',
      'Contact the landlord to confirm whether they want to re-let the property or withdraw it from management before any move-out actions are taken',
      'Book the checkout inspection with an external inventory clerk and notify the tenant of the inspection date',
    ],
    correct: 1,
    rationale: 'The first step is to create a move-out job in Dwelly linked to the property. This triggers the structured move-out workflow, which guides the PM through all required steps — from initial creation through key collection, checkout inspection, and deposit negotiation, before handing the property over to the Lettings team for re-marketing. Working outside the system creates gaps in the audit trail.',
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
    question: 'A tenant contacts the PM about a personal welfare concern that needs follow-up and signposting to external support services. How should this be handled in Dwelly?',
    options: [
      'Raise a support task so the concern is logged, assigned an owner, and tracked through to resolution with a full audit trail',
      'Deal with it informally over the phone and avoid creating any record, to respect the tenant\'s privacy',
      'Log it as a maintenance task so it appears alongside the PM\'s repair jobs in the daily list',
      'Refer it straight to the landlord, as tenant welfare matters are the landlord\'s responsibility rather than the agency\'s',
    ],
    correct: 0,
    rationale: 'Tenant welfare concerns are a non-maintenance, non-compliance activity, so they should be raised as a support task in Dwelly. This logs the concern, assigns an owner, and tracks the follow-up through to resolution while keeping a complete, timestamped audit trail — rather than relying on informal phone calls that leave no record or miscategorising it as a repair.',
  },
  {
    id: 'q-sys-02-n2', moduleId: 'sys-02',
    question: 'Which of the following is correctly handled as a support task rather than a maintenance or compliance job?',
    options: [
      'A landlord query about their management statement that needs investigating and a written response',
      'A broken boiler that has left the tenant without heating or hot water',
      'An expired gas safety certificate that needs renewing before the deadline',
      'A Category 1 electrical hazard flagged on the latest EICR',
    ],
    correct: 0,
    rationale: 'Support tasks cover non-maintenance, non-compliance activities — such as landlord queries, tenant welfare referrals, and general enquiries. A broken boiler is a maintenance job, while an expired gas certificate or a Category 1 electrical hazard are compliance matters. Correctly categorising the request ensures it follows the right workflow in Dwelly.',
  },
  {
    id: 'q-sys-02-n3', moduleId: 'sys-02',
    question: 'What types of tasks can be created using the Support flow in Dwelly?',
    options: [
      'Only landlord query tasks — all other support activities are managed through the Maintenance or Compliance flows',
      'Support tasks cover a range of non-maintenance, non-compliance requests including landlord queries, tenant welfare referrals, general enquiries, document requests, and other ad hoc property management tasks that need tracking',
      'Support tasks are exclusively for tenant complaints and must be escalated to a manager within 24 hours of creation',
      'Support tasks are used only for financial queries such as rent arrears, payment plans, and landlord statement disputes',
    ],
    correct: 1,
    rationale: 'The Support flow in Dwelly covers a broad range of property management requests that fall outside the Maintenance and Compliance flows. This includes landlord queries, tenant welfare referrals, general enquiries, document requests, and other ad hoc tasks. Creating support tasks ensures these requests are tracked, auditable, and visible in the PM\'s workload.',
  },
  {
    id: 'q-sys-02-n4', moduleId: 'sys-02',
    question: 'How should a PM keep the landlord updated on the progress of a support request?',
    options: [
      'Verbally during a phone call, with the outcome confirmed by the landlord sending a text message or WhatsApp reply',
      'Through the Dwelly job chat within the support task, providing a written summary of the request, the action taken, and the outcome — ensuring there is a documented, timestamped record',
      'By posting a letter to the landlord\'s registered address, as digital communication does not constitute a formal record',
      'Via the landlord portal only — PMs should not message the landlord directly but instead update the portal and wait for them to check it',
    ],
    correct: 1,
    rationale: 'Updates on a support request should be communicated through the Dwelly job chat within the relevant support task. This creates a documented, timestamped record of the request, the action taken, and the outcome. Keeping the conversation in the system protects the agency if there is any later query about what was done, whereas verbal updates alone leave no reliable record.',
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
    rationale: 'Linking support tasks to the correct property in Dwelly is essential for maintaining a complete audit trail. It ensures that all activity — landlord queries, tenant welfare referrals, and other support requests — is recorded against the property record. This means any PM who subsequently manages the property can see the full history, and reporting accurately reflects the property\'s management activity.',
  },

  // ── MNT-02: Actioning Maintenance — extra pool ────────────────────────────

  {
    id: 'q-mnt-02-n1', moduleId: 'mnt-02',
    question: 'When should a PM switch a maintenance job from Auto Mode to Pause or Manual Mode?',
    options: [
      'At the start of every job — all jobs should begin in Manual Mode to give the PM full control from the outset',
      'When the job requires human judgement at a specific decision point — such as a contractor query, landlord objection, or tenant access issue — that the system cannot resolve automatically',
      'Only when the landlord instructs them to pause — PMs should never manually override Auto Mode',
      'When a job has been open for more than 14 days without a visit date being agreed',
    ],
    correct: 1,
    rationale: 'Auto Mode handles routine steps so PMs can focus on decision points. PMs should switch to Pause or Manual only when a specific situation requires human intervention — an unresolved access issue, a contractor dispute, or a landlord query. Switching all jobs to Manual at the outset defeats the purpose of automation and significantly increases workload.',
  },
  {
    id: 'q-mnt-02-n2', moduleId: 'mnt-02',
    question: 'A contractor raises an invoice that is higher than the quote the landlord approved. What should the PM do?',
    options: [
      'Approve the invoice immediately to avoid delaying the contractor\'s payment and note the variance in the job chat',
      'Reject the invoice outright and close the job — contractors cannot invoice above the approved amount under any circumstances',
      'Do not approve the invoice — query the variance with the contractor, establish the reason, and obtain explicit landlord approval for the additional cost before processing payment',
      'Split the invoice in the Ledger so the approved amount is paid immediately and the balance is held in dispute',
    ],
    correct: 2,
    rationale: 'An invoice above the approved quote cannot be processed without explanation and renewed landlord authorisation. The PM must query the variance with the contractor (e.g. unforeseen additional works or materials), document the reason in the job chat, and obtain explicit landlord approval for the additional amount before any payment is processed.',
  },
  {
    id: 'q-mnt-02-n3', moduleId: 'mnt-02',
    question: 'What should a PM do when a landlord declines to authorise a repair that the PM believes is necessary?',
    options: [
      'Instruct the contractor regardless — the landlord\'s repairing obligation under Section 11 requires works to be carried out whether or not the landlord consents',
      'Close the job and take no further action as the landlord has the final say on all maintenance decisions',
      'Record the landlord\'s refusal in the job chat, advise the landlord clearly of any legal obligations or health and safety risks, and escalate internally if the repair is necessary to protect the tenant\'s habitability or safety',
      'Inform the tenant they should contact the landlord directly to resolve the matter',
    ],
    correct: 2,
    rationale: 'When a landlord refuses to authorise a repair, the PM must record the refusal in the job chat for audit purposes, advise the landlord of relevant legal obligations (such as Section 11 of the Landlord and Tenant Act 1985), and escalate internally if the property risks becoming uninhabitable or the refusal exposes the agency to liability.',
  },
  {
    id: 'q-mnt-02-n4', moduleId: 'mnt-02',
    question: 'A maintenance job in Auto Mode has returned to a PM\'s queue. What does this typically indicate?',
    options: [
      'The job was automatically completed by the system and is ready for archiving',
      'The contractor has submitted their invoice and is awaiting payment approval',
      'An automated step has completed or a deadline has been reached that requires the PM to make a decision before the job can progress further',
      'The landlord has sent a message through their portal that needs the PM\'s attention',
    ],
    correct: 2,
    rationale: 'When a job in Auto Mode returns to the PM\'s queue, it means either a step in the automated sequence has been completed and awaits the PM\'s next input, or a deadline (such as no provider response after repeated reminders) has been reached. The PM must review the job and take the appropriate next action to progress it.',
  },
  {
    id: 'q-mnt-02-n5', moduleId: 'mnt-02',
    question: 'What should a PM do if a tenant contacts them by phone to chase a repair already logged in Dwelly?',
    options: [
      'Close the current Dwelly job and create a new one flagged as urgent to move it to the top of the work queue',
      'Respond directly to the tenant outside Dwelly — this demonstrates better customer service than routing everything through the system',
      'Acknowledge the contact, log it as an internal note in the job chat, and update the tenant on the current status and expected next steps using Dwelly\'s communication tools',
      'Forward the tenant\'s concern to the contractor directly so they can manage the tenant\'s expectations independently',
    ],
    correct: 2,
    rationale: 'When a tenant chases a job, the PM should acknowledge the contact, record the chase as an internal note in the job chat, and communicate the current status back to the tenant through Dwelly. Responding outside the system creates an incomplete audit trail and breaks automated job progression.',
  },
  {
    id: 'q-mnt-02-n6', moduleId: 'mnt-02',
    question: 'After a maintenance visit is marked complete in Dwelly, the tenant reports the repair has not resolved the problem. What is the correct next step?',
    options: [
      'Advise the tenant to contact the contractor directly as the job is closed and no longer the agency\'s responsibility',
      'Reopen the original closed job to avoid creating unnecessary duplicate records in the system',
      'Create a new maintenance job in Dwelly linked to the same property, referencing the original job, and begin the contractor instruction process again',
      'Close the complaint as the contractor confirmed the job was complete — any further issues require a new specialist survey',
    ],
    correct: 2,
    rationale: 'When a completed repair has not resolved the issue, a new maintenance job must be created in Dwelly. Closed jobs should not be reopened as this disrupts the audit trail. The new job should reference the original job number so the history is clear, and the PM should consider whether the same contractor should be reinstructed or a second opinion obtained.',
  },

  // ── INS-02: Completing the Inspection — extra pool ────────────────────────

  {
    id: 'q-ins-02-n1', moduleId: 'ins-02',
    question: 'A PM arrives at a property for a scheduled inspection and the tenant refuses to allow entry. What is the correct response?',
    options: [
      'Use the spare key held by the agency to enter — the inspection was scheduled correctly with advance notice',
      'Leave the property, fully record the refused access in the job chat, and notify both the landlord and tenant. If the tenant continues to refuse, follow the tenancy breach process',
      'Cancel the inspection job and advise the landlord that inspections cannot take place as tenants always have the right to refuse',
      'Immediately issue a formal breach of tenancy notice as the tenant has no right to refuse entry after proper notice',
    ],
    correct: 1,
    rationale: 'While a tenant should allow access after proper notice, a PM must never enter a property against the tenant\'s will. The correct response is to leave, record the refused access in the job chat, notify the landlord and tenant, and consider formal breach notification if the tenant refuses a rescheduled inspection. Forcing entry would constitute trespass.',
  },
  {
    id: 'q-ins-02-n2', moduleId: 'ins-02',
    question: 'After completing an inspection where maintenance issues were identified, what must the PM do before closing the inspection job in Dwelly?',
    options: [
      'Close the inspection job immediately and raise maintenance jobs later when there is time to process them',
      'Add an internal note listing the issues and set the job to On Hold pending landlord review',
      'Select "Yes" for issues found, complete the Comment for LL field, upload the completed report, and create a separate maintenance job for each repair identified',
      'Send the landlord a direct email summarising the issues and attach the inspection report as a PDF',
    ],
    correct: 2,
    rationale: 'When issues are found, the correct workflow is: select "Yes", complete the Comment for LL field (automatically sent to the landlord), upload the completed inspection report, and create a separate maintenance job for each identified repair. Issues left inside the inspection job are not tracked as open maintenance tasks.',
  },
  {
    id: 'q-ins-02-n3', moduleId: 'ins-02',
    question: 'During a mid-term inspection, a PM notices signs suggesting additional occupants not named on the tenancy agreement. What should they do?',
    options: [
      'Confront the tenant during the inspection and demand they provide ID for any additional occupants immediately',
      'Ignore the observation — it is not the PM\'s role to question occupancy during a routine inspection',
      'Record the observation in the inspection report and as an internal note in the job chat, raise a support task to investigate, and notify the landlord — do not make accusations without establishing the facts',
      'Immediately serve a breach of tenancy notice and instruct the landlord\'s solicitor to commence possession proceedings',
    ],
    correct: 2,
    rationale: 'If unauthorised occupants are suspected, the PM must document the observation, raise a support task to investigate, and notify the landlord. Making direct accusations during the inspection without established facts risks harassment allegations. The correct process is to gather evidence and follow the tenancy breach process after the landlord has agreed on a course of action.',
  },
  {
    id: 'q-ins-02-n4', moduleId: 'ins-02',
    question: 'What is the purpose of the "Comment for LL" field in the Dwelly inspection report template?',
    options: [
      'Its content is automatically transmitted to the landlord when the inspection is submitted — it summarises the findings for the landlord',
      'It is an internal note only, visible to the PM team but not sent to the landlord',
      'It generates the tenant follow-up letter sent after the inspection',
      'It is used by the finance team to identify whether any works need to be invoiced',
    ],
    correct: 0,
    rationale: 'The Comment for LL field is specifically designed to communicate inspection findings to the landlord. When the inspection job is submitted in Dwelly, the content of this field is automatically sent to the landlord as part of the inspection notification. PMs must ensure the comment is clear, professional, and contains all relevant information about issues found.',
  },
  {
    id: 'q-ins-02-n5', moduleId: 'ins-02',
    question: 'Why is it mandatory to use the standard Dwelly inspection report template rather than a separate document or email?',
    options: [
      'Using the template is optional — some landlords prefer a bespoke format and PMs should accommodate this',
      'The template ensures consistent records across all properties, enables automated landlord notifications, creates a searchable audit trail within the property record, and allows condition comparisons across inspections over time',
      'The template is mandatory only for HMO properties — standard single-let inspections can use any format',
      'Using the template speeds up processing in the billing department as it auto-generates inspection fee invoices',
    ],
    correct: 1,
    rationale: 'Using the standard Dwelly inspection template is mandatory for all properties. It ensures consistent records, automates the landlord notification, and stores the report within the property\'s record so any PM can access the full inspection history. Storing reports outside Dwelly breaks the audit trail and prevents the system from functioning as a single source of truth.',
  },
  {
    id: 'q-ins-02-n6', moduleId: 'ins-02',
    question: 'During a mid-term inspection, a PM discovers an unauthorised pet that is not permitted under the tenancy agreement. What is the correct response?',
    options: [
      'Tell the tenant to remove the pet immediately during the inspection and take photos as evidence',
      'Record the observation with photographic evidence in the inspection report, note it as an internal note in the job chat, raise a support task to notify the landlord and agree next steps, then communicate formally with the tenant',
      'Advise the landlord verbally at the next phone call and mark the inspection as passing since the pet is not a maintenance issue',
      'Consult the tenancy agreement first — if it is silent on pets, no action is required',
    ],
    correct: 1,
    rationale: 'An unauthorised pet must be documented thoroughly and reported to the landlord via a support task. The landlord should decide how to proceed: granting retrospective permission or issuing a formal breach notice. The PM should communicate formally with the tenant only after the landlord has agreed a course of action. Acting unilaterally during the inspection risks escalating the situation inappropriately.',
  },

  // ── MVT-02: Completing the Move-Out — extra pool ──────────────────────────

  {
    id: 'q-mvt-02-n1', moduleId: 'mvt-02',
    question: 'What is the role of the check-in inventory when assessing deposit deductions at the end of a tenancy?',
    options: [
      'The check-in inventory only confirms the tenant received the property in good condition — it has no bearing on deposit deductions',
      'It establishes the baseline condition of the property at the start of the tenancy, allowing fair comparison with the checkout report to identify genuine damage beyond fair wear and tear',
      'The check-in inventory automatically calculates the maximum deposit deduction allowed based on the property\'s initial condition score',
      'Check-in inventories are only relevant for HMOs — single-let properties rely solely on the checkout report',
    ],
    correct: 1,
    rationale: 'The check-in inventory is the baseline against which the property\'s condition at checkout is measured. Without a detailed check-in inventory, it is impossible to prove that any damage was caused by the tenant rather than being pre-existing. A comprehensive check-in inventory with photos is essential for protecting the landlord\'s position in any deposit dispute.',
  },
  {
    id: 'q-mvt-02-n2', moduleId: 'mvt-02',
    question: 'What does clicking "Mediation Finished" in the Dwelly move-out job signify?',
    options: [
      'The property has been physically cleaned and is ready for the next tenant to view',
      'The landlord and tenant have reached agreement on the deposit return amount (or the scheme has completed adjudication) and the financial element of the move-out is resolved',
      'The checkout inspection has been completed and the report has been successfully uploaded',
      'All outstanding maintenance work identified at checkout has been completed',
    ],
    correct: 1,
    rationale: '"Mediation Finished" in the Dwelly move-out workflow refers specifically to financial resolution — when the landlord and tenant have agreed how the deposit is to be distributed, or the deposit scheme\'s adjudication has concluded. It is separate from "Property Ready", which refers to the physical condition of the property. Both must be completed before the move-out job can be fully closed.',
  },
  {
    id: 'q-mvt-02-n3', moduleId: 'mvt-02',
    question: 'A tenant vacates the property but leaves several items of furniture behind. What should the PM do?',
    options: [
      'Arrange for the items to be removed and disposed of immediately, deducting the clearance cost from the deposit',
      'Leave the items in the property and re-let with them included — tenants cannot retrieve belongings after returning their keys',
      'Document the abandoned items with photographs immediately, notify the landlord, serve the appropriate notice to the tenant regarding abandoned goods, and retain evidence of all steps taken before any disposal',
      'Contact the local council to collect the items — abandoned goods are outside the agency\'s remit',
    ],
    correct: 2,
    rationale: 'Items left behind are "abandoned goods" under the Torts (Interference with Goods) Act 1977. The PM cannot simply dispose of them — the tenant must be formally notified and given reasonable time to collect their belongings. All steps must be documented with photographs and written notices. Only after the prescribed process has been followed can uncollected items be disposed of.',
  },
  {
    id: 'q-mvt-02-n4', moduleId: 'mvt-02',
    question: 'What information must a PM record in Dwelly when confirming key handover at move-out?',
    options: [
      'Only the number of keys returned — key condition is not relevant for the move-out record',
      'The number and type of all keys and access fobs returned, the date and time of handover, who returned them, and confirmation that all key sets are fully accounted for',
      'Key handover does not need to be recorded in Dwelly — a verbal confirmation from the tenant is sufficient',
      'A note in the job chat confirming at least one front door key has been returned',
    ],
    correct: 1,
    rationale: 'A complete key record at move-out must capture the number and type of all keys and access fobs returned, the exact date and time of handover, the name of the person who returned them, and confirmation that all key sets — including any held by the landlord directly — are fully accounted for. This is required before the "Everything is ready" step can be completed in Dwelly.',
  },
  {
    id: 'q-mvt-02-n5', moduleId: 'mvt-02',
    question: 'When should a PM proceed to a formal deposit dispute through the deposit protection scheme?',
    options: [
      'As soon as the tenancy ends — all deposit matters should be resolved through the scheme to avoid direct negotiation',
      'Immediately after the checkout report is uploaded, as the scheme requires 28 days to process any claim',
      'Only after direct negotiation between the landlord and tenant has broken down — the scheme\'s dispute resolution service should be a last resort after good-faith negotiation',
      'Only if the tenant owes more than one month\'s deposit — minor deductions should be handled informally',
    ],
    correct: 2,
    rationale: 'Most deposit disputes are resolved through direct negotiation facilitated by the PM. The deposit scheme\'s adjudication service exists for cases where agreement cannot be reached. PMs should always attempt a negotiated resolution first — it is faster, less adversarial, and preserves relationships. Escalating directly to adjudication without attempting negotiation is poor practice.',
  },
  {
    id: 'q-mvt-02-n6', moduleId: 'mvt-02',
    question: 'When should a PM begin the re-marketing process for a property during the move-out period?',
    options: [
      'Re-marketing cannot begin until "Tenancy Ended" has been clicked and the checkout report is uploaded',
      'As soon as the PM is aware of the forthcoming vacancy — discuss strategy with the landlord, update the property\'s marketing status in Dwelly, and notify the Lettings team through the move-out job to minimise the void period',
      'Re-marketing is solely the Lettings team\'s responsibility — Property Managers should not be involved',
      'Properties can only be re-marketed once the deposit is fully resolved and "Mediation Finished" has been clicked',
    ],
    correct: 2,
    rationale: 'At Dwelly, re-marketing and reletting sit with the Lettings team, not the Property Manager. The PM\'s remit covers the move-out process itself (checkout, deposit, closing down the tenancy) but does not extend to marketing the property or finding new tenants — that is the Lettings team\'s responsibility.',
  },

  // ── SUP-02: Actioning the Support Task — extra pool ───────────────────────

  {
    id: 'q-sup-02-n1', moduleId: 'sup-02',
    question: 'A tenant has chased the same support task twice because they have had no response. What does this indicate, and what should the PM do?',
    options: [
      'Nothing needs to change — the task is already logged in Dwelly, so repeated chases can be left until the PM next reviews their list',
      'It indicates a communication gap — the PM should respond promptly, acknowledge the delay, give a realistic timescale, and make sure the task status reflects reality from then on',
      'The task should be closed to stop the chases, and the tenant told to raise a fresh task if they still need help',
      'The chases should be escalated to the landlord, as repeated tenant contact is the landlord\'s responsibility to manage',
    ],
    correct: 1,
    rationale: 'Repeated chasing is a signal that the requester has been left without an update. The PM should respond promptly, acknowledge the delay, give a realistic timescale, and keep the task status accurate going forward. Ignoring the chases, closing the task to silence them, or bouncing the tenant to the landlord all damage trust and leave the underlying request unresolved.',
  },
  {
    id: 'q-sup-02-n2', moduleId: 'sup-02',
    question: 'While actioning a support task, the PM realises the request is actually a maintenance issue — the tenant has reported a faulty boiler. What should they do?',
    options: [
      'Resolve the boiler informally within the support task, since it has already been opened and the tenant is waiting',
      'Raise the appropriate maintenance job so it follows the correct workflow, note the link in the support task, and update the tenant on what happens next',
      'Close the support task and tell the tenant to report the boiler again through the right channel',
      'Leave the request unactioned, as a boiler fault is not what the support task was opened for',
    ],
    correct: 1,
    rationale: 'A repair belongs in the Maintenance flow, where it follows the correct workflow for contractor instruction, authorisation, and tracking. The PM should raise the maintenance job, cross-reference it in the support task, and keep the tenant informed — rather than bodging the repair through a support task, bouncing the tenant back to square one, or ignoring it.',
  },
  {
    id: 'q-sup-02-n3', moduleId: 'sup-02',
    question: 'Why is it important to record the actions taken and the final outcome when actioning a support task?',
    options: [
      'Recording is only necessary for support tasks that involve a financial transaction',
      'It creates a complete, timestamped audit trail so any colleague can see what was done, protects the agency in a dispute, and ensures continuity if the property later changes hands',
      'Only the final outcome needs recording — the individual steps taken along the way are not relevant',
      'Recording is optional once the requester has confirmed they are happy with the result',
    ],
    correct: 1,
    rationale: 'Documenting the steps taken and the outcome of a support task creates a complete, timestamped audit trail. This lets any colleague pick the history up, protects the agency if a dispute arises, and preserves continuity when a property changes hands. Recording is not limited to financial tasks, the steps matter as much as the outcome, and it is never optional just because the requester is currently satisfied.',
  },
  {
    id: 'q-sup-02-n4', moduleId: 'sup-02',
    question: 'A tenant contacts the PM to say they want to end their tenancy and move out. What should the PM advise?',
    options: [
      'The tenant must obtain the landlord\'s agreement before they can leave — ending a tenancy always requires both parties to sign a mutual surrender',
      'The tenant should serve two months\' written notice expiring at the end of a rent period — the tenancy ends automatically once the notice period expires and no landlord consent is required',
      'The tenant can leave without any notice at any time — there is no minimum notice requirement for tenants on a periodic tenancy',
      'The PM should raise a support task and negotiate an early surrender with the landlord on the tenant\'s behalf',
    ],
    correct: 1,
    rationale: 'Under the Renters\' Rights Act 2025 (in force 1 May 2026), all tenancies are Assured Periodic Tenancies. Tenants have a statutory right to end the tenancy at any time by serving two months\' written notice, expiring at the end of a rent period — no landlord consent is needed. The one restriction is that tenants cannot serve notice during the first four months of the tenancy. The PM should confirm the notice is in writing and note the end date for move-out planning.',
  },
  {
    id: 'q-sup-02-n5', moduleId: 'sup-02',
    question: 'A PM finds two open support tasks covering the same landlord query. What is the correct way to handle this?',
    options: [
      'Action both tasks separately to be safe, even though they cover the same query',
      'Consolidate the work into one task as the single record, cross-reference and close the duplicate with an explanatory note, so there is one clear audit trail',
      'Delete one of the tasks entirely so only a single record remains',
      'Leave both open and let the requester decide which one they want progressed',
    ],
    correct: 1,
    rationale: 'Duplicate tasks should be consolidated: keep one as the live record, close the duplicate with a note cross-referencing the one being progressed, and continue the work there. This maintains a single, clear audit trail. Working both wastes effort and risks conflicting updates, deleting a task destroys the record, and leaving both open creates confusion.',
  },
  {
    id: 'q-sup-02-n6', moduleId: 'sup-02',
    question: 'A PM with several open support tasks is about to go on leave for two weeks. What should they do?',
    options: [
      'Close all open support tasks before leaving and ask requesters to raise them again on the PM\'s return',
      'Make sure each task\'s status and next steps are clearly documented in the job chat and arrange cover so the tasks keep progressing while the PM is away',
      'Leave the tasks exactly as they are, since they are already logged in Dwelly and will be waiting on return',
      'Set an out-of-office reply and resume all tasks personally once back, with no cover arranged',
    ],
    correct: 1,
    rationale: 'Support tasks should not stall because a PM is on leave. Before going away, the PM should document each task\'s current status and next steps in the job chat and arrange cover so progress continues. Closing tasks forces requesters to start over, and simply leaving them untouched means tenants and landlords go two weeks without a response.',
  },

  // ── KNO-01: Dwelly Best Practice — extra pool ─────────────────────────────

  {
    id: 'q-kno-01-n1', moduleId: 'kno-01',
    question: 'What is best practice when communicating a difficult recommendation to a landlord — such as suggesting a rent reduction to retain a good tenant?',
    options: [
      'Avoid raising difficult topics unless the landlord asks — unsolicited advice creates unnecessary conflict',
      'Present the relevant market data, the specific risk of vacancy, and a clear recommendation framed around the landlord\'s commercial interests rather than as a personal opinion',
      'Delegate difficult conversations to a senior colleague whenever possible to preserve the relationship',
      'Send a brief email with the recommendation only — detailed explanations create more questions',
    ],
    correct: 1,
    rationale: 'Difficult conversations are most effective when commercially framed and evidence-based. A PM who presents comparable rents, the cost of a void versus a small reduction, and a clear recommendation demonstrates professionalism and is more likely to achieve the right outcome. Avoiding difficult topics or under-explaining damages trust over time.',
  },
  {
    id: 'q-kno-01-n2', moduleId: 'kno-01',
    question: 'A landlord calls very upset claiming a repair has not been progressed and threatening to leave. How should the PM respond?',
    options: [
      'Escalate to a manager immediately without explaining the situation to the landlord — upset clients should always be handled by senior staff',
      'Apologise unconditionally and offer a management fee reduction before investigating whether the complaint is justified',
      'Acknowledge the landlord\'s frustration, review the job history in Dwelly before or during the call to establish the facts, explain clearly what has happened and what is being done, and follow up in writing via the job chat',
      'Advise the landlord that all complaints must be made in writing before they can be investigated',
    ],
    correct: 2,
    rationale: 'When handling a complaint, acknowledge the frustration without admitting fault before checking the facts. Reviewing the Dwelly job history allows the PM to give an accurate, informed response. Offering refunds or escalating without understanding the situation first is reactive and may create unnecessary liability. Following up in writing creates an audit trail.',
  },
  {
    id: 'q-kno-01-n3', moduleId: 'kno-01',
    question: 'Why is it important to set clear expectations with a tenant at the start of a maintenance job about timescales and next steps?',
    options: [
      'Expectation setting is unnecessary for repairs resolved within 48 hours — tenants don\'t need managing for routine work',
      'Clear expectations prevent unnecessary chase calls, reduce tenant frustration, build trust in the service, and give the PM a defined framework for follow-up communication',
      'Expectations should only be set by the Lettings team at tenancy start — PM communication should be reactive',
      'Expectations should be kept deliberately vague so the agency is not held to commitments affected by contractor availability',
    ],
    correct: 1,
    rationale: 'Setting expectations at the outset — "we will be in touch within 48 hours with contractor details" — dramatically reduces incoming chase calls and demonstrates proactive service. Tenants who know what to expect are less likely to escalate. This is a core part of Dwelly\'s property management best practice.',
  },
  {
    id: 'q-kno-01-n4', moduleId: 'kno-01',
    question: 'What does it typically indicate if a PM has a high volume of jobs sitting in Pause Mode?',
    options: [
      'The PM is highly efficient — Pause Mode allows deferring non-urgent tasks until there is capacity',
      'It suggests jobs are awaiting the PM\'s action — responses, approvals, or decisions that haven\'t been made — rather than running smoothly in Auto Mode',
      'A high Pause count is normal — Auto Mode is only suitable for simple jobs; complex ones always require Pause',
      'It is a positive sign showing the PM is actively managing each job rather than relying on automation',
    ],
    correct: 1,
    rationale: 'A high volume of Pause Mode jobs typically indicates that jobs are awaiting the PM\'s action — responses, approvals, or decisions that haven\'t been made. Top-performing PMs keep the majority of jobs in Auto Mode, with jobs only sitting in Pause when genuinely waiting for a specific response. A large Pause queue suggests the PM may be behind on their workflow.',
  },
  {
    id: 'q-kno-01-n5', moduleId: 'kno-01',
    question: 'When dealing with a highly distressed tenant upset about a maintenance issue, what is the most important first step?',
    options: [
      'Immediately promise a specific resolution date to de-escalate the situation',
      'Acknowledge the tenant\'s distress and demonstrate empathy before moving to practical next steps — emotional acknowledgement must come before problem-solving',
      'Redirect the tenant to the tenant portal and explain they should submit all requests formally',
      'Transfer the call to a manager immediately as distressed tenants are outside the PM\'s remit',
    ],
    correct: 1,
    rationale: 'When a tenant is distressed, the most effective first step is to acknowledge their feelings before addressing practical matters. Jumping straight to solutions without recognising the emotional component makes the tenant feel unheard and often escalates the situation. Once acknowledged, tenants are far more receptive to hearing about the steps being taken.',
  },
  {
    id: 'q-kno-01-n6', moduleId: 'kno-01',
    question: 'Why should a PM avoid making specific repair completion date commitments to a tenant when a contractor has been instructed?',
    options: [
      'Because contractors are paid on a fixed-fee basis and completion dates affect how fees are calculated',
      'Because promising dates the PM cannot control creates a direct failure point — if the contractor doesn\'t deliver, the agency has broken an explicit commitment, damaging trust and potentially creating liability',
      'Commitments should always be made in writing anyway — verbal commitments are unenforceable',
      'Because tenants are legally entitled to compensation if a committed repair date is missed, regardless of reason',
    ],
    correct: 1,
    rationale: 'Committing to specific completion dates on behalf of contractors creates a promise the PM cannot directly control. If the contractor fails to deliver, the agency has broken an explicit commitment to the tenant, significantly damaging the relationship and potentially creating grounds for a service complaint. Best practice is to give timescales ("within 5–7 working days") rather than specific dates, and to update proactively if delays occur.',
  },

  // ── KNO-02: Repairs & Legal Responsibilities — extra pool ─────────────────

  {
    id: 'q-kno-02-n1', moduleId: 'kno-02',
    question: 'A tenant sends a formal letter stating they intend to pursue a disrepair claim because a heating issue has been unresolved for 3 months. What should the PM do immediately?',
    options: [
      'Ignore the letter unless it comes from a solicitor — informal tenant letters have no legal standing',
      'Review the job history in Dwelly to establish the full timeline, notify the landlord immediately, escalate internally, and progress the repair as a matter of urgency',
      'Send the tenant a letter explaining that the landlord\'s obligations are limited under the current tenancy agreement',
      'Advise the tenant to contact a housing charity as disrepair matters are outside the PM\'s remit',
    ],
    correct: 1,
    rationale: 'A formal disrepair letter requires immediate action. The PM must review the Dwelly job history to understand the full timeline, notify the landlord, escalate internally, and urgently progress the repair. The timestamped record of every action taken is the evidence that will defend the claim if it escalates.',
  },
  {
    id: 'q-kno-02-n2', moduleId: 'kno-02',
    question: 'Why is responding to repair reports within SLA timeframes critical in the context of disrepair claims?',
    options: [
      'SLA compliance only matters for statistical reporting — it has no legal or practical significance for individual properties',
      'Delays beyond SLA timeframes are evidence of failure to act promptly, which can significantly strengthen a disrepair claim and demonstrate a breach of the landlord\'s repairing obligations',
      'SLA timeframes are targets rather than obligations — landlords and tenants understand repairs sometimes take longer',
      'SLA compliance is only relevant for commercial properties',
    ],
    correct: 1,
    rationale: 'In disrepair claims, the timeline of reported issues and responses is critical evidence. Delays beyond the expected SLA for a given urgency category demonstrate a failure to act with reasonable promptness. Adjudicators and courts compare the speed of response against what would be expected — consistently meeting SLAs is the agency\'s strongest defence.',
  },
  {
    id: 'q-kno-02-n3', moduleId: 'kno-02',
    question: 'What is the significance of a Category 2 hazard under the Housing Health and Safety Rating System (HHSRS)?',
    options: [
      'Category 2 hazards are less serious than Category 1 but still pose a risk — local authorities have the power (but not the duty) to act, and landlords should address them promptly before they escalate',
      'Category 2 hazards are minor cosmetic issues requiring no action by either the landlord or local authority',
      'Category 2 hazards automatically require remedial works within 28 days under statutory enforcement',
      'Category 2 hazards are only relevant to HMO properties — standard residential lets are exempt',
    ],
    correct: 0,
    rationale: 'Under the HHSRS, Category 2 hazards pose a less serious (but real) risk to occupant health or safety. Local authorities have discretionary power to act — not a duty as with Category 1 hazards. However, landlords should not ignore them: unaddressed Category 2 hazards can become Category 1 issues, and failure to act can still be relevant evidence in a disrepair claim.',
  },
  {
    id: 'q-kno-02-n4', moduleId: 'kno-02',
    question: 'What is the Pre-Action Protocol for Housing Conditions Claims and why is it relevant for property managers?',
    options: [
      'It is an internal Dwelly process PMs must complete before instructing contractors for major works',
      'It is a court-prescribed process tenants must follow before issuing disrepair proceedings — requiring formal written notice to the landlord/agent and a reasonable opportunity to inspect and carry out repairs before court action commences',
      'It is a protocol set by the landlord\'s insurer that must be followed before any disrepair claim can be covered',
      'It only applies after court proceedings have started — it has no impact on the pre-litigation stage',
    ],
    correct: 1,
    rationale: 'The Pre-Action Protocol for Housing Conditions Claims is a court-required process tenants (often via solicitors) must follow before issuing disrepair proceedings. The tenant notifies the landlord/agent in writing, gives them the opportunity to inspect, and sets a reasonable deadline for repairs. A prompt, evidenced response to a pre-action letter — documented in the job chat — can prevent the matter from reaching court.',
  },
  {
    id: 'q-kno-02-n5', moduleId: 'kno-02',
    question: 'How should a PM handle a damp and mould report where the landlord believes it is caused by the tenant\'s lifestyle rather than a structural defect?',
    options: [
      'Advise the tenant the damp is their responsibility and close the job with a note confirming the landlord\'s position',
      'Inspect the property promptly, document the damp thoroughly, assess whether the cause is structural or lifestyle-related (recognising both may contribute), progress any necessary works, and advise both parties professionally — attributing blame without evidence is high-risk',
      'Close the job immediately as lifestyle-induced damp is not a maintenance obligation under Section 11',
      'Send the tenant a formal warning that lifestyle-induced damp may lead to deposit deductions at checkout',
    ],
    correct: 1,
    rationale: 'Damp and mould must be treated seriously. Attributing all damp to lifestyle without investigation is a high-risk position, particularly following heightened awareness since Awaab Ishak\'s case. The correct approach is to inspect promptly, document thoroughly, establish the cause with appropriate expertise, and take proportionate action. Landlords who dismiss damp as a tenant lifestyle issue without evidence face significant legal and reputational risk.',
  },
  {
    id: 'q-kno-02-n6', moduleId: 'kno-02',
    question: 'What is the key feature of Section 11 repairing obligations that makes them particularly significant in disrepair claims?',
    options: [
      'They give tenants the right to withhold rent until repairs are carried out, regardless of response speed',
      'They impose a statutory duty on landlords to maintain the structure, exterior, and services of the property — and cannot be contracted out of, meaning any tenancy clause purporting to remove this obligation is void',
      'They apply only to commercial leases — residential tenancies are governed by separate obligations in the Housing Act 2004',
      'They require the landlord to maintain only items specifically listed in the tenancy agreement',
    ],
    correct: 1,
    rationale: 'Section 11 of the Landlord and Tenant Act 1985 imposes a mandatory duty on landlords to maintain the structure, exterior, and services (water, gas, electricity, heating) of any residential property let for less than 7 years. Crucially, this obligation cannot be contracted out of — any tenancy term that attempts to pass this obligation to the tenant is void. Disrepair claims typically rely on Section 11 as the underlying legal obligation.',
  },

  // ── KNO-03: Property Finances & the Ledger — extra pool ───────────────────

  {
    id: 'q-kno-03-n1', moduleId: 'kno-03',
    question: 'What is the difference between the Landlord Ledger and the Tenant Ledger in Dwelly?',
    options: [
      'The two ledgers are identical views of the same financial data — the labels are just for navigation',
      'The Landlord Ledger records payments to and from the landlord (rent received, disbursements, fees, invoices). The Tenant Ledger records the tenant\'s rent charges and payments, showing any arrears or credit balance',
      'The Landlord Ledger is only visible to managers — PMs can only access the Tenant Ledger',
      'The Tenant Ledger only shows the current month\'s transactions — historical data is held in the Landlord Ledger',
    ],
    correct: 1,
    rationale: 'The Landlord Ledger records all financial activity between the agency and the landlord — rent received, management fees, maintenance invoices, and disbursements. The Tenant Ledger shows the tenant\'s account: their rent schedule, payments made, and any outstanding or credit balance. Understanding both is essential for handling landlord and tenant financial queries.',
  },
  {
    id: 'q-kno-03-n2', moduleId: 'kno-03',
    question: 'A landlord queries why their disbursement this month is lower than their rental income. What should the PM check first?',
    options: [
      'The Maintenance tab — lower disbursements are always caused by unpaid maintenance invoices',
      'The Ledger — check for management fees charged, maintenance invoices deducted, or any reserves held, and be ready to explain each line item clearly',
      'The Deals tab — it holds a summary of all deductions from the current month\'s disbursement',
      'The tenant\'s payment history — a lower disbursement usually means the tenant only made a partial payment',
    ],
    correct: 1,
    rationale: 'When a landlord queries their disbursement, the first step is to review the Ledger. It shows every charge, deduction, and credit on the landlord\'s account — management fees, maintenance invoices, compliance costs, and any reserves. The PM must be able to explain each line item clearly before calling the landlord.',
  },
  {
    id: 'q-kno-03-n3', moduleId: 'kno-03',
    question: 'What does a negative (credit) balance in a tenant\'s Dwelly ledger indicate?',
    options: [
      'The tenant is in arrears and owes money to the landlord',
      'The tenant has overpaid and has a credit on their account — typically carried forward to offset the next rent charge',
      'The tenant has been refunded their deposit and this has been recorded in the ledger',
      'A negative balance always indicates a system error and should be flagged to the finance team immediately',
    ],
    correct: 1,
    rationale: 'A negative (credit) balance in a tenant\'s ledger means the tenant has paid more than has been charged — giving them a credit. This commonly arises when a tenant pays in advance or if a payment reversal creates a credit. The credit balance is typically carried forward and offset against the next rent charge. It does not indicate arrears.',
  },
  {
    id: 'q-kno-03-n4', moduleId: 'kno-03',
    question: 'A tenant claims they have paid their rent but it is not showing in their Dwelly ledger. What should the PM do?',
    options: [
      'Tell the tenant the payment must not have been made and ask them to pay again immediately',
      'Ask the tenant for proof of payment, check the ledger for recent unallocated transactions, and liaise with the finance team if the payment is not visible within the expected clearing time',
      'Raise a maintenance job in Dwelly to report the missing payment to the technical team',
      'Advise the tenant to contact their bank as all payment issues are between the tenant and their bank',
    ],
    correct: 1,
    rationale: 'Payments can take time to clear and allocate. The correct response is to ask the tenant for proof of payment, review the Dwelly ledger for any unallocated transactions, and liaise with the finance team if the payment is not visible within the expected timeframe. Telling a tenant who has paid to pay again risks a double-payment dispute and is poor practice.',
  },
  {
    id: 'q-kno-03-n5', moduleId: 'kno-03',
    question: 'What is a landlord statement in Dwelly, and when is it typically generated?',
    options: [
      'A compliance document generated annually certifying all certificates are in date',
      'A monthly financial document summarising rent received, management fees deducted, contractor invoices paid, and the net amount disbursed to the landlord for the period',
      'Generated automatically whenever a maintenance invoice is approved, showing only that job\'s contractor costs',
      'Issued only when the landlord requests one — it is not generated automatically',
    ],
    correct: 1,
    rationale: 'A landlord statement is a monthly financial summary produced from the Ledger showing all income and expenditure: rent received, management fees, maintenance costs, and the net disbursement. Understanding how to read and explain a landlord statement is a core PM skill — all figures should be reconcilable against the Ledger entries.',
  },
  {
    id: 'q-kno-03-n6', moduleId: 'kno-03',
    question: 'What should a PM do if they identify an incorrect charge on a landlord\'s Dwelly account?',
    options: [
      'Wait for the landlord to raise the discrepancy themselves before investigating — raising it proactively may cause unnecessary concern',
      'Remove the charge from the ledger independently to resolve it quickly before the next statement runs',
      'Flag the discrepancy to the finance team immediately with supporting evidence, and proactively notify the landlord of the error and the steps being taken to correct it',
      'Issue a manual credit note in the ledger to offset the charge and note the adjustment in the job chat',
    ],
    correct: 2,
    rationale: 'If a PM identifies an incorrect charge, they must flag it to the finance team immediately — adjusting ledger entries independently without authorisation is not permitted. The PM should also proactively notify the landlord rather than waiting for them to discover it. Proactive error correction builds trust and demonstrates integrity.',
  },

  // ─── CRM 2.0 learning space quizzes ───────────────────────────────────────
  // Questions for the private CRM 2.0 lessons (lib/crm2-content.ts). Module ids
  // use the `crm2-<slug>` scheme and are surfaced via the quiz route's crm2
  // branch, which is gated to the same allow-list as the lessons themselves.

  // crm2-how-it-works
  {
    id: 'q-crm2-hiw-1', moduleId: 'crm2-how-it-works',
    question: 'In CRM 2.0, what is the operator\'s role relative to the agent?',
    options: [
      'Drive every step of the job manually, exactly as you did in the previous CRM',
      'Make the human decisions while the agent runs the routine work end to end',
      'Handle only the invoicing while the agent runs certificate checks and the rest',
      'Approve each automated step the agent takes before it can move the job onward',
    ],
    correct: 1,
    rationale: 'The model is two lanes: the agent runs the routine (chasing, booking, reminding) autonomously, and you step in for the human decisions. Certificate review is the one checkpoint that is always yours.',
  },
  {
    id: 'q-crm2-hiw-2', moduleId: 'crm2-how-it-works',
    question: 'Which stage on the main path is always the operator\'s checkpoint?',
    options: ['Provider selection', 'Scheduling', 'Certificate review', 'Landlord approval'],
    correct: 2,
    rationale: 'Certificate review is your checkpoint — where you check the document and its dates. The rest of the main path is driven by the agent.',
  },
  {
    id: 'q-crm2-hiw-3', moduleId: 'crm2-how-it-works',
    question: 'Should you take over a job just so you can call the tenant or provider early?',
    options: [
      'Yes — reaching the tenant or provider sooner is always the better call',
      'No — with no new urgent information, let the agent work and escalate when it needs you',
      'Only when the landlord has specifically asked you to make that contact',
      'Only once the job is more than three days old and still moving',
    ],
    correct: 1,
    rationale: 'Don\'t take over just to call early. If there is no new urgent information to process, let the agent keep working — it escalates when it needs a human.',
  },
  {
    id: 'q-crm2-hiw-4', moduleId: 'crm2-how-it-works',
    question: 'What is the safest habit before acting on a job\'s suggested action?',
    options: [
      'Act on the most recent activity alone, since that is the fastest way to clear it',
      'Read the whole job first, as the broader history may point to a different decision',
      'Escalate the job to a manager before taking any action on it yourself',
      'Close the job and re-open it so the agent refreshes its suggested action',
    ],
    correct: 1,
    rationale: 'The agent often suggests an action based only on the most recent activity. Read the whole job before acting, as the broader history may point to a different decision.',
  },
  {
    id: 'q-crm2-hiw-5', moduleId: 'crm2-how-it-works',
    question: 'At Landlord approval the landlord decides to arrange the work themselves (landlord DIY). Where does the job rejoin the main path?',
    options: [
      'It skips straight to Completed once the landlord confirms they\'ll handle it',
      'The landlord\'s certificate comes back into Certificate review, like any other cert',
      'It moves to Invoice review so the landlord can be charged for the arrangement',
      'It stays parked at Landlord approval until an admin closes it manually',
    ],
    correct: 1,
    rationale: 'On the landlord-DIY branch the agent waits for the landlord\'s own certificate, which re-enters Certificate review and is checked exactly like any other.',
  },
  {
    id: 'q-crm2-hiw-6', moduleId: 'crm2-how-it-works',
    question: 'A landlord asks for a boiler service alongside their gas safety check. How does that affect the job\'s stages?',
    options: [
      'It splits the job into two separate jobs that then run in parallel',
      'It attaches at Landlord approval and rides alongside the CP12 without changing the stages',
      'It adds a dedicated "boiler service" stage after Scheduling',
      'It diverts the job onto the remedial branch until the service is done',
    ],
    correct: 1,
    rationale: 'A boiler service can attach at Landlord approval and simply rides along with the CP12 — the job\'s stages are unchanged.',
  },
  {
    id: 'q-crm2-hiw-7', moduleId: 'crm2-how-it-works',
    question: 'Right now, which jobs in the queue should you actually process?',
    options: [
      'Every open job, working top to bottom so nothing is missed',
      'Only the flagged (escalated) jobs — leave the ones that haven\'t escalated to the agent',
      'Only jobs older than three days, regardless of whether they\'re flagged',
      'Any job where the AI summary suggests an action, flagged or not',
    ],
    correct: 1,
    rationale: 'Ground rule: only handle flags for now. Don\'t process jobs that haven\'t escalated — the agent is still working them.',
  },

  // crm2-certificate-review
  {
    id: 'q-crm2-cert-1', moduleId: 'crm2-certificate-review',
    question: 'Which three things should you check on every certificate?',
    options: [
      'The address, the numbers (subtotal, VAT and total) and the dates (issue and expiry)',
      'The tenant name, the monthly rent amount and the protected deposit figure',
      'The contractor\'s rating, their distance from the property and their price',
      'The landlord\'s signature, the attached job photos and the engineer\'s notes',
    ],
    correct: 0,
    rationale: 'On every certificate check the address (landlords sometimes send one for another property), the numbers (subtotal, VAT, total) and the dates (issue and expiry, in the right fields on both cert and CRM).',
  },
  {
    id: 'q-crm2-cert-2', moduleId: 'crm2-certificate-review',
    question: 'The AI has flagged the address on a certificate. What does that mean?',
    options: [
      'It means the certificate is invalid and you must reject it and request another',
      'It\'s a hint the address might be wrong and worth a look — not an error to fix',
      'It means you must manually correct the address on the CRM before continuing',
      'It means the landlord has been reported for submitting a fraudulent document',
    ],
    correct: 1,
    rationale: 'A flagged address is a hint that it might be wrong and worth a glance — not an error to fix. A handwritten certificate is a common trigger.',
  },
  {
    id: 'q-crm2-cert-3', moduleId: 'crm2-certificate-review',
    question: 'A landlord sends a certificate that belongs to a different property in their portfolio. What should you do?',
    options: [
      'Reject the certificate and ask the landlord to resend the correct one',
      'Upload it to the property it belongs to, and request the correct cert for this job',
      'Attach it to this job as it is so the job can be closed without delay',
      'Delete the certificate so that it doesn\'t cause any confusion later on',
    ],
    correct: 1,
    rationale: 'Take two actions, not one: upload the cert to the property it actually belongs to so it isn\'t wasted, and request the correct cert for this job\'s property.',
  },
  {
    id: 'q-crm2-cert-4', moduleId: 'crm2-certificate-review',
    question: 'How do you read a CP12 (gas certificate)? It doesn\'t carry an overall satisfactory/unsatisfactory stamp like an EICR.',
    options: [
      'Look for a single overall "satisfactory" stamp, the way an EICR shows one',
      'Read the "Safe to use" column appliance by appliance, then read the engineer\'s notes and judge any remedial required vs optional on its own merits',
      'Check the issue date is recent and take that as the certificate being fine',
      'If every appliance is "Safe to use: YES", treat any noted remedials as elective and close it out',
    ],
    correct: 1,
    rationale: 'A CP12 categorises each appliance against the "Safe to use" column rather than giving the whole document a pass/fail stamp — think of a clean one as "passed, with any noted recommendations". "Safe to use: YES" on every appliance means there\'s no safety failure forcing a required remedial, but it does NOT make every noted item elective. Read the engineer\'s notes and decide required vs optional on each item\'s own merits.',
  },
  {
    id: 'q-crm2-cert-5', moduleId: 'crm2-certificate-review',
    question: 'You\'re entering the provider name on a Dwelly provider\'s certificate. Where should the name come from?',
    options: [
      'Type it exactly as the agent has pre-filled it in the field',
      'Copy it from the Contacts tab — the agent sometimes pre-fills it slightly differently',
      'Read it off the certificate document itself, whatever that shows',
      'Leave it blank and let the agent resolve the provider automatically',
    ],
    correct: 1,
    rationale: 'For a Dwelly provider, copy and paste the name from the Contacts tab on the right — the agent sometimes pre-fills the field differently from the name shown there. (For a landlord-DIY cert, use the name on the certificate.)',
  },
  {
    id: 'q-crm2-cert-6', moduleId: 'crm2-certificate-review',
    question: 'When should you use "Invalid" rather than "Upload another" on the review panel?',
    options: [
      'Invalid when you spot a problem with a cert (wrong date/address); Upload another when a new cert arrives the agent didn\'t recognise',
      'Invalid when the file won\'t open; Upload another when the dates are wrong',
      'They do the same thing — either one rejects the certificate',
      'Invalid for gas certs; Upload another for electrical certs',
    ],
    correct: 0,
    rationale: 'Invalid is for when you spot an issue with a cert (incorrect date, address, etc.). Upload another is for when you\'ve received a new cert and the agent didn\'t recognise it automatically.',
  },
  {
    id: 'q-crm2-cert-7', moduleId: 'crm2-certificate-review',
    question: 'An EICR lists one or more FI (further investigation) items. What does that mean for the certificate?',
    options: [
      'FI codes render the EICR unsatisfactory — treat it as requiring remedial work',
      'The FI items are advisory only, like C3 — you can approve it as satisfactory',
      'FI has no effect unless there is also a C1 or C2 on the report',
      'The cert is invalid — reject it and request a brand-new inspection',
    ],
    correct: 0,
    rationale: 'FI (further investigation) is a fail code, alongside C1 and C2 — any of them render an EICR unsatisfactory. So an EICR listing FI items is not a genuine pass; it needs to go down the required-remedial path. Only C3 (improvement recommended) items are advisory and leave the certificate satisfactory.',
  },

  // crm2-remedial-works
  {
    id: 'q-crm2-rem-1', moduleId: 'crm2-remedial-works',
    question: 'Where do you decide whether remedial works are required or just recommended?',
    options: ['Landlord approval', 'Certificate review', 'Provider selection', 'Invoice review'],
    correct: 1,
    rationale: 'At Certificate review you decide whether remedials are required for compliance or simply recommended by the engineer — and that choice sends the job down the right path.',
  },
  {
    id: 'q-crm2-rem-2', moduleId: 'crm2-remedial-works',
    question: 'You click Optional remedial to confirm the C3 items on an otherwise-satisfactory certificate. What happens next?',
    options: [
      'The job runs the same remedial branch as a required remedial, all within CRM 2.0 — and the satisfactory certificate is saved to file',
      'CRM 2.0 hands the job to a maintenance job in CRM 1.0 to handle the optional works',
      'The job is voided until the optional work has been completed',
      'A second contractor is booked automatically to carry out the work',
    ],
    correct: 0,
    rationale: 'Optional remedials now follow the same branch as required ones — Quotation awaiting → Quotation review → Landlord quote approval → repeat visit, all in CRM 2.0. The one difference is that the already-satisfactory certificate is saved to file, because the property stays compliant whether or not the optional works go ahead. There\'s no hand-off to a CRM 1.0 maintenance job any more.',
  },
  {
    id: 'q-crm2-rem-3', moduleId: 'crm2-remedial-works',
    question: 'What is the key difference between an optional remedial and a required one, given they now follow the same path?',
    options: [
      'The optional remedial skips Landlord quote approval',
      'Because the cert already passed, the satisfactory certificate is saved to file — the property stays compliant either way',
      'The optional remedial is handled entirely in CRM 1.0',
      'There is no difference — the two are now identical in every respect',
    ],
    correct: 1,
    rationale: 'Both required and optional remedials run the same branch (Quotation awaiting → Quotation review → Landlord quote approval → repeat visit). The distinguishing point is that an optional remedial saves the already-satisfactory certificate to file, because the property is compliant whether or not the optional works proceed.',
  },
  {
    id: 'q-crm2-rem-4', moduleId: 'crm2-remedial-works',
    question: 'Once you press Need remedial, what\'s the order of the remedial branch?',
    options: [
      'Landlord quote approval → Quotation awaiting → Quotation review → repeat visit',
      'Quotation awaiting → Quotation review → Landlord quote approval → if the landlord approves, it re-enters Scheduling for the repeat visit; if the landlord rejects the quote, Remedial terminated',
      'Quotation review → Landlord quote approval → Quotation awaiting → Completed',
      'Scheduling → Quotation awaiting → Landlord quote approval → Certificate review',
    ],
    correct: 1,
    rationale: 'The remedial branch runs Quotation awaiting (agent asks for a quote) → Quotation review (your checkpoint) → Landlord quote approval. If the landlord approves, the job re-enters Scheduling for the repeat visit; if the landlord rejects the quote, the remedial branch ends at Remedial terminated — the extra works don\'t go ahead, but the satisfactory certificate still stands.',
  },
  {
    id: 'q-crm2-rem-5', moduleId: 'crm2-remedial-works',
    question: 'The contractor has given a quote for the extra works but no formal quotation document. What do you do?',
    options: [
      'Escalate the job to an admin to force a formal quote',
      'Reject the works until a formal quotation is issued',
      'Attach a screenshot of their quote to the job — an informal fix, no escalation needed',
      'Enter the amount yourself and approve it without any document',
    ],
    correct: 2,
    rationale: 'If the contractor hasn\'t provided a formal quotation document, just attach a screenshot of their quote to the job. It\'s an informal fix — no escalation point needed.',
  },
  {
    id: 'q-crm2-rem-6', moduleId: 'crm2-remedial-works',
    question: 'At Landlord quote approval the landlord rejects the quote. What\'s the right handling?',
    options: [
      'Close the job immediately as Remedial terminated with no further contact',
      'Book the works anyway since the certificate was satisfactory',
      'Call to confirm whether they\'ll get their own or other quotes; their own contractor must be vetted first, and if they decline entirely, assert landlord DIY',
      'Automatically source three alternative quotes and re-present them',
    ],
    correct: 2,
    rationale: 'If the landlord rejects the quote, call them to confirm whether they\'ll seek their own quote or want additional quotes from other agency contractors. Their own contractor must be vetted first; if they decline entirely, assert full landlord DIY.',
  },

  // crm2-epc
  {
    id: 'q-crm2-epc-1', moduleId: 'crm2-epc',
    question: 'Does an EPC have to be renewed during a live tenancy?',
    options: [
      'Yes — like an EICR or gas cert, it must be kept in date throughout the tenancy',
      'No — but it must be valid before marketing, a new agreement, a change or notice',
      'Only when the tenant specifically asks for an up-to-date copy of it',
      'Only for properties that are currently rated below a band C on the register',
    ],
    correct: 1,
    rationale: 'Unlike an EICR or gas cert, an EPC is not legally required to be renewed mid-tenancy — but it must be valid before you market, sign a new agreement with different tenants, formally change the agreement, or serve notice. In practice we keep it in date: if a renewal is due and the landlord doesn\'t reply, we instruct it with a provider rather than let it lapse.',
  },
  {
    id: 'q-crm2-epc-2', moduleId: 'crm2-epc',
    question: 'A landlord hasn\'t responded about renewing the EPC. What is the correct stance?',
    options: [
      'Instruct the renewal with a provider — if there\'s no reply, we proceed rather than leave it lapsed',
      'Explain it isn\'t required mid-tenancy, so take no action unless they confirm',
      'Cancel the tenancy until the landlord agrees to fund a new certificate',
      'Escalate the matter to the tenancy deposit scheme for a formal ruling',
    ],
    correct: 0,
    rationale: 'If the landlord doesn\'t reply about a due EPC renewal, we instruct it with a provider rather than leave it lapsed — silence isn\'t a blocker. An EPC isn\'t legally required mid-tenancy, but it must be valid before marketing, a new agreement, a formal change, or serving notice, so we keep it in date via a provider.',
  },
  {
    id: 'q-crm2-epc-3', moduleId: 'crm2-epc',
    question: 'Which of these does NOT require a valid EPC to be in place?',
    options: [
      'Marketing the property to new tenants',
      'Signing a new agreement with different tenants',
      'Continuing an existing tenancy that isn\'t changing',
      'Serving notice on the current tenants',
    ],
    correct: 2,
    rationale: 'A valid EPC is needed before marketing, a new agreement with different tenants, a formal change to the agreement, or serving notice. Continuing an unchanged tenancy does not legally require one — but when a renewal is due and the landlord doesn\'t reply, we still instruct it with a provider rather than leave it lapsed.',
  },
  {
    id: 'q-crm2-epc-4', moduleId: 'crm2-epc',
    question: 'A landlord is completely unresponsive about their EPC. What\'s the correct way to handle that?',
    options: [
      'Cancel the job automatically after 14 days of silence',
      'Instruct the renewal with a provider — an unresponsive landlord doesn\'t stop us keeping the EPC in date',
      'Take no action until the landlord confirms in writing they want it renewed',
      'Escalate it to the tenancy deposit scheme for a ruling',
    ],
    correct: 1,
    rationale: 'An unresponsive landlord doesn\'t block a due EPC renewal — we instruct it with a provider rather than let it lapse. Silence isn\'t a reason to cancel the job or wait indefinitely.',
  },

  // crm2-escalations
  {
    id: 'q-crm2-esc-1', moduleId: 'crm2-escalations',
    question: 'What does the date and time at the bottom of a job represent?',
    options: [
      'The hard deadline by which the whole job must be completed and closed',
      'The next agent action, which may be an auto reminder rather than an escalation',
      'The date on which the certificate attached to the job is due to expire',
      'The last time you personally opened and viewed this particular job',
    ],
    correct: 1,
    rationale: 'That date is the next agent action, not necessarily the next escalation — it may just be an auto reminder. The full list of planned actions sits on the right of the job.',
  },
  {
    id: 'q-crm2-esc-2', moduleId: 'crm2-escalations',
    question: 'How long does "Wait for response" last, and what do you do if a provider is away longer?',
    options: [
      'It lasts 7 days, and after that you escalate the blockage to a manager',
      'It caps at 3 days; if the provider is away longer, divert the job to Manual rather than re-setting the wait',
      'It lasts indefinitely, so no further action is needed from you on timing',
      'It caps at 24 hours, and you cancel the job if there\'s still no response',
    ],
    correct: 1,
    rationale: '"Wait for response" maxes out at 3 days. If a provider is away longer than that (e.g. annual leave), divert the job to Manual — the hold state — rather than repeatedly re-setting the 3-day wait.',
  },
  {
    id: 'q-crm2-esc-3', moduleId: 'crm2-escalations',
    question: 'A job is blocked by a block manager (not the tenant, landlord or provider). What is the right action?',
    options: [
      'Cancel the job and raise a fresh one once the block manager responds',
      'Divert the job to Manual — the hold state — until the information arrives',
      'Leave the job flagged as it is and simply wait for the block manager to reply',
      'Switch the job over to CRM 1.0, where a third-party hold state already exists',
    ],
    correct: 1,
    rationale: 'Manual mode in CRM 2.0 is the hold state for anything that needs to sit outside the automated flow for a while — a third-party block like this, a provider away on long leave, or a British Gas job. Use it instead of cancelling and re-creating the job.',
  },

  // crm2-navigating
  {
    id: 'q-crm2-nav-1', moduleId: 'crm2-navigating',
    question: 'On the requests queue, what does an orange flag on a job mean?',
    options: [
      'The certificate attached to the job is close to expiry',
      'The job has escalated and needs a human — for now these are the only ones you action',
      'The landlord has raised a complaint about the job',
      'The job has been sitting in the queue longer than three days',
    ],
    correct: 1,
    rationale: 'An orange flag means the job has escalated and needs a human. For now, flagged jobs are the only ones you action.',
  },
  {
    id: 'q-crm2-nav-2', moduleId: 'crm2-navigating',
    question: 'How much should you rely on the AI Summary on a job?',
    options: [
      'Treat it as authoritative — it\'s verified before it\'s shown',
      'Use it as a quick read, but still read the full job chronology before you act',
      'Ignore it completely; it\'s never accurate',
      'Only read it if the job has no activity history yet',
    ],
    correct: 1,
    rationale: 'The AI summary gives a quick read of the current state, but 2.0 is new and summaries are still maturing — always read the job chronology so you\'re fully up to speed before acting.',
  },
  {
    id: 'q-crm2-nav-3', moduleId: 'crm2-navigating',
    question: 'You open a job and see a grey "No active task — agent is monitoring" bar at the bottom. What does that tell you?',
    options: [
      'The job has stalled and you need to Take Over to progress it',
      'The agent still owns the job and there\'s nothing for you to do on it',
      'The job is complete and can be hidden from the queue',
      'The agent has hit an error and the job needs an admin',
    ],
    correct: 1,
    rationale: 'The grey "No active task — agent is monitoring" bar means the agent still has the job. An Action Required panel appears only when the job actually needs you.',
  },
  {
    id: 'q-crm2-nav-4', moduleId: 'crm2-navigating',
    question: 'What\'s the default way to follow up or progress a job, and what must always follow?',
    options: [
      'Email first for a written record; only call if there\'s no reply',
      'Call first — then always send a follow-up email, including every time you leave a voicemail',
      'Send an SMS, since it\'s fastest, and log a note',
      'Wait for the agent to chase again before doing anything yourself',
    ],
    correct: 1,
    rationale: 'Calling is the primary way to follow up or progress a job. Always send a follow-up email afterwards — including every time you leave a voicemail — so the recipient can find the right thread to reply to.',
  },

  // crm2-touchpoints
  {
    id: 'q-crm2-tp-1', moduleId: 'crm2-touchpoints',
    question: 'Which of these is NOT a designed human touchpoint?',
    options: [
      'Certificate review',
      'Invoice review',
      'Result awaiting',
      'Quotation review',
    ],
    correct: 2,
    rationale: 'Result awaiting is the agent chasing the certificate — it only lands with you if it stalls and escalates (at +3 days). Certificate review, Invoice review and Quotation review are the designed, every-relevant-job checkpoints.',
  },
  {
    id: 'q-crm2-tp-2', moduleId: 'crm2-touchpoints',
    question: 'A job sits unanswered at Landlord approval past both reminders. What happens at +4 days?',
    options: [
      'It auto-advances to provider selection without a human',
      'It escalates to you to action manually',
      'It is cancelled automatically',
      'It waits indefinitely until the landlord responds',
    ],
    correct: 0,
    rationale: 'At Landlord approval the reminders fire at +1 and +3 days; if there\'s still no landlord conversation, at +4 days the job auto-advances to provider selection on its own — no human needed. An EPC is no exception here: it auto-advances the same as any other job.',
  },
  {
    id: 'q-crm2-tp-3', moduleId: 'crm2-touchpoints',
    question: 'At Result awaiting, what\'s the chase cadence before a job reaches you?',
    options: [
      'It escalates to you immediately once the visit passes',
      'Reminders at +1 and +2 days, then it escalates to you at +3',
      'Reminders at +3 and +7 days',
      'It never escalates — the agent chases indefinitely',
    ],
    correct: 1,
    rationale: 'Result awaiting sends reminders at +1 and +2 days, then escalates to you at +3.',
  },
  {
    id: 'q-crm2-tp-4', moduleId: 'crm2-touchpoints',
    question: 'Why does Landlord quote approval get a longer leash (+3, then escalate at +7) than most stages?',
    options: [
      'Because landlords are always slow to reply',
      'Because it\'s a money decision, so it\'s given more time before escalating',
      'Because the agent can\'t send reminders on that stage',
      'Because it only applies to EPC jobs',
    ],
    correct: 1,
    rationale: 'Landlord quote approval reminds at +3 days and escalates at +7 — it\'s stretched out because it\'s a money decision.',
  },
  {
    id: 'q-crm2-tp-5', moduleId: 'crm2-touchpoints',
    question: 'How does the Visit stage behave on timing?',
    options: [
      'It chases the tenant daily until the visit is confirmed',
      'One reminder the day before, then it auto-advances once the date passes',
      'It escalates to you the moment the job reaches Visit',
      'It waits three days, then cancels if unconfirmed',
    ],
    correct: 1,
    rationale: 'Visit gets one reminder the day before and auto-advances once the date passes — there\'s no per-day chasing or immediate escalation.',
  },

  // crm2-buttons
  {
    id: 'q-crm2-bt-1', moduleId: 'crm2-buttons',
    question: 'A landlord phones to approve the works. Which button do you use?',
    options: [
      'Add Direct Info, writing it as if from the landlord',
      'Landlord approved, directly',
      'Provide Instructions to tell the agent they approved',
      'Send Communication to email a confirmation first',
    ],
    correct: 1,
    rationale: 'If the landlord approves by phone, use Landlord approved directly — not Add Direct Info.',
  },
  {
    id: 'q-crm2-bt-2', moduleId: 'crm2-buttons',
    question: 'A provider tells you by phone he can attend on 11 Aug at 2pm. The tenant hasn\'t been asked yet. Which action fits?',
    options: [
      'Set Visit Date to 11 Aug at 2pm',
      'Add Direct Info, source From Provider — you\'re passing on information, not recording an agreed appointment',
      'Take Over and email the tenant yourself',
      'Provide Instructions to book the slot',
    ],
    correct: 1,
    rationale: 'Rule of thumb: Add Direct Info = passing on information you received; Set Visit Date = recording an appointment both sides have already agreed. Only once the tenant agrees would you Set Visit Date.',
  },
  {
    id: 'q-crm2-bt-3', moduleId: 'crm2-buttons',
    question: 'A tenant says they\'re free "in the morning". What do you do?',
    options: [
      'Wait for them to give an exact time before booking',
      'Set the visit date manually, treating morning as 8am–12pm — the AI won\'t accept a relative time as confirmation',
      'Ask the provider to pick any morning slot',
      'Add Direct Info with the word "morning" and let the agent resolve it',
    ],
    correct: 1,
    rationale: 'The AI won\'t treat a relative time like "morning" as a confirmation. Set the visit date manually rather than waiting for an exact time — treat morning as 8am–12pm.',
  },
  {
    id: 'q-crm2-bt-4', moduleId: 'crm2-buttons',
    question: 'When is it appropriate to use Provide Instructions?',
    options: [
      'Whenever you want to steer how the agent handles a job',
      'To reassign or cancel a job yourself',
      'Only after consulting an admin — it\'s admin-only; the main accepted case is a closed job that gets a thank-you/unrelated email, where the instruction is "do nothing"',
      'Any time a party sends an email the agent didn\'t expect',
    ],
    correct: 2,
    rationale: 'Provide Instructions is admin-only (along with Reassign Job and Cancel Job). Never use it without consulting an admin. The main accepted case is a closed job receiving a thank-you or unrelated email, where the instruction is simply "do nothing".',
  },
  {
    id: 'q-crm2-bt-5', moduleId: 'crm2-buttons',
    question: 'You\'re at Landlord approval on a CP12 and see the "Add Boiler Service" button. What\'s the right habit?',
    options: [
      'Add it by default — a boiler service always goes with a CP12',
      'Always double-check the landlord actually wants it; if their response is unclear, ask again before proceeding',
      'Ignore it unless the tenant requests it',
      'Only add it if the property has a combi boiler',
    ],
    correct: 1,
    rationale: 'Always double-check whether the landlord wants the boiler service. If it\'s unclear from their response, ask again before proceeding.',
  },
  {
    id: 'q-crm2-bt-6', moduleId: 'crm2-buttons',
    question: 'The landlord names a provider who isn\'t on the preferred list or the provider panel. What do you do?',
    options: [
      'Refuse and use our preferred provider instead',
      'Onboard them straight away without any checks to avoid delay',
      'Ask the relevant PMs for feedback, then onboard the provider following the onboarding SOP',
      'Escalate to an admin to decide',
    ],
    correct: 2,
    rationale: 'If a landlord-named provider isn\'t on the preferred list or the provider panel, ask the relevant PMs for feedback, then onboard them following the onboarding SOP.',
  },
  {
    id: 'q-crm2-bt-7', moduleId: 'crm2-buttons',
    question: 'A job has two tenants and the first tenant isn\'t answering. Who do you try next?',
    options: [
      'The first tenant\'s second number on file',
      'The second tenant',
      'The landlord, to get another contact',
      'The provider, to reschedule instead',
    ],
    correct: 1,
    rationale: 'With two tenants, it\'s better to call the second tenant than the first tenant\'s second number — those secondary numbers were copied across without notes.',
  },
  {
    id: 'q-crm2-bt-8', moduleId: 'crm2-buttons',
    question: 'A provider asks you for the tenant\'s phone number so they can arrange access directly. What\'s the rule?',
    options: [
      'Share it — it speeds up scheduling',
      'Only ever share masked numbers between tenant, landlord and provider — never direct ones',
      'Share it only if the tenant agrees on the call',
      'Give the landlord\'s number instead of the tenant\'s',
    ],
    correct: 1,
    rationale: 'Never give out direct phone numbers between tenant, landlord and provider — we\'re only allowed to share masked ones.',
  },

  // crm2-rescheduling
  {
    id: 'q-crm2-rs-1', moduleId: 'crm2-rescheduling',
    question: 'Both the tenant and provider have confirmed a new time in the thread. Which action?',
    options: [
      'Restart Scheduling',
      'Reset Visit Date',
      'Take Over and email both parties',
      'Cancel and raise a new job',
    ],
    correct: 1,
    rationale: 'Reset Visit Date is for when both parties have already agreed the new time — here both confirmed in the thread. It updates the job and notifies both sides automatically.',
  },
  {
    id: 'q-crm2-rs-2', moduleId: 'crm2-rescheduling',
    question: 'The original slot fell through and no new time has been agreed. Which action?',
    options: [
      'Reset Visit Date to a guess and adjust later',
      'Restart Scheduling, writing the opening message so the context carries over',
      'Take Over — rescheduling isn\'t built in at this stage',
      'Provide Instructions to the agent to find a new slot',
    ],
    correct: 1,
    rationale: 'Restart Scheduling is for when a new appointment hasn\'t been agreed yet. You pick tenant or provider and write the opening message so context carries over.',
  },
  {
    id: 'q-crm2-rs-3', moduleId: 'crm2-rescheduling',
    question: 'The provider proposed a new date and you phoned the tenant, who agreed. Which action — and why is it easy to get wrong?',
    options: [
      'Restart Scheduling, because a phone agreement doesn\'t count',
      'Reset Visit Date — both sides have agreed (one proposed, you confirmed the other by phone), even though it feels like a restart',
      'Take Over, because it happened partly off-system',
      'Cancel and rebook from scratch',
    ],
    correct: 1,
    rationale: 'Reset Visit Date covers both "both confirmed in the thread" and "one proposed it and you confirmed the other by phone". Since both sides have agreed, it\'s a Reset, not a Restart.',
  },
  {
    id: 'q-crm2-rs-4', moduleId: 'crm2-rescheduling',
    question: 'When you Restart Scheduling and write "can\'t do tomorrow, next Monday works", what does the system do with the date?',
    options: [
      'Ignores it — you must set the date separately',
      'Recognises and uses it through the flow, and quotes it verbatim at the end of the email',
      'Asks you to confirm the exact date in a separate field',
      'Treats it as a note only, not a proposed date',
    ],
    correct: 1,
    rationale: 'Dates in your message are recognised and used through the flow — a natural message like "next Monday works" moves things along, and it\'s quoted verbatim at the end of the email too.',
  },
  {
    id: 'q-crm2-rs-5', moduleId: 'crm2-rescheduling',
    question: 'At which stages is built-in rescheduling now available without a manual take-over?',
    options: [
      'Only at Scheduling',
      'Visit and Result awaiting',
      'Landlord approval and Provider selection',
      'Any stage of the job',
    ],
    correct: 1,
    rationale: 'Rescheduling is now built in for jobs already at the Visit or Result awaiting stage — previously this needed a manual take-over.',
  },

  // crm2-escalations-reference
  {
    id: 'q-crm2-er-1', moduleId: 'crm2-escalations-reference',
    question: 'A single "document problem" escalation can fire at which stages?',
    options: [
      'Only at Certificate review',
      'Certificate review, Invoice review and Quotation review (CR · IR · QR)',
      'Landlord approval and Scheduling',
      'Any stage the agent is working',
    ],
    correct: 1,
    rationale: 'Every document and email problem sits under a single "document problem" escalation, which can fire at Certificate review, Invoice review or Quotation review (CR · IR · QR).',
  },
  {
    id: 'q-crm2-er-2', moduleId: 'crm2-escalations-reference',
    question: 'The agent flags a vague / low-confidence reply from a party. What\'s the first move?',
    options: [
      'Guess the most likely intent and proceed',
      'Call the party to clarify before choosing the next step',
      'Cancel the job and raise a new one',
      'Wait for the agent to ask again automatically',
    ],
    correct: 1,
    rationale: 'For a vague / low-confidence reply, call the party and clarify before choosing the next step.',
  },
  {
    id: 'q-crm2-er-3', moduleId: 'crm2-escalations-reference',
    question: 'A job escalates with "unrecognised intent". How do you handle it?',
    options: [
      'Choose whichever next stage looks most likely from the last message',
      'Read the entire job log, call the relevant parties to clarify, then choose the next stage',
      'Reassign the job to an admin',
      'Reply asking the sender to rephrase and wait',
    ],
    correct: 1,
    rationale: 'For an unrecognised intent, read the entire job log, call the relevant parties to clarify, then choose the next stage.',
  },
  {
    id: 'q-crm2-er-4', moduleId: 'crm2-escalations-reference',
    question: 'A tenant answers the scheduling question but also asks an unrelated question about their deposit. What do you do?',
    options: [
      'Answer the deposit question yourself and continue',
      'Action the job for the scheduling question, then acknowledge the extra question and pass it to the relevant PM',
      'Ignore the extra question — it\'s out of scope',
      'Hold the whole job until the deposit query is resolved',
    ],
    correct: 1,
    rationale: 'When a job is answered but unrelated extra questions are asked, action the job for the relevant question, then acknowledge the extra one and pass it to the relevant PM.',
  },
  {
    id: 'q-crm2-er-5', moduleId: 'crm2-escalations-reference',
    question: 'You hit an external-system error on a job. How do you decide what to do?',
    options: [
      'Always escalate every external-system error to support',
      'Retry if it looks transient; escalate to support if it persists (e.g. missing mandatory data)',
      'Force the job forward regardless',
      'Cancel the job and start again in CRM 1.0',
    ],
    correct: 1,
    rationale: 'External-system errors can hit at any stage. If transient, retry; if it persists — for example mandatory data is missing — escalate to support rather than forcing the job forward.',
  },
  {
    id: 'q-crm2-er-6', moduleId: 'crm2-escalations-reference',
    question: 'The certificate is satisfactory, but the landlord refuses the quote for the optional (recommended) remedial works. What\'s the correct outcome?',
    options: [
      'The whole job fails and the certificate is voided',
      'Record the response; the remedial branch ends at Remedial terminated and the satisfactory cert still stands',
      'Book the works anyway to stay compliant',
      'Escalate to an admin to overrule the landlord',
    ],
    correct: 1,
    rationale: 'These remedials are optional — the certificate is already satisfactory — so the landlord can decline. Record the response; the remedial branch ends at Remedial terminated and the satisfactory certificate still stands. This is different from required remedials on an unsatisfactory cert (a C1/C2/FI on an EICR, or an unsafe gas appliance), where the compliance issue doesn\'t go away just because the landlord refuses.',
  },

  // crm2-across-systems
  {
    id: 'q-crm2-as-1', moduleId: 'crm2-across-systems',
    question: 'What\'s the correct order to switch a job from CRM 2.0 to CRM 1.0?',
    options: [
      'Cancel in 2.0, create in 1.0, then pause auto-transfer',
      'Ask ops to pause auto-transfer → cancel in 2.0 → create in 1.0 with full context → ask ops to switch auto-transfer back on',
      'Create in 1.0 first, then cancel in 2.0',
      'Just cancel in 2.0 — the job re-creates itself in 1.0',
    ],
    correct: 1,
    rationale: 'Ask the ops team to pause auto-transfer for the agency, cancel the request in 2.0, create it in 1.0 leaving full context on why it moved, then ask ops to switch auto-transfer back on. Pausing first stops the job bouncing straight back.',
  },
  {
    id: 'q-crm2-as-2', moduleId: 'crm2-across-systems',
    question: 'On a vacant (Unattended) property, what\'s the one human escalation in the flow?',
    options: [
      'Approving the provider, since there\'s no tenant to consult',
      'The day before the visit, verifying the keys are available for collection',
      'Confirming the tenant\'s availability',
      'Signing off the certificate on the landlord\'s behalf',
    ],
    correct: 1,
    rationale: 'For vacant properties the agent goes straight to the provider and books from their availability. The day before the visit you get an escalation to verify the keys are available for collection; the rest is unchanged.',
  },
  {
    id: 'q-crm2-as-3', moduleId: 'crm2-across-systems',
    question: 'A job is at Result awaiting and the certificate is overdue. What should you do before chasing the provider?',
    options: [
      'Immediately call the provider to demand the certificate',
      'Check the last few emails on the job — the document is sometimes already there',
      'Cancel and rebook the visit',
      'Take Over and mark the job complete',
    ],
    correct: 1,
    rationale: 'Before requesting a document from a provider, check the last few emails on the job — often the certificate is already there as an attachment or link.',
  },
  {
    id: 'q-crm2-as-4', moduleId: 'crm2-across-systems',
    question: 'What should you make sure to collect for every appointment?',
    options: [
      'Just the certificate — the invoice follows separately',
      'Both the certificate AND the invoice',
      'The certificate and a photo of the work',
      'The invoice only; the certificate is uploaded by the agent',
    ],
    correct: 1,
    rationale: 'Collect the certificate AND the invoice for every appointment.',
  },
  {
    id: 'q-crm2-as-5', moduleId: 'crm2-across-systems',
    question: 'What is the Job Notes tab for?',
    options: [
      'A full record of every message sent to and from the parties',
      'Operational context — why we\'re waiting, special agreements — not communication history',
      'The agent\'s internal reasoning log',
      'Storing certificates and invoices',
    ],
    correct: 1,
    rationale: 'Use the Job Notes tab for operational context (why we\'re waiting, special agreements) — it\'s for context, not communication history. Add your own via Send Communication → Add notes.',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CRM 2.0 — MAINTENANCE track. A separate set of knowledge checks drawn solely
  // from the maintenance guides. These never mix with the compliance questions:
  // different module ids (crm2-maint-*), different content.
  // ─────────────────────────────────────────────────────────────────────────────

  // crm2-maint-how-it-works
  {
    id: 'q-crm2-maint-hiw-1', moduleId: 'crm2-maint-how-it-works',
    question: 'On a clean maintenance job, how many stages stop for a human decision?',
    options: [
      'One — only the invoice check',
      'Three — tenant triage, provider selection, and the invoice check',
      'Five — roughly every other stage',
      'All ten — the operator confirms every stage',
    ],
    correct: 1,
    rationale: 'The flow is ten stages, but on a clean job only three stop for you: you tidy the report at triage, you choose the provider, and you approve the invoice. Everything else is the agent\'s.',
  },
  {
    id: 'q-crm2-maint-hiw-2', moduleId: 'crm2-maint-how-it-works',
    question: 'What is the one big difference between the maintenance and compliance flows?',
    options: [
      'In maintenance there is no landlord approval step',
      'In maintenance the agent never assigns the provider — that choice is always yours',
      'In maintenance the agent checks the invoice for you',
      'In maintenance there are no side branches',
    ],
    correct: 1,
    rationale: 'The key difference to burn in: in maintenance the agent never assigns the provider. Provider selection is always a human choice in the picker.',
  },
  {
    id: 'q-crm2-maint-hiw-3', moduleId: 'crm2-maint-how-it-works',
    question: 'A request has no active task on it. What should you do before jumping in?',
    options: [
      'Take over immediately so nothing is missed',
      'Check Planned Actions to see what the agent has already queued, and don\'t take over just to act early',
      'Cancel and re-open the request to refresh it',
      'Escalate it to your manager',
    ],
    correct: 1,
    rationale: 'No active task usually means the agent is working or a party owes a reply. Check Planned Actions first — the agent may already have a chase queued — and don\'t take over just to act early.',
  },
  {
    id: 'q-crm2-maint-hiw-4', moduleId: 'crm2-maint-how-it-works',
    question: 'Which of these is NOT one of your three checkpoints on a maintenance job?',
    options: ['Tenant triage', 'Provider selection', 'Scheduling', 'The invoice check'],
    correct: 2,
    rationale: 'Scheduling is the agent\'s — it brokers a slot between tenant and provider. Your three checkpoints are triage, provider selection and the invoice check.',
  },
  {
    id: 'q-crm2-maint-hiw-5', moduleId: 'crm2-maint-how-it-works',
    question: 'What is a maintenance request, in one line?',
    options: [
      'A single repair job that runs from the tenant\'s first report to the provider being paid',
      'A request for a compliance certificate such as a gas or electrical check',
      'A landlord\'s instruction to end a tenancy',
      'A note recorded against a property for reference only',
    ],
    correct: 0,
    rationale: 'A maintenance request is a single repair — a leak, a boiler, a blockage — that runs from the tenant\'s first report all the way to the provider being paid.',
  },

  // crm2-maint-triage
  {
    id: 'q-crm2-maint-triage-1', moduleId: 'crm2-maint-triage',
    question: 'Why do photos and a clear report matter so much at tenant triage?',
    options: [
      'They are needed only for the landlord\'s records',
      'The provider prices the job remotely at online quoting from exactly what you attach here',
      'They speed up the tenant\'s acknowledgement message',
      'They are required before the agent can send the landlord an FYI',
    ],
    correct: 1,
    rationale: 'The provider quotes remotely at online quoting — they don\'t visit first. They price from exactly the photos and report you attach at triage. Missing those, they simply can\'t put a number on it.',
  },
  {
    id: 'q-crm2-maint-triage-2', moduleId: 'crm2-maint-triage',
    question: 'A job reaches the provider with no usable photos and a one-line report. What happens?',
    options: [
      'The agent automatically fills in the missing detail',
      'It stalls later at online quoting while the provider comes back to ask for photos',
      'The job is cancelled by the system',
      'Nothing — the provider quotes anyway',
    ],
    correct: 1,
    rationale: 'The provider has to come back and ask, so the request sits in online quoting for days while messages go back and forth. Triage is the cheapest place to catch it.',
  },
  {
    id: 'q-crm2-maint-triage-3', moduleId: 'crm2-maint-triage',
    question: 'A tenant reports a blocked drain. What should you check before dispatching anyone?',
    options: [
      'Nothing — send a contractor straight away',
      'Whether the tenant has tried a plunger and drain unblocker, and what fixed it last time',
      'Whether the landlord wants to do it himself',
      'Whether the property has an EPC on file',
    ],
    correct: 1,
    rationale: 'For a drain or blockage, ask about self-help first — plunger, drain unblocker, has it happened before. It often saves a chargeable visit.',
  },
  {
    id: 'q-crm2-maint-triage-4', moduleId: 'crm2-maint-triage',
    question: 'You need photos, but the tenant won\'t respond. What is the correct sequence?',
    options: [
      'Cancel the job immediately',
      'Email, then use Wait for Tenant; if silent, call; if still nothing, send one more email, then cancel as unresponsive',
      'Send a contractor to take the photos',
      'Progress the job to the landlord without photos',
    ],
    correct: 1,
    rationale: 'Email to say we can\'t proceed without them and use Wait for Tenant. If they don\'t reply, call; if still no luck, send one more email and then cancel with the reason that the tenant is unresponsive.',
  },
  {
    id: 'q-crm2-maint-triage-5', moduleId: 'crm2-maint-triage',
    question: 'At triage the issue looks like tenant damage, not a landlord repair. What should you do?',
    options: [
      'Progress it anyway and let the landlord decide',
      'Say so now rather than progressing — a liability re-check belongs here',
      'Cancel it silently with no reason',
      'Move it straight to provider selection',
    ],
    correct: 1,
    rationale: 'If the item looks like tenant damage or isn\'t part of the tenancy, flag it now rather than progressing — that\'s the liability re-check.',
  },

  // crm2-maint-writing
  {
    id: 'q-crm2-maint-write-1', moduleId: 'crm2-maint-writing',
    question: 'What should a job header say?',
    options: [
      'The service category, e.g. "Plumbing request"',
      'What is wrong and where, e.g. "Plumbing Request — Leak Under Kitchen Sink"',
      'Who asked for the work, e.g. "Direct LL Request"',
      'The job ID and lifecycle stage',
    ],
    correct: 1,
    rationale: 'A provider seeing "Plumbing request" in a list of twelve has no idea which job is theirs. Name the problem and the location.',
  },
  {
    id: 'q-crm2-maint-write-2', moduleId: 'crm2-maint-writing',
    question: 'Where do "move-out", "emergency" and job IDs belong?',
    options: [
      'At the front of the header so they stand out',
      'Set as tags — never typed into the header, which is for the actual problem',
      'In the description\'s first line',
      'Nowhere — they should be deleted entirely',
    ],
    correct: 1,
    rationale: 'None of these describe the work. Set them as tags so they can be filtered and reported on, and give the header back to the actual problem. If a job is tagged emergency, it has to be one.',
  },
  {
    id: 'q-crm2-maint-write-3', moduleId: 'crm2-maint-writing',
    question: 'The tenant portal\'s "Additional details provided" Q&A block — what do you do with it?',
    options: [
      'Forward it in full so nothing is lost',
      'Pull out the one or two facts that matter and delete the rest; never forward a tenant\'s name or health information',
      'Paste it into the header',
      'Delete the whole description and start blank',
    ],
    correct: 1,
    rationale: 'The block roughly doubles the length and is mostly the portal\'s own questions. Read it, keep the fault and any real access instruction, delete the rest — and never forward a tenant\'s name or health information.',
  },
  {
    id: 'q-crm2-maint-write-4', moduleId: 'crm2-maint-writing',
    question: 'A job is quote-only. How should you write it?',
    options: [
      'Just put the service name in the header',
      'Put "(quote)" in the header, state the source, and attach photos or the inspection report',
      'Leave the description blank so the provider visits',
      'Mark it as an emergency to get a faster response',
    ],
    correct: 1,
    rationale: 'A contractor can\'t price a tree, a garden or a door from a sentence. Put "(quote)" in the header, state the source, and attach photos or the report.',
  },
  {
    id: 'q-crm2-maint-write-5', moduleId: 'crm2-maint-writing',
    question: 'If the description just repeats the header, what\'s the problem?',
    options: [
      'Nothing — repetition is fine for clarity',
      'The provider is being asked to quote on nothing; the description must add make, model, symptom and consequence',
      'The header should be deleted instead',
      'The job will be flagged as a duplicate',
    ],
    correct: 1,
    rationale: '"New cooker / New Cooker" tells the provider nothing. The description must add something the header doesn\'t — make, model, symptom, consequence.',
  },
  {
    id: 'q-crm2-maint-write-6', moduleId: 'crm2-maint-writing',
    question: 'Why not open a description with "Hi Joe, please attend today…"?',
    options: [
      'It\'s too informal for a contractor',
      'The description is a permanent record read by several people — put the greeting in the message, and write the fault as a record',
      'Contractors can\'t read greetings in the system',
      'It triggers an automatic reminder',
    ],
    correct: 1,
    rationale: 'The description is a permanent record read by several people over the life of the job. Put the greeting in the message, not the job, and state the fault as a record.',
  },

  // crm2-maint-provider
  {
    id: 'q-crm2-maint-prov-1', moduleId: 'crm2-maint-provider',
    question: 'Who chooses the provider on a maintenance job?',
    options: [
      'The agent picks the best-matched contractor automatically',
      'You do — provider selection is never automatic in the maintenance flow',
      'The landlord always names the firm',
      'The tenant selects from a list',
    ],
    correct: 1,
    rationale: 'In the maintenance flow the agent does not assign providers. The choice of firm is always the operator\'s — an operator checkpoint every single time.',
  },
  {
    id: 'q-crm2-maint-prov-2', moduleId: 'crm2-maint-provider',
    question: 'What does the system pre-fill for you at provider selection?',
    options: [
      'The specific contractor to use',
      'Only the service it classified after triage — the choice of firm is still yours',
      'The quote amount',
      'The visit date',
    ],
    correct: 1,
    rationale: 'The system only pre-fills the service it classified after triage. The choice of firm is always yours.',
  },
  {
    id: 'q-crm2-maint-prov-3', moduleId: 'crm2-maint-provider',
    question: 'The provider will need to see the job before pricing it. Which button do you use?',
    options: [
      'Assign provider & start online quoting',
      'Go to Quotation Scheduling',
      'Set Provider Quote',
      'Postpone',
    ],
    correct: 1,
    rationale: 'Use "Go to Quotation Scheduling" when the provider will price on site. "Assign provider & start online quoting" is for a remote price.',
  },
  {
    id: 'q-crm2-maint-prov-4', moduleId: 'crm2-maint-provider',
    question: 'What communications does the agent send during the provider-selection stage?',
    options: [
      'A notice to the landlord and a chase to the tenant',
      'None at all — no letters and no reminders are sent on this stage',
      'A reminder to the provider every day',
      'A confirmation SMS to the tenant',
    ],
    correct: 1,
    rationale: 'The agent raises your task with the picker open and stops. No letters and no reminders are sent on this stage at all.',
  },

  // crm2-maint-quoting
  {
    id: 'q-crm2-maint-quote-1', moduleId: 'crm2-maint-quoting',
    question: 'What decides whether the landlord has to approve a quote?',
    options: [
      'Whether the tenant agrees to the price',
      'The property\'s threshold — within it goes to scheduling, over it goes to landlord quote approval',
      'Whether the provider is onboarded',
      'The time of day the quote arrives',
    ],
    correct: 1,
    rationale: 'Every quote is compared against the property\'s threshold, VAT included. Within it, the job goes straight to scheduling; over it, the landlord is asked to agree to pay.',
  },
  {
    id: 'q-crm2-maint-quote-2', moduleId: 'crm2-maint-quoting',
    question: 'A quotation file arrives, and it names a different figure from the amount typed in the email body. Which wins?',
    options: [
      'The amount in the email body',
      'The quotation file — the amount and scope are read from the document',
      'Whichever is lower',
      'Neither — the operator must re-key both',
    ],
    correct: 1,
    rationale: 'A quotation file beats any amount typed in the email body: the amount and scope are read from the document.',
  },
  {
    id: 'q-crm2-maint-quote-3', moduleId: 'crm2-maint-quoting',
    question: 'When do YOU enter a price by hand with Set Provider Quote?',
    options: [
      'Every time a provider replies with a price',
      'Only when the agent couldn\'t read the figure the provider gave',
      'Whenever the quote is over threshold',
      'Never — the agent always enters it',
    ],
    correct: 1,
    rationale: 'Any price the agent can read is compared and routed without asking you. You only ever enter a price it couldn\'t read.',
  },
  {
    id: 'q-crm2-maint-quote-4', moduleId: 'crm2-maint-quoting',
    question: 'The provider says he can\'t price the job without seeing it. What does the agent do?',
    options: [
      'Cancels the request',
      'Moves it to scheduling to arrange an inspection; the price comes afterwards',
      'Escalates it to the landlord',
      'Assigns a different provider automatically',
    ],
    correct: 1,
    rationale: 'If he can\'t price it unseen, the agent moves the request to scheduling, and the price comes after an inspection visit.',
  },
  {
    id: 'q-crm2-maint-quote-5', moduleId: 'crm2-maint-quoting',
    question: 'A landlord writes in about doing the job himself while the provider is still quoting. What happens?',
    options: [
      'It waits until the provider\'s quote is in',
      'It is always escalated to you, whatever the provider is doing',
      'The agent moves it straight to Landlord DIY',
      'It is ignored until scheduling',
    ],
    correct: 1,
    rationale: 'A landlord writing in about DIY or his own contractor is always escalated to you, whatever the provider is doing.',
  },
  {
    id: 'q-crm2-maint-quote-6', moduleId: 'crm2-maint-quoting',
    question: 'A quote comes back within the property\'s threshold. Where does the job go?',
    options: [
      'To the landlord for approval anyway',
      'Straight to scheduling — the landlord isn\'t asked',
      'Back to the provider for a second quote',
      'To the invoice check',
    ],
    correct: 1,
    rationale: 'Within the threshold, the job goes straight to scheduling. The landlord is only ever asked when the threshold is exceeded.',
  },

  // crm2-maint-invoice
  {
    id: 'q-crm2-maint-inv-1', moduleId: 'crm2-maint-invoice',
    question: 'Do you review quotations the way you review invoices?',
    options: [
      'Yes — both need a human check',
      'No — you check invoices; quotations are read and routed automatically',
      'Only quotations over threshold',
      'Only the first quotation on a job',
    ],
    correct: 1,
    rationale: 'You check invoices; you never check quotations. Quotations are read and routed by threshold automatically — an invoice always waits for a human.',
  },
  {
    id: 'q-crm2-maint-inv-2', moduleId: 'crm2-maint-invoice',
    question: 'Where does the invoice check sit in the flow?',
    options: [
      'It\'s the first checkpoint, before triage',
      'It\'s your third and final checkpoint on a clean job — a task that doesn\'t change the stage',
      'It\'s a stage of its own between scheduling and the visit',
      'It only appears on landlord-DIY jobs',
    ],
    correct: 1,
    rationale: 'The invoice check is your third and final checkpoint on a clean job. It\'s a task, not a stage — it arrives on whatever stage the request is on and doesn\'t change it.',
  },
  {
    id: 'q-crm2-maint-inv-3', moduleId: 'crm2-maint-invoice',
    question: 'What\'s the difference between "Invalid invoice" and "Invoice not needed"?',
    options: [
      'They do the same thing',
      'Invalid means the document is wrong and the provider is asked to correct it; Not needed is no complaint and nothing is sent to him',
      'Invalid closes the job; Not needed re-opens it',
      'Invalid pays the provider; Not needed refuses payment',
    ],
    correct: 1,
    rationale: 'Invalid is a complaint about the document — the provider is asked to correct it. Not needed is no complaint at all — nothing is sent to him.',
  },
  {
    id: 'q-crm2-maint-inv-4', moduleId: 'crm2-maint-invoice',
    question: 'An invoice comes in higher than the quote the landlord agreed. What do you do?',
    options: [
      'Send it back to the landlord to approve the extra',
      'Resolve it on the invoice review screen — it\'s not a question for the landlord',
      'Reject it and cancel the job',
      'Pay it without question',
    ],
    correct: 1,
    rationale: 'An invoice that exceeds an agreed quote is a question for the review screen — not something to send back to the landlord.',
  },
  {
    id: 'q-crm2-maint-inv-5', moduleId: 'crm2-maint-invoice',
    question: 'What must you check before approving an invoice?',
    options: [
      'That the provider is onboarded',
      'That the Subtotal, VAT and Total add up — the fields are editable',
      'That the landlord has seen it',
      'That the tenant confirms the work',
    ],
    correct: 1,
    rationale: 'Check that Subtotal, VAT and Total add up — the fields are editable — then approve.',
  },

  // crm2-maint-branches
  {
    id: 'q-crm2-maint-branch-1', moduleId: 'crm2-maint-branches',
    question: 'On a Landlord DIY job, who do we ask whether the work is done?',
    options: [
      'The landlord',
      'The tenant — only the resident can see whether anyone came',
      'The provider',
      'Nobody — it closes automatically',
    ],
    correct: 1,
    rationale: 'We ask the tenant, not the landlord, whether the work is done — only the resident can see whether anyone came. No documents are required.',
  },
  {
    id: 'q-crm2-maint-branch-2', moduleId: 'crm2-maint-branches',
    question: 'What\'s the difference between Cancel Request and No Works Needed?',
    options: [
      'They behave identically',
      'Cancel Request cancels quietly with no letters; No Works Needed sends stand-down letters',
      'Cancel Request sends letters; No Works Needed is silent',
      'No Works Needed re-opens the job later',
    ],
    correct: 1,
    rationale: 'Cancel Request cancels quietly — reminders dropped, nobody written to. No Works Needed sends stand-down letters to the tenant, the provider, and the landlord in your own words.',
  },
  {
    id: 'q-crm2-maint-branch-3', moduleId: 'crm2-maint-branches',
    question: 'What is the reminder cadence on a Landlord DIY job?',
    options: [
      '+1 and +2 working days',
      '+10 and +14 working days — the longest SLA in the flow, and the one most likely to be forgotten',
      'No reminders at all',
      'Every working day until confirmed',
    ],
    correct: 1,
    rationale: 'Reminders fire at +10 and +14 working days (or from a promised completion date). This is the longest SLA in the flow and the one most easily forgotten.',
  },
  {
    id: 'q-crm2-maint-branch-4', moduleId: 'crm2-maint-branches',
    question: 'When a request is in Manual, what does the agent send?',
    options: [
      'Its normal letters and reminders',
      'Nothing — no letters, SMS or reminders; all communication is human-owned',
      'Only reminders, no letters',
      'A daily status to the landlord',
    ],
    correct: 1,
    rationale: 'In Manual the agent initiates nothing — no letters, no SMS, no reminders. All communication is human-owned, and inbound messages surface to you as tasks.',
  },
  {
    id: 'q-crm2-maint-branch-5', moduleId: 'crm2-maint-branches',
    question: 'How do you put a manual request back onto a normal stage?',
    options: [
      'It returns on its own after a few days',
      'Use Take Over, then Provide Instructions',
      'Cancel and re-create the request',
      'Use No Action Needed',
    ],
    correct: 1,
    rationale: 'Use Take Over, then Provide Instructions, to put the request back on a stage.',
  },
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
    id: 'recap-apr-2026',
    month: 'April',
    label: 'April 2026',
    theme: 'Inspections & Right to Rent',
    focus: ['Inspection Reports', 'Share Codes', 'Digital Checks', 'Visual Likeness'],
    questionModuleIds: ['ins-02', 'sup-02'],
    questionCount: 15,
    completed: false,
  },
  {
    id: 'recap-may-2026',
    month: 'May',
    label: 'May 2026',
    theme: 'Compliance & Deposits',
    focus: ['Gas Safety', 'Deposit Protection', 'TDS Schemes'],
    questionModuleIds: ['cmp-02'],
    questionCount: 15,
    completed: false,
  },
  {
    id: 'recap-jun-2026',
    month: 'June',
    label: 'June 2026',
    theme: 'Maintenance & Move-Outs',
    focus: ['Contractor Management', 'Dilapidations', 'End of Tenancy', 'Fair Wear & Tear'],
    questionModuleIds: ['mnt-02', 'mvt-02'],
    questionCount: 15,
    completed: false,
  },
]

// ─── Product Release Quizzes ──────────────────────────────────────────────────

export interface ProductReleaseQuiz {
  id: string           // e.g. 'release-contractor-portal-2026'
  title: string
  subtitle: string
  date: string         // ISO date of release
  passmark: number
  mandatory: boolean
}

export const PRODUCT_RELEASE_QUIZZES: ProductReleaseQuiz[] = [
  {
    id: 'release-contractor-portal-2026',
    title: 'New Product Release Quiz',
    subtitle: 'Contractor Portal Update — June 2026',
    date: '2026-06-01',
    passmark: 80,
    mandatory: true,
  },
]

// ─── Product Release Quiz Questions ──────────────────────────────────────────

export const PRODUCT_RELEASE_QUESTIONS: (QuizQuestion & { releaseId: string })[] = [
  {
    id: 'q-rel-cp-01', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'How can a contractor quickly find a specific job in the updated portal?',
    options: [
      'By scrolling through the full job list chronologically',
      'By searching using the job number or property address, and filtering by job status',
      'By filtering by contractor name only',
      'By contacting the PM to locate the job reference number',
    ],
    correct: 1,
    rationale: 'The updated contractor portal includes search by job number or property address, plus status filters — allowing contractors to quickly locate the jobs they need without scrolling.',
  },
  {
    id: 'q-rel-cp-02', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'What does the new Schedule tab show?',
    options: [
      'A monthly calendar view of all compliance certificate expiry dates',
      'A list of all jobs currently in Pause mode awaiting a response',
      'All upcoming appointments for a selected day in one place',
      'A weekly overview of all open maintenance jobs across the portfolio',
    ],
    correct: 2,
    rationale: 'The new Schedule tab gives contractors a single view of all upcoming appointments for a selected day, making it easier to plan visits without jumping between individual jobs.',
  },
  {
    id: 'q-rel-cp-03', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'Who can now set a visit date and time directly in the contractor portal?',
    options: [
      'Only the Property Manager, after receiving confirmation from the contractor',
      'The tenant, via the tenant portal',
      'Contractors can set the visit date and time directly in the portal themselves',
      'The Team Coordinator, after the contractor confirms availability by phone',
    ],
    correct: 2,
    rationale: 'Contractors can now set their own visit date and time directly in the portal — removing the need to relay this information via phone or email through the PM.',
  },
  {
    id: 'q-rel-cp-04', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'What happens automatically once a contractor sets a visit date in the portal?',
    options: [
      'The job is moved to completed status pending invoice upload',
      'The system parses the date and sends confirmation emails to all parties',
      'The contractor receives a payment confirmation before the visit is booked',
      'The landlord is asked to approve the visit before the tenant is notified',
    ],
    correct: 1,
    rationale: 'Once a contractor sets a visit date, the system automatically parses it and sends confirmation emails to all relevant parties — the tenant, landlord, and PM — without manual intervention.',
  },
  {
    id: 'q-rel-cp-05', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'Which document types can contractors upload on a compliance job?',
    options: [
      'Proof of works only',
      'Invoices and proof of works',
      'Certificates and invoices',
      'Certificates only',
    ],
    correct: 2,
    rationale: 'On compliance jobs, contractors can upload certificates and invoices. Proof of works is available on maintenance jobs, not compliance jobs.',
  },
  {
    id: 'q-rel-cp-06', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'Which document types can contractors upload on a maintenance job?',
    options: [
      'Certificates and invoices',
      'Certificates only',
      'Proof of works only',
      'Invoices and proof of works',
    ],
    correct: 3,
    rationale: 'On maintenance jobs, contractors can upload invoices and proof of works. Certificates are specific to compliance jobs and are not available as an upload type on maintenance jobs.',
  },
  {
    id: 'q-rel-cp-07', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'How can contractors now communicate with tenants directly from the portal?',
    options: [
      'By sending a letter template generated in the portal',
      'Via the job chat only — direct contact is not permitted',
      'By calling the tenant directly from the portal',
      'By requesting the PM forwards their message on their behalf',
    ],
    correct: 2,
    rationale: 'Contractors can now call tenants directly from the contractor portal — allowing them to coordinate access and visit details without needing to go through the PM.',
  },
  {
    id: 'q-rel-cp-08', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'Which of the following best describes the mobile update to the contractor portal?',
    options: [
      'A dedicated mobile app has been released on the App Store and Google Play',
      'The portal is now accessible on mobile devices via a mobile-optimised browser experience',
      'Mobile access is available for document uploads only, not job management',
      'Mobile access requires a separate login to the standard desktop credentials',
    ],
    correct: 1,
    rationale: 'The contractor portal is now mobile-optimised, meaning contractors can access their full job list, schedule, and upload documents from any mobile browser using their existing login.',
  },
  {
    id: 'q-rel-cp-09', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'A contractor has completed a compliance job and needs to upload both the certificate and their invoice. What should they do?',
    options: [
      'Upload both via the maintenance job — compliance and maintenance jobs share the same upload flow',
      'Upload both via the compliance job in the contractor portal — both document types are supported on compliance jobs',
      'Upload the certificate via the compliance job and email the invoice to the PM separately',
      'Only the certificate can be uploaded — invoices on compliance jobs must be processed manually by the PM',
    ],
    correct: 1,
    rationale: 'Compliance jobs support both certificate and invoice uploads directly in the contractor portal. There is no need to email the invoice separately — both documents can be uploaded against the same job.',
  },
  {
    id: 'q-rel-cp-10', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'A contractor sets a visit date in the portal but the tenant later says they never received a confirmation. What is the most likely explanation and correct next step?',
    options: [
      'The contractor must have entered the wrong date format — the job should be deleted and recreated with the correct date',
      'Confirmation emails are only sent to landlords, not tenants — the PM should contact the tenant directly',
      'The tenant may not have an email address recorded in Dwelly — the PM should check the tenant\'s contact details and ensure a valid email is on file',
      'The portal only sends confirmation emails for compliance jobs — maintenance visit confirmations must be sent manually',
    ],
    correct: 2,
    rationale: 'Confirmation emails are sent automatically to all parties when a visit date is set — but only if valid contact details are on file. If a tenant hasn\'t received one, the most likely cause is a missing or incorrect email address in Dwelly.',
  },
  {
    id: 'q-rel-cp-11', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'A contractor uses the new portal feature to call a tenant directly. The tenant later complains the contractor was rude during the call. How should the PM handle this?',
    options: [
      'The PM cannot take action as the call was made directly between the contractor and tenant — it falls outside Dwelly\'s remit',
      'Raise the complaint with the contractor and document it in the job chat — direct contractor-tenant calls are a portal feature but the PM remains responsible for the service standard',
      'Disable the contractor\'s portal access immediately until the complaint is resolved',
      'Advise the tenant to contact the contractor\'s company directly — once a contractor calls a tenant, responsibility transfers to the contractor',
    ],
    correct: 1,
    rationale: 'Even though the contractor called the tenant directly via the portal, the PM remains responsible for the overall service standard. The complaint should be raised with the contractor, documented in the job chat, and handled through the standard contractor management process.',
  },
  {
    id: 'q-rel-cp-12', moduleId: 'release-contractor-portal-2026', releaseId: 'release-contractor-portal-2026',
    question: 'Which of the following statements about the search and filter functionality in the contractor portal is correct?',
    options: [
      'Contractors can only search by job number — address search is not available in the portal',
      'The status filter allows contractors to quickly identify jobs at specific stages, such as those awaiting a visit date or pending document upload',
      'Search results show all jobs across all contractors in the agency — individual filtering is not available',
      'The filter and search functions are only available on desktop and cannot be used on mobile',
    ],
    correct: 1,
    rationale: 'The status filter in the contractor portal allows contractors to view jobs at specific stages — for example, jobs awaiting a visit date or those pending document upload — making workload management significantly faster.',
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
    date: '2026-05-01',
    title: 'Renters\' Rights Act: Section 21 abolished — what this means for you',
    category: 'compliance',
    description: 'From 1 May 2026, Section 21 "no-fault" evictions are abolished. Landlords can no longer end a tenancy without a legal reason. The only route to possession is now a Section 8 notice citing one of 37 statutory grounds. Any Section 21 notices served before 1 May may still run their course under transitional rules, but no new ones can be served. If a tenant needs to be asked to leave, a valid Section 8 ground and correct notice must be in place before any action is taken.',
    isNew: true,
  },
  {
    id: 'upd-002',
    date: '2026-05-01',
    title: 'Renters\' Rights Act: Fixed-term tenancies are abolished',
    category: 'compliance',
    description: 'Fixed-term ASTs no longer exist. All tenancies are now Assured Periodic Tenancies, rolling month-to-month (or week-to-week) with no end date. All existing fixed-term tenancies automatically converted on 1 May 2026 — fixed-term end dates have no legal effect. Tenants can give 2 months\' notice at any time after the first 4 months of the tenancy. Landlords cannot give equivalent notice — possession requires a Section 8 ground. There are no more "end of tenancy" processes for fixed terms.',
    isNew: true,
  },
  {
    id: 'upd-003',
    date: '2026-05-01',
    title: 'Renters\' Rights Act: New Section 8 grounds — key changes',
    category: 'compliance',
    description: 'The Section 8 possession grounds have expanded from 17 to 37. Key changes: (1) New mandatory Ground 1A — landlord can seek possession if they intend to sell, requiring 4 months\' notice. (2) Ground 8 rent arrears threshold raised to 3 months\' rent (was 2 months). (3) Ground 7A for anti-social behaviour now has a lower evidential threshold. Every notice must cite the correct ground with supporting evidence — incorrect or unsupported notices will fail at court. All possession action must now follow this process.',
    isNew: true,
  },
  {
    id: 'upd-004',
    date: '2026-05-01',
    title: 'Renters\' Rights Act: Tenants can now challenge rent increases',
    category: 'compliance',
    description: 'Rent can only be increased once per year, using a formal Section 13 notice. Tenants can now challenge any proposed increase at the First-tier Tribunal for a £47 fee. Once challenged, the increase is automatically suspended. Critically, the Tribunal can only set rent at or below the landlord\'s proposed figure — it cannot award more than was proposed. The Tribunal will not consider the landlord\'s mortgage costs when determining market rent. Rent increase notices must be accurate and well-timed to avoid disputes.',
    isNew: true,
  },
  {
    id: 'upd-005',
    date: '2026-05-01',
    title: 'Renters\' Rights Act: Tenant right to request pets',
    category: 'compliance',
    description: 'Tenants now have a statutory right to request permission to keep a pet. Landlords must respond in writing within 28 days of the request. Consent cannot be unreasonably withheld, and each request must be assessed on its own merits. No separate pet deposit or pet fee can be charged — the existing 5-week deposit cap applies to all deposits. If a landlord refuses and the tenant disputes it, they can escalate to the PRS Ombudsman (once operational) or court. Pet requests must be handled carefully and within the 28-day window.',
    isNew: true,
  },
  {
    id: 'upd-006',
    date: '2026-05-01',
    title: 'Renters\' Rights Act: Advance rent capped at one month',
    category: 'compliance',
    description: 'Landlords and agents are now prohibited from requesting or requiring more than one month\'s rent in advance. Large upfront payments (e.g. 3 or 6 months in advance) are banned. The tenancy deposit cap remains at 5 weeks\' rent. These changes are in force immediately — any new tenancies or move-ins must comply. Move-out financial reconciliations and deposit processes are otherwise unchanged.',
    isNew: true,
  },
  {
    id: 'upd-007',
    date: '2026-05-01',
    title: 'How to Rent guide replaced — new RRA Information Sheet required',
    category: 'compliance',
    description: 'The government\'s How to Rent guide has been replaced. From 1 May 2026, landlords must provide tenants with the new Renters\' Rights Act Information Sheet 2026 at the start of every new tenancy. Always download the latest version from GOV.UK immediately before serving — do not use saved copies, as the version may have changed. If a tenancy converts and the document has been updated since it was last served, re-issue the latest version.',
    isNew: true,
  },
  {
    id: 'upd-008',
    date: '2026-05-01',
    title: 'Renters\' Rights Act: PRS Ombudsman and landlord database coming',
    category: 'compliance',
    description: 'The Renters\' Rights Act creates a mandatory Private Rented Sector Ombudsman that all private landlords in England must join. A publicly searchable PRS Database (landlord register) is also being introduced. Both are being rolled out gradually from late 2026, with full operation expected around 2028. Tenants will be able to raise complaints for free. Landlords who fail to engage with Ombudsman decisions will face automatic awards against them. No action is required yet, but watch for further guidance from Dwelly.',
    isNew: true,
  },
  {
    id: 'upd-009',
    date: '2026-04-10',
    title: 'EPC Band C minimum confirmed — required by October 2030',
    category: 'compliance',
    description: 'The government has confirmed that all privately rented properties in England and Wales must achieve a minimum EPC Band C by 1 October 2030. The cost cap is set at £10,000 per property (inclusive of VAT). Expenditure from 1 October 2025 onwards counts towards the cap — so work carried out now is already accumulating. Non-compliance penalties can reach £30,000 per property. Properties currently at Band E remain compliant for now, but landlords should begin planning improvement works. Note: from October 2026, EPCs will adopt a new multi-metric framework.',
    isNew: false,
  },
  {
    id: 'upd-010',
    date: '2026-04-01',
    title: 'Right to Rent: eVisa transition — physical documents are gone',
    category: 'compliance',
    description: 'The UK\'s transition from physical Biometric Residence Permits (BRPs) to digital eVisas completed in January 2025. Many tenants with a right to rent now have no physical immigration document — only an eVisa accessible via the GOV.UK online service. For these tenants, landlords must use the online share code service to carry out the Right to Rent check. Photocopies of expired BRPs do not provide a statutory excuse. If a tenant cannot produce a document or a valid share code, do not proceed and seek guidance. Penalties for a failed check are up to £10,000 per tenant for a first offence.',
    isNew: false,
  },
  {
    id: 'upd-011',
    date: '2026-04-01',
    title: 'Awaab\'s Law — private sector extension expected 2027',
    category: 'compliance',
    description: 'Awaab\'s Law — which requires landlords to investigate and resolve damp, mould, and other hazards within strict legal timeframes — is already in force for social housing (from October 2025). The government has confirmed it will extend to the private rented sector, expected from 2027, pending consultation. PMs should be aware this is coming: reviewing current damp and mould response processes now will help avoid compliance pressure when the duty becomes mandatory.',
    isNew: false,
  },
]
