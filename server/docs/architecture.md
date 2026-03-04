# Backend Architecture

This document explains how SevaConnect backend is structured, how requests flow, and where business rules are enforced.

---

## 1) Layered Design

SevaConnect follows a clear layered flow:

`Route -> Middleware -> Controller -> Service -> Model (MongoDB)`

Cross-cutting utilities (errors, logger, transition checks) are consumed by multiple layers.

---

## 2) Folder Responsibilities

`server/src` structure and ownership:

- `index.js`
  - Loads env (`dotenv` + validated config import).
  - Connects to MongoDB.
  - Starts Express server.

- `app.js`
  - Express initialization.
  - Global middleware registration (`helmet`, `cors`, `express.json`).
  - Mounts route modules.
  - Registers 404 and global error handler.

- `config/`
  - `env.js`: Joi-based environment validation.
  - `cloudinary.js`: Cloudinary SDK configuration.

- `routes/`
  - Route declarations and middleware composition.
  - Keeps endpoint-to-controller mapping explicit.

- `controllers/`
  - Thin HTTP handlers.
  - Extract request values and call services.
  - Return JSON envelope and HTTP status.

- `services/`
  - Core business logic and invariants.
  - Model querying and mutation.
  - Throws `AppError` for operational failures.

- `models/`
  - Mongoose schema definitions and indexes.

- `middlewares/`
  - Authentication, authorization, validation, upload parsing, rate limiting, error handling.

- `validators/`
  - Joi schemas for body/query/params.

- `utils/`
  - Shared primitives:
    - `AppError`
    - `asyncHandler`
    - `bookingTransitions`
    - `logger`

---

## 3) Request Lifecycle

Example flow for protected write endpoint (`PATCH /api/bookings/:id/accept`):

1. Request hits route module (`bookingRoutes.js`).
2. Middlewares execute in route order:
   - `authMiddleware`
   - `roleMiddleware("provider")`
3. Controller (`bookingController.acceptBooking`) executes.
4. Controller calls service (`bookingService.acceptBooking`).
5. Service:
   - Loads booking
   - Checks ownership
   - Validates transition via `validateTransition`
   - Runs conflict check
   - Updates status and history
6. Controller returns `200` with normalized payload.
7. Errors at any step are propagated to global `errorHandler`.

---

## 4) Middleware Composition Strategy

Global middleware in `app.js`:

- `helmet()`
- `cors()`
- `express.json()`

Route-level middleware examples:

- Auth routes: `authRateLimiter`
- Protected routes: `authMiddleware`
- Role-guarded routes: `roleMiddleware(...)`
- Request schema enforcement: `validateRequest(...)`
- Multipart uploads: `upload.array("images", 5)`

Terminal middleware:

- `notFound`
- `errorHandler`

---

## 5) Service Layer Domain Rules

Business-critical rules are in services, not controllers:

- `authService`
  - Prevents admin role assignment during public registration
  - Password validation and uniqueness checks

- `providerService`
  - Only providers can upsert profiles
  - Category ID validity and active-state checks

- `bookingService`
  - Provider approval and availability checks
  - Future scheduling validation
  - State-machine transitions (`bookingTransitions.js`)
  - Provider conflict checks
  - Cloudinary upload integration and rollback strategy on upload failure

- `reviewService`
  - Review only after completion
  - One review per booking
  - Rating recalculation via aggregation

- `adminService`
  - Provider filtering by approval status
  - Approval/rejection updates
  - Analytics aggregation pipelines

---

## 6) Error Strategy

Primary path:

- Operational errors are thrown as `AppError(message, statusCode)`.
- `asyncHandler` wraps controllers and forwards thrown errors.
- `errorHandler` normalizes:
  - Mongoose validation errors
  - Duplicate key errors
  - Cast errors
  - JWT errors
  - Multer errors
  - Invalid JSON body errors

API response format:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 7) Response Envelope

Controllers return consistent structure:

```json
{
  "success": true,
  "data": {}
}
```

For list + pagination endpoints:

- `data.total`
- `data.page`
- `data.pages`
- `data.bookings`

---

## 8) Booking State Machine Location

State graph lives in:

- `server/src/utils/bookingTransitions.js`

Valid transitions are role-aware, e.g.:

- provider: `requested -> confirmed`
- provider: `confirmed -> in-progress`
- provider: `in-progress -> completed`
- customer: `requested|confirmed -> cancelled`

Invalid transitions produce `400`.

---

## 9) Performance and Query Patterns

Notable schema indexes:

- `ProviderProfile.categories`
- `ProviderProfile.availabilityStatus`
- `Booking.providerId + scheduledDateTime`
- `Booking.customerId`
- `Booking.status`
- `Review.providerId`

These support:

- Provider filtering
- Booking lookups by owner and status
- Conflict checks
- Rating aggregation

---

## 10) Related Documentation

- [Overview](./overview.md)
- [Configuration](./configuration.md)
- [Database Model](./database.md)
- [API Reference](./api-reference.md)
- [Security](./security.md)
