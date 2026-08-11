// CRM 2.0 learning content.
//
// The Hub-native rebuild of the CRM 2.0 operator material (originally an offline
// reference dashboard + a working agenda). Restructured into focused lessons
// grouped under three pillars. Sensitive/internal details from the source
// (shared passwords, internal request IDs, real addresses, agency and staff
// names) are deliberately omitted — examples are genericised.
//
// Adding a lesson: append to CRM2_LESSONS with a unique slug and a pillar. The
// landing page groups by pillar automatically and the [slug] page renders the
// blocks. No other wiring needed.

export interface Crm2Block {
  type: 'heading' | 'subheading' | 'paragraph' | 'bullets' | 'steps' | 'callout' | 'table' | 'divider' | 'image'
  text?: string
  items?: string[]
  level?: 1 | 2 | 3
  variant?: 'info' | 'warning' | 'tip' | 'important'
  headers?: string[]
  rows?: string[][]
  src?: string          // for type 'image' — path under /public; `text` is the caption
}

export type Crm2Pillar = 'orientate' | 'features' | 'operate'

export interface Crm2Lesson {
  slug: string
  title: string
  summary: string
  icon: string          // emoji, shown on cards and the lesson header
  pillar: Crm2Pillar
  readTime: string
  content: Crm2Block[]
  quizModuleId?: string   // e.g. 'crm2-how-it-works' — renders a "Test yourself" card
}

// Every lesson is checked against the live CRM 2.0 build on this date. Because
// 2.0 is changing fast, the lesson pages show this as a "freshness" badge so
// the team can see the material is current. Bump it whenever the set is reviewed.
export const CRM2_LAST_REVIEWED = '6 Aug 2026'

// The capstone is a single assessment that samples across every lesson quiz —
// the "you're signed off on 2.0" check. It isn't a normal per-lesson quiz, so
// its module id and sample size live here and are shared by the quiz route and
// the assessments page (which otherwise count questions per module).
export const CRM2_CAPSTONE_MODULE_ID = 'crm2-capstone'
export const CRM2_CAPSTONE_SAMPLE = 20

export const CRM2_PILLARS: { id: Crm2Pillar; label: string; description: string }[] = [
  { id: 'orientate', label: 'Get orientated', description: 'How CRM 2.0 works and how to find your way around it.' },
  { id: 'features',  label: 'Master the features', description: 'The buttons, actions and workflows that get jobs done.' },
  { id: 'operate',   label: 'Work smarter', description: 'Timing, edge cases and the habits of a great operator.' },
]

