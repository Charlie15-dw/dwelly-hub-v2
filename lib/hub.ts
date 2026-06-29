// Shared constants for The Hub's anonymous Q&A.

export const HUB_QUESTION_CATEGORIES = [
  'CRM',
  'Finance',
  'Maintenance',
  'Onboarding',
  'General',
] as const

export type HubQuestionCategory = (typeof HUB_QUESTION_CATEGORIES)[number]

export const HUB_QUESTION_STATUSES = ['new', 'reviewing', 'answered'] as const

export type HubQuestionStatus = (typeof HUB_QUESTION_STATUSES)[number]

export const HUB_STATUS_LABELS: Record<HubQuestionStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  answered: 'Answered',
}

export const HUB_QUESTION_MAX_LENGTH = 5000
