## Security Model

This document explains the main security features and guarantees provided by the SevaConnect backend.

---

## Authentication

- **JWT-based authentication**:
  - On successful login or registration, the server returns a signed JWT.
  - The token is expected in the `Authorization` header as `Bearer <token>`.
  - Tokens include user ID and role.
  - Tokens are configured with a finite expiry (e.g., 7 days).

- **Password Security**:
  - Passwords are hashed using `bcryptjs` before being stored.
  - Plain-text passwords are never persisted or returned in responses.

---

## Authorization & Roles

Supported roles:

- `customer`
- `provider`
- `admin`

Enforcement:

- `authMiddleware`:
  - Parses and verifies JWTs.
  - Loads the associated user and attaches it to `req.user`.

- `roleMiddleware`:
  - Validates that `req.user.role` is in the allowed role list.
  - Returns `403 Forbidden` if role is not allowed.

Route-level usage ensures:

- Admin-only actions (e.g., creating categories, approving providers, viewing analytics) are inaccessible to non-admin users.
- Provider-only actions (e.g., provider profile, managing bookings) are inaccessible to customers.
- Customer-only actions (e.g., creating bookings, submitting reviews) are inaccessible to providers/admins where appropriate.

### Admin Role Injection Protection

- During registration, any attempt to set `role: "admin"` is ignored/downgraded to a safe default.
- Admin accounts should be seeded/managed outside of public registration.

---

## Input Validation

The backend uses **Joi** schemas (`validators/requestSchemas.js`) to validate:

- Request bodies (e.g., registration, login, bookings, reviews).
- Parameters such as IDs and query strings where necessary.

Invalid requests result in:

- `400 Bad Request` status.
- A clear validation message in the response body.

This prevents malformed data from entering the system and reduces risk of injection-style attacks.

---

## Rate Limiting

Rate limiting is implemented via `express-rate-limit` in `middlewares/rateLimiters.js`.

- Auth routes (`/api/auth/*`) are protected with stricter limits (e.g., 100 requests per 15 minutes per IP).
- Limits can be adjusted for production load.

This slows down brute-force login attempts and abusive clients.

---

## HTTP Hardening

### Helmet

- `helmet()` is applied globally in `app.js` to add secure HTTP headers:
  - Disables certain browser features that can be abused.
  - Helps protect against XSS, clickjacking, and other common attacks.

### CORS

- CORS is restricted via `CORS_ORIGIN` configuration:
  - In production, only known front-end origins should be allowed.
  - In development, all origins can be allowed for convenience.

---

## Data Protection & Privacy

- Sensitive fields (e.g., `password`, internal version fields like `__v`) are stripped before sending user objects back to clients.
- Mongoose schemas and controllers ensure that only intended fields are exposed.

---

## Error Handling

- All unexpected errors propagate to `errorHandler`:
  - Logs details via `logger`.
  - Returns sanitized error messages to clients.
  - Avoids leaking stack traces or internal implementation details in production.

For testing how security protections behave (e.g., blocked admin registration, unauthorized access), see the [Testing & Quality](./testing.md) document and the existing phase test scripts.

