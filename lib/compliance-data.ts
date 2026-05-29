export interface ComplianceArea {
  id: string
  name: string
  description: string
  status: 'compliant' | 'due-soon' | 'overdue' | 'not-applicable'
  lastCheckDate: string | null
  nextDueDate: string | null
  legislation: string
  penaltyInfo: string
  icon: string
  category: 'safety' | 'electrical' | 'energy' | 'tenant-checks' | 'licensing' | 'furnishings'
}

export interface LegislationSummary {
  id: string
  title: string
  shortName: string
  year: number
  description: string
  keyPoints: string[]
  relevantAreas: string[]
}

export interface ComplianceDeadline {
  id: string
  areaId: string
  propertyAddress: string
  dueDate: string
  type: 'certificate-renewal' | 'inspection' | 'check' | 'registration'
  status: 'upcoming' | 'due-soon' | 'overdue'
}

export const COMPLIANCE_AREAS: ComplianceArea[] = [
  {
    id: 'gas-safety',
    name: 'Gas Safety Certificates',
    description: 'Annual gas safety inspections by a Gas Safe registered engineer for all gas appliances, flues, and pipework.',
    status: 'compliant',
    lastCheckDate: '2026-02-15',
    nextDueDate: '2027-02-15',
    legislation: 'Gas Safety (Installation and Use) Regulations 1998',
    penaltyInfo: 'Up to £6,000 fine or 6 months imprisonment',
    icon: '🔥',
    category: 'safety',
  },
  {
    id: 'electrical-safety',
    name: 'Electrical Safety (EICR)',
    description: 'Electrical Installation Condition Reports required every 5 years, or on change of tenancy.',
    status: 'compliant',
    lastCheckDate: '2024-11-10',
    nextDueDate: '2029-11-10',
    legislation: 'Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020',
    penaltyInfo: 'Up to £30,000 fine per breach',
    icon: '⚡',
    category: 'electrical',
  },
  {
    id: 'epc',
    name: 'Energy Performance Certificates',
    description: 'Valid EPC with minimum rating of E required before letting. New builds and re-lets require a fresh certificate.',
    status: 'due-soon',
    lastCheckDate: '2016-08-20',
    nextDueDate: '2026-08-20',
    legislation: 'Energy Efficiency (Private Rented Property) (England and Wales) Regulations 2015',
    penaltyInfo: 'Up to £5,000 per property',
    icon: '🏷️',
    category: 'energy',
  },
  {
    id: 'fire-safety',
    name: 'Fire Safety & Smoke Alarms',
    description: 'Smoke alarms on every floor, carbon monoxide alarms in rooms with solid fuel appliances. Fire risk assessments for HMOs.',
    status: 'compliant',
    lastCheckDate: '2026-03-01',
    nextDueDate: '2027-03-01',
    legislation: 'Smoke and Carbon Monoxide Alarm (Amendment) Regulations 2022',
    penaltyInfo: 'Up to £5,000 fine',
    icon: '🚨',
    category: 'safety',
  },
  {
    id: 'legionella',
    name: 'Legionella Risk Assessment',
    description: 'Risk assessment for Legionella bacteria in water systems. Recommended review every 2 years.',
    status: 'overdue',
    lastCheckDate: '2023-06-15',
    nextDueDate: '2025-06-15',
    legislation: 'Health and Safety at Work etc. Act 1974 / ACOP L8',
    penaltyInfo: 'Unlimited fine or imprisonment',
    icon: '💧',
    category: 'safety',
  },
  {
    id: 'right-to-rent',
    name: 'Right to Rent Checks',
    description: 'Verify tenants have the legal right to rent in England before the start of each new tenancy.',
    status: 'compliant',
    lastCheckDate: '2026-04-01',
    nextDueDate: null,
    legislation: 'Immigration Act 2014 (as amended 2016)',
    penaltyInfo: 'Up to £3,000 per occupier (civil) or 5 years imprisonment (criminal)',
    icon: '🛂',
    category: 'tenant-checks',
  },
  {
    id: 'deposit-protection',
    name: 'Deposit Protection',
    description: 'Tenant deposits must be protected in a government-approved scheme within 30 days and prescribed information served.',
    status: 'compliant',
    lastCheckDate: '2026-01-10',
    nextDueDate: null,
    legislation: 'Housing Act 2004 (sections 212-215)',
    penaltyInfo: 'Up to 3x deposit compensation',
    icon: '🔒',
    category: 'tenant-checks',
  },
  {
    id: 'hmo-licensing',
    name: 'HMO Licensing',
    description: 'Mandatory licence for HMOs with 5+ occupiers from 2+ households. Additional licensing may apply locally.',
    status: 'not-applicable',
    lastCheckDate: null,
    nextDueDate: null,
    legislation: 'Housing Act 2004 (Part 2)',
    penaltyInfo: 'Up to £30,000 fine or Rent Repayment Order',
    icon: '🏘️',
    category: 'licensing',
  },
  {
    id: 'furnishings',
    name: 'Furniture & Furnishings Safety',
    description: 'All upholstered furniture must meet fire resistance requirements with appropriate labelling.',
    status: 'due-soon',
    lastCheckDate: '2025-10-01',
    nextDueDate: '2026-05-01',
    legislation: 'Furniture and Furnishings (Fire) (Safety) Regulations 1988 (amended 2010)',
    penaltyInfo: 'Up to £5,000 fine or 6 months imprisonment',
    icon: '🛋️',
    category: 'furnishings',
  },
]

