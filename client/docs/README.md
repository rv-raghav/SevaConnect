# Frontend Documentation Index

This folder contains detailed frontend documentation for SevaConnect.

---

## Reading Order

1. [Setup and Environment](./setup-and-env.md)
2. [Architecture](./architecture.md)
3. [Design System](./design-system.md)
4. [State and Data Flow](./state-and-data-flow.md)
5. [Routes and Pages](./routes-pages.md)
6. [Animations and Interactions](./animations-and-interactions.md)

---

## Scope Covered

- Installation and local run workflow
- Environment variables and API base configuration
- Router and layout composition
- Zustand store responsibilities
- Axios API layer and auth handling
- Design tokens, component primitives, theming strategy
- Dark mode behavior
- Motion system (Framer Motion + CSS interactions)

---

## Code Landmarks

- Entry:
  - `client/src/main.jsx`
  - `client/src/App.jsx`
- Routing:
  - `client/src/routes/index.jsx`
  - `client/src/routes/ProtectedRoute.jsx`
  - `client/src/routes/RoleRoute.jsx`
- State:
  - `client/src/stores/*.js`
- API:
  - `client/src/api/*.js`
- Theme and UI primitives:
  - `client/src/index.css`
  - `client/src/components/ui/*`
