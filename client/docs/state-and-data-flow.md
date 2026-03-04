# State and Data Flow

This document describes how data moves through frontend state, API clients, and UI layers.

---

## 1) Data Flow Pattern

Canonical path:

`UI Event -> Store Action -> API Client -> Axios -> Backend -> Store Update -> UI Render`

This keeps pages thin and pushes request concerns into dedicated stores/API modules.

---

## 2) Global State Stores

## `useAuthStore`

Location:

- `src/stores/useAuthStore.js`

State:

- `user`
- `token`
- `isLoading`
- `error`

Actions:

- `login(email, password)`
- `register(userData)`
- `fetchMe()`
- `logout()`
- `clearError()`

Notes:

- token initialized from localStorage
- logout clears token and user state

---

## `useCategoryStore`

State:

- `categories`
- `isLoading`

Actions:

- `fetchCategories()`

---

## `useProviderStore`

State:

- `providers`
- `myProfile`
- `isLoading`

Actions:

- `fetchProviders(params)`
- `fetchMyProfile()`

---

## `useBookingStore`

State:

- `bookings`
- `currentBooking`
- `pagination` (`page`, `pages`, `total`)
- `statusFilter`
- `isLoading`

Actions:

- `fetchMyBookings(params)`
- `fetchProviderBookings(params)`
- `fetchBookingById(id)`
- `setStatusFilter(status)`
- `setPage(page)`
- `clearBookings()`

---

## 3) API Layer

All network calls use axios instance from:

- `src/api/axios.js`

### Request Interceptor

- Reads token from localStorage
- Adds bearer token header if present

### Response Interceptor

- On `401`, clears token and hard-redirects to `/login`

Feature API modules:

- `authApi`
- `categoriesApi`
- `providersApi`
- `bookingsApi`
- `reviewsApi`
- `adminApi`

---

## 4) Pagination and Filtering

Booking list pages (customer/provider):

- store returns paginated payload from backend
- UI updates `setPage` and triggers re-fetch

Provider listing page:

- local filters:
  - city text
  - category id
- city input is debounced via `useDebounce`

---

## 5) Form Validation Pattern

Two layers:

- UI validators in `src/utils/validators.js`
  - immediate user feedback
- backend Joi validation
  - contract enforcement

Forms generally:

- keep local field state
- keep local `errors` object
- clear field errors on change
- show toast for request-level failures

---

## 6) Utility Modules in Data Flow

- `utils/storage.js`
  - token persistence abstraction
- `utils/constants.js`
  - role/status constants and role-home mapping
- `utils/formatters.js`
  - dates, currency, relative time for UI display

---

## 7) Guarded Route Data Flow

`ProtectedRoute` logic:

1. If no token -> navigate to `/login`
2. If token and user missing -> call `fetchMe`
3. While loading -> show full-screen spinner
4. On success -> render child routes

`RoleRoute` logic:

- compares current user role to allowed role list
- redirects to role-specific home when mismatched

---

## 8) Error Handling and UX

Typical strategy:

- inline field errors for validation
- toast notifications for operation outcome
- empty states for no-data views
- skeletons/spinners while loading

This avoids blank screens and gives action-specific feedback.

---

## 9) Related Docs

- [Architecture](./architecture.md)
- [Routes and Pages](./routes-pages.md)
