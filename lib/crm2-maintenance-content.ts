// CRM 2.0 — Maintenance learning content.
//
// The sibling track to the Compliance space. Where compliance runs one
// certificate job end to end, maintenance runs a repair: a tenant reports a
// problem, the landlord approves, a provider is chosen and prices it, a visit is
// booked, and an invoice is checked and paid. Same agent-led model, different
// shape — and one crucial difference: the agent never picks the provider.
//
// This is kept as its own array (not folded into CRM2_LESSONS) so it has its own
// reading order and pillar counts, and so the compliance progress / certificate
// machinery is untouched. It reuses the Crm2Block / Crm2Lesson shapes and the
// shared block renderer, so the two tracks look and read as one app.
//
// Adding a lesson: append to MAINTENANCE_LESSONS with a unique slug and a
// pillar. The landing page groups by pillar automatically and the
// maintenance/[slug] page renders the blocks. No other wiring needed.
//
// Source material: the Maintenance operator training deck (v. 2026-08-25), the
// maintenance SOP, the "Working with us" provider guide, and the job
// headers & descriptions cheat sheet (reviewed 10 Sep 2026). Sensitive details
// (real addresses, staff names, internal job IDs, channel names) are omitted or
// genericised.

import type { Crm2Block, Crm2Lesson, Crm2Pillar } from '@/lib/crm2-content'

// Checked against the live 2.0 build on this date; shown as a freshness badge.
export const MAINTENANCE_LAST_REVIEWED = '25 Sep 2026'

// The maintenance track uses the same three pillar ids as compliance, but with
// its own labels — the middle pillar is the ten stages, not the buttons.
export const MAINTENANCE_PILLARS: { id: Crm2Pillar; label: string; description: string }[] = [
  { id: 'orientate', label: 'Get orientated', description: 'How a maintenance request flows, and where it waits for you.' },
  { id: 'features',  label: 'Work the ten stages', description: 'Every stage, its aim, what the agent does, and your buttons.' },
  { id: 'operate',   label: 'Work smarter', description: 'Writing jobs that move, the side branches, and the tools on every task.' },
]

