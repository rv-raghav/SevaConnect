# SevaConnect Backend Overview

SevaConnect backend is a role-aware REST API that powers marketplace workflows for:

- Customers
- Providers
- Admins

It is built with Express + MongoDB and organized with a controller/service/model architecture.

---

## 1) Product Scope Covered by Backend

### Authentication and Identity

- User registration and login
- JWT token issuance
- `GET /api/auth/me` for session bootstrap
- Customer/provider role registration with admin-role injection prevention

### Marketplace

- Public category listing
- Public provider listing with optional `city` and `category` filters
- Provider profile create/update and retrieval

### Booking Lifecycle

- Customer booking creation
- Provider transitions:
  - accept
  - start
  - complete
- Cancellation and reschedule paths with transition validation
- Status history tracking
- Work update uploads (`before`/`after`) with Cloudinary storage

### Reviews and Ratings

- Customer review submission only for completed bookings
- One review per booking
- Provider rating/total review aggregation and recalculation
- Admin review deletion moderation path

### Admin Operations

- Provider list and approval/rejection
- Category create/update
- Analytics aggregation endpoints
- Reviews listing for moderation

---

## 2) API Surface Summary

Base path for most endpoints:

`/api`

Primary route groups:

- `/api/auth/*`
- `/api/categories`
- `/api/providers`
- `/api/provider/*`
- `/api/bookings/*`
- `/api/reviews`
- `/api/admin/*`

Detailed contracts are documented in:

- [API Reference](./api-reference.md)
- [API Usage Examples](./api-usage-examples.md)

---

## 3) Role Model

Roles in system:

- `customer`
- `provider`
- `admin`

Key role behavior:

- Public registration accepts customer/provider, not admin.
- Provider accounts are created as unapproved by default.
- Admin routes require both auth middleware and role middleware.

---

## 4) High-Level Data Model

Core collections:

- `User`
- `ServiceCategory`
- `ProviderProfile`
- `Booking`
- `Review`

Relationships:

- `ProviderProfile.userId -> User._id`
- `Booking.customerId/providerId/categoryId -> User/ServiceCategory`
- `Review.bookingId/customerId/providerId -> Booking/User`

See [Database Model](./database.md) for field-level details.

---

## 5) Security Controls Built In

- Helmet headers
- CORS origin control
- JWT verification
- Role-based authorization
- Joi request validation
- Auth route rate limiting
- Global error normalization
- Multer constraints for uploads

See [Security](./security.md) for details and operational guidance.

---

## 6) Runtime Dependencies and Integrations

- MongoDB via Mongoose
- Cloudinary for image uploads
- JWT for auth
- Joi for schema validation

Configuration details:

- [Configuration](./configuration.md)

---

## 7) Developer Entry Points

Backend startup entry:

- `server/src/index.js`

Express app assembly:

- `server/src/app.js`

Documentation deep-dive:

- [Architecture](./architecture.md)
- [Testing](./testing.md)
