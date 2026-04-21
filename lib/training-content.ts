// ─── Training Section Types ───────────────────────────────────────────────────

export type TrainingSection =
  | 'general-navigation'
  | 'maintenance'
  | 'compliance'
  | 'move-outs'
  | 'inspections'
  | 'support'
  | 'best-practices'
  | 'auto-vs-hold'
  | 'auto-vs-hold-compliance'
  | 'kb-tenancy-law'
  | 'kb-disrepair'
  | 'kb-difficult-conversations'
  | 'kb-financial-literacy'
  | 'kb-property-standards'
  | 'kb-landlord-relations'
  | 'kb-hmo-licensing'
  | 'kb-deposit-schemes'
  | 'kb-section-8'
  | 'kb-damp-mould'
  | 'kb-tenant-referencing'
  | 'kb-void-management'
  | 'kb-antisocial'
  | 'kb-energy-mees'

export interface ContentBlock {
  type: 'heading' | 'subheading' | 'paragraph' | 'steps' | 'bullets' | 'callout' | 'warning' | 'table' | 'divider'
  text?: string
  items?: string[]
  level?: 1 | 2 | 3
  variant?: 'info' | 'warning' | 'tip' | 'important'
  headers?: string[]
  rows?: string[][]
}

export interface TrainingPage {
  id: TrainingSection
  title: string
  subtitle: string
  notionUrl: string
  icon: string
  colour: string        // Tailwind bg colour token for section badge
  readTime: string
  order: number
  content: ContentBlock[]
}

// ─── Section Metadata ─────────────────────────────────────────────────────────
// Content blocks are populated once Notion pages are fetched.
// Each entry has full metadata ready — content fills in from Notion.

