// Curated "Dwelly Updates" release notes for The Hub.
//
// Each entry is a product update shown in the Dwelly Updates feed. Add new
// entries here (any order) — the page sorts by `date` so the newest appears
// first. Videos live in /public/updates and are referenced by their public path.

export interface HubUpdateSection {
  heading: string
  items: string[]
}

export interface HubUpdateVideo {
  src: string
  label?: string
}

export interface HubUpdate {
  id: string
  title: string
  date: string // ISO date, e.g. '2026-05-29'
  intro?: string
  sections: HubUpdateSection[]
  videos?: HubUpdateVideo[]
}

export const HUB_UPDATES: HubUpdate[] = [
  {
    id: 'provider-portal-2026-05-29',
    title: 'Provider Portal update',
    date: '2026-05-29',
    intro: "We've released an update to the provider portal. Here's what's new:",
    sections: [
      {
        heading: 'Search & navigation',
        items: [
          'Search by job number and property address',
          'Filter jobs by status to quickly see what needs attention at each stage',
        ],
      },
      {
        heading: 'Schedule',
        items: [
          'New Schedule tab showing all upcoming appointments for a selected day in one place',
        ],
      },
      {
        heading: 'Booking a visit',
        items: [
          'Contractors can now set a visit date and time directly in the portal',
          'The system automatically parses the date and sends confirmation emails to all parties',
        ],
      },
      {
        heading: 'Document uploads',
        items: [
          'Certificates — for compliance jobs',
          'Invoices — for compliance and maintenance jobs',
          'Proof of works — for maintenance jobs',
        ],
      },
      {
        heading: 'Tenant communication',
        items: [
          'Contractors can now reach tenants directly from the portal via call',
        ],
      },
      {
        heading: 'Mobile',
        items: [
          'The portal is now available on mobile',
        ],
      },
    ],
    videos: [
      { src: '/updates/provider-portal-2026-05-29-1.mp4' },
      { src: '/updates/provider-portal-2026-05-29-2.mp4' },
    ],
  },
]

// Newest first.
export const hubUpdatesSorted = (): HubUpdate[] =>
  [...HUB_UPDATES].sort((a, b) => b.date.localeCompare(a.date))
