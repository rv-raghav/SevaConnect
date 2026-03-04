# Security Model

This document describes authentication, authorization, input hardening, and operational security controls in the backend.

---

## 1) Authentication

### JWT Token Strategy

- Tokens are generated in `authService.generateToken`.
- Payload includes:
  - `userId`
  - `role`
- Token expiry: `7d`.
- Secret key: `JWT_SECRET`.

### Verification

`authMiddleware`:

- reads `Authorization: Bearer <token>`
- verifies token signature
- loads user from DB to ensure account still exists
- attaches `{ userId, role }` to `req.user`

Failure returns:

- `401` for missing/invalid token or missing user.

---

## 2) Authorization

Role guard middleware:

- `roleMiddleware(...roles)`

Behavior:

- if `req.user` missing -> `401`
- if role not allowed -> `403`

Roles:

- `customer`
- `provider`
- `admin`

---

## 3) Admin Role Injection Prevention

Public registration can pass `role`, but service layer enforces:

- only `customer` and `provider` accepted
- any other value (including `admin`) becomes `customer`

This prevents admin account creation via public endpoint.

---

## 4) Input Validation

`validateRequest` middleware applies Joi schemas for:

- `params`
- `query`
- `body`

Validation options:

- `abortEarly: false`
- `allowUnknown: false`
- `stripUnknown: true`

Impact:

- rejects malformed input early with `400`
- reduces injection and schema abuse risk
- ensures controllers/services receive normalized values

---

## 5) Rate Limiting

Auth routes are protected by `authRateLimiter`:

- window: 15 minutes
- max: 100 requests per IP

Applied at route mount:

- `/api/auth/*`

This mitigates brute force and auth endpoint abuse.

---

## 6) HTTP Security Headers

`helmet()` is applied globally in `app.js`.

Provides default hardening for common browser and transport attack vectors (header-level protections).

---

## 7) CORS Control

Configured in `app.js` using `CORS_ORIGIN`.

- explicit origin allow-list when configured
- permissive mode when unset (development convenience)

Production recommendation:

- always set explicit, trusted frontend origins.

---

## 8) Password Security

In `User` model:

- passwords hashed with bcrypt pre-save hook
- stored hash only
- password field excluded by default (`select: false`)

Login path explicitly selects password hash for comparison only.

---

## 9) Upload Security Controls

Upload middleware (`multer`) enforces:

- memory storage
- per-file size max 5MB
- route-level max files: 5

Business checks enforce:

- provider ownership of booking
- valid `type` query (`before` or `after`)
- state constraints (`before` in-progress, `after` completed)

---

## 10) Booking Integrity Controls

Security of booking updates is enforced by:

- ownership checks (customer/provider/admin context)
- transition validation (`bookingTransitions.js`)
- provider schedule conflict check at acceptance

This prevents unauthorized state tampering and invalid workflow progression.

---

## 11) Error Handling and Data Leakage Control

Global `errorHandler`:

- normalizes known framework/model/auth/upload errors
- avoids exposing stack traces/internal details by default
- returns minimal safe error structure

Sensitive data controls:

- password never returned in API payloads
- schema/internal fields stripped where needed

---

## 12) Production Hardening Recommendations

- Use strong random `JWT_SECRET`.
- Restrict `CORS_ORIGIN` to exact frontend hosts.
- Enable HTTPS and secure proxy config in deployment.
- Rotate Cloudinary and DB credentials periodically.
- Add structured audit logs for admin actions.
- Add IP/device anomaly monitoring for auth endpoints.

---

## 13) Related Docs

- [Configuration](./configuration.md)
- [Architecture](./architecture.md)
- [Testing](./testing.md)
