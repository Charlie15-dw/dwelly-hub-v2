// Shared constants for The Hub's training-request system.
//
// Training requests are for managers and admins only (property managers have no
// access). Requests are attributed — the requester is shown to admins.

// Who may raise or review training requests. Property managers are excluded.
export const TRAINING_REQUEST_ROLES = ['manager', 'admin'] as const

export function canAccessTrainingRequests(role: string | null | undefined): boolean {
  return role === 'manager' || role === 'admin'
}

export const TRAINING_REQUEST_TYPES = ['further', 'new_starter'] as const
export type TrainingRequestType = (typeof TRAINING_REQUEST_TYPES)[number]

export const TRAINING_TYPE_LABELS: Record<TrainingRequestType, string> = {
  further: 'Further training (existing team member)',
  new_starter: 'New starter training',
}

export const TRAINING_FOCUS_AREAS = [
  'CRM / System',
  'Finance',
  'Maintenance',
  'Compliance',
  'Lettings',
  'Onboarding',
  'General',
] as const
export type TrainingFocusArea = (typeof TRAINING_FOCUS_AREAS)[number]

export const TRAINING_URGENCIES = ['low', 'normal', 'high'] as const
export type TrainingUrgency = (typeof TRAINING_URGENCIES)[number]

export const TRAINING_URGENCY_LABELS: Record<TrainingUrgency, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
}

export const TRAINING_REQUEST_STATUSES = ['new', 'reviewing', 'scheduled', 'completed'] as const
export type TrainingRequestStatus = (typeof TRAINING_REQUEST_STATUSES)[number]

export const TRAINING_STATUS_LABELS: Record<TrainingRequestStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  scheduled: 'Scheduled',
  completed: 'Completed',
}

export const TRAINING_REQUEST_MAX_LENGTH = 5000
