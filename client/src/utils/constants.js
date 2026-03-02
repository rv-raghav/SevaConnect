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
  requested: { label: 'Requested', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  confirmed: { label: 'Confirmed', color: 'bg-indigo-50 text-primary border-indigo-200' },
  'in-progress': { label: 'In Progress', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-200' },
}

export const ROLE_HOME = {
  customer: '/home',
  provider: '/provider/dashboard',
  admin: '/admin',
}