export const LEGISLATION_SUMMARIES: LegislationSummary[] = [
  {
    id: 'gas-regs-1998',
    title: 'Gas Safety (Installation and Use) Regulations',
    shortName: 'GSIUR',
    year: 1998,
    description: 'Requires landlords to maintain gas appliances, flues, and associated pipework in a safe condition. Annual safety checks must be carried out by a Gas Safe registered engineer.',
    keyPoints: [
      'Annual gas safety checks are mandatory for all rented properties with gas appliances',
      'Checks must be done by a Gas Safe registered engineer',
      'A copy of the Gas Safety Certificate must be given to tenants within 28 days',
      'Records must be kept for at least 2 years',
      'New tenants must receive a copy before they move in',
    ],
    relevantAreas: ['gas-safety'],
  },
  {
    id: 'electrical-regs-2020',
    title: 'Electrical Safety Standards in the Private Rented Sector (England) Regulations',
    shortName: 'ESSR',
    year: 2020,
    description: 'Requires landlords to have electrical installations inspected and tested by a qualified person at intervals of no more than 5 years.',
    keyPoints: [
      'EICR must be obtained before a new tenancy and at least every 5 years',
      'Report must be supplied to tenants within 28 days of the inspection',
      'C1 (Danger Present) requires immediate rectification — the installation is unsafe and must be dealt with on the spot',
      'C2 and F1 remedial works must be completed within 28 days',
      'C3 items are elective but strongly recommended — regulations evolve and C3s can become mandatory C2s',
      'Written confirmation of completed remedial work must be supplied to the local authority',
      'Applies to all new and existing private rented sector tenancies in England',
    ],
    relevantAreas: ['electrical-safety'],
  },
  {
    id: 'epc-regs-2015',
    title: 'Energy Efficiency (Private Rented Property) Regulations',
    shortName: 'MEES',
    year: 2015,
    description: 'Sets the Minimum Energy Efficiency Standards (MEES) for privately rented properties. Landlords cannot let properties with an EPC rating below E unless a valid exemption is registered.',
    keyPoints: [
      'Minimum EPC rating of E required for all lettings',
      'Applies to new lets and renewals since April 2018, all tenancies since April 2020',
      'Exemptions must be registered on the PRS Exemptions Register',
      'Proposed tightening to EPC C by 2028 (subject to consultation)',
      'EPCs are valid for 10 years from the date of issue',
    ],
    relevantAreas: ['epc'],
  },
  {
    id: 'smoke-co-2022',
    title: 'Smoke and Carbon Monoxide Alarm (Amendment) Regulations',
    shortName: 'SCAA',
    year: 2022,
    description: 'Extends requirements for smoke and carbon monoxide alarms in rented properties. Landlords must repair or replace alarms once informed they are faulty.',
    keyPoints: [
      'Smoke alarms required on every storey with a room used as living accommodation',
      'Carbon monoxide alarms required in any room with a fixed combustion appliance (excluding gas cookers)',
      'Alarms must be checked at the start of each new tenancy',
      'Landlords must repair or replace faulty alarms once informed',
      'Non-compliance can result in a fine of up to £5,000',
    ],
    relevantAreas: ['fire-safety'],
  },
  {
    id: 'housing-act-2004',
    title: 'Housing Act 2004',
    shortName: 'HA 2004',
    year: 2004,
    description: 'Wide-ranging legislation covering HMO licensing, tenancy deposit protection, housing conditions (HHSRS), and management standards.',
    keyPoints: [
      'Introduced mandatory HMO licensing for properties with 5+ occupiers',
      'Established the Housing Health and Safety Rating System (HHSRS)',
      'Requires tenancy deposits to be protected in approved schemes within 30 days',
      'Prescribed information must be served to tenants within 30 days',
      'Local authorities given powers to issue improvement notices and prohibition orders',
    ],
    relevantAreas: ['hmo-licensing', 'deposit-protection'],
  },
  {
    id: 'immigration-act-2014',
    title: 'Immigration Act (Right to Rent)',
    shortName: 'IA 2014',
    year: 2014,
    description: 'Requires landlords (or their agents) to check the immigration status of prospective tenants to confirm their right to rent property in England.',
    keyPoints: [
      'Checks must be carried out before the tenancy begins',
      'Original documents must be seen and copies retained',
      'Follow-up checks required for time-limited right to rent',
      'Digital checks via the Home Office online service are accepted',
      'Failure to comply can result in civil penalties up to £3,000 per occupier',
    ],
    relevantAreas: ['right-to-rent'],
  },
]

