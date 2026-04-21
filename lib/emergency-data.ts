export type PriorityLevel = 'P1' | 'P2' | 'P3'

export interface EmergencyProcedure {
  id: string
  title: string
  priority: PriorityLevel
  priorityLabel: string
  immediateActions: string[]
  whoToContact: { role: string; detail: string }[]
  escalationPath: string[]
  documentationRequired: string[]
  dwellySteps: string[]
  icon: string
}

export interface EmergencyContact {
  label: string
  number: string
  note: string
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { label: 'Emergency Services', number: '999', note: 'Fire, police, ambulance — life-threatening' },
  { label: 'Gas Emergency', number: '0800 111 999', note: 'National Gas Emergency Service — 24/7' },
  { label: 'Dwelly Emergency Line', number: '0333 000 0000', note: 'Out-of-hours property emergencies' },
  { label: 'Water Emergency', number: '0800 714 614', note: 'Report burst mains or supply issues' },
  { label: 'Electricity Emergency', number: '105', note: 'Power cuts & electrical emergencies' },
  { label: 'Non-Emergency Police', number: '101', note: 'Report crime that is not an emergency' },
]

export const EMERGENCY_PROCEDURES: EmergencyProcedure[] = [
  // ─── P1 — Critical ────────────────────────────────────────
  {
    id: 'fire',
    title: 'Fire or Smoke Detected',
    priority: 'P1',
    priorityLabel: 'Critical',
    immediateActions: [
      'Evacuate all occupants — do NOT attempt to fight the fire',
      'Call 999 immediately and request the fire service',
      'Ensure all occupants are accounted for at the assembly point',
      'Do not re-enter the property until cleared by fire services',
    ],
    whoToContact: [
      { role: 'Emergency Services', detail: '999' },
      { role: 'Dwelly Emergency Line', detail: '0333 000 0000' },
      { role: 'Property Owner', detail: 'Via Dwelly CRM' },
    ],
    escalationPath: ['On-site PM', 'Dwelly Emergency Line', 'Operations Director', 'Insurer'],
    documentationRequired: [
      'Incident report within 1 hour',
      'Photographs of damage (when safe)',
      'Fire service reference number',
      'Tenant welfare check log',
    ],
    dwellySteps: [
      'Log emergency in Dwelly under Incidents > Fire',
      'Attach fire service reference to the property record',
      'Trigger insurance notification workflow',
      'Schedule follow-up welfare check within 24 hours',
    ],
    icon: '🔥',
  },
  {
    id: 'gas-leak',
    title: 'Gas Leak or Carbon Monoxide',
    priority: 'P1',
    priorityLabel: 'Critical',
    immediateActions: [
      'Evacuate all occupants immediately — open windows if safe',
      'Do NOT operate light switches, doorbells or appliances',
      'Call the Gas Emergency line: 0800 111 999',
      'Move to fresh air and wait for the gas engineer',
    ],
    whoToContact: [
      { role: 'Gas Emergency', detail: '0800 111 999' },
      { role: 'Dwelly Emergency Line', detail: '0333 000 0000' },
      { role: 'Property Owner', detail: 'Via Dwelly CRM' },
    ],
    escalationPath: ['On-site PM', 'Gas Emergency Service', 'Dwelly Emergency Line', 'Operations Director'],
    documentationRequired: [
      'Gas engineer report and reference number',
      'CO alarm reading if available',
      'Tenant welfare confirmation',
      'Gas Safety Certificate review',
    ],
    dwellySteps: [
      'Log emergency in Dwelly under Incidents > Gas/CO',
      'Flag Gas Safety Certificate for immediate review',
      'Attach engineer report to the property record',
      'Schedule re-inspection once remedial works complete',
    ],
    icon: '💨',
  },
  {
    id: 'flood',
    title: 'Major Flood or Water Ingress',
    priority: 'P1',
    priorityLabel: 'Critical',
    immediateActions: [
      'Turn off the water at the stopcock if accessible',
      'Switch off electricity at the mains if water is near electrics',
      'Move tenants and valuables to higher ground or dry areas',
      'Call Dwelly Emergency Line and arrange emergency plumber',
    ],
    whoToContact: [
      { role: 'Dwelly Emergency Line', detail: '0333 000 0000' },
      { role: 'Emergency Plumber', detail: 'Via approved contractor list' },
      { role: 'Property Owner', detail: 'Via Dwelly CRM' },
    ],
    escalationPath: ['On-site PM', 'Emergency Plumber', 'Dwelly Emergency Line', 'Insurer'],
    documentationRequired: [
      'Photographs and video of flooding',
      'Stopcock location confirmed',
      'Plumber callout reference',
      'Estimated damage assessment',
    ],
    dwellySteps: [
      'Log emergency in Dwelly under Incidents > Flood',
      'Trigger insurance notification workflow',
      'Create maintenance job for remedial drying/repairs',
      'Schedule property inspection within 48 hours',
    ],
    icon: '🌊',
  },

  // ─── P2 — Urgent ──────────────────────────────────────────
  {
    id: 'boiler-failure',
    title: 'Total Heating / Boiler Failure',
    priority: 'P2',
    priorityLabel: 'Urgent',
    immediateActions: [
      'Check the boiler pressure gauge and thermostat settings',
      'Attempt a boiler reset (hold reset button for 5 seconds)',
      'If no resolution, arrange an emergency Gas Safe engineer',
      'Provide tenants with temporary electric heaters if needed',
    ],
    whoToContact: [
      { role: 'Approved Gas Engineer', detail: 'Via contractor list' },
      { role: 'Dwelly Maintenance Team', detail: 'maintenance@dwelly.co.uk' },
      { role: 'Property Owner', detail: 'Via Dwelly CRM' },
    ],
    escalationPath: ['PM / Maintenance Coordinator', 'Gas Engineer', 'Operations Manager'],
    documentationRequired: [
      'Boiler model and serial number',
      'Engineer diagnosis report',
      'Tenant communication log',
      'Temporary heating provision record',
    ],
    dwellySteps: [
      'Create urgent maintenance job in Dwelly',
      'Assign approved Gas Safe contractor',
      'Log tenant communication in property timeline',
      'Update job status once repair confirmed',
    ],
    icon: '🔧',
  },
  {
    id: 'lock-out',
    title: 'Tenant Lockout or Security Breach',
    priority: 'P2',
    priorityLabel: 'Urgent',
    immediateActions: [
      'Verify tenant identity using Dwelly records',
      'Arrange emergency locksmith from approved list',
      'If break-in suspected, advise tenant to call 101 (non-emergency police)',
      'Secure the property once access is restored',
    ],
    whoToContact: [
      { role: 'Emergency Locksmith', detail: 'Via approved contractor list' },
      { role: 'Dwelly Office', detail: 'During business hours' },
      { role: 'Non-Emergency Police', detail: '101 (if break-in)' },
    ],
    escalationPath: ['PM on duty', 'Locksmith', 'Operations Manager'],
    documentationRequired: [
      'Tenant ID verification record',
      'Locksmith callout receipt',
      'New key cutting / lock change record',
      'Police crime reference (if applicable)',
    ],
    dwellySteps: [
      'Log request under Maintenance > Lock/Security',
      'Verify tenant identity via CRM before authorising',
      'Update key register if locks are changed',
      'Attach locksmith invoice to the property record',
    ],
    icon: '🔐',
  },
  {
    id: 'electrical-fault',
    title: 'Electrical Fault or Power Loss',
    priority: 'P2',
    priorityLabel: 'Urgent',
    immediateActions: [
      'Do NOT touch any exposed wiring or damaged sockets',
      'Switch off the mains if a fault is suspected',
      'Check if the issue is localised or affects the whole street',
      'Arrange NICEIC-approved electrician if property-specific',
    ],
    whoToContact: [
      { role: 'Power Cut Hotline', detail: '105' },
      { role: 'Approved Electrician', detail: 'Via contractor list' },
      { role: 'Dwelly Maintenance Team', detail: 'maintenance@dwelly.co.uk' },
    ],
    escalationPath: ['PM / Maintenance Coordinator', 'Electrician', 'Operations Manager'],
    documentationRequired: [
      'Description of fault and location',
      'EICR review if overdue',
      'Electrician report and remedial actions',
      'Tenant notification record',
    ],
    dwellySteps: [
      'Create urgent maintenance job in Dwelly',
      'Check EICR expiry date on property record',
      'Assign NICEIC-approved contractor',
      'Attach electrical report once complete',
    ],
    icon: '⚡',
  },

  // ─── P3 — Standard ────────────────────────────────────────
  {
    id: 'pest-infestation',
    title: 'Pest Infestation Report',
    priority: 'P3',
    priorityLabel: 'Standard',
    immediateActions: [
      'Identify the type of pest (rodents, insects, birds)',
      'Advise tenant on immediate hygiene measures',
      'Arrange pest control visit within 24 hours',
      'Inspect neighbouring units if in a block',
    ],
    whoToContact: [
      { role: 'Pest Control', detail: 'Via approved contractor list' },
      { role: 'Dwelly Maintenance Team', detail: 'maintenance@dwelly.co.uk' },
      { role: 'Local Council EH', detail: 'If persistent issue' },
    ],
    escalationPath: ['PM / Maintenance Coordinator', 'Pest Control', 'Environmental Health'],
    documentationRequired: [
      'Type and severity of infestation',
      'Photographs of evidence',
      'Pest control report and treatment plan',
      'Follow-up inspection date',
    ],
    dwellySteps: [
      'Log maintenance job under Pest Control category',
      'Assign approved pest contractor',
      'Schedule follow-up inspection in 2 weeks',
      'Update property record with treatment history',
    ],
    icon: '🐀',
  },
  {
    id: 'minor-leak',
    title: 'Minor Leak or Damp Issue',
    priority: 'P3',
    priorityLabel: 'Standard',
    immediateActions: [
      'Place containers to catch dripping water',
      'Identify the likely source (roof, pipe, condensation)',
      'Take photographs and note exact locations',
      'Schedule plumber or damp specialist visit',
    ],
    whoToContact: [
      { role: 'Dwelly Maintenance Team', detail: 'maintenance@dwelly.co.uk' },
      { role: 'Approved Plumber', detail: 'Via contractor list' },
      { role: 'Property Owner', detail: 'Via Dwelly CRM' },
    ],
    escalationPath: ['PM / Maintenance Coordinator', 'Plumber / Specialist', 'Operations Manager'],
    documentationRequired: [
      'Photographs with timestamps',
      'Location and severity description',
      'Plumber / specialist report',
      'Damp meter readings if available',
    ],
    dwellySteps: [
      'Log maintenance job under Plumbing / Damp category',
      'Attach photographs to the job record',
      'Schedule contractor visit within 24 hours',
      'Set reminder for follow-up inspection',
    ],
    icon: '💧',
  },
  {
    id: 'antisocial-behaviour',
    title: 'Antisocial Behaviour Report',
    priority: 'P3',
    priorityLabel: 'Standard',
    immediateActions: [
      'Listen to the complainant and document the report',
      'Advise the tenant to keep a diary of incidents',
      'If there is immediate danger, advise calling 999/101',
      'Issue a first advisory letter to the reported party',
    ],
    whoToContact: [
      { role: 'Dwelly PM on duty', detail: 'Assigned property manager' },
      { role: 'Non-Emergency Police', detail: '101 (if needed)' },
      { role: 'Local Authority ASB Team', detail: 'If escalation required' },
    ],
    escalationPath: ['PM on duty', 'Operations Manager', 'Legal / ASB Team'],
    documentationRequired: [
      'Written complaint with dates and times',
      'Diary log from complainant',
      'Copies of advisory letters sent',
      'Outcome record and resolution date',
    ],
    dwellySteps: [
      'Log under Tenancy > ASB Reports on the property record',
      'Attach complainant statement and diary log',
      'Set 7-day review reminder',
      'Escalate via workflow if unresolved after 14 days',
    ],
    icon: '📢',
  },
]
