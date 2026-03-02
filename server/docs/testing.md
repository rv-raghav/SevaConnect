## Testing & Quality

SevaConnect includes end-to-end and integration-style test scripts that exercise the main flows of the platform.

This document explains how tests are organized and how to run them.

---

## Test Phases

Existing tests are located in the `server` root:

- `test-auth.js` – **Phase 1**: Authentication & security.
- `test-phase2.js` – **Phase 2**: Marketplace structure (categories, providers, filtering).
- `test-phase3-e2e.js` – **Phase 3-4**: End-to-end booking workflow.
- `test-phase6-7.js` – **Phase 6-7**: Admin features & hardening checks.

Each script:

- Uses Node's `http` module to make real HTTP requests to `http://localhost:5000`.
- Asserts on HTTP status codes and response payloads.
- Prints a summary of passed/failed assertions.

---

## Prerequisites for Testing

Before running tests, ensure:

1. MongoDB is running and accessible via `MONGO_URI` in `.env`.
2. The backend server is running on `PORT` (default `5000`):

   ```bash
   cd server
   npm run dev
   # or
   npm start
   ```

3. Your `.env` is correctly configured (see [Configuration & Environment](./configuration.md)).

---

## Running Tests

You can run individual phase scripts:

```bash
cd server

# Phase 1 - Auth
node test-auth.js

# Phase 2 - Marketplace
node test-phase2.js

# Phase 3-4 - E2E Workflow
node test-phase3-e2e.js

# Phase 6-7 - Admin & Hardening
node test-phase6-7.js
```

Or, using the `npm test` script (see `package.json`):

```bash
cd server
npm test
```

---

## What Is Covered

- **Authentication & Security**
  - User registration for customers and providers.
  - Password validation (minimum length).
  - Duplicate email handling.
  - Login success and failure paths.
  - Protected `/me` endpoint behavior.
  - Admin role injection prevention.

- **Marketplace**
  - ServiceCategory CRUD with admin-only access.
  - Duplicate category protection.
  - Public category listing.
  - Provider profile creation, upsert, and validation.
  - Provider search and filtering by city and category.

- **Bookings & Workflow**
  - Booking creation by customers with valid provider/category.
  - Provider acceptance and status transitions.
  - Conflict detection (in phase workflow tests).
  - Work logs and image uploads (where configured).

- **Admin & Hardening**
  - Provider approval and rejection.
  - Admin-only review deletion.
  - Analytics endpoint sanity.

---

## Extending Tests

To add more tests:

- Create new scripts (e.g., `test-validation.js`) following the existing pattern:
  - Reuse the `request` helper.
  - Group tests with clear labels and assertions.
- Alternatively, introduce a test framework (e.g., Jest) and place tests in a `tests/` directory, while keeping current scripts for black-box end-to-end checks.

When adding new features, aim to:

- Cover both **happy paths** and **edge/error cases**.
- Exercise role-based access control and security constraints.
- Validate data integrity (e.g., invalid IDs, missing fields, boundary values).

For specific HTTP details of each endpoint, see the [API Reference](./api-reference.md) and [API Usage Examples](./api-usage-examples.md).

