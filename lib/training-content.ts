// ─── Training Section Types ───────────────────────────────────────────────────

export type TrainingSection =
  | 'general-navigation'
  | 'maintenance'
  | 'compliance'
  | 'move-outs'
  | 'inspections'
  | 'right-to-rent'
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
  | 'kb-contractor-portal'
  | 'kb-abandonment'
  | 'kb-tenant-death'
  | 'kb-illegal-eviction'
  | 'kb-subletting'
  | 'kb-vulnerable-tenants'
  | 'kb-fire-safety'
  | 'kb-possession-process'
  | 'kb-data-protection'
  | 'kb-rent-arrears'
  | 'kb-leasehold-consent'
  | 'kb-renters-rights-act'
  | 'kb-deposit-disputes'
  | 'kb-gas-electrical-safety'
  | 'kb-inventories'
  | 'kb-notice-serving'
  | 'kb-guarantors'
  | 'kb-pets'
  | 'kb-complaints-redress'
  | 'kb-client-money'
  | 'kb-service-charges'
  | 'kb-court-money-claims'
  | 'kb-overseas-landlords'
  | 'kb-money-owed-to-tenant'
  | 'kb-tenancy-agreements'
  | 'kb-repairs-responsibilities'
  | 'kb-insurance'

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
        ['EICR', 'C1 (Danger Present): immediate rectification required — the installation is unsafe and must be dealt with on the spot by the attending electrician. C2 and F1 items: remedial works within 28 days. C3 items: elective but strongly recommended. Written confirmation or Minor Works Certificate required for all remedial works. FI classification: follow-up inspection required.'],
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
        ['Brookdale', 'After 3 months', 'Every 6 months'],
        ['Parks', 'Every 6 months', 'Every 6 months'],
        ['HC Lettings', 'After 4 months', 'Every 6 months'],
        ['Number 1 Lettings', 'After 4 months', 'Every 6 months'],
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
    id: 'right-to-rent',
    title: 'Right to Rent',
    subtitle: 'Verifying tenant eligibility during a tenancy — share codes, visual likeness checks, and manual follow-up.',
    notionUrl: '',
    icon: '🪪',
    colour: 'bg-blue-50 text-blue-700',
    readTime: '8 min read',
    order: 7,
    content: [
      { type: 'callout', variant: 'important', text: 'Right to Rent (RtR) is a legal requirement in England. The Tenant Find team performs checks before a tenancy begins, but where a tenant\'s immigration status is time-limited, the check must be repeated during the tenancy. This guide covers the during-tenancy process managed in Dwelly.' },
      { type: 'heading', level: 1, text: 'Step 1: Job Creation' },
      { type: 'paragraph', text: 'Jobs for during-tenancy Right to Rent checks are always generated by the system 2 months before the actual expiry date. When the job is created, Dwelly automatically emails the tenant requesting their RtR share code and date of birth.' },
      { type: 'callout', variant: 'info', text: 'Automated email to tenant: "We need to verify you still have the right to rent the property. Please provide your current RTR code and date of birth by replying to this email. If you don\'t have your RTR code, please contact the Home Office or visit the government website to obtain it."' },
      { type: 'paragraph', text: 'If the tenant does not respond, a second reminder is sent automatically after 96 hours. The system will wait a full 7 days for a reply.' },
      { type: 'callout', variant: 'warning', text: 'If no response is received within 7 days, the job automatically switches to Manual mode and returns to your queue. You must then follow up with the tenant directly — by phone, SMS, or personal email — as the system has exhausted its automated reminders.' },
      { type: 'heading', level: 1, text: 'Step 2: RTR Verification' },
      { type: 'paragraph', text: 'Once the tenant replies with their RtR share code and date of birth, enter these details into the RTR verification section on the job page, then click Send RTR Request. After submission, the system automatically moves the job into Auto mode.' },
      { type: 'paragraph', text: 'Dwelly then checks whether the share code is valid:' },
      { type: 'bullets', items: [
        'If the code is valid — the job is completed automatically.',
        'If the code is not valid — the job returns to your queue so you can follow up and verify the situation.',
      ]},
      { type: 'callout', variant: 'warning', text: 'A failed check is not the end of the task — it must be looked into. We have seen cases where a code fails, is re-input, fails again, and is then left. Never leave a failed check unresolved.' },
      { type: 'subheading', level: 2, text: 'Why a Valid Code Can Still Fail — Check the Expiry First' },
      { type: 'paragraph', text: 'Remember that the job opens 2 months before the tenant\'s current right to rent expires. Because of this, the tenant will often send you the share code for the right to rent that is about to expire — so re-inputting the same code will simply fail the check again. The fix is not to keep re-entering it; it is to confirm what the code actually shows.' },
      { type: 'steps', items: [
        'Check the tenant\'s share code on the government site at https://www.gov.uk/view-right-to-rent to see when their right to rent actually expires.',
        'If the expiry date is within the next 2 months, this is the expiring right to rent — it is not the updated status we need.',
        'Write to the tenant to request that they renew their right to rent, and ask them to send the new share code and date of birth once renewed.',
        'Enter the renewed details and Send RTR Request again, then continue with the verification steps below.',
      ]},
      { type: 'callout', variant: 'important', text: 'We are always after the updated right to rent. If the code the tenant supplies is for the status expiring within the 2-month window, go back to the tenant for the renewal rather than repeatedly submitting the expiring code.' },
      { type: 'heading', level: 1, text: 'Step 3: Visual Likeness Verification' },
      { type: 'paragraph', text: 'Once the RTR results have been returned, you must verify the following via video call:' },
      { type: 'bullets', items: [
        'The likeness of the tenant (visual confirmation they match the document)',
        'The tenant\'s details — name, date of birth, and any other relevant information',
      ]},
      { type: 'paragraph', text: 'If all details and likeness match, proceed to close the job.' },
      { type: 'callout', variant: 'warning', text: 'If the details or likeness do not match, escalate to your TC immediately. Do not close the job.' },
      { type: 'heading', level: 1, text: 'Closing RtR Tasks — Supervisor Permissions' },
      { type: 'paragraph', text: 'Permissions for cancelling or closing (marking as completed) RtR verification tasks are restricted to users with the Supervisor role. If you need to close a task, please ask Product Support to action this.' },
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
    order: 8,
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
  // Month/year of the last formal accuracy review, shown in the article header.
  // Only set on law/regulation-driven articles where currency matters.
  lastReviewed?: string
  // Ids of related Knowledge Base articles, surfaced at the foot of the article.
  related?: TrainingSection[]
  content: ContentBlock[]
}

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-tenancy-law',
    lastReviewed: 'July 2026',
    title: 'Tenancy Law Essentials',
    related: ['kb-section-8', 'kb-deposit-schemes', 'kb-disrepair'],
    subtitle: 'Key legislation every property manager must know — from Section 11 to the Renters\' Rights Act 2025.',
    icon: '⚖️',
    category: 'legal',
    readTime: '13 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'Why Tenancy Law Matters' },
      { type: 'paragraph', text: 'As a property manager you are the person tenants and landlords rely on when things go wrong. A working knowledge of the legislation that governs residential tenancies is not optional — it protects the agency, protects your landlord clients, and ensures tenants are treated fairly and lawfully.' },
      { type: 'callout', variant: 'important', text: 'You do not need to be a lawyer, but you do need to know when a situation crosses a legal threshold and when to escalate to a specialist or your line manager.' },
      { type: 'callout', variant: 'info', text: 'This article reflects the law in England following the Renters\' Rights Act 2025, which received Royal Assent on 27 October 2025. The first major reforms — including the abolition of Section 21 — came into force on 1 May 2026. Some provisions (the Private Rented Sector Database and the Decent Homes Standard) are being phased in later; always check the current position before advising a landlord or tenant.' },

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

      { type: 'heading', level: 1, text: 'The Renters\' Rights Act 2025 — What Changed' },
      { type: 'paragraph', text: 'The Renters\' Rights Act 2025 is the most significant reform of the private rented sector in a generation. It abolished assured shorthold tenancies (ASTs) and fixed terms, ended no-fault eviction, and changed how landlords can seek possession and increase rent. From 1 May 2026, every assured tenancy in England is governed by this new framework — including tenancies that started before that date, which converted automatically.' },
      { type: 'subheading', level: 2, text: 'Periodic tenancies replace fixed terms' },
      { type: 'paragraph', text: 'Fixed-term ASTs no longer exist. All assured tenancies are now open-ended periodic tenancies with a rent period of one month or shorter. A tenant cannot be locked into a minimum term, and a tenancy simply continues until it is lawfully ended.' },
      { type: 'bullets', items: [
        'Existing fixed-term ASTs converted to periodic tenancies on 1 May 2026',
        'A tenant can end the tenancy at any time by giving two months\' written notice',
        'A landlord can only end the tenancy using a Section 8 notice on a valid statutory ground',
      ]},

      { type: 'heading', level: 1, text: 'Possession — Section 21 Abolished' },
      { type: 'paragraph', text: 'Section 21 "no-fault" eviction has been abolished. A landlord can no longer end a tenancy simply by giving notice with no reason. The only route to possession is now a Section 8 notice specifying one or more statutory grounds, which the landlord must be able to evidence at court. Section 8 notices served on or after 1 May 2026 must use Form 3A.' },
      { type: 'paragraph', text: 'Grounds are either mandatory (the court must grant possession if the ground is proved) or discretionary (the court may grant possession if it is reasonable to do so). The most frequently used grounds are set out below. This is a summary — for the full Dwelly procedure, the complete grounds table, and the compliance audit required before service, see the dedicated "Section 8 Notices — Serving & Grounds for Possession" article.' },
      { type: 'table', headers: ['Ground', 'Type', 'Summary', 'Notice Period'], rows: [
        ['1 & 1A', 'Mandatory', 'Landlord or family moving in (1) or selling (1A). Cannot be used in the first 12 months of a tenancy.', '4 months'],
        ['8', 'Mandatory', 'Serious rent arrears — at least 3 months\' rent (or 13 weeks\' if rent is paid weekly/fortnightly) outstanding both when notice is served AND at the hearing.', '4 weeks'],
        ['10 & 11', 'Discretionary', 'Some arrears (10) or persistent late payment even if cleared (11).', '4 weeks'],
        ['14', 'Discretionary', 'Anti-social behaviour or nuisance to neighbours.', 'No minimum — can be immediate'],
      ]},
      { type: 'callout', variant: 'warning', text: 'The Ground 8 arrears threshold rose from two months to THREE months under the Renters\' Rights Act, and the notice period doubled to four weeks. If arrears fall below three months before the hearing, mandatory possession is lost. Any rent unpaid only because a Universal Credit housing payment had not yet arrived is disregarded when calculating arrears.' },
      { type: 'callout', variant: 'important', text: 'Dwelly serves Section 8 notices on behalf of landlords under a strict SOP with MD sign-off. Never advise a landlord on grounds or serve a notice without following that process — an invalid notice costs the landlord time and money and exposes the business to liability.' },

      { type: 'heading', level: 1, text: 'Rent Increases Under the New Rules' },
      { type: 'paragraph', text: 'The Act also standardised how rent can be increased. Contractual rent-review clauses (including RPI/CPI escalators) no longer have effect. A landlord can only increase the rent on an existing tenancy using the statutory Section 13 procedure.' },
      { type: 'bullets', items: [
        'Rent can be increased at most once every 12 months',
        'The landlord must serve a Section 13 notice giving at least two months\' notice of the new rent',
        'The increase can take effect no earlier than 52 weeks after the tenancy began (or the last increase)',
        'A tenant who believes the proposed rent is above market rate can challenge it at the First-tier Tribunal, which cannot set a rent higher than the landlord proposed',
      ]},

      { type: 'heading', level: 1, text: 'Deposit Protection' },
      { type: 'paragraph', text: 'Under the Housing Act 2004, any deposit taken for an AST must be protected in a government-approved scheme within 30 days of receipt. The prescribed information must also be served on the tenant within the same period.' },
      { type: 'bullets', items: [
        'Approved schemes: Deposit Protection Service (DPS), MyDeposits, Tenancy Deposit Scheme (TDS)',
        'Failure to protect = tenant can claim 1–3x the deposit amount in court',
        'Possession proceedings can be challenged if the deposit is not properly protected',
        'On renewal, re-protection is not required if the same deposit is carried forward — but check scheme rules',
      ]},
    ],
  },
  {
    id: 'kb-disrepair',
    lastReviewed: 'July 2026',
    title: 'Disrepair Claims — A Complete Guide',
    related: ['kb-tenancy-law', 'kb-damp-mould', 'kb-property-standards'],
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
    related: ['kb-antisocial', 'kb-landlord-relations'],
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
    related: ['kb-void-management', 'kb-landlord-relations'],
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
    lastReviewed: 'July 2026',
    title: 'Property Standards & Compliance',
    related: ['kb-damp-mould', 'kb-energy-mees', 'kb-disrepair'],
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
    related: ['kb-financial-literacy', 'kb-tenant-referencing', 'kb-difficult-conversations'],
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
    lastReviewed: 'July 2026',
    title: 'HMO Licensing & Management',
    related: ['kb-property-standards', 'kb-tenancy-law'],
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
    lastReviewed: 'July 2026',
    title: 'Deposit Protection Schemes',
    related: ['kb-tenancy-law', 'kb-tenant-referencing'],
    subtitle: 'How to protect tenancy deposits correctly — approved schemes, prescribed information, and dispute resolution.',
    icon: '🔒',
    category: 'legal',
    readTime: '8 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'Why Deposit Protection Matters' },
      { type: 'paragraph', text: 'Under the Housing Act 2004, any deposit taken for an assured tenancy in England must be protected in a government-approved tenancy deposit scheme within 30 days of receipt. Failure to comply exposes the landlord to significant financial penalties and restricts their ability to regain possession of the property.' },
      { type: 'callout', variant: 'info', text: 'The Renters\' Rights Act 2025 abolished assured shorthold tenancies (ASTs) — all tenancies in England are now periodic assured tenancies — but the deposit protection rules below are unchanged and continue to apply in full. Proper deposit protection is also court-critical for any Section 8 possession claim.' },
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
      { type: 'paragraph', text: 'If a deposit is not protected or prescribed information is not served, the tenant can apply to the county court. The court must order the landlord to repay the deposit or protect it, and pay compensation of between one and three times the deposit amount. Additionally, any possession proceedings may be challenged if the deposit has not been properly protected and prescribed information served.' },
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
    lastReviewed: 'July 2026',
    title: 'Section 8 Notices — Serving & Grounds for Possession',
    related: ['kb-tenancy-law', 'kb-disrepair', 'kb-antisocial'],
    subtitle: 'The Dwelly SOP for serving Section 8 notices — Form 3A, mandatory and discretionary grounds, compliance audit, and service procedure under the Renters\' Rights Act.',
    icon: '📋',
    category: 'legal',
    readTime: '15 min read',
    difficulty: 'advanced',
    content: [
      { type: 'heading', level: 1, text: 'What Is a Section 8 Notice?' },
      { type: 'paragraph', text: 'A Section 8 notice (S8) is a formal notice seeking possession of a property let on an assured tenancy under the Housing Act 1988, as amended by the Renters\' Rights Act (RRA). It is the primary route to possession in the private rented sector now that Section 21 no-fault eviction has been abolished.' },
      { type: 'paragraph', text: 'Unlike Section 21, a Section 8 notice must specify one or more legal "grounds" — reasons for seeking possession — and the landlord must be able to prove those grounds at court. The notice process, the correct form to use, and the notice periods all changed significantly when the RRA came into force on 1 May 2026.' },
      { type: 'callout', variant: 'warning', text: 'All Section 8 notices served on or after 1 May 2026 must use Form 3A. Notices served on the old Form No. 3 from this date will be invalid. Always confirm you are using the current form before preparing a notice.' },

      { type: 'heading', level: 1, text: 'The Dwelly Process — How We Handle S8 Requests' },
      { type: 'paragraph', text: 'Dwelly serves Section 8 notices on behalf of landlords. This carries legal risk for the business — an invalid notice wastes the landlord\'s time, costs money, and can expose Dwelly to liability. Every notice request follows the SOP without exception. The process is tracked as a Move-Out Job in the Dwelly CRM.' },
      { type: 'callout', variant: 'important', text: 'Verbal instructions from a landlord are not actionable. A landlord instruction must be confirmed in writing by email before any action is taken. All notice requests must be acknowledged to the landlord within 48 hours of receipt.' },
      { type: 'heading', level: 2, text: 'Step 1 — Receive and Log the Request' },
      { type: 'bullets', items: [
        'Confirm written instruction from the landlord by email — verbal instructions alone are not sufficient.',
        'Send the landlord the Notice Request Form and obtain it back completed.',
        'Confirm the landlord has acknowledged the service fee in writing.',
        'Raise a Move-Out Job in the Dwelly CRM. The Move-Out Job ID is the unique reference for the case end-to-end.',
        'Advise the landlord they may alternatively serve the notice themselves or instruct a solicitor.',
        'Acknowledge receipt to the landlord within 48 hours.',
      ]},
      { type: 'heading', level: 2, text: 'Step 2 — MD Approval' },
      { type: 'paragraph', text: 'Before agreeing to serve, the Property Manager must obtain MD approval that the business is prepared to serve on the landlord\'s behalf. The MD will assess the strength of evidence supporting the ground(s) being relied upon and the landlord relationship and history.' },
      { type: 'callout', variant: 'important', text: 'In most cases, and especially where discretionary grounds are being relied upon, the landlord should be advised to seek a solicitor\'s advice on collecting evidence and proceeding with service. MD approval must be recorded by email, attached to the Move-Out Job.' },

      { type: 'heading', level: 1, text: 'Grounds for Possession — Mandatory' },
      { type: 'paragraph', text: 'If a mandatory ground is proved at court, the court must grant possession — it has no discretion. The following mandatory grounds are available under the Housing Act 1988 as amended by the RRA:' },
      { type: 'table', headers: ['Ground', 'Description', 'Key Restriction', 'Notice Period'], rows: [
        ['1', 'Landlord or family member intends to occupy the property', 'Cannot be used within first 12 months of a new tenancy', '4 months'],
        ['1A', 'Landlord intends to sell the property', 'Cannot be used within first 12 months of a new tenancy', '4 months'],
        ['2', 'Sale by mortgagee — lender seeking possession due to missed mortgage payments', 'None', '2 months'],
        ['4A', 'Student HMO — property let to full-time students, needed for new cohort (1 June or 30 September). Advance notice must have been given at tenancy start.', 'HMOs with 3+ tenants and shared facilities only', '4 months'],
        ['6', 'Redevelopment/demolition — landlord intends to carry out substantial works that cannot be done with the tenant in occupation', 'Strict legal tests apply; solicitor involvement strongly recommended', '2 months'],
        ['7', 'Death of tenant — possession sought within 12 months of death where tenancy passed by will or intestacy', 'Must be served within 12 months of death or LL becoming aware', '2 months'],
        ['8', 'Serious rent arrears — at least 3 months\' rent outstanding at time of notice AND at court hearing. If arrears drop below 3 months at hearing, possession will not be granted.', 'Arrears must persist through to hearing', '4 weeks'],
      ]},
      { type: 'callout', variant: 'warning', text: 'Ground 8 requires 3 months\' arrears (not 2) under the RRA. Tenants and their advisers know that reducing arrears below the threshold before the hearing defeats Ground 8. Always consider pleading discretionary Ground 11 (persistent arrears) alongside Ground 8 as a fallback.' },

      { type: 'heading', level: 1, text: 'Grounds for Possession — Discretionary' },
      { type: 'paragraph', text: 'If a discretionary ground is proved, the court may grant possession but will consider whether it is reasonable to do so. These are harder to enforce and require clear, well-evidenced cases.' },
      { type: 'table', headers: ['Ground', 'Description', 'Notice Period'], rows: [
        ['11', 'Persistent arrears — repeated delays with rent even if eventually paid', '4 weeks'],
        ['12', 'Breach of tenancy — tenant has broken one or more terms of the tenancy agreement (not related to rent)', '2 weeks'],
        ['13', 'Deterioration of property — condition has deteriorated due to acts of waste, neglect, or default by the tenant or other occupants', '2 weeks'],
        ['14', 'Anti-social behaviour — tenant or visitor has caused or is likely to cause nuisance/annoyance to neighbours, or has been convicted of using the property for illegal/immoral purposes', 'Immediate — no minimum notice period required'],
        ['14A', 'Domestic violence — one partner has left due to violence/threats and is unlikely to return (generally social landlords only)', '2 weeks'],
        ['17', 'False statement — tenancy was granted as a result of a false statement made knowingly or recklessly by the tenant', '2 weeks'],
      ]},
      { type: 'callout', variant: 'important', text: 'Discretionary grounds are significantly more difficult to enforce. Possession will only be granted where there is a clear, well-evidenced case and the court considers it reasonable. Where discretionary grounds are being relied upon, the landlord should be advised to seek a solicitor\'s advice before service.' },

      { type: 'heading', level: 1, text: 'Compliance Documentation Audit' },
      { type: 'paragraph', text: 'Before serving any S8 notice, the Property Manager must verify that ALL of the following documents were provided to the tenant(s) at the start of the tenancy and that evidence of service exists. This is one of the most critical stages — missing documentation will very likely result in the court deeming the notice invalid.' },
      { type: 'table', headers: ['#', 'Document', 'Evidence Required'], rows: [
        ['1', 'Energy Performance Certificate (EPC)', 'Copy + proof of issue to tenant'],
        ['2', 'Gas Safety Certificate (CP12)', 'Copy + proof of issue to tenant'],
        ['3', 'Electrical Installation Condition Report (EICR)', 'Copy + proof of issue to tenant'],
        ['4', 'Deposit Protection Certificate & Prescribed Information ★ COURT-CRITICAL', 'Certificate + proof served within 30 days of receipt of deposit'],
        ['5', 'Tenancy Agreement (signed)', 'Signed copy on file'],
        ['6', 'APT Information Sheet (RRA requirement)', 'Proof of issue to tenant'],
        ['7', 'Smoke & CO Alarm Compliance Statement', 'Record of compliance'],
        ['8', 'Any renewed/updated compliance documents during tenancy', 'Re-issue confirmations'],
      ]},
      { type: 'callout', variant: 'warning', text: 'DEPOSIT PROTECTION — COURT-CRITICAL: Government guidance expressly flags deposit protection as a matter the court will not overlook when making a possession order. If the deposit was not protected in a government-approved scheme, or the prescribed information was not served within 30 days of receipt, the S8 notice is at substantial risk of being deemed invalid. Verify deposit protection status thoroughly before proceeding.' },
      { type: 'callout', variant: 'info', text: 'The \'How to Rent\' guide is no longer required for S8 notices issued on or after 1 May 2026. It was a Section 21/AST-specific requirement and does not apply to the Form 3A regime.' },
      { type: 'paragraph', text: 'If any document cannot be evidenced as having been provided to the tenant, it must be re-issued and evidence of service obtained before the notice is served. The Property Manager assigned to the Move-Out Job is responsible for re-issuing any missing documentation and uploading evidence to the Move-Out Job.' },

      { type: 'heading', level: 1, text: 'Core Validity Requirements (Form 3A)' },
      { type: 'paragraph', text: 'All Section 8 notices served on or after 1 May 2026 must satisfy all ten of the following core validity requirements. Complete this checklist within the Move-Out Job before escalating to the Team Coordinator:' },
      { type: 'bullets', items: [
        'The tenancy must be one where Section 8 can be used — normally an assured tenancy in the private rented sector in England.',
        'The landlord must use the correct notice: Form 3A (or a document containing the same required information). Form No. 3 is no longer valid.',
        'The notice must name the tenant and the property correctly.',
        'The notice must identify the correct possession ground or grounds.',
        'The notice must include sufficient particulars explaining why those grounds apply.',
        'The landlord must give the correct notice period for the ground relied upon.',
        'The notice must be served correctly in line with the tenancy agreement and general service rules.',
        'The landlord must be able to evidence the ground at court if the tenant does not leave.',
        'The landlord must have protected the tenancy deposit in a government-approved scheme — the court will not overlook this.',
        'The landlord must check any ground-specific restrictions, for example the 12-month restriction on using Grounds 1 and 1A.',
      ]},

      { type: 'heading', level: 1, text: 'Notice Preparation and Approval Chain' },
      { type: 'paragraph', text: 'Once checks are complete, the notice is prepared and reviewed through a three-stage approval chain before it can be served:' },
      { type: 'steps', items: [
        'Property Manager (PM): Drafts the notice using Form 3A, completing all fields accurately — the specific grounds, sufficient particulars explaining why each ground applies, and the correct notice period.',
        'Team Coordinator (TC): Reviews and quality-checks the notice for accuracy and completeness before escalation to MD.',
        'Managing Director (MD): Final review and signature. This must be recorded by email confirmation attached to the Move-Out Job. The notice cannot be served without MD signature.',
      ]},

      { type: 'heading', level: 1, text: 'Pre-Service Tenant Notification' },
      { type: 'paragraph', text: 'Tenants must be made aware that they are going to be served the S8 notice before it is hand-delivered. Notification is by phone call to the tenant AND through the Move-Out Job in the Dwelly CRM (in-app communication).' },
      { type: 'paragraph', text: 'The pre-service communication must include: confirmation that a Section 8 notice is being served; the specific ground(s) on which the notice is based; and the date by which the tenant must vacate the property.' },

      { type: 'heading', level: 1, text: 'Serving the Notice' },
      { type: 'heading', level: 2, text: 'Primary Method — Hand Delivery' },
      { type: 'bullets', items: [
        'Any staff member may attend the property address to deliver the notice in person. The deliverer must be briefed on this SOP.',
        'Complete a Certificate of Service recording the date, time, method of delivery, and the identity of the person serving.',
        'Take photographic evidence showing the notice at the property, clearly displaying date and time metadata.',
        'Any notice served after 4:00 PM will be deemed served the next working day — plan delivery accordingly.',
      ]},
      { type: 'heading', level: 2, text: 'Fallback Service Methods' },
      { type: 'bullets', items: [
        'Posting through the letterbox — with photographic evidence of the notice being posted.',
        'First-class post — adds 2 working days to the deemed date of service. Retain proof of postage.',
        'Email — permitted under Dwelly\'s standard tenancy agreement. Send from a monitored business email and retain the sent record. Confirm the specific tenancy agreement permits email service before relying on this method.',
      ]},
      { type: 'callout', variant: 'info', text: 'If a tenant refuses to accept the notice in person, post it through the letterbox and take photographic evidence. Document the refusal in the Move-Out Job including date, time, and context. Refusal by the tenant does not invalidate a properly served notice.' },

      { type: 'heading', level: 1, text: 'Evidence Pack and Post-Service Actions' },
      { type: 'paragraph', text: 'After service, the Property Manager compiles a complete evidence pack within the Move-Out Job. This must contain:' },
      { type: 'bullets', items: [
        'Copy of the completed S8 notice (signed by MD)',
        'Completed Certificate of Service',
        'Photographic evidence of delivery (with date/time)',
        'Record of pre-service tenant notification (call log + Dwelly message)',
        'All compliance documentation evidence (EPC, CP12, EICR, deposit protection, tenancy agreement, APT sheet, smoke/CO alarms)',
        'Proof of postage (if first-class post used) or email send record (if email service used)',
      ]},
      { type: 'paragraph', text: 'The Move-Out Job is updated with all evidence following service. The landlord has visibility of the Move-Out Job and is notified through the system. The notice expiry date and earliest court application date must be recorded in the Move-Out Job and monitored.' },
      { type: 'callout', variant: 'important', text: 'If the tenant does not vacate after the notice expires, refer the landlord to legal advice to consider court proceedings. Dwelly does not file court proceedings on the landlord\'s behalf.' },
      { type: 'callout', variant: 'warning', text: 'If circumstances change and the notice becomes invalid mid-process — for example, on Ground 8 the arrears drop below the 3-month threshold before the court hearing — notify the landlord immediately, advise them to seek external legal advice, and record the change in circumstances in the Move-Out Job.' },

      { type: 'heading', level: 1, text: 'When to Escalate and Refer to Legal Advice' },
      { type: 'bullets', items: [
        'Where discretionary grounds are being relied upon — refer the landlord to a solicitor rather than serve in-house.',
        'Where the case is complex or high-value — solicitor involvement is the right course.',
        'If there is any doubt about the validity of the grounds, the completeness of compliance documentation, or the correct procedure — STOP and escalate to the Team Coordinator and/or MD.',
        'If the evidence base for the ground is weak — do not serve. An invalid notice wastes time, money, and damages the business\'s credibility.',
        'All staff involved in the notice process must have completed the relevant S8 modules in the Dwelly LMS before handling notice requests.',
      ]},
      { type: 'callout', variant: 'info', text: 'All notice-related documents must be retained for a minimum of 6 years from the date of service. Records are stored within the Move-Out Job in Dwelly CRM. Physical evidence (photos, signed certificates) must be uploaded.' },
    ],
  },

  // ─── Damp, Mould & Condensation ──────────────────────────────────────────────
  {
    id: 'kb-damp-mould',
    lastReviewed: 'July 2026',
    title: 'Damp, Mould & Condensation',
    related: ['kb-property-standards', 'kb-disrepair'],
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
      { type: 'paragraph', text: 'Awaab\'s Law (introduced following the death of two-year-old Awaab Ishak from exposure to mould in his home) imposes strict, legally enforceable timescales on landlords for investigating and remedying serious hazards such as damp and mould. It came into force for social landlords on 27 October 2025, requiring emergency hazards to be made safe within 24 hours and setting fixed timescales for investigating and repairing damp and mould.' },
      { type: 'callout', variant: 'important', text: 'The Renters\' Rights Act 2025 extends Awaab\'s Law to the private rented sector. The detailed PRS timescales are being confirmed through consultation and are expected to take effect from 2027. Even ahead of that, Dwelly applies the process below as best practice — prompt, evidenced action on damp and mould protects tenants and landlords alike.' },
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
    related: ['kb-deposit-schemes', 'kb-landlord-relations'],
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
    related: ['kb-financial-literacy', 'kb-property-standards'],
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
    lastReviewed: 'July 2026',
    title: 'Anti-Social Behaviour Procedures',
    related: ['kb-section-8', 'kb-difficult-conversations'],
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
    lastReviewed: 'July 2026',
    title: 'Energy Performance & MEES Compliance',
    related: ['kb-property-standards', 'kb-hmo-licensing'],
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
      { type: 'heading', level: 1, text: 'Confirmed Tightening — Band C by October 2030' },
      { type: 'paragraph', text: 'On 21 January 2026 the government confirmed that all privately rented homes in England and Wales must reach EPC band C by 1 October 2030. Unlike the earlier proposals — which suggested 2028 for new tenancies and 2030 for existing ones — this is now a single deadline that applies to new and existing tenancies alike. Properties that already meet band C under the current EPC methodology before 1 October 2029 will remain compliant until that EPC expires or is replaced.' },
      { type: 'callout', variant: 'important', text: 'The cost cap for the band C requirement is £10,000 per property (including VAT) over a ten-year period — significantly higher than the £3,500 cap that applies to the current band E standard. Where a property cannot reach band C after spending up to the cap, a "cost cap" exemption can be registered. Factor this investment into landlord advice well ahead of the 2030 deadline.' },
      { type: 'paragraph', text: 'Properties currently rated D or E will need improvement works. The cost of these works should be factored into landlord advice and financial planning now, rather than left until close to the deadline.' },
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
  {
    id: 'kb-contractor-portal',
    title: 'The Contractor Portal — How It Works',
    related: ['kb-property-standards', 'kb-disrepair', 'kb-damp-mould'],
    subtitle: 'How the contractors and providers who carry out our repairs and compliance jobs receive work, book visits, and get paid through the Dwelly provider portal.',
    icon: '🛠️',
    category: 'standards',
    readTime: '7 min read',
    difficulty: 'foundation',
    content: [
      { type: 'heading', level: 1, text: 'Why This Matters to You' },
      { type: 'paragraph', text: 'When you raise a repair or a compliance job, the contractor or provider who carries it out works from their own portal at provider.dwelly.group — separate from the system you use. Knowing how their side works means you can set the right expectations with tenants, understand where a job has got to, and help a contractor who is stuck rather than guessing.' },
      { type: 'callout', variant: 'info', text: 'The provider portal lives at provider.dwelly.group. A contractor\'s username is their email address and their password is sent to them separately. If a contractor can\'t log in, point them at the office rather than trying to reset it yourself.' },

      { type: 'heading', level: 1, text: 'How a Contractor Navigates Their Portal' },
      { type: 'paragraph', text: 'The main navigation gives contractors four places to work from:' },
      { type: 'bullets', items: [
        'Active Jobs — jobs that are currently live and in progress.',
        'Closed Jobs — jobs that have been completed, with the invoice submitted and approved.',
        'Schedule — all their active jobs in a calendar view, to help them plan the day.',
        'Earnings — which jobs they\'ve been paid for and when, along with any upcoming payouts.',
      ]},

      { type: 'heading', level: 1, text: 'Job Statuses — What Each One Means' },
      { type: 'paragraph', text: 'Within Active Jobs, contractors filter by status. These are the same lifecycle stages a job passes through, so they\'re useful shorthand when you\'re chasing progress:' },
      { type: 'table', headers: ['Status', 'What it means'], rows: [
        ['Awaiting Appointment', 'The job doesn\'t yet have a visit date booked in with the tenant.'],
        ['Awaiting Completion', 'A visit is scheduled and the job is waiting for that visit to take place.'],
        ['Awaiting Invoice', 'The work is complete and just needs the contractor\'s invoice and any compliance certificates to close out.'],
        ['Quote Sent', 'A quote from the contractor has gone to the landlord and we\'re waiting on their approval.'],
      ]},

      { type: 'heading', level: 1, text: 'What a Contractor Sees on a Job' },
      { type: 'paragraph', text: 'Opening a job shows a status badge at the top and everything needed to carry out the work, spread across three tabs — job information, tenant contact, and file uploads:' },
      { type: 'bullets', items: [
        'Address — the property address, with a link to open directions in a maps app.',
        'Job ID — the unique reference for the job.',
        'Description — the work requested, as logged from the tenant\'s report.',
        'Last update — when the job was last changed, so the information can be trusted as current.',
        'Visit scheduled — the date and time booked in with the tenant.',
        'Photos — any images attached to the job, so the contractor can see the issue before arriving.',
        'Contact tenant — the tenant\'s details and the quickest way to reach them.',
        'Upload files — where the invoice, certificates, and completed-work photos are added to close the job down.',
      ]},

      { type: 'heading', level: 1, text: 'Contacting the Tenant' },
      { type: 'paragraph', text: 'From the Contact tenant tab, the easiest option is the Call button, which dials the main number and enters the tenant\'s extension automatically. Tenant numbers use an extension, so a contractor can\'t dial the extension on its own — they always call the main number first, then enter the extension when prompted by the voice message.' },
      { type: 'callout', variant: 'tip', text: 'If a tenant says a contractor never called, remember the contractor reaches them through the main office number and extension, not a direct line. The tenant should expect the call to come from the main Dwelly number.' },

      { type: 'heading', level: 1, text: 'Closing a Job — Uploading Files & Getting Paid' },
      { type: 'paragraph', text: 'Once the work is done, the contractor opens the Upload files tab and sends everything needed to close the job and trigger payment:' },
      { type: 'bullets', items: [
        'Invoice — their invoice as a PDF or image.',
        'Certificate — any compliance certificate the job requires, such as a gas safety record (CP12) or an EICR.',
        'Photos — images of the completed work, added against the job.',
      ]},
      { type: 'paragraph', text: 'When everything is attached, the contractor taps Submit documents and the invoice is sent for approval. Documents can also be returned by replying to the original job email.' },

      { type: 'heading', level: 1, text: 'Job Flow — Compliance Visits' },
      { type: 'paragraph', text: 'For compliance jobs (such as a gas safety check or EICR) the flow is straightforward:' },
      { type: 'steps', items: [
        'Get the task and book the visit — the contractor receives a new job email with the task and the tenant\'s contact info, calls the tenant using the main-number-plus-extension method, and agrees a date and time. They don\'t need to notify us of the appointment unless they run into difficulties.',
        'Visit the tenant and issue the certificate — they attend at the agreed time, complete the work, and issue the new certificate.',
        'Send documents and get paid — they return two required documents, the new certificate and their invoice, either by replying to the job email or uploading them to the portal.',
      ]},

      { type: 'heading', level: 1, text: 'Job Flow — Maintenance Visits' },
      { type: 'paragraph', text: 'Maintenance jobs add a decision point: at the property the contractor either fixes the issue there and then, or submits a quote when the work needs approval first.' },
      { type: 'steps', items: [
        'Get the task and book the visit — as with compliance, they receive the job email and arrange a visit with the tenant.',
        'At the visit, decide: quote or fix? — they can Fix It Now only if the work is within the call-out fee, within an approved budget, or they call the office and get same-day approval. Otherwise they inspect, take notes and photos/video of the problem, and move to a quote.',
        'Send the quote and wait — they email one PDF quotation plus the supporting photos/video. We seek landlord approval; if approved, a confirmation email goes back to the contractor to arrange the work visit, and if denied the job is cancelled.',
        'Final documentation and payment — once the repair is complete and approved, the contractor sends all three: their final invoice, proof of works (before-and-after photos or video), and the approved quote. We process this and issue payment according to the approved quote or invoice.',
      ]},
      { type: 'callout', variant: 'important', text: 'A contractor should only fix work on the spot when it\'s within the call-out fee, within an approved budget, or specifically approved by the office that day. Anything beyond that needs a quote and landlord approval before the work goes ahead — which is why some jobs sit at "Quote Sent" while the landlord decides.' },
    ],
  },

  // ─── Advanced edge-case articles ───────────────────────────────────────────
  {
    id: 'kb-abandonment',
    lastReviewed: 'July 2026',
    title: 'Abandonment & Goods Left Behind',
    related: ['kb-illegal-eviction', 'kb-possession-process', 'kb-void-management'],
    subtitle: 'What to do when a tenant seems to have vanished — and why you must never simply change the locks.',
    icon: '🚪',
    category: 'legal',
    readTime: '9 min read',
    difficulty: 'advanced',
    content: [
      { type: 'callout', variant: 'important', text: 'Abandonment is one of the highest-risk situations a property manager will face. Getting it wrong is a criminal offence. If you think a property has been abandoned, escalate to your manager before taking any action — do not change the locks or re-let on your own judgement.' },

      { type: 'heading', level: 1, text: 'What Abandonment Actually Means' },
      { type: 'paragraph', text: 'Abandonment is when a tenant leaves the property permanently before the tenancy has legally ended, with no intention of returning, usually while rent is owed. The problem is that a tenancy does not end just because a tenant appears to have gone. Until the tenancy is legally ended, the tenant keeps the legal right to occupy — even an empty-looking property.' },
      { type: 'warning', variant: 'warning', text: 'There is no "abandonment notice" procedure that lets a landlord automatically take back a property in England. The provisions that would have allowed this were never brought into force. Treating a property as abandoned and re-letting it, when the tenant has not actually given it up, can amount to unlawful eviction.' },

      { type: 'heading', level: 1, text: 'Signs That May Suggest Abandonment' },
      { type: 'paragraph', text: 'None of these on their own prove abandonment. They are triggers to investigate, not to act.' },
      { type: 'bullets', items: [
        'Rent has stopped and contact has gone quiet',
        'Neighbours report not having seen the tenant for some time',
        'Post is piling up, or utilities have been disconnected',
        'The property looks unoccupied on an inspection (curtains gone, fridge emptied, perishables cleared)',
        'Keys have been posted back through the door or handed in',
      ]},
      { type: 'callout', variant: 'tip', text: 'A tenant on holiday, in hospital, in prison, or staying with family is NOT abandoning the property, even for several weeks. Vulnerability, illness, or a family emergency are common innocent explanations — always consider them first.' },

      { type: 'heading', level: 1, text: 'The Safe Investigation Process' },
      { type: 'steps', items: [
        'Log everything from the first suspicion — dates, what was seen, who reported it.',
        'Attempt contact through every channel you hold: phone, email, text, and any next-of-kin or guarantor on file.',
        'Carry out an inspection giving at least 24 hours\' written notice, exactly as you would for any visit.',
        'Check for signs of genuine occupation versus a permanent departure, and photograph the condition and any belongings.',
        'Check whether rent is still being paid by standing order or Universal Credit — payment strongly suggests the tenancy is not abandoned.',
        'Report your findings to your manager, who will decide whether to seek possession through the courts.',
      ]},
      { type: 'callout', variant: 'important', text: 'The legally safe route to recover a genuinely abandoned property is almost always to serve the correct notice and obtain a possession order through the court, the same as any other possession. It feels slow, but it is the only route that protects the landlord and the agency.' },

      { type: 'heading', level: 1, text: 'Goods Left Behind' },
      { type: 'paragraph', text: 'When a tenant leaves belongings behind, the landlord does not automatically own them and cannot simply throw them away or sell them. The landlord becomes an "involuntary bailee" and has duties under the Torts (Interference with Goods) Act 1977.' },
      { type: 'bullets', items: [
        'You must take reasonable care of the goods and make reasonable efforts to return them to the tenant',
        'You must serve written notice on the tenant (at their last known address and any forwarding address) stating that you intend to dispose of the goods and giving a reasonable period to collect them',
        'Only after that notice period expires, and reasonable attempts to trace the tenant have failed, may the goods be sold or disposed of',
        'If goods are sold, any proceeds (after costs) may be set against arrears, but a record must be kept in case the tenant reappears',
      ]},
      { type: 'warning', variant: 'warning', text: 'Disposing of a tenant\'s possessions too quickly is a frequent and expensive mistake. If in doubt, store the goods and take instruction — the cost of storage is far lower than a claim for the value of destroyed belongings.' },
    ],
  },
  {
    id: 'kb-tenant-death',
    lastReviewed: 'July 2026',
    title: 'Death of a Tenant & Succession',
    related: ['kb-tenancy-law', 'kb-abandonment', 'kb-possession-process'],
    subtitle: 'A sensitive and legally technical situation — how a tenancy is dealt with when a tenant dies.',
    icon: '🕊️',
    category: 'legal',
    readTime: '8 min read',
    difficulty: 'advanced',
    content: [
      { type: 'callout', variant: 'important', text: 'This is first and foremost a bereavement. Handle every conversation with care and patience. The legal steps matter, but they never come before treating the family with respect.' },

      { type: 'heading', level: 1, text: 'A Tenancy Does Not Simply End on Death' },
      { type: 'paragraph', text: 'When a sole tenant dies, the tenancy does not automatically end. It passes into the deceased\'s estate and continues until it is lawfully brought to an end. This means rent remains payable from the estate, and the landlord cannot simply take the property back, clear it, or re-let it.' },
      { type: 'warning', variant: 'warning', text: 'Never clear or re-let a property after a tenant\'s death until the tenancy has been properly ended and you have authority from the person dealing with the estate. Clearing a deceased tenant\'s home without authority causes enormous distress and legal exposure.' },

      { type: 'heading', level: 1, text: 'Who You Are Now Dealing With' },
      { type: 'bullets', items: [
        'If there is a will, the executors named in it have authority to deal with the estate (they may need a grant of probate to act fully)',
        'If there is no will, the next of kin can apply to become administrators (through letters of administration)',
        'Until someone has that authority, no individual can legally end the tenancy or give up the property',
        'The Public Trustee can act where there is no one else — relevant for serving notices on the estate',
      ]},
      { type: 'callout', variant: 'tip', text: 'Ask sensitively for a copy of the death certificate and the contact details of the executor or the person handling the estate. Keep everything in writing and route all decisions through them.' },

      { type: 'heading', level: 1, text: 'Ending the Tenancy After a Sole Tenant\'s Death' },
      { type: 'paragraph', text: 'The tenancy is usually ended in one of two ways: the personal representative of the estate surrenders it by agreement, or the landlord ends it by serving notice on the estate. The right route depends on the tenancy type and the circumstances, so this is always a manager or MD decision.' },
      { type: 'paragraph', text: 'Rent continues to fall due from the estate until the tenancy ends. In practice, agreeing an orderly surrender with the executors — a date to hand back the keys once the property is cleared — is often the kindest and cleanest outcome for everyone.' },

      { type: 'heading', level: 1, text: 'Succession — When Someone Has the Right to Stay' },
      { type: 'paragraph', text: 'In some cases another person living in the property has a legal right to take over ("succeed to") the tenancy. Succession rights depend heavily on the tenancy type and who was living there. For assured tenancies, a spouse, civil partner, or someone living with the tenant as a partner who was occupying the property as their only or principal home immediately before the death may have a right to succeed.' },
      { type: 'bullets', items: [
        'Succession usually applies once per tenancy — a tenancy that has already been succeeded to normally cannot be succeeded to again',
        'The person claiming succession must have been living in the property as their main home',
        'Where there is no right of succession, an occupier who remains has no automatic right to stay and possession may be sought',
      ]},
      { type: 'callout', variant: 'important', text: 'Succession claims are legally technical and emotionally charged. If anyone remaining in the property claims a right to stay, do not confirm or deny it — record the claim and escalate to your manager for a proper assessment.' },

      { type: 'heading', level: 1, text: 'Joint Tenants' },
      { type: 'paragraph', text: 'Where there were joint tenants and one dies, the tenancy usually continues automatically in the name of the surviving joint tenant(s) under the principle of survivorship. The survivor keeps all the rights and responsibilities of the tenancy, including the full rent. This normally counts as the one permitted succession.' },
    ],
  },
  {
    id: 'kb-illegal-eviction',
    lastReviewed: 'July 2026',
    title: 'Illegal Eviction & Harassment — What You Must Never Do',
    related: ['kb-possession-process', 'kb-abandonment', 'kb-tenancy-law'],
    subtitle: 'The lines a property manager must never cross, and why they are criminal offences.',
    icon: '🛑',
    category: 'legal',
    readTime: '7 min read',
    difficulty: 'advanced',
    content: [
      { type: 'callout', variant: 'important', text: 'Illegal eviction and harassment are criminal offences under the Protection from Eviction Act 1977. They can lead to prosecution, an unlimited fine, imprisonment, a rent repayment order, and a substantial civil damages claim. This is the single most important legal boundary in your role.' },

      { type: 'heading', level: 1, text: 'Only a Court Bailiff Can Evict' },
      { type: 'paragraph', text: 'A tenant with a residential tenancy can only be lawfully removed by court-appointed bailiffs (or High Court enforcement officers) acting on a possession order and a warrant. No landlord or agent may physically remove a tenant, even if they have no tenancy agreement, are in serious arrears, or the fixed period has long passed.' },
      { type: 'warning', variant: 'warning', text: 'Even if you are certain the tenant has no right to be there, you must still go through the courts. "They stopped paying" or "the tenancy ended months ago" is never a defence to illegal eviction.' },

      { type: 'heading', level: 1, text: 'Things That Are Illegal Eviction' },
      { type: 'bullets', items: [
        'Changing the locks while the tenant still lives there',
        'Removing the tenant\'s belongings to force them out',
        'Physically preventing the tenant from entering',
        'Evicting without a court order and bailiff, even after a notice has expired',
        'Making the tenant leave through threats or intimidation',
      ]},

      { type: 'heading', level: 1, text: 'Things That Are Harassment' },
      { type: 'paragraph', text: 'Harassment is any act likely to interfere with the peace or comfort of a tenant, or persistent withdrawal of services, done to make them leave or give up their rights.' },
      { type: 'bullets', items: [
        'Cutting off or interfering with gas, electricity, or water',
        'Entering the property without permission or proper notice',
        'Turning up repeatedly, or threatening and abusive contact',
        'Refusing to carry out repairs to pressure a tenant into leaving',
        'Removing doors, windows, or the tenant\'s possessions',
        'Anti-social behaviour by the landlord aimed at the tenant',
      ]},

      { type: 'heading', level: 1, text: 'Access and Repairs — The Common Trap' },
      { type: 'paragraph', text: 'A tenant is entitled to "quiet enjoyment" of their home. The landlord\'s right to enter for inspections or repairs does not override this. You must give at least 24 hours\' written notice and enter at a reasonable time, and the tenant can refuse a specific time. Letting yourself in without agreement, even for a genuine repair, can be trespass or harassment.' },
      { type: 'callout', variant: 'tip', text: 'The only time entry without notice is justified is a genuine emergency — for example a serious water leak, gas escape, or fire risk — where there is a real and immediate danger to people or property. Record the emergency and what you found.' },

      { type: 'heading', level: 1, text: 'If a Landlord Asks You to Cross the Line' },
      { type: 'paragraph', text: 'Landlords under financial pressure sometimes ask agents to "just change the locks" or "turn the water off". You must refuse, explain calmly that it is a criminal offence that would expose them to prosecution and a large claim, and record the request. Then escalate to your manager.' },
      { type: 'callout', variant: 'important', text: 'Never carry out an instruction you know to be an illegal eviction, whatever the pressure. Document the request, decline it in writing, and hand it to your manager. Protecting the landlord from themselves is part of the job.' },
    ],
  },
  {
    id: 'kb-subletting',
    lastReviewed: 'July 2026',
    title: 'Subletting, Rent-to-Rent & Unauthorised Occupants',
    related: ['kb-hmo-licensing', 'kb-tenancy-law', 'kb-antisocial'],
    subtitle: 'Spotting and handling situations where the person paying rent is not the person living there.',
    icon: '🔑',
    category: 'legal',
    readTime: '8 min read',
    difficulty: 'advanced',
    content: [
      { type: 'heading', level: 1, text: 'Why This Matters' },
      { type: 'paragraph', text: 'When someone other than your named tenant is living in or profiting from the property, it can breach the tenancy, invalidate insurance, create an unlicensed HMO, and expose the landlord to enforcement. It is often discovered by accident, so knowing the signs is part of protecting your landlord clients.' },

      { type: 'heading', level: 1, text: 'The Difference Between Subletting and Lodgers' },
      { type: 'bullets', items: [
        'Subletting is when the tenant grants someone else the right to occupy all or part of the property, usually creating a separate tenancy',
        'A lodger lives with the tenant and shares living space, and does not have exclusive possession of any part',
        'Most Dwelly-managed tenancies prohibit subletting or parting with possession without the landlord\'s written consent',
        'Unauthorised subletting is a breach of tenancy and, in social housing, can be a criminal offence',
      ]},
      { type: 'callout', variant: 'tip', text: 'If a tenant asks to take in a lodger or add an occupier, do not agree on the spot. Check the tenancy terms, consider Right to Rent for the new occupier, and get the landlord\'s written consent first.' },

      { type: 'heading', level: 1, text: 'Rent-to-Rent Arrangements' },
      { type: 'paragraph', text: 'In a rent-to-rent arrangement, a company or individual rents a property from the landlord and then sub-lets it, often room by room, keeping the difference. Some are legitimate and consented to; many are not. The danger is when it happens without the landlord\'s knowledge — the property quietly becomes a sublet HMO with the landlord none the wiser.' },
      { type: 'warning', variant: 'warning', text: 'Unconsented rent-to-rent can turn a single-family let into an unlicensed HMO overnight, exposing the landlord to fines, a rent repayment order, and invalid insurance — even though the landlord did nothing themselves. Treat any suspicion seriously.' },

      { type: 'heading', level: 1, text: 'Warning Signs to Watch For' },
      { type: 'bullets', items: [
        'Rent paid from a company account or a name that does not match the tenant',
        'Multiple unfamiliar people at the property during inspections',
        'Extra beds, locks fitted to internal doors, or rooms converted to bedrooms',
        'The named tenant is never available and communication comes from someone else',
        'Post arriving for several different names',
        'Neighbours reporting a high turnover of occupants',
      ]},

      { type: 'heading', level: 1, text: 'What To Do If You Suspect It' },
      { type: 'steps', items: [
        'Do not accuse anyone — gather facts calmly and record what you have seen.',
        'Carry out an inspection with proper 24 hours\' written notice and photograph the layout and occupancy.',
        'Check who is actually paying the rent and from what account.',
        'Review the tenancy agreement for the subletting and occupancy clauses.',
        'Report your findings to your manager, who will decide on next steps with the landlord.',
      ]},
      { type: 'callout', variant: 'important', text: 'Breach of a subletting clause does not entitle anyone to change the locks or remove occupants. If possession is needed, it must go through the correct notice and court process like any other breach.' },
    ],
  },
  {
    id: 'kb-vulnerable-tenants',
    lastReviewed: 'July 2026',
    title: 'Vulnerable Tenants, Safeguarding & Mental Capacity',
    related: ['kb-difficult-conversations', 'kb-antisocial', 'kb-illegal-eviction'],
    subtitle: 'Recognising vulnerability, responding to safeguarding concerns, and handling hoarding and domestic abuse.',
    icon: '🤝',
    category: 'communication',
    readTime: '9 min read',
    difficulty: 'advanced',
    content: [
      { type: 'callout', variant: 'important', text: 'If you ever believe someone is in immediate danger, call 999. Safeguarding always comes before process, rent, or property condition.' },

      { type: 'heading', level: 1, text: 'What Vulnerability Looks Like' },
      { type: 'paragraph', text: 'A vulnerable tenant is anyone whose age, health, disability, or circumstances mean they may struggle to manage their tenancy or protect themselves. Vulnerability is often hidden and can be temporary — a bereavement, a mental health crisis, or a new diagnosis can all make someone vulnerable for a time.' },
      { type: 'bullets', items: [
        'Older tenants living alone, or tenants with physical or learning disabilities',
        'Tenants with mental ill health, dementia, or a recent hospital discharge',
        'Tenants experiencing domestic abuse, addiction, or a sudden loss of income',
        'Tenants for whom English is not a first language and who may not understand notices',
      ]},

      { type: 'heading', level: 1, text: 'Adjusting How You Work' },
      { type: 'paragraph', text: 'The Equality Act 2010 requires reasonable adjustments for disabled tenants. In practice, this means adapting your communication and giving people the time and support they need.' },
      { type: 'bullets', items: [
        'Offer information in a format the tenant can understand, and check they have understood',
        'Allow a family member, carer, or advocate to be involved where the tenant wants that',
        'Be patient with missed appointments and slow responses — they may be a symptom, not avoidance',
        'Keep clear, factual records of concerns and the adjustments you have made',
      ]},

      { type: 'heading', level: 1, text: 'Mental Capacity' },
      { type: 'paragraph', text: 'Under the Mental Capacity Act 2005 you must assume a person can make their own decisions unless it is established otherwise. Capacity is decision-specific — a tenant may manage day-to-day but struggle with a complex notice. If you have real doubts that a tenant understands something important, do not simply push the decision through. Involve their representative and raise it with your manager.' },
      { type: 'callout', variant: 'warning', text: 'Serving legal notices on a tenant who may lack capacity to understand them is high-risk and can make the notice challengeable. Flag any capacity concern before notices are served.' },

      { type: 'heading', level: 1, text: 'Hoarding' },
      { type: 'paragraph', text: 'Hoarding is usually a mental health issue, not simply untidiness, and it can create genuine fire and health risks. The instinct to threaten eviction or force a clearance almost always makes things worse.' },
      { type: 'bullets', items: [
        'Record the risk factually with photographs, focusing on fire escape routes, heating, and hygiene',
        'Respond with support first — a safeguarding referral to adult social services is often the right step',
        'Never arrange a forced clearance of someone\'s possessions without authority and specialist support',
        'Escalate to your manager, who will coordinate with the landlord and any support agencies',
      ]},

      { type: 'heading', level: 1, text: 'Domestic Abuse' },
      { type: 'paragraph', text: 'You may be the first person outside the home to notice signs of domestic abuse. Handle any disclosure with absolute discretion — never share it with the alleged perpetrator, including a joint tenant.' },
      { type: 'bullets', items: [
        'Listen, believe, and do not pressure the person to make decisions',
        'Signpost to specialist support and, if there is immediate danger, call 999',
        'Never reveal a survivor\'s new address or contact details to the other party',
        'Record the disclosure securely and share only on a strict need-to-know basis',
      ]},
      { type: 'callout', variant: 'important', text: 'Making a safeguarding referral does not require the tenant\'s consent where there is a serious risk of harm. When in doubt about whether to refer, raise it with your manager the same day — never sit on a safeguarding concern.' },
    ],
  },
  {
    id: 'kb-fire-safety',
    lastReviewed: 'July 2026',
    title: 'Fire Safety & Building Safety Obligations',
    related: ['kb-hmo-licensing', 'kb-property-standards'],
    subtitle: 'Alarms, fire risk assessments, and the extra duties that apply to HMOs and higher-risk buildings.',
    icon: '🔥',
    category: 'standards',
    readTime: '9 min read',
    difficulty: 'advanced',
    content: [
      { type: 'callout', variant: 'important', text: 'Fire safety failures cost lives and carry severe penalties. If you ever find a property without working smoke alarms, or a blocked fire escape in an HMO, treat it as urgent and escalate immediately.' },

      { type: 'heading', level: 1, text: 'Smoke and Carbon Monoxide Alarms' },
      { type: 'paragraph', text: 'Under the Smoke and Carbon Monoxide Alarm (England) Regulations, as amended in 2022, landlords of almost all rented homes must meet minimum alarm standards, and must repair or replace a faulty alarm once told it is not working.' },
      { type: 'bullets', items: [
        'At least one smoke alarm on every storey used as living accommodation',
        'A carbon monoxide alarm in any room used as living accommodation that contains a fixed combustion appliance (such as a gas boiler or a wood burner), excluding gas cookers',
        'Alarms must be working at the start of every new tenancy',
        'Once a tenant reports a faulty alarm, the landlord must repair or replace it as soon as reasonably practicable',
      ]},
      { type: 'callout', variant: 'warning', text: 'Local authorities can issue a remedial notice and fine landlords up to £5,000 for breaching the alarm regulations. Always confirm alarms are present and tested at check-in and log it.' },

      { type: 'heading', level: 1, text: 'HMOs — Higher Fire Standards' },
      { type: 'paragraph', text: 'Houses in multiple occupation carry stricter fire safety duties because more, unrelated people share escape routes. Depending on the size and type, these commonly include:' },
      { type: 'bullets', items: [
        'A mains-wired, interlinked fire alarm system rather than standalone battery units',
        'Fire doors with self-closers on rooms and along escape routes',
        'A clear, protected escape route kept free of obstructions and stored items',
        'Fire-fighting equipment such as extinguishers or fire blankets where required',
        'Emergency lighting in larger or higher-risk HMOs',
      ]},
      { type: 'callout', variant: 'tip', text: 'A blocked escape route in an HMO — bikes in the hallway, a broken self-closer wedged open — is a serious hazard, not a minor snag. Report it the same day.' },

      { type: 'heading', level: 1, text: 'Fire Risk Assessments' },
      { type: 'paragraph', text: 'Where there are common parts shared by more than one household (for example the hallway and stairs of a block of flats, or an HMO), the Regulatory Reform (Fire Safety) Order 2005 requires a suitable fire risk assessment of those common parts, kept up to date. The Fire Safety Act 2021 confirmed this extends to the structure, external walls, and flat entrance doors of buildings containing two or more homes.' },

      { type: 'heading', level: 1, text: 'The Building Safety Act 2022 and Higher-Risk Buildings' },
      { type: 'paragraph', text: 'Following the Grenfell Tower fire, the Building Safety Act 2022 created a stricter regime for "higher-risk buildings" — broadly those at least 18 metres tall or with at least seven storeys and containing two or more residential units. These have a dedicated regulator, an "accountable person", and duties around a safety case and reporting.' },
      { type: 'callout', variant: 'important', text: 'If you manage a flat in a tall block, cladding, building safety, and fire safety in the common parts are usually the responsibility of the freeholder or building management, not your individual landlord. Know who the accountable person is and route resident concerns to them — but never ignore a fire concern because "it is not our part of the building".' },
    ],
  },
  {
    id: 'kb-possession-process',
    lastReviewed: 'July 2026',
    title: 'The Possession Process, End to End',
    related: ['kb-section-8', 'kb-illegal-eviction', 'kb-rent-arrears'],
    subtitle: 'What actually happens from serving notice to a bailiff appointment — and how long each stage takes.',
    icon: '⚖️',
    category: 'legal',
    readTime: '10 min read',
    difficulty: 'advanced',
    content: [
      { type: 'callout', variant: 'info', text: 'This article reflects the position after the Renters\' Rights Act 2025. Section 21 "no-fault" possession and the accelerated procedure that went with it have been abolished. Every possession now runs on a Section 8 ground.' },

      { type: 'heading', level: 1, text: 'The Five Stages' },
      { type: 'paragraph', text: 'Possession is a legal process with clear stages. Skipping or rushing a stage is how landlords lose cases and waste months, so understanding the whole journey helps you set honest expectations.' },
      { type: 'table', headers: ['Stage', 'What happens'], rows: [
        ['1. Notice', 'A valid Section 8 notice is served on the correct form, citing the correct grounds and giving the correct notice period.'],
        ['2. Notice expires', 'The notice period runs. Only once it has expired can a claim be issued. If the tenant leaves or pays off arrears, it may end here.'],
        ['3. Court claim', 'The landlord issues a possession claim at court and pays the court fee. The tenant is served the claim and can defend.'],
        ['4. Hearing & order', 'At a hearing the judge decides whether to grant possession. A possession order usually gives the tenant a date to leave (commonly 14 days).'],
        ['5. Enforcement', 'If the tenant still does not leave, the landlord applies for a warrant and county court bailiffs (or, if transferred, High Court enforcement officers) carry out the eviction.'],
      ]},

      { type: 'heading', level: 1, text: 'Getting the Notice Right' },
      { type: 'paragraph', text: 'A notice with the wrong grounds, wrong dates, or wrong form is invalid, and an invalid notice means starting again from scratch. Before any notice is served, the compliance basics must be in order.' },
      { type: 'bullets', items: [
        'The deposit must be protected and the prescribed information served',
        'The gas safety certificate, EPC, and the government How to Rent guide must have been provided',
        'The grounds cited must genuinely apply and be evidenced',
        'The notice period must match the grounds used',
      ]},
      { type: 'callout', variant: 'warning', text: 'Deposit and document failures are the most common reason possession claims collapse. This is why Dwelly runs a compliance audit before any notice is served, and why notices go out under a strict SOP with MD sign-off.' },

      { type: 'heading', level: 1, text: 'Mandatory Versus Discretionary Grounds' },
      { type: 'paragraph', text: 'On a mandatory ground, if the landlord proves the ground the court must grant possession. On a discretionary ground, the court only grants possession if it also thinks it is reasonable. This is why serious rent arrears (Ground 8, mandatory) are treated differently from persistent late payment (Ground 11, discretionary).' },
      { type: 'callout', variant: 'important', text: 'For Ground 8, the arrears must still meet the three-month threshold both when the notice is served and at the hearing. Tenants often pay the balance down just below the threshold before the hearing — brief the landlord that this can defeat mandatory possession.' },

      { type: 'heading', level: 1, text: 'Bailiffs, Not Landlords' },
      { type: 'paragraph', text: 'Even after a possession order, the landlord cannot evict. If the tenant does not leave by the date on the order, the only lawful next step is a warrant of possession and eviction by court-appointed bailiffs. Taking back the property any other way is an illegal eviction.' },
      { type: 'callout', variant: 'tip', text: 'Set expectations early. From notice to bailiff can realistically take many months, and delays at the court stage are common. A landlord who understands this from day one is far easier to manage than one who expected it done in a fortnight.' },
    ],
  },
  {
    id: 'kb-data-protection',
    lastReviewed: 'July 2026',
    title: 'Data Protection & Confidentiality for Property Managers',
    related: ['kb-tenant-referencing', 'kb-vulnerable-tenants', 'kb-difficult-conversations'],
    subtitle: 'Handling tenant and landlord data lawfully under UK GDPR — and what to do with a subject access request.',
    icon: '🔒',
    category: 'legal',
    readTime: '8 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'Why This Applies to You' },
      { type: 'paragraph', text: 'Property managers handle a lot of personal data: names, contact details, bank details, references, immigration documents, and sometimes sensitive information about health or vulnerability. UK GDPR and the Data Protection Act 2018 govern how that data can be used, and everyone who handles it shares responsibility for keeping it safe.' },

      { type: 'heading', level: 1, text: 'The Core Principles' },
      { type: 'bullets', items: [
        'Only collect data you genuinely need for the tenancy, and use it only for the purpose you collected it',
        'Keep it accurate and up to date',
        'Do not keep it longer than necessary — old applicant references and ID documents should not linger indefinitely',
        'Keep it secure, both digitally and on paper',
        'Be ready to explain what you hold and why',
      ]},
      { type: 'callout', variant: 'warning', text: 'Special category data — anything about health, disability, or a safeguarding concern — needs extra care and a stronger justification. Never share it more widely than the task strictly requires.' },

      { type: 'heading', level: 1, text: 'Sharing Data With Landlords' },
      { type: 'paragraph', text: 'Landlords often want to know everything about their tenants, but you cannot simply pass on whatever you hold. Share what the landlord genuinely needs to make decisions about their property, and hold back detail that is not theirs to see.' },
      { type: 'bullets', items: [
        'A landlord can be told a tenant is in arrears and by how much — that affects their property',
        'A landlord does not need a tenant\'s medical details, safeguarding history, or the reasons behind a vulnerability',
        'Be especially careful never to reveal a domestic-abuse survivor\'s whereabouts to anyone, including a joint tenant or the landlord',
      ]},

      { type: 'heading', level: 1, text: 'Everyday Good Habits' },
      { type: 'bullets', items: [
        'Check you are emailing the right person before attaching anything with personal data',
        'Use blind copy (Bcc) when emailing multiple tenants so you do not expose their addresses to each other',
        'Do not send bank details or ID by insecure channels, and do not store them where they are not needed',
        'Lock your screen and never leave paperwork with personal data on show',
      ]},

      { type: 'heading', level: 1, text: 'Subject Access Requests' },
      { type: 'paragraph', text: 'A tenant, applicant, or landlord has the right to ask for a copy of the personal data you hold about them — a "subject access request" (SAR). It does not have to mention GDPR or use any special wording; a plain email asking for their information counts.' },
      { type: 'bullets', items: [
        'The request must usually be answered within one month, free of charge',
        'You must provide the person\'s own data, but redact information about other people',
        'A SAR often arrives during a dispute — handle it calmly and by the book, not defensively',
      ]},
      { type: 'callout', variant: 'important', text: 'If you receive a subject access request, or if personal data may have been lost, emailed to the wrong person, or otherwise breached, tell your manager the same day. A personal data breach can have to be reported to the Information Commissioner\'s Office within 72 hours, so speed matters.' },
    ],
  },
  {
    id: 'kb-rent-arrears',
    lastReviewed: 'July 2026',
    title: 'Rent Arrears, Universal Credit & Managed Payments',
    related: ['kb-possession-process', 'kb-section-8', 'kb-financial-literacy'],
    subtitle: 'Handling arrears early and constructively, and understanding how benefits affect rent.',
    icon: '💷',
    category: 'finance',
    readTime: '9 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'Act Early, Not Angrily' },
      { type: 'paragraph', text: 'Most arrears are recoverable if they are caught early and handled well. The worst outcomes come from letting arrears drift, then reaching for a notice. A calm, prompt conversation at the first missed payment protects the landlord\'s income and the tenancy far better than a heavy-handed one later.' },
      { type: 'callout', variant: 'tip', text: 'Contact the tenant the moment a payment is missed. Often it is a changed pay date, a card that expired, or a standing order that lapsed — a two-minute call fixes it before it becomes a debt.' },

      { type: 'heading', level: 1, text: 'A Constructive Arrears Conversation' },
      { type: 'steps', items: [
        'Make contact quickly and without accusation — ask what has happened.',
        'Establish whether this is a one-off or a change in circumstances.',
        'Where affordability has changed, discuss a realistic repayment plan on top of ongoing rent.',
        'Confirm any agreement in writing so both sides are clear.',
        'Keep the landlord informed throughout, and record every step.',
      ]},
      { type: 'callout', variant: 'warning', text: 'A repayment plan only works if it is realistic. A plan the tenant cannot actually afford simply delays the problem and can undermine a later possession claim.' },

      { type: 'heading', level: 1, text: 'Universal Credit and the Housing Element' },
      { type: 'paragraph', text: 'Many tenants receive help with rent through the housing element of Universal Credit. By default this is paid to the tenant, monthly in arrears, and the tenant pays the landlord. This design causes two common problems: the wait for the first payment, and the risk that money paid to the tenant is not passed on.' },
      { type: 'bullets', items: [
        'There is a wait of roughly five weeks for a first Universal Credit payment, during which arrears can build through no fault of the tenant',
        'The amount of help is capped by the Local Housing Allowance rate for the area and household size, which may be less than the actual rent',
        'Payment cycles rarely line up neatly with the rent due date',
      ]},

      { type: 'heading', level: 1, text: 'Alternative Payment Arrangements & Managed Payments' },
      { type: 'paragraph', text: 'Where a tenant is struggling, the rent can sometimes be paid directly to the landlord through an Alternative Payment Arrangement — often called a "managed payment to landlord". This can be requested where the tenant is in rent arrears (commonly two months or more) or is assessed as needing support to manage their money.' },
      { type: 'bullets', items: [
        'A managed payment sends the housing element straight to the landlord rather than the tenant',
        'A separate deduction can also be set up to chip away at existing arrears from ongoing benefit',
        'It is requested through the DWP, usually via the UC47 route',
      ]},
      { type: 'callout', variant: 'important', text: 'When calculating arrears for a Ground 8 possession, any rent unpaid only because a Universal Credit payment had not yet arrived is disregarded. Never treat a benefit-delay arrear the same as a tenant simply not paying — flag it and take instruction.' },

      { type: 'heading', level: 1, text: 'When Arrears Become a Possession Matter' },
      { type: 'paragraph', text: 'If genuine efforts to recover arrears fail and the debt is serious, possession may be the right step — but only through the correct notice and court process. Serious arrears (three months or more) can support the mandatory Ground 8. This is always a manager decision, following the compliance checks set out in the possession process article.' },
    ],
  },
  {
    id: 'kb-leasehold-consent',
    lastReviewed: 'July 2026',
    title: 'Leasehold Flats & Consent to Let',
    related: ['kb-landlord-relations', 'kb-fire-safety', 'kb-property-standards'],
    subtitle: 'The extra layer of rules that applies when the landlord owns a flat on a lease, not the freehold.',
    icon: '🏢',
    category: 'landlord',
    readTime: '7 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'Freehold vs Leasehold' },
      { type: 'paragraph', text: 'Most houses are freehold — the owner owns the building and the land outright. Most flats are leasehold — the "owner" actually holds a long lease from a freeholder and must follow the rules in that lease. When your landlord owns a leasehold flat, there is a whole extra rulebook sitting above the tenancy.' },
      { type: 'callout', variant: 'info', text: 'Two separate relationships exist at once: the freeholder and your landlord (governed by the lease), and your landlord and the tenant (governed by the tenancy). Problems arise when one is managed without regard to the other.' },

      { type: 'heading', level: 1, text: 'Consent to Let' },
      { type: 'paragraph', text: 'Many leases restrict or prohibit sub-letting, or require the freeholder\'s written consent before the flat can be let out. A landlord who lets without the required consent may be in breach of their lease, which can carry a fee, a demand to end the tenancy, or in extreme cases forfeiture of the lease.' },
      { type: 'callout', variant: 'tip', text: 'Before taking on a leasehold flat to manage, ask the landlord to confirm the lease allows letting and that any required consent is in place. It is far easier to check at the start than to unravel later.' },

      { type: 'heading', level: 1, text: 'Service Charges and Ground Rent' },
      { type: 'bullets', items: [
        'The leaseholder (your landlord) usually pays a service charge for maintenance of the building and common parts, and sometimes a ground rent',
        'These are the landlord\'s costs, not the tenant\'s — do not pass them on to the tenant unless the tenancy specifically and lawfully provides for it',
        'Major works billed by the freeholder can be large and unexpected; a well-managed landlord budgets for them',
      ]},

      { type: 'heading', level: 1, text: 'Building Rules That Bind the Tenant' },
      { type: 'paragraph', text: 'Leases often contain rules the tenant must follow even though the tenant never sees the lease — for example no pets, no subletting rooms, restrictions on noise, flooring, or use of communal areas. The tenancy should reflect these so the tenant is bound by them.' },
      { type: 'callout', variant: 'warning', text: 'If a tenant breaches a lease rule (for example keeping a pet where the lease forbids it), the freeholder pursues the landlord, and the landlord then has to deal with the tenant. Spotting the conflict early — before a tenant moves a pet in — saves everyone the dispute.' },

      { type: 'heading', level: 1, text: 'Who Fixes What' },
      { type: 'paragraph', text: 'In a leasehold flat, responsibility for repairs is split. The freeholder or building manager typically looks after the structure, roof, and common parts, while your landlord is responsible inside the flat. When a repair sits in the communal area — a leaking roof, a broken entry door, a failed communal boiler — it usually needs to be reported to the building manager, not fixed by your landlord\'s contractor.' },
      { type: 'callout', variant: 'important', text: 'When a tenant reports an issue that turns out to be in the common parts or structure, do not simply instruct a contractor. Identify whose responsibility it is, report it to the freeholder or managing agent, and keep the tenant updated while it is chased.' },
    ],
  },

  // ─── Expert reference library (batch 2) ───
  {
    id: 'kb-renters-rights-act',
    lastReviewed: 'July 2026',
    title: 'The Renters\' Rights Act 2025 — What Changed',
    related: ['kb-tenancy-law', 'kb-section-8', 'kb-possession-process'],
    subtitle: 'The biggest reform of the private rented sector in a generation — the new rules every property manager must know.',
    icon: '⚖️',
    category: 'legal',
    readTime: '11 min read',
    difficulty: 'advanced',
    content: [
      { type: 'callout', variant: 'important', text: 'The Renters\' Rights Act received Royal Assent on 27 October 2025. The headline change — the abolition of Section 21 "no-fault" evictions and the move to periodic tenancies — takes effect from 1 May 2026. Treat every new tenancy as if the new regime already applies.' },

      { type: 'heading', level: 1, text: 'The End of Section 21' },
      { type: 'paragraph', text: 'The Act abolishes Section 21 "no-fault" possession. A landlord can no longer end a tenancy simply by giving two months\' notice with no reason. All possession now runs through Section 8 grounds — the landlord must have, and prove, a valid ground. This is the single most important change: it shifts the whole sector from "notice on demand" to "reason required".' },
      { type: 'warning', variant: 'warning', text: 'Never tell a landlord they can get their property back "just by serving a Section 21". That route is gone. Possession requires a valid Section 8 ground and, if contested, a court order.' },

      { type: 'heading', level: 1, text: 'Periodic Tenancies by Default' },
      { type: 'paragraph', text: 'Fixed terms for assured tenancies are abolished. Every assured tenancy becomes periodic (rolling), running month to month. Tenants can leave by giving two months\' notice at any point; landlords can only end the tenancy using a valid ground. There is no more "the fixed term ends in June so they must go" — the tenancy simply continues until lawfully ended.' },

      { type: 'heading', level: 1, text: 'Changes to the Grounds for Possession' },
      { type: 'bullets', items: [
        'Ground 8 (serious rent arrears): the threshold rises to three months\' arrears (from two), and the notice period rises to four weeks — making it harder to evict for arrears',
        'New/expanded grounds for a landlord who genuinely wants to sell or move in a family member, but with longer notice and protected periods early in the tenancy',
        'A landlord cannot use the "moving in / selling" grounds within the first 12 months of a tenancy, and cannot re-let for 12 months after using them',
      ]},

      { type: 'heading', level: 1, text: 'Rent Increases' },
      { type: 'paragraph', text: 'Rent can be increased only once a year, using the statutory Section 13 process (a prescribed form giving at least two months\' notice). Rent-review clauses that bypass this are no longer effective. A tenant who thinks the increase is above market rent can challenge it at the First-tier Tribunal, which cannot set a rent higher than the landlord proposed.' },

      { type: 'heading', level: 1, text: 'Other Key Reforms' },
      { type: 'bullets', items: [
        'Tenants gain a right to request a pet, which the landlord cannot unreasonably refuse (see the Pets article)',
        'A ban on rental bidding — landlords and agents must advertise an asking rent and cannot invite offers above it',
        'A new Private Rented Sector Ombudsman that all landlords must join, and a Private Rented Sector Database landlords must register on',
        'A Decent Homes Standard and "Awaab\'s Law" repair timescales extended to the private sector',
        'It becomes unlawful to discriminate against tenants on benefits ("No DSS") or with children',
      ]},
      { type: 'callout', variant: 'important', text: 'When advising a landlord, always frame possession, rent increases, and pet requests through the new rules. If a landlord asks for something the Act now prohibits, explain the position calmly and escalate to your manager or the MD rather than agreeing to a non-compliant approach.' },
    ],
  },
  {
    id: 'kb-deposit-disputes',
    lastReviewed: 'July 2026',
    title: 'Winning (and Losing) Deposit Disputes',
    related: ['kb-deposit-schemes', 'kb-inventories', 'kb-property-standards'],
    subtitle: 'How adjudicators actually decide deposit disputes — and how to build a claim that stands up.',
    icon: '⚖️',
    category: 'finance',
    readTime: '9 min read',
    difficulty: 'advanced',
    content: [
      { type: 'heading', level: 1, text: 'The Burden of Proof Is on the Landlord' },
      { type: 'paragraph', text: 'In every deposit scheme\'s adjudication, the burden of proof sits with the landlord, not the tenant. It is for the landlord to prove the deductions are justified — the tenant does not have to prove they are not. Adjudicators decide on the papers alone, so a claim is only as strong as the evidence submitted.' },
      { type: 'callout', variant: 'important', text: 'Adjudication is evidence-only. There is no hearing, no chance to explain later. Everything the adjudicator needs must be in the file: check-in and check-out inventories, dated photos, invoices, and the tenancy agreement.' },

      { type: 'heading', level: 1, text: 'What Adjudicators Will and Won\'t Award' },
      { type: 'bullets', items: [
        'Fair wear and tear is NEVER chargeable — an adjudicator will strip out any deduction that is really just normal ageing',
        'Betterment is not allowed — a landlord cannot charge to replace a worn item with a brand-new one; only the used value can be claimed',
        'Cleaning can be claimed only to return the property to its check-in standard, evidenced by the check-in and check-out reports',
        'Damage beyond wear and tear (burns, stains, breakages) can be claimed, but usually apportioned for the age and expected life of the item',
      ]},
      { type: 'callout', variant: 'tip', text: 'A carpet with a ten-year life that is stained after eight years has almost no claimable value left — the adjudicator awards the residual value, not a new carpet.' },

      { type: 'heading', level: 1, text: 'The Evidence That Wins' },
      { type: 'steps', items: [
        'A detailed, tenant-signed check-in inventory with dated photographs of every room and its condition.',
        'A check-out report in the same format, so the two can be compared side by side.',
        'Clear, close-up dated photographs of each specific item of damage or dirt claimed for.',
        'Invoices or quotes for the actual remedial work — not round-number estimates.',
        'A short written statement linking each deduction to the evidence and explaining any apportionment.',
      ]},

      { type: 'heading', level: 1, text: 'The Most Common Reasons Landlords Lose' },
      { type: 'bullets', items: [
        'No check-in inventory, or one the tenant never signed — nothing to compare against',
        'Charging for wear and tear or full replacement instead of apportioned value',
        'Vague photos with no date, or none at all',
        'Round-sum "cleaning £150" deductions with no invoice',
        'Failing to protect the deposit or serve prescribed information — which can sink the whole claim and trigger a penalty',
      ]},
      { type: 'callout', variant: 'important', text: 'If a deposit was not protected in time or the prescribed information was not served, do not pursue deductions without escalating first — the tenant may have a counterclaim worth up to three times the deposit.' },
    ],
  },
  {
    id: 'kb-gas-electrical-safety',
    lastReviewed: 'July 2026',
    title: 'Gas & Electrical Safety Compliance',
    related: ['kb-fire-safety', 'kb-property-standards', 'kb-hmo-licensing'],
    subtitle: 'The non-negotiable safety certificates — CP12 and EICR — and what happens when they lapse.',
    icon: '🔌',
    category: 'standards',
    readTime: '8 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'callout', variant: 'important', text: 'Gas and electrical safety are life-safety obligations. A lapsed certificate is not an administrative slip — it is a legal breach that can carry criminal liability and, in the worst case, follows a death. These never slide.' },

      { type: 'heading', level: 1, text: 'Gas Safety (the CP12)' },
      { type: 'bullets', items: [
        'Every gas appliance and flue must be checked every 12 months by a Gas Safe registered engineer',
        'The record (the CP12, or Gas Safety Record) must be given to existing tenants within 28 days of the check, and to new tenants before they move in',
        'Records must be kept for at least two years',
        'Only a Gas Safe registered engineer may carry out the work — always verify the registration',
      ]},
      { type: 'warning', variant: 'warning', text: 'Breaching the Gas Safety (Installation and Use) Regulations 1998 is a criminal offence enforced by the HSE, carrying unlimited fines and, in serious cases, imprisonment. There is no "grace period".' },

      { type: 'heading', level: 1, text: 'Electrical Safety (the EICR)' },
      { type: 'bullets', items: [
        'An Electrical Installation Condition Report (EICR) is required at least every five years, carried out by a qualified and competent electrician',
        'A copy must be supplied to tenants within 28 days and to new tenants before they move in, and to the local authority within 7 days on request',
        'Any code C1 (danger present) or C2 (potentially dangerous) fault must be remedied within 28 days (or sooner if specified), with written confirmation obtained',
        'Code FI means further investigation is required and must also be actioned',
      ]},
      { type: 'callout', variant: 'tip', text: 'C1 = immediate danger, act now. C2 = potentially dangerous, fix within 28 days. C3 = improvement recommended (not compulsory). FI = further investigation needed. Knowing these codes lets you triage an EICR the moment it lands.' },

      { type: 'heading', level: 1, text: 'Portable Appliances and Smoke/CO Alarms' },
      { type: 'paragraph', text: 'In furnished lets, portable appliances supplied by the landlord should be maintained and PAT testing is good practice. Separately, a working smoke alarm is required on every storey, and a carbon monoxide alarm in every room with a fixed combustion appliance (excluding gas cookers), tested at the start of each tenancy.' },
      { type: 'callout', variant: 'important', text: 'If a landlord resists paying for a required certificate, do not let the property or renew without it. Log the instruction, explain the legal exposure in writing, and escalate — the agency shares liability for knowingly managing a non-compliant let.' },
    ],
  },
  {
    id: 'kb-inventories',
    lastReviewed: 'July 2026',
    title: 'Inventories, Check-In & Check-Out',
    related: ['kb-deposit-disputes', 'kb-property-standards', 'move-outs'],
    subtitle: 'The single most valuable document in a tenancy — how to build one that protects everyone.',
    icon: '📋',
    category: 'standards',
    readTime: '7 min read',
    difficulty: 'foundation',
    content: [
      { type: 'callout', variant: 'important', text: 'The inventory is the backbone of every deposit claim. A tenancy with a strong check-in report and matching check-out is almost impossible to lose at adjudication; one without is almost impossible to win.' },

      { type: 'heading', level: 1, text: 'What a Good Inventory Contains' },
      { type: 'bullets', items: [
        'A room-by-room description of condition, cleanliness, fixtures, fittings and contents',
        'Dated, high-resolution photographs (and ideally video) of every room and any existing damage',
        'Meter readings and the number of keys handed over',
        'Smoke and CO alarm test confirmation',
        'The tenant\'s signature, or evidence the tenant was given a set period to comment and did not dispute it',
      ]},

      { type: 'heading', level: 1, text: 'Check-In: Setting the Baseline' },
      { type: 'paragraph', text: 'The check-in captures the property\'s exact condition at the start of the tenancy. Give the tenant the report at move-in and a reasonable window (typically 7 days) to note anything they disagree with. A signed, un-disputed check-in is the fixed point every future comparison is made against.' },

      { type: 'heading', level: 1, text: 'Check-Out: The Comparison' },
      { type: 'steps', items: [
        'Carry out the check-out in the same room-by-room order and format as the check-in.',
        'Photograph every area again, matching the check-in angles so differences are obvious.',
        'Take closing meter readings and confirm all keys are returned.',
        'Identify differences and separate genuine damage from fair wear and tear.',
        'Only then propose any deductions, each tied to a specific check-in/check-out comparison and a quote.',
      ]},
      { type: 'callout', variant: 'tip', text: 'Photos are only useful if they are dated and clearly attributable to the property. A phone with the date stamp on, or a report platform that embeds metadata, turns a "he said / she said" dispute into a decided one.' },

      { type: 'heading', level: 1, text: 'Fair Wear and Tear' },
      { type: 'paragraph', text: 'Wear and tear is the natural deterioration expected from reasonable use over the length of the tenancy, taking into account the number and age of occupiers. A family of four in a property for five years will reasonably wear carpets and paintwork far more than a single tenant for six months. You cannot charge to put right what is simply ageing.' },
    ],
  },
  {
    id: 'kb-notice-serving',
    lastReviewed: 'July 2026',
    title: 'Serving Notices Correctly',
    related: ['kb-section-8', 'kb-possession-process', 'kb-tenancy-law'],
    subtitle: 'A notice served the wrong way is worthless — how to get service right so it stands up in court.',
    icon: '✉️',
    category: 'legal',
    readTime: '7 min read',
    difficulty: 'advanced',
    content: [
      { type: 'callout', variant: 'important', text: 'The most common reason possession claims collapse is defective service — the right notice, served the wrong way, or with the wrong dates. A judge will throw out a technically defective notice however serious the underlying problem.' },

      { type: 'heading', level: 1, text: 'Right Form, Right Grounds, Right Dates' },
      { type: 'bullets', items: [
        'Use the current prescribed form — an out-of-date form can invalidate the notice',
        'Cite the correct grounds and give the correct minimum notice period for those grounds',
        'Calculate dates carefully — an expiry date that is even a day short makes the notice invalid',
        'Name every tenant on the tenancy — a notice that omits a joint tenant may be defective',
      ]},

      { type: 'heading', level: 1, text: 'Methods of Service and "Deemed Service"' },
      { type: 'paragraph', text: 'How you serve matters as much as what you serve. The tenancy agreement usually sets out permitted service methods and when service is "deemed" to have happened. Common methods include personal delivery, first-class post, and leaving it at the property — each with different deemed-service timings that affect the notice expiry date.' },
      { type: 'bullets', items: [
        'First-class post is usually deemed served two working days after posting — build that into the expiry date',
        'Hand delivery through the letterbox is usually deemed served the same or next day',
        'Email is only valid service if the tenancy agreement expressly allows it and the tenant agreed',
      ]},
      { type: 'callout', variant: 'tip', text: 'Always keep proof of service — a certificate of service, a free-post proof of posting from the Post Office, a photo of the notice through the door with a date, or a process server\'s statement. Courts want to see how and when service happened.' },

      { type: 'heading', level: 1, text: 'Before You Serve' },
      { type: 'steps', items: [
        'Confirm any pre-conditions are met (for example the deposit is protected and prescribed information served, or arrears meet the ground threshold).',
        'Draft the notice on the current prescribed form with the correct grounds.',
        'Have your manager or a solicitor check the form and dates before it goes out.',
        'Serve by a permitted method and record exactly how and when.',
        'Diarise the expiry date and the earliest date court proceedings can begin.',
      ]},
      { type: 'callout', variant: 'important', text: 'Never serve a possession notice on your own initiative. Possession is a legal process with serious consequences — always work under your manager\'s or a solicitor\'s instruction.' },
    ],
  },
  {
    id: 'kb-guarantors',
    lastReviewed: 'July 2026',
    title: 'Guarantors & Guarantee Agreements',
    related: ['kb-tenant-referencing', 'kb-rent-arrears', 'kb-tenancy-law'],
    subtitle: 'When and how to use a guarantor — and the drafting traps that make guarantees unenforceable.',
    icon: '🤝',
    category: 'legal',
    readTime: '6 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'What a Guarantor Actually Promises' },
      { type: 'paragraph', text: 'A guarantor agrees to cover the tenant\'s obligations — usually unpaid rent and the cost of damage — if the tenant fails to. It is a way of accepting a tenant who is a slightly higher risk (a student, someone new to work, or a tenant whose income falls just short on referencing) while protecting the landlord.' },
      { type: 'callout', variant: 'tip', text: 'A guarantor is only as good as their means and the enforceability of the paperwork. Reference the guarantor too — a guarantee from someone who cannot pay is worthless.' },

      { type: 'heading', level: 1, text: 'Making the Guarantee Enforceable' },
      { type: 'bullets', items: [
        'A guarantee must be in writing and signed by the guarantor (a verbal promise is not enforceable)',
        'The guarantor should receive and acknowledge a copy of the tenancy agreement they are guaranteeing',
        'The document must be clear on what is guaranteed (rent only, or rent and damage) and for how long',
        'The guarantor should sign before the tenancy starts, for good consideration',
      ]},

      { type: 'heading', level: 1, text: 'The Renewal and Periodic Trap' },
      { type: 'paragraph', text: 'A guarantee written to cover only the fixed term may fall away when the tenancy becomes periodic or is renewed. With tenancies now periodic by default, the guarantee wording must expressly extend to the tenancy "as extended, renewed or continued as a statutory periodic tenancy" — otherwise the landlord loses cover exactly when they may need it most.' },
      { type: 'callout', variant: 'warning', text: 'Check the guarantee wording covers the periodic continuation. A guarantee that ends when the fixed term ends leaves the landlord exposed for every month afterwards.' },

      { type: 'heading', level: 1, text: 'Joint Tenants and Guarantors' },
      { type: 'paragraph', text: 'Where several tenants share, be clear whether a guarantor is guaranteeing the whole rent (joint and several) or only "their" tenant\'s share. In a joint and several tenancy the rent is a single obligation, so a guarantor may be liable for the full rent, not a fraction — this must be spelled out and explained so nobody signs up to more than they realise.' },
    ],
  },
  {
    id: 'kb-pets',
    lastReviewed: 'July 2026',
    title: 'Pet Requests Under the New Rules',
    related: ['kb-renters-rights-act', 'kb-tenancy-law', 'kb-leasehold-consent'],
    subtitle: 'Tenants now have a right to request a pet — how to handle it fairly and lawfully.',
    icon: '🐾',
    category: 'communication',
    readTime: '6 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'callout', variant: 'important', text: 'Under the Renters\' Rights Act, a tenant has the right to request to keep a pet, and the landlord cannot unreasonably refuse. A blanket "no pets" policy is no longer lawful — each request must be considered on its merits.' },

      { type: 'heading', level: 1, text: 'Handling a Request' },
      { type: 'steps', items: [
        'Ask the tenant to put the request in writing with details of the pet (type, breed, size, number).',
        'Respond within the statutory timescale — a request left unanswered can be treated as consent.',
        'Consider it genuinely: is refusal actually reasonable for this property and this pet?',
        'If consenting, confirm in writing and set out any reasonable conditions.',
        'If refusing, give a clear, specific, lawful reason — not a blanket policy.',
      ]},

      { type: 'heading', level: 1, text: 'What Counts as a Reasonable Refusal' },
      { type: 'bullets', items: [
        'The lease of a flat expressly forbids pets and the freeholder will not consent',
        'The size or type of animal is genuinely unsuitable for the property (a large dog in a small studio with no outdoor access)',
        'There is clear evidence a specific request would breach other obligations',
      ]},
      { type: 'callout', variant: 'warning', text: '"I just don\'t want pets in my property" is not a reasonable refusal. If a landlord instructs you to refuse without a proper reason, explain the new position and escalate rather than sending an unlawful refusal.' },

      { type: 'heading', level: 1, text: 'Pet Damage and Insurance' },
      { type: 'paragraph', text: 'The Act allows a landlord to require the tenant to hold pet damage insurance, or to cover the landlord\'s reasonable cost of such insurance, as a condition of consent. A landlord cannot demand a higher deposit for a pet — the deposit cap still applies — so pet insurance is the intended route to manage the risk.' },
      { type: 'callout', variant: 'tip', text: 'When a landlord worries about pet damage, point them to pet damage insurance as the lawful tool, and make sure the check-in inventory is thorough so any genuine damage can be evidenced at check-out.' },
    ],
  },
  {
    id: 'kb-complaints-redress',
    lastReviewed: 'July 2026',
    title: 'Complaints Handling & Redress Schemes',
    related: ['kb-difficult-conversations', 'kb-renters-rights-act', 'kb-data-protection'],
    subtitle: 'How to handle a complaint well — and the ombudsman schemes that sit behind you if you don\'t.',
    icon: '📣',
    category: 'communication',
    readTime: '6 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'Why Complaints Handling Matters' },
      { type: 'paragraph', text: 'Letting and managing agents in England must belong to a government-approved redress scheme. A tenant or landlord who is unhappy and cannot resolve it with the agent can escalate to the ombudsman, who can direct the agent to apologise, take action, or pay compensation. Handling complaints well keeps disputes out of the ombudsman and out of court.' },
      { type: 'callout', variant: 'info', text: 'The Renters\' Rights Act extends mandatory redress to private landlords too, through a new Private Rented Sector Ombudsman — so both agents and landlords will be answerable to an independent scheme.' },

      { type: 'heading', level: 1, text: 'A Good Complaints Process' },
      { type: 'steps', items: [
        'Acknowledge the complaint promptly and in writing, so the person knows they have been heard.',
        'Log it centrally with dates and all correspondence.',
        'Investigate fairly, gathering the facts before responding.',
        'Respond within your published complaints timescale with a clear outcome and reasons.',
        'Explain the next step — escalation to a senior manager, then to the redress scheme — if they remain unhappy.',
      ]},

      { type: 'heading', level: 1, text: 'De-escalation' },
      { type: 'bullets', items: [
        'Respond to the emotion first ("I can see how frustrating this has been") before the facts',
        'Never go silent — most complaints escalate because of no reply, not because of the original issue',
        'Put agreed actions and timescales in writing so expectations are shared',
        'Know when to hand a complaint up — a threat of legal action, a safety issue, or an allegation against a colleague should go to your manager immediately',
      ]},
      { type: 'callout', variant: 'important', text: 'If a complaint alleges discrimination, harassment, a serious safety failure, or threatens legal or ombudsman action, escalate to your manager or the MD at once — these carry legal and reputational risk beyond a routine complaint.' },
    ],
  },
  {
    id: 'kb-client-money',
    lastReviewed: 'July 2026',
    title: 'Client Money Protection & AML',
    related: ['kb-financial-literacy', 'kb-landlord-relations', 'kb-data-protection'],
    subtitle: 'Handling other people\'s money safely — client accounts, CMP, and anti-money-laundering duties.',
    icon: '🏦',
    category: 'finance',
    readTime: '7 min read',
    difficulty: 'advanced',
    content: [
      { type: 'callout', variant: 'important', text: 'Rent, deposits and float belong to landlords and tenants — never to the agency. Mishandling client money is one of the fastest ways for an agent to lose their business and face prosecution.' },

      { type: 'heading', level: 1, text: 'Client Accounts and CMP' },
      { type: 'bullets', items: [
        'Client money must be held in a designated client account, ringfenced and separate from the agency\'s own trading account',
        'Letting agents in England must belong to a government-approved Client Money Protection (CMP) scheme, which reimburses clients if money is lost or misappropriated',
        'Proof of CMP membership must be displayed and available to clients on request',
        'Client money must be reconciled regularly and never used to fund the agency\'s own costs',
      ]},
      { type: 'callout', variant: 'warning', text: 'Never move money between a client account and the office account to smooth cashflow, even temporarily. It is a serious breach regardless of intention to repay.' },

      { type: 'heading', level: 1, text: 'Anti-Money-Laundering (AML)' },
      { type: 'paragraph', text: 'Letting agencies whose lettings meet the high-value threshold, and all sales agencies, fall within the Money Laundering Regulations and must register with HMRC. AML duties mean verifying the identity of the parties — including the landlord and the source of a property — and reporting suspicious activity.' },
      { type: 'bullets', items: [
        'Carry out identity checks (Know Your Customer) on landlords and, where required, tenants',
        'Be alert to red flags: reluctance to provide ID, unusual payment routes, third parties paying, or requests to route money oddly',
        'Report suspicions to your firm\'s Money Laundering Reporting Officer — never "tip off" the person you have reported',
      ]},
      { type: 'callout', variant: 'important', text: 'If something about a payment or a landlord feels wrong, do not confront the person and do not ignore it — report it internally to your MLRO and let the process handle it. Tipping off is itself a criminal offence.' },
    ],
  },
  {
    id: 'kb-service-charges',
    lastReviewed: 'July 2026',
    title: 'Service Charges & Section 20 Consultation',
    related: ['kb-leasehold-consent', 'kb-financial-literacy', 'kb-property-standards'],
    subtitle: 'How service charges work in leasehold blocks — and the consultation landlords must not skip.',
    icon: '🧾',
    category: 'landlord',
    readTime: '7 min read',
    difficulty: 'advanced',
    content: [
      { type: 'heading', level: 1, text: 'What Service Charges Cover' },
      { type: 'paragraph', text: 'In a leasehold block, leaseholders pay a service charge towards the cost of maintaining the building — communal repairs, cleaning, lighting, buildings insurance, and management. The charge must be reasonable, and leaseholders have statutory rights to challenge charges they believe are unreasonable at the First-tier Tribunal.' },
      { type: 'callout', variant: 'info', text: 'Where your landlord is a leaseholder letting their flat, the service charge is the landlord\'s cost — not the tenant\'s. Do not pass block service charges to the tenant unless the tenancy lawfully and specifically provides for it.' },

      { type: 'heading', level: 1, text: 'Section 20 Consultation' },
      { type: 'paragraph', text: 'Before a freeholder or managing agent carries out major works costing any single leaseholder more than £250, or enters a long-term agreement costing a leaseholder more than £100 a year, they must follow the Section 20 consultation procedure under the Landlord and Tenant Act 1985.' },
      { type: 'bullets', items: [
        'Serve a Notice of Intention describing the works and inviting observations',
        'Obtain estimates and serve a Notice of Estimates, again inviting observations',
        'Have regard to leaseholders\' observations before proceeding',
        'Failure to consult properly caps recoverable costs at £250 per leaseholder for works, or £100 a year for agreements — a huge shortfall on major works',
      ]},
      { type: 'callout', variant: 'warning', text: 'If a landlord client receives a large works bill, check whether the freeholder actually consulted under Section 20. A missed consultation can dramatically reduce what the leaseholder legally has to pay.' },

      { type: 'heading', level: 1, text: 'Reserve Funds and Year-End Accounts' },
      { type: 'paragraph', text: 'Many leases require contributions to a reserve (sinking) fund to smooth the cost of future major works like a new roof. Leaseholders are entitled to a summary of service charge accounts and to inspect the underlying invoices. A well-advised landlord budgets for both the annual charge and periodic reserve-fund demands.' },
    ],
  },
  {
    id: 'kb-court-money-claims',
    lastReviewed: 'July 2026',
    title: 'Recovering Money Through the Courts',
    related: ['kb-rent-arrears', 'kb-possession-process', 'kb-financial-literacy'],
    subtitle: 'When arrears or damage can\'t be recovered any other way — the money-claim route, CCJs and enforcement.',
    icon: '⚖️',
    category: 'legal',
    readTime: '8 min read',
    difficulty: 'advanced',
    content: [
      { type: 'heading', level: 1, text: 'Possession vs a Money Judgment' },
      { type: 'paragraph', text: 'Getting the property back and getting the money owed are two different things. A possession order ends the tenant\'s right to occupy; it does not, by itself, make the tenant pay. To recover arrears or damage as a debt you usually need a money judgment — which can be claimed in the possession proceedings or separately.' },
      { type: 'callout', variant: 'tip', text: 'A money judgment is only worth pursuing if the tenant can actually pay. Chasing a judgment against someone with no income or assets can cost more than it recovers — weigh the prospects before spending on court fees.' },

      { type: 'heading', level: 1, text: 'The Pre-Action Protocol' },
      { type: 'paragraph', text: 'Before issuing a money claim, the court expects the parties to follow the pre-action protocol for debt claims — sending a clear letter of claim setting out what is owed and how it is calculated, and giving the debtor a reasonable chance to respond or propose payment. Skipping this can lead to costs penalties even if you win.' },

      { type: 'heading', level: 1, text: 'Making the Claim' },
      { type: 'steps', items: [
        'Send a compliant letter of claim and allow time to respond.',
        'Issue the claim (Money Claim Online for straightforward money claims) with the sum, interest and a clear breakdown.',
        'If the debtor does not respond, apply for judgment in default; if they defend, the claim proceeds to a hearing.',
        'On success the court makes a County Court Judgment (CCJ) for the amount plus costs and interest.',
      ]},

      { type: 'heading', level: 1, text: 'Enforcing a Judgment' },
      { type: 'bullets', items: [
        'An attachment of earnings order takes deductions directly from the debtor\'s wages',
        'A warrant of control instructs enforcement agents to seize goods',
        'A charging order secures the debt against any property the debtor owns',
        'A third-party debt order freezes and takes money from the debtor\'s bank account',
      ]},
      { type: 'callout', variant: 'important', text: 'Court action is a last resort and always runs under your manager\'s or a solicitor\'s instruction. Keep meticulous records of arrears, correspondence and the tenancy from day one — enforcement depends on being able to prove the debt.' },
    ],
  },
  {
    id: 'kb-overseas-landlords',
    lastReviewed: 'July 2026',
    title: 'Overseas Landlords & the NRL Scheme',
    related: ['kb-landlord-relations', 'kb-financial-literacy', 'kb-client-money'],
    subtitle: 'The tax obligations that kick in when a landlord lives abroad — and the agent\'s role in them.',
    icon: '🌍',
    category: 'finance',
    readTime: '6 min read',
    difficulty: 'advanced',
    content: [
      { type: 'heading', level: 1, text: 'Who Is a Non-Resident Landlord' },
      { type: 'paragraph', text: 'A non-resident landlord is one whose usual place of abode is outside the UK for more than six months — regardless of nationality or tax residence. When a landlord who manages their own lettings moves abroad, they can move into the scheme mid-tenancy, so it is not just a new-instruction question.' },

      { type: 'heading', level: 1, text: 'The Agent\'s Withholding Duty' },
      { type: 'paragraph', text: 'Under the Non-Resident Landlord Scheme, a letting agent collecting rent for a non-resident landlord must deduct basic-rate tax from the rental income (after allowable expenses) and pay it to HMRC quarterly — unless HMRC has authorised the landlord to receive rent gross.' },
      { type: 'bullets', items: [
        'The landlord can apply to HMRC for approval to receive rent without tax deducted (usually where their UK tax affairs are up to date)',
        'Approval is given by HMRC in writing and notified to the agent — do not stop deducting until you hold that notice',
        'The agent must file quarterly returns and an annual return, and give the landlord an annual certificate of tax deducted',
        'Where there is no agent, a tenant paying rent above the threshold direct to an overseas landlord can themselves be required to deduct',
      ]},
      { type: 'callout', variant: 'warning', text: 'Getting NRL wrong exposes the agency to HMRC penalties for tax that should have been withheld. If a landlord tells you they are moving abroad, flag the NRL scheme and involve your finance team before the next rent run.' },

      { type: 'heading', level: 1, text: 'Practical Steps' },
      { type: 'steps', items: [
        'Establish at onboarding — and periodically — whether the landlord\'s usual home is outside the UK.',
        'If they are non-resident, register the position and deduct tax unless you hold HMRC gross-payment approval.',
        'Keep clean records of rent, expenses and tax deducted for each quarter.',
        'Provide the landlord with their annual certificate so they can complete their own tax return.',
      ]},
      { type: 'callout', variant: 'important', text: 'Tax is specialist territory. Your job is to spot the trigger (landlord abroad) and route it to finance and, where needed, the landlord\'s accountant — not to give tax advice yourself.' },
    ],
  },

  // ─── Expert reference library (batch 3) ───
  {
    id: 'kb-money-owed-to-tenant',
    lastReviewed: 'July 2026',
    title: 'When the Landlord Owes the Tenant Money',
    related: ['kb-court-money-claims', 'kb-deposit-disputes', 'kb-rent-arrears'],
    subtitle: 'Refunds, overpaid rent and deposits — how a tenant recovers money a landlord is wrongly holding.',
    icon: '💷',
    category: 'finance',
    readTime: '8 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'callout', variant: 'info', text: 'Money owed runs both ways. Just as a tenant can owe rent, a landlord can owe a tenant — overpaid or advance rent for a period the tenant did not stay, a rent refund after an early move-out, an unreturned deposit, or reimbursement for works the tenant funded. The tenant has the same right to recover it as any other creditor.' },

      { type: 'heading', level: 1, text: 'Common Situations Where a Tenant Is Owed' },
      { type: 'bullets', items: [
        'Rent paid in advance for days beyond the date the tenancy actually ended, so part of it must be refunded',
        'An overpayment or double payment of rent',
        'A deposit not returned, or deductions the tenant disputes',
        'Money the tenant spent on repairs that were the landlord\'s responsibility, where this was agreed',
        'A refund promised on move-out that the landlord is now refusing to pay',
      ]},
      { type: 'callout', variant: 'tip', text: 'First check what the money actually is. A deposit is protected in a scheme and has its own free dispute service, so an unreturned deposit is handled differently from overpaid rent, which is a plain debt.' },

      { type: 'heading', level: 1, text: 'The Steps to Advise a Tenant' },
      { type: 'steps', items: [
        'Work out exactly what is owed and why, with dates and figures — for example the daily rent multiplied by the number of days overpaid.',
        'Put the request in writing to the landlord, clearly stating the amount, the reason, and a reasonable deadline to repay.',
        'Keep copies of the tenancy agreement, rent statements, bank records and all correspondence — these are the evidence if it goes further.',
        'If it is a deposit, raise a dispute with the deposit scheme, which adjudicates for free.',
        'If it is overpaid or advance rent and the landlord still refuses, the tenant can make a money claim in the County Court (small claims track for modest sums) after sending a letter of claim.',
      ]},

      { type: 'heading', level: 1, text: 'The Small Claims Route' },
      { type: 'paragraph', text: 'For a debt like overpaid rent, the tenant follows the same money-claim process a landlord would use to recover arrears: a pre-action letter of claim, then a claim through Money Claim Online if unresolved. Sums up to £10,000 are dealt with on the small claims track, which is designed to be used without a solicitor and keeps costs low. If the tenant wins, the court makes a judgment the landlord must pay, enforceable in the usual ways.' },
      { type: 'callout', variant: 'important', text: 'As the agent, be even-handed and factual. If the money is genuinely owed to the tenant, the right thing is to get the landlord to pay it. Explain the position to the landlord, keep everything documented, and escalate to your manager if the landlord refuses to do the right thing — the agency should not be seen to help withhold money that is properly due.' },

      { type: 'heading', level: 1, text: 'What Not to Do' },
      { type: 'bullets', items: [
        'Do not simply tell the tenant "that is between you and the landlord" and walk away — help them understand their options',
        'Do not take sides or withhold information to protect the landlord where money is clearly due',
        'Do not offset money owed to a tenant against an unrelated dispute without clear agreement and a record',
      ]},
    ],
  },
  {
    id: 'kb-tenancy-agreements',
    lastReviewed: 'July 2026',
    title: 'Tenancy Agreements & Unfair Terms',
    related: ['kb-tenancy-law', 'kb-guarantors', 'kb-deposit-schemes'],
    subtitle: 'What a well-drafted tenancy agreement contains — and the clauses that are unenforceable.',
    icon: '📝',
    category: 'legal',
    readTime: '7 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'What the Agreement Does' },
      { type: 'paragraph', text: 'The tenancy agreement is the contract between landlord and tenant. It sets out the rent, the parties, the property, and each side\'s obligations. Much of what governs a tenancy comes from statute regardless of what the agreement says, but a clear, compliant agreement prevents disputes and makes obligations enforceable.' },

      { type: 'heading', level: 1, text: 'What a Good Agreement Contains' },
      { type: 'bullets', items: [
        'The full names of all parties (and any guarantor) and the property address',
        'The rent, when and how it is paid, and the deposit amount and scheme',
        'The type of tenancy and, under the reformed regime, that it is periodic',
        'Each side\'s repairing and maintenance responsibilities',
        'Rules on pets, subletting, alterations and use, reflecting any superior lease',
        'How notices are served and the permitted service methods',
      ]},

      { type: 'heading', level: 1, text: 'Terms That Are Unfair or Unenforceable' },
      { type: 'paragraph', text: 'Under the Consumer Rights Act 2015, a term that creates a significant imbalance against the tenant, contrary to good faith, is unfair and not binding. Statute also overrides certain clauses however they are worded.' },
      { type: 'bullets', items: [
        'Clauses trying to charge fees banned by the Tenant Fees Act (admin fees, renewal fees, check-out fees) are not enforceable',
        'Clauses removing the landlord\'s statutory repairing obligations under section 11 of the Landlord and Tenant Act 1985 do not work',
        'Blanket bans that the law no longer allows (for example an absolute "no pets" or "no children" or "no benefits" clause)',
        'A clause purporting to let the landlord enter without notice, overriding the tenant\'s right to quiet enjoyment',
        'Penalty clauses charging disproportionate sums for minor breaches',
      ]},
      { type: 'callout', variant: 'warning', text: 'A term buried in the agreement does not become lawful just because the tenant signed it. If a clause conflicts with statute or is plainly one-sided, treat it as unenforceable and flag it rather than relying on it.' },

      { type: 'heading', level: 1, text: 'Practical Points' },
      { type: 'callout', variant: 'tip', text: 'Use an up-to-date agreement template that reflects current law, make sure the prescribed documents (deposit prescribed information, EPC, gas record, How to Rent guide) are served, and give the tenant a real chance to read the agreement before signing.' },
    ],
  },
  {
    id: 'kb-repairs-responsibilities',
    lastReviewed: 'July 2026',
    title: 'Repairs: Who Is Responsible & How Fast',
    related: ['kb-disrepair', 'kb-damp-mould', 'kb-property-standards'],
    subtitle: 'The split of repairing duties, the new statutory timescales, and how to triage a repair report.',
    icon: '🔧',
    category: 'standards',
    readTime: '8 min read',
    difficulty: 'intermediate',
    content: [
      { type: 'heading', level: 1, text: 'The Landlord\'s Core Repairing Duty' },
      { type: 'paragraph', text: 'Under section 11 of the Landlord and Tenant Act 1985, the landlord must keep in repair the structure and exterior of the property and the installations for water, gas, electricity, sanitation, space heating and hot water. This duty cannot be signed away in the tenancy agreement, and it applies whatever the agreement says.' },
      { type: 'bullets', items: [
        'Structure and exterior: walls, roof, windows, external doors, drains and guttering',
        'Installations: pipes and wiring, boilers, radiators, basins, sinks, baths and toilets',
        'Anything the landlord supplied and the tenant relies on, kept in working order',
      ]},

      { type: 'heading', level: 1, text: 'What the Tenant Is Responsible For' },
      { type: 'bullets', items: [
        'Using the property in a "tenant-like manner" — minor upkeep such as changing bulbs, keeping it ventilated and reasonably clean',
        'Not causing damage, and reporting disrepair promptly so it can be fixed',
        'Any damage they or their guests cause beyond fair wear and tear',
      ]},
      { type: 'callout', variant: 'tip', text: 'A landlord\'s repairing duty is usually only triggered once they have notice of the problem. That is exactly why prompt logging of every tenant report matters — the clock and the liability often start when the report comes in.' },

      { type: 'heading', level: 1, text: 'Awaab\'s Law and Repair Timescales' },
      { type: 'paragraph', text: 'Awaab\'s Law introduces legal timescales for landlords to investigate and fix serious hazards, especially damp and mould, within set periods once reported, and to make emergency repairs quickly. These timescales, first applied to social housing, are being extended to the private rented sector under the Renters\' Rights reforms. Treat any damp, mould or safety hazard report as time-critical.' },
      { type: 'warning', variant: 'warning', text: 'Ignoring or slow-walking a hazard report is now a legal risk, not just a service failure. If a report involves damp, mould, heating loss in cold weather, or anything affecting health and safety, escalate and act on it immediately.' },

      { type: 'heading', level: 1, text: 'Triaging a Repair Report' },
      { type: 'steps', items: [
        'Log the report with the date, what was reported, and any photos.',
        'Classify urgency: emergency (safety, no heat/water, flooding), urgent, or routine.',
        'For emergencies, act straight away to make safe, then arrange the full repair.',
        'Confirm whose responsibility it is — landlord, tenant, or a communal/freeholder issue in a flat.',
        'Instruct the right contractor, keep the tenant updated, and record when it is completed.',
      ]},
    ],
  },
  {
    id: 'kb-insurance',
    lastReviewed: 'July 2026',
    title: 'Landlord Insurance & Handling Claims',
    related: ['kb-repairs-responsibilities', 'kb-landlord-relations', 'kb-property-standards'],
    subtitle: 'The cover a let property needs and how to handle an incident that becomes a claim.',
    icon: '🛡️',
    category: 'landlord',
    readTime: '6 min read',
    difficulty: 'foundation',
    content: [
      { type: 'heading', level: 1, text: 'Why Ordinary Home Insurance Is Not Enough' },
      { type: 'paragraph', text: 'A standard owner-occupier home policy usually does not cover a property that is let out. A landlord needs specialist landlord (buildings) insurance, and many policies for let property become invalid if the property is left unoccupied beyond a set period, so voids matter for cover as well as income.' },

      { type: 'heading', level: 1, text: 'Types of Cover' },
      { type: 'bullets', items: [
        'Buildings insurance — the structure itself; essential, and for a leasehold flat usually arranged by the freeholder and paid through the service charge',
        'Contents insurance — only the landlord\'s own contents in a furnished let; the tenant insures their own belongings',
        'Landlord liability — claims by a tenant or visitor injured due to the property',
        'Optional extras — rent guarantee, legal expenses, and emergency assistance',
      ]},
      { type: 'callout', variant: 'tip', text: 'Remind tenants that the landlord\'s policy does not cover the tenant\'s own possessions. Tenants should arrange their own contents insurance.' },

      { type: 'heading', level: 1, text: 'Handling an Incident or Claim' },
      { type: 'steps', items: [
        'Make the situation safe first — a leak, fire or break-in may need emergency works before anything else.',
        'Record everything: photos, dates, what happened, and any police or crime reference.',
        'Notify the landlord and their insurer promptly, within any time limit in the policy.',
        'Get the repair quotes or invoices the insurer will need, and keep the tenant informed throughout.',
        'Do not admit liability on the landlord\'s behalf — report the facts and let the insurer assess.',
      ]},
      { type: 'callout', variant: 'important', text: 'Where a leasehold flat is insured by the freeholder, a claim for damage to the structure usually goes through the building\'s policy, not the landlord\'s own. Check who insures what before starting a claim, and involve your manager for anything large or contested.' },
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