export const TRAINING_PAGES: TrainingPage[] = [
  {
    id: 'general-navigation',
    title: 'General Navigation',
    subtitle: 'How to navigate the Dwelly platform — menus, shortcuts, and key areas.',
    notionUrl: 'https://spark-motion-ef3.notion.site/Dwelly-General-Navigation-2c6f87e8ff728095b68bd0ab2b9ab130',
    icon: '🧭',
    colour: 'bg-zinc-100 text-zinc-700',
    readTime: '8 min read',
    order: 2,
    content: [
      { type: 'callout', variant: 'info', text: 'This guide introduces you to the core areas of the Dwelly system and shows you how to confidently navigate the platform in your day-to-day role.' },
      { type: 'heading', level: 1, text: 'Logging In' },
      { type: 'paragraph', text: 'Before logging in, make sure that your VPN is set up and is connected. It is needed to be turned on at all times when Dwelly is in use.' },
      { type: 'steps', items: [
        'Open your internet browser.',
        'Type or click this link: https://panel.dwelly.team/dw-admin/html/',
        'Enter your login details and click "Sign in".',
        'Bookmark this page in your browser so you can access it easily every day.',
      ]},
      { type: 'heading', level: 1, text: 'Levels of Access' },
      { type: 'paragraph', text: 'The system includes multiple access levels, each with different functionalities and permissions. Higher levels have broader access, visibility and editing rights.' },
      { type: 'table', headers: ['Access Level', 'Roles', 'Description'], rows: [
        ['Manager (let_manager, pm, finance)', 'Most agency employees, inc. PMs, LNs, Property Specialists and Finance Administrators', 'Can view and manage tasks within their zone of responsibility for their agency'],
        ['Supervisor', 'Team Coordinators', 'Same as Manager, plus some additional editing permissions (e.g., LL contact data edit, Tenant contact data edit, Real Link visibility, Restoring declined offers, property publication / withdrawal)'],
        ['Admin', 'Agency MDs and part of the Central Ops team', 'Same as Supervisor, plus permission to remove LLs / edit ToB etc.'],
        ['Superadmin', 'Core Tech Team', 'Full system control, including access rights and configurations'],
      ]},
      { type: 'callout', variant: 'info', text: 'That means the system would look slightly different for, e.g., an Agency Director and a Property Manager.' },
      { type: 'heading', level: 1, text: 'Understanding Dwelly Home' },
      { type: 'paragraph', text: 'When you log in, you will see a menu on the left-hand side and a main screen in the centre. The menu on the left is called Dwelly Home — think of it as your control panel. Everything you need to manage properties, tenants, jobs, and maintenance starts here.' },
      { type: 'heading', level: 1, text: 'Global Search' },
      { type: 'paragraph', text: 'At the top of the system, you will see a magnifying glass icon. This is the Global Search. You can use it to quickly find a property address, tenancy/tenant, landlord, or provider.' },
      { type: 'steps', items: [
        'Click on the search bar.',
        'Type anything you remember (for example: street name, city, tenant name).',
        'Press Enter.',
      ]},
      { type: 'paragraph', text: 'Dwelly will search across the whole system (within your agency) and show matching results. This is the fastest way to find information across the whole system.' },
      { type: 'subheading', level: 3, text: 'Landlord Search and LL Profile' },
      { type: 'paragraph', text: 'When using the Global Search to find a landlord by name, email, or phone number, the system provides visibility into their entire portfolio. Instead of a single entry, you will see a Properties button; clicking this will display all properties associated with that specific landlord.' },
      { type: 'heading', level: 1, text: 'Home Tabs' },
      { type: 'callout', variant: 'info', text: 'This section introduces the main tabs available from the home menu. Some tabs are only available if you have a certain level of access.' },
      { type: 'subheading', level: 2, text: '1. Properties' },
      { type: 'paragraph', text: 'The Properties tab contains all properties managed by your agency. Use the Address Search Bar to type the property address and press Enter to see results.' },
      { type: 'paragraph', text: 'Each property has a status that shows where it is in its lifecycle:' },
      { type: 'steps', items: [
        'Prospect — a potential property. Terms of Business are not signed yet.',
        'New — property added but not published yet.',
        'Published — property is live on Dwelly and portals (Zoopla, Rightmove, OnTheMarket).',
        'Let Agreed — a tenant has been chosen and paid the holding deposit.',
        'Tenanted — the tenant has moved in.',
        'Withdrawn — property is no longer managed (for example, sold or landlord lost).',
        'Offboarding — property is leaving Dwelly but some actions are still pending (keys, deposits, etc.).',
      ]},
      { type: 'subheading', level: 3, text: 'Property Information Screen' },
      { type: 'paragraph', text: 'When you click into a property, you will see several tabs containing everything about that property.' },
      { type: 'table', headers: ['Tab', 'What it shows'], rows: [
        ['Property', 'Basic information including bedrooms, bathrooms, floor, rental price and deposit, pet/child preferences, parking, EPC ratings and more.'],
        ['Maintenance', 'All maintenance and compliance information, including 4 sub-tabs: Primary, Task List, Ownership Shares, Property Metres.'],
        ['Ledger', 'Financial records for the property, landlord and tenant. Supports pagination for high-volume transaction histories.'],
        ['Publications', 'How the property listing appears on classifieds (property portals). Usually managed by the contents team.'],
        ['File Manager', 'All documents related to a property, tenant, or landlord — compliance docs, AST, RtR checks, referencing reports etc.'],
        ['Deals', 'A list of all enquiries for the property (not offers).'],
        ['Offers', 'All offers made on a property, with landlord preference notes.'],
        ['Notes', 'Internal notes for Property, Landlord, and Tenancy sections. Not visible externally.'],
        ['Fees', 'All charges linked to managing a property — agency commission fees, deposit info, inspection frequency and more.'],
      ]},
      { type: 'subheading', level: 2, text: '2. Finance' },
      { type: 'paragraph', text: 'The Finance tab provides access to financial reporting and transaction records for your agency.' },
      { type: 'subheading', level: 2, text: '3. Property Management' },
      { type: 'paragraph', text: 'The Property Management tab shows all management tasks related to property maintenance. This is where you can view, track, and manage jobs, and filter them by mode, stage, flow, user, or agency.' },
      { type: 'subheading', level: 2, text: '4. My Jobs' },
      { type: 'paragraph', text: 'My Jobs is your personal daily task list. The tab is visible for all users and contains all tasks specifically assigned to you, sorted from most urgent to least urgent.' },
      { type: 'callout', variant: 'warning', text: 'Once any job type has been closed, it cannot be reopened under any circumstances. Therefore, no further edits can be made after closure.' },
    ],
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    subtitle: 'Logging, managing and resolving maintenance requests from start to finish.',
    notionUrl: 'https://spark-motion-ef3.notion.site/Maintenance-29df87e8ff728051845cf19cbcd49c4a',
    icon: '🔧',
    colour: 'bg-zinc-100 text-zinc-700',
    readTime: '12 min read',
    order: 3,
    content: [
      { type: 'callout', variant: 'info', text: 'This page covers the flow of maintenance jobs through Dwelly.' },
      { type: 'paragraph', text: 'Maintenance jobs cover all day-to-day property issues: leaks, electrical faults, broken appliances, remedial works — anything that needs fixing. Dwelly allows you to manage every step of these jobs automatically where possible.' },
      { type: 'heading', level: 1, text: 'Step 1: Job Creation' },
      { type: 'paragraph', text: 'Maintenance jobs can appear on the system in two ways:' },
      { type: 'steps', items: [
        'Automatic (Tenant Portal): Tenants report an issue through their portal. Dwelly automatically creates a maintenance job and assigns it to the responsible Property Manager.',
        'Manual (Property Manager created): Go to Property Management tab → select + Add Request → select Maintenance Request → enter the address → enter job name, description and any files → click Create Job.',
      ]},
      { type: 'heading', level: 1, text: 'Step 2: Obtain Landlord\'s Consent' },
      { type: 'paragraph', text: 'Landlord or Block Management should be contacted to approve a provider visit before any action on the CRM is taken (unless it is explicitly known that action can be taken without notifying the landlord — like a pinned note).' },
      { type: 'callout', variant: 'tip', text: 'Communicate inside the Job Chat, not externally — this keeps the entire history of the communications logged.' },
      { type: 'paragraph', text: 'Send an approval request to the Landlord, then click the orange tab. Job will go into Auto mode until a response is provided. If you already have landlord preferences to carry out the job, you may proceed by selecting Approved.' },
      { type: 'subheading', level: 2, text: '2.2 Landlord Wishes to Use Their Own Provider' },
      { type: 'paragraph', text: 'When the landlord wants to use their own contractors, share tenant contact details and place the job on hold until the result is achieved. Once verified, ask your Team Coordinator in the #pm-questions Slack channel to close the task.' },
      { type: 'heading', level: 1, text: 'Step 3: Scheduling the Visit' },
      { type: 'subheading', level: 2, text: '3.1 Handling Quotation Visits' },
      { type: 'paragraph', text: 'If the landlord expressed the need for a quotation before carrying out the works, this needs to be specified on the job request title as this is the text that goes out to the provider. Click "Update Task Description" and type "Quote required".' },
      { type: 'subheading', level: 2, text: '3.2 Instructing Our Providers' },
      { type: 'steps', items: [
        'Select the service category (e.g., Electrical, Plumbing) and the provider.',
        'Scroll to the bottom of the page to find the two submit buttons.',
        'Submit and Launch Triggered Flow (Auto Mode) — Dwelly automatically sends visit notifications to tenant and contractor, and contractor reminders after 24, 48 and 96 hours.',
        'Submit and Keep Paused (On Hold) — provider gets assigned but no automatic communications are sent.',
      ]},
      { type: 'callout', variant: 'tip', text: 'Default process is to pick up the phone and contact the relevant party every time an On Hold expires. Do not place consecutive On Holds when awaiting a response from anyone.' },
      { type: 'subheading', level: 2, text: 'Handling Non-Responsive Providers' },
      { type: 'paragraph', text: 'If a provider does not respond to three automated reminders (sent over a 5-day period), the task returns to Pause mode. Use Assign Progress → Resume waiting for visit date (5 days) to re-engage the waiting period while keeping the task in Auto mode.' },
      { type: 'heading', level: 1, text: 'Step 4: Visit Date Confirmation' },
      { type: 'paragraph', text: 'After a provider has been instructed, Dwelly expects to receive the visit date. This can happen via:' },
      { type: 'bullets', items: [
        'Masked number call (automatic extraction) — if provider and tenant agree a date on the masked phone call, Dwelly transcribes and extracts the visit date automatically.',
        'Provider email reply — Dwelly reads the email and extracts the date.',
        'PM manually enters the date — use Assign Progress → Visit date confirmed / Rescheduled.',
      ]},
      { type: 'paragraph', text: 'When the date is confirmed, Dwelly sends confirmation notifications to both the tenant and contractor, and will send the tenant a reminder SMS 24 hours before the visit.' },
      { type: 'heading', level: 1, text: 'Step 5: Move to Result & Upload Invoice' },
      { type: 'paragraph', text: 'Once the visit has occurred, the job reappears in Pause Mode. Depending on the visit outcome, select one of three options:' },
      { type: 'subheading', level: 2, text: '5.1 Job is Completed' },
      { type: 'paragraph', text: 'Select who is paying for the invoice: We pay for LL (most common — cost deducted from next rent), LL pays directly, or Tenant pays. Upload the invoice and proof of works, then confirm keys have been returned.' },
      { type: 'subheading', level: 2, text: '5.2 Quote is Approved' },
      { type: 'steps', items: [
        'Contact the landlord to obtain approval for the quoted works.',
        'If the landlord approves, click Quote is approved.',
        'Upload the quote from the provider.',
        'Job returns to Scheduling a visit — contractor is notified to contact the tenant again.',
      ]},
      { type: 'subheading', level: 2, text: '5.3 Request Additional Quote' },
      { type: 'paragraph', text: 'If the landlord does not approve the quote and asks for another: select a different provider, click Request Additional Quote, upload the first quote and add a comment. After clicking Submit, the job moves to Auto Mode.' },
      { type: 'heading', level: 1, text: 'Using the Chat Function & Calling' },
      { type: 'paragraph', text: 'The Chat panel on the right side of the screen is the source of truth for every job. It records every action, including phone calls, emails sent, replies received, internal notes, stage changes, mode changes and system logs.' },
      { type: 'bullets', items: [
        'Leave a note — for the task, property, landlord or tenancy.',
        'Send an SMS — all communication is automatically logged in the Chat.',
        'Send an email — replies come straight back into the job.',
        'Call — you can call anyone directly through Dwelly. The call is logged and transcribed.',
      ]},
      { type: 'warning', variant: 'warning', text: 'It is critical for audit purposes — both internally and externally — that everything is documented and communicated through the chat function.' },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance',
    subtitle: 'Legal obligations, certification requirements, and regulatory responsibilities.',
    notionUrl: 'https://spark-motion-ef3.notion.site/Compliance-29bf87e8ff7280da8bfbe88f27dfd863',
    icon: '⚖️',
    colour: 'bg-red-50 text-red-700',
    readTime: '15 min read',
    order: 4,
    content: [
      { type: 'callout', variant: 'info', text: 'This page covers the flow of compliance jobs through Dwelly.' },
      { type: 'paragraph', text: 'All required property compliance certifications can be managed through Dwelly. Whenever a current certificate is about to expire, the system will add a task to the job queue relating to updating it.' },
      { type: 'heading', level: 1, text: 'Step 1: Job Creation' },
      { type: 'paragraph', text: 'Compliance jobs can appear in the system in two ways:' },
      { type: 'bullets', items: [
        'Scheduled / Automatic: The system automatically generates a job 30 days before a certificate expires.',
        'Manual input: Go to Property Management tab → + Add request → select Compliance → enter the address → select the compliance type → click Create job.',
      ]},
      { type: 'heading', level: 1, text: 'Step 2: Obtain Landlord\'s Consent' },
      { type: 'paragraph', text: 'Before proceeding and selecting the provider, obtain the landlord\'s consent to carry out the renewal. Use the chat function so the history of the conversation is logged.' },
      { type: 'paragraph', text: 'If the property is managed and the landlord does not respond within 2 weeks of expiry, proceed to booking the compliance job without approval.' },
      { type: 'subheading', level: 2, text: '2.1 If Landlord Would Like to Use Own Provider' },
      { type: 'steps', items: [
        'Do not select a provider. Click Assign progress → Auto: Certificate issued. This moves the job directly to the certificate upload stage.',
        'Ask the landlord to send the certificate as soon as it has been obtained. Set the job to On Hold while waiting.',
        'Once received, upload the certificate manually to the job.',
        'In the invoice document field, select LL pays directly.',
        'Dwelly will then automatically serve the certificate to both the tenant and the landlord.',
      ]},
      { type: 'subheading', level: 2, text: '2.2 Handling EPC Renewals When Landlord Does Not Wish to Proceed' },
      { type: 'bullets', items: [
        'EPCs are valid for 10 years.',
        'A new EPC is legally required before advertising any new tenancy.',
        'If the landlord declines renewal, mark EPC as "Not needed" in Properties → Maintenance tab, then ask your TC to close the job.',
      ]},
      { type: 'heading', level: 1, text: 'Step 3: Scheduling the Visit' },
      { type: 'paragraph', text: 'Assign a "preferred" compliance provider from the list. If there is no preferred tag, look at the previous certificate to find the contractor who carried out the work last time and select them.' },
      { type: 'paragraph', text: 'Selecting the provider triggers Auto Mode. Dwelly sends notifications to the landlord, tenant and provider, and sends the provider reminders after 24, 48 and 96 hours.' },
      { type: 'heading', level: 1, text: 'Step 4: Visit Date Confirmation' },
      { type: 'paragraph', text: 'Once a visit date is arranged, Dwelly records it via call transcription, email parsing, or manual entry by the PM. After the visit date is recorded, Dwelly sends confirmations to tenant, landlord and contractor.' },
      { type: 'heading', level: 1, text: 'Step 5: Certificate and Invoice Upload' },
      { type: 'paragraph', text: 'When the job is in Auto Mode and Dwelly knows the appointment date, we expect the contractor to send the certificate and invoice within 48 hours. If not received, an automated reminder is sent. When received, check certificate validity and upload both files under the job.' },
      { type: 'subheading', level: 2, text: '5.2 Handling Remedial Works' },
      { type: 'paragraph', text: 'If a certificate is returned as unsatisfactory, the property must be treated as non-compliant until valid remedial evidence is received or a re-inspection is completed.' },
      { type: 'table', headers: ['Certificate Type', 'Remedial Requirement'], rows: [
        ['EICR', 'C1/C2 items: remedial works within 28 days. Written confirmation or Minor Works Certificate. FI classification: follow-up inspection required.'],
        ['Gas Safety (CP12)', 'If marked unsafe (ID or AR): repairs by Gas Safe engineer and new certificate always required.'],
        ['Fire alarm / emergency lighting', 'Failed: remedial works completed and system re-tested. New pass certificate required.'],
        ['PAT', 'Failed appliances must be removed or repaired and re-tested.'],
        ['EPC', 'If below legal minimum: improvement works and new EPC assessment required.'],
        ['Fire Risk Assessment', 'Low-risk: written confirmation may suffice. Medium/high risk: updated Fire Risk Assessment usually required.'],
      ]},
      { type: 'steps', items: [
        'Upload the unsatisfactory certificate via File Manager rather than the job itself, so it does not get served to all parties.',
        'Set the job On Hold with comment "remedial works required".',
        'Create a new maintenance request for remedial works.',
        'Once remedial works are completed, schedule a re-attendance via the original job if required.',
        'When the provider issues the new compliant certificate, upload the satisfactory certificate via the original job.',
      ]},
      { type: 'subheading', level: 2, text: '5.3 Property Licence Tasks (Manual Flow)' },
      { type: 'bullets', items: [
        'Trigger: A task is automatically created if the "Needed" selector is enabled in property settings.',
        'Process: Fully manual task — no automatic system emails are sent.',
        'Communication: All coordination must be done manually via email, phone, or SMS using the Job Chat.',
        'Closure: Once the certificate is obtained, click Assign Progress → Certificate Issued.',
      ]},
      { type: 'heading', level: 1, text: 'Step 6: Completion' },
      { type: 'paragraph', text: 'Once the certificate and invoice are uploaded and accepted, Dwelly automatically sends certificates to tenant and landlord, the contractor receives job acceptance confirmation, and the job status changes to Completed.' },
      { type: 'heading', level: 1, text: 'Corner Cases' },
      { type: 'subheading', level: 2, text: 'Certificate Has Already Expired (MP_TIME_FORCE Mode)' },
      { type: 'paragraph', text: 'If the expiry date is less than 14 days away, the job automatically enters MP_TIME_FORCE mode. All Dwelly automations are paused and the job goes to Manual mode. The PM must take manual control and directly instruct the contractor to book at the earliest available time.' },
      { type: 'subheading', level: 2, text: 'Renewing Certificates at Vacant Properties' },
      { type: 'paragraph', text: 'When a property is vacant, Dwelly cannot rely on usual automations that involve the tenant. After selecting a provider, the job will automatically switch into MP_TIME_FORCE mode. Assign a provider → enter the visit date manually → manage key collection and return.' },
    ],
  },
  {
    id: 'move-outs',
    title: 'Move Outs',
    subtitle: 'End of tenancy process — checkouts, deposits, and property turnaround.',
    notionUrl: 'https://spark-motion-ef3.notion.site/Move-outs-2a8f87e8ff72806c97a1f0bd7e3a8047',
    icon: '🏠',
    colour: 'bg-zinc-100 text-zinc-700',
    readTime: '10 min read',
    order: 5,
    content: [
      { type: 'paragraph', text: 'This guide explains what a PM needs to do in Dwelly when a tenant is moving out. It covers every step from when a move out request first appears in Dwelly to the point the deposit is handed back to the tenant.' },
      { type: 'callout', variant: 'important', text: 'Move out jobs must be handled quickly because they directly affect void periods, which in turn impacts landlord satisfaction and the efficiency of the business.' },
      { type: 'heading', level: 1, text: 'Step 1: How a Move Out Request is Created' },
      { type: 'paragraph', text: 'A Move Out Request can enter Dwelly in one of two ways:' },
      { type: 'bullets', items: [
        'Tenant submits notice through the Dwelly Tenant Portal — Dwelly automatically creates the job, assigns it to the responsible PM, and includes the requested move out date.',
        'Property Manager creates the request manually — used when a tenant emails/calls instead of using the portal, or when the landlord requests the flat back.',
      ]},
      { type: 'callout', variant: 'warning', text: 'If there are 2+ tenants, you must have written confirmation from all of them before progressing the job.' },
      { type: 'paragraph', text: 'To manually create a Move Out Request: Go to Property Management Tab → Click +Add Request → select Move-Out Request → enter the property address → enter the proposed move out date and a short description → click Create Job.' },
      { type: 'heading', level: 1, text: 'Step 2: Confirm the Tenant is Allowed to Move Out' },
      { type: 'paragraph', text: 'Before confirming the move out date, complete two checks: confirm the tenant is legally entitled to move out, and check what the landlord wants to do with the property next.' },
      { type: 'bullets', items: [
        'Did the tenant give the correct length of notice?',
        'Are there any special conditions in the tenancy?',
      ]},
      { type: 'callout', variant: 'important', text: 'It is very important to keep the move out date fully up to date and to ensure that it reflects any changes. This information is critical as it gives Lettings Negotiators the visibility to let the flats.' },
      { type: 'paragraph', text: 'Please note that confirming the move-out date does not automatically pause invoice generation. These are separate actions within the system and must be managed independently.' },
      { type: 'heading', level: 1, text: 'Step 3: Schedule the Check Out Inventory' },
      { type: 'paragraph', text: 'This inspection compares the condition of the property at the end of the tenancy with the check in report. It normally happens on the move out date or shortly after.' },
      { type: 'bullets', items: [
        'Internal employee: their calendar will automatically appear. Select an available slot, fill in the Check Out Inventory Agreed Date and Time, and click Confirm.',
        'External contractor: contact them directly to agree on a date and time, then enter that date into Dwelly and click Confirm.',
      ]},
      { type: 'heading', level: 1, text: 'Step 4: Process the Check Out Inspection' },
      { type: 'steps', items: [
        'Ask the inspector to send you the completed report.',
        'On the job itself, click Choose File.',
        'Select the report that was sent to you.',
        'Click Upload.',
        'Review the check-in Inventory Report visible on the right side. Compare the property\'s condition at start and end.',
      ]},
      { type: 'heading', level: 1, text: 'Step 5: Enter Meter Readings' },
      { type: 'paragraph', text: 'Enter the readings for Water, Gas, and Electricity from the check out inspection report. If some meter reading fields are missing, go to Properties Tab → search for the property → open Maintenance tab → click Property meters → add missing meters or readings.' },
      { type: 'heading', level: 1, text: 'Step 6: Review the Check Out Report and Decide Property Condition' },
      { type: 'bullets', items: [
        'Green — Property is clean and in previous condition. Deposit will be paid back to the tenant.',
        'Yellow — Property is in previous condition but needs cleaning. Cleaning costs will be assigned.',
        'Red — Property has something to fix. Damage or repair costs will be calculated.',
      ]},
      { type: 'heading', level: 1, text: 'Step 7: Handle All Maintenance Tasks' },
      { type: 'paragraph', text: 'Review all open tasks for the property and determine whether they relate to tenant damage or landlord responsibility. For each maintenance job created, enter the Total Quote and Owed by Tenant values in the Payment Allocation section.' },
      { type: 'table', headers: ['Responsibility', 'Who Pays', 'Example'], rows: [
        ['Normal wear and tear', 'Landlord', 'Boiler breakdown — no evidence of misuse'],
        ['Tenant damage', 'Tenant', 'Wall damage found during inspection'],
        ['Move out cleaning', 'Tenant', 'Flat not left in clean, acceptable condition per tenancy agreement'],
      ]},
      { type: 'heading', level: 1, text: 'Step 8: Dealing with the Security Deposit' },
      { type: 'paragraph', text: 'Dwelly automatically calculates how much the tenant should receive from their deposit based on the property condition and maintenance jobs.' },
      { type: 'bullets', items: [
        'Send the landlord: a clear explanation of all works required, a breakdown of costs, and a summary of how much the tenant is responsible for.',
        'Tell the tenant: what was found in the check out report, the costs they are responsible for, the amount being deducted from their deposit, and that they have 14 calendar days to dispute the charges.',
      ]},
      { type: 'heading', level: 1, text: 'Step 9: Closing the Move Out' },
      { type: 'paragraph', text: 'Once the deposit has been reviewed and agreed, you will see three buttons:' },
      { type: 'bullets', items: [
        'Property is ready (blue) — confirms the physical condition of the property is complete. Lettings Negotiator can see the property is ready for move in.',
        'Mediation is finished (yellow) — refers specifically to the financial part. Click only when you have fully resolved the deposit allocation.',
        'Tenancy ended (red) — tenant has physically vacated. Stops generating new invoices from that point onward. Press this promptly.',
      ]},
      { type: 'callout', variant: 'warning', text: 'A move-out task is officially considered Completed only once: Tenancy Ended has been clicked, Checkout Report has been uploaded, and Result of Inspection has been selected and confirmed.' },
      { type: 'heading', level: 1, text: 'Step 10: Key Check' },
      { type: 'paragraph', text: 'After completing the above buttons, confirm all sets of keys have been returned. Only once keys are confirmed does Dwelly show the final "Everything is ready" button. Clicking this permanently closes the Move Out job — no further edits can be made.' },
    ],
  },
  {
    id: 'inspections',
    title: 'Inspections',
    subtitle: 'Property inspection standards, reporting, and follow-up procedures.',
    notionUrl: 'https://spark-motion-ef3.notion.site/Inspections-2abf87e8ff7280449826da2c2048a986',
    icon: '🔍',
    colour: 'bg-zinc-100 text-zinc-700',
    readTime: '10 min read',
    order: 6,
    content: [
      { type: 'heading', level: 1, text: 'Step 1: How Inspection Jobs Get Created' },
      { type: 'paragraph', text: 'Inspection jobs are never created manually by tenants or by PMs. Instead, they are automatically generated by the system based on two things:' },
      { type: 'bullets', items: [
        'The date of the most recent inspection (usually the move-in date when the initial inventory was conducted).',
        'The frequency of inspections set by your agency.',
      ]},
      { type: 'table', headers: ['Agency', 'First Inspection', 'Following Inspections'], rows: [
        ['Lime', 'After 3 months', 'Every 6 months'],
        ['GR', 'After 1 month', 'Every 4 months'],
        ['Pennington', 'After 3 months', 'Every 6 months'],
      ]},
      { type: 'paragraph', text: 'Dwelly automatically creates a job 14 days before the inspection is meant to take place. It will be labelled as INSPECTION REQUEST with a deadline for when it must be completed.' },
      { type: 'heading', level: 1, text: 'Step 2: Schedule a Visit' },
      { type: 'paragraph', text: 'The inspection can be performed by either an in-house property specialist or a third party.' },
      { type: 'subheading', level: 2, text: 'Step 2.1: Using Internal Employee — Property Specialist' },
      { type: 'paragraph', text: 'Dwelly has an integrated Google calendar view with the assigned Property Specialist. View their calendar on the page and select an available time that also works for the tenant. Fill out Visit Time and add any relevant notes under Comments.' },
      { type: 'callout', variant: 'warning', text: 'There is currently no method of routing, so please manually check the postcodes to see where the Property Specialist will be — if all appointments are on the other side of town, allow enough time for travel.' },
      { type: 'subheading', level: 2, text: 'Step 2.2: Using External Party' },
      { type: 'paragraph', text: 'If using an external party, their calendar will not appear. You will need to get in touch with the third party directly via calling to agree on a date, then input it onto Dwelly.' },
      { type: 'paragraph', text: 'Once you have selected the date and time, a new event will appear in the Property Specialist\'s calendar and the tenant will receive a confirmation. The tenant also receives a reminder SMS 24 hours ahead of the visit.' },
      { type: 'subheading', level: 2, text: 'How to Reschedule the Visit' },
      { type: 'steps', items: [
        'Take the job out of Auto mode and put it on Pause to stop the automations.',
        'Click Assign Progress.',
        'Click Change Inspection Time.',
        'Enter a new agreed date once confirmed with Property Specialist\'s availability and the tenant.',
      ]},
      { type: 'paragraph', text: 'If you need to cancel the inspection altogether, you will need to ask your Team Coordinator to do so as they have those permissions on the system.' },
      { type: 'heading', level: 1, text: 'Step 3: Upload the Inspection File' },
      { type: 'paragraph', text: 'At the end of the assigned time slot, the system will send an automatic message in the chatbot asking you to upload the results of the inspection.' },
      { type: 'steps', items: [
        'Chase the property specialist for the document if you have not yet received it.',
        'Once obtained, upload it on the system.',
        'Enter the date of the inspection and the expiry date.',
        'Input what is the current state of the property and if there are any issues.',
      ]},
      { type: 'heading', level: 1, text: 'Step 4: Process the Report Based on Recommendations' },
      { type: 'subheading', level: 2, text: 'Step 4.1: No Issues Identified' },
      { type: 'paragraph', text: 'Press "No" and simply press submit. After this the job will be considered closed. The landlord will be automatically informed of the results along with the attached report.' },
      { type: 'subheading', level: 2, text: 'Step 4.2: Issues Were Identified' },
      { type: 'paragraph', text: 'Press "Yes". You will see a "Comment for LL" field which requires you to describe the current state of the property. This message is automatically sent to the landlord.' },
      { type: 'warning', variant: 'warning', text: 'If there is something to be fixed or something that does not meet standards of living, you will need to create a manual maintenance job to make sure the issue is addressed as a separate job.' },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    subtitle: 'How to raise, track and resolve support issues within the Dwelly platform.',
    notionUrl: 'https://spark-motion-ef3.notion.site/Support-2abf87e8ff728047939cfb2a7637ae9d',
    icon: '💬',
    colour: 'bg-zinc-100 text-zinc-700',
    readTime: '6 min read',
    order: 7,
    content: [
      { type: 'heading', level: 1, text: 'Overview' },
      { type: 'paragraph', text: 'Support requests are created when a tenant, landlord, or provider contacts the agency about something that does not belong to an active job.' },
      { type: 'paragraph', text: 'This usually happens when:' },
      { type: 'bullets', items: [
        'A job has already been completed, but the tenant follows up.',
        'A tenancy has ended, but the former tenant calls or emails.',
        'Someone reaches out with a general question not linked to an open workflow.',
      ]},
      { type: 'paragraph', text: 'In all these cases, Dwelly creates a Support job so the request is properly tracked and actioned.' },
      { type: 'callout', variant: 'warning', text: 'Support tickets cannot be created manually by anyone. They can only be created by third parties. If someone requests something outside of a regular job, these requests must be handled externally (e.g., via email or phone).' },
      { type: 'heading', level: 1, text: '1. Support Jobs Are Always Created in Manual Mode' },
      { type: 'paragraph', text: 'Support jobs do not follow automated workflows because they are by nature one-off or irregular.' },
      { type: 'bullets', items: [
        'Dwelly will not automate messages.',
        'Dwelly will not move the job forward.',
        'You are responsible for handling the request from start to finish.',
      ]},
      { type: 'heading', level: 1, text: '2. Complete the Support Task' },
      { type: 'paragraph', text: 'Handle whatever the tenant or landlord needs:' },
      { type: 'bullets', items: [
        'Answer their question.',
        'Provide information.',
        'Solve the issue manually.',
        'Update notes in the Chat so the history is recorded.',
      ]},
      { type: 'paragraph', text: 'Once the issue is resolved:' },
      { type: 'steps', items: [
        'Click Assign Progress.',
        'Select the option to "Complete Support Task".',
        'The job will move to Completed status.',
      ]},
    ],
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    subtitle: 'Dwelly standards, communication guidelines, and professional expectations.',
    notionUrl: 'https://spark-motion-ef3.notion.site/Best-practises-2c5f87e8ff7280bd8c14cd4fb8c16331',
    icon: '⭐',
    colour: 'bg-zinc-100 text-zinc-700',
    readTime: '8 min read',
    order: 10,
    content: [
      { type: 'heading', level: 1, text: 'Communication Standards' },
      { type: 'callout', variant: 'important', text: 'All communication for any job should be sent and replied to directly within Dwelly. Using external tools such as Outlook means Dwelly cannot capture the information, resulting in incomplete job histories, incorrect system behaviour, and additional manual work.' },
      { type: 'subheading', level: 2, text: 'Never Share Direct Contact Details' },
      { type: 'paragraph', text: 'Direct contact details (tenant or provider phone numbers or emails) must not be shared. Dwelly uses masked numbers and controlled communication flows for compliance, traceability, and automation. Sharing direct details bypasses these protections and disables essential system functions.' },
      { type: 'heading', level: 1, text: 'Chasing Cadence' },
      { type: 'paragraph', text: 'Dwelly automatically chases providers on your behalf. Once the system has sent the standard reminders (24 hours → 24 hours → 96 hours), the job returns to your queue.' },
      { type: 'callout', variant: 'tip', text: 'Do not send another email after automated reminders. Call the provider directly — the system has already emailed them multiple times; a phone call is the fastest and most effective way to move the job forward.' },
      { type: 'subheading', level: 2, text: 'Auto vs. Hold — Choosing Correctly' },
      { type: 'paragraph', text: 'When waiting for a provider to confirm a visit date after automated reminders have exhausted, do not use Put on Hold. Using Hold can cause you to miss provider updates until the hold period expires.' },
      { type: 'callout', variant: 'tip', text: 'Use "Resume waiting for visit date (5 days)" to keep the task in Auto mode. This ensures the system proactively returns the task to your queue the moment an update is received.' },
      { type: 'heading', level: 1, text: 'Mode Best Practices' },
      { type: 'bullets', items: [
        'Auto — the ideal state for most jobs. Use it whenever you have completed your part and are waiting for another party to act.',
        'Pause — a temporary state. Complete the required action quickly and return to Auto.',
        'Manual — use only when you want no automated communications to go out. Cannot return to Auto afterwards.',
        'Hold — use only when the time to action is far into the future or progress is entirely out of your control. Do not place consecutive On Holds.',
      ]},
      { type: 'heading', level: 1, text: 'Documentation Standards' },
      { type: 'paragraph', text: 'Everything must be documented. If something happened in a job, it should be recorded in the Chat. This matters for:' },
      { type: 'bullets', items: [
        'Internal handovers — if someone else picks up the job during sickness or holiday, they can instantly understand what has been done.',
        'Audit purposes — both internal and external audits require a complete record of actions taken.',
        'System accuracy — correct job history ensures automations trigger at the right time.',
      ]},
      { type: 'heading', level: 1, text: 'Using Notes Effectively' },
      { type: 'paragraph', text: 'Inside every job, you can leave a note for the task, the property, the landlord, or the tenancy. This flexibility helps you store information exactly where it belongs.' },
      { type: 'callout', variant: 'info', text: 'Pinned notes on a property are visible across all jobs for that property — use them to capture key landlord preferences, access arrangements, or standing instructions.' },
      { type: 'heading', level: 1, text: 'Professionalism & Expectations' },
      { type: 'bullets', items: [
        'Clear your My Jobs queue at the end of each working day.',
        'Jobs are listed from most urgent to least urgent — work through them in order.',
        'Respond to replies and updates promptly — when a job returns to Pause, action it without delay.',
        'Keep all parties informed through the job chat — tenants, landlords and providers appreciate clear communication.',
        'If you are unsure about closing a task or taking a specific action, ask your Team Coordinator in #pm-questions on Slack.',
      ]},
    ],
  },

  // ─── Auto vs On Hold (Maintenance) ────────────────────────────────────────
  {
    id: 'auto-vs-hold',
    title: 'Auto Mode vs On Hold',
    subtitle: 'When to use Auto mode versus On Hold — and why getting this right reduces your manual admin significantly.',
    notionUrl: '',
    icon: '⚡',
    colour: 'bg-zinc-100 text-zinc-700',
    readTime: '7 min read',
    order: 11,
    content: [
      { type: 'heading', level: 1, text: 'Overview' },
      { type: 'paragraph', text: 'Understanding when to use Auto mode versus On Hold (Pause) is one of the most impactful decisions a Property Manager can make when handling maintenance jobs. Using these modes correctly reduces manual admin, keeps landlords and tenants informed automatically, and ensures jobs are followed up at the right time.' },
      { type: 'paragraph', text: 'This guide explains both modes, when to use each, and walks through common scenarios to help you manage tasks efficiently and consistently.' },

      { type: 'heading', level: 1, text: 'What is Auto Mode?' },
      { type: 'paragraph', text: 'Auto mode is the default and preferred setting for the majority of maintenance tasks. When a job is in Auto mode, Dwelly handles automated communications on your behalf.' },
      { type: 'bullets', items: [
        'Notifying the contractor and tenant of job updates and appointment details',
        'Sending confirmation messages to the provider once instructed',
        'Sending a reminder to the tenant 24 hours before a scheduled visit',
        'Automatically chasing the contractor if no update has been received',
        'For compliance tasks — sending automated messages to the landlord',
      ]},
      { type: 'paragraph', text: 'The key benefit of Auto mode is that it takes a significant amount of manual admin away from the Property Manager, while keeping all parties informed at every stage.' },

      { type: 'heading', level: 1, text: 'What is On Hold / Pause Mode?' },
      { type: 'paragraph', text: 'On Hold (also referred to as Pause or Manual mode) stops automated messages and reminders from being sent. The task is effectively paused until either the hold period expires and the task returns to the queue, or a response from any party brings the job back into the queue.' },
      { type: 'paragraph', text: 'On Hold should be used selectively — only when a task genuinely needs to be paused because progress is entirely out of your control, or the time to action is far into the future.' },
      { type: 'callout', variant: 'important', text: 'The default process is to pick up the phone and contact the relevant party every time an On Hold expires. Do not place consecutive On Holds when awaiting a response from anyone. All information relating to a property, landlord, or tenant must be added to the Notes section.' },

      { type: 'heading', level: 1, text: 'When to Use Each Mode' },
      { type: 'table',
        headers: ['Scenario', 'Mode'],
        rows: [
          ['Instructing a new task (most cases)', 'Auto'],
          ['Compliance task (e.g. gas safety, EICR)', 'Auto'],
          ['Quote approved by landlord', 'Auto'],
          ['Additional quote requested', 'Auto'],
          ['Awaiting response from landlord or tenant', 'Pause (On Hold)'],
          ['Damp survey or long-running task', 'Pause (On Hold)'],
          ['Task requires landlord direct contractor', 'Manual mode / Pause (On Hold)'],
        ],
      },

      { type: 'heading', level: 1, text: 'Common Scenarios & Best Practice' },

      { type: 'subheading', level: 2, text: 'Scenario 1 — A contractor or tenant responds in the first few days' },
      { type: 'paragraph', text: 'When a provider or tenant gets in touch shortly after a task has been opened in Auto mode, there is no need to switch to On Hold following that correspondence. Simply return the task to Auto mode and it will continue sending automated reminders and updates as normal. There is no benefit in pausing a task that is actively progressing.' },

      { type: 'subheading', level: 2, text: 'Scenario 2 — Awaiting feedback from a landlord or tenant' },
      { type: 'paragraph', text: 'When you have raised an issue or query and are waiting for a response, use On Hold for 48 hours rather than placing the task on a two-week hold. The 48-hour window gives the individual a reasonable timeframe to reply. If there is no response when the hold expires, the task returns to your queue and gives you the opportunity to follow up — either with a phone call or a follow-up email.' },
      { type: 'callout', variant: 'tip', text: '48 hours is the recommended On Hold duration when awaiting a response. When the hold expires, use it as a prompt to call or email — do not apply another consecutive hold without first attempting contact.' },

      { type: 'subheading', level: 2, text: 'Scenario 3 — Damp surveys and long-lead tasks' },
      { type: 'paragraph', text: 'For tasks such as damp surveys, where the job is likely to remain open for an extended period due to high demand, use Manual / Pause mode. This prevents automated reminders from firing too early (e.g. 24-hour and 48-hour chasers) when the task is simply awaiting a survey slot that may be weeks away. Resume Auto mode once a confirmed date is in place.' },

      { type: 'subheading', level: 2, text: 'Scenario 4 — Quote approved but task is sitting on Pause' },
      { type: 'paragraph', text: 'This is one of the most common points where tasks are left in Pause unnecessarily. Once a quote has been approved, go to the Assign Progress tab and confirm the quote has been approved. This action:' },
      { type: 'bullets', items: [
        'Returns the task to Auto mode',
        'Resends automated messages to both the provider and tenant',
        'Automatically chases the contractor going forward, reducing manual follow-up for the Property Manager',
      ]},
      { type: 'paragraph', text: 'There is no reason to manually manage the task from this point if Auto mode is engaged correctly.' },

      { type: 'heading', level: 1, text: 'SOP Step Reference — Auto Mode Guidance' },
      { type: 'paragraph', text: 'The following table maps key steps from the Maintenance SOP to the recommended Auto mode actions.' },
      { type: 'table',
        headers: ['SOP Step', 'Action', 'Guidance'],
        rows: [
          ['Step 17', 'Submit & Launch Triggered Flow', 'Use Auto mode where possible when submitting a task. Depending on the scenario (e.g. damp survey, long-lead work), Pause may be more appropriate, but Auto should be the default for most tasks.'],
          ['Step 23', 'Changing Provider', 'If in Auto mode and a provider change is required, the automated messages will resend to the new provider automatically once the change is submitted.'],
          ['Step 27', 'Quote is Approved', 'Once the landlord has confirmed approval of a quote, click Submit. Automated messages will be sent to the provider and tenant to progress to the next stage. Do not leave the task on Pause at this point.'],
          ['Step 29', 'Request Additional Quote', 'When requesting an additional quote, select the new provider and click Submit. Automated messages are sent automatically, the tenant is notified to expect contact, and the new provider receives masked tenant details.'],
        ],
      },

      { type: 'heading', level: 1, text: 'Quick Reference Summary' },
      { type: 'callout', variant: 'tip', text: 'Use AUTO mode when: starting any new task (default for most jobs) · a contractor or tenant responds and the job is progressing · a quote has been approved (confirm via Assign Progress) · an additional quote is being requested · a compliance task needs the landlord automatically informed.' },
      { type: 'callout', variant: 'info', text: 'Use ON HOLD / PAUSE mode when: awaiting a response (use 48 hours, not two weeks) · a task has a long lead time (e.g. damp survey, specialist work) · progress is entirely out of your control and far into the future · a landlord is using their own contractor.' },
      { type: 'warning', variant: 'warning', text: 'Never do the following: apply consecutive On Holds without attempting to contact the relevant party first · leave a task on Pause after a quote is approved (use Assign Progress to resume Auto mode) · place a task On Hold for two weeks when 48 hours is sufficient · forget to add all information, correspondence, and updates to the Notes section.' },
    ],
  },

  // ─── Auto vs On Hold (Compliance) ─────────────────────────────────────────
  {
    id: 'auto-vs-hold-compliance',
    title: 'Auto Mode vs On Hold — Compliance',
    subtitle: 'The compliance-specific guide to when Auto mode applies and the two scenarios where On Hold is correct.',
    notionUrl: '',
    icon: '⚖️',
    colour: 'bg-red-50 text-red-700',
    readTime: '8 min read',
    order: 12,
    content: [
      { type: 'heading', level: 1, text: 'Overview' },
      { type: 'paragraph', text: 'Compliance jobs follow a clear, step-by-step workflow on Dwelly. Throughout this process, Auto mode should be the default — it automates communications to the landlord, tenant, and provider, keeps everyone informed, and chases outstanding actions on your behalf. This reduces manual admin and ensures nothing falls through the gaps.' },
      { type: 'paragraph', text: 'There are only a few situations in compliance where On Hold is the correct choice. Outside of those exceptions, the job should always be in Auto mode.' },
      { type: 'callout', variant: 'important', text: 'The Golden Rule for Compliance: Use AUTO mode at every stage of a compliance job unless: (1) the landlord is using their own provider (no provider is set up on Dwelly), or (2) the job requires remedial works before a compliant certificate can be issued.' },

      { type: 'heading', level: 1, text: 'Stage-by-Stage Mode Guide' },
      { type: 'paragraph', text: 'The table below walks through each stage of the compliance workflow and confirms the correct mode to use at each point.' },
      { type: 'table',
        headers: ['Stage', 'Mode', 'Guidance'],
        rows: [
          ['Step 2: Landlord consent received — using agency provider', 'AUTO', 'Once the landlord has confirmed they are happy to proceed using the agency provider, assign the preferred compliance provider and submit. This triggers Auto mode immediately. Dwelly sends instructions to the provider and notifies the landlord and tenant automatically.'],
          ['Step 2.1: Landlord using their own provider', 'ON HOLD', 'Do not select a provider. Instead, use Assign Progress: Certificate Issued to move the job to the certificate upload stage. Set the job to On Hold while waiting for the landlord to arrange their contractor and send the certificate. Follow up regularly until received.'],
          ['Step 3: Provider assigned — scheduling the visit', 'AUTO', 'Once the provider is selected and submitted, the job runs in Auto mode. Dwelly sends the provider the job details with the masked tenant number, notifies the tenant to expect contact within 7 days, and informs the landlord. Automated reminders go to the provider at 24 hours and 48 hours if no response is received.'],
          ['Step 4: Visit date confirmed', 'AUTO', 'Keep the job in Auto mode. Once the visit date is recorded (via call transcription, provider email, or manual entry), Dwelly automatically sends confirmation to the tenant, landlord, and contractor, and a 24-hour reminder to the tenant before the visit. There is no reason to place the job on hold at this stage.'],
          ['Step 5: Awaiting certificate and invoice', 'AUTO', 'Remain in Auto mode. Dwelly will automatically chase the provider if the certificate and invoice are not received within 48 hours of the visit. If there is still no response after the automated reminder, the job returns to your queue and you should follow up manually at that point.'],
          ['Step 5.2: Unsatisfactory certificate / Remedial works required', 'ON HOLD', 'Upload the unsatisfactory certificate via File Manager (not the job itself). Raise the remedial works with the landlord and once landlord approval is received, instruct the contractor to carry out the works by emailing them directly within the compliance task. Set to On Hold for one week. If no update is received, follow up with the contractor before applying a further hold. Upload the compliant certificate to the original job once issued.'],
          ['Step 6: Certificate and invoice uploaded', 'AUTO', 'Keep the job in Auto mode. Once the certificate and invoice are accepted, Dwelly automatically sends the certificate to the tenant and landlord and notifies the contractor that the job is complete. The job then closes automatically.'],
        ],
      },

      { type: 'heading', level: 1, text: 'On Hold Scenarios — In Detail' },

      { type: 'subheading', level: 2, text: '1. Landlord Using Their Own Provider' },
      { type: 'paragraph', text: 'When a landlord wishes to arrange their own contractor, Auto mode cannot be used at the scheduling stage because the provider is not registered on Dwelly.' },
      { type: 'steps', items: [
        'Do not select a provider from the Dwelly list',
        'Go to Assign Progress: Certificate Issued — this moves the job to the certificate upload stage without scheduling a visit',
        'Set the job to On Hold while waiting for the landlord to send the certificate',
        'Follow up with the landlord until the certificate is received — do not apply consecutive holds without attempting contact first',
        'Once received, upload the certificate manually to the job',
        'In the invoice field, select LL pays directly',
        'Dwelly will then automatically serve the certificate to the tenant and landlord, and the job will close',
      ]},
      { type: 'callout', variant: 'info', text: 'When the landlord uses their own provider, the landlord is responsible for facilitating all administration. Your role is to inform the tenant that the landlord\'s contractor will be in touch, confirm access arrangements, and verify job completion once the certificate is received.' },

      { type: 'subheading', level: 2, text: '2. Remedial Works Required' },
      { type: 'paragraph', text: 'If a certificate comes back as unsatisfactory, the property must be treated as non-compliant until either valid remedial evidence is received or a re-inspection is completed. Keep everything within the compliance task itself — this ensures the full history of the job (the original certificate, all correspondence, remedial instruction, and the final compliant certificate) is in one place.' },
      { type: 'steps', items: [
        'Upload the unsatisfactory certificate via File Manager on the Property page — not directly on the job (to avoid it being served to all parties)',
        'Raise the remedial works with the landlord via the chat function on the compliance task, so the communication is logged against the job',
        'Once landlord approval is received, instruct the contractor to carry out the remedial works by emailing them directly via the compliance task — keep this communication within the job to maintain a full audit trail',
        'Set the job to On Hold with the comment: "Remedial works required". Hold for one week to allow time for the contractor to carry out the works and respond',
        'If no update is received when the hold expires, follow up with the contractor directly by phone or email before applying a further hold — do not apply consecutive holds without first attempting contact',
        'When the compliant certificate is issued, upload it via the original compliance job to complete the flow',
      ]},

      { type: 'heading', level: 1, text: 'Common Mistakes to Avoid' },
      { type: 'paragraph', text: 'The most frequent issue seen with compliance jobs is tasks being left on Pause unnecessarily after a key action has been taken.' },

      { type: 'subheading', level: 2, text: 'Leaving the job on Pause after landlord consent is received' },
      { type: 'paragraph', text: 'Once the landlord confirms they are happy to proceed, assign the provider and submit immediately. This is the point where Auto mode should be engaged — do not leave the task on Pause after consent is given, as this stops all automated provider and tenant communications.' },

      { type: 'subheading', level: 2, text: 'Leaving the job on Pause after a visit date is confirmed' },
      { type: 'paragraph', text: 'Once a visit date is recorded in the system, there is no need to place the job on hold. Auto mode will handle the 24-hour reminder to the tenant and will chase the contractor for the certificate and invoice automatically after the visit. Pausing at this stage removes that automation unnecessarily.' },

      { type: 'subheading', level: 2, text: 'Placing the job on a long hold when waiting for the landlord' },
      { type: 'paragraph', text: 'If you are awaiting a response from the landlord — for example, their consent to proceed — use a 48-hour hold rather than a two-week hold. This brings the job back to your queue promptly and gives you the opportunity to follow up by phone or email if there has been no reply.' },

      { type: 'heading', level: 1, text: 'Quick Reference Summary' },
      { type: 'callout', variant: 'tip', text: 'Use AUTO mode at these stages: after landlord consent is received and an agency provider is assigned · when the provider has been instructed and is arranging the visit · once the visit date is confirmed (reminders are sent automatically) · while awaiting the certificate and invoice after the visit · when the certificate is uploaded and the job is moving to completion.' },
      { type: 'warning', variant: 'warning', text: 'Use ON HOLD only in these two situations: (1) Landlord is using their own provider — use Assign Progress to move to certificate upload stage, then hold while awaiting the certificate. (2) Unsatisfactory certificate received — upload via File Manager, raise remedials with landlord and instruct the contractor via email within the compliance task, hold for one week, follow up if no response, upload the compliant certificate to the original job once issued.' },
      { type: 'callout', variant: 'important', text: 'Reminders: Never apply consecutive On Holds without first attempting to contact the relevant party · when using On Hold while awaiting a response, use 48 hours, not two weeks · all notes, correspondence, and updates must be logged in the activity section of the job · if the landlord is using their own provider, they are responsible for administration — your role is coordination and certificate receipt.' },
    ],
  },
]

// ─── Knowledge Base Articles ─────────────────────────────────────────────────
// Standalone knowledge articles — no videos, assessment-linked where applicable.

export interface KnowledgeArticle {
  id: TrainingSection
  title: string
  subtitle: string
  icon: string
  category: 'legal' | 'communication' | 'finance' | 'standards' | 'landlord'
  readTime: string
  quizModuleId?: string   // links to QUIZ_QUESTIONS in data.ts
  difficulty: 'foundation' | 'intermediate' | 'advanced'
  content: ContentBlock[]
}

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-tenancy-law',
    title: 'Tenancy Law Essentials',
    subtitle: 'Key legislation every property manager must know — from Section 11 to the Renters Reform Bill.',
    icon: '⚖️',
    category: 'legal',
    readTime: '10 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'Why Tenancy Law Matters' },
      { type: 'paragraph', text: 'As a property manager you are the person tenants and landlords rely on when things go wrong. A working knowledge of the legislation that governs residential tenancies is not optional — it protects the agency, protects your landlord clients, and ensures tenants are treated fairly and lawfully.' },
      { type: 'callout', variant: 'important', text: 'You do not need to be a lawyer, but you do need to know when a situation crosses a legal threshold and when to escalate to a specialist or your line manager.' },

      { type: 'heading', level: 1, text: 'The Landlord and Tenant Act 1985 — Section 11' },
      { type: 'paragraph', text: 'Section 11 of the Landlord and Tenant Act 1985 is the cornerstone of a landlord\'s repair obligations for residential tenancies under seven years. It requires landlords to keep the structure and exterior of the property in repair and to maintain the installations for water, gas, electricity, sanitation, heating, and hot water.' },
      { type: 'subheading', level: 2, text: 'What Section 11 Covers' },
      { type: 'bullets', items: [
        'Structure and exterior — roof, walls, foundations, windows, external doors',
        'Installations for water supply, gas, electricity, and sanitation (basins, sinks, baths, toilets)',
        'Space heating and water heating installations',
        'Common parts of a building (in flats)',
      ]},
      { type: 'subheading', level: 2, text: 'What Section 11 Does Not Cover' },
      { type: 'bullets', items: [
        'Tenant\'s own furniture, fixtures, or fittings',
        'Damage caused by the tenant\'s own neglect or misuse',
        'Decorative repair (unless it arises from a structural defect)',
        'Items that were broken at the start of the tenancy and are noted on the inventory',
      ]},
      { type: 'callout', variant: 'tip', text: 'Always cross-reference a repair request with the check-in inventory. If a defect was noted at move-in, the landlord may have agreed to rectify it — check the tenancy notes and any correspondence.' },

      { type: 'heading', level: 1, text: 'Fitness for Human Habitation Act 2018' },
      { type: 'paragraph', text: 'The Homes (Fitness for Human Habitation) Act 2018 came into force for new tenancies in March 2019 and all existing tenancies in March 2020. It requires that rented homes are fit for human habitation at the start of the tenancy and throughout. Tenants can take their landlord to court if this condition is not met — and unlike Section 11, they do not need to prove they notified the landlord first.' },
      { type: 'bullets', items: [
        'Neglect and disrepair',
        'Structural instability',
        'Damp and mould arising from structural issues',
        'Inadequate natural light, ventilation, or drainage',
        'Inadequate heating or hot water',
        'Infestations',
        'Lead, carbon monoxide, or other hazardous materials',
      ]},

      { type: 'heading', level: 1, text: 'The Housing Health and Safety Rating System (HHSRS)' },
      { type: 'paragraph', text: 'HHSRS is a risk-based assessment system used by local authorities to assess potential risks to health and safety in residential properties. It categorises hazards as Category 1 (serious) or Category 2 (less serious). Local authorities have a duty to take action where Category 1 hazards are present.' },
      { type: 'table', headers: ['Hazard Category', 'Definition', 'Council Response'], rows: [
        ['Category 1', 'Serious risk — likelihood of harm is significant', 'Council MUST take action (improvement notice, prohibition order, or emergency action)'],
        ['Category 2', 'Less serious — some risk of harm present', 'Council MAY take action at their discretion'],
      ]},
      { type: 'callout', variant: 'warning', text: 'Common Category 1 hazards include damp and mould growth, excess cold, falls on stairs, and electrical hazards. If a tenant or council inspector raises a Category 1 hazard, escalate to your manager immediately.' },

      { type: 'heading', level: 1, text: 'Notice Periods and Section 21' },
      { type: 'paragraph', text: 'A Section 21 notice is a "no-fault" eviction notice that allows a landlord to end an Assured Shorthold Tenancy (AST) at the end of the fixed term without giving a reason. Important rules apply.' },
      { type: 'bullets', items: [
        'Minimum two months\' notice must be given',
        'Cannot be served in the first four months of the original tenancy',
        'Expires after six months — if not acted upon a new notice must be served',
        'Invalid if the property is unlicensed (where licensing is required)',
        'Invalid if the landlord has not protected the deposit and provided prescribed information',
        'Invalid if the landlord has not provided the EPC, Gas Safety certificate, and How to Rent guide',
      ]},
      { type: 'callout', variant: 'important', text: 'The Renters\' Rights Bill (progressing through Parliament as of 2025) proposes to abolish Section 21 entirely. Stay updated via your manager — any changes will be communicated as they take effect.' },

      { type: 'heading', level: 1, text: 'Section 8 — Fault-Based Eviction' },
      { type: 'paragraph', text: 'A Section 8 notice is served when a tenant has breached the terms of their tenancy. The most common grounds are rent arrears (Grounds 8, 10, and 11) and anti-social behaviour (Ground 14). Unlike Section 21, a Section 8 notice must specify the grounds being relied upon and is subject to challenge in court.' },
      { type: 'bullets', items: [
        'Ground 8: Mandatory — at least two months\' rent arrears at time of notice AND at hearing',
        'Ground 10: Discretionary — some rent arrears (court decides)',
        'Ground 11: Discretionary — persistent late payment even if arrears cleared',
        'Ground 14: Discretionary — anti-social behaviour or nuisance to neighbours',
      ]},

      { type: 'heading', level: 1, text: 'Deposit Protection' },
      { type: 'paragraph', text: 'Under the Housing Act 2004, any deposit taken for an AST must be protected in a government-approved scheme within 30 days of receipt. The prescribed information must also be served on the tenant within the same period.' },
      { type: 'bullets', items: [
        'Approved schemes: Deposit Protection Service (DPS), MyDeposits, Tenancy Deposit Scheme (TDS)',
        'Failure to protect = tenant can claim 1–3x the deposit amount in court',
        'Section 21 cannot be served if the deposit is not protected',
        'On renewal, re-protection is not required if the same deposit is carried forward — but check scheme rules',
      ]},
    ],
  },
  {
    id: 'kb-disrepair',
    title: 'Disrepair Claims — A Complete Guide',
    subtitle: 'How to prevent, manage, and defend disrepair claims using documentation and Dwelly.',
    icon: '🔨',
    category: 'legal',
    readTime: '9 min read',
    difficulty: 'advanced',
    quizModuleId: 'kno-02',
    content: [
      { type: 'heading', level: 1, text: 'What Is a Disrepair Claim?' },
      { type: 'paragraph', text: 'A disrepair claim arises when a tenant alleges that the landlord has failed to maintain the property in accordance with their legal obligations, causing loss, damage, or personal injury to the tenant. Claims can be brought under Section 11, the Homes (Fitness for Human Habitation) Act 2018, or common law.' },
      { type: 'callout', variant: 'warning', text: 'Disrepair claims are increasingly common and can result in significant compensation awards — sometimes tens of thousands of pounds. Your documentation in Dwelly is your primary line of defence.' },

      { type: 'heading', level: 1, text: 'The Notification Requirement' },
      { type: 'paragraph', text: 'A landlord cannot be liable for disrepair under Section 11 until they have been given notice of the defect. This is known as the "notification rule." The notice does not have to be formal — a WhatsApp message, email, or logged call is sufficient. This makes your job history in Dwelly critical.' },
      { type: 'bullets', items: [
        'The date of notification starts the repair obligation clock',
        'Landlords are expected to remedy within a "reasonable time" — which varies by urgency',
        'Emergency repairs (no heating in winter, water leak) — within 24 hours',
        'Urgent repairs — within 3–7 working days',
        'Routine repairs — within 28 days',
        'Major works requiring planning or consent — agreed timescale with tenant',
      ]},

      { type: 'heading', level: 1, text: 'What Constitutes a Good Defence' },
      { type: 'paragraph', text: 'If a disrepair claim is made, the agency and landlord will need to demonstrate that they acted reasonably and promptly. A strong defence relies on evidence.' },
      { type: 'subheading', level: 2, text: 'Evidence Your Dwelly Records Must Contain' },
      { type: 'bullets', items: [
        'Date and source of the original notification (Dwelly chat, email, phone call logged as note)',
        'Date the job was raised on the system',
        'Contractor assigned and date of instruction',
        'Date of contractor visit and outcome',
        'Any follow-up works raised as a result',
        'Landlord communication trail — consent given, decisions made',
        'Notes on any delays and the reason for them (e.g. tenant refused access)',
        'Photographs uploaded to the job at inspection or visit',
        'Certificate or completion confirmation',
      ]},
      { type: 'callout', variant: 'tip', text: 'Every action you take on a job should be logged in the activity section of the Dwelly job immediately. If it is not in Dwelly, it did not happen — at least not according to any court or arbitration process.' },

      { type: 'heading', level: 1, text: 'Damp and Mould — A Special Case' },
      { type: 'paragraph', text: 'Damp and mould is the most litigated area of residential property management. Following the tragic death of Awaab Ishak in 2020, the government introduced "Awaab\'s Law" (Housing (Homelessness and Rough Sleeping) Act 2024), which mandates strict timescales for social landlords — and similar standards are expected to apply to the private sector going forward.' },
      { type: 'subheading', level: 2, text: 'Identifying the Cause' },
      { type: 'table', headers: ['Type', 'Cause', 'Responsibility'], rows: [
        ['Penetrating damp', 'Water ingress through structure (roof, walls, windows)', 'Landlord — structural repair required'],
        ['Rising damp', 'Groundwater rising through walls without DPC', 'Landlord — DPC installation/repair'],
        ['Condensation mould', 'High humidity from tenant lifestyle (cooking, bathing)', 'Shared — ventilation advice + structural check'],
        ['Leak-related damp', 'Plumbing failure, burst pipes', 'Landlord — emergency repair required'],
      ]},
      { type: 'callout', variant: 'warning', text: 'Never assume mould is entirely the tenant\'s fault without a proper inspection. A structural damp issue masked by condensation mould is a common source of claims. Always arrange an inspection and document the findings.' },

      { type: 'heading', level: 1, text: 'When to Escalate' },
      { type: 'bullets', items: [
        'Tenant mentions a solicitor or "housing disrepair claim"',
        'A letter before action (LBA) is received',
        'The tenant has contacted the council\'s environmental health team',
        'The issue has been ongoing for more than 28 days without resolution',
        'The tenant reports personal injury or health impact',
        'A Category 1 HHSRS hazard is identified',
      ]},
      { type: 'callout', variant: 'important', text: 'Escalate immediately to your line manager if any of the above apply. Do not continue to manage the job in the normal workflow — it moves to a formal track.' },
    ],
  },
  {
    id: 'kb-difficult-conversations',
    title: 'Difficult Conversations',
    subtitle: 'Handling rent arrears, complaint calls, and confrontational tenants with confidence.',
    icon: '💬',
    category: 'communication',
    readTime: '8 min read',
    difficulty: 'intermediate',
    quizModuleId: 'kno-01',
    content: [
      { type: 'heading', level: 1, text: 'Why This Matters' },
      { type: 'paragraph', text: 'Property managers regularly face conversations that other professionals rarely encounter — telling a family their home has a serious defect, chasing a vulnerable tenant for rent arrears, or managing a landlord whose expectations are unrealistic. How you handle these conversations reflects on the agency and directly affects outcomes.' },

      { type: 'heading', level: 1, text: 'Rent Arrears Conversations' },
      { type: 'paragraph', text: 'Rent arrears is the most common difficult conversation a PM will have. The goal of the first contact is not to threaten — it is to understand what has happened and create a pathway to resolution.' },
      { type: 'subheading', level: 2, text: 'The CARE Framework' },
      { type: 'bullets', items: [
        'Connect — open with a calm, non-accusatory tone. "I wanted to give you a call as we noticed the rent hasn\'t come through yet — I just want to make sure everything is okay."',
        'Acknowledge — let the tenant speak. Acknowledge what you hear before responding. "I understand, that sounds like a stressful situation."',
        'Resolve — agree a specific action. "Can you make a payment by Wednesday? Even a partial payment would help while we work through the rest."',
        'Evidence — log every call, every commitment, every outcome in Dwelly immediately afterwards.',
      ]},
      { type: 'callout', variant: 'tip', text: 'A tenant who feels heard is far more likely to engage and pay than one who feels threatened. Keep the first call supportive — the formal notices come later if needed.' },

      { type: 'subheading', level: 2, text: 'Arrears Escalation Stages' },
      { type: 'table', headers: ['Stage', 'Action', 'Timing'], rows: [
        ['Day 1', 'SMS / email reminder sent automatically via Dwelly', 'Rent due date'],
        ['Day 3', 'Phone call — CARE framework', '3 days after due date'],
        ['Day 7', 'Formal arrears letter sent (template in Dwelly)', '1 week overdue'],
        ['Day 14', 'Section 8 warning letter (Grounds 8, 10, 11)', '2 weeks overdue'],
        ['Day 28+', 'Manager review — Section 8 notice or payment plan formalised', '4+ weeks overdue'],
      ]},

      { type: 'heading', level: 1, text: 'Complaint Calls' },
      { type: 'paragraph', text: 'When a tenant calls to make a complaint — about a repair taking too long, a contractor\'s conduct, noise from a neighbour — your response in the first 60 seconds sets the tone.' },
      { type: 'bullets', items: [
        'Do not interrupt or explain before the tenant has finished speaking',
        'Acknowledge their frustration first: "I completely understand why that\'s frustrating."',
        'Do not make promises you cannot keep — say "I will look into this and come back to you by [specific time]"',
        'If the complaint is about a colleague or contractor, stay neutral — do not agree or disagree',
        'Log the complaint in Dwelly, including the exact nature of the concern, as soon as the call ends',
        'Follow up within the promised timeframe, even if you do not yet have a resolution',
      ]},
      { type: 'callout', variant: 'important', text: 'A complaint that is handled well often results in greater tenant loyalty than if nothing had gone wrong. A complaint that is handled poorly — especially one that goes unacknowledged — is a claim waiting to happen.' },

      { type: 'heading', level: 1, text: 'Confrontational Tenants' },
      { type: 'paragraph', text: 'Occasionally a tenant will be aggressive, abusive, or threatening on the phone or in written communication. This requires a different approach.' },
      { type: 'bullets', items: [
        'Remain calm and keep your voice level — do not match their tone',
        'Use the phrase: "I want to help resolve this, but I\'m not able to continue this conversation while it is at this level."',
        'If the call continues to escalate, say "I\'m going to end this call now and follow up in writing" — then do so',
        'Document the interaction verbatim as much as possible — the exact words used',
        'If you feel threatened or receive a threatening written message, report it to your manager immediately',
        'Never attend a property alone if there is any indication of a confrontational or unsafe situation',
      ]},

      { type: 'heading', level: 1, text: 'Landlord Conversations' },
      { type: 'paragraph', text: 'Landlords can also be challenging — particularly when a repair is expensive, a tenant is in arrears, or a void period is longer than expected. The key is managing expectations early and proactively.' },
      { type: 'bullets', items: [
        'Always inform the landlord before a cost is incurred (unless emergency — then inform immediately after)',
        'Present costs in context: "This will cost approximately £400, but leaving it risks a £2,000+ disrepair claim"',
        'If a landlord refuses a necessary repair, document their refusal in writing and follow the agency\'s refusal protocol',
        'A landlord who refuses a legally required repair places the agency in a difficult position — escalate to your manager',
      ]},
    ],
  },
  {
    id: 'kb-financial-literacy',
    title: 'Understanding Property Financials',
    subtitle: 'Reading a P&L, service charges, deductions, and explaining costs to landlords.',
    icon: '📊',
    category: 'finance',
    readTime: '8 min read',
    difficulty: 'intermediate',
    quizModuleId: 'kno-03',
    content: [
      { type: 'heading', level: 1, text: 'Why PMs Need Financial Literacy' },
      { type: 'paragraph', text: 'Property managers are not accountants, but you are regularly required to explain financial transactions to landlords, query charges on their behalf, and understand why a payment statement looks the way it does. A confident PM who can read a ledger builds landlord trust.' },

      { type: 'heading', level: 1, text: 'The Landlord Ledger' },
      { type: 'paragraph', text: 'The landlord ledger in Dwelly is the real-time financial record for each landlord account. It shows every rent receipt, every payment made to a contractor, every agency fee charged, and every disbursement to the landlord.' },
      { type: 'subheading', level: 2, text: 'Key Columns in the Ledger' },
      { type: 'table', headers: ['Column', 'Meaning'], rows: [
        ['Credit', 'Money received into the client account on the landlord\'s behalf (e.g. rent)'],
        ['Debit', 'Money paid out on the landlord\'s behalf (e.g. contractor invoice, agency fee)'],
        ['Balance', 'Running total — positive means money is held; negative means landlord owes funds'],
        ['Reference', 'Transaction description — must clearly identify what the charge relates to'],
        ['Date', 'Date the transaction was processed (not necessarily the invoice date)'],
      ]},
      { type: 'callout', variant: 'tip', text: 'If a landlord queries a transaction, start with the Reference column to identify the job or invoice, then cross-reference to the Dwelly job for the full cost trail (quote → approval → invoice → payment).' },

      { type: 'heading', level: 1, text: 'Agency Fees and Deductions' },
      { type: 'paragraph', text: 'The agency charges fees for management services, which are deducted from the landlord\'s rent before disbursement. These are defined in the management agreement but the main types are:' },
      { type: 'bullets', items: [
        'Management fee — a percentage of the monthly rent (e.g. 10% + VAT)',
        'Letting fee — a one-off fee charged when a new tenancy is agreed',
        'Renewal fee — charged when an existing tenancy is renewed (where applicable)',
        'Works uplift — a percentage charged on contractor invoices where the agency project-manages works (typically 10–15%)',
        'Court attendance fee — charged if a PM attends a possession hearing',
        'Annual statement fee — charged for end-of-year financial summary (where applicable)',
      ]},
      { type: 'callout', variant: 'warning', text: 'All fees must be clearly disclosed in the management agreement and must be listed in the agency\'s published fee schedule (required by law). Never quote a fee from memory — always refer to the agreement or fee schedule.' },

      { type: 'heading', level: 1, text: 'Service Charges (Leasehold Properties)' },
      { type: 'paragraph', text: 'For leasehold properties (flats and apartments in managed buildings), the landlord pays a service charge to the freeholder or management company. This covers building insurance, communal maintenance, and sometimes heating and hot water for communal areas.' },
      { type: 'bullets', items: [
        'Service charges are separate from agency management fees',
        'They are usually paid quarterly or annually by the landlord',
        'Landlords often pass service charge costs to tenants via the rent — but this must be agreed in the tenancy agreement',
        'Ground rent is a separate annual charge for leasehold properties — since June 2022, ground rent on new leases must be zero (Leasehold Reform (Ground Rent) Act 2022)',
        'Major works contributions (Section 20 notices) can be significant — tens of thousands of pounds in some cases',
      ]},

      { type: 'heading', level: 1, text: 'Explaining Costs to Landlords' },
      { type: 'paragraph', text: 'When presenting a repair cost to a landlord, structure your communication to answer the three questions they are really asking: Why does this need doing? What will it cost? What happens if I don\'t do it?' },
      { type: 'bullets', items: [
        '"The boiler service is due — this is a legal requirement under the Gas Safety (Installation and Use) Regulations 1998, the cost is £85 + VAT."',
        '"The roof has a broken tile causing a small leak — the repair cost is £320. If left, water ingress could lead to significant structural damage and potential disrepair liability."',
        '"The tenant has reported the extractor fan is not working. Under the tenancy agreement and the Fitness for Human Habitation Act, we are obliged to address this. The cost is £150 to replace."',
      ]},
      { type: 'callout', variant: 'tip', text: 'Always send cost approvals via the Dwelly job and ensure the landlord\'s approval is recorded before instructing works (unless it is a genuine emergency). This protects both the agency and the landlord.' },

      { type: 'heading', level: 1, text: 'Negative Balances' },
      { type: 'paragraph', text: 'A negative balance on a landlord ledger means the landlord owes the agency money — either because rent has not been received but costs have been paid out, or because a large invoice has been settled in advance of rent collection.' },
      { type: 'bullets', items: [
        'Contact the landlord proactively when the balance goes negative',
        'Do not pay further contractor invoices from a negative balance without manager approval',
        'Issue a payment request with a clear breakdown of what is owed and why',
        'Record all communications in Dwelly',
      ]},
    ],
  },
  {
    id: 'kb-property-standards',
    title: 'Property Standards & Compliance',
    subtitle: 'Minimum standards, mandatory certificates, licensing, and what inspections look for.',
    icon: '🏠',
    category: 'standards',
    readTime: '11 min read',
    difficulty: 'foundation',
    content: [
      { type: 'heading', level: 1, text: 'Overview' },
      { type: 'paragraph', text: 'Residential landlords in England are subject to a significant and growing body of regulation. The agency is responsible for ensuring managed properties comply with these standards on behalf of landlords. This article covers the key mandatory requirements.' },

      { type: 'heading', level: 1, text: 'Mandatory Safety Certificates' },
      { type: 'table', headers: ['Certificate', 'Frequency', 'Legal Basis', 'Action on Failure'], rows: [
        ['Gas Safety Certificate', 'Annual', 'Gas Safety (Installation and Use) Regs 1998', 'Tenant must be moved out or gas isolated — immediate escalation required'],
        ['Electrical Installation Condition Report (EICR)', 'Every 5 years', 'The Electrical Safety Standards in the Private Rented Sector (England) Regs 2020', 'Remedial works must be completed within 28 days of report issue'],
        ['Energy Performance Certificate (EPC)', 'Every 10 years (or on re-let)', 'Energy Performance of Buildings Regs 2012', 'Property cannot be let without a valid EPC rated E or above'],
        ['Portable Appliance Testing (PAT)', 'Recommended annually (no fixed legal requirement)', 'General duty of care / Landlord and Tenant Act', 'Best practice — document in Dwelly'],
      ]},
      { type: 'callout', variant: 'warning', text: 'From 2025, the government has proposed raising the minimum EPC rating from E to C for new tenancies. Stay updated — this will affect a large proportion of the portfolio.' },

      { type: 'heading', level: 1, text: 'Fire Safety' },
      { type: 'paragraph', text: 'Fire safety obligations depend on the type of property. The following apply to all rented residential properties:' },
      { type: 'bullets', items: [
        'Smoke alarms — at least one on every storey of the property used as living accommodation (Smoke and Carbon Monoxide Alarm (England) Regulations 2015)',
        'Carbon monoxide alarms — in every room with a fixed combustion appliance (including gas boilers)',
        'Both must be tested at the start of each tenancy (landlord/agent responsibility)',
        'Tenants are responsible for testing alarms during the tenancy and reporting failures',
        'Furniture and furnishings provided by the landlord must comply with the Furniture and Furnishings (Fire Safety) Regulations 1988',
      ]},
      { type: 'subheading', level: 2, text: 'HMOs — Additional Requirements' },
      { type: 'paragraph', text: 'Houses in Multiple Occupation (HMOs) — where three or more unrelated people share a home — have significantly more stringent fire safety requirements, including fire doors, thumb-turn locks, emergency lighting, and interlinked smoke alarms. HMOs require a licence from the local authority.' },

      { type: 'heading', level: 1, text: 'Property Licensing' },
      { type: 'paragraph', text: 'Mandatory HMO licensing applies to any property occupied by five or more people from two or more households. Many councils also operate selective licensing schemes covering all rented properties in specific areas, or additional licensing for smaller HMOs.' },
      { type: 'bullets', items: [
        'Operating an unlicensed HMO can result in fines of up to £30,000 per offence',
        'A Rent Repayment Order can be made — requiring the landlord to repay up to 12 months\' rent to the tenant',
        'A Section 21 notice served from an unlicensed property is invalid',
        'Always check the relevant council\'s licensing register before a new tenancy commences',
      ]},

      { type: 'heading', level: 1, text: 'What a Property Inspection Covers' },
      { type: 'paragraph', text: 'Routine property inspections (typically every 3–6 months) serve several purposes: identifying maintenance issues early, checking the condition of the property, ensuring the tenant is maintaining the property, and recording the state of the property for the compliance trail.' },
      { type: 'bullets', items: [
        'External condition — roof visible from ground, gutters, render, windows, garden',
        'Internal condition — walls, ceilings, floors, woodwork, damp signs',
        'Smoke and CO alarms — present and functional',
        'Signs of subletting or overcrowding',
        'Signs of damage, pets (where not permitted), or neglect',
        'Boiler and heating — accessible and not obstructed',
        'All safety certificates — check dates and flag renewals',
      ]},
      { type: 'callout', variant: 'important', text: 'Always give the tenant the required minimum notice before an inspection — at least 24 hours under the Housing Act 1988, though good practice is to give more. Log the inspection date, findings, and any actions raised in Dwelly.' },

      { type: 'heading', level: 1, text: 'Minimum Room Sizes (HMOs)' },
      { type: 'paragraph', text: 'For licensed HMOs, minimum room size standards apply to rooms used for sleeping.' },
      { type: 'table', headers: ['Occupant', 'Minimum Floor Area'], rows: [
        ['One adult', '6.51 m²'],
        ['Two adults', '10.22 m²'],
        ['One child (under 10)', '4.64 m²'],
      ]},
    ],
  },
  {
    id: 'kb-landlord-relations',
    title: 'Landlord Relationships',
    subtitle: 'Managing landlord expectations, communications, and the agency relationship.',
    icon: '🤝',
    category: 'landlord',
    readTime: '7 min read',
    difficulty: 'foundation',
    content: [
      { type: 'heading', level: 1, text: 'The PM–Landlord Relationship' },
      { type: 'paragraph', text: 'As a property manager, you are the landlord\'s primary point of contact for everything relating to their investment property. The quality of this relationship directly affects landlord retention, and retaining a landlord is far more valuable to the agency than acquiring a new one. A managed property generating £1,500/month in rent typically represents over £1,800 per year in management fees — losing a client is significant.' },
      { type: 'callout', variant: 'tip', text: 'The best landlord relationships are built on three things: proactive communication, clear expectations, and never surprising them with unexpected costs. If you can do these three things consistently, most landlords will stay.' },

      { type: 'heading', level: 1, text: 'Types of Landlords' },
      { type: 'paragraph', text: 'Landlords are not a homogeneous group. Understanding the type of landlord you are dealing with helps you calibrate your communication style and the level of involvement they want.' },
      { type: 'table', headers: ['Type', 'Characteristics', 'Communication Approach'], rows: [
        ['Hands-off investor', 'Often overseas or has multiple properties — wants minimal contact', 'Regular brief updates; only contact for decisions and approvals. Use email primarily.'],
        ['Accidental landlord', 'Inherited or couldn\'t sell — emotionally attached, sometimes anxious', 'More frequent reassurance; explain everything clearly; acknowledge the emotional weight.'],
        ['Portfolio landlord', 'Experienced, property is a business — focused on yield and costs', 'Data-led communication; respect their knowledge; fast responses; clear cost justification.'],
        ['First-time landlord', 'Bought to let, often nervous about compliance and voids', 'Educational approach; explain the "why" behind actions; build confidence.'],
      ]},

      { type: 'heading', level: 1, text: 'Proactive Communication' },
      { type: 'paragraph', text: 'The single biggest cause of landlord dissatisfaction is feeling out of the loop. Proactive communication means reaching out before the landlord has to ask.' },
      { type: 'bullets', items: [
        'Notify the landlord when a new maintenance job is raised — don\'t wait until you have a quote',
        'Provide an update within 48 hours of a repair visit, even if works are ongoing',
        'Flag compliance certificate renewals at least 6 weeks in advance',
        'Share inspection reports within 5 working days of the visit',
        'Notify of any arrears situation within 7 days of the due date',
        'Call (don\'t just email) for significant issues — a boiler failure, a leak, a legal notice received',
      ]},

      { type: 'heading', level: 1, text: 'Managing Expectations' },
      { type: 'paragraph', text: 'Many landlord complaints arise from a gap between what they expected and what actually happened — not necessarily because anything was done wrong. Setting clear expectations at the outset prevents these gaps.' },
      { type: 'bullets', items: [
        'Repairs: "We aim to have routine repairs resolved within 28 days. Emergency repairs are addressed within 24 hours."',
        'Voids: "A typical void for a property like yours is 2–4 weeks. We\'ll begin marketing 6–8 weeks before the tenancy end date."',
        'Costs: "Any repair under £250 is instructed under our standard authority. Above that, we\'ll always seek your approval first."',
        'Compliance: "We\'ll manage your gas safety, EICR, and EPC renewals automatically and charge the cost to your account."',
      ]},

      { type: 'heading', level: 1, text: 'Landlord Responsibilities vs Agency Responsibilities' },
      { type: 'paragraph', text: 'A common source of tension is disagreement about who is responsible for a particular action or outcome. Be clear about the division of responsibilities under the management agreement.' },
      { type: 'table', headers: ['Responsibility', 'Who Owns It'], rows: [
        ['Instructing repairs (up to agreed threshold)', 'Agency'],
        ['Approving works above agreed threshold', 'Landlord'],
        ['Paying for repairs', 'Landlord (from managed account)'],
        ['Gas safety certificate renewal', 'Agency (managed service)'],
        ['Buildings insurance', 'Landlord'],
        ['Mortgage and ground rent', 'Landlord'],
        ['Deposit disputes and adjudication', 'Agency coordinates; landlord decides claims'],
        ['Eviction proceedings costs', 'Landlord'],
      ]},

      { type: 'heading', level: 1, text: 'When Landlords Make Unreasonable Requests' },
      { type: 'paragraph', text: 'Occasionally a landlord will ask the agency to take an action that is either illegal, contrary to agency policy, or simply not in their own best interests. Your role is to advise clearly and firmly.' },
      { type: 'bullets', items: [
        'If a landlord asks you to refuse a necessary repair: explain the legal obligation and document their refusal',
        'If a landlord asks you to discriminate in tenant selection: refuse — this is unlawful and could result in a discrimination claim',
        'If a landlord wants to enter the property without notice: explain the 24-hour notice requirement and offer to arrange a formal inspection',
        'If a landlord threatens to remove the agency if you don\'t comply: escalate to your manager immediately',
      ]},
      { type: 'callout', variant: 'warning', text: 'The agency has a duty of care to tenants as well as to landlord clients. A landlord\'s instruction that would cause harm to a tenant or break the law cannot be followed, regardless of the commercial relationship.' },
    ],
  },

  // ─── HMO Licensing & Management ──────────────────────────────────────────────
  {
    id: 'kb-hmo-licensing',
    title: 'HMO Licensing & Management',
    subtitle: 'Understanding Houses in Multiple Occupation — licensing requirements, management regulations, and fire safety obligations.',
    icon: '🏘️',
    category: 'legal',
    readTime: '10 min read',
    difficulty: 'advanced',
    content: [
      { type: 'heading', level: 1, text: 'What Is an HMO?' },
      { type: 'paragraph', text: 'A House in Multiple Occupation (HMO) is a property rented out by at least three people who are not from the same household but share facilities such as a bathroom or kitchen. HMOs are subject to additional regulations because of the higher risks associated with multi-occupancy living, including fire safety, overcrowding, and communal hygiene.' },
      { type: 'callout', variant: 'info', text: 'A property is an HMO if it meets the "standard test", the "self-contained flat test", or the "converted building test" under the Housing Act 2004. The local authority decides which test applies.' },
      { type: 'heading', level: 1, text: 'Mandatory vs Additional Licensing' },
      { type: 'paragraph', text: 'Mandatory licensing applies to HMOs occupied by five or more people forming two or more separate households, regardless of the number of storeys. This is a national requirement under the Housing Act 2004 (as amended in 2018). Additional licensing is a discretionary scheme that local authorities can introduce for HMOs that fall outside mandatory licensing — for example, smaller HMOs with three or four occupants. You must check the specific council area where the property is located.' },
      { type: 'table', headers: ['Licensing Type', 'Criteria', 'Who Decides'], rows: [
        ['Mandatory', '5+ occupants, 2+ households', 'National (Housing Act 2004)'],
        ['Additional', 'Smaller HMOs not caught by mandatory scheme', 'Local authority discretion'],
        ['Selective', 'All private rented properties in a designated area', 'Local authority discretion'],
      ]},
      { type: 'heading', level: 1, text: 'Licence Conditions & Application' },
      { type: 'paragraph', text: 'An HMO licence typically lasts up to five years and is granted to a "fit and proper" person. The licence holder must comply with conditions set by the local authority, which usually cover maximum occupancy numbers, provision of amenities (kitchens, bathrooms), waste disposal arrangements, and fire safety measures.' },
      { type: 'steps', items: [
        'Determine whether the property meets the HMO definition and which licensing regime applies.',
        'Submit the application to the relevant local authority with required documents (floor plans, gas safety certificate, fire risk assessment).',
        'Pay the licence fee — this varies by council and can range from £500 to over £1,500.',
        'Implement any conditions imposed by the licence (e.g. installing fire doors, providing additional kitchen facilities).',
        'Display the licence at the property or make it available to tenants on request.',
      ]},
      { type: 'heading', level: 1, text: 'Fire Safety in HMOs' },
      { type: 'paragraph', text: 'Fire safety is one of the most critical aspects of HMO management. The Regulatory Reform (Fire Safety) Order 2005 requires a fire risk assessment for all HMOs. Typical requirements include fire doors to all habitable rooms and kitchens, a fire alarm system appropriate to the size and layout of the property, fire extinguishers and fire blankets in kitchens, emergency lighting in escape routes, and clearly marked escape routes.' },
      { type: 'callout', variant: 'warning', text: 'Failure to comply with fire safety requirements in an HMO can result in prosecution, unlimited fines, and even imprisonment. The fire authority and local council both have enforcement powers.' },
      { type: 'heading', level: 1, text: 'Penalties for Non-Compliance' },
      { type: 'paragraph', text: 'Operating an unlicensed HMO is a criminal offence. Local authorities can impose civil penalties of up to £30,000 per offence as an alternative to prosecution. Tenants may also apply for a Rent Repayment Order (RRO), requiring the landlord to repay up to 12 months\' rent. Persistent offenders can be placed on the Rogue Landlord Database and may be subject to a banning order.' },
      { type: 'bullets', items: [
        'Civil penalty: up to £30,000 per offence',
        'Rent Repayment Order: up to 12 months\' rent repaid to tenants or the local authority',
        'Criminal prosecution: unlimited fine on conviction',
        'Banning order: prevents the person from letting or managing rental properties',
        'Planning enforcement: operating an HMO without planning permission (where required) is a separate breach',
      ]},
      { type: 'heading', level: 1, text: 'Planning Permission' },
      { type: 'paragraph', text: 'In many areas, converting a dwelling (Use Class C3) into a small HMO (Use Class C4, 3–6 occupants) requires planning permission — particularly where an Article 4 Direction is in place. Larger HMOs (7+ occupants) fall into sui generis use and always require planning permission. Check the local planning authority before proceeding with any HMO conversion.' },
    ],
  },

  // ─── Deposit Protection Schemes ──────────────────────────────────────────────
  {
    id: 'kb-deposit-schemes',
    title: 'Deposit Protection Schemes',
    subtitle: 'How to protect tenancy deposits correctly — approved schemes, prescribed information, and dispute resolution.',
    icon: '🔒',
    category: 'legal',
    readTime: '8 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'Why Deposit Protection Matters' },
      { type: 'paragraph', text: 'Under the Housing Act 2004, any deposit taken for an assured shorthold tenancy (AST) in England and Wales must be protected in a government-approved tenancy deposit scheme within 30 days of receipt. Failure to comply exposes the landlord to significant financial penalties and restricts their ability to regain possession of the property.' },
      { type: 'heading', level: 1, text: 'The Three Approved Schemes' },
      { type: 'table', headers: ['Scheme', 'Type Available', 'Website'], rows: [
        ['Tenancy Deposit Scheme (TDS)', 'Custodial & Insured', 'tenancydepositscheme.com'],
        ['Deposit Protection Service (DPS)', 'Custodial & Insured', 'depositprotection.com'],
        ['mydeposits', 'Custodial & Insured', 'mydeposits.co.uk'],
      ]},
      { type: 'heading', level: 1, text: 'Custodial vs Insured Schemes' },
      { type: 'paragraph', text: 'Custodial schemes hold the deposit money directly — the landlord or agent sends the funds to the scheme, which holds them for the duration of the tenancy at no cost. Insured schemes allow the landlord or agent to retain the deposit, but they must pay an annual fee to the scheme provider for insurance cover. In both cases, the scheme acts as the adjudicator if there is a dispute at the end of the tenancy.' },
      { type: 'callout', variant: 'tip', text: 'Most letting agencies use insured schemes because they retain control of the deposit funds within their client account, making cash-flow management simpler.' },
      { type: 'heading', level: 1, text: 'The 30-Day Rule & Prescribed Information' },
      { type: 'paragraph', text: 'The deposit must be protected within 30 days of receipt. Within the same 30-day period, the landlord or agent must also serve the tenant with prescribed information, which includes: the name and contact details of the scheme, the amount of the deposit, the address of the property, the landlord\'s name and contact details, circumstances under which deductions may be made, and how to apply for the release of the deposit.' },
      { type: 'steps', items: [
        'Receive the deposit from the tenant (usually 5 weeks\' rent maximum under the Tenant Fees Act 2019).',
        'Protect the deposit with one of the three approved schemes within 30 days.',
        'Serve prescribed information on the tenant within the same 30-day period.',
        'Obtain written confirmation from the tenant that they have received the prescribed information.',
        'Retain proof of protection and service for the duration of the tenancy.',
      ]},
      { type: 'heading', level: 1, text: 'Penalties for Non-Protection' },
      { type: 'paragraph', text: 'If a deposit is not protected or prescribed information is not served, the tenant can apply to the county court. The court must order the landlord to repay the deposit or protect it, and pay compensation of between one and three times the deposit amount. Additionally, the landlord cannot serve a valid Section 21 notice until the deposit has been properly protected and prescribed information served.' },
      { type: 'callout', variant: 'warning', text: 'A single missed deposit protection can cost a landlord thousands of pounds in penalties plus prevent them from recovering possession. Always protect deposits on the day you receive them — do not wait.' },
      { type: 'heading', level: 1, text: 'End of Tenancy & Disputes' },
      { type: 'paragraph', text: 'At the end of the tenancy, the deposit should be returned within 10 days of both parties agreeing the amount. If there is a dispute over deductions (e.g. cleaning, damage beyond fair wear and tear), either party can raise it with the deposit scheme\'s free alternative dispute resolution (ADR) service. The adjudicator\'s decision is binding. Ensure you have a thorough check-in inventory and check-out report with dated photographs to support any deductions.' },
      { type: 'bullets', items: [
        'Always compare the check-in and check-out inventories side by side',
        'Deductions must be evidenced — invoices, photographs, and receipts',
        'Fair wear and tear cannot be claimed against the deposit',
        'Submit dispute evidence within the scheme\'s deadline (usually 14–28 days)',
        'The adjudicator\'s decision is final and binding on both parties',
      ]},
    ],
  },

  // ─── Section 8 Notices & Grounds for Possession ──────────────────────────────
  {
    id: 'kb-section-8',
    title: 'Section 8 Notices & Grounds for Possession',
    subtitle: 'How to serve a Section 8 notice — mandatory and discretionary grounds, court process, and notice periods.',
    icon: '📋',
    category: 'legal',
    readTime: '11 min read',
    difficulty: 'advanced',
    content: [
      { type: 'heading', level: 1, text: 'When to Use Section 8' },
      { type: 'paragraph', text: 'A Section 8 notice (Housing Act 1988) is served when a landlord seeks possession of a property because the tenant has breached the terms of their tenancy agreement. Unlike other routes to possession, Section 8 requires the landlord to specify one or more "grounds" for possession. It can be used during a fixed term or after it has expired, provided the relevant ground applies.' },
      { type: 'callout', variant: 'info', text: 'Section 8 is fault-based — you must demonstrate that the tenant has done something (or failed to do something) that justifies possession. The court then decides whether to grant a possession order.' },
      { type: 'heading', level: 1, text: 'Mandatory vs Discretionary Grounds' },
      { type: 'paragraph', text: 'The Housing Act 1988 (Schedule 2) sets out 17 grounds for possession, divided into mandatory and discretionary categories. If a mandatory ground is proved, the court must grant possession. If a discretionary ground is proved, the court may grant possession but will consider whether it is reasonable to do so.' },
      { type: 'table', headers: ['Ground', 'Type', 'Description', 'Notice Period'], rows: [
        ['Ground 8', 'Mandatory', 'At least 2 months\' rent arrears at both notice date and hearing date', '2 weeks'],
        ['Ground 10', 'Discretionary', 'Some rent is unpaid at notice date and hearing date', '2 weeks'],
        ['Ground 11', 'Discretionary', 'Tenant has been persistently late paying rent', '2 weeks'],
        ['Ground 12', 'Discretionary', 'Breach of any tenancy obligation (other than rent)', '2 weeks'],
        ['Ground 14', 'Discretionary', 'Nuisance, annoyance, or conviction for illegal activity at the property', '0 — immediate'],
        ['Ground 7A', 'Mandatory', 'Serious anti-social behaviour (added by Anti-social Behaviour Act 2014)', '4 weeks'],
      ]},
      { type: 'heading', level: 1, text: 'Ground 8 — The Key Rent Arrears Ground' },
      { type: 'paragraph', text: 'Ground 8 is the most commonly used mandatory ground. It requires that the tenant owes at least two months\' rent (for monthly tenancies) at both the date the notice is served and the date of the court hearing. Because it is mandatory, the court has no discretion — if the arrears threshold is met at both points, possession must be granted.' },
      { type: 'callout', variant: 'warning', text: 'Tenants and their advisers know that reducing the arrears below the two-month threshold before the hearing defeats Ground 8. Always plead discretionary grounds (10 and 11) alongside Ground 8 as a fallback.' },
      { type: 'heading', level: 1, text: 'Serving the Section 8 Notice' },
      { type: 'steps', items: [
        'Use the prescribed form — currently Form 3 for assured tenancies and Form 3 for assured shorthold tenancies.',
        'Specify every ground you intend to rely on and set out the particulars (e.g. exact arrears figure and dates).',
        'Serve the notice in accordance with section 196 of the Law of Property Act 1925 — personal service, recorded delivery to the property, or left at the property.',
        'Allow the correct notice period to expire before issuing court proceedings (varies by ground — see table above).',
        'If the tenant does not vacate, apply to the county court for a possession order using Form N5B (accelerated) or N5 (standard).',
        'Attend the hearing with evidence of arrears, breach, or ASB as applicable.',
      ]},
      { type: 'heading', level: 1, text: 'The Court Process' },
      { type: 'paragraph', text: 'After the notice period expires, the landlord issues a possession claim at the county court. Standard possession claims are listed for a hearing, typically within 4–8 weeks. At the hearing, the judge will consider the evidence and decide whether to make a possession order. If granted, the order usually gives the tenant 14 days to vacate (or up to 42 days in cases of exceptional hardship). If the tenant still does not leave, the landlord must apply for a warrant of possession to instruct county court bailiffs.' },
      { type: 'heading', level: 1, text: 'Renters\' Rights Bill — Key Changes' },
      { type: 'paragraph', text: 'The Renters\' Rights Bill introduces significant reforms to the possession process. Grounds for possession are being revised, with extended notice periods for some grounds and new grounds being added. Landlords must be aware that the Bill strengthens tenant protections during the possession process and increases the evidential burden on landlords. Keep up to date with legislative changes as the Bill progresses through Parliament.' },
      { type: 'bullets', items: [
        'Notice periods for certain grounds may increase to up to 4 months',
        'New mandatory ground for repeated serious rent arrears',
        'Strengthened discretionary grounds with clearer definitions',
        'Greater emphasis on court discretion and proportionality',
        'Landlords should seek legal advice before serving any notice under the new regime',
      ]},
      { type: 'callout', variant: 'tip', text: 'Always take legal advice before serving a Section 8 notice. Errors in the notice — wrong form, incorrect particulars, insufficient notice period — will cause the claim to fail and cost the landlord time and money.' },
    ],
  },

  // ─── Damp, Mould & Condensation ──────────────────────────────────────────────
  {
    id: 'kb-damp-mould',
    title: 'Damp, Mould & Condensation',
    subtitle: 'Identifying causes, understanding landlord obligations under Awaab\'s Law, and managing remediation effectively.',
    icon: '💧',
    category: 'standards',
    readTime: '9 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'Types of Damp' },
      { type: 'paragraph', text: 'Damp in residential properties generally falls into three categories: rising damp, penetrating damp, and condensation. Each has different causes, presentations, and remediation approaches. Correctly identifying the type is essential — misdiagnosis leads to wasted money and recurring problems.' },
      { type: 'table', headers: ['Type', 'Common Causes', 'Typical Signs'], rows: [
        ['Rising damp', 'Failed or absent damp-proof course (DPC)', 'Tide marks on ground-floor walls, peeling plaster, salt deposits'],
        ['Penetrating damp', 'Defective roofing, pointing, guttering, or plumbing leaks', 'Damp patches on walls/ceilings, often worse after rain'],
        ['Condensation', 'Excess moisture + poor ventilation + cold surfaces', 'Black mould on walls/ceilings, streaming windows, musty smell'],
      ]},
      { type: 'callout', variant: 'info', text: 'Condensation is by far the most common cause of damp and mould in rented properties. It is often wrongly blamed on tenant behaviour alone — in most cases the property itself has inadequate ventilation, insulation, or heating.' },
      { type: 'heading', level: 1, text: 'Landlord Obligations & Awaab\'s Law' },
      { type: 'paragraph', text: 'Awaab\'s Law (introduced following the death of two-year-old Awaab Ishak from exposure to mould in his home) imposes strict timescales on landlords for investigating and remedying damp and mould. Under the Social Housing (Regulation) Act 2023, social landlords must investigate hazards within 14 days of a complaint, begin repairs within 7 days of investigation, and complete emergency repairs within 24 hours. The government has signalled that these requirements will be extended to the private rented sector.' },
      { type: 'steps', items: [
        'Acknowledge the tenant\'s report within 24 hours and log it in the system.',
        'Arrange an inspection within 14 days to identify the type and cause of damp.',
        'Commission a specialist survey if the cause is unclear (e.g. damp-proof course testing, leak detection).',
        'Begin remediation works within 7 days of identifying the cause.',
        'Follow up with the tenant after works are completed to confirm the issue is resolved.',
        'Schedule a reinspection after 4–6 weeks to check for recurrence.',
      ]},
      { type: 'heading', level: 1, text: 'Health Risks' },
      { type: 'paragraph', text: 'Damp and mould pose serious health risks, particularly to vulnerable occupants including children, the elderly, and those with respiratory conditions. Mould spores can cause or exacerbate asthma, allergic rhinitis, bronchitis, and other respiratory infections. Prolonged exposure has been linked to more severe conditions. Property managers must treat all damp and mould reports as urgent.' },
      { type: 'heading', level: 1, text: 'HHSRS Assessment' },
      { type: 'paragraph', text: 'Under the Housing Health and Safety Rating System (HHSRS), damp and mould growth is a Category 1 hazard if it poses a serious risk to health. Local authorities have the power to inspect properties and serve improvement notices or prohibition orders. A Category 1 hazard finding can also support a tenant\'s claim for disrepair compensation.' },
      { type: 'heading', level: 1, text: 'Remediation & Tenant Communication' },
      { type: 'bullets', items: [
        'Never blame the tenant without investigating the property — courts and ombudsmen take a very dim view of this approach',
        'Provide tenants with practical guidance on ventilation and heating while investigating the root cause',
        'Consider temporary dehumidifiers for severe cases pending permanent remediation',
        'Ensure the contractor treating mould uses appropriate anti-fungal treatments, not just paint',
        'Document everything — photographs, inspection reports, contractor invoices, tenant correspondence',
        'If the property has a systemic ventilation deficiency, consider installing extractor fans or a positive input ventilation (PIV) unit',
      ]},
      { type: 'callout', variant: 'warning', text: 'A "mould wash and paint" is not a repair. If the underlying cause is not addressed, the mould will return and the landlord will face repeated complaints, potential enforcement action, and disrepair claims.' },
      { type: 'heading', level: 1, text: 'When to Instruct a Specialist' },
      { type: 'paragraph', text: 'Instruct a specialist surveyor if: the cause of damp is unclear after an initial inspection, there are signs of structural issues (cracking, movement), the problem recurs after treatment, the tenant reports health symptoms, or the local authority has served a notice. A specialist damp survey typically costs £200–£500 and provides a clear diagnosis with recommended remediation — this is money well spent compared to the cost of failed repairs and legal claims.' },
    ],
  },

  // ─── Tenant Referencing & Affordability ──────────────────────────────────────
  {
    id: 'kb-tenant-referencing',
    title: 'Tenant Referencing & Affordability',
    subtitle: 'Running thorough reference checks — credit, employment, landlord references, and affordability criteria.',
    icon: '🔍',
    category: 'landlord',
    readTime: '7 min read',
    difficulty: 'foundation',
    content: [
      { type: 'heading', level: 1, text: 'Why Referencing Matters' },
      { type: 'paragraph', text: 'Thorough tenant referencing is the single most important step in preventing rent arrears, property damage, and tenancy disputes. A robust referencing process protects the landlord, the agency, and future neighbouring tenants. Skipping or rushing references to fill a void quickly almost always costs more in the long run.' },
      { type: 'heading', level: 1, text: 'The Referencing Process' },
      { type: 'steps', items: [
        'Collect the applicant\'s full name, date of birth, current and previous addresses, employment details, and landlord contact information.',
        'Run a credit check through the referencing provider — look for CCJs, IVAs, bankruptcy, and overall credit score.',
        'Verify employment status and income with the employer or accountant (for self-employed applicants, request 2-3 years\' SA302 tax calculations).',
        'Contact the current and/or previous landlord to confirm rent payment history, property condition, and whether they would re-let to the tenant.',
        'Conduct the affordability calculation — the tenant\'s gross annual income should be at least 2.5x the annual rent (or 30x the monthly rent).',
        'Complete Right to Rent checks in parallel (see separate knowledge article).',
        'Review results and make a recommendation to the landlord.',
      ]},
      { type: 'heading', level: 1, text: 'Affordability Calculations' },
      { type: 'paragraph', text: 'The industry standard affordability threshold is that a tenant\'s annual gross income should be at least 2.5 times the annual rent. For example, if the monthly rent is £1,200, the annual rent is £14,400, and the tenant must earn at least £36,000 gross per year. Where the tenant does not meet this threshold, consider whether a guarantor is appropriate.' },
      { type: 'table', headers: ['Monthly Rent', 'Annual Rent', 'Minimum Gross Income (2.5x)'], rows: [
        ['£800', '£9,600', '£24,000'],
        ['£1,000', '£12,000', '£30,000'],
        ['£1,200', '£14,400', '£36,000'],
        ['£1,500', '£18,000', '£45,000'],
        ['£2,000', '£24,000', '£60,000'],
      ]},
      { type: 'heading', level: 1, text: 'Red Flags & Decision Framework' },
      { type: 'bullets', items: [
        'CCJs registered in the last 3 years — discuss with landlord; may require a guarantor',
        'Unable to provide previous landlord reference — request alternative proof (e.g. mortgage statements if homeowner)',
        'Income below 2.5x threshold — guarantor required or decline',
        'Gaps in employment history — request explanation and supporting evidence',
        'Previous eviction history — strongly advise landlord to decline',
        'Reluctance to provide documentation — significant red flag; do not proceed without full references',
      ]},
      { type: 'callout', variant: 'tip', text: 'A guarantor should meet the same referencing criteria as the tenant and must have a gross income of at least 3x the annual rent. The guarantor must sign a deed of guarantee before the tenancy commences.' },
      { type: 'heading', level: 1, text: 'Tenant Fees Act 2019 — What You Can Charge' },
      { type: 'paragraph', text: 'The Tenant Fees Act 2019 limits the payments that can be required from tenants. You cannot charge a referencing fee, administration fee, or any other fee connected with the grant of a tenancy. The only permitted payments are: rent, a refundable tenancy deposit (capped at 5 weeks\' rent where annual rent is under £50,000), a refundable holding deposit (capped at 1 week\'s rent), and payments for default events (e.g. late rent or lost keys at reasonable cost).' },
      { type: 'callout', variant: 'warning', text: 'Charging prohibited fees is a criminal offence. A first offence carries a financial penalty of up to £5,000. A further offence within 5 years is a criminal offence with an unlimited fine.' },
    ],
  },

  // ─── Void Management & Turnaround ────────────────────────────────────────────
  {
    id: 'kb-void-management',
    title: 'Void Management & Turnaround',
    subtitle: 'Minimising void periods — checklists, marketing strategies, and KPIs for efficient property turnaround.',
    icon: '🔑',
    category: 'finance',
    readTime: '8 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'What Is a Void Period?' },
      { type: 'paragraph', text: 'A void period is the time between one tenancy ending and another beginning — the period during which the property is empty and generating no rental income. Every void day costs the landlord money (lost rent, ongoing costs like council tax and utilities) and the agency reputation. Effective void management is one of the clearest indicators of a well-run property management operation.' },
      { type: 'heading', level: 1, text: 'Financial Impact' },
      { type: 'paragraph', text: 'A property rented at £1,200 per month loses £40 per day during a void. A 30-day void costs the landlord £1,200 in lost rent, plus council tax liability (which reverts to the landlord when the property is empty), utility standing charges, and insurance considerations. Across a portfolio, poor void management can cost tens of thousands of pounds annually.' },
      { type: 'callout', variant: 'info', text: 'The industry benchmark for void turnaround in managed properties is 14–21 days. Properties consistently exceeding this should be reviewed for pricing, condition, or marketing issues.' },
      { type: 'heading', level: 1, text: 'Void Turnaround Checklist' },
      { type: 'steps', items: [
        'Begin marketing the property 6–8 weeks before the current tenancy end date (with tenant\'s cooperation for viewings).',
        'Conduct the check-out inspection on the last day of the tenancy or the day after.',
        'Arrange professional cleaning within 2 days of the tenant vacating.',
        'Complete all necessary repairs and maintenance within 5–7 days.',
        'Ensure all compliance certificates are valid (gas safety, EICR, EPC, smoke/CO alarms).',
        'Take professional photographs once the property is ready to let.',
        'List on all major portals (Rightmove, Zoopla, OnTheMarket) and the agency website.',
        'Conduct viewings as quickly as possible — aim for same-week availability.',
        'Process referencing immediately upon receiving an application.',
        'Complete the check-in and key handover on the tenancy start date.',
      ]},
      { type: 'heading', level: 1, text: 'Marketing & Pricing Strategy' },
      { type: 'bullets', items: [
        'Price the property competitively from day one — overpricing extends voids and costs more than a slight rent reduction',
        'Use professional photography — listings with professional photos receive significantly more enquiries',
        'Write compelling descriptions highlighting key features, transport links, and local amenities',
        'If no viewings in the first 7 days, review the asking rent and listing quality',
        'If no offers after 14 days, recommend a rent reduction to the landlord with a cost comparison (void cost vs reduced rent)',
      ]},
      { type: 'heading', level: 1, text: 'KPIs & Targets' },
      { type: 'table', headers: ['KPI', 'Target', 'Measurement'], rows: [
        ['Void days (standard turnaround)', '14–21 days', 'Check-out date to new tenancy start date'],
        ['Time to market', '5 days', 'Check-out date to listing going live'],
        ['Time to first viewing', '7 days', 'Listing live to first in-person viewing'],
        ['Time to offer', '14 days', 'Listing live to accepted offer'],
        ['Referencing turnaround', '3–5 days', 'Application received to references complete'],
      ]},
      { type: 'heading', level: 1, text: 'Dwelly System Steps' },
      { type: 'paragraph', text: 'Within the Dwelly system, void management is tracked through the property lifecycle. When a move-out job is completed, the system automatically flags the property as void and starts the void day counter. Update the property status as each step is completed — cleaning, repairs, compliance, marketing, and let agreed. This data feeds into the portfolio KPI dashboard and helps identify bottlenecks in the turnaround process.' },
      { type: 'callout', variant: 'tip', text: 'The best way to reduce void periods is to start early. Issue the marketing instruction to the lettings team as soon as you receive notice from the tenant — do not wait until the property is vacant.' },
    ],
  },

  // ─── Anti-Social Behaviour Procedures ────────────────────────────────────────
  {
    id: 'kb-antisocial',
    title: 'Anti-Social Behaviour Procedures',
    subtitle: 'Handling noise complaints, harassment, and nuisance — from evidence gathering to escalation.',
    icon: '🚨',
    category: 'communication',
    readTime: '8 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'What Is Anti-Social Behaviour?' },
      { type: 'paragraph', text: 'Anti-social behaviour (ASB) is conduct that causes or is likely to cause harassment, alarm, or distress to a person not of the same household. In a property management context, ASB typically involves noise nuisance, threatening or abusive behaviour, damage to communal areas or neighbouring properties, domestic abuse, drug use or dealing, and accumulation of rubbish or waste.' },
      { type: 'heading', level: 1, text: 'Types of ASB in Managed Properties' },
      { type: 'table', headers: ['Category', 'Examples', 'Severity'], rows: [
        ['Noise', 'Loud music, parties, shouting, barking dogs', 'Low–Medium'],
        ['Harassment', 'Verbal abuse, intimidation, threats to neighbours', 'Medium–High'],
        ['Property damage', 'Vandalism to communal areas, graffiti, broken shared facilities', 'Medium'],
        ['Criminal activity', 'Drug cultivation/dealing, theft, violence', 'High'],
        ['Environmental', 'Fly-tipping, refuse accumulation, pest infestations caused by hoarding', 'Low–Medium'],
      ]},
      { type: 'heading', level: 1, text: 'Evidence Gathering' },
      { type: 'paragraph', text: 'Effective evidence gathering is essential for any enforcement action. Without documented evidence, complaints cannot be escalated to the local authority, police, or courts. Advise complainants to keep a diary log with dates, times, duration, and nature of each incident. Where possible, collect supporting evidence such as photographs, videos, audio recordings, and witness statements.' },
      { type: 'callout', variant: 'info', text: 'A minimum of two weeks\' diary evidence from at least two independent sources is typically needed before the local authority will investigate a noise complaint.' },
      { type: 'heading', level: 1, text: 'The Escalation Process' },
      { type: 'steps', items: [
        'Log the complaint in the Dwelly system with full details of the allegation.',
        'Write to the alleged perpetrator outlining the complaint (without revealing the complainant\'s identity) and reminding them of their tenancy obligations.',
        'If the behaviour continues, issue a formal written warning referencing the specific tenancy clause being breached.',
        'Offer or arrange mediation between the parties if appropriate (not suitable where there is violence or intimidation).',
        'Report to the local authority environmental health team (for noise) or the police (for criminal behaviour or threats).',
        'If the ASB persists despite warnings, commence possession proceedings under Ground 14 (nuisance) or Ground 7A (serious ASB) of the Housing Act 1988.',
      ]},
      { type: 'heading', level: 1, text: 'Tenant Obligations in the AST' },
      { type: 'paragraph', text: 'Most assured shorthold tenancy agreements contain a clause requiring the tenant not to cause nuisance, annoyance, or disturbance to neighbours or other occupiers. This clause is the contractual basis for any enforcement action. Ensure you reference the specific clause number when issuing warnings. The tenancy agreement may also contain provisions about noise after certain hours, keeping communal areas clear, and not using the property for illegal purposes.' },
      { type: 'heading', level: 1, text: 'Supporting Vulnerable Tenants' },
      { type: 'paragraph', text: 'Some ASB is linked to underlying vulnerabilities — mental health conditions, substance misuse, domestic abuse, or learning difficulties. Before escalating enforcement, consider whether the tenant needs support. Signpost to relevant local services (mental health teams, substance misuse services, domestic abuse charities). Document all steps taken to support the tenant — courts expect landlords to have considered proportionality and vulnerability before seeking possession.' },
      { type: 'callout', variant: 'warning', text: 'Never disclose the identity of a complainant to the person being complained about without their explicit written consent. Fear of retaliation is a real concern and breaching confidentiality could expose the agency to liability.' },
      { type: 'heading', level: 1, text: 'Recording in the Dwelly System' },
      { type: 'paragraph', text: 'All ASB reports, correspondence, and actions must be recorded in the Dwelly system against the relevant property and tenancy. This creates an audit trail that can be used as evidence in court proceedings, referenced in future tenancy decisions, and reviewed by management for portfolio risk assessment. Attach diary sheets, warning letters, and any third-party correspondence to the case file.' },
    ],
  },

  // ─── Energy Performance & MEES Compliance ────────────────────────────────────
  {
    id: 'kb-energy-mees',
    title: 'Energy Performance & MEES Compliance',
    subtitle: 'EPC ratings, Minimum Energy Efficiency Standards, and preparing for future regulatory tightening.',
    icon: '⚡',
    category: 'standards',
    readTime: '9 min read',
    difficulty: 'advanced',
    content: [
      { type: 'heading', level: 1, text: 'What Is an EPC?' },
      { type: 'paragraph', text: 'An Energy Performance Certificate (EPC) rates a property\'s energy efficiency on a scale from A (most efficient) to G (least efficient). Every property that is sold, rented, or built must have a valid EPC, which lasts for 10 years. The EPC includes a current energy rating, a potential rating showing what could be achieved with improvements, and a list of recommended energy efficiency measures with estimated costs and savings.' },
      { type: 'heading', level: 1, text: 'EPC Rating Bands' },
      { type: 'table', headers: ['Band', 'SAP Score', 'Typical Property'], rows: [
        ['A', '92–100', 'New-build with renewable energy systems'],
        ['B', '81–91', 'Well-insulated modern property with efficient heating'],
        ['C', '69–80', 'Modern property with good insulation and double glazing'],
        ['D', '55–68', 'Average property with some insulation improvements needed'],
        ['E', '39–54', 'Older property with limited insulation — current minimum for renting'],
        ['F', '21–38', 'Poorly insulated property — cannot be let without exemption'],
        ['G', '1–20', 'Very poor efficiency — significant works required'],
      ]},
      { type: 'heading', level: 1, text: 'MEES Regulations' },
      { type: 'paragraph', text: 'The Minimum Energy Efficiency Standards (MEES) regulations make it unlawful to grant a new tenancy or renew an existing tenancy of a property with an EPC rating below E, unless a valid exemption has been registered. Since April 2020, this applies to all existing tenancies as well as new lettings. Landlords must not continue to let a property rated F or G without a registered exemption.' },
      { type: 'callout', variant: 'warning', text: 'Letting a property in breach of MEES regulations can result in a financial penalty of up to £5,000 per property. Local authority trading standards teams are the enforcement body.' },
      { type: 'heading', level: 1, text: 'Penalties for Non-Compliance' },
      { type: 'bullets', items: [
        'Letting a sub-standard property for less than 3 months: up to £2,000',
        'Letting a sub-standard property for 3 months or more: up to £4,000',
        'Providing false or misleading information on the PRS Exemptions Register: up to £1,000',
        'Maximum total penalty per property: £5,000',
        'Penalties are published on the PRS Exemptions Register for at least 12 months',
      ]},
      { type: 'heading', level: 1, text: 'Exemptions' },
      { type: 'paragraph', text: 'A landlord can register an exemption if: all relevant improvements have been made and the property still cannot reach band E ("all improvements made" exemption); the cost of improvements exceeds the spending cap (currently £3,500 including VAT); a required improvement would devalue the property by more than 5%; or the tenant has refused consent for works. Exemptions last for 5 years and must be registered on the PRS Exemptions Register.' },
      { type: 'heading', level: 1, text: 'Future Tightening — Band C by 2028' },
      { type: 'paragraph', text: 'The government has indicated that the minimum EPC rating for rented properties will be raised to band C by 2028 for new tenancies and 2030 for existing tenancies. While the exact timeline and spending cap are subject to ongoing consultation, landlords should begin planning now. Properties currently rated D or E will need improvement works, and the cost of these works should be factored into landlord advice and financial planning.' },
      { type: 'steps', items: [
        'Review the current EPC for every property in your portfolio.',
        'Identify properties rated D or below that will need improvement.',
        'Obtain quotes for the recommended improvements listed on the EPC.',
        'Advise landlords of the upcoming requirement and estimated costs.',
        'Prioritise improvements that offer the best SAP score improvement per pound spent (typically loft insulation, cavity wall insulation, and boiler upgrades).',
        'Register any valid exemptions on the PRS Exemptions Register where improvements are not feasible.',
      ]},
      { type: 'heading', level: 1, text: 'Dwelly Compliance Tracking' },
      { type: 'paragraph', text: 'The Dwelly system tracks EPC expiry dates and ratings for all managed properties. Properties approaching EPC expiry or rated below the current minimum are automatically flagged. Use the compliance dashboard to identify at-risk properties, instruct new EPCs before they expire, and record improvement works. This data also feeds into the landlord reporting suite, helping landlords understand their obligations and plan investment accordingly.' },
      { type: 'callout', variant: 'tip', text: 'When a property is being improved, always commission a new EPC after the works are completed — the rating improvement will only be reflected once a new assessment is done by a qualified domestic energy assessor.' },
    ],
  },
]

export function getKnowledgeArticle(id: string): KnowledgeArticle | undefined {
  return KNOWLEDGE_ARTICLES.find(a => a.id === id)
}

export function getTrainingPage(id: string): TrainingPage | undefined {
  return TRAINING_PAGES.find(p => p.id === id)
}

export function getAdjacentPages(id: string): { prev: TrainingPage | null; next: TrainingPage | null } {
  const sorted = [...TRAINING_PAGES].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex(p => p.id === id)
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  }
}