export const CRM2_LESSONS: Crm2Lesson[] = [
  // ─── Get orientated ──────────────────────────────────────────────────────
  {
    slug: 'how-it-works',
    title: 'How CRM 2.0 works: the agent & you',
    summary: 'The agent-first model — what runs automatically, and the decisions that are always yours.',
    icon: '🤖',
    pillar: 'orientate',
    readTime: '5 min read',
    quizModuleId: 'crm2-how-it-works',
    content: [
      { type: 'heading', text: 'An agent that runs the job, and you for the human calls' },
      { type: 'paragraph', text: 'Each request is a single compliance-certificate job — a Gas Safety Certificate (CP12), an EICR, an EPC, and so on. An AI agent runs the routine from end to end; you, the operator, make the decisions that need a human. Understanding that split is the key to working well in 2.0.' },
      { type: 'callout', variant: 'info', text: 'Think of it as two lanes. The agent lane runs autonomously — chasing, booking and reminding. The operator lane is where you step in for the human decisions. Around them sit two side flows: remedial works, and landlord-DIY.' },
      { type: 'image', src: '/crm2/flow-diagram.png', text: 'The full compliance flow: the main path across the top, with the landlord-DIY, remedial and boiler-service branches coming off it.' },

      { type: 'heading', text: 'The main path' },
      { type: 'paragraph', text: 'Most jobs travel through these stages, driven by the agent, with one checkpoint that is always yours (Certificate review):' },
      { type: 'steps', items: [
        'Landlord approval — the agent asks the landlord to authorise the work.',
        'Provider selection — the agent finds a contractor.',
        'Scheduling — the agent brokers a date between the parties.',
        'Visit — the agent confirms and sends a reminder the day before.',
        'Result awaiting — the agent chases the certificate.',
        'Certificate review — your checkpoint: check the document and its dates.',
        'Invoice awaiting / review — the invoice comes in and is checked.',
        'Completed.',
      ]},

      { type: 'heading', text: 'The side flows' },
      { type: 'subheading', text: 'Remedial branch' },
      { type: 'paragraph', text: 'When extra works are found at Certificate review, the job branches: Quotation awaiting (the agent asks the contractor for a quote) → Quotation review (you approve it) → Landlord quote approval (the landlord agrees to pay) → a repeat visit to complete the works, or Remedial terminated if it stops there.' },
      { type: 'subheading', text: 'Landlord DIY' },
      { type: 'paragraph', text: 'At Landlord approval the landlord can choose to arrange the work themselves. The agent then waits for the landlord\u2019s certificate, which comes back into Certificate review like any other.' },
      { type: 'subheading', text: 'Boiler service (CP12)' },
      { type: 'paragraph', text: 'A boiler service can attach at landlord approval without changing the job\u2019s stages — it rides along with the CP12.' },

      { type: 'heading', text: 'Ground rules' },
      { type: 'bullets', items: [
        'Read the whole job before acting. The agent often suggests an action based only on the most recent activity; the broader history may point to a different decision.',
        'Only handle flags for now. Don\u2019t process jobs that haven\u2019t escalated.',
        'Don\u2019t take over just to call early. If there\u2019s no new urgent information to process, let the agent work — it will escalate when it needs you.',
        'If you\u2019re not 100% sure, ask.',
        'Be proactive with feedback. Inconsistencies, bugs and edge cases are far more valuable surfaced early than a job quietly pushed forward the wrong way.',
      ]},
    ],
  },
  {
    slug: 'navigating',
    title: 'Finding your way around',
    summary: 'The requests queue, the job screen, and how to read a job at a glance.',
    icon: '🧭',
    pillar: 'orientate',
    readTime: '5 min read',
    quizModuleId: 'crm2-navigating',
    content: [
      { type: 'heading', text: 'The requests queue' },
      { type: 'paragraph', text: 'Your landing page lists every CRM 2.0 job, with columns for the job ID, property, agency, certificate type and status. A few controls keep it focused:' },
      { type: 'bullets', items: [
        'Use the dropdown to filter to your assigned Property Managers.',
        'Use Hide cancelled and Hide completed to clear the noise.',
        'An orange flag means the job has escalated and needs a human. For now, these flagged jobs are the only ones you action.',
      ]},

      { type: 'heading', text: 'Opening a job' },
      { type: 'paragraph', text: 'Click Open on a job to see its full detail. The screen has three areas: the activity panel on the left, the property panel on the right, and the action area at the bottom.' },

      { type: 'subheading', text: 'The activity panel (left)' },
      { type: 'bullets', items: [
        'A chronological history of everything the agent has done, plus every message to and from the parties.',
        'It reads like a messaging app — inbound messages sit on the left, outbound on the right.',
        'Show more expands an email preview; View full email opens it in a modal.',
        'AI Summary gives a quick read of the current state and what happens next.',
      ]},
      { type: 'callout', variant: 'warning', text: 'Don\u2019t rely on the AI summary alone. 2.0 is new and summaries are still maturing — always read the job chronology so you\u2019re fully up to speed before you act.' },

      { type: 'subheading', text: 'The property panel (right)' },
      { type: 'bullets', items: [
        'Property details, the certificate type (e.g. Gas Safety CP12), the agency, and the list of Planned Actions.',
        'The Contacts tab shows the landlord, tenant and contractor details, with a Call button.',
      ]},

      { type: 'subheading', text: 'The action area (bottom)' },
      { type: 'bullets', items: [
        'If the job needs you, an Action Required panel appears with a short summary and history.',
        'If it doesn\u2019t, you\u2019ll see a grey \u201CNo active task — agent is monitoring\u201D bar, meaning the agent still has it.',
        'The bottom-right holds the job buttons, including Take Over.',
      ]},

      { type: 'heading', text: 'Escalation handling — call first' },
      { type: 'callout', variant: 'tip', text: 'By default, calling is your primary way to follow up or progress a job — whether that\u2019s the contractor, the tenant or the landlord. Always send a follow-up email afterwards, including every time you leave a voicemail, so the recipient can find the right thread to reply to.' },
    ],
  },
  {
    slug: 'touchpoints-and-timing',
    title: 'When the system hands over to you',
    summary: 'The designed human checkpoints, and how long the agent chases before it escalates.',
    icon: '⏱️',
    pillar: 'orientate',
    readTime: '5 min read',
    quizModuleId: 'crm2-touchpoints',
    content: [
      { type: 'heading', text: 'Designed touchpoints — where a human is always needed' },
      { type: 'paragraph', text: 'These are the moments the system is built to hand over to you. They happen on every relevant job, by design.' },
      { type: 'table',
        headers: ['Touchpoint', 'When it happens', 'What you do'],
        rows: [
          ['Certificate review', 'Every job, once a certificate passes the AI check', 'Check the recognised dates against the document'],
          ['Invoice review', 'Every job that has an invoice', 'Check the subtotal / VAT / total add up and the reference is right'],
          ['Quotation review', 'Remedial branch, when a quote for extra works arrives', 'Check the amount and the work description'],
          ['Approval message', 'Any stage, when the agent drafts a free-text (non-template) email or a non-standard SMS', 'Read it, edit if needed, then confirm to send or reject to write your own'],
          ['Landlord quote approval', 'Remedial branch, the landlord\u2019s yes/no on paying', 'Usually nothing; if it escalates, record their response'],
          ['Resolve a task', 'Any stage, when the agent hands a decision over — or when you Take Over', 'Pick a stage resolution (Wait / Cancel / Landlord DIY / Select another provider / Add direct info)'],
        ],
      },

      { type: 'heading', text: 'How long the agent chases before it escalates' },
      { type: 'paragraph', text: 'Each stage has a designed reminder cadence. This is roughly when a job will land with you rather than being handled automatically.' },
      { type: 'table',
        headers: ['Stage', 'Reminders', 'Then'],
        rows: [
          ['Landlord approval', '+1 working day, +3 days', '+4 days: auto-advance (ordinary jobs); EPC escalates to you'],
          ['Provider selection', 'Instant', 'Escalates only if no contractor is found'],
          ['Scheduling', 'Nudges whichever side is silent', 'Escalates on a deadlock'],
          ['Visit', 'One reminder the day before', 'Auto-advances once the date passes'],
          ['Result awaiting', '+1 day, +2 days', '+3 days: escalates to you'],
          ['Invoice awaiting', '+1 day', '+3 days: escalates to you'],
          ['Quotation awaiting', '+1 day', '+3 days: escalates to you'],
          ['Landlord quote approval', '+3 days', '+7 days: escalates (money decision)'],
          ['Landlord DIY', '+10 days', '+14 days: escalates (the landlord is doing it)'],
        ],
      },
      { type: 'callout', variant: 'info', text: 'General rule: reminders are usually +1 and +3 days, stretched out on slow or DIY stages. There\u2019s no hard cap on retries — after the first escalation, a human sets the pace. Terminal states (Completed, Cancelled, Remedial terminated) have no timers.' },
    ],
  },

  // ─── Master the features ─────────────────────────────────────────────────
  {
    slug: 'buttons-and-actions',
    title: 'Buttons & actions',
    summary: 'Send Communication, Add Direct Info, Set Visit Date, Provide Instructions and Take Over — what each is for.',
    icon: '🎛️',
    pillar: 'features',
    readTime: '6 min read',
    quizModuleId: 'crm2-buttons',
    content: [
      { type: 'heading', text: 'Landlord approval buttons — by certificate type' },
      { type: 'paragraph', text: 'Every job starts at Landlord approval, where you authorise the works once the landlord says yes. The buttons differ slightly by certificate type. If the landlord approves by phone, use Landlord approved directly — not Add Direct Info.' },
      { type: 'subheading', text: 'Gas Safety Certificate (CP12)' },
      { type: 'callout', variant: 'warning', text: 'Note the \u201CAdd Boiler Service\u201D button — always double-check whether the landlord wants this done. If it\u2019s unclear from their response, ask again before proceeding.' },
      { type: 'image', src: '/crm2/buttons-cp12.png', text: 'Landlord approval buttons for a CP12 job, including Add Boiler Service.' },
      { type: 'subheading', text: 'Electrical Installation Condition Report (EICR)' },
      { type: 'image', src: '/crm2/buttons-eicr.png', text: 'Landlord approval buttons for an EICR job.' },
      { type: 'subheading', text: 'Energy Performance Certificate (EPC)' },
      { type: 'image', src: '/crm2/buttons-epc.png', text: 'Landlord approval buttons for an EPC job.' },
      { type: 'callout', variant: 'tip', text: 'Landlords often ask for prices before proceeding. Check the cheat sheet, reply to the landlord using Send Communication, then click the appropriate approval button.' },

      { type: 'heading', text: 'Selecting a provider' },
      { type: 'paragraph', text: 'The agent picks the service provider automatically, using our preferred provider unless the landlord requests a specific one. It only escalates to you if the landlord names a provider or no contractor can be found.' },
      { type: 'image', src: '/crm2/providers-table.png', text: 'Preferred Compliance Providers reference.' },
      { type: 'subheading', text: 'If the landlord asks for a specific provider' },
      { type: 'steps', items: [
        'Click \u201CProceed with another provider\u201D.',
        'If they\u2019re not on the preferred list, check the provider panel at panel.dwelly.team/dw-admin/html/pm-providers.',
        'If they\u2019re not on that list either, ask the relevant PMs for feedback, then onboard the provider following the onboarding SOP.',
      ]},
      { type: 'image', src: '/crm2/provider-picker.png', text: 'Selecting an alternative provider via \u201CProceed with another provider\u201D.' },

      { type: 'heading', text: 'Send Communication' },
      { type: 'bullets', items: [
        'Send emails, SMS or notes — now with attachments.',
        'Rich text (bold, italic, bullet lists) plus direct file attachment, so certificates and photos can go out in a properly formatted message without leaving the job.',
      ]},

      { type: 'heading', text: 'Scheduling — brokering the date' },
      { type: 'paragraph', text: 'The agent contacts the tenant and provider to find a matching slot, nudging whichever side is silent and escalating on a deadlock. These are the actions available to you at the Scheduling stage:' },
      { type: 'image', src: '/crm2/buttons-scheduling.png', text: 'The Scheduling-stage action buttons.' },

      { type: 'heading', text: 'Add Direct Info' },
      { type: 'paragraph', text: 'Use this to pass on information you received from one party to the other. Write it as if you are the party you got it from — whatever you type is sent on in full. If the engineer says he can do 11 August at 2pm, you write \u201C11th August 2026 at 2pm\u201D, not an internal note about it.' },
      { type: 'image', src: '/crm2/adi-example.png', text: 'Add Direct Info — worked example (request 585).' },
      { type: 'image', src: '/crm2/adi-panel.png', text: 'The Add Direct Info panel.' },
      { type: 'bullets', items: [
        'It now supports attachments — useful when a document arrives outside the normal email flow (e.g. via Slack).',
        'Choose the right source (e.g. From Provider) and the agent processes it as if it had received the document itself. No need to take over just to upload a file.',
      ]},

      { type: 'heading', text: 'Add Direct Info vs Set Visit Date' },
      { type: 'callout', variant: 'tip', text: 'Rule of thumb: Direct Info = passing on information you received. Set Visit Date = recording an appointment both sides have already agreed.' },
      { type: 'image', src: '/crm2/svd-panel.png', text: 'The Set Visit Date panel.' },
      { type: 'bullets', items: [
        'Relative times the AI won\u2019t accept: if a provider or tenant says \u201Cmorning\u201D, the system won\u2019t treat it as a confirmation. Set the visit date manually rather than waiting for an exact time — treat morning as 8am–12pm.',
        'Tenant reschedules out-of-band (e.g. emails us directly): it arrives as an escalation. Just Set Visit Date to the agreed new slot — replying to the tenant won\u2019t break the automated flow, and no special handling is needed.',
      ]},

      { type: 'heading', text: 'Chasing the tenant & provider' },
      { type: 'paragraph', text: 'When a side goes quiet at Scheduling, chase by phone first, then a confirming email. Never give out direct phone numbers between tenant, landlord and provider — we\u2019re only allowed to share masked ones.' },
      { type: 'image', src: '/crm2/chase-tenant.png', text: 'Chasing the tenant (more edge cases in the SOPs).' },
      { type: 'image', src: '/crm2/chase-provider.png', text: 'Chasing the provider (more edge cases in the SOPs).' },

      { type: 'heading', text: 'Provide Instructions (admin-only)' },
      { type: 'callout', variant: 'warning', text: 'Never use Provide Instructions unless you\u2019ve consulted an admin. It\u2019s now admin-only, along with Reassign Job and Cancel Job — operators still see the button but will be asked to contact an admin. The main accepted case is a job that\u2019s already closed and someone sends a thank-you or an unrelated email, where the instruction is simply \u201Cdo nothing\u201D.' },

      { type: 'heading', text: 'Take Over \u2192 call' },
      { type: 'bullets', items: [
        'Take Over pulls the job out of the agent\u2019s hands so you can act manually.',
        'When you call, always send a follow-up email — including every time you leave a voicemail — so the recipient can find the right email to reply to.',
        'If there are two tenants, it\u2019s better to call the second tenant than the first tenant\u2019s second number: those secondary numbers were copied across without notes.',
      ]},
    ],
  },
  {
    slug: 'rescheduling',
    title: 'Rescheduling',
    summary: 'Restart scheduling without a manual take-over — and let the system read the dates in your message.',
    icon: '📅',
    pillar: 'features',
    readTime: '3 min read',
    quizModuleId: 'crm2-rescheduling',
    content: [
      { type: 'callout', variant: 'info', text: 'New: rescheduling is now built in for jobs already at the Visit or Result awaiting stage. Previously this needed a manual take-over.' },
      { type: 'image', src: '/crm2/visit-jobcard.png', text: 'A job at the Visit stage.' },
      { type: 'paragraph', text: 'From Visit (and Result awaiting) you have two direct rescheduling actions — the right one depends on whether a new time has already been agreed.' },
      { type: 'image', src: '/crm2/buttons-visit.png', text: 'The two rescheduling actions: Reset Visit Date and Restart Scheduling.' },

      { type: 'heading', text: 'Reset Visit Date' },
      { type: 'paragraph', text: 'Use this only when both parties have already agreed the new time — both confirmed in the thread, or one proposed it and you confirmed the other by phone. It updates the job and notifies both sides automatically.' },
      { type: 'image', src: '/crm2/reset-visit-example.png', text: 'Reset Visit Date — worked example.' },

      { type: 'heading', text: 'Restart Scheduling' },
      { type: 'paragraph', text: 'Use this when a new appointment hasn\u2019t been agreed yet. You choose whether to restart with the tenant or the provider, and you write the opening message so the context carries over — for example, \u201Ccan\u2019t do tomorrow, next Monday works\u201D. The other party is told the original is cancelled and a new one is being arranged.' },
      { type: 'callout', variant: 'tip', text: 'Dates you put in your message are recognised and used through the flow — so a natural message like \u201Cnext Monday works\u201D is enough to move things along, and they\u2019re quoted verbatim at the end of the email too.' },
    ],
  },
  {
    slug: 'remedial-works',
    title: 'Remedial works — required vs optional',
    summary: 'Deciding at Certificate review whether remedials are required for compliance or just recommended.',
    icon: '🔧',
    pillar: 'features',
    readTime: '5 min read',
    quizModuleId: 'crm2-remedial-works',
    content: [
      { type: 'paragraph', text: 'At Certificate review you now decide whether remedial works are required for compliance or simply recommended by the engineer. That choice sends the job down the right path.' },

      { type: 'heading', text: 'Required remedials' },
      { type: 'bullets', items: [
        'Click Need required remedial and continue with the remedial flow as usual.',
      ]},

      { type: 'heading', text: 'Optional / recommended remedials (a satisfactory cert with C3 items)' },
      { type: 'steps', items: [
        'Review the certificate as usual — dates and service-provider names.',
        'Click Optional remedial.',
      ]},
      { type: 'callout', variant: 'info', text: 'Expected behaviour, not a bug: confirming C3s on a satisfactory cert in CRM 2.0 automatically creates a maintenance job in CRM 1.0. The optional-remedial workflow lives in 1.0, so seeing the job appear there is correct.' },
      { type: 'bullets', items: [
        'Interim rule on C3-only certs: accept them as satisfactory — the document is satisfactory at this point in time.',
        'Common mistake: don\u2019t redirect a satisfactory cert into the mandatory remedial flow. It\u2019s straightforward on EICRs; on gas certs, if all the appliances are safe to use, treat it as satisfactory.',
      ]},

      { type: 'heading', text: 'Wording for optional remedials on a satisfactory cert' },
      { type: 'callout', variant: 'tip', text: '\u201CHi, your [X] certificate has been deemed satisfactory. The inspection did, however, highlight some optional remedial items (listed below). These aren\u2019t required for the certificate to be valid, but we recommend addressing them. Left unattended, they may deteriorate further and be flagged again at the next inspection. Please let us know if you\u2019d like us to complete the remedials. If we don\u2019t hear from you within 7 days, we\u2019ll proceed with closing the job.\u201D' },

      { type: 'heading', text: 'The remedial branch, once you press Need remedial' },
      { type: 'paragraph', text: 'The job leaves the main path: Quotation awaiting (the agent asks the provider for a quote) → Quotation review (your checkpoint) → Landlord quote approval (the landlord agrees to pay) → approved re-enters Scheduling for the repeat visit / rejected → Remedial terminated.' },

      { type: 'heading', text: 'Quotation review — your checkpoint' },
      { type: 'paragraph', text: 'Once a quote for the extra works arrives, check the amount and the work description before approving.' },
      { type: 'image', src: '/crm2/quotereview-panel.png', text: 'The Quotation review panel.' },
      { type: 'image', src: '/crm2/quote-thread.png', text: 'The quote as it comes through on the job thread.' },
      { type: 'callout', variant: 'tip', text: 'If the contractor hasn\u2019t provided a formal quotation document, attach a screenshot of their quote to the job — an informal fix, no escalation point needed.' },
      { type: 'callout', variant: 'info', text: 'Landlord quote approval: usually nothing to do; if it escalates, record the outcome. If the landlord rejects the quote, call them to confirm whether they\u2019ll seek their own quote or want additional quotes from other agency contractors. Their own contractor must be vetted first; if they decline entirely, assert full landlord DIY.' },
    ],
  },
  {
    slug: 'certificate-review',
    title: 'Certificate review',
    summary: 'What to check on every certificate, AI address flags, wrong-property certs, and reading a CP12.',
    icon: '📄',
    pillar: 'features',
    readTime: '5 min read',
    quizModuleId: 'crm2-certificate-review',
    content: [
      { type: 'heading', text: 'Check on every certificate' },
      { type: 'bullets', items: [
        'Address — landlords sometimes send a certificate for another property in their portfolio.',
        'Numbers — subtotal, VAT and total.',
        'Dates — issue and expiry dates present and accurate, in the right fields on both the certificate and the CRM.',
      ]},

      { type: 'heading', text: 'When the AI flags the address' },
      { type: 'callout', variant: 'info', text: 'No need to correct it. A flagged address is a hint that it might be wrong and worth a look — not an error to fix. A common trigger is a handwritten certificate.' },

      { type: 'heading', text: 'Landlord sends a cert for the wrong property' },
      { type: 'paragraph', text: 'This happens when a landlord has several properties with us and attaches the wrong one. Take two actions, not one — don\u2019t just bounce it back:' },
      { type: 'steps', items: [
        'Upload the cert to the property it actually belongs to (CRM 1 \u2192 File Manager). It\u2019s a valid document for that property — don\u2019t waste it.',
        'Request the correct cert for this job\u2019s property by contacting the landlord.',
      ]},

      { type: 'heading', text: 'Gas certs (CP12) — a unified approach' },
      { type: 'bullets', items: [
        'A CP12 isn\u2019t labelled satisfactory / unsatisfactory the way an EICR is — it categorises each appliance individually.',
        'Check the \u201CSafe to use\u201D column. If every appliance is YES, treat the certificate as satisfactory and any remedials as nice-to-have (follow the optional-remedial flow).',
        'A remedial can be \u201Cnon-satisfactory in spirit\u201D without making the certificate unsatisfactory — for example, a missing flame supervision device on an old hob.',
      ]},
      { type: 'image', src: '/crm2/cp12-safe-to-use.png', text: 'A CP12 with the \u201CSafe to use\u201D column — worked example: a missing flame supervision device on an old hob, still marked satisfactory (request 248).' },

      { type: 'heading', text: 'Reading an EICR' },
      { type: 'bullets', items: [
        'An EICR does carry an overall outcome — Satisfactory or Unsatisfactory — unlike a CP12.',
        'The observations are coded: C1 (danger present), C2 (potentially dangerous) and FI (further investigation) mean work is required; C3 (improvement recommended) is advisory only.',
        'An EICR with only C3 items — or none — is satisfactory and needs no remedials.',
        'C1, C2 or FI codes mean remedial works: send the job down the required-remedial path.',
      ]},
      { type: 'callout', variant: 'warning', text: 'Watch for the mixed case: an EICR marked overall Satisfactory that still lists FI (further investigation) items. Don\u2019t take the \u201Csatisfactory\u201D stamp at face value — go back to the service provider for clarification on the FIs before you close it out.' },

      { type: 'heading', text: 'The review panel' },
      { type: 'paragraph', text: 'The panel pre-fills the recognised dates for you to check against the document before you approve.' },
      { type: 'image', src: '/crm2/certreview-panel.png', text: 'The Certificate review panel with all the buttons and the pre-filled date fields.' },

      { type: 'heading', text: 'Provider name' },
      { type: 'bullets', items: [
        'If it\u2019s a Dwelly provider: copy and paste the name from the Contacts tab on the right — the agent sometimes pre-fills this field slightly differently from the name shown there.',
        'If it\u2019s a landlord-DIY cert: use the name indicated on the certificate.',
      ]},
      { type: 'image', src: '/crm2/certreview-providername.png', text: 'Provider name pre-filled by the agent vs the name on the Contacts tab — copy from the Contacts tab.' },

      { type: 'heading', text: 'Invalid vs Upload another' },
      { type: 'callout', variant: 'info', text: 'Invalid — use this when you spot an issue with a cert (incorrect date, address, etc.). Upload another — use this when you\u2019ve received a new cert and the agent didn\u2019t recognise it automatically.' },
    ],
  },
  {
    slug: 'epc',
    title: 'EPC — not mandatory mid-tenancy',
    summary: 'Why an EPC differs from an EICR or gas cert, and the wording when a landlord goes quiet.',
    icon: '⚡',
    pillar: 'features',
    readTime: '3 min read',
    quizModuleId: 'crm2-epc',
    content: [
      { type: 'paragraph', text: 'Unlike an EICR or a Gas Safety Certificate, an EPC does not have to be renewed during a live tenancy. It does have to be valid before you market the property, sign a new agreement with different tenants, formally change the tenancy agreement with existing tenants, or serve notice — so renewing is best practice.' },

      { type: 'heading', text: 'Wording when the landlord hasn\u2019t responded' },
      { type: 'callout', variant: 'tip', text: '\u201CAs we have not heard from you regarding the renewal of the Energy Performance Certificate, we will not be going ahead with renewing this, as it is not a legal requirement to have one during a tenancy. Please be aware that you must have a valid EPC before you market the property, sign a new agreement with different tenants, or change the formal tenancy agreement with your existing tenants; if you were to serve notice on the tenants you would also need a valid EPC — so it would be best practice to renew it. If you would like this renewed in the future, please come back to us and confirm that we can arrange this for you.\u201D' },
      { type: 'callout', variant: 'warning', text: 'Open question (to be confirmed): if a landlord is unresponsive on an EPC, do we chase the emergency contact or cancel the job? This isn\u2019t decided yet — check before assuming.' },
    ],
  },

  // ─── Work smarter ──────────────────────────────────────────────────────────
  {
    slug: 'escalations-timing',
    title: 'Escalations & timing in practice',
    summary: 'Reading the next-action date, third-party blocks, and the 3-day wait cap.',
    icon: '🚦',
    pillar: 'operate',
    readTime: '4 min read',
    quizModuleId: 'crm2-escalations',
    content: [
      { type: 'heading', text: 'Reading the next-action date' },
      { type: 'paragraph', text: 'The date and time at the bottom of a job is the next agent action — not necessarily the next escalation. It may just be an auto reminder. The full list of planned actions sits on the right-hand side of the job.' },
      { type: 'image', src: '/crm2/planned-actions.png', text: 'The planned-actions list on the right-hand side of the job.' },
      { type: 'callout', variant: 'tip', text: 'If the next action is an escalation, you can action it in advance. If it\u2019s an auto reminder, leave it.' },

      { type: 'heading', text: 'Jobs blocked by a third party' },
      { type: 'callout', variant: 'info', text: 'If a job is blocked by someone who isn\u2019t the tenant, landlord or provider — for example a block manager — there\u2019s no dedicated hold state yet. Interim workaround: set Wait For SP to pause the job and lift the red flag, then Take Over once the information arrives. A proper hold / \u201Cother\u201D option is on the roadmap.' },

      { type: 'heading', text: '\u201CWait for response\u201D caps at 3 days' },
      { type: 'bullets', items: [
        '\u201CWait for response\u201D maxes out at 3 days.',
        'If a provider is away longer (e.g. on annual leave), set the 3 days and extend again when the job returns to your queue.',
      ]},
    ],
  },
  {
    slug: 'escalations-reference',
    title: 'Escalations reference: every trigger & the edge cases',
    summary: 'The exceptions the agent raises outside the happy path — what each one means, and how to handle the document & email cases.',
    icon: '🧯',
    pillar: 'operate',
    readTime: '5 min read',
    quizModuleId: 'crm2-escalations-reference',
    content: [
      { type: 'paragraph', text: 'These are the exceptions that fall outside the designed flow — the moments the agent stops and raises a flag because something doesn\u2019t fit the happy path. This page is the single catalogue of those triggers and how to handle them. (The designed, every-job checkpoints — Certificate review, Invoice review and the rest — are covered separately in \u201CWhen the system hands over to you\u201D.)' },

      { type: 'heading', text: 'The stages, in shorthand' },
      { type: 'paragraph', text: 'Escalations are described against the stage they occur in, usually using these short codes.' },
      { type: 'table',
        headers: ['Code', 'Stage'],
        rows: [
          ['LA', 'Landlord approval'],
          ['PS', 'Provider selection'],
          ['SC', 'Scheduling'],
          ['VI', 'Visit'],
          ['RA', 'Result awaiting'],
          ['CR', 'Certificate review'],
          ['IA', 'Invoice awaiting'],
          ['IR', 'Invoice review'],
          ['QA', 'Quotation awaiting'],
          ['QR', 'Quotation review'],
        ],
      },

      { type: 'heading', text: 'The escalation triggers, and what to do' },
      { type: 'paragraph', text: 'Each of these can pull a job into your queue. The first few have their own handling; the rest are covered in depth by the feature lessons, cross-referenced below.' },
      { type: 'table',
        headers: ['Trigger', 'What to do'],
        rows: [
          ['Vague / low-confidence reply', 'Call the party and clarify before choosing the next step.'],
          ['Unrecognised intent', 'Read the entire job log, call the relevant parties to clarify, then choose the next stage.'],
          ['Job answered, but unrelated extra questions asked', 'Action the job for the relevant question, then acknowledge the extra question and pass it to the relevant PM.'],
          ['Party silent \u2014 reminders exhausted', 'The agent has chased to the end of its cadence. Follow up by phone, then send a confirming email. (See \u201CWhen the system hands over to you\u201D for the cadences.)'],
          ['Sensitive ask \u2014 tenant data / a named contractor', 'Don\u2019t share tenant data or commit to a named contractor without checking. If you\u2019re not 100% sure, ask.'],
          ['Landlord hints DIY / changes mind', 'If the landlord signals they\u2019ll arrange it themselves, route to Landlord DIY; if it\u2019s unclear, call to confirm before changing the path.'],
          ['No contractor found / landlord named one', 'Provider selection needs a human — source a contractor, or record the one the landlord named.'],
          ['Contractor declined / won\u2019t attend', 'Restart scheduling or select another provider. (See \u201CRescheduling\u201D.)'],
          ['Document unreadable / wrong type / mixed', 'A \u201Cdocument problem\u201D escalation. Check the file and request a correct copy if needed. (See \u201CCertificate review\u201D for wrong-property certs.)'],
          ['Certificate shows faults \u2014 remedial needed', 'Decide required vs optional at Certificate review. (See \u201CRemedial works\u201D.)'],
          ['Landlord refuses the quote', 'Record the response; the remedial branch ends at Remedial terminated and the satisfactory cert still stands.'],
          ['External-system error', 'Transient vs persistent — retry a transient error; escalate a persistent one to support (e.g. missing mandatory data).'],
        ],
      },

      { type: 'heading', text: 'Document & email problems' },
      { type: 'callout', variant: 'info', text: 'Every document and email problem sits under a single \u201Cdocument problem\u201D escalation, which can fire at Certificate review, Invoice review or Quotation review (CR \u00b7 IR \u00b7 QR). So an unreadable file, the wrong document type, or a mixed-up attachment all land the same way — check the file, then request a correct copy.' },

      { type: 'heading', text: 'External-system errors' },
      { type: 'callout', variant: 'tip', text: 'These can hit at any stage. If it looks transient, retry. If it persists — for example, mandatory data is missing — escalate to support rather than forcing the job forward.' },
    ],
  },
  {
    slug: 'across-systems',
    title: 'Working across 2.0 and 1.0, and other essentials',
    summary: 'Switching a job to CRM 1.0, vacant-property jobs, and the habits that keep jobs clean.',
    icon: '🔗',
    pillar: 'operate',
    readTime: '4 min read',
    quizModuleId: 'crm2-across-systems',
    content: [
      { type: 'heading', text: 'Switching a job from CRM 2.0 to CRM 1.0' },
      { type: 'steps', items: [
        'Ask the ops team to pause auto-transfer for the agency.',
        'Cancel the request in CRM 2.0.',
        'Create the request in CRM 1.0, leaving full context on why the job was moved.',
        'Ask the ops team to switch auto-transfer back on for the agency.',
      ]},

      { type: 'heading', text: 'Unattended (vacant) properties' },
      { type: 'paragraph', text: 'Vacant-property compliance is fully supported in CRM 2.0 and flagged with an Unattended label. With no tenant, the agent goes straight to the provider, explains that keys are collected from the agency, and books from the provider\u2019s availability. The day before the visit you get an escalation to verify the keys are available for collection; the rest of the flow is unchanged.' },

      { type: 'heading', text: 'Result awaiting — chasing the certificate' },
      { type: 'paragraph', text: 'After the visit, the agent waits on the certificate from the provider (reminders at +1 and +2 days, escalating to you at +3). Before you chase, check the last few emails on the job for attachments or links — it\u2019s sometimes already there.' },
      { type: 'image', src: '/crm2/resultawaiting-jobcard.png', text: 'A job at Result awaiting.' },
      { type: 'image', src: '/crm2/resultawaiting-jobcard2.png', text: 'Result awaiting — the certificate is still outstanding.' },
      { type: 'paragraph', text: 'If a document arrived outside the normal flow (e.g. via Slack), don\u2019t take over to upload it — use Add Direct Info, source From Provider, and attach the file. The agent then processes it exactly as if it had received it itself.' },
      { type: 'image', src: '/crm2/adi-fromprovider.png', text: 'Add Direct Info with an attachment and source = From Provider.' },

      { type: 'heading', text: 'Job Notes tab' },
      { type: 'paragraph', text: 'Notes synced from the property/landlord/tenant record, plus job-specific notes created from Send Communication. For operational context (why we\u2019re waiting, special agreements) — not communication history. To add your own note: Send Communication → Add notes.' },
      { type: 'image', src: '/crm2/job-notes.png', text: 'The Job Notes tab.' },

      { type: 'heading', text: 'Good habits' },
      { type: 'bullets', items: [
        'Before requesting a document from a provider, check the last few emails on the job — often it\u2019s already there.',
        'Collect the certificate AND the invoice for every appointment.',
        'Use the Job Notes tab for operational context (why we\u2019re waiting, special agreements) — it\u2019s for context, not communication history.',
        'Some agencies run in manual mode in CRM 1 (for example, British Gas).',
      ]},

      { type: 'heading', text: 'Tools & resources' },
      { type: 'bullets', items: [
        'SOP guide — the full reference for the happy path, the remedial branch (mandatory vs optional) and the landlord-DIY workflow, plus the escalation points. There\u2019s an automated solution for most cases — use it before manually sending emails.',
        'Price cheat sheet — landlords often ask what a service costs before authorising it. The figures live in the SOP guide (bottom section → Scenario SOPs) and were built from information the team supplied. Give the figure straight from the sheet rather than guessing.',
        'SOP widget (beta) — a Chrome widget that serves the SOPs relevant to the job\u2019s current stage and certificate type, right inside the job page.',
      ]},
      { type: 'callout', variant: 'info', text: 'Access to the SOP guide is password-protected — ask an admin for the current password rather than sharing it around.' },
    ],
  },

  // ─── Added references, synthesised from the lessons above ────────────────────
  {
    slug: 'glossary',
    title: 'Glossary: the language of 2.0',
    summary: 'Every stage name and control in one place, so the whole team speaks the same language.',
    icon: '📖',
    pillar: 'orientate',
    readTime: '3 min read',
    content: [
      { type: 'paragraph', text: 'A quick reference for the terms you\u2019ll see on a job. Bookmark this one — it\u2019s the fastest way to get fluent in how 2.0 describes where a job is and what happens next.' },

      { type: 'heading', text: 'Job stages' },
      { type: 'table',
        headers: ['Stage', 'What it means'],
        rows: [
          ['Landlord approval', 'The agent asks the landlord to authorise the work. The landlord can also choose to arrange it themselves (Landlord DIY).'],
          ['Provider selection', 'The agent finds a contractor for the job.'],
          ['Scheduling', 'The agent brokers a date between the parties.'],
          ['Visit', 'The appointment is confirmed; the agent sends a reminder the day before.'],
          ['Result awaiting', 'After the visit, the agent chases the certificate.'],
          ['Certificate review', 'Your checkpoint — check the document, the dates and whether any remedials are required.'],
          ['Quotation awaiting', 'On the remedial branch, the agent asks the contractor for a quote.'],
          ['Quotation review', 'You approve (or query) the remedial quote.'],
          ['Landlord quote approval', 'The landlord agrees to pay for the remedial works.'],
          ['Remedial terminated', 'The remedial branch stops without proceeding to works.'],
          ['Invoice awaiting / review', 'The invoice arrives and is checked against the job.'],
          ['Completed', 'The job is finished.'],
        ],
      },

      { type: 'heading', text: 'Labels & controls' },
      { type: 'table',
        headers: ['Term', 'What it means'],
        rows: [
          ['Unattended', 'A vacant-property job. With no tenant, the agent goes straight to the provider and books from their availability; keys are collected from the agency.'],
          ['Wait For SP', 'Pauses the job while waiting on a service provider (or, as an interim workaround, any third party). Lifts the red flag until the job returns to you.'],
          ['Take Over', 'You step in and take the next action on a job yourself, rather than leaving it to the agent.'],
          ['Wait for response', 'Holds the job for a provider\u2019s reply — capped at 3 days. Extend it again when the job comes back to your queue.'],
        ],
      },

      { type: 'heading', text: 'Certificate types' },
      { type: 'table',
        headers: ['Certificate', 'Note'],
        rows: [
          ['CP12 (Gas Safety Certificate)', 'Categorises each appliance rather than labelling the whole cert satisfactory/unsatisfactory. Read the \u201CSafe to use\u201D column.'],
          ['EICR', 'Electrical report; clearly labelled satisfactory or unsatisfactory.'],
          ['EPC', 'Energy Performance Certificate. Not required to be renewed mid-tenancy, but needed before marketing, a new agreement, a formal change or serving notice.'],
        ],
      },
    ],
  },
  {
    slug: 'worked-example',
    title: 'Worked example: a gas safety job, start to finish',
    summary: 'Follow one CP12 through the whole flow — including a remedial branch — to see how the pieces fit.',
    icon: '🧩',
    pillar: 'features',
    readTime: '5 min read',
    content: [
      { type: 'paragraph', text: 'The best way to see how the stages, checkpoints and side flows connect is to watch a single job travel through them. Here is a typical Gas Safety Certificate (CP12) job — one where the engineer finds an issue — from open to close. Details are illustrative.' },

      { type: 'heading', text: 'The main path' },
      { type: 'steps', items: [
        'Landlord approval — the agent asks the landlord to authorise the CP12. The landlord approves (had they wanted to arrange it themselves, the job would have gone down the Landlord DIY route instead).',
        'Provider selection & scheduling — the agent finds a Gas Safe contractor and brokers a date. You don\u2019t need to touch this unless it escalates.',
        'Visit — the appointment is confirmed and the agent sends a reminder the day before.',
        'Result awaiting — after the visit the agent chases the certificate.',
        'Certificate review — the job lands in your queue. This is your checkpoint.',
      ]},

      { type: 'heading', text: 'At Certificate review' },
      { type: 'bullets', items: [
        'Check the address — make sure the cert is for this property, not another in the landlord\u2019s portfolio.',
        'Check the numbers — subtotal, VAT and total.',
        'Check the dates — issue and expiry present and in the right fields on both the cert and the CRM.',
        'Read the \u201CSafe to use\u201D column. In this example one appliance is flagged — a missing flame supervision device on an old hob — so there is a remedial to consider.',
      ]},
      { type: 'callout', variant: 'info', text: 'Every other appliance is \u201CSafe to use: YES\u201D, so the certificate itself is satisfactory. The flagged item is a remedial that rides alongside it — the cert doesn\u2019t become unsatisfactory just because one optional item was noted.' },

      { type: 'heading', text: 'The remedial branch' },
      { type: 'paragraph', text: 'You decide the remedial is worth doing, so the job branches:' },
      { type: 'steps', items: [
        'Quotation awaiting — the agent asks the contractor for a quote for the remedial work.',
        'Quotation review — you check the quote.',
        'Landlord quote approval — the landlord agrees to pay.',
        'A repeat visit completes the works. (Had the landlord declined, the branch would end at Remedial terminated and the satisfactory cert would still stand.)',
      ]},

      { type: 'heading', text: 'Closing out' },
      { type: 'steps', items: [
        'Invoice awaiting / review — the invoice comes in and is checked against the job. Remember to collect both the certificate and the invoice for the appointment.',
        'Completed — the job closes.',
      ]},
      { type: 'callout', variant: 'tip', text: 'Notice you only stepped in twice — at Certificate review and Quotation review. Everything else was the agent. That two-lane split is the whole model in one job.' },
    ],
  },
  {
    slug: 'cheatsheet',
    title: 'Quick-reference cheatsheet',
    summary: 'The \u201Cwhen X, do Y\u201D calls you\u2019ll make most often, on one screen.',
    icon: '🗂️',
    pillar: 'operate',
    readTime: '3 min read',
    content: [
      { type: 'paragraph', text: 'The decisions that come up again and again, boiled down. Bookmark this and keep it open while you work through your queue.' },
      { type: 'table',
        headers: ['When you see this…', 'Do this'],
        rows: [
          ['A satisfactory cert with optional items noted', 'Follow the optional-remedial flow and send the 7-day wording — don\u2019t redirect it into the mandatory remedial path.'],
          ['A CP12 where every appliance is \u201CSafe to use: YES\u201D', 'Treat the certificate as satisfactory; any remedials are nice-to-have.'],
          ['The AI has flagged the address', 'Just a hint to look, not an error to fix. Common trigger: a handwritten certificate.'],
          ['A cert for the wrong property', 'Two actions: upload it to the property it belongs to (CRM 1 \u2192 File Manager), and request the correct cert for this job.'],
          ['A landlord going quiet on an EPC', 'Not legally required mid-tenancy — send the EPC wording. (Chase vs cancel on no response is still an open question — check.)'],
          ['A job blocked by a block manager / other third party', 'Interim: set Wait For SP to pause and clear the flag, then Take Over once the info arrives.'],
          ['A provider away longer than 3 days', 'Set the 3-day wait, then extend again when the job returns to your queue.'],
          ['The next-action date at the bottom of a job', 'If it\u2019s an escalation you can action it early; if it\u2019s an auto reminder, leave it.'],
        ],
      },

      { type: 'heading', text: 'Which button? — the calls people mix up' },
      { type: 'table',
        headers: ['Situation', 'Right action'],
        rows: [
          ['You\u2019re passing on information you received from one party', 'Add Direct Info — write it as the party you got it from; choose the right source (e.g. From Provider).'],
          ['Both sides have already agreed the appointment', 'Set Visit Date — it records an agreed slot; it is not for passing on information.'],
          ['A party gives a relative time like \u201Cmorning\u201D', 'Set Visit Date manually (treat morning as 8am–12pm) — the AI won\u2019t accept a relative time as confirmation.'],
          ['The landlord approves the works by phone', 'Landlord approved, directly — not Add Direct Info.'],
          ['A new time is agreed (both in the thread, or one proposed + you confirmed the other by phone)', 'Reset Visit Date.'],
          ['No new time is agreed yet', 'Restart Scheduling — pick tenant or provider and write the opening message so context carries over.'],
          ['You spot a problem with a cert (wrong date/address)', 'Invalid certificate.'],
          ['A new cert arrived that the agent didn\u2019t recognise', 'Upload another certificate.'],
          ['Faults that must be fixed for compliance', 'Need required remedial (mandatory remedial branch).'],
          ['A satisfactory cert with C3 / optional items only', 'Optional remedial + send the 7-day wording.'],
          ['A closed job gets a thank-you or unrelated email', 'Provide Instructions (\u201Cdo nothing\u201D) — but it\u2019s admin-only, so consult an admin first.'],
        ],
      },
      { type: 'callout', variant: 'warning', text: 'This is a summary — the full reasoning lives in the feature lessons. When a case doesn\u2019t fit neatly, read the whole job before acting.' },
    ],
  },
  {
    slug: 'faq',
    title: 'FAQ & common gotchas',
    summary: 'The questions new operators ask most, and the traps that catch people out.',
    icon: '❓',
    pillar: 'operate',
    readTime: '4 min read',
    content: [
      { type: 'subheading', text: 'Should I take over a job just so I can call the tenant or provider early?' },
      { type: 'paragraph', text: 'No. If there\u2019s no new urgent information to process, let the agent keep working — it will escalate to you when it needs a human. Taking over early just adds work and can cut across what the agent is doing.' },

      { type: 'subheading', text: 'Do I need to process jobs that haven\u2019t escalated?' },
      { type: 'paragraph', text: 'Not for now — only handle flags. If a job hasn\u2019t escalated, it doesn\u2019t need you yet.' },

      { type: 'subheading', text: 'The AI flagged the address — do I have to correct it?' },
      { type: 'paragraph', text: 'No. A flagged address is a hint that it might be wrong and worth a glance, not an error you must fix. A handwritten certificate is a common trigger.' },

      { type: 'subheading', text: 'A CP12 doesn\u2019t say \u201Csatisfactory\u201D anywhere — how do I judge it?' },
      { type: 'paragraph', text: 'A gas certificate categorises each appliance rather than the whole document. Read the \u201CSafe to use\u201D column: if every appliance is YES, treat the cert as satisfactory and any remedials as nice-to-have.' },

      { type: 'subheading', text: 'The landlord sent a certificate for a different property — do I just reject it?' },
      { type: 'paragraph', text: 'No — take two actions. Upload the cert to the property it actually belongs to (CRM 1 \u2192 File Manager) so it isn\u2019t wasted, then request the correct cert for this job\u2019s property.' },

      { type: 'subheading', text: 'Is an EPC mandatory to renew during a tenancy?' },
      { type: 'paragraph', text: 'No. Unlike an EICR or gas cert, an EPC doesn\u2019t have to be renewed mid-tenancy — but it must be valid before you market the property, sign a new agreement with different tenants, formally change the agreement with existing tenants, or serve notice. So renewing is best practice.' },

      { type: 'subheading', text: 'How long can I wait for a provider to respond?' },
      { type: 'paragraph', text: '\u201CWait for response\u201D caps at 3 days. If a provider is away longer, set the 3 days and extend again when the job comes back to your queue.' },

      { type: 'callout', variant: 'important', text: 'The biggest gotcha overall: acting on the most recent message alone. The agent often suggests an action from the latest activity — read the whole job before you decide.' },
    ],
  },
  {
    slug: 'whats-new',
    title: 'What\u2019s new in 2.0 (vs 1.0)',
    summary: 'The headline changes from the old CRM, so you know what to expect and what\u2019s different.',
    icon: '📣',
    pillar: 'operate',
    readTime: '3 min read',
    content: [
      { type: 'paragraph', text: 'If you\u2019ve worked in CRM 1.0, here\u2019s what actually changes in 2.0. These are the differences worth knowing before you pick up your first job.' },
      { type: 'bullets', items: [
        'An agent runs the job end to end. Chasing, booking and reminders happen automatically; you step in for the human decisions rather than driving every step.',
        'Certificate review is now the decision point. It\u2019s where you check the document and decide whether remedials are required for compliance or simply recommended.',
        'Vacant properties are fully supported. They\u2019re flagged Unattended, the agent books straight with the provider, and you get a key-collection escalation the day before the visit.',
        'Waiting is time-boxed. \u201CWait for response\u201D caps at 3 days, so jobs come back to you rather than sitting open indefinitely.',
        'The next-action date is visible on every job — with the full list of planned actions on the right — so you can see what the agent will do next and action escalations early.',
      ]},
      { type: 'callout', variant: 'info', text: 'Some things are still being finalised — for example, a dedicated hold state for jobs blocked by a third party, and whether to chase or cancel an unresponsive EPC. Where a lesson flags an \u201Copen question\u201D, check before assuming.' },
      { type: 'divider' },
      { type: 'paragraph', text: 'This learning space launched on 3 Aug 2026 and is reviewed against the live 2.0 build. As 2.0 evolves, new lessons and changes will land here first.' },
    ],
  },
  {
    slug: 'capstone',
    title: 'Capstone assessment',
    summary: 'The final sign-off check — a mixed set of questions drawn from every lesson in the space.',
    icon: '🏅',
    pillar: 'operate',
    readTime: '15 min',
    quizModuleId: CRM2_CAPSTONE_MODULE_ID,
    content: [
      { type: 'paragraph', text: 'This is the capstone — the one assessment that proves you can operate confidently across the whole of CRM 2.0. Unlike the per-lesson checks, it samples questions from every lesson in the space, so you never know which topics will come up.' },

      { type: 'heading', text: 'What to expect' },
      { type: 'bullets', items: [
        `${CRM2_CAPSTONE_SAMPLE} scenario questions, drawn at random from across all the lessons.`,
        '80% to pass, same as every other assessment here.',
        'Every question shows the reasoning afterwards, so it doubles as a final revision pass.',
        'Retake it as many times as you like — the question mix is reshuffled each time.',
      ]},

      { type: 'callout', variant: 'tip', text: 'Best taken once you\u2019ve worked through the lessons and passed the individual knowledge checks. If a topic trips you up, head back to that lesson — the capstone tells you exactly where your gaps are.' },

      { type: 'callout', variant: 'info', text: 'Everything in the capstone comes straight from the lessons in this space — there\u2019s nothing new to learn here, just the pieces brought together.' },
    ],
  },
]

export function getCrm2Lesson(slug: string): Crm2Lesson | undefined {
  return CRM2_LESSONS.find(l => l.slug === slug)
}
