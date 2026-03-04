export const ROLES = {
  CUSTOMER: 'customer',
  PROVIDER: 'provider',
  ADMIN: 'admin',
}

export const BOOKING_STATUSES = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const STATUS_CONFIG = {
  requested: { label: 'Requested', tone: 'requested' },
  confirmed: { label: 'Confirmed', tone: 'confirmed' },
  'in-progress': { label: 'In Progress', tone: 'in-progress' },
  completed: { label: 'Completed', tone: 'completed' },
  cancelled: { label: 'Cancelled', tone: 'cancelled' },
}

export const ROLE_HOME = {
  customer: '/home',
  provider: '/provider/dashboard',
  admin: '/admin',
}
