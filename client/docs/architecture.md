# Frontend Architecture

SevaConnect frontend is a React + Vite SPA with role-based route segmentation and shared design primitives.

---

## 1) Architectural Overview

Flow:

`Route Page -> Store Action -> API Client -> Axios Instance -> Backend`

Core layers:

- Routing and access control
- Role-specific layouts
- Page components
- Reusable UI primitives
- Zustand stores
- Axios API modules
- Utility modules (formatting/validation/storage/constants)

---

## 2) Entry and Bootstrap

- `src/main.jsx`
  - Imports global stylesheet
  - Mounts React root

- `src/App.jsx`
  - Wraps app with theme provider
  - Configures toaster
  - Hosts router

---

## 3) Routing and Access Control

Router definition:

- `src/routes/index.jsx`

Guards:

- `ProtectedRoute`
  - checks token existence
  - hydrates current user (`fetchMe`) when needed
- `RoleRoute`
  - enforces allowed role per route subtree

Route groups:

- Public (`/`)
- Auth (`/login`, `/register`)
- Customer (`/home`, `/providers`, `/book/:providerId`, `/bookings`, `/profile`)
- Provider (`/provider/*`)
- Admin (`/admin/*`)

Lazy loading:

- All page modules are loaded with React `lazy`.
- `Suspense` fallback uses shared `Spinner`.

---

## 4) Layout System

Layouts under `src/layouts` provide shell-level structure:

- `PublicLayout`
- `AuthLayout`
- `CustomerLayout`
- `ProviderLayout`
- `AdminLayout`

Shared shell behavior:

- top navigation/sidebars by role
- theme toggle access
- route transition animations via `PageTransitionOutlet`

---

## 5) State Management (Zustand)

Stores:

- `useAuthStore`
  - login/register/logout/fetchMe
  - token + user + loading + errors
- `useCategoryStore`
  - category list and loading state
- `useProviderStore`
  - provider list + provider profile
- `useBookingStore`
  - customer/provider bookings
  - pagination state
  - booking fetch by id

Pattern:

- store actions call API modules
- components subscribe directly to store state/actions

---

## 6) API Layer

`src/api/axios.js`:

- central axios instance
- baseURL from env
- request auth token injection
- response 401 handling and redirect

Feature clients:

- `auth.js`
- `categories.js`
- `providers.js`
- `bookings.js`
- `reviews.js`
- `admin.js`

---

## 7) UI Component Architecture

### Primitive UI (`src/components/ui`)

- `Button`
- `Modal`
- `Spinner`
- `Badge`
- `EmptyState`
- `Pagination`
- `ConfirmDialog`
- `ThemeProvider` / `ThemeToggle`
- `BookingTimeline`
- `PageTransitionOutlet`

### Shared Domain UI (`src/components/shared`)

- `BrandMark`
- `Logo`
- `CategoryCard`
- `ProviderCard`
- `StatCard`

### Modal Workflows (`src/components/modals`)

- `ReviewModal`
- `RescheduleModal`
- `WorkUpdateModal`
- `CategoryFormModal`

---

## 8) Theming and Styling Strategy

Global style system lives in:

- `src/index.css`

Key characteristics:

- design tokens via CSS variables
- light/dark theme palette using `data-theme` attribute on root element
- shared utility classes for cards/buttons/inputs/layout/empty states
- custom spacing scale and typography hierarchy

---

## 9) Motion and Interaction Strategy

Libraries:

- Framer Motion (`framer-motion`)

Usage examples:

- modal enter/exit transitions
- route/page transitions
- card hover lift animations

Plus CSS micro-interactions:

- button press feedback
- focus ring behavior
- skeleton shimmer loading

See [Animations and Interactions](./animations-and-interactions.md).

---

## 10) Data and UI Boundaries

- Business logic is primarily backend-owned.
- Frontend applies lightweight validation and UI state transitions.
- API errors are surfaced via toasts and inline field messages.

---

## 11) Related Docs

- [State and Data Flow](./state-and-data-flow.md)
- [Routes and Pages](./routes-pages.md)
- [Design System](./design-system.md)
