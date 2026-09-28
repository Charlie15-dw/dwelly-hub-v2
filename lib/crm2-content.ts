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

export interface Crm2Hotspot {
  x: number             // 0–100, percent from the left of the image
  y: number             // 0–100, percent from the top of the image
  label: string         // short pin label, e.g. "Add Direct Info"
  detail: string        // what this control does / when to use it
}

export interface Crm2Block {
  type: 'heading' | 'subheading' | 'paragraph' | 'bullets' | 'steps' | 'callout' | 'table' | 'divider' | 'image' | 'widget' | 'faq'
  text?: string
  items?: string[]
  level?: 1 | 2 | 3
  variant?: 'info' | 'warning' | 'tip' | 'important'
  headers?: string[]
  rows?: string[][]
  src?: string          // for type 'image' — path under /public; `text` is the caption
  hotspots?: Crm2Hotspot[]  // for type 'image' — clickable pins overlaid on the screenshot
  widget?: 'button-advisor' | 'scenario-drills'  // for type 'widget' — an interactive embed
  emphasisIndex?: number    // for type 'steps' — accent this item (e.g. the operator's checkpoint)
  faqs?: { q: string; a: string }[]  // for type 'faq' — a group of collapsible question/answer pairs
}

export type Crm2Pillar = 'orientate' | 'features' | 'operate'

// A lesson is one of three kinds. Only 'guide' lessons count towards progress
// and the certificate; 'reference' sheets are look-ups you keep to hand, and
// 'practice' items are drills / the capstone assessment. Every count, the
// progress denominator and the pillar grouping key off `kind === 'guide'`.
export type Crm2Kind = 'guide' | 'reference' | 'practice'

