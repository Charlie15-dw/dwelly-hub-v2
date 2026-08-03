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
  type: 'heading' | 'subheading' | 'paragraph' | 'bullets' | 'steps' | 'callout' | 'table' | 'divider'
  text?: string
  items?: string[]
  level?: 1 | 2 | 3
  variant?: 'info' | 'warning' | 'tip' | 'important'
  headers?: string[]
  rows?: string[][]
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
}

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
    content: [
      { type: 'heading', text: 'An agent that runs the job, and you for the human calls' },
      { type: 'paragraph', text: 'Each request is a single compliance-certificate job — a Gas Safety Certificate (CP12), an EICR, an EPC, and so on. An AI agent runs the routine from end to end; you, the operator, make the decisions that need a human. Understanding that split is the key to working well in 2.0.' },
      { type: 'callout', variant: 'info', text: 'Think of it as two lanes. The agent lane runs autonomously — chasing, booking and reminding. The operator lane is where you step in for the human decisions. Around them sit two side flows: remedial works, and landlord-DIY.' },

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
    content: [
      { type: 'heading', text: 'Send Communication' },
      { type: 'bullets', items: [
        'Send emails, SMS or notes — now with attachments.',
        'Rich text (bold, italic, bullet lists) plus direct file attachment, so certificates and photos can go out in a properly formatted message without leaving the job.',
      ]},

      { type: 'heading', text: 'Add Direct Info' },
      { type: 'paragraph', text: 'Use this to pass on information you received from one party to the other. Write it as if you are the party you got it from — whatever you type is sent on in full. If the engineer says he can do 11 August at 2pm, you write \u201C11th August 2026 at 2pm\u201D, not an internal note about it.' },
      { type: 'bullets', items: [
        'It now supports attachments — useful when a document arrives outside the normal email flow (e.g. via Slack).',
        'Choose the right source (e.g. From Provider) and the agent processes it as if it had received the document itself. No need to take over just to upload a file.',
      ]},

      { type: 'heading', text: 'Add Direct Info vs Set Visit Date' },
      { type: 'callout', variant: 'tip', text: 'Rule of thumb: Direct Info = passing on information you received. Set Visit Date = recording an appointment both sides have already agreed.' },
      { type: 'bullets', items: [
        'Relative times the AI won\u2019t accept: if a provider or tenant says \u201Cmorning\u201D, the system won\u2019t treat it as a confirmation. Set the visit date manually rather than waiting for an exact time — treat morning as 8am–12pm.',
        'Tenant reschedules out-of-band (e.g. emails us directly): it arrives as an escalation. Just Set Visit Date to the agreed new slot — replying to the tenant won\u2019t break the automated flow, and no special handling is needed.',
      ]},

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
    content: [
      { type: 'callout', variant: 'info', text: 'New: rescheduling is now built in for jobs already at the Visit or Result Awaiting stage. Previously this needed a manual take-over.' },
      { type: 'heading', text: 'Restart Scheduling' },
      { type: 'paragraph', text: 'Use this when a new appointment hasn\u2019t been agreed yet. You choose whether to restart with the tenant or the provider, and you write the opening message so the context carries over — for example, \u201Ccan\u2019t do tomorrow, next Monday works\u201D.' },
      { type: 'callout', variant: 'tip', text: 'Dates you put in your message are recognised and used through the flow — so a natural message like \u201Cnext Monday works\u201D is enough to move things along.' },
    ],
  },
  {
    slug: 'remedial-works',
    title: 'Remedial works — required vs optional',
    summary: 'Deciding at Certificate review whether remedials are required for compliance or just recommended.',
    icon: '🔧',
    pillar: 'features',
    readTime: '5 min read',
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
    ],
  },
  {
    slug: 'certificate-review',
    title: 'Certificate review',
    summary: 'What to check on every certificate, AI address flags, wrong-property certs, and reading a CP12.',
    icon: '📄',
    pillar: 'features',
    readTime: '5 min read',
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
    ],
  },
  {
    slug: 'epc',
    title: 'EPC — not mandatory mid-tenancy',
    summary: 'Why an EPC differs from an EICR or gas cert, and the wording when a landlord goes quiet.',
    icon: '⚡',
    pillar: 'features',
    readTime: '3 min read',
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
    content: [
      { type: 'heading', text: 'Reading the next-action date' },
      { type: 'paragraph', text: 'The date and time at the bottom of a job is the next agent action — not necessarily the next escalation. It may just be an auto reminder. The full list of planned actions sits on the right-hand side of the job.' },
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
    slug: 'across-systems',
    title: 'Working across 2.0 and 1.0, and other essentials',
    summary: 'Switching a job to CRM 1.0, vacant-property jobs, and the habits that keep jobs clean.',
    icon: '🔗',
    pillar: 'operate',
    readTime: '4 min read',
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

      { type: 'heading', text: 'Good habits' },
      { type: 'bullets', items: [
        'Before requesting a document from a provider, check the last few emails on the job — often it\u2019s already there.',
        'Collect the certificate AND the invoice for every appointment.',
        'Use the Job Notes tab for operational context (why we\u2019re waiting, special agreements) — it\u2019s for context, not communication history.',
        'Some agencies run in manual mode in CRM 1 (for example, British Gas).',
      ]},
    ],
  },
]

export function getCrm2Lesson(slug: string): Crm2Lesson | undefined {
  return CRM2_LESSONS.find(l => l.slug === slug)
}
