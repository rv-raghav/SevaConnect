# SevaConnect - Local Services Marketplace (MERN)

SevaConnect is a full-stack local services marketplace where:

- Customers discover providers, book services, track status, and submit reviews.
- Providers manage profiles, process bookings, and upload before/after work updates.
- Admins moderate providers/reviews and monitor analytics.

This repository contains both backend and frontend applications:

- `server/` - Node.js + Express + MongoDB API
- `client/` - React + Vite frontend

---

## 1) Monorepo Structure

```text
local-services-platform/
|-- client/                     # React frontend
|   |-- README.md               # Frontend app guide
|   |-- public/                 # Static assets (favicon, etc.)
|   |-- src/
|   |   |-- api/                # Axios API clients
|   |   |-- components/         # UI/shared/modal components
|   |   |-- hooks/              # Custom hooks (debounce, theme)
|   |   |-- layouts/            # Public/auth/customer/provider/admin shells
|   |   |-- pages/              # Route pages grouped by role
|   |   |-- routes/             # Router + protection layers
|   |   |-- stores/             # Zustand state stores
|   |   |-- utils/              # Formatters, validators, constants, storage
|   |-- docs/                   # Frontend documentation set
|
|-- server/                     # Express backend
|   |-- README.md               # Backend app guide
|   |-- src/
|   |   |-- config/             # env validation + cloudinary config
|   |   |-- controllers/        # HTTP handlers
|   |   |-- middlewares/        # auth/role/validation/upload/rate-limits/errors
|   |   |-- models/             # Mongoose schemas
|   |   |-- routes/             # API route modules
|   |   |-- services/           # Business logic
|   |   |-- utils/              # AppError, async wrapper, transitions, logger
|   |   |-- validators/         # Joi request schemas
|   |-- docs/                   # Backend documentation set
|   |   |-- README.md           # Backend docs index
|   |-- tests/                  # phase test scripts
|
|-- README.md                   # This document
```

---

## 2) Core Capabilities

### Customer

- Register/login and authenticated session restore (`/auth/me`).
- Browse categories and provider listings with city/category filters.
- Create bookings with future schedule validation.
- Booking dashboard with status timeline and pagination.
- Reschedule/cancel rules and post-completion review submission.

### Provider

- Create/update provider profile (categories, bio, experience, availability).
- Booking operations: accept -> start -> complete.
- Upload before/after images and notes for work updates.
- Provider dashboard stats and upcoming booking visibility.

### Admin

- Provider approval and rejection workflow.
- Category management (create/update, base pricing).
- Review moderation.
- Analytics dashboard (users/providers/bookings/revenue trends).

---

## 3) Tech Stack

### Frontend (`client/`)

- React 19, React Router 7, Zustand
- Vite 7
- Axios
- Tailwind CSS 4 (+ forms plugin)
- Framer Motion
- Recharts
- React Hot Toast

### Backend (`server/`)

- Node.js + Express 4
- MongoDB + Mongoose
- Joi validation
- JWT auth
- bcryptjs password hashing
- multer for multipart uploads
- Cloudinary image storage
- helmet + cors + express-rate-limit

---

## 4) Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm 9+
- MongoDB (local or Atlas)
- Cloudinary account (for work image uploads)

---

## 5) Environment Setup

Create these files before running the project.

### Backend env (`server/.env`)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/seva-connect
JWT_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=http://localhost:5173
```

Backend env variables are validated at startup in `server/src/config/env.js`.

### Frontend env (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

If omitted, frontend defaults to `http://localhost:5000/api`.

---

## 6) Installation

From repository root, install both apps:

```bash
cd server
npm install

cd ../client
npm install
```

---

## 7) Running Locally

Use two terminals.

### Terminal 1 - backend

```bash
cd server
npm run dev
```

### Terminal 2 - frontend

```bash
cd client
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## 8) Scripts Reference

### Backend (`server/package.json`)

- `npm run dev` - start API with nodemon
- `npm start` - start API in normal mode
- `npm run test:auth` - run phase 1 auth tests
- `npm run test:phase2` - run phase 2 marketplace tests
- `npm run test:phase3` - run phase 3-4 booking/review E2E tests
- `npm run test:phase6-7` - run phase 6-7 admin/hardening tests
- `npm run test:all` - run all backend phase tests sequentially

### Frontend (`client/package.json`)

- `npm run dev` - Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production bundle
- `npm run lint` - ESLint

---

## 9) Quality Gates

Recommended checks:

```bash
cd client
npm run lint
npm run build
```

Backend phase scripts:

```bash
cd server
npm run test:auth
npm run test:phase2
npm run test:phase3
npm run test:phase6-7
# or run all phases
npm run test:all
```

---

## 10) Seed Data

A backend seed script is available:

```bash
cd server
node src/seed.js
```

This script creates admin/customer/provider accounts, categories, bookings, and reviews.

---

## 11) Architecture Snapshot

### Backend request path

`route -> middleware (auth/role/validation) -> controller -> service -> model`

### Frontend data path

`page -> store action -> api client -> axios instance -> backend`

### Booking lifecycle

`requested -> confirmed -> in-progress -> completed`

Cancellation rules are role and state dependent (documented in backend docs).

---

## 12) Documentation Map

### Root

- [Project README](./README.md)
- [Frontend App README](./client/README.md)
- [Backend App README](./server/README.md)

### Frontend Docs (`client/docs`)

- [Frontend Docs Index](./client/docs/README.md)
- [Architecture](./client/docs/architecture.md)
- [Setup and Env](./client/docs/setup-and-env.md)
- [Design System](./client/docs/design-system.md)
- [State and Data Flow](./client/docs/state-and-data-flow.md)
- [Routes and Pages](./client/docs/routes-pages.md)
- [Animations and Interactions](./client/docs/animations-and-interactions.md)

### Backend Docs (`server/docs`)

- [Backend Docs Index](./server/docs/README.md)
- [Overview](./server/docs/overview.md)
- [Architecture](./server/docs/architecture.md)
- [Configuration](./server/docs/configuration.md)
- [Database Model](./server/docs/database.md)
- [API Reference](./server/docs/api-reference.md)
- [API Usage Examples](./server/docs/api-usage-examples.md)
- [Security](./server/docs/security.md)
- [Testing](./server/docs/testing.md)

---

## 13) Troubleshooting

### Backend fails on startup with env validation errors

- Check required variables in `server/.env`.
- Ensure `JWT_SECRET` length is at least 8 characters.

### Frontend shows network failures

- Verify backend is running.
- Verify `VITE_API_URL` points to backend `/api` base.
- Check CORS settings (`CORS_ORIGIN`) in backend env.

### 401 loops on frontend

- Token may be invalid/expired.
- Axios interceptor clears token and redirects to `/login` by design.

### Image upload issues

- Check Cloudinary env variables.
- Ensure image count and size constraints (max 5 images per request, 5MB each from multer).

---

## 14) Security Notes

- Public registration cannot create admin users.
- JWT is required on protected routes.
- Role middleware enforces route-level permissions.
- Joi validation guards body/params/query.
- Auth routes are rate-limited.

For full details, see [server/docs/security.md](./server/docs/security.md).

---
