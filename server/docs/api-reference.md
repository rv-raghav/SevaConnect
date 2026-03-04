# API Reference

Base URL (local):

`http://localhost:5000`

API prefix:

`/api`

---

## 1) Response Format

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 2) Authentication

Bearer token format:

`Authorization: Bearer <jwt>`

Protected routes require valid token; role-gated routes require matching role.

---

## 3) Auth Routes

### POST `/api/auth/register`

Public registration.

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "pass1234",
  "role": "customer",
  "city": "Mumbai"
}
```

Notes:

- Allowed public roles: `customer`, `provider`.
- Any other role (including `admin`) is coerced to `customer`.
- Provider registration creates unapproved account by default.

Response:

- `201 Created`
- `data` user object + `token`

---

### POST `/api/auth/login`

Request body:

```json
{
  "email": "jane@example.com",
  "password": "pass1234"
}
```

Response:

- `200 OK`
- `data` user object + `token`

---

### GET `/api/auth/me`

Auth required.

Response:

- `200 OK`
- current user object

---

## 4) Category Routes

### GET `/api/categories`

Public.

Returns only active categories.

---

### POST `/api/admin/categories`

Admin only.

Validated body:

- `name` (min 2)
- `description` (min 5)
- `basePrice` (>= 0)

Response:

- `201 Created`

---

### PATCH `/api/admin/categories/:id`

Admin only.

Validated:

- `id` must be Mongo ObjectId
- body must contain at least one updatable field

Response:

- `200 OK`

---

## 5) Provider Routes

### GET `/api/providers`

Public listing.

Optional query params:

- `city`
- `category` (category ObjectId)

Behavior:

- returns providers where:
  - role is provider
  - approved (`approvalStatus=approved` or `isApproved=true`)
  - profile availability is `available`

---

### POST `/api/provider/profile`

Provider only.

Create-or-update profile (upsert behavior).

Body example:

```json
{
  "categories": ["<categoryId>"],
  "bio": "Experienced electrician",
  "experienceYears": 8,
  "availabilityStatus": "available"
}
```

Notes:

- category IDs are validated against active categories.
- `availabilityStatus` accepted by backend schema: `available | unavailable`.

Response:

- `200 OK`

---

### GET `/api/provider/profile`

Provider only.

Returns provider profile with populated category names and user fields.

---

## 6) Booking Routes

### POST `/api/bookings`

Customer only.

Validated body:

- `providerId` (ObjectId)
- `categoryId` (ObjectId)
- `address` (string min 3)
- `city` (string min 2)
- `scheduledDateTime` (ISO date > now)
- `notes` (optional, max 1000)

Business validation:

- provider must exist and be approved
- provider profile must exist and be available
- category must be active

Response:

- `201 Created`

---

### GET `/api/bookings/my`

Customer only.

Query:

- `status` (optional)
- `page` (default 1)
- `limit` (default 10)

Response shape:

```json
{
  "success": true,
  "data": {
    "total": 0,
    "page": 1,
    "pages": 0,
    "bookings": []
  }
}
```

---

### GET `/api/provider/bookings`

Provider only.

Same pagination and filter pattern as customer bookings.

---

### GET `/api/bookings/:id`

Roles: `customer`, `provider`, `admin`.

Access control:

- customer can view own booking
- provider can view assigned booking
- admin can view any booking

---

### PATCH `/api/bookings/:id/cancel`

Roles: customer/provider.

Transition rules:

- customer can cancel from `requested` and `confirmed`
- provider can cancel from `requested`

Response:

- `200 OK`

---

### PATCH `/api/bookings/:id/accept`

Provider only.

Transition:

- `requested -> confirmed`

Also checks provider schedule conflict for confirmed/in-progress bookings at same datetime.

---

### PATCH `/api/bookings/:id/start`

Provider only.

Transition:

- `confirmed -> in-progress`

---

### PATCH `/api/bookings/:id/complete`

Provider only.

Transition:

- `in-progress -> completed`

---

### PATCH `/api/bookings/:id/reschedule`

Customer only.

Current business rule:

- only `requested` bookings can be rescheduled

Body:

```json
{
  "scheduledDateTime": "2026-06-01T10:00:00.000Z"
}
```

---

### POST `/api/bookings/:id/work?type=before|after`

Provider only.

Multipart form data:

- `images` (up to 5 files)
- `notes` (optional)

Rules:

- `type=before` allowed only when booking status is `in-progress`
- `type=after` allowed only when booking status is `completed`
- max 5 images per request
- each image max 5MB (multer constraint)

Response:

- `200 OK`

---

## 7) Review Routes

### POST `/api/reviews`

Customer only.

Validated body:

- `bookingId` (ObjectId)
- `rating` (1-5 integer)
- `comment` (optional, max 1000)

Rules:

- booking must belong to customer
- booking must be completed
- one review per booking

Response:

- `201 Created`

---

### DELETE `/api/admin/reviews/:id`

Admin only.

Deletes review and recalculates provider rating aggregates.

---

## 8) Admin Routes

All routes below require admin token.

### GET `/api/admin/providers`

Optional query:

- `status` = `pending | approved | rejected`

---

### PATCH `/api/admin/providers/:id/approve`

Marks provider as approved:

- `isApproved = true`
- `approvalStatus = approved`

---

### PATCH `/api/admin/providers/:id/reject`

Marks provider as rejected:

- `isApproved = false`
- `approvalStatus = rejected`

---

### GET `/api/admin/analytics`

Returns:

- user/provider totals
- booking totals and status stats
- revenue totals and monthly aggregations
- monthly user registrations
- status distribution

---

### GET `/api/admin/reviews`

Returns populated review list for moderation UI.

---

## 9) Common Error Statuses

- `400` validation/business rule violation
- `401` missing/invalid/expired token
- `403` role/ownership not allowed
- `404` resource not found
- `409` duplicate value (e.g., email/category name)
- `500` unexpected internal error

---

## 10) Related Docs

- [API Usage Examples](./api-usage-examples.md)
- [Security](./security.md)
- [Testing](./testing.md)
