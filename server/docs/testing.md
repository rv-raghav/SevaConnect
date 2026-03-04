# Testing Guide

SevaConnect backend currently uses executable Node scripts for integration-style phase testing.

These scripts call real HTTP endpoints and validate expected behavior.

---

## 1) Test Files

Located in `server/tests/`:

- `tests/test-auth.js` - auth and role-injection protection
- `tests/test-phase2.js` - category/provider profile/filtering flows
- `tests/test-phase3-e2e.js` - booking lifecycle and review flow
- `tests/test-phase6-7.js` - admin approvals, booking ownership checks, analytics, review moderation

---

## 2) Prerequisites Before Running Tests

1. Configure `server/.env` with valid DB and auth settings.
2. Ensure MongoDB is running and reachable.
3. Start backend API (`npm run dev` or `npm start`) on expected port.
4. For upload-related behavior, ensure Cloudinary env vars are valid.

---

## 3) Run Commands

From `server/`:

```bash
npm run test:auth
npm run test:phase2
npm run test:phase3
npm run test:phase6-7
npm run test:all
```

Each script prints assertion-level pass/fail output and a summary.

Direct node equivalents:

```bash
node tests/test-auth.js
node tests/test-phase2.js
node tests/test-phase3-e2e.js
node tests/test-phase6-7.js
```

---

## 4) Coverage by Phase

### Phase 1 (`tests/test-auth.js`)

- Customer and provider registration
- Duplicate email conflict handling
- Password minimum length enforcement
- Login success/failure
- `/auth/me` protected route checks
- Admin role injection prevention

### Phase 2 (`tests/test-phase2.js`)

- Admin-only category write access
- Category create/update/list behavior
- Provider profile create/update/get
- Category validation in profile update
- Provider search filtering (city/category)

### Phase 3-4 (`tests/test-phase3-e2e.js`)

- End-to-end booking creation
- Provider transition path: accept -> start -> complete
- Invalid transition rejection
- Review submission and duplicate review rejection
- Customer/provider dashboard booking listing

### Phase 6-7 (`tests/test-phase6-7.js`)

- Admin provider listing and approval/rejection
- Booking GET by ID ownership checks for customer/provider/admin
- Review deletion impact on provider rating recalculation
- Analytics endpoint shape and access control

---

## 5) Test Data Strategy

Scripts generally:

- generate timestamp-based unique emails
- create users dynamically through API
- in some phases update admin role directly in DB for setup

This reduces collisions across repeated runs.

---

## 6) Typical Failure Categories

- Env/config issues:
  - missing `.env`
  - invalid `MONGO_URI`
  - invalid `JWT_SECRET`

- Authorization mismatches:
  - wrong token role for route
  - missing token

- Business rule violations:
  - invalid booking transitions
  - duplicate review submission
  - reschedule/cancel in disallowed status

---

## 7) Recommended Additional Tests

To expand quality coverage, add scripts or migrate to a framework (Jest/Vitest + Supertest):

- negative validation matrix for all endpoints
- upload boundary tests (file count, size, content-type)
- pagination and sorting edge cases
- concurrent booking acceptance conflict race tests
- token expiry and rotation behavior

---

## 8) CI Recommendation

Current scripts are CLI-based and suitable for CI job steps.

Typical pipeline order:

1. install dependencies
2. start Mongo service
3. start API
4. run `npm run test:all`
5. fail pipeline if any script exits non-zero

---

## 9) Related Docs

- [API Reference](./api-reference.md)
- [Security](./security.md)