export interface Crm2Lesson {
  slug: string
  title: string
  summary: string
  icon: string          // emoji, retained for the print pages; the app UI uses number chips / Lucide
  pillar: Crm2Pillar
  kind: Crm2Kind
  minutes: number       // reading/working time in minutes; the view appends "read"
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
    kind: 'guide',
    minutes: 5,
    quizModuleId: 'crm2-how-it-works',
    content: [
      { type: 'heading', text: 'An agent that runs the job, and you for the human calls' },
      { type: 'paragraph', text: 'Each request is a single compliance-certificate job — a Gas Safety Certificate (CP12), an EICR, an EPC, and so on. An AI agent runs the routine from end to end; you, the operator, make the decisions that need a human. Understanding that split is the key to working well in 2.0.' },
      { type: 'callout', variant: 'info', text: 'Think of it as two lanes. The agent lane runs autonomously — chasing, booking and reminding. The operator lane is where you step in for the human decisions. Around them sit two side flows: remedial works, and landlord-DIY.' },
      { type: 'image', src: '/crm2/flow-diagram.png', text: 'The full compliance flow: the main path across the top, with the landlord-DIY, remedial and boiler-service branches coming off it.' },

      { type: 'heading', text: 'The main path' },
      { type: 'paragraph', text: 'Most jobs travel through these stages, driven by the agent, with two review checkpoints that are always yours (Certificate review and Invoice review):' },
      { type: 'steps', emphasisIndex: 5, items: [
        'Landlord approval — the agent asks the landlord to authorise the work.',
        'Provider selection — the agent finds a contractor.',
        'Scheduling — the agent brokers a date between the parties.',
        'Visit — the agent confirms and sends a reminder the day before.',
        'Result awaiting — the agent chases the certificate.',
        'Certificate review — your checkpoint: check the document and its dates.',
        'Invoice review — your checkpoint too: the invoice has to be reviewed manually before it closes.',
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
    kind: 'guide',
    minutes: 5,
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
        'The property address is a link — click it to open the property record. It\u2019s not obvious, but the address itself is the hyperlink.',
        'Notes and Open Jobs sections show any notes on the property and its other live jobs at a glance.',
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
    kind: 'guide',
    minutes: 5,
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
          ['Approval message', 'Any stage, when the agent drafts a free-text (non-template) email or a non-standard SMS', 'Read it, edit if needed, then confirm to send. To write your own, use Reject and Take Over — not just Reject (a plain reject only resolves the escalation, so the job is easily forgotten)'],
          ['Landlord quote approval', 'Remedial branch, the landlord\u2019s yes/no on paying', 'Usually nothing; if it escalates, record their response using Add Direct Info'],
          ['Resolve a task', 'Any stage, when the agent hands a decision over — or when you Take Over', 'Pick a stage resolution (Wait / Cancel / Landlord DIY / Select another provider / Add direct info)'],
        ],
      },

      { type: 'heading', text: 'How long the agent chases before it escalates' },
      { type: 'paragraph', text: 'Each stage has a designed reminder cadence. This is roughly when a job will land with you rather than being handled automatically.' },
      { type: 'table',
        headers: ['Stage', 'Reminders', 'Then'],
        rows: [
          ['Landlord approval', '+1 working day, +3 days', '+4 days: auto-advance to provider selection (EPCs included)'],
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
    kind: 'guide',
    minutes: 6,
    quizModuleId: 'crm2-buttons',
    content: [
      { type: 'heading', text: 'Landlord approval buttons — by certificate type' },
      { type: 'paragraph', text: 'Every job starts at Landlord approval, where you authorise the works once the landlord says yes. The buttons differ slightly by certificate type. If the landlord approves by phone, click the approval button directly (e.g. Approved, Use Dwelly SP) — not Add Direct Info.' },
      { type: 'subheading', text: 'Gas Safety Certificate (CP12)' },
      { type: 'callout', variant: 'warning', text: 'Note the \u201CAdd Boiler Service\u201D button — always double-check whether the landlord wants this done. If it\u2019s unclear from their response, ask again before proceeding.' },
      { type: 'image', src: '/crm2/buttons-cp12.png', text: 'Landlord approval buttons for a CP12 job, including Add Boiler Service.',
        hotspots: [
          { x: 7,  y: 50, label: 'Approved, Use Dwelly SP', detail: 'The default approval path — authorises the CP12 using our preferred provider.' },
          { x: 20.5, y: 50, label: 'Proceed with Another Provider', detail: 'Use when the landlord names a specific provider. If they’re not on the preferred list, check the provider panel before onboarding a new one.' },
          { x: 33.5, y: 50, label: 'Add Boiler Service', detail: 'An optional extra — always confirm the landlord actually wants it before proceeding. Ask again if their response is unclear.' },
          { x: 44, y: 50, label: 'Landlord DIY', detail: 'The landlord chooses to arrange the works themselves; the job follows the DIY route.' },
          { x: 64, y: 50, label: 'Provide Instructions', detail: 'Admin-only. The main accepted case is a closed job that needs a “do nothing” instruction.' },
          { x: 94.5, y: 50, label: 'Cancel Request', detail: 'Cancels the job — admin-only, so consult an admin first.' },
        ],
      },
      { type: 'subheading', text: 'Electrical Installation Condition Report (EICR)' },
      { type: 'image', src: '/crm2/buttons-eicr.png', text: 'Landlord approval buttons for an EICR job.' },
      { type: 'subheading', text: 'Energy Performance Certificate (EPC)' },
      { type: 'image', src: '/crm2/buttons-epc.png', text: 'Landlord approval buttons for an EPC job.' },
      { type: 'callout', variant: 'tip', text: 'Landlords often ask for prices before proceeding. Check the Service price cheat sheet (in this space), reply to the landlord using Send Communication, then click the appropriate approval button.' },

      { type: 'heading', text: 'Selecting a provider' },
      { type: 'paragraph', text: 'The agent picks the service provider automatically, using our preferred provider unless the landlord requests a specific one. It only escalates to you if the landlord names a provider or no contractor can be found.' },
      { type: 'image', src: '/crm2/providers-table.png', text: 'Preferred Compliance Providers reference.' },
      { type: 'subheading', text: 'If the landlord asks for a specific provider' },
      { type: 'steps', items: [
        'Click \u201CProceed with another provider\u201D.',
        'If they\u2019re not on the preferred list, check the provider panel at panel.dwelly.team/dw-admin/html/pm-providers.',
        'If they\u2019re not on the list, reach out to your TL so they can onboard the desired SP for you.',
      ]},
      { type: 'image', src: '/crm2/provider-picker.png', text: 'Selecting an alternative provider via \u201CProceed with another provider\u201D.' },

      { type: 'heading', text: 'Send Communication' },
      { type: 'bullets', items: [
        'Send emails, SMS or notes — now with attachments.',
        'Rich text (bold, italic, bullet lists) plus direct file attachment, so certificates and photos can go out in a properly formatted message without leaving the job.',
      ]},
      { type: 'callout', variant: 'tip', text: 'Emails and notes carry the attachments. SMS is effectively one-way — the recipient can\u2019t reply to it — so use it for informing only, such as a reminder of an upcoming visit or a nudge to ask the party to check their email.' },

      { type: 'heading', text: 'Scheduling — brokering the date' },
      { type: 'paragraph', text: 'The agent contacts the tenant and provider to find a matching slot, nudging whichever side is silent and escalating on a deadlock. These are the actions available to you at the Scheduling stage:' },
      { type: 'image', src: '/crm2/buttons-scheduling.png', text: 'The Scheduling-stage action buttons.' },

      { type: 'heading', text: 'Add Direct Info' },
      { type: 'paragraph', text: 'Use this to pass on something a party gave you outside the system — a proposed date, their availability, or a document. Pick the source it came from (Landlord, Tenant or Service Provider) and the agent treats what you enter as if that party had sent it in directly, so write it in their voice. If the tenant says they can do 11 August at 2pm, you write \u201C11th August 2026 at 2pm\u201D, not an internal note about it.' },
      { type: 'image', src: '/crm2/adi-panel.png', text: 'The Add Direct Info panel.' },
      { type: 'subheading', text: 'When to use it' },
      { type: 'bullets', items: [
        'A tenant who went quiet on Scheduling gives you their availability on a call — source Tenant, just enter the proposed dates. No need to write a full message; the agent does the rest.',
        'A provider sends you new dates outside the system — source Service Provider, add the dates as a short note.',
        'A provider sends a document (e.g. an EICR) outside the normal email flow, such as via Slack — source Service Provider, add a short note, attach up to 10 files and submit. The agent processes it as if it had received the document itself, so there\u2019s no need to take over just to upload a file.',
        'The landlord books the visit in themselves (DIY) — source Landlord, message \u201Cthis has been booked for [date]\u201D. Two things follow: the landlord gets an email, and the visit date appears in the top-right with its reminders adjusted.',
      ]},
      { type: 'callout', variant: 'warning', text: 'Add Direct Info needs something actionable to move the job on — a proposed date, availability, or a document. A note about what you did, with no dates in it (e.g. \u201CBoth tenants didn\u2019t answer; left a voicemail asking for a call back\u201D), doesn\u2019t progress anything; it just lands back with you as a fresh escalation. Relay the actual dates or file, and log anything else another way.' },

      { type: 'heading', text: 'Add Direct Info vs Set Visit Date' },
      { type: 'callout', variant: 'tip', text: 'Rule of thumb: Direct Info = passing on information you received. Set Visit Date = recording an appointment both sides have already agreed.' },
      { type: 'image', src: '/crm2/svd-panel.png', text: 'The Set Visit Date panel.' },
      { type: 'callout', variant: 'warning', text: 'Only use Set Visit Date once every party involved has confirmed the same slot — in most cases that means both the tenant(s) and the provider have agreed the timeslot. It records an agreed appointment, not a proposal.' },
      { type: 'bullets', items: [
        'Date and time are both required — enter the agreed date, then the time.',
        'Time note (optional): use it for a window rather than an exact time — \u201C9\u201312\u201D, \u201Cin the morning\u201D, \u201C8\u201310 AM\u201D, \u201Cafter 5 PM\u201D. A time note overrides the exact time field, so reach for it whenever the slot is a range.',
        'Notes like \u201Cwith keys\u201D must sit alongside a time note, never on their own — a note with no time leaves the job with no visit time at all.',
        'Tenant reschedules out-of-band (e.g. emails us directly): it arrives as an escalation. Just Set Visit Date to the agreed new slot — replying to the tenant won\u2019t break the automated flow, and no special handling is needed.',
      ]},

      { type: 'heading', text: 'Chasing the tenant & provider' },
      { type: 'paragraph', text: 'When a side goes quiet at Scheduling, chase by phone first, then a confirming email. Never give out direct phone numbers between tenant, landlord and provider — we\u2019re only allowed to share masked ones. Once a job is escalated or flagged to you, follow these SOPs exactly.' },
      { type: 'subheading', text: 'Tenant not responding' },
      { type: 'callout', variant: 'warning', text: 'We\u2019re not allowed to force-book any appointment (unless there\u2019s a court order). Once the job is escalated or flagged, call the tenant first, then work the ladder below.' },
      { type: 'steps', items: [
        'First escalation: if there\u2019s no reply, leave a voice message and send a follow-up email, then click Wait for Response \u2192 3 days. If there\u2019s still no response, repeat that step once. If the tenant does respond, use Add Direct Info to add their dates to the system.',
        'Second escalation: if there\u2019s no response after the second attempt, send a WhatsApp message, add a note in the job (\u201CWhatsApp message sent\u201D) and Wait for Response \u2192 3 days.',
        'If there\u2019s still no response, arrange a physical letter to be sent by mail requesting a call-back to the agency.',
        'If there\u2019s no further response within a week of sending the letter, arrange for a property specialist / PM to visit the property and speak to the tenant.',
        'Notify the tenant with notice in accordance with the tenancy agreement: if they comply, proceed with the job; if they don\u2019t comply or reject the request at any point, go back to the escalation point.',
      ]},
      { type: 'callout', variant: 'important', text: 'This isn\u2019t a recommendation — it\u2019s a strict rule. Follow these exact steps.' },
      { type: 'subheading', text: 'Contractor not responding' },
      { type: 'steps', items: [
        '1st PM escalation: call the contractor, then place the job on hold for one business day.',
        '2nd PM escalation: change the contractor, then use Add Direct Info to input the previous dates the tenant suggested (as long as they haven\u2019t lapsed).',
      ]},
      { type: 'callout', variant: 'tip', text: 'If you realise you need to reassign a substantial number of jobs away from one specific contractor, run it through your TL first before doing it in bulk.' },

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
    kind: 'guide',
    minutes: 3,
    quizModuleId: 'crm2-rescheduling',
    content: [
      { type: 'callout', variant: 'info', text: 'New: rescheduling is now built in for jobs already at the Visit or Result awaiting stage. Previously this needed a manual take-over.' },
      { type: 'image', src: '/crm2/visit-jobcard.png', text: 'A job at the Visit stage.' },
      { type: 'paragraph', text: 'You no longer need to call the provider, tenant or landlord to move a visit unless it\u2019s genuinely urgent — the agent can reschedule any visit for you. From Visit (and Result awaiting) you have two direct rescheduling actions, and the right one depends on whether a new time has already been agreed.' },
      { type: 'image', src: '/crm2/buttons-visit.png', text: 'The two rescheduling actions: Reset Visit Date and Restart Scheduling.',
        hotspots: [
          { x: 4.75, y: 50, label: 'Set New Visit Date', detail: 'Use when a new time is already agreed by both sides — it updates the booking and notifies both automatically.' },
          { x: 30, y: 50, label: 'Wait for Response', detail: 'Holds the job for a reply — capped at 3 days. If the wait needs to be longer, divert the job to Manual instead.' },
          { x: 39.5, y: 50, label: 'Provide Instructions', detail: 'Admin-only — consult an admin before using it.' },
          { x: 49, y: 50, label: 'Restart Scheduling', detail: 'Use when no new time is agreed yet — pick tenant or provider and write the opening message so context carries over.' },
        ],
      },

      { type: 'heading', text: 'Reset Visit Date' },
      { type: 'paragraph', text: 'Use this only when both parties have already agreed the new time — both confirmed in the thread, or one proposed it and you confirmed the other by phone. It updates the job and notifies both sides automatically.' },
      { type: 'image', src: '/crm2/reset-visit-example.png', text: 'Reset Visit Date — worked example.' },

      { type: 'heading', text: 'Restart Scheduling' },
      { type: 'paragraph', text: 'Use this when a new appointment hasn\u2019t been agreed yet. It drops the current visit date and restarts the negotiation: you choose whether to restart with the tenant or the provider, and you write the opening message so the context carries over — for example, \u201Ccan\u2019t do tomorrow, next Monday works\u201D. The chosen party gets an availability request quoting your message, and the other party is asked to stand by.' },
      { type: 'callout', variant: 'tip', text: 'Dates you put in your message are recognised and used through the flow — so a natural message like \u201Cnext Monday works\u201D is enough to move things along, and they\u2019re quoted verbatim at the end of the email too.' },

      { type: 'heading', text: 'Always record the date in the system' },
      { type: 'callout', variant: 'warning', text: 'A visit date must be agreed AND recorded in the system before the job proceeds — this is enforced strictly, not a nice-to-have. Confirming a new time on a call or by email and then letting the job carry on without pressing Reset Visit Date / Restart Scheduling is the single most common deviation logged — it shows up as \u201Crescheduled by hand\u201D. If a date changes, record it here.' },
    ],
  },
  {
    slug: 'remedial-works',
    title: 'Remedial works — required vs recommended',
    summary: 'Deciding at Certificate review whether remedials are required for compliance or just recommended.',
    icon: '🔧',
    pillar: 'features',
    kind: 'guide',
    minutes: 5,
    quizModuleId: 'crm2-remedial-works',
    content: [
      { type: 'paragraph', text: 'At Certificate review you decide whether remedial works are required for compliance or simply recommended. Both now run through the same remedial branch — the difference is that a recommended remedial saves the already-satisfactory cert to file, because the property is compliant either way.' },

      { type: 'heading', text: 'Required remedials' },
      { type: 'bullets', items: [
        'Click Need required remedial and continue with the remedial flow as usual.',
      ]},

      { type: 'heading', text: 'Recommended remedials (a satisfactory cert with C3 items)' },
      { type: 'steps', items: [
        'Review the certificate as usual — dates and service-provider names.',
        'Click Recommended remedial.',
      ]},
      { type: 'callout', variant: 'important', text: 'Recommended remedials now follow the same path as required ones — Quotation awaiting → Quotation review → Landlord quote approval → repeat visit. The one difference: because the cert already passed, the satisfactory certificate is saved to file (the property stays compliant), so the works are genuinely recommended rather than needed for compliance.' },
      { type: 'bullets', items: [
        'C3-only certs are satisfactory — the document is satisfactory at this point in time, and that passing cert is saved to file when you press Recommended remedial. C3 items are still worth doing, though, so they go through the recommended-remedial flow rather than being ignored.',
        'Common mistake: don\u2019t automatically redirect a recommended remedial into the required path. On EICRs it\u2019s clear-cut (C1/C2/FI = required, C3 = recommended). On a CP12 there\u2019s no overall pass/fail stamp \u2014 \u201CSafe to use: YES\u201D on every appliance means no safety failure forcing a required remedial, but it doesn\u2019t make every noted item elective. Read the engineer\u2019s notes and judge each remedial (required vs recommended) on its own merits.',
      ]},

      { type: 'heading', text: 'The remedial branch — required and recommended both take it' },
      { type: 'paragraph', text: 'Whichever you press, the job leaves the main path the same way: Quotation awaiting (the agent asks the provider for a quote) → Quotation review (your checkpoint) → Landlord quote approval (the landlord agrees to pay) → approved re-enters Scheduling for the repeat visit / rejected → Remedial terminated.' },

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
    kind: 'guide',
    minutes: 5,
    quizModuleId: 'crm2-certificate-review',
    content: [
      { type: 'heading', text: 'Check on every certificate' },
      { type: 'bullets', items: [
        'Address — check it on the certificate, and on all the paperwork more generally (invoices and quotes too). Not every invoice or quote carries an address, but most do, so it\u2019s always best to check. Landlords sometimes send a document for another property in their portfolio.',
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
        'A CP12 isn\u2019t labelled satisfactory / unsatisfactory the way an EICR is — it categorises each appliance individually. Think of a clean one as \u201Cpassed, with any noted recommendations\u201D rather than \u201Csatisfactory\u201D.',
        'Check the \u201CSafe to use\u201D column. If every appliance is YES there\u2019s no safety failure forcing the required-remedial path — but that doesn\u2019t make every noted item elective. Read the engineer\u2019s notes and decide required vs recommended on the item\u2019s own merits.',
        '\u201CSafe to use\u201D is about immediate safety, not about whether the work should be done. A noted remedial (e.g. a missing flame supervision device on an old hob) can still matter without turning the whole record into a fail.',
      ]},
      { type: 'image', src: '/crm2/cp12-safe-to-use.png', text: 'A CP12 with the \u201CSafe to use\u201D column — worked example: a missing flame supervision device on an old hob; the appliance is still safe to use, so the record passes with the item noted as a recommendation (request 248).' },

      { type: 'heading', text: 'Reading an EICR' },
      { type: 'bullets', items: [
        'An EICR does carry an overall outcome — Satisfactory or Unsatisfactory — unlike a CP12.',
        'The observations are coded: C1 (danger present), C2 (potentially dangerous) and FI (further investigation) mean work is required; C3 (improvement recommended) is advisory only.',
        'An EICR with only C3 items is satisfactory — the property is compliant — but the C3s should still go through the recommended-remedial flow. Only a cert with no observations at all needs no remedials.',
        'C1, C2 or FI codes mean remedial works: send the job down the required-remedial path.',
      ]},
      { type: 'callout', variant: 'warning', text: 'Read the codes, not just the summary box: FI (further investigation) is a fail code, just like C1 and C2. If an EICR lists any FI items it is unsatisfactory \u2014 don\u2019t be misled by a \u201Csatisfactory\u201D-looking summary. Send the job down the required-remedial path.' },
      { type: 'callout', variant: 'tip', text: 'If a cert is marked satisfactory but still lists FI items, that\u2019s a contradiction — ask the service provider for clarification rather than approving it as-is.' },

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
    summary: 'Why an EPC differs from an EICR or gas cert, and what happens when a landlord goes quiet.',
    icon: '⚡',
    pillar: 'features',
    kind: 'guide',
    minutes: 3,
    quizModuleId: 'crm2-epc',
    content: [
      { type: 'paragraph', text: 'Unlike an EICR or a Gas Safety Certificate, an EPC does not have to be renewed during a live tenancy. It does have to be valid before you market the property, sign a new agreement with different tenants, formally change the tenancy agreement with existing tenants, or serve notice — so renewing is best practice.' },
      { type: 'callout', variant: 'warning', text: 'The exception: some properties fall under a selective licensing clause, which means they must have a valid EPC at all times — not just at the trigger points above. If a property is subject to selective licensing, treat the EPC as required and keep it in date.' },

      { type: 'heading', text: 'When the landlord doesn\u2019t respond' },
      { type: 'paragraph', text: 'Because an EPC isn\u2019t legally required mid-tenancy, an unresponsive landlord used to raise the question of whether to chase or cancel. That\u2019s now settled: we keep the EPC in date. If a renewal is due and the landlord doesn\u2019t reply, the job behaves like any other at Landlord approval — at +4 days it auto-advances to provider selection, and the system assigns a provider to carry out the renewal, following the landlord preferences the PM filled out (now embedded in CRM 2.0).' },
      { type: 'callout', variant: 'important', text: 'An unresponsive landlord doesn\u2019t block an EPC. The system auto-assigns the provider and the renewal proceeds — we don\u2019t leave it to lapse, cancel the job, or chase an emergency contact.' },
    ],
  },

  // ─── Work smarter ──────────────────────────────────────────────────────────
  {
    slug: 'escalations-timing',
    title: 'Escalations & timing in practice',
    summary: 'Reading the next-action date, third-party blocks, and the 3-day wait cap.',
    icon: '🚦',
    pillar: 'operate',
    kind: 'guide',
    minutes: 4,
    quizModuleId: 'crm2-escalations',
    content: [
      { type: 'heading', text: 'Reading the next-action date' },
      { type: 'paragraph', text: 'The date and time at the bottom of a job is the next agent action — not necessarily the next escalation. It may just be an auto reminder. The full list of planned actions sits on the right-hand side of the job.' },
      { type: 'image', src: '/crm2/planned-actions.png', text: 'The planned-actions list on the right-hand side of the job.' },
      { type: 'callout', variant: 'tip', text: 'If the next action is an escalation, you can action it in advance. If it\u2019s an auto reminder, leave it.' },

      { type: 'heading', text: 'Call before you Wait' },
      { type: 'callout', variant: 'warning', text: 'Don\u2019t just set Wait on a silent party — call them first. Setting Wait without calling is the single most-flagged operator deviation (48% of Wait actions). The SOP asks for a call, not just a snooze; Wait is for after you\u2019ve tried to reach them.' },

      { type: 'heading', text: 'Jobs blocked by a third party' },
      { type: 'callout', variant: 'info', text: 'If a job is blocked by someone who isn\u2019t the tenant, landlord or provider — for example a block manager — divert the job to Manual. Manual mode in CRM 2.0 is the hold state: use it to sit the job outside the automated flow until the information arrives, rather than cancelling and re-creating it.' },

      { type: 'heading', text: '\u201CWait for response\u201D caps at 3 days' },
      { type: 'bullets', items: [
        '\u201CWait for response\u201D maxes out at 3 days.',
        'If a provider is away longer than that (e.g. on annual leave), divert the job to Manual rather than repeatedly re-setting the 3-day wait.',
      ]},
    ],
  },
  {
    slug: 'escalations-reference',
    title: 'Escalations reference: every trigger & the edge cases',
    summary: 'The exceptions the agent raises outside the happy path — what each one means, and how to handle the document & email cases.',
    icon: '🧯',
    pillar: 'operate',
    kind: 'guide',
    minutes: 5,
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
          ['Certificate shows faults \u2014 remedial needed', 'Decide required vs recommended at Certificate review. (See \u201CRemedial works\u201D.)'],
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
    kind: 'guide',
    minutes: 4,
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
        'Some providers sit outside the automated flow — British Gas jobs, for example, are diverted to Manual in CRM 2.0.',
      ]},

      { type: 'heading', text: 'Tools & resources' },
      { type: 'bullets', items: [
        'SOP guide — the full reference for the happy path, the remedial branch (mandatory vs optional) and the landlord-DIY workflow, plus the escalation points. There\u2019s an automated solution for most cases — use it before manually sending emails.',
        'Price cheat sheet — landlords often ask what a service costs before authorising it. The figures are in the Service price cheat sheet in this space (also in the SOP guide, bottom section → Scenario SOPs) and were built from information the team supplied. Give the figure straight from the sheet rather than guessing.',
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
    kind: 'reference',
    minutes: 3,
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
          ['Wait For SP', 'Pauses the job while waiting on a service provider. Lifts the red flag until the job returns to you.'],
          ['Manual', 'The hold state for anything that needs to sit outside the automated flow for a while — a third-party block, a provider away on long leave, or a British Gas job. Use it instead of cancelling and re-creating the job.'],
          ['Take Over', 'You step in and take the next action on a job yourself, rather than leaving it to the agent.'],
          ['Wait for response', 'Holds the job for a provider\u2019s reply — capped at 3 days. If they\u2019ll be longer than that, divert the job to Manual rather than re-setting the wait.'],
        ],
      },

      { type: 'heading', text: 'Certificate types' },
      { type: 'table',
        headers: ['Certificate', 'Note'],
        rows: [
          ['CP12 (Gas Safety Certificate)', 'Categorises each appliance against the \u201CSafe to use\u201D column rather than giving the whole cert a satisfactory/unsatisfactory stamp. A clean one is \u201Cpassed, with any noted recommendations\u201D \u2014 read the notes.'],
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
    kind: 'guide',
    minutes: 5,
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
      { type: 'callout', variant: 'info', text: 'Every other appliance is \u201CSafe to use: YES\u201D, so there\u2019s no safety failure on the record — it passes, with this item noted. The flagged item rides alongside as a remedial; whether it\u2019s required or optional is a judgement call on the item itself, not something \u201Csafe to use\u201D settles for you.' },

      { type: 'heading', text: 'The remedial branch' },
      { type: 'paragraph', text: 'You decide the remedial is worth doing, so the job branches:' },
      { type: 'steps', items: [
        'Quotation awaiting — the agent asks the contractor for a quote for the remedial work.',
        'Quotation review — you check the quote.',
        'Landlord quote approval — the landlord agrees to pay.',
        'A repeat visit completes the works. (Had the landlord declined, the branch would end at Remedial terminated and the cert would still stand as a pass with the item noted.)',
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
    kind: 'reference',
    minutes: 3,
    content: [
      { type: 'paragraph', text: 'The decisions that come up again and again, boiled down. Bookmark this and keep it open while you work through your queue.' },
      { type: 'table',
        headers: ['When you see this…', 'Do this'],
        rows: [
          ['A satisfactory cert with recommended items noted', 'Press Recommended remedial. It runs the same branch as a required remedial (quote → landlord approval → repeat visit), but the passing cert is saved to file since the property is already compliant. Don\u2019t redirect it into the required path.'],
          ['A CP12 where every appliance is \u201CSafe to use: YES\u201D', 'No safety failure \u2014 it passes with any items noted. Still read the notes and judge each remedial required vs recommended; \u201Csafe to use\u201D doesn\u2019t make them automatically elective.'],
          ['The AI has flagged the address', 'Just a hint to look, not an error to fix. Common trigger: a handwritten certificate.'],
          ['A cert for the wrong property', 'Two actions: upload it to the property it belongs to (CRM 1 \u2192 File Manager), and request the correct cert for this job.'],
          ['A landlord going quiet on an EPC', 'Silence doesn\u2019t block it — at +4 days the job auto-advances and the system assigns a provider, so the renewal proceeds. We keep the EPC in date rather than let it lapse.'],
          ['A job blocked by a block manager / other third party', 'Divert the job to Manual — the hold state — until the information arrives. Don\u2019t cancel and re-create.'],
          ['A provider away longer than 3 days', 'Divert the job to Manual rather than repeatedly re-setting the 3-day wait.'],
          ['The next-action date at the bottom of a job', 'If it\u2019s an escalation you can action it early; if it\u2019s an auto reminder, leave it.'],
        ],
      },

      { type: 'heading', text: 'Which button? — the calls people mix up' },
      { type: 'table',
        headers: ['Situation', 'Right action'],
        rows: [
          ['You\u2019re passing on information you received from one party', 'Add Direct Info — write it as the party you got it from; choose the right source (e.g. From Provider).'],
          ['Both sides have already agreed the appointment', 'Set Visit Date — it records an agreed slot; it is not for passing on information.'],
          ['A party gives a relative time or window like \u201Cmorning\u201D', 'Set Visit Date manually and put the window in the Time note field (e.g. \u201Cin the morning\u201D) — it overrides the exact time. The AI won\u2019t accept a relative time as confirmation on its own.'],
          ['The landlord approves the works by phone', 'Click the approval button directly (e.g. Approved, Use Dwelly SP) — not Add Direct Info.'],
          ['A new time is agreed (both in the thread, or one proposed + you confirmed the other by phone)', 'Reset Visit Date.'],
          ['No new time is agreed yet', 'Restart Scheduling — pick tenant or provider and write the opening message so context carries over.'],
          ['You spot a problem with a cert (wrong date/address)', 'Invalid certificate.'],
          ['A new cert arrived that the agent didn\u2019t recognise', 'Upload another certificate.'],
          ['Faults that must be fixed for compliance', 'Need required remedial (mandatory remedial branch).'],
          ['A satisfactory cert with C3 / recommended items only', 'Recommended remedial — same path as a required remedial, but the satisfactory cert is saved to file.'],
          ['A closed job gets a thank-you or unrelated email', 'Provide Instructions (\u201Cdo nothing\u201D) — but it\u2019s admin-only, so consult an admin first.'],
        ],
      },
      { type: 'callout', variant: 'warning', text: 'This is a summary — the full reasoning lives in the feature lessons. When a case doesn\u2019t fit neatly, read the whole job before acting.' },

      { type: 'heading', text: 'Try it: the button advisor' },
      { type: 'paragraph', text: 'Not sure which action fits? Answer two quick questions and the advisor points you to the right button, with the reasoning.' },
      { type: 'widget', widget: 'button-advisor' },
    ],
  },
  {
    slug: 'price-cheatsheet',
    title: 'Service price cheat sheet',
    summary: 'What each compliance service costs, by agency and provider — so you can answer a landlord\u2019s \u201Chow much?\u201D straight away.',
    icon: '💷',
    pillar: 'operate',
    kind: 'reference',
    minutes: 3,
    content: [
      { type: 'paragraph', text: 'Landlords often ask what a service costs before they authorise it. Give them the figure straight from this sheet rather than guessing. Prices were supplied by the team per agency and provider — always specify whether VAT is included, and check the note where the price depends on property size.' },
      { type: 'callout', variant: 'warning', text: 'These figures are indicative and can change. If a quote on a live job differs, trust the job — and flag the difference so the sheet can be kept up to date.' },

      { type: 'heading', text: 'Lime (Tom)' },
      { type: 'table',
        headers: ['Cert', 'Provider', 'Price'],
        rows: [
          ['EICR', 'Beaumont Electrical', '£200.00 total (no VAT on invoice)'],
          ['EPC', 'Paul Barnett', '£78 total (no VAT on invoice)'],
          ['Gas safety', 'Rix Gas Services', '£65.00 + VAT (£78.00 inc VAT)'],
          ['Gas safety + boiler service', 'Rix Gas Services', '£102.50 + VAT (£123.00 inc VAT)'],
        ],
      },

      { type: 'heading', text: 'GR (Natasha)' },
      { type: 'table',
        headers: ['Cert', 'Provider', 'Price'],
        rows: [
          ['EICR', 'BH Electrical', '£165 + VAT'],
          ['EPC', 'Angliawide EPCs', '£60 (no VAT) — not dependent on property size'],
          ['Gas', 'GasFit Limited', '£90 (no VAT) — basic service included'],
        ],
      },

      { type: 'heading', text: 'Penn (Natasha)' },
      { type: 'table',
        headers: ['Cert', 'Provider', 'Price'],
        rows: [
          ['EICR', 'Steve Smith Electrical Contractors Ltd', 'Depends on property size'],
          ['EPC', 'Phil Le Grice', '£108 (no VAT)'],
          ['Gas', 'Tilley\u2019s Property Services Ltd', '£75 + VAT'],
        ],
      },

      { type: 'heading', text: 'HC (Millie)' },
      { type: 'table',
        headers: ['Cert', 'Provider', 'Price'],
        rows: [
          ['Gas Safety / CP12', 'William May', '£99 inc VAT (inc boiler service)'],
          ['EICR', 'Fortress Electrical', '£180 inc VAT'],
          ['EPC', 'PRT Property', '£100 inc VAT'],
        ],
      },

      { type: 'heading', text: 'Parks (Paige)' },
      { type: 'paragraph', text: 'Preferred right now: Gas safety — TNT; EICR — Allsparks.' },
      { type: 'table',
        headers: ['Contractor', 'Type', 'Landlord pays', 'Contractor receives'],
        rows: [
          ['Allsparks', 'EICR', '£239', '£144'],
          ['Allsparks', 'PAT Test', '£110', '£80'],
          ['Energista', 'EPC', '£135', '£89'],
          ['Capital (non-VAT)', 'EICR', '£239', '£120'],
          ['TNT Plumbing & Heating', 'Gas', '£110', '£84'],
          ['TNT Plumbing & Heating', 'Gas + Service', '£130', '£99.32 (was £96)'],
          ['Locker Gas, Heating & Plumbing', 'Gas', '£110', '£86.35 (was £72)'],
          ['Locker Gas, Heating & Plumbing', 'Gas + Service', '£130', '£102'],
        ],
      },
      { type: 'callout', variant: 'info', text: 'For Parks, prices are inclusive of VAT except for Capital.' },

      { type: 'heading', text: 'Number 1 (Tom)' },
      { type: 'table',
        headers: ['Cert', 'Provider', 'Price'],
        rows: [
          ['Gas certificate only', 'Liam — Action Services', '£75 + VAT (£90 inc VAT)'],
          ['Gas certificate + boiler service', 'Liam — Action Services', '£116.67 + VAT (£140 inc VAT)'],
          ['EICR', 'Craig — CS Electrical', '£150 + VAT (£180 inc VAT)'],
          ['EPC', 'Adrian', '£75 + VAT (£90 inc VAT)'],
        ],
      },

      { type: 'heading', text: 'Brookdale (Craig)' },
      { type: 'table',
        headers: ['Cert', 'Provider', 'Price'],
        rows: [
          ['EICR', 'Kev Brader Electrical / 8/5 Electrical Ltd', '1 bed £180 · 2–3 bed £204 · 4+ bed £228 (all inc VAT)'],
          ['EPC', 'Energy Focus', '£85 (no VAT)'],
          ['CP12', 'G L Plumbing, Heating & Maintenance', '1 appliance £60 (+£16 with service) · 2 appliance £71 (+£16 with service) · 3 appliance £82 (+£16 with service) — all + VAT'],
        ],
      },
    ],
  },
  {
    slug: 'faq',
    title: 'FAQ & common gotchas',
    summary: 'Straight answers to the questions that come up most in the 2.0 trial — certificates, scheduling, cancellations, invoices and where to get help. Use the section list on the right to jump.',
    icon: '❓',
    pillar: 'operate',
    kind: 'reference',
    minutes: 12,
    content: [
      { type: 'paragraph', text: 'These are the real questions operators have asked during the 2.0 trial, grouped by theme. Tap any question to open the answer.' },
      { type: 'callout', variant: 'important', text: 'The biggest gotcha overall: acting on the most recent message alone. The agent often suggests an action from the latest activity — read the whole job before you decide.' },

      { type: 'heading', text: 'Certificates & remedials' },
      { type: 'faq', faqs: [
        { q: 'How do I judge a CP12 that never says \u201Csatisfactory\u201D?', a: 'A gas certificate categorises each appliance rather than giving the whole document a pass/fail stamp \u2014 treat a clean one as \u201Cpassed, with any noted recommendations\u201D. Read the \u201CSafe to use\u201D column: if every appliance is YES there\u2019s no safety failure forcing a required remedial, but read the engineer\u2019s notes and judge each remedial (required vs recommended) on its merits rather than assuming \u201Csafe to use\u201D makes it elective.' },
        { q: 'Which remedial type do I choose on a certificate?', a: 'When a cert carries remedials, pick the right type \u2014 required vs recommended (C3) \u2014 before moving the job on. The type drives which comms go out and which downstream workflow the job follows, so the wrong choice sends the landlord the wrong message. Read the cert in full before you select.' },
        { q: 'What happens when I press Recommended remedial on a satisfactory cert?', a: 'The job runs the same remedial branch as a required remedial — Quotation awaiting → Quotation review → Landlord quote approval → repeat visit — all within CRM 2.0. The difference is that the already-satisfactory certificate is saved to file, because the property stays compliant whether or not the recommended works go ahead.' },
        { q: 'Do recommended remedials still create a maintenance job in CRM 1.0?', a: 'No \u2014 not any more. Recommended remedials now follow the same in-CRM-2.0 remedial branch as required ones; there\u2019s no hand-off to a CRM 1.0 maintenance job, and you don\u2019t send the landlord a separate comms email yourself.' },
        { q: 'Can I undo remedials I\u2019ve already marked as required?', a: 'Not in-product \u2014 once remedials are marked required and the job moves to quotation stage there\u2019s no route back, and Take Over won\u2019t reverse it. Get the required-vs-recommended call right up front, as it\u2019s currently one-way; if you\u2019re genuinely stuck, ask the product team to close the job.' },
        { q: 'I pressed the wrong remedial button \u2014 how do I recover?', a: 'Both buttons now send the job down the same remedial branch (quote → landlord approval → repeat visit), so a wrong press doesn\u2019t split the job across systems. The practical difference is whether the passing cert was saved to file, so get the required-vs-recommended call right up front \u2014 it\u2019s currently one-way. If you truly picked the wrong one, ask ops to correct the job rather than trying to reverse it yourself.' },
        { q: 'The cert was corrected after remedials were raised \u2014 how do I fix it?', a: 'If a job has gone down the remedial flow and the provider then confirms no remedial was needed (e.g. a wrongly completed cert that\u2019s since been re-issued), there\u2019s no easy way back to certificate review once the invoice is approved. Upload the correct certificate manually (CRM 1.0 file manager / property page), then ask ops to cancel the 2.0 job.' },
        { q: 'The landlord did the remedials themselves \u2014 what now?', a: 'Use \u201Cswitch back to us\u201D. A fresh certificate isn\u2019t automatically needed: if the original cert is satisfactory, what you need is proof the landlord did the work (e.g. photos or a receipt for replaced smoke alarms) stored on the job. Check with the provider before assuming they\u2019ll re-issue or re-charge.' },
        { q: 'A provider re-sent a document I\u2019ve already processed \u2014 do I upload it again?', a: 'No. Re-uploading a certificate or invoice that 2.0 has already processed pushes the job back to document review and can re-trigger comms to the provider, even after the job has moved on to remedials. Ignore duplicate sends. There\u2019s no guardrail against this yet, so it\u2019s on the operator to catch \u2014 and if it\u2019s already happened, call the provider to disregard the last emails and ask ops to revert the job to the right stage.' },
        { q: 'What\u2019s the EICR date rule?', a: 'Validity is 5 years from the date of inspection, and the issue date is the date the inspection was carried out. Standard EICR observation notes are normal \u2014 don\u2019t treat them as remedials.' },
        { q: 'Does an EPC have to be renewed during a tenancy?', a: 'No. Unlike an EICR or gas cert, an EPC doesn\u2019t have to be renewed mid-tenancy \u2014 but it must be valid before you market the property, sign a new agreement with different tenants, formally change the agreement with existing tenants, or serve notice. So renewing is best practice.' },
        { q: 'The landlord sent a certificate for a different property \u2014 do I just reject it?', a: 'No \u2014 take two actions. Upload the cert to the property it actually belongs to (CRM 1.0 \u2192 File Manager) so it isn\u2019t wasted, then request the correct cert for this job\u2019s property.' },
      ] },

      { type: 'heading', text: 'Landlord DIY & landlord-held certificates' },
      { type: 'faq', faqs: [
        { q: 'The landlord already holds a valid certificate \u2014 should I cancel the job?', a: 'No \u2014 cancelling loses the compliance record. Ask for the job to be switched to LL DIY, then upload the certificate against the job so the document is stored and the property shows as compliant.' },
        { q: 'Can I use Landlord DIY to park a job I\u2019ll document later?', a: 'No. The LL DIY flow has no invoice-upload step, and dropping notes doesn\u2019t register a cert or invoice either. Only move a job to LL DIY when the landlord genuinely is arranging the work themselves; if a certificate and invoice need attaching, keep the job in its normal flow and upload them there.' },
        { q: 'One landlord replied about several flats \u2014 is that one job or many?', a: 'Each flat stays its own job. Where the landlord says they\u2019ll arrange it, set LL DIY on each property named (Take Over first where a job needs it). For flats that are expiring but not yet in 2.0, don\u2019t try to bolt them on \u2014 email the landlord the expiry dates so they can plan.' },
      ] },

      { type: 'heading', text: 'Scheduling & visits' },
      { type: 'faq', faqs: [
        { q: 'A tenant rescheduled out-of-band (e.g. by email) \u2014 how do I handle it?', a: 'It arrives in 2.0 as an escalation. Just Set Visit Date to the agreed new slot \u2014 replying to the tenant won\u2019t break the automated flow, and no special handling is needed.' },
        { q: 'The tenant wasn\u2019t home on the day \u2014 what\u2019s the right action?', a: 'Use \u201CRestart Scheduling\u201D. It puts the job back into the scheduling loop rather than needing a new job or an ops fix, so there\u2019s no need to flag it for help first.' },
        { q: 'A visit is booked but no longer needed \u2014 what do I do first?', a: 'Tell the provider before you ask for the job to be cancelled \u2014 especially for same-day visits. Cancelling in the system doesn\u2019t reach the provider, so an uninformed SP will still attend and the visit becomes abortive. Confirm to ops that the SP has been told when you request the cancellation.' },
        { q: 'A cancelled job never reached the provider \u2014 how do I stop them booking it?', a: 'Cancelling doesn\u2019t notify the SP, so they can carry on booking a job that no longer exists. When Take Over is unavailable (the only button being \u201CProvide Instructions\u201D), use the Send comms option to email the SP directly and tell them to stand down, then confirm in the channel once they\u2019ve been emailed.' },
        { q: 'An empty property is being relet \u2014 how should I time the visit?', a: 'Date the certificate as close to the new move-in as possible. Don\u2019t force the timing through the scheduling loop \u2014 call the SP directly, agree a date, and set the visit date on the job manually.' },
        { q: 'Set Visit Date or Add Direct Info on a property with no tenant?', a: 'Use Set Visit Date. A property with no tenant needs no different flow and no cancelling \u2014 proceed exactly as a regular job and the agent sends the confirmation to the relevant parties. Using Add Direct Info instead is what makes the job bounce back to you unresolved.' },
        { q: 'I got a \u201Cverify the keys\u201D escalation the day before an untenanted visit \u2014 is that a glitch?', a: 'No, it\u2019s expected. For untenanted properties you\u2019ll get an escalation the day before asking you to confirm the keys are available for collection from the office. Check they\u2019re actually there, then click \u201CNo action needed\u201D to close it out.' },
      ] },

      { type: 'heading', text: 'Cancelling & scope' },
      { type: 'faq', faqs: [
        { q: 'Do I need to process jobs that haven\u2019t escalated?', a: 'Not for now \u2014 only handle flags. If a job hasn\u2019t escalated, it doesn\u2019t need you yet.' },
        { q: 'Should I take over a job early just to call the tenant or provider?', a: 'No. If there\u2019s no new urgent information to process, let the agent keep working \u2014 it will escalate to you when it needs a human. Taking over early just adds work and can cut across what the agent is doing.' },
        { q: 'A job is out of scope (vacant, being sold, etc.) \u2014 is cancelling enough?', a: 'No. You must cancel the job and set the property\u2019s compliance filters to \u201Cnot needed\u201D, otherwise the job regenerates and you see it again. Operators can\u2019t cancel themselves today, so raise it in-channel with the job link and the reason.' },
        { q: 'I cancelled a job and it came back the next day \u2014 why?', a: 'Cancelling alone doesn\u2019t stop it: if the property\u2019s compliance preferences still say the certificate is required, the system recreates the same job. Change the relevant preference to \u201Cnot needed\u201D (or amend it to match reality) first, then request the cancellation \u2014 ops will hold the cancellation until the preferences are updated.' },
        { q: 'The landlord has ignored a compliance request throughout \u2014 can I cancel it?', a: 'Yes, where the landlord has had the request (sometimes twice), never responded, and is visibly active on other CRM 1.0 tasks, the silence is a choice. Two things must both happen: the request is cancelled in 2.0 (ask ops \u2014 TCs don\u2019t have the permission) and the task is set to \u201Cnot needed\u201D in CRM 1.0, or it simply comes back round.' },
        { q: 'A job disappeared from my 2.0 list but I can see it in 1.0 \u2014 is it duplicated?', a: 'No. It\u2019s normally been cancelled in 2.0 and moved back to 1.0 \u2014 the intended transfer behaviour \u2014 so only one live job exists. A common trigger is a contract that doesn\u2019t exist reopening in 1.0. Check with ops before raising anything if you\u2019re unsure.' },
        { q: 'A job reached 2.0 late or via a transfer error \u2014 should I send it back to CRM 1?', a: 'Not on that basis alone \u2014 2.0 handles these and comparable cases are already running there. If a genuine hand-back is needed, ops pauses the auto-transfer first and then cancels the 2.0 request; confirm the pause has actually applied before raising the 1.0 job, or the landlord gets another duplicate email.' },
        { q: 'A landlord queries the scope of a job \u2014 do I raise a change?', a: 'Check first. Open the job and read the actual scope \u2014 it\u2019s often already correct, and what misled them was the parsed job title in the agent\u2019s email (e.g. a \u201Cboiler service\u201D label on a property with a heat pump). Only where the scope genuinely is wrong do ops modify it in 2.0 and the operator aligns the equivalent 1.0 job.' },
      ] },

      { type: 'heading', text: 'AI extraction & summaries' },
      { type: 'faq', faqs: [
        { q: 'The AI flagged or marked a field \u201Cillegible\u201D \u2014 must I correct it?', a: 'No. A flagged or illegible field on a handwritten cert is a hint to check, not an error to fix. If the detail on the certificate is correct, no edit is required \u2014 the flag just draws your attention, and there\u2019s no audit reason to amend it.' },
        { q: 'The agent mis-read a contractor\u2019s handwriting \u2014 should I fix it?', a: 'If the mis-read is cosmetic and doesn\u2019t change the substance of the job, leave it and proceed \u2014 there\u2019s no audit problem. Escalate only where the mis-read changes something that drives the job: wrong property, wrong appliance, or wrong expiry.' },
        { q: 'The AI treated a name in the landlord\u2019s reply as a service provider \u2014 is the approval still valid?', a: 'Yes, the landlord\u2019s approval still stands; the extraction error doesn\u2019t invalidate it. Don\u2019t try to correct it with Add Direct Info \u2014 just select the provider you intend to use and let the job move on.' },
        { q: 'Can I act on the AI\u2019s summary of a landlord\u2019s email?', a: 'Open the original first. The summary can state the opposite of what the landlord actually said (e.g. that they were arranging the EPC themselves when they\u2019d in fact asked us to book it). Before cancelling or closing a job on the strength of a summary, use \u201Cview full email\u201D and read their own words \u2014 and post the job link plus the real wording in the trial channel so the error can be logged.' },
        { q: 'The agent tagged the quote as the invoice \u2014 how do I unpick it?', a: 'Download both documents. Click \u201Cupload another document\u201D and upload the actual invoice, then add the quote via Add Direct Info \u2192 from SP \u2192 upload the quote, so it\u2019s treated as SP-sent. Flag repeat cases to product so the classifier can be improved.' },
        { q: 'My change request won\u2019t submit \u2014 what\u2019s wrong?', a: 'The form has more fields than are visible on screen: scroll down and fill in every field, or the submit button appears not to work. (A change request that never reaches the landlord is often a wrong landlord email address \u2014 correct it through the change request on PM questions.) It\u2019s not a bug; while you sort it, put the job on a 1-day wait rather than letting it auto-progress.' },
      ] },

      { type: 'heading', text: 'Invoices' },
      { type: 'faq', faqs: [
        { q: 'The Invoice Approved button won\u2019t fire \u2014 what do I check?', a: 'Check the invoice record for a blank Sub Total \u2014 it blocks approval and the system gives no message saying which field is missing. Fill it in and the button fires. If every field is populated and it still won\u2019t go, post the job link plus a screenshot.' },
        { q: 'I\u2019m waiting on a corrected invoice \u2014 should I press \u201Cinvalid invoice\u201D?', a: 'No. If the invoice is fine but unusable (blank details, cropped) and you\u2019ve asked the SP to re-send, don\u2019t mark it invalid \u2014 call the SP to chase, and when the clean copy arrives click \u201Cupload another invoice\u201D. Leave the job where it is in the meantime.' },
        { q: 'The invoice doesn\u2019t match the quote \u2014 do I reject it?', a: 'No, don\u2019t reject it outright (for compliance or maintenance). The numbers legitimately differ sometimes \u2014 the SP found something extra on site, the landlord or PM asked for additional work, or a compliance SP simply doesn\u2019t quote the same way before invoicing. Default to flagging the mismatch to the PM rather than auto-rejecting.' },
      ] },

      { type: 'heading', text: 'Comms, Add Direct Info & flags' },
      { type: 'faq', faqs: [
        { q: 'Does Add Direct Info get relayed to the provider?', a: 'No. Anything you enter with Add Direct Info (e.g. the tenant now agreeing entry with management keys) is not automatically sent to the SP. After adding it, call or message the provider yourself so they act on it, then leave the job to run once they confirm a date. Assume nothing you add reaches the SP unless you send it.' },
        { q: 'I handled something off-system \u2014 how do I record it?', a: 'Send a short email confirming the arrangement so there\u2019s a written record on the job, email the tenant too so they\u2019re not left guessing, then click No Action Needed. There\u2019s no separate \u201Chandled offline\u201D state \u2014 the confirming email is the record.' },
        { q: 'An action-required flag is still showing after I\u2019ve dealt with it \u2014 how do I clear it?', a: 'If you\u2019ve already actioned or responded (e.g. the visit date is set and confirmed, or you replied by email), click Wait for Response and select the right domain; the flag then clears itself. Don\u2019t use Provide Instructions to force the job on, and don\u2019t re-send comms the parties have already had.' },
      ] },

      { type: 'heading', text: 'Waiting & timing' },
      { type: 'faq', faqs: [
        { q: 'How long can I wait for a provider to respond?', a: '\u201CWait for response\u201D caps at 3 days. If a provider is away longer, set the 3 days and extend again when the job comes back to your queue.' },
        { q: 'I\u2019m chasing an SP over a weekend \u2014 how long should the wait be?', a: 'Set a 1-day wait, not 3, when the next working day is Monday. A 3-day wait re-flags the job mid-week; a 1-day wait brings it back on Monday, the earliest you could act anyway.' },
        { q: 'Take Over / call / send comms won\u2019t do anything \u2014 is it a permissions problem?', a: 'Usually not \u2014 the agent is most likely still processing the job (it\u2019s heaviest around midday and can hang for a few minutes). Wait and refresh rather than moving the job to MANUAL; the agent will normally draft the communication for you. Only escalate if it\u2019s still blocked well after the queue clears.' },
        { q: 'The Approve certificate button won\u2019t respond \u2014 what do I try?', a: 'First clear cache and cookies and log back in \u2014 that clears the common local cause. If the button is still dead both before and after editing the expiry date, treat it as a platform issue, not a local one: post the job link and a short screen recording, leave the job pending, and escalate rather than forcing another route.' },
      ] },

      { type: 'heading', text: 'Permissions & where to get help' },
      { type: 'faq', faqs: [
        { q: 'The phone number links are greyed out \u2014 is that a fault?', a: 'No \u2014 contact links only become click-to-call once you press Take Over. Take the job over first, then call. The same applies to other actions on a job you haven\u2019t taken over.' },
        { q: 'I need to Cancel or Provide Instructions but have no access \u2014 what do I do?', a: 'The TC role currently can\u2019t cancel a request and has no access to Provide Instructions. When a job can only move via one of those, post the job link in-channel and ask ops to action it rather than looking for a workaround. It\u2019s a known open item.' },
        { q: 'Who do I escalate to first?', a: 'Ops is the first line of call for all 2.0 trial questions. Only escalate to product once ops has looked at it, so product time is spent on genuine platform issues rather than process questions.' },
        { q: 'Where\u2019s the quote cheat sheet?', a: 'It lives in the Scenario SOPs section at the bottom of the SOP page. If it doesn\u2019t render, refresh the page \u2014 a stale tab can hide new sections. Always provide the LL with a quote where the SOP calls for one; the cheat sheet has the standard wording.' },
      ] },
    ],
  },
  {
    slug: 'whats-new',
    title: 'What\u2019s new in 2.0 (vs 1.0)',
    summary: 'The headline changes from the old CRM, so you know what to expect and what\u2019s different.',
    icon: '📣',
    pillar: 'operate',
    kind: 'reference',
    minutes: 3,
    content: [
      { type: 'paragraph', text: 'If you\u2019ve worked in CRM 1.0, here\u2019s what actually changes in 2.0. These are the differences worth knowing before you pick up your first job.' },
      { type: 'bullets', items: [
        'An agent runs the job end to end. Chasing, booking and reminders happen automatically; you step in for the human decisions rather than driving every step.',
        'Certificate review is now the decision point. It\u2019s where you check the document and decide whether remedials are required for compliance or simply recommended.',
        'Vacant properties are fully supported. They\u2019re flagged Unattended, the agent books straight with the provider, and you get a key-collection escalation the day before the visit.',
        'Waiting is time-boxed. \u201CWait for response\u201D caps at 3 days, so jobs come back to you rather than sitting open indefinitely.',
        'The next-action date is visible on every job — with the full list of planned actions on the right — so you can see what the agent will do next and action escalations early.',
      ]},
      { type: 'callout', variant: 'info', text: '2.0 is new and still evolving. If something on a live job doesn\u2019t match what you see here, check with an admin before assuming.' },
      { type: 'divider' },
      { type: 'paragraph', text: 'This learning space launched on 3 Aug 2026 and is reviewed against the live 2.0 build. As 2.0 evolves, new lessons and changes will land here first.' },
    ],
  },
  {
    slug: 'practice',
    title: 'Practice: scenario drills',
    summary: 'Work through realistic jobs decision-by-decision, with instant feedback on every call.',
    icon: '🎯',
    pillar: 'operate',
    kind: 'practice',
    minutes: 10,
    content: [
      { type: 'paragraph', text: 'Reading is one thing — making the call under pressure is another. These drills drop you into real CRM 2.0 jobs and ask you to pick the next action at each step. You get instant feedback and the reasoning, so you can build the instinct before you’re doing it live.' },
      { type: 'callout', variant: 'tip', text: 'There’s no score kept and nothing to pass here — it’s pure practice. Run them as many times as you like; the feedback is the point.' },
      { type: 'widget', widget: 'scenario-drills' },
    ],
  },
  {
    slug: 'capstone',
    title: 'Capstone assessment',
    summary: 'The final sign-off check — a mixed set of questions drawn from every lesson in the space.',
    icon: '🏅',
    pillar: 'operate',
    kind: 'practice',
    minutes: 15,
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

// The guides, in reading order — the only lessons that count towards progress
// and the certificate. Everything on the landing page that shows a count, a
// denominator or a pillar group derives from this, so the numbers stay honest.
export const CRM2_GUIDES: Crm2Lesson[] = CRM2_LESSONS.filter(l => l.kind === 'guide')
export const CRM2_GUIDE_COUNT = CRM2_GUIDES.length
export const CRM2_GUIDE_MINUTES = CRM2_GUIDES.reduce((sum, l) => sum + l.minutes, 0)

// 1-based position of a guide within the reading order (01–12), or null if the
// slug isn't a guide. Used for the number chips and the "Guide nn of 12" pill.
export function getCrm2GuideNumber(slug: string): number | null {
  const idx = CRM2_GUIDES.findIndex(l => l.slug === slug)
  return idx === -1 ? null : idx + 1
}

export function getCrm2Guides(pillar: Crm2Pillar): Crm2Lesson[] {
  return CRM2_GUIDES.filter(l => l.pillar === pillar)
}

// Build a term → definition dictionary from the glossary lesson's tables. Used
// to power inline tooltips in the other lessons, so the whole space shares one
// source of truth for what each term means. Terms are sorted longest-first so a
// longer phrase ("Landlord approval") wins over a shorter substring.
export function getCrm2Glossary(): { term: string; definition: string }[] {
  const glossary = CRM2_LESSONS.find(l => l.slug === 'glossary')
  if (!glossary) return []
  const out: { term: string; definition: string }[] = []
  for (const block of glossary.content) {
    if (block.type === 'table' && block.rows) {
      for (const row of block.rows) {
        if (row[0] && row[1]) out.push({ term: row[0], definition: row[1] })
      }
    }
  }
  return out.sort((a, b) => b.term.length - a.term.length)
}
