# SevaConnect Frontend (`client`)

React + Vite application for the SevaConnect marketplace UI.

This app serves:

- Public experience (landing, auth)
- Customer dashboards and booking flows
- Provider workflows (profile, bookings, work updates)
- Admin dashboards (analytics, approvals, moderation)

---

## Quick Start

```bash
cd client
npm install
npm run dev
```

Default local URL: `http://localhost:5173`

---

## Environment

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

If omitted, API defaults to `http://localhost:5000/api`.

---

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

---

## Architecture At A Glance

- Routing: React Router with role-based route guards
- State: Zustand stores (`auth`, `categories`, `providers`, `bookings`)
- API: Axios clients with auth interceptors
- UI: Shared component primitives + domain components
- Styling: Tailwind CSS v4 + CSS tokens + utility classes
- Motion: Framer Motion for transitions and modals

---

## Frontend Documentation

Read in this order:

1. `docs/README.md`
2. `docs/setup-and-env.md`
3. `docs/architecture.md`
4. `docs/design-system.md`
5. `docs/state-and-data-flow.md`
6. `docs/routes-pages.md`
7. `docs/animations-and-interactions.md`

---

## Related

- Root docs: `../README.md`
- Backend app: `../server/README.md`