export const COMPLIANCE_DEADLINES: ComplianceDeadline[] = [
  {
    id: 'dl-1',
    areaId: 'epc',
    propertyAddress: '14 Harbour View, Plymouth PL1 2AB',
    dueDate: '2026-08-20',
    type: 'certificate-renewal',
    status: 'due-soon',
  },
  {
    id: 'dl-2',
    areaId: 'legionella',
    propertyAddress: '7 Ocean Court, Exeter EX1 3FG',
    dueDate: '2025-06-15',
    type: 'inspection',
    status: 'overdue',
  },
  {
    id: 'dl-3',
    areaId: 'legionella',
    propertyAddress: '22 King Street, Bristol BS1 4HJ',
    dueDate: '2025-09-01',
    type: 'inspection',
    status: 'overdue',
  },
  {
    id: 'dl-4',
    areaId: 'furnishings',
    propertyAddress: '3 Elm Park, Taunton TA1 5KL',
    dueDate: '2026-05-01',
    type: 'check',
    status: 'due-soon',
  },
  {
    id: 'dl-5',
    areaId: 'gas-safety',
    propertyAddress: '14 Harbour View, Plymouth PL1 2AB',
    dueDate: '2027-02-15',
    type: 'certificate-renewal',
    status: 'upcoming',
  },
  {
    id: 'dl-6',
    areaId: 'gas-safety',
    propertyAddress: '7 Ocean Court, Exeter EX1 3FG',
    dueDate: '2027-02-15',
    type: 'certificate-renewal',
    status: 'upcoming',
  },
  {
    id: 'dl-7',
    areaId: 'fire-safety',
    propertyAddress: '22 King Street, Bristol BS1 4HJ',
    dueDate: '2027-03-01',
    type: 'check',
    status: 'upcoming',
  },
  {
    id: 'dl-8',
    areaId: 'electrical-safety',
    propertyAddress: '3 Elm Park, Taunton TA1 5KL',
    dueDate: '2029-11-10',
    type: 'certificate-renewal',
    status: 'upcoming',
  },
]
