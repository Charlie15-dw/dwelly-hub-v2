// Curated "Dwelly Updates" release notes for The Hub.
//
// Each entry is a product update shown in the Dwelly Updates feed. Add new
// entries here (any order) — the page sorts by `date` so the newest appears
// first. Videos live in /public/updates and are referenced by their public path.

export interface HubUpdateItem {
  text: string
  children?: string[]
}

export interface HubUpdateSection {
  heading: string
  intro?: string
  items: HubUpdateItem[]
  image?: { src: string; alt: string }
}

export interface HubUpdateVideo {
  src: string
  label?: string
}

export interface HubUpdateLink {
  label: string
  href: string
}

export interface HubUpdate {
  id: string
  title: string
  date: string // ISO date, e.g. '2026-05-29'
  intro?: string
  notes?: string[] // highlighted callouts shown near the top of the entry
  sections: HubUpdateSection[]
  links?: HubUpdateLink[] // related links shown as buttons
  videos?: HubUpdateVideo[]
}

export const HUB_UPDATES: HubUpdate[] = [
  {
    id: 'provider-portal-upgrades-2026-06-26',
    title: 'Provider Portal upgrades',
    date: '2026-06-26',
    intro: "We've shipped a set of upgrades to the provider portal.",
    sections: [
      {
        heading: 'New Earnings tab',
        items: [
          { text: 'Service providers can now access a dedicated Earnings tab in their portal to track their financial details and payouts.' },
        ],
        image: {
          src: '/updates/provider-portal-2026-06-26-earnings.png',
          alt: 'Provider portal Earnings tab showing monthly earnings and upcoming payouts.',
        },
      },
      {
        heading: 'Contractor Terms of Business (ToB)',
        items: [
          { text: 'A new Terms of Business row has been added to the portal navigation. This page is currently inactive — providers are not yet prompted or required to sign it.' },
        ],
        image: {
          src: '/updates/provider-portal-2026-06-26-tob.png',
          alt: 'Provider portal navigation showing the new Terms of Business row.',
        },
      },
      {
        heading: 'Authentication & security fixes',
        items: [
          { text: 'The portal now correctly displays an error message when a provider enters an incorrect username or password.' },
          { text: 'Fixed a security issue with the Dashboard auto-login button, ensuring the generated link cannot be intercepted and reused.' },
        ],
        image: {
          src: '/updates/provider-portal-2026-06-26-signin.png',
          alt: 'Provider portal sign-in screen showing an incorrect login error message.',
        },
      },
    ],
  },
  {
    id: 'landlord-service-2026-06-09',
    title: 'New Landlord service in the CRM',
    date: '2026-06-09',
    intro: "We're launching the new Landlord service in the CRM. The main change for you is that landlord details are now read-only.",
    notes: [
      "Landlord details are now read-only in the CRM. To update a landlord's personal details, follow the process on the linked page below.",
      "SLA: please expect the data to be updated within one business day after the MD's confirmation.",
    ],
    sections: [
      {
        heading: 'Why the process has changed',
        intro: 'Controlling and maintaining clean client data is an important prerequisite to delivering excellent service. Previously there was no link between the data of the contact person(s) acting on behalf of a landlord and the official property owner details. As a result, several negative outcomes occurred:',
        items: [
          { text: 'Some landlords received statements with the wrong name on them.' },
          { text: 'Because landlords were stored as one shared entity, editing a contact name on a single property quietly changed it across every property tied to that landlord.' },
          { text: 'Plus several other avoidable scenarios.' },
        ],
      },
      {
        heading: 'What has changed behind the scenes',
        items: [
          { text: 'All information connected to a landlord is now unified into a single, consistent record, and historic data has been migrated to the new setup.' },
          { text: 'Everything that used to sit under Maintenance / Landlords and Maintenance → Ownership Shares now lives in the new Landlords service.' },
          { text: 'For security reasons and to preserve data quality, we have introduced restrictions on editing.' },
          { text: 'The LL onboarding functionality (to onboard new landlords and sign ASTs) is no longer available. Please follow the canvas instructions to fill in the form, and use your new ToB templates in PandaDoc previously introduced by Anton.' },
        ],
      },
      {
        heading: "Where we're heading next",
        items: [
          { text: 'This manual step is temporary.' },
          { text: 'In parallel, we have already begun building a way for landlords to update their own details directly, verified securely by email or SMS through the LL portal. Once live, the need to route changes manually will be mostly removed — less work for everyone, and properly verified data by default.' },
          { text: 'We are also planning a further landlord data clean-up by validating records with MDs. Keeping editing access limited for now helps us avoid conflicting changes while that clean-up is in progress.' },
        ],
      },
      {
        heading: 'For your info',
        items: [
          { text: "With a migration this size, there's a small chance some records may look a little off in the early days, and it's possible the odd thing goes out with the wrong details while everything settles." },
          { text: 'If you spot anything like that, please flag it immediately — fixing these is our number one priority and we will jump on them straight away.' },
          { text: 'Thanks for bearing with us while we get the ball rolling — your cooperation here makes a real difference!' },
        ],
      },
    ],
    links: [
      {
        label: 'Process for updating landlord details (Slack doc)',
        href: 'https://dwelly-group.slack.com/docs/T07PAALJVQC/F0B880YNRQU',
      },
    ],
  },
  {
    id: 'provider-portal-2026-05-29',
    title: 'Provider Portal update',
    date: '2026-05-29',
    intro: "We've released an update to the provider portal. Here's what's new:",
    sections: [
      {
        heading: 'Search & navigation',
        items: [
          { text: 'Search by job number and property address' },
          { text: 'Filter jobs by status to quickly see what needs attention at each stage' },
        ],
      },
      {
        heading: 'Schedule',
        items: [
          { text: 'New Schedule tab showing all upcoming appointments for a selected day in one place' },
        ],
      },
      {
        heading: 'Booking a visit',
        items: [
          { text: 'Contractors can now set a visit date and time directly in the portal' },
          { text: 'The system automatically parses the date and sends confirmation emails to all parties' },
        ],
      },
      {
        heading: 'Document uploads',
        items: [
          { text: 'Certificates — for compliance jobs' },
          { text: 'Invoices — for compliance and maintenance jobs' },
          { text: 'Proof of works — for maintenance jobs' },
        ],
      },
      {
        heading: 'Tenant communication',
        items: [
          { text: 'Contractors can now reach tenants directly from the portal via call' },
        ],
      },
      {
        heading: 'Mobile',
        items: [
          { text: 'The portal is now available on mobile' },
        ],
      },
    ],
    videos: [
      { src: '/updates/provider-portal-2026-05-29-1.mp4' },
      { src: '/updates/provider-portal-2026-05-29-2.mp4' },
    ],
  },
  {
    id: 'contacts-tab-2026-06-09',
    title: 'Contacts tab on the property card',
    date: '2026-06-09',
    intro: "We're releasing the 'Contacts' tab on the property card. It shows everyone linked to a property — owners, agents and other contact persons — along with their details and communication settings. The tab sits alongside Property, Maintenance, Ledger and the other property tabs.",
    notes: [
      'The tab is view-only — you can explore all the information, but editing is not available at this stage.',
      'Landlord details are visible on the Contacts tab only — they are not shown on the Maintenance Primary or Maintenance Ownership Shares tabs.',
    ],
    sections: [
      {
        heading: 'Property contact list',
        intro: 'When you open the Contacts tab, you see a list of all contact persons linked to this property.',
        items: [
          { text: "At the top is the 'Ownership' bar — it shows how much of the property has been allocated between legal owners. When it reaches 100%, a green 'Fully allocated' label appears." },
          {
            text: 'Each person or company in the list is shown as a card with:',
            children: [
              "Name and type — 'Person' or 'Company'.",
              "Role — a badge showing Owner, Agent or another role. Legal owners also carry a 'Legal Owner · XX%' badge with their ownership share.",
              "Communication tags — the channel (e.g. 'email'), notification topics ('Prop. Mgmt', 'Tenant Find', 'Finance'), statement delivery method, and a 'Portal' tag if portal access is enabled. If nothing is set up, 'No notifications' is shown.",
              "Contact details — address, email(s) and phone with labels like 'Work' and 'Mobile'. The primary contact is marked with a dot.",
            ],
          },
          { text: "Click the eye icon on a card to open the landlord's detailed card." },
        ],
        image: {
          src: '/updates/contacts-tab-2026-06-09-list.png',
          alt: 'Contacts tab showing the ownership bar and contact person cards for a property.',
        },
      },
      {
        heading: "Landlord's detailed card",
        intro: 'The detailed card has three sections.',
        items: [
          {
            text: 'Identity — who the landlord is:',
            children: [
              "ID, type, title (e.g. 'Mrs'), date of birth, first name, last name and salutation.",
              "If the landlord is classified as a large owner, a 'Big portfolio' label appears.",
            ],
          },
          {
            text: 'Contacts — ways to get in touch. Each contact includes:',
            children: [
              'the type (email, phone or address);',
              "an optional label (e.g. 'Work', 'Mobile');",
              "a 'Primary' flag on the main contact of each type;",
              'for addresses, the country may also be shown.',
            ],
          },
          {
            text: 'Property Links — which properties this landlord is linked to, and the settings for each link:',
            children: [
              "Role and ownership — e.g. 'Owner' or 'Legal Owner · 100%'.",
              "Channel and notification topics — the channel used (e.g. 'email') and what the landlord is notified about: 'Property Mgmt', 'Tenant Find', 'Finance'. Communication is handled via email and SMS; other channels aren't available yet.",
              "Statement delivery — how and where financial statements are sent, e.g. 'Statement via Email → olya+112@dwelly.group'. The name and address for statements are taken from the legal owner's data.",
              'Portal Access — a tag shown when the landlord has portal login enabled.',
            ],
          },
        ],
        image: {
          src: '/updates/contacts-tab-2026-06-09-detail.png',
          alt: "Landlord's detailed card showing Identity, Contacts and Property Links sections.",
        },
      },
    ],
  },
]

// Newest first.
export const hubUpdatesSorted = (): HubUpdate[] =>
  [...HUB_UPDATES].sort((a, b) => b.date.localeCompare(a.date))