export const MAINTENANCE_LESSONS: Crm2Lesson[] = [
  // ─── Get orientated ────────────────────────────────────────────────────────
  {
    slug: 'how-maintenance-works',
    title: 'How maintenance works: the agent & you',
    summary: 'Ten stages, one AI agent, and the three points where the request waits for a human.',
    icon: '\uD83D\uDD27',
    pillar: 'orientate',
    kind: 'guide',
    minutes: 6,
    quizModuleId: 'crm2-maint-how-it-works',
    content: [
      { type: 'heading', text: 'One agent runs the repair, you make three calls' },
      { type: 'paragraph', text: 'A maintenance request is a single repair job \u2014 a leak, a broken boiler, a blocked drain \u2014 that runs from the tenant\u2019s first report all the way to the provider being paid. An AI agent runs the routine end to end: it acknowledges the tenant, chases the landlord, brokers the visit and waits for the invoice. You, the operator, step in at the handful of points that need human judgement.' },
      { type: 'callout', variant: 'info', text: 'The whole flow is ten stages. On a clean job, only three of them stop for you: you tidy the report at triage, you choose the provider, and you approve the invoice. Everything else is the agent\u2019s.' },

      { type: 'heading', text: 'The happy path' },
      { type: 'paragraph', text: 'Most jobs travel this line, driven by the agent, with your three checkpoints marked:' },
      { type: 'steps', emphasisIndex: 0, items: [
        'Tenant triage \u2014 your checkpoint: tidy the report, get photos, confirm it\u2019s worth progressing, then request landlord approval.',
        'Landlord approval \u2014 the agent asks the owner to authorise the works.',
        'Provider selection \u2014 your checkpoint: you pick the contractor in the picker. This is never automatic.',
        'Online quoting \u2014 the provider prices the job remotely; the system checks the price against the property\u2019s threshold.',
        'Scheduling \u2014 the agent brokers a slot between tenant and provider.',
        'Visit \u2014 the date is confirmed to both sides, a reminder goes the day before, the works are done.',
        'Result awaiting \u2014 the agent waits for the invoice, chasing the provider if it\u2019s slow.',
        'Invoice check \u2014 your checkpoint: verify the figures the AI pulled out, and approve. (A task, not a stage.)',
        'Completed \u2014 a quiet day, then the closing letters go out.',
      ]},
      { type: 'callout', variant: 'important', text: 'The one difference from compliance to burn in now: in maintenance the agent never assigns the provider. Provider selection is always a human choice in the picker.' },

      { type: 'heading', text: 'The side branches' },
      { type: 'paragraph', text: 'Not every job stays on the happy path. Four branches lead off it:' },
      { type: 'bullets', items: [
        'Landlord quote approval \u2014 when a quote comes back over the property\u2019s threshold, the landlord has to agree to pay it before the works go ahead.',
        'Landlord DIY \u2014 the owner decides to arrange the repair with their own tradesman. We order nothing and wait for confirmation it\u2019s done.',
        'Manual \u2014 a human-owned pause for odd situations the flow can\u2019t model. The agent stops sending anything.',
        'Cancelled \u2014 the job ends, either quietly (Cancel Request) or with stand-down letters (Cancel & Notify).',
      ]},

      { type: 'heading', text: 'Reading who is waiting' },
      { type: 'paragraph', text: 'The stage tells you who owes the next move. If there\u2019s no active task on a request, the agent is working or a party owes a reply \u2014 so before you jump in, check Planned Actions to see what the agent has already queued (a chase, a reminder). Don\u2019t take over just to act early.' },

      { type: 'heading', text: 'Ground rules' },
      { type: 'bullets', items: [
        'Read the whole job before acting. The agent often surfaces a task from the latest message alone; the fuller history may point elsewhere.',
        'Three clicks are yours on a clean request: confirm the triage, choose the provider, approve the invoice. Everything else is the agent\u2019s job.',
        'You check invoices, never quotations. Quotations are read and routed automatically; an invoice always waits for a human.',
        'The threshold decides the route. Every quote is compared by the system, VAT included \u2014 the landlord is only asked when it\u2019s exceeded.',
        'If you\u2019re not sure, ask. Surface bugs and edge cases early rather than pushing a job the wrong way.',
      ]},
    ],
  },

  // ─── Work the ten stages ──────────────────────────────────────────────────
  {
    slug: 'tenant-triage',
    title: 'Stage 1 \u00B7 Tenant triage',
    summary: 'Your first checkpoint: make the report good enough before anyone asks the landlord for money.',
    icon: '\uD83D\uDCDD',
    pillar: 'features',
    kind: 'guide',
    minutes: 6,
    quizModuleId: 'crm2-maint-triage',
    content: [
      { type: 'heading', text: 'The aim' },
      { type: 'paragraph', text: 'The tenant has just reported a problem, usually with photos. Before anyone asks the landlord for money or calls a contractor, a human makes sure the information is good enough and tidies it up. This is an operator checkpoint \u2014 the agent decides nothing here.' },
      { type: 'callout', variant: 'info', text: 'What the agent does: it sends the tenant an immediate acknowledgement (\u201Crequest received, we\u2019re arranging the repair\u201D), raises your task with the triage form, and stops. No reminders fire on this stage. Anything further from the tenant comes to you with a short summary.' },

      { type: 'heading', text: 'Why photos and a clear report matter' },
      { type: 'paragraph', text: 'The provider prices the job remotely at online quoting \u2014 they don\u2019t visit first. They quote from exactly what you attach here: the photos and the written report. If those are missing or don\u2019t show the problem, the provider simply can\u2019t put a number on it.' },
      { type: 'paragraph', text: 'Too many jobs reach the provider with no photos and a one-line report. The provider then has to come back and ask for them, so the request sits in online quoting for days while messages go back and forth \u2014 the tenant waits longer, and you handle the same job twice. A minute spent getting it right at triage saves that whole detour.' },
      { type: 'callout', variant: 'warning', text: 'A job with no usable photos or report doesn\u2019t stall here \u2014 it stalls later, at quoting, where it\u2019s slower and harder to fix. Triage is the cheapest place to catch it.' },

      { type: 'heading', text: 'What to check before you progress' },
      { type: 'subheading', text: 'Photos' },
      { type: 'paragraph', text: 'Request photos if they\u2019re absent and the job type warrants them, and check the ones you have actually show the issue. If you need them, email the tenant to say we can\u2019t proceed without them and use Wait for Tenant (1 or 3 days by severity). If they don\u2019t reply, call to clarify; if there\u2019s still no luck, send one more email and then cancel with the reason that the tenant is unresponsive.' },
      { type: 'subheading', text: 'Self-help first, for drains and blockages' },
      { type: 'paragraph', text: 'For a drain or blockage, ask before you dispatch anyone: has the tenant tried a plunger and drain unblocker, has it happened before, and what fixed it last time. It often saves a chargeable visit.' },
      { type: 'subheading', text: 'Liability re-check' },
      { type: 'paragraph', text: 'If the item looks like tenant damage or isn\u2019t part of the tenancy, say so now rather than progressing \u2014 for example an appliance that wasn\u2019t included in an unfurnished let, or an issue a pre-move-in inspection didn\u2019t flag.' },

      { type: 'heading', text: 'Tidy the title and description' },
      { type: 'paragraph', text: 'Tenants tend to overshare or undershare. The landlord approves from what you send and the provider later quotes from it, so the job has to read properly. Getting this right is worth its own guide \u2014 see Writing jobs that move \u2014 but the short version: the header says what is wrong and where, and the description adds what the header doesn\u2019t.' },

      { type: 'heading', text: 'Your buttons' },
      { type: 'table', headers: ['Button', 'What it does'], rows: [
        ['Request Landlord Approval', 'The main one. Opens the triage form, then classifies the service and sends the job to the landlord.'],
        ['LL Already Approved', 'Approved outside the system \u2014 skips straight to the provider picker.'],
        ['Wait for Tenant', 'Pause 1 or 3 days for the tenant to come back. A note is required.'],
        ['Add Direct Info', 'Record something the tenant told you off-system.'],
        ['Cancel Request', 'End the job \u2014 for example an unresponsive tenant or a non-issue. A reason is required.'],
      ]},
      { type: 'callout', variant: 'tip', text: 'Exits from here: Landlord approval (the usual route), Provider selection (if the landlord already approved), or Cancelled.' },
    ],
  },
  {
    slug: 'writing-jobs-that-move',
    title: 'Stage 1 \u00B7 Writing jobs that move',
    summary: 'The header and description aren\u2019t notes \u2014 the provider quotes from them and the landlord approves from them.',
    icon: '\u270D\uFE0F',
    pillar: 'features',
    kind: 'guide',
    minutes: 7,
    quizModuleId: 'crm2-maint-writing',
    content: [
      { type: 'heading', text: 'Why this matters' },
      { type: 'paragraph', text: 'The header and description are not internal notes. The provider quotes from them, the landlord approves from them, and the tenant is told what\u2019s happening from them. If the job doesn\u2019t read properly, someone has to stop and ask \u2014 and the job stops moving while they do. A review of 534 real maintenance jobs found a quarter still carried the tenant-portal Q&A dump, a quarter still had template text left in, and dozens had headers that were just a service name.' },

      { type: 'heading', text: 'The eight rules' },
      { type: 'subheading', text: '1. The header says what is wrong and where \u2014 not what category it is' },
      { type: 'paragraph', text: 'A provider seeing \u201CPlumbing request\u201D in a list of twelve has no idea which job is theirs. Name the problem and the location.' },
      { type: 'table', headers: ['Instead of', 'Write'], rows: [
        ['Plumbing request', 'Plumbing Request \u2014 Leak Under Kitchen Sink'],
        ['Maintenance Requests', 'Fire Alarm Malfunctioning & Bathroom Extractor Not Working'],
        ['Removals', 'Removal of Dead Plant and Rusted Planter from Patio'],
      ]},
      { type: 'subheading', text: '2. Move-out, check-out, emergency and job IDs are tags \u2014 never header text' },
      { type: 'paragraph', text: 'None of these describe the work. Set them as tags so they can be filtered and reported on, and give the header back to the actual problem. And if a job is tagged emergency, it has to be one \u2014 correct it the moment you know otherwise, because the routing follows the tag.' },
      { type: 'table', headers: ['Instead of', 'Write (+ tag)'], rows: [
        ['MOVE-OUT ID:39591', 'Deep Clean of Bathroom \u2014 Limescale Build-Up in Toilet (quote)  \u00B7  tag: move-out'],
        ['EMERGENCY: Structural Collapse', 'Ceiling Damage to Utility Room \u2014 Partial Collapse  \u00B7  tag: none, if the tenant confirms it isn\u2019t urgent'],
      ]},
      { type: 'subheading', text: '3. No internal shorthand \u2014 LL, TT, SP, PM, \u201Cdirect request\u201D' },
      { type: 'paragraph', text: 'Write \u201Clandlord\u201D, \u201Ctenant\u201D, \u201Ccontractor\u201D. Who asked for the work is not part of the job title. \u201CDirect LL Request - blocked man hole\u201D becomes \u201CBlocked Manhole \u2014 Sewage Overflowing at Rear of Property\u201D.' },
      { type: 'subheading', text: '4. Strip the template scaffolding out of the description' },
      { type: 'paragraph', text: 'Delete openers like \u201CRequest summary with context:\u201D or \u201CTenant\u2019s original query:\u201D and keep the sentence that follows.' },
      { type: 'subheading', text: '5. Edit what the tenant portal sends \u2014 never forward the Q&A dump' },
      { type: 'paragraph', text: 'The portal\u2019s \u201CAdditional details provided:\u201D block roughly doubles the length and is mostly the portal\u2019s own questions with one-word answers. Landlords and contractors are being sent all of it. Read it, pull out the one or two facts that matter \u2014 the fault, and any real access instruction (\u201Cboiler is in the cellar, padlock code and boiler-room key held by the office\u201D) \u2014 and delete the rest. Never forward a tenant\u2019s name or health information; keep only the instruction the contractor needs (\u201Ccontact by text or email only \u2014 do not call\u201D).' },
      { type: 'subheading', text: '6. The description must add something the header does not' },
      { type: 'paragraph', text: 'If the description just repeats the title, the provider is being asked to quote on nothing. \u201CNew cooker / New Cooker\u201D becomes a real description: make, model, symptom, consequence \u2014 e.g. \u201CThe door lock and interlock on the Hotpoint washer-dryer (model BHWD 129) is visibly damaged and no longer locks, preventing safe operation.\u201D' },
      { type: 'subheading', text: '7. If it is quote-only, say so \u2014 and give them something to quote from' },
      { type: 'paragraph', text: 'A contractor can\u2019t price a tree, a garden or a door from a sentence. Put \u201C(quote)\u201D in the header, state the source (\u201Clandlord has reviewed the check-out report and requested a quote, report attached\u201D), and attach photos or the inspection report.' },
      { type: 'subheading', text: '8. Write the record, not an email' },
      { type: 'paragraph', text: 'The description is a permanent record read by several people over the life of the job. Don\u2019t open \u201CHi Joe\u201D \u2014 put the greeting in the message, not the job. \u201CHi Joe, please attend today, the immersion tank has stopped\u2026\u201D becomes \u201CImmersion tank has stopped working \u2014 no power reaching the unit. Attendance requested same day.\u201D' },

      { type: 'heading', text: 'The shape of a good job' },
      { type: 'table', headers: ['Part', 'Shape'], rows: [
        ['Header', '[Service] \u2014 [problem] [location]. Add \u201C(quote)\u201D if it\u2019s quote-only. Six to ten words, no abbreviations, IDs or lifecycle labels.'],
        ['Description', 'What\u2019s wrong, where in the property, since when, what\u2019s already been tried, what access or keys are needed, and what you want back (repair, quote, or inspection). Attach photos or the report if there\u2019s any chance of a remote quote.'],
      ]},

      { type: 'heading', text: 'Before you save \u2014 five checks' },
      { type: 'bullets', items: [
        'Would a contractor who has never seen this property know what to bring?',
        'Is move-out, check-out or emergency set as a tag rather than typed into the header?',
        'Have I cut the portal\u2019s \u201CAdditional details provided\u201D block down to the facts that matter?',
        'If this needs a quote, does it say so \u2014 and is there a photo or report attached?',
        'Would I be comfortable with the landlord reading this exactly as written?',
      ]},
    ],
  },
  {
    slug: 'landlord-approval',
    title: 'Stage 2 \u00B7 Landlord approval',
    summary: 'Get the owner\u2019s permission before ordering works \u2014 the legally correct order of events.',
    icon: '\uD83C\uDFE0',
    pillar: 'features',
    kind: 'guide',
    minutes: 5,
    content: [
      { type: 'heading', text: 'The aim' },
      { type: 'paragraph', text: 'Get the owner\u2019s permission before ordering any works. It\u2019s the legally correct order of events, and it protects against \u201Cthe job was done and nobody intended to pay for it\u201D. This stage is exercised for non-urgent jobs only.' },
      { type: 'callout', variant: 'info', text: 'What the agent does: it sends a short notice \u2014 the job title only, no description and no photos \u2014 asking two things: may we arrange it through our provider, and would you rather use your own. It chases at +1 working day and escalates to you at +2. Silence never moves the request on by itself.' },

      { type: 'heading', text: 'How the landlord\u2019s answer routes' },
      { type: 'bullets', items: [
        'A clear yes \u2192 Approve, Use Default SP, and on to the provider picker.',
        'A clear \u201CI\u2019ll do it myself\u201D \u2192 Landlord DIY on its own.',
        'A vague answer \u2192 escalated to you to interpret.',
      ]},

      { type: 'heading', text: 'When the landlord doesn\u2019t answer' },
      { type: 'paragraph', text: 'When the no-response escalation reaches you, call them within the job. If they pick up, proceed as they instruct. If not, try again; if there\u2019s still no answer, put it on hold for a business day and call again. If you still can\u2019t reach them, escalate to your manager for advice on that landlord and follow their instruction \u2014 don\u2019t let the job drift.' },

      { type: 'heading', text: 'Common landlord questions' },
      { type: 'faq', faqs: [
        { q: '\u201CHow much will it cost?\u201D', a: 'We don\u2019t have an exact cost yet. We\u2019ll get an online quote first; if that isn\u2019t possible a callout might be needed, which is typically between \u00A360 and \u00A3100.' },
        { q: '\u201CCan you combine this with the other job being fixed?\u201D', a: 'Yes \u2014 confirm you\u2019ll add it to the same visit and note it, but only if the same type of provider can do both. If it needs a different trade, email the landlord to explain it isn\u2019t possible. If it\u2019s the same trade, update the job details before selecting a provider.' },
      ]},

      { type: 'heading', text: 'Your buttons' },
      { type: 'table', headers: ['Button', 'What it does'], rows: [
        ['Approve, Use Default SP', 'On to the provider picker.'],
        ['Landlord DIY', 'The landlord takes the job on himself.'],
        ['Update Job Details', 'Saves edits only \u2014 no letters are re-sent.'],
        ['Wait for Response', 'Hold for the landlord to reply.'],
        ['Cancel Request', 'End the job. A reason is required.'],
      ]},
    ],
  },
  {
    slug: 'provider-selection',
    title: 'Stage 3 \u00B7 Provider selection',
    summary: 'Choose the contractor. In the maintenance flow this is never automatic.',
    icon: '\uD83D\uDD0D',
    pillar: 'features',
    kind: 'guide',
    minutes: 4,
    quizModuleId: 'crm2-maint-provider',
    content: [
      { type: 'heading', text: 'The aim' },
      { type: 'paragraph', text: 'Choose the contractor. In the maintenance flow this is never automatic \u2014 the agent does not assign providers. The system only pre-fills the service it classified after triage; the choice of firm is always yours.' },
      { type: 'callout', variant: 'important', text: 'This is the key difference from the compliance flow, where the agent finds a contractor for you. Here, provider selection is an operator checkpoint every single time.' },
      { type: 'callout', variant: 'info', text: 'What the agent does: it raises your task with the picker open \u2014 category, then service, then provider \u2014 and stops. No letters and no reminders are sent on this stage at all. If the landlord named or ruled out a firm, you get their words verbatim alongside the picker.' },

      { type: 'heading', text: 'Which provider' },
      { type: 'paragraph', text: 'For now, each agency has a preferred provider for every category \u2014 pick the most appropriate one that\u2019s actually set up in Dwelly. Getting the trade right matters: if the landlord later adds works, check whether the same trade can do them before adding to the visit.' },

      { type: 'heading', text: 'Your buttons' },
      { type: 'table', headers: ['Button', 'What it does'], rows: [
        ['Proceed to Online Quoting', 'Use when you have photos and a report and want the provider\u2019s take on the assessment/price before they attend \u2014 avoiding a callout charge. The provider prices remotely.'],
        ['Proceed to Scheduling', 'Go to scheduling, starting with the tenant as per usual \u2014 use it when the provider will price on site.'],
        ['Postpone', 'Come back in 1, 3 or 7 days with a note; the task returns by itself.'],
        ['Landlord DIY', 'The landlord takes it on instead.'],
        ['Cancel Request', 'End the job. A reason is required.'],
      ]},
      { type: 'callout', variant: 'tip', text: 'Exits: Online quoting (priced remotely), Scheduling (priced on site), Landlord DIY, or Cancelled.' },
    ],
  },
  {
    slug: 'online-quoting',
    title: 'Stage 4 \u00B7 Online quoting & the threshold',
    summary: 'The busiest stage: the provider prices remotely, and the threshold decides the route.',
    icon: '\uD83D\uDCB7',
    pillar: 'features',
    kind: 'guide',
    minutes: 8,
    quizModuleId: 'crm2-maint-quoting',
    content: [
      { type: 'heading', text: 'The aim' },
      { type: 'paragraph', text: 'Get a price out of the assigned provider without anyone travelling \u2014 on the strength of the description and the photos alone. This is the busiest stage in the flow, and the pattern for reading every other one.' },
      { type: 'paragraph', text: 'Three things can come back:' },
      { type: 'bullets', items: [
        'He names a price \u2014 in the email body or as a quotation file. Checked against the threshold immediately.',
        'He asks a question \u2014 escalated to you. You may add detail with Update Job Details; what to reply is your call.',
        'He can\u2019t price it unseen \u2014 the agent moves the request to scheduling, and the price comes after an inspection visit.',
      ]},

      { type: 'heading', text: 'What the agent does on entry' },
      { type: 'table', headers: ['When', 'What'], rows: [
        ['At once', 'Job spec to the provider \u2014 title, description and photo links valid for 7 days \u2014 asking for a price, or for confirmation that an inspection is needed.'],
        ['At once', 'FYI to the landlord, no call to action: the job\u2019s gone to a contractor and a price has been requested. First entry only \u2014 not repeated on a provider change or a returning request.'],
        ['+1 working day', 'A polite ping to the provider if nothing has come back. You\u2019ll see it queued in Planned Actions.'],
        ['+2 working days', 'Escalation to you \u2014 a task with the stage resolutions so a human can decide whether to chase, swap provider or wait.'],
      ]},

      { type: 'heading', text: 'The threshold decides the route' },
      { type: 'paragraph', text: 'Every property has a threshold, and every quote is compared against it by the system, VAT included. Within the threshold, the job goes straight to scheduling. Over it, the job goes to landlord quote approval so the owner can agree to pay. The landlord is only ever asked when the threshold is exceeded.' },
      { type: 'callout', variant: 'important', text: 'Any price the agent can read is compared and routed without asking you \u2014 you only ever enter a price it couldn\u2019t read. And a quotation file beats any amount typed in the email body: the amount and scope are read from the document.' },

      { type: 'heading', text: 'Reading the provider\u2019s reply' },
      { type: 'table', headers: ['The reply', 'Who handles it'], rows: [
        ['A quotation file arrives', 'Agent \u2014 the file beats any amount in the text; amount and scope read from it and compared with the threshold.'],
        ['An amount in the email body', 'Agent \u2014 compared at once: within \u2192 scheduling, over \u2192 landlord approval.'],
        ['\u201CI can\u2019t price this without seeing it\u201D', 'Agent \u2014 moved to scheduling to arrange an inspection; the price comes afterwards.'],
        ['He replied about price, but no amount could be read', 'You \u2014 read the email and enter the figure with Set Provider Quote.'],
        ['He wants a call-out charge agreed first', 'You \u2014 stage doesn\u2019t change; record the sum as the price, or send it to Go to Offline Quotation Scheduling.'],
        ['He asks a question, or turns the job down', 'You \u2014 escalated; a refusal comes with Change SP offered.'],
      ]},
      { type: 'callout', variant: 'warning', text: 'A landlord writing in about DIY or his own contractor is always escalated to you, whatever the provider is doing.' },

      { type: 'heading', text: 'Your buttons' },
      { type: 'table', headers: ['Button', 'What it does'], rows: [
        ['Set Provider Quote', 'Enter the amount and scope by hand, as the provider said it. On submit the system compares it with the threshold: within \u2192 scheduling, over \u2192 the landlord. If it can\u2019t read your figure as a number, the task comes back explaining why.'],
        ['Go to Offline Quotation Scheduling', 'Stop waiting for a remote price \u2014 arrange a visit for the provider to price on site.'],
        ['Change SP', 'The old provider gets a polite stand-down, a new one is assigned, and the request stays on this stage to be priced.'],
        ['Update Job Details', 'Fix the title, description or photos. Save only \u2014 no letters re-sent. Telling the provider is a separate decision you make.'],
        ['Wait for Response', '1 or 3 days, naming who you\u2019re waiting for. A note is mandatory.'],
      ]},

      { type: 'heading', text: 'Worked example: a quote over threshold' },
      { type: 'paragraph', text: 'Leaking waste pipe under a kitchen sink. The provider prices it, and the system compares that price against the property\u2019s threshold.' },
      { type: 'steps', items: [
        'Day 0 \u2014 you assign a plumber in the picker. The agent emails him the description and three photos; the landlord gets an FYI.',
        'Day 1 \u2014 no reply, so the agent sends the polite ping it had queued in Planned Actions.',
        'Day 2 \u2014 he replies with a price to replace the trap. The amount is recorded exactly as written.',
        'Day 2 \u2014 the system adds VAT and compares the total against the property\u2019s threshold. Here it comes out over, so the request moves to landlord quote approval.',
        'Day 2 \u2014 the landlord is emailed the provider\u2019s name, the quoted price, the tenant\u2019s description and the quoted scope. He is not told how the price was obtained.',
        'Day 3 \u2014 \u201CYes, go ahead.\u201D The provider is told the quote was approved and the request goes to scheduling.',
      ]},
      { type: 'callout', variant: 'tip', text: 'One operator click in six steps. Had the quote come in within the threshold, the landlord would never have been asked \u2014 it would have gone straight to scheduling.' },
    ],
  },
  {
    slug: 'scheduling-and-visit',
    title: 'Stages 5 & 6 \u00B7 Scheduling & the visit',
    summary: 'The agent brokers a slot between tenant and provider, then holds the job to the day of the visit.',
    icon: '\uD83D\uDCC5',
    pillar: 'features',
    kind: 'guide',
    minutes: 6,
    content: [
      { type: 'heading', text: 'Scheduling: the aim' },
      { type: 'paragraph', text: 'Agree a day and a time for the visit. Two parties are involved \u2014 the tenant, who must be home, and the provider, with his own diary \u2014 and they never write to each other. The agent is the broker; the landlord takes no part in scheduling.' },
      { type: 'callout', variant: 'info', text: 'What the agent does: it asks the tenant for two or three windows, forwards them to the provider with the tenant\u2019s own notes (\u201Cdog in the house\u201D), and fixes the date once both sides land on the same slot. The landlord gets a short FYI, with the price and scope if a quote is on file. It pings the side we\u2019re waiting on at +1 working day and escalates at +3. A date can\u2019t be set without both confirmations.' },
      { type: 'paragraph', text: 'The tenant is always asked first. When they offer slots, the system ping-pongs them to the provider; if the provider accepts one, the job auto-advances to the visit with no re-confirmation. If either side goes quiet after the automated reminders, chase them by phone \u2014 and if you get availability on the call, enter it with Add Direct Info on that party\u2019s behalf.' },

      { type: 'heading', text: 'Setting the date by hand' },
      { type: 'paragraph', text: 'Use Set Visit Date to enter the agreed slot; the agent then confirms it to both sides. Only use it once both parties have confirmed the same slot \u2014 it records an agreed appointment, not a proposal.' },

      { type: 'heading', text: 'Scheduling buttons' },
      { type: 'table', headers: ['Button', 'What it does'], rows: [
        ['Set Visit Date', 'Enter the agreed slot; the agent confirms it to both sides.'],
        ['Work Already Completed', 'He\u2019s already been \u2014 upload the invoice or quotation.'],
        ['Set Provider Quote / Change SP', 'Record a price, or swap the contractor.'],
        ['Add Direct Info / Wait for Response / Landlord DIY / Cancel Request', 'Record an off-system message, pause, hand to the landlord, or end the job.'],
      ]},

      { type: 'divider' },

      { type: 'heading', text: 'The visit: the aim' },
      { type: 'paragraph', text: 'The date is set and the visit hasn\u2019t happened yet \u2014 a waiting room before the contractor arrives. The job of the stage is to lose nothing, remind both sides in time, and reach the day of the visit.' },
      { type: 'callout', variant: 'info', text: 'What the agent does: it confirms the agreed date to both sides \u2014 the provider by email, the tenant by email and SMS \u2014 with the window, the provider\u2019s name and the engineer\u2019s contact number. It sets one reminder for the day before, to both sides. No documents are requested (the visit hasn\u2019t happened). When the date passes, the system moves the request on by schedule \u2014 don\u2019t move it manually ahead of the date.' },

      { type: 'heading', text: 'Visit buttons' },
      { type: 'table', headers: ['Button', 'What it does'], rows: [
        ['Set New Visit Date', 'The date moved.'],
        ['Reschedule', 'Start again \u2014 choose who to ask first, and your words go into the letter verbatim.'],
        ['Completed, Invoice Not Needed', 'Done, and no bill is coming.'],
        ['Set Provider Quote / Change SP / Add Direct Info / Cancel Request', 'Record a price, swap the contractor, log a message, or end the job.'],
      ]},
      { type: 'callout', variant: 'tip', text: 'Any extra scope agreed for the same visit must be emailed to the provider before he attends.' },
    ],
  },
  {
    slug: 'result-and-invoice',
    title: 'Stages 7 & 8 \u00B7 Result awaiting & the invoice check',
    summary: 'Get the documents out of the contractor \u2014 then your last checkpoint: approve the invoice.',
    icon: '\uD83E\uDDFE',
    pillar: 'features',
    kind: 'guide',
    minutes: 6,
    quizModuleId: 'crm2-maint-invoice',
    content: [
      { type: 'heading', text: 'Result awaiting: the aim' },
      { type: 'paragraph', text: 'The visit has happened \u2014 collect its result: an invoice for the work done, a quotation if further works were found, or both. In one line: get the documents out of the contractor.' },
      { type: 'callout', variant: 'info', text: 'What the agent does: it doesn\u2019t chase straight after the visit \u2014 paperwork takes a day. Reminders go at +1 and +2 working days, with an escalation at +3 (\u201Cthe provider has gone quiet\u201D). An invoice raises your review task and leaves the stage unchanged. A quotation with no invoice pending is read and routed by threshold, with no review by you.' },
      { type: 'bullets', items: [
        'Upload Docs \u2014 upload invoices and documents handed over outside the system; the job closes automatically after 24 hours if there is no further communication.',
        'No Further Works Expected \u2014 close off a promise of more works.',
        'Set New Visit Date / Reschedule \u2014 the visit fell through.',
        'Completed, Invoice Not Needed / Set Provider Quote / Cancel Request.',
      ]},

      { type: 'divider' },

      { type: 'heading', text: 'The invoice check \u2014 a task, not a stage' },
      { type: 'paragraph', text: 'This is your third and final checkpoint on a clean job. The AI has read the invoice and pulled out the amounts and the reference; a human confirms them. It arrives on whatever stage the request is on \u2014 usually result awaiting \u2014 and does not change it.' },
      { type: 'callout', variant: 'info', text: 'What the agent does: it shows a forecast banner above the form \u2014 what will happen after you approve (close in about a working day, start further works within threshold, send a quote to the landlord, or stay open awaiting a promised quotation). It flags a possible duplicate if a settled invoice with the same number or amount exists. A second invoice queues behind this one.' },

      { type: 'heading', text: 'Your buttons' },
      { type: 'table', headers: ['Button', 'What it does'], rows: [
        ['Invoice approved', 'Check that Subtotal, VAT and Total add up \u2014 the fields are editable \u2014 then approve.'],
        ['Invalid invoice', 'The document is wrong. Your reason goes to the provider, who is asked for a corrected one.'],
        ['Invoice not needed', 'Fine, but not paid through us. A reason is required; nothing is sent to the provider.'],
        ['Upload another invoice', 'Replace the file.'],
      ]},
      { type: 'callout', variant: 'warning', text: 'Invalid is a complaint about the document \u2014 the provider is asked to correct it. Not needed is no complaint at all \u2014 nothing is sent to him. And a settled invoice can never be decided twice.' },
      { type: 'callout', variant: 'important', text: 'You check invoices; you never check quotations. An invoice that exceeds an agreed quote is a question for this review screen \u2014 not something to send back to the landlord.' },
    ],
  },
  {
    slug: 'landlord-quote-approval',
    title: 'Stage 9 \u00B7 Landlord quote approval',
    summary: 'Works over the property\u2019s threshold need the landlord to agree to pay that quote.',
    icon: '\uD83D\uDCB0',
    pillar: 'features',
    kind: 'guide',
    minutes: 4,
    content: [
      { type: 'heading', text: 'The aim' },
      { type: 'paragraph', text: 'Works above the property\u2019s threshold need the landlord to agree to pay that quote. The system is strict: a request can\u2019t land here without a recorded over-threshold amount. An invoice that exceeds an agreed quote is a question for the review screen, not for the landlord.' },
      { type: 'callout', variant: 'info', text: 'What the agent does: it sends one letter, identical for every price route \u2014 provider name, the amount exactly as the provider worded it, the tenant\u2019s description of the problem, and the quoted scope. Costs already approved are listed too, with the total potential spend. How the price was obtained is never disclosed. It repeats the letter at +1 working day and escalates at +3.' },

      { type: 'heading', text: 'Your buttons' },
      { type: 'table', headers: ['Button', 'What it does'], rows: [
        ['Landlord Approved the Quote', 'On to scheduling the works (a follow-up visit if one already happened).'],
        ['Landlord Rejected the Quote', 'Back to the picker for a new provider.'],
        ['Change SP', 'Swap the provider without waiting for his answer.'],
        ['Wait for Landlord', 'Hold 1, 3 or 7 days.'],
        ['Cancel Request', 'End the job. A reason is required.'],
      ]},
      { type: 'callout', variant: 'tip', text: 'Exits: Scheduling (approved), Provider selection (rejected), or Cancelled.' },
    ],
  },
  {
    slug: 'completed',
    title: 'Stage 10 \u00B7 Completed',
    summary: 'The works are done, the invoice is approved, the request closes \u2014 and the closing letters go out.',
    icon: '\u2705',
    pillar: 'features',
    kind: 'guide',
    minutes: 3,
    content: [
      { type: 'heading', text: 'The aim' },
      { type: 'paragraph', text: 'Terminal stage: the works are done, the invoice is approved, the request is closed successfully. The usual route in is the quiet window of about one working day after invoice approval.' },
      { type: 'callout', variant: 'info', text: 'What the agent does: it sends three closing letters automatically \u2014 notice to the landlord and the tenant, thanks to the provider. The wording about the bill depends on how the request closed. If no invoice was ever payable, the provider gets no closing letter at all \u2014 none of the wordings would be true.' },

      { type: 'heading', text: 'Closing is blocked while' },
      { type: 'bullets', items: [
        'an invoice is still unchecked,',
        'a quotation is still unprocessed,',
        'a candidate price is parked,',
        'or further works have been promised.',
      ]},
      { type: 'paragraph', text: 'Clear the last of these with No Further Works Expected. Once the job is completed it doesn\u2019t move again, and no operator resolutions are needed.' },
    ],
  },

  // ─── Work smarter ──────────────────────────────────────────────────────────
  {
    slug: 'side-branches',
    title: 'Side branches: DIY, manual & cancelled',
    summary: 'The three routes off the happy path \u2014 what each one means and how it behaves.',
    icon: '\uD83D\uDD00',
    pillar: 'operate',
    kind: 'guide',
    minutes: 6,
    quizModuleId: 'crm2-maint-branches',
    content: [
      { type: 'heading', text: 'Landlord DIY' },
      { type: 'paragraph', text: 'The landlord organises the works with his own tradesman. We order nothing and wait for confirmation it\u2019s done. It\u2019s auto-routed whenever the landlord says he\u2019ll handle it, has ordered a part, is using his own handyman, or the item is under warranty.' },
      { type: 'bullets', items: [
        'We ask the tenant, not the landlord, whether the work is done \u2014 only the resident can see whether anyone came. No documents are required.',
        'Dwelly still brokers access: this is the stage with the highest call rate to tenants. Get several slots from the tenant, pass them to the landlord, then relay the confirmed slot back.',
        'Reminders fire at +10 and +14 working days, or counted from a completion date the landlord promised. This is the longest SLA in the flow and the one most likely to be forgotten.',
      ]},
      { type: 'callout', variant: 'warning', text: 'Close only on the landlord\u2019s confirmation the works are done. If he goes quiet or hands you a contractor who isn\u2019t onboarded, escalate rather than drifting. Red flags: a DIY job with no reminder armed, closing without confirmation, or leaving the tenant with no update after the DIY decision.' },
      { type: 'paragraph', text: 'Buttons: Work Completed \u2014 Close the Request, and Landlord Changed Mind \u2014 Use Dwelly SP.' },

      { type: 'heading', text: 'Manual' },
      { type: 'paragraph', text: 'A manual pause, entered with Move to Manual and a mandatory reason \u2014 for odd situations that are quicker to finish by hand, or that the flow genuinely can\u2019t model. Prefer manual over cancelling when the work is real but the flow can\u2019t represent it (for example a tenant doing the work themselves against reimbursed receipts).' },
      { type: 'bullets', items: [
        'The agent initiates nothing \u2014 no letters, no SMS, no reminders to the parties. All communication is human-owned, and inbound messages surface to you as tasks.',
        'Existing timers don\u2019t vanish: when one fires, you get a task instead of the party getting a chase.',
        'Use Take Over, then Provide Instructions, to put the request back on a stage.',
      ]},

      { type: 'heading', text: 'Cancelled' },
      { type: 'paragraph', text: 'Terminal. There are two ways in, and they behave differently:' },
      { type: 'table', headers: ['Route in', 'Behaviour'], rows: [
        ['Cancel Request', 'Cancels quietly \u2014 reminders are dropped and nobody is written to. A reason is required.'],
        ['Cancel & Notify', 'The works turned out to be unnecessary. Stand-down letters go to the tenant and the assigned provider, and to the landlord in your own words, verbatim.'],
      ]},
    ],
  },
  {
    slug: 'resolutions-and-tools',
    title: 'Resolutions & tools on every task',
    summary: 'The actions that show up almost everywhere \u2014 and exactly what each one does (and doesn\u2019t).',
    icon: '\uD83E\uDDF0',
    pillar: 'operate',
    kind: 'guide',
    minutes: 5,
    content: [
      { type: 'heading', text: 'The actions on almost every task' },
      { type: 'paragraph', text: 'On top of the stage-specific buttons, a handful of resolutions and tools appear on almost any task. Knowing precisely what each does \u2014 and what it doesn\u2019t \u2014 keeps you from nudging a job the wrong way.' },
      { type: 'table', headers: ['Action', 'What it does'], rows: [
        ['No Action Needed', 'Closes the task without acting. Only offered while reminders are live \u2014 and it does not cancel them.'],
        ['Provide Instructions', 'Free text telling the agent what to do. A last resort, for when no button fits.'],
        ['Move to Manual', 'Hands the request to manual handling. A reason is required.'],
        ['Update Job Details', 'Edit the title, description and photos. Saves only \u2014 no letters are re-sent, no reminders reset, and it is not a resolution.'],
        ['Take Over', 'Raise a task on a waiting request yourself, rather than waiting for the agent\u2019s reminder. Check Planned Actions first.'],
        ['Add Direct Info', 'Enter something you were told off-system, on behalf of the tenant, landlord or provider. The agent treats it as ordinary incoming mail.'],
      ]},
      { type: 'callout', variant: 'important', text: 'Two easy traps: No Action Needed closes your task but leaves the reminders running \u2014 it doesn\u2019t stop the chase. And Update Job Details saves silently \u2014 telling the provider about a change is a separate decision you make yourself.' },

      { type: 'heading', text: 'Before you take over' },
      { type: 'paragraph', text: 'When a request is quietly waiting, check Planned Actions before you intervene \u2014 the agent may already have a chase or reminder queued. No active task usually means the agent is working or a party owes a reply, not that something is stuck.' },
    ],
  },
  {
    slug: 'the-provider-view',
    title: 'How the provider sees it',
    summary: 'The contractor\u2019s side of the same flow \u2014 useful for reading their replies and setting expectations.',
    icon: '\uD83D\uDCE7',
    pillar: 'operate',
    kind: 'guide',
    minutes: 4,
    content: [
      { type: 'heading', text: 'What we tell providers' },
      { type: 'paragraph', text: 'Providers get a short guide to how a job runs with us, from first contact to payment. Knowing what they\u2019ve been told helps you read their replies and set the right expectations on a call.' },
      { type: 'steps', items: [
        'We send the job \u2014 full details, photos, location and context \u2014 and ask them to do one of two things: quote from the details, or tell us they need to see it first so we book a visit to quote.',
        'They reply by email with both a quote (a clear cost breakdown we can forward to the landlord) and an assessment (what they found and what the work involves). We then tell them whether to go ahead now or wait for the landlord\u2019s approval \u2014 they hold off until they hear from us.',
        'We schedule the work once approved, the same way as any visit.',
        'After the work: if it was sorted on the visit, they send the invoice; if they quoted for further work, they email the final quote \u2014 even from site.',
      ]},
      { type: 'heading', text: 'How booking works from their side' },
      { type: 'bullets', items: [
        'We ask the tenant for preferred times and send the provider the slots, flagging if they need to collect management keys.',
        'They book by replying with a slot; if none work, we keep relaying until one fits. They can also call the tenant on a masked number.',
        'We ask them to book within 2 working days so we don\u2019t have to chase \u2014 which is why the agent\u2019s chasers exist.',
      ]},
      { type: 'callout', variant: 'tip', text: 'This is why \u201Cquote from the details\u201D depends so heavily on a good job write-up: a thin description forces the provider to ask, or to insist on a chargeable visit.' },
    ],
  },
]

export function getMaintenanceLesson(slug: string): Crm2Lesson | undefined {
  return MAINTENANCE_LESSONS.find(l => l.slug === slug)
}

// The guides, in reading order. Everything on the landing page that shows a
// count, a denominator or a pillar group derives from this.
export const MAINTENANCE_GUIDES: Crm2Lesson[] = MAINTENANCE_LESSONS.filter(l => l.kind === 'guide')
export const MAINTENANCE_GUIDE_COUNT = MAINTENANCE_GUIDES.length
export const MAINTENANCE_GUIDE_MINUTES = MAINTENANCE_GUIDES.reduce((sum, l) => sum + l.minutes, 0)

// 1-based position of a guide within the reading order, or null if not a guide.
export function getMaintenanceGuideNumber(slug: string): number | null {
  const idx = MAINTENANCE_GUIDES.findIndex(l => l.slug === slug)
  return idx === -1 ? null : idx + 1
}

export function getMaintenanceGuides(pillar: Crm2Pillar): Crm2Lesson[] {
  return MAINTENANCE_GUIDES.filter(l => l.pillar === pillar)
}
