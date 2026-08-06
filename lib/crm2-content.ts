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
    slug: 'operator-playbook',
    title: 'Full Operator Playbook',
    summary: 'The complete start-to-finish walkthrough of the compliance flow — every stage, every button, with screenshots from the live CRM.',
    icon: '🧭',
    pillar: 'orientate',
    readTime: '25 min read',
    content: [
      { type: 'paragraph', text: 'A start-to-end walkthrough of the Compliance flow in CRM 2.0, meant to be read straight through, not just used as a lookup. It stitches together the stage guides, the SOPs and the live dashboard figures into one picture of how a compliance job actually moves.' },
      { type: 'callout', variant: 'info', text: 'Legend: 🟩 the agent runs this stage autonomously · 🟧 an operator decision is needed. Where you see “open question” below, that is a genuine gap the team is still resolving — flag it rather than guessing.' },

      // ─── §00 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '00 · The flow in one line' },
      { type: 'paragraph', text: 'Main path: new request → Landlord approval → Provider selection → Scheduling → Visit → Result awaiting → Certificate review → Invoice awaiting → Invoice review → Completed.' },
      { type: 'image', src: '/crm2/flow-diagram.png', text: 'The full compliance flow: the main path across the top, with the LL-DIY, remedial and boiler-service branches coming off it.' },
      { type: 'subheading', text: 'Branches off the main path' },
      { type: 'bullets', items: [
        'LL_DIY — leaves from Landlord approval when the landlord says they will arrange the work themselves; rejoins at Certificate review once their certificate arrives.',
        'Remedial branch — leaves from Certificate review when you press Need remedial: Quotation awaiting → Quotation review → Landlord quote approval → approved re-enters Scheduling (repeat visit) / rejected → Remedial terminated.',
        'Optional remedials (C3 only) — handled at Certificate review itself via the Optional remedial button; the job does not leave the main path.',
        'Boiler service (CP12) rides alongside Landlord approval without changing the stage.',
        'Cancelled can happen from almost any stage.',
      ]},

      { type: 'divider' },

      // ─── §01 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '01 · Landlord approval 🟩' },
      { type: 'paragraph', text: 'Every compliance request starts here — the agent asks the landlord to approve the works before anything is booked.' },
      { type: 'callout', variant: 'info', text: 'Timing: reminders at +1 working day and +3 days. At +4 days an ordinary job auto-advances, but an EPC job escalates to you instead.' },
      { type: 'callout', variant: 'tip', text: 'Landlords often ask for prices before proceeding. Check the cheat sheet, reply to the landlord using Send Communication, then click the appropriate approval button.' },
      { type: 'subheading', text: 'Gas Safety Certificate (CP12)' },
      { type: 'paragraph', text: 'Note the “Add Boiler Service” button — always double-check whether the landlord wants this done. If it is unclear from their response, ask again.' },
      { type: 'image', src: '/crm2/buttons-cp12.png', text: 'Landlord approval buttons for a CP12 job, including Add Boiler Service.' },
      { type: 'subheading', text: 'Electrical Installation Condition Report (EICR)' },
      { type: 'image', src: '/crm2/buttons-eicr.png', text: 'Landlord approval buttons for an EICR job.' },
      { type: 'subheading', text: 'Energy Performance Certificate (EPC)' },
      { type: 'image', src: '/crm2/buttons-epc.png', text: 'Landlord approval buttons for an EPC job.' },
      { type: 'bullets', items: [
        'If the landlord approves by phone, use Landlord approved directly — not Add Direct Info.',
        'British Gas jobs → transfer to “Manual” in CRM 2.0.',
      ]},
      { type: 'callout', variant: 'warning', text: 'Open question: how to handle a landlord who is completely non-responsive at approval, and the East Yorkshire Gas Services (EYGS) routing — both still to be confirmed.' },

      { type: 'subheading', text: '01a · LL_DIY — landlord arranges it themselves 🟩' },
      { type: 'paragraph', text: 'Entered from Landlord approval when the landlord says they will handle it. The agent waits on the landlord\u2019s own certificate, then routes straight to Certificate review. LL_DIY is usually chosen automatically when the landlord explicitly mentions it in their reply and the agent catches it.' },
      { type: 'callout', variant: 'info', text: 'Timing: reminders at +10 and +14 days, then escalates.' },
      { type: 'paragraph', text: 'If the landlord sends a satisfactory certificate but you spot recommended remedials (applies to gas certs), proceed with the recommended-remedial flow.' },

      { type: 'divider' },

      // ─── §02 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '02 · Provider selection 🟩' },
      { type: 'paragraph', text: 'The agent picks the service provider and instructs them. It proceeds with our preferred provider unless the landlord requests a specific one.' },
      { type: 'callout', variant: 'info', text: 'Timing: near-instant. Escalates only if the landlord requests a specific provider.' },
      { type: 'image', src: '/crm2/providers-table.png', text: 'Preferred Compliance Providers reference.' },
      { type: 'subheading', text: 'If the landlord asks for a specific provider' },
      { type: 'steps', items: [
        'Click “Proceed with another provider”.',
        'If they are not on the preferred list, check the provider panel at panel.dwelly.team/dw-admin/html/pm-providers.',
        'If they are not on that list either, ask the relevant PMs for feedback, then onboard the provider following the onboarding SOP.',
      ]},
      { type: 'image', src: '/crm2/provider-picker.png', text: 'Selecting an alternative provider via “Proceed with another provider”.' },

      { type: 'divider' },

      // ─── §03 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '03 · Scheduling — the agent brokers the date 🟩' },
      { type: 'paragraph', text: 'The agent contacts the tenant and provider and finds a matching slot.' },
      { type: 'callout', variant: 'info', text: 'Timing: reminders go to whichever side is silent; escalates on a deadlock.' },
      { type: 'image', src: '/crm2/buttons-scheduling.png', text: 'The Scheduling-stage action buttons.' },
      { type: 'subheading', text: 'Add Direct Info' },
      { type: 'paragraph', text: 'Use this to pass on information you received. Write it as if you are the party you got it from — engineer says 11 August 2pm → you write “11th August 2026 at 2pm”, not the internal message.' },
      { type: 'image', src: '/crm2/adi-example.png', text: 'Add Direct Info — worked example (request 585).' },
      { type: 'image', src: '/crm2/adi-panel.png', text: 'The Add Direct Info panel.' },
      { type: 'subheading', text: 'Set Visit Date' },
      { type: 'paragraph', text: 'Use this — not Add Direct Info, not Provide Instructions — when the correct action is simply logging an appointment both sides have already agreed (e.g. confirmed on a call or in person).' },
      { type: 'image', src: '/crm2/svd-panel.png', text: 'The Set Visit Date panel.' },
      { type: 'callout', variant: 'tip', text: 'Relative times the AI won\u2019t accept for Set Visit Date: “morning” isn\u2019t parsed as a confirmation. Set the visit date manually rather than waiting for an exact time; morning ≈ 8am–12pm (request 578).' },
      { type: 'subheading', text: 'When and how to chase' },
      { type: 'image', src: '/crm2/chase-tenant.png', text: 'Chasing the tenant (more edge cases in the SOPs).' },
      { type: 'image', src: '/crm2/chase-provider.png', text: 'Chasing the provider (more edge cases in the SOPs).' },
      { type: 'callout', variant: 'important', text: 'Never give out direct phone numbers between tenant, landlord and provider — we are only allowed to share masked ones.' },
      { type: 'callout', variant: 'warning', text: 'Legal note: the tenant-access escalation cites the Renters\u2019 Rights Act 2025 (Royal Assent 27 Oct 2025, main provisions in force 1 May 2026). It names agents directly, so an agency can be fined independently of the landlord for missing gas/EICR records — a published penalty line up to £12,000, and up to £40,000 for repeated breaches.' },

      { type: 'divider' },

      // ─── §04 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '04 · Visit — confirms and reminds 🟩' },
      { type: 'paragraph', text: 'The agent holds the booked appointment and sends confirmations and reminders to both sides.' },
      { type: 'callout', variant: 'info', text: 'Timing: one reminder the day before; auto-advances once the date passes.' },
      { type: 'image', src: '/crm2/visit-jobcard.png', text: 'A job at the Visit stage.' },
      { type: 'subheading', text: 'Rescheduling (available at Visit and Result awaiting)' },
      { type: 'image', src: '/crm2/buttons-visit.png', text: 'The two rescheduling actions: Reset Visit Date and Restart Scheduling.' },
      { type: 'bullets', items: [
        'Reset Visit Date — only when both parties have already agreed the new time (both confirmed in the thread, or one proposed and you confirmed the other by phone). Updates the job and notifies both sides automatically.',
        'Restart Scheduling — when a new time has not been agreed yet. Choose whether to restart with tenant or provider, and write the message so context carries over (e.g. “can\u2019t do tomorrow, next Monday works”). Dates in your message are recognised and quoted verbatim at the end of the email. The other party is told the original is cancelled and a new one is being arranged.',
      ]},
      { type: 'image', src: '/crm2/reset-visit-example.png', text: 'Reset Visit Date — worked example.' },
      { type: 'paragraph', text: 'Unattended (vacant) property: flagged Unattended means no tenant, so the agent goes straight to the provider, explains keys are collected from the agency, and books from provider availability. The day before the visit you get an escalation to verify the keys are available for collection.' },
      { type: 'callout', variant: 'tip', text: 'If a provider calls the tenant to say they are running late: if the visit is still on the same date → no action needed; if it has been rescheduled to another day → set the new visit date using the appropriate button.' },
      { type: 'callout', variant: 'warning', text: 'Open question: tenant cancels on the day / no access on arrival, or a provider no-show — who pays, and does the job go back to Scheduling or stay at Visit? Rescheduling without messaging a departing tenant, and keys not available at the day-before check, are also unresolved.' },

      { type: 'divider' },

      // ─── §05 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '05 · Result awaiting 🟩' },
      { type: 'paragraph', text: 'The visit has happened and the agent is waiting on the certificate from the provider.' },
      { type: 'callout', variant: 'info', text: 'Timing: reminders at +1 and +2 days; escalates to you at +3 days.' },
      { type: 'image', src: '/crm2/resultawaiting-jobcard.png', text: 'A job at Result awaiting.' },
      { type: 'image', src: '/crm2/resultawaiting-jobcard2.png', text: 'Result awaiting — the certificate is still outstanding.' },
      { type: 'callout', variant: 'tip', text: 'Before you chase the provider, check the last few emails on the job for attachments or document links — the certificate is sometimes already there (e.g. as a link).' },
      { type: 'paragraph', text: 'Document arrived outside the normal flow (e.g. via Slack)? Don\u2019t take over to upload it — use Add Direct Info, source From Provider, and attach the file. The agent processes it exactly as if it had received it itself.' },
      { type: 'image', src: '/crm2/adi-fromprovider.png', text: 'Add Direct Info with an attachment and source = From Provider.' },
      { type: 'callout', variant: 'warning', text: 'Open question (highest-value gap on this stage): Result awaiting is one of the largest single escalation causes on the dashboard (194 escalations / 5.4% of touchpoints, ~2.3 per job it touches), yet has no SOP scenario. BigQuery (03.08.2026) breaks it down as timeout_provider 82 · agent_stuck 73 · confirmation message 59 · take_over 33 · timeout_tenant 5 — so it is overwhelmingly the agent waiting on or confused about the provider\u2019s certificate. What decision the operator is meant to make when they see “agent_stuck” still needs a straight answer.' },

      { type: 'divider' },

      // ─── §06 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '06 · Certificate review — your checkpoint 🟧' },
      { type: 'paragraph', text: 'A designed touchpoint: every job stops here once a certificate passes the AI check. You get nudged about the pending task and the job waits for your decision — there is no auto-timer.' },
      { type: 'subheading', text: 'What to check on every certificate' },
      { type: 'bullets', items: [
        'Address — landlords sometimes send a certificate for another property in their portfolio.',
        'Numbers — subtotal / VAT / total.',
        'Dates — issue and expiry present and accurate, in the designated fields, on both the certificate and the CRM.',
      ]},
      { type: 'paragraph', text: 'Address flagged by the AI: no need to correct it yourself — it is a hint that the address could be wrong, not an error to fix, unless it is a completely different address, in which case request a valid certificate.' },
      { type: 'callout', variant: 'tip', text: 'Landlord sends a certificate for a different property — two actions, not one: (1) upload the certificate they sent to the property it actually belongs to, via CRM 1 → File Manager (it is still a valid document, don\u2019t waste it); (2) separately request the correct certificate for the property this job relates to (example: request 108).' },
      { type: 'subheading', text: 'Reading the result — EICR vs CP12' },
      { type: 'bullets', items: [
        'EICR: satisfactory when there are no issues / C3s only. C1 / C2 / FI → remedials needed. If you receive a satisfactory EICR with FIs present, ask the provider for clarification.',
        'Gas certs (CP12): a CP12 isn\u2019t labelled satisfactory/unsatisfactory the way an EICR is — it categorises each appliance individually. Check the “Safe to use” column: both YES → treat as satisfactory; any remedials become the optional/recommended route.',
      ]},
      { type: 'image', src: '/crm2/cp12-safe-to-use.png', text: 'A CP12 with the “Safe to use” column — worked example: a missing flame supervision device on an old hob, still marked satisfactory (request 248).' },
      { type: 'subheading', text: 'Required vs optional remedials' },
      { type: 'bullets', items: [
        'Required → press Need remedial → §07 (remedial branch).',
        'Satisfactory cert, recommended / C3 items only → review as normal (dates, provider names) → press Recommended remedial. Confirming C3s automatically creates a maintenance job in CRM 1.0 — expected behaviour, not a bug; the optional-remedial workflow lives in 1.0 for now.',
      ]},
      { type: 'callout', variant: 'info', text: 'No need to send recommended-remedial comms in CRM 2.0 — this is dealt with within the automatically created maintenance job.' },
      { type: 'image', src: '/crm2/certreview-panel.png', text: 'The Certificate review panel with all the buttons and the pre-filled date fields.' },
      { type: 'subheading', text: 'Provider name' },
      { type: 'bullets', items: [
        'If a Dwelly provider: copy and paste the name from the contact tab on the right — the agent sometimes pre-fills this field slightly differently from the name shown on the right.',
        'If LL DIY: use the name indicated on the certificate.',
      ]},
      { type: 'image', src: '/crm2/certreview-providername.png', text: 'Provider name pre-filled by the agent vs the name on the contact tab — copy from the contact tab.' },
      { type: 'callout', variant: 'warning', text: 'Open question: Invalid vs Upload another. Invalid = you spot an issue with a cert (incorrect date/address/etc.). Upload another = you received a new cert and the agent didn\u2019t recognise it automatically. The exact boundary between the two is still being clarified.' },

      { type: 'subheading', text: 'EPC — not mandatory mid-tenancy' },
      { type: 'paragraph', text: 'Unlike an EICR or Gas Safety Certificate, an EPC does not have to be renewed during a live tenancy. It does have to be valid before you market the property, sign a new agreement with different tenants, formally change the tenancy agreement with existing tenants, or serve notice — so renewing is best practice.' },
      { type: 'callout', variant: 'warning', text: 'Open question: landlord unresponsive on EPC — do we chase the emergency contact, or cancel? Not yet answered (request 547). The MEES band-E interaction is also unresolved.' },

      { type: 'divider' },

      // ─── §07 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '07 · Remedial branch — extra works found at Certificate review 🟩🟧' },
      { type: 'paragraph', text: 'Path: from Certificate review (you pressed Need remedial) → Quotation awaiting 🟩 (agent asks the provider for a quote) → Quotation review 🟧 (you approve the quote) → Landlord quote approval 🟩 (agent asks the landlord to approve) → approved re-enters Scheduling for the repeat visit / rejected → Remedial terminated.' },
      { type: 'subheading', text: 'Quotation review — designed touchpoint' },
      { type: 'paragraph', text: 'Once a quote for the extra works arrives, check the amount and the work description.' },
      { type: 'image', src: '/crm2/quotereview-panel.png', text: 'The Quotation review panel.' },
      { type: 'image', src: '/crm2/quote-thread.png', text: 'The quote as it comes through on the job thread.' },
      { type: 'callout', variant: 'tip', text: 'If the contractor hasn\u2019t provided a formal quotation document, attach a screenshot of their quote to the job (informal fix — no escalation point).' },
      { type: 'subheading', text: 'Landlord quote approval' },
      { type: 'paragraph', text: 'Usually nothing to do; if it escalates, record the outcome. Timing: +3 days, then +7 days escalates (money decision).' },
      { type: 'callout', variant: 'info', text: 'SOP — landlord rejects the remedial quotation: call the landlord and confirm whether they will seek their own quote or want additional quotes from other agency contractors. If they want their own contractor, state that the agency needs to vet them first; if they agree, collect contractor details and hand to the contractor team to onboard (job On Hold until done). If they decline entirely → assert full landlord DIY.' },

      { type: 'divider' },

      // ─── §08 / §09 ─────────────────────────────────────────────────────────
      { type: 'heading', text: '08 · Invoice awaiting → Invoice review → Completed' },
      { type: 'bullets', items: [
        'Invoice awaiting 🟩 — the agent waits for the provider\u2019s invoice. Reminders at +1 day, escalates to you at +3 days. Skipped entirely if the invoice already arrived with the certificate — in that case Certificate review → Completed directly.',
        'Invoice review 🟧 — a designed touchpoint for every job that has an invoice. Check that Subtotal / VAT / Total add up, and check the reference.',
      ]},
      { type: 'callout', variant: 'info', text: 'SOP — contractor hasn\u2019t provided an invoice: call and chase it up. Before completion, collect a certificate and invoice for every appointment.' },
      { type: 'callout', variant: 'warning', text: 'Open question: invoice doesn\u2019t match the quote — reject outright, or approve and query the discrepancy separately? Invoice arrives after the job has already closed — what happens to it? Invoice review has no SOP scenario, and Post-completion is its own escalation cause (66 escalations, 1.8%) that doesn\u2019t map to any stage on the flow diagram.' },
      { type: 'heading', text: '09 · Completed' },
      { type: 'callout', variant: 'info', text: 'SOP — landlord asks to resend the certificate: use Send Communication and attach the file (it will still go as a link).' },

      { type: 'divider' },

      // ─── §10 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '10 · Cross-cutting actions (apply at any stage)' },
      { type: 'bullets', items: [
        'Send Communication — emails / SMS / notes, plus attachments. Supports rich text (bold, italic, bullet lists) and direct file attachment, so certificates and photos can go out properly formatted without leaving the job.',
        'Add Direct Info vs Set Visit Date — rule of thumb: Direct Info = passing on information you received; Set Visit Date = recording an appointment both sides have already agreed (see §03).',
        'Approve message — a designed touchpoint. Fires on any stage where the agent writes a free-text (non-template) email or non-standard SMS. Read the drafted message and edit if needed.',
        'Resolve a task — any stage where the agent hands over a decision, or you grab it with Take Over. Buttons: Wait · Cancel · Landlord DIY · Select another provider · Add direct info.',
      ]},
      { type: 'callout', variant: 'important', text: 'The “Provide Instructions” button is now admin-only, along with Reassign Job and Cancel Job — operators see the button but get a message to contact an admin. Never use it unless an admin has told you to. Probably the only accepted case: a job is already closed and someone sends a thank-you or unrelated email → type “do nothing”.' },
      { type: 'subheading', text: 'Take Over → call' },
      { type: 'paragraph', text: 'Don\u2019t take over just to call early — if there\u2019s no new urgent information, let the agent work; it escalates when needed. Always send a follow-up email, including every time you leave a voicemail — the last email may have been a while ago, and a follow-up makes it easier for the recipient to find the right thread (example: request 412). Call the second tenant rather than the first tenant\u2019s second number — secondary numbers were copied across without notes.' },
      { type: 'subheading', text: 'Waiting and holds' },
      { type: 'bullets', items: [
        '“Wait for response” caps at 3 days. If a provider is away longer (e.g. annual leave) → divert to “Manual”.',
        'Blocked by a non-system party (a block manager or other third party who isn\u2019t the tenant, landlord, or provider) → divert to “Manual”.',
        'A proper hold / “other” state is on the roadmap but doesn\u2019t exist yet.',
      ]},
      { type: 'subheading', text: 'Reading the next-action time' },
      { type: 'paragraph', text: 'The date/time shown is the next agent action, not necessarily the next escalation — it may just be an auto reminder. The full list of planned actions is on the right-hand side of the job. If it is an escalation you can action it in advance; if it is an auto reminder, leave it.' },
      { type: 'image', src: '/crm2/planned-actions.png', text: 'The planned-actions list on the right-hand side of the job.' },
      { type: 'subheading', text: 'Job Notes tab' },
      { type: 'paragraph', text: 'Notes synced from the property/landlord/tenant record, plus job-specific notes created from Send Communication. For operational context (why we\u2019re waiting, special agreements) — not communication history. To add your own note: Send Communication → Add notes.' },
      { type: 'image', src: '/crm2/job-notes.png', text: 'The Job Notes tab.' },

      { type: 'divider' },

      // ─── §11 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '11 · Reminders & escalation timing — the full SLA table' },
      { type: 'table',
        headers: ['Stage', 'Runs', 'Reminders', 'Then…'],
        rows: [
          ['Landlord approval', 'agent', '+1 working day, +3 days', '+4 days — ordinary job: auto-advance; EPC: escalate to you'],
          ['Provider selection', 'agent', '— (instant)', 'Escalates only if no contractor is found'],
          ['Scheduling', 'agent', 'On schedule, to whichever side is silent', 'Escalates on a deadlock'],
          ['Visit', 'agent', 'One reminder — the day before', 'Auto-advances once the date passes'],
          ['Result awaiting', 'agent', '+1 day, +2 days', '+3 days — escalate to you'],
          ['Certificate review', 'operator', 'Nudges you about the pending task', 'Waits for your decision'],
          ['Invoice awaiting', 'agent', '+1 day', '+3 days — escalate to you'],
          ['Invoice review', 'operator', '—', 'Waits for your decision'],
          ['Quotation awaiting', 'agent', '+1 day', '+3 days — escalate to you'],
          ['Quotation review', 'operator', '—', 'Waits for your decision'],
          ['Landlord quote approval', 'agent', '+3 days', '+7 days — escalate (money decision)'],
          ['LL_DIY', 'agent', '+10 days', '+14 days — escalate (landlord is doing it)'],
        ],
      },
      { type: 'callout', variant: 'info', text: 'General rule: reminders are usually +1 and +3 days, stretched for the money / DIY stages. There is no hard cap on retries — after the first escalation, pace is set by a human. Terminal states (Completed, Cancelled, Remedial terminated) have no timers.' },

      { type: 'divider' },

      // ─── §12 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '12 · Escalations outside the designed flow' },
      { type: 'paragraph', text: 'The matrix below shows which stage each trigger tends to fire at (from the SOP guide).' },
      { type: 'table',
        headers: ['Trigger', 'Typically fires at'],
        rows: [
          ['Vague / low-confidence reply', 'Any stage'],
          ['Unrecognised intent', 'Any stage'],
          ['Job question answered, but an unrelated question also asked', 'Any stage'],
          ['Party silent, reminders exhausted', 'Landlord approval, Scheduling, Result awaiting, Invoice awaiting'],
          ['Sensitive ask — tenant data / named contractor', 'Scheduling, LL_DIY'],
          ['Landlord hints DIY / changes mind, unclear', 'Landlord approval'],
          ['No contractor found / landlord named one', 'Provider selection'],
          ['Contractor declined / won\u2019t attend', 'Scheduling, Visit'],
          ['Document unreadable / wrong type / misread', 'Certificate review, Invoice review, Quotation review'],
          ['Certificate shows faults — remedial needed', 'Certificate review'],
          ['Landlord refuses the quote', 'Landlord quote approval'],
          ['External-system error', 'Any stage'],
        ],
      },
      { type: 'subheading', text: 'General handling' },
      { type: 'bullets', items: [
        'Vague / low-confidence reply — call and clarify.',
        'Unrecognised intent — read the entire job log, call the relevant parties to clarify, then choose the next stage.',
        'Job question answered, extra unrelated question asked — action the job for the relevant question, acknowledge the second, and pass it to the relevant PM.',
        'External-system error — work out transient vs persistent: retry a transient blip; escalate to support if it is persistent (e.g. missing mandatory data).',
      ]},
      { type: 'subheading', text: 'Document & email problems (all sit under the “document problem” escalation)' },
      { type: 'table',
        headers: ['Problem', 'What\u2019s happening', 'Fix'],
        rows: [
          ['Unreadable / broken file', 'Scan won\u2019t open or format isn\u2019t supported — “analysis failed” task', 'Ask for a plain PDF / clearer photo, or upload a correct copy manually'],
          ['Wrong document type', 'Right category, wrong type (e.g. EICR where an EPC was expected) — yellow warning, doesn\u2019t block approval', 'Call the contractor for the correct copy; Wait for Response'],
          ['Quotation vs invoice mix-up', 'They look alike; AI may mislabel one', 'Check the substance — reject and re-upload the correct type if wrong'],
          ['Duplicate upload', 'New upload becomes active; previous is auto-displaced (“replaced”)', 'Nothing needed — uploading the correct copy over the wrong one is the standard fix'],
          ['Email from an unknown sender', 'Address doesn\u2019t map to any participant — agent won\u2019t auto-process', 'If relevant, enter via Add Direct Info on behalf of the right participant'],
          ['Attachment didn\u2019t download', 'File was unavailable; agent reads the email text but no document appears', 'Ask them to resend the attachment, or upload manually'],
          ['Fields recognised incorrectly', 'AI misread a date or amount — this is exactly why review is manual', 'Always check and fix fields on the review screen before approving'],
          ['Document not in PDF (sent via link, etc.)', '—', 'Open the link, download and attach the file — or screenshot the email and upload that'],
        ],
      },

      { type: 'divider' },

      // ─── §13 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '13 · Crossing systems — CRM 2.0 ↔ CRM 1.0' },
      { type: 'paragraph', text: 'Switching a job from CRM 2.0 to CRM 1.0 (System SOP):' },
      { type: 'steps', items: [
        'Message the transfer admins to pause auto-transfer for the agency.',
        'Cancel the request in CRM 2.0.',
        'Create the request in CRM 1.0, leaving full context on why it was transferred.',
        'Message the transfer admins to switch auto-transfer back on for the agency.',
      ]},
      { type: 'paragraph', text: 'Optional remedials (C3) confirmed in CRM 2.0 automatically create a maintenance job in CRM 1.0 — expected, not a bug (§06).' },
      { type: 'callout', variant: 'warning', text: 'Open question: the System SOP above is the mechanism for switching systems, but not the decision rule for when to switch. No scenario SOP states the triggers for leaving CRM 2.0 for CRM 1.0 (e.g. a stalled vacant / let-agreed property, a visit landing on the tenant\u2019s move-out day, a landlord doing pre-relet works on an already-expired cert). This needs one clear rule rather than case-by-case judgement calls.' },

      { type: 'divider' },

      // ─── §14 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '14 · Data snapshot (live, 03.08.2026)' },
      { type: 'table',
        headers: ['Metric', 'Value'],
        rows: [
          ['Total jobs', '849'],
          ['Active (in-flight)', '297'],
          ['Completed', '363'],
          ['Cancelled', '189'],
          ['Total touchpoints', '3,602 across 740 distinct jobs'],
          ['Avg touchpoints — completed / active / cancelled', '6.22 / 3.16 / 2.15'],
        ],
      },
      { type: 'paragraph', text: 'Active jobs by stage right now: Visit 93 · Scheduling 58 · LL_DIY 53 · Landlord approval 50 · Result awaiting 25 · Invoice awaiting 7 · Landlord quote approval 4 · Remedial terminated 2 · Manual 2 · Provider selection 2 · Quotation awaiting 1.' },
      { type: 'subheading', text: 'Why humans get involved, ranked' },
      { type: 'table',
        headers: ['Cause', 'Escalations (% of all)', 'Jobs', 'Per job'],
        rows: [
          ['Scheduling / tenant access', '884 (24.5%)', '360', '2.5'],
          ['Document review (by design)', '877 (24.3%)', '406', '2.2'],
          ['Confirmation message (by design)', '429 (11.9%)', '265', '1.6'],
          ['Landlord approval', '318 (8.8%)', '267', '1.2'],
          ['Landlord DIY follow-up', '248 (6.9%)', '95', '2.6'],
          ['Visit coordination', '239 (6.6%)', '128', '1.9'],
          ['Decision — Result awaiting', '194 (5.4%)', '85', '2.3'],
          ['Cancellation decision', '80 (2.2%)', '69', '1.2'],
          ['Invoice handling', '77 (2.1%)', '56', '1.4'],
          ['Post-completion', '66 (1.8%)', '44', '1.5'],
          ['Quote handling', '52 (1.4%)', '31', '1.7'],
          ['Provider selection', '28 (0.8%)', '20', '1.4'],
          ['Certificate review', '27 (0.7%)', '18', '1.5'],
        ],
      },
      { type: 'callout', variant: 'info', text: 'Third parties drive almost all the calendar time on a job — the internal operator wait is a fraction of it (operator median reply ~1 hr, 97% reply rate; landlord/tenant/contractor waits run to 12–15 days). This is why Scheduling/tenant access and Landlord DIY follow-up are the most chase-heavy stages: they are the most exposed to slow external replies.' },

      { type: 'divider' },

      // ─── §15 ──────────────────────────────────────────────────────────────
      { type: 'heading', text: '15 · Gap summary — what still needs filling in' },
      { type: 'paragraph', text: 'Ordered roughly by how much pain each one causes, based on the escalation volumes above. These are the open questions to raise rather than guess at.' },
      { type: 'table',
        headers: ['#', 'Gap', 'Why it matters', 'Section'],
        rows: [
          ['1', 'The Result awaiting decision — what “agent_stuck” means and the operator\u2019s options', '194 escalations, 5.4% of all touchpoints, no SOP scenario at all', '§05'],
          ['2', 'When / how to move a job from CRM 2.0 to CRM 1.0', 'Mechanism is documented, the decision rule isn\u2019t', '§13'],
          ['3', 'Cancellation — legitimate grounds, who decides, who\u2019s told', '80 escalations (2.2%), no scenario SOP, no cancellation-reason field, ~72% are manual take-overs', '§12 / §10'],
          ['4', 'Invalid vs Upload another at certificate / invoice / quotation review', 'Every job passes through these buttons', '§06, §07, §08'],
          ['5', 'What the Manual stage is', 'Live jobs sit in it, flagged as escalation anomalies; absent from the flow diagram and every SOP', '§00'],
          ['6', 'What closing out Remedial terminated “manually” requires', 'Dead-end branch with no operator instructions', '§07'],
          ['7', 'Post-completion escalations — what falls under this cause', '66 escalations (1.8%), not on the flow diagram', '§08 / §09'],
          ['8', 'Sending a job back to LL_DIY after an accepted cert turns out to need remedials', 'No button/process recorded, only “avoid the situation” guidance', '§01a'],
          ['9', 'No-access / no-show on the day at Visit', 'High-frequency real event, no documented outcome (who pays, where the job goes)', '§04'],
          ['10', 'Provider-selection logic and preferred-contractor check', 'Only main-path stage with zero SOP coverage', '§02'],
          ['11', 'Whether Optional remedial should always create a CRM 1.0 maintenance job', 'Operator discretion vs mandatory isn\u2019t stated', '§06'],
          ['12', 'Evidence needed to close the agency-arranged remedial branch', 'Same DIY rule (no new cert) or different? Unconfirmed', '§07'],
          ['13', 'EPC wording for a non-responsive landlord; MEES band-E interaction', 'Legal exposure in landlord comms', '§06'],
          ['14', 'Landlord-approval chase cadence beyond the two SLA nudges, and partial approval of works', 'Second-largest stage-related cause (318 escalations, 8.8%)', '§01'],
        ],
      },
      { type: 'callout', variant: 'tip', text: 'The fastest next step on the biggest gaps (#1 and #5) is to open a handful of the actual jobs behind the numbers and read what the agent actually got stuck on, then get a straight answer from product on what “agent_stuck” means operationally.' },
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
]

export function getCrm2Lesson(slug: string): Crm2Lesson | undefined {
  return CRM2_LESSONS.find(l => l.slug === slug)
}
