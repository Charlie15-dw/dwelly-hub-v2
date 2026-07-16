// Curated "UK Lettings Law & Legislation" feed for The Hub.
//
// This is a hand-curated feed, not a live data source. Charlie owns the
// content — add, edit or remove entries here and the feed updates. The page
// sorts by `date` so the most recent change appears first.
//
// IMPORTANT: these are plain-English training summaries to help PMs stay
// current — they are NOT legal advice. Each entry pairs "what changed" with
// "what this means for your day-to-day" so the change is actionable, not
// abstract. The seed entries below are examples to be reviewed and kept up to
// date; treat dates and detail as a starting point.

export type LawStatus = 'in-force' | 'upcoming' | 'proposed'

export type LawCategory =
  | 'Tenancy reform'
  | 'Deposits'
  | 'Safety & compliance'
  | 'Right to Rent'
  | 'Energy / EPC'
  | 'Licensing'

export interface LawFeedItem {
  id: string
  title: string
  date: string // ISO date of the change or announcement, e.g. '2026-05-01'
  status: LawStatus
  category: LawCategory
  summary: string // one-line headline in plain English
  whatChanged: string[] // the substance of the change
  whatThisMeans: string[] // how it affects the PM's day-to-day work
  effectiveFrom?: string // human-friendly date it takes / took effect
  related?: string[] // knowledge article ids (TrainingSection) to link out to
}

export const LAW_STATUS_LABELS: Record<LawStatus, string> = {
  'in-force': 'In force',
  'upcoming': 'Upcoming',
  'proposed': 'Proposed',
}

export const LAW_FEED: LawFeedItem[] = [
  {
    id: 'renters-rights-periodic-tenancies',
    title: 'End of fixed terms — all tenancies become periodic',
    date: '2026-06-02',
    status: 'in-force',
    category: 'Tenancy reform',
    summary: 'Assured shorthold tenancies move to a single periodic system, and Section 21 "no-fault" evictions are abolished.',
    whatChanged: [
      'New tenancies are periodic from the outset — there are no fixed terms.',
      'Section 21 no-fault evictions can no longer be used; possession must rely on a valid ground under Section 8.',
      'Tenants can end a tenancy with two months\u2019 notice at any point.',
    ],
    whatThisMeans: [
      'When a landlord wants possession, you now need a genuine Section 8 ground and the evidence to support it — start building that case early.',
      'Expect more tenant-initiated move-outs at shorter notice; keep re-let readiness and inventories tight.',
      'Review your tenancy templates and any references to fixed terms or Section 21 in your standard letters.',
    ],
    effectiveFrom: 'June 2026',
    related: ['kb-tenancy-law', 'kb-section-8'],
  },
  {
    id: 'decent-homes-private-rented',
    title: 'Decent Homes Standard extended to the private rented sector',
    date: '2026-04-15',
    status: 'upcoming',
    category: 'Safety & compliance',
    summary: 'Private rented homes must meet a minimum standard covering repair, facilities and freedom from serious hazards.',
    whatChanged: [
      'A Decent Homes Standard now applies to private lettings, not just social housing.',
      'Properties must be free of the most serious (Category 1) health and safety hazards.',
      'Reasonable state of repair and reasonably modern facilities are required.',
    ],
    whatThisMeans: [
      'Proactive inspections matter more than ever — log condition with dated photos so you can evidence compliance.',
      'Flag properties that may fall short to the landlord early, with a clear works plan.',
      'Damp, mould and disrepair reports should be triaged quickly and tracked to completion.',
    ],
    effectiveFrom: 'Phased from 2026',
    related: ['kb-disrepair', 'kb-damp-mould', 'kb-property-standards'],
  },
  {
    id: 'awaabs-law-damp-mould',
    title: 'Awaab\u2019s Law — fixed timescales for damp & mould',
    date: '2026-03-10',
    status: 'upcoming',
    category: 'Safety & compliance',
    summary: 'Landlords must investigate and fix reported damp and mould hazards within set timescales.',
    whatChanged: [
      'Reported hazards must be investigated within a fixed period and made safe within defined timescales.',
      'Emergency hazards require action within a short, mandated window.',
      'Written updates must be provided to the tenant.',
    ],
    whatThisMeans: [
      'Treat every damp/mould report as time-critical — log the report date and start the clock immediately.',
      'Keep the tenant informed in writing at each step; save copies to the file.',
      'Escalate to the landlord and contractors fast; delays now carry legal weight.',
    ],
    effectiveFrom: 'Expected 2026',
    related: ['kb-damp-mould', 'kb-disrepair'],
  },
  {
    id: 'mees-epc-c-proposal',
    title: 'Minimum EPC rating rising towards C',
    date: '2026-02-01',
    status: 'proposed',
    category: 'Energy / EPC',
    summary: 'Proposals would require rented homes to reach a higher minimum energy efficiency rating over the coming years.',
    whatChanged: [
      'The minimum energy efficiency standard (currently E) is proposed to rise towards C for rented properties.',
      'Phased introduction is expected, starting with new tenancies.',
    ],
    whatThisMeans: [
      'Start a conversation with landlords of D/E-rated stock about likely improvement works and timelines.',
      'Keep EPC certificates and expiry dates on file and flag those approaching renewal.',
      'Factor potential upgrade costs into landlord planning conversations now.',
    ],
    effectiveFrom: 'Under consultation',
    related: ['kb-energy-mees'],
  },
  {
    id: 'how-to-rent-guide-update',
    title: 'Updated "How to Rent" guide published',
    date: '2026-01-20',
    status: 'in-force',
    category: 'Tenancy reform',
    summary: 'A new version of the government "How to Rent" checklist must be served to new tenants.',
    whatChanged: [
      'The official "How to Rent" guide has been updated.',
      'The current version must be served at the start of a tenancy for it to be valid for possession purposes.',
    ],
    whatThisMeans: [
      'Make sure your onboarding pack serves the latest version — an outdated guide can undermine a possession claim.',
      'Record the date and method you served it to the tenant.',
    ],
    effectiveFrom: 'January 2026',
    related: ['kb-tenancy-law'],
  },
]

// Newest first.
export function lawFeedSorted(): LawFeedItem[] {
  return [...LAW_FEED].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getLawFeedItem(id: string): LawFeedItem | undefined {
  return LAW_FEED.find(item => item.id === id)
}
