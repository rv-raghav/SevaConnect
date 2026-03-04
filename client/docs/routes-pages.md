# Routes and Pages

This document maps route paths to layouts/pages and summarizes each page's responsibility.

---

## 1) Router Topology

Router source:

- `client/src/routes/index.jsx`

Route groups:

- Public
- Auth
- Customer
- Provider
- Admin

All pages are lazy loaded.

---

## 2) Public Routes

### `/`

- Layout: `PublicLayout`
- Page: `public/LandingPage`
- Responsibilities:
  - hero and service discovery entry
  - category preview and trust blocks
  - CTA to registration/dashboard depending on auth state

---

## 3) Auth Routes

### `/login`

- Layout: `AuthLayout`
- Page: `public/LoginPage`
- Responsibilities:
  - credential login
  - inline validation and auth error display
  - redirect to role home on success

### `/register`

- Layout: `AuthLayout`
- Page: `public/RegisterPage`
- Responsibilities:
  - role selection (customer/provider)
  - registration form and validation
  - role-aware messaging for provider approvals

---

## 4) Customer Routes

Guard:

- `ProtectedRoute` + `RoleRoute(allowedRoles=["customer"])`

Layout:

- `CustomerLayout`

Routes:

- `/home`
  - `customer/CustomerHomePage`
  - category + featured provider exploration

- `/providers`
  - `customer/ProviderListingsPage`
  - debounced city search + category filter + provider cards

- `/book/:providerId`
  - `customer/ScheduleServicePage`
  - booking creation form and provider summary

- `/bookings`
  - `customer/CustomerBookingsPage`
  - booking list, timeline, tabs, review/reschedule/cancel actions

- `/profile`
  - `customer/ProfileSettingsPage`
  - account information view

---

## 5) Provider Routes

Guard:

- `ProtectedRoute` + `RoleRoute(allowedRoles=["provider"])`

Layout:

- `ProviderLayout`

Routes:

- `/provider/dashboard`
  - `provider/ProviderDashboardPage`
  - earnings, ratings, and upcoming bookings summary

- `/provider/bookings`
  - `provider/ProviderBookingsPage`
  - booking management actions:
    - accept/start/complete
    - upload before/after work updates

- `/provider/profile`
  - `provider/ProviderProfilePage`
  - profile and service offering updates

---

## 6) Admin Routes

Guard:

- `ProtectedRoute` + `RoleRoute(allowedRoles=["admin"])`

Layout:

- `AdminLayout`

Routes:

- `/admin`
  - `admin/AdminDashboardPage`
  - KPI snapshot + trends + quick management actions

- `/admin/analytics`
  - `admin/AdminAnalyticsPage`
  - charts for bookings, revenue, status mix, user growth

- `/admin/providers`
  - `admin/AdminProvidersPage`
  - provider approval/rejection workflow

- `/admin/categories`
  - `admin/AdminCategoriesPage`
  - category CRUD modal workflow

- `/admin/reviews`
  - `admin/AdminReviewsPage`
  - review moderation and deletion

---

## 7) Shared Modal Workflows

- `ReviewModal`
  - customer review submission
- `RescheduleModal`
  - customer booking reschedule
- `WorkUpdateModal`
  - provider drag/drop image updates
- `CategoryFormModal`
  - admin category create/update

---

## 8) Fallback Route

- `*` redirects to `/`.

---

## 9) Related Docs

- [Architecture](./architecture.md)
- [State and Data Flow](./state-and-data-flow.md)
