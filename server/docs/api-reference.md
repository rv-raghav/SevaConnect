## API Reference

This document summarizes the main HTTP endpoints exposed by the SevaConnect backend.

Base URL (local development):

```text
http://localhost:5000
```

All JSON responses follow a consistent envelope:

```json
{
  "success": true,
  "data": { /* resource payload */ },
  "message": "Optional human-readable message"
}
```

Errors:

```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": "validation message" } // optional
}
```

---

## Authentication (`/api/auth`)

### Register

- **POST** `/api/auth/register`
- **Auth**: Public

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer", // or "provider"
  "city": "Mumbai"
}
```

Notes:
- If `role` is omitted or set to an invalid value, it defaults to `customer`.
- Attempts to register as `admin` are downgraded to `customer` for security.

---

### Login

- **POST** `/api/auth/login`
- **Auth**: Public

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "data": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "city": "Mumbai",
    "isApproved": true
  }
}
```

---

### Current User

- **GET** `/api/auth/me`
- **Auth**: Bearer token (`Authorization: Bearer <token>`)

Returns the current authenticated user profile (without password or internal fields).

---

## Categories

### List Categories

- **GET** `/api/categories`
- **Auth**: Public

Returns an array of active service categories.

---

### Create Category (Admin)

- **POST** `/api/admin/categories`
- **Auth**: Admin

Body:

```json
{
  "name": "Plumbing",
  "description": "All plumbing services",
  "basePrice": 500
}
```

Constraints:

- `name` must be unique (case-insensitive).
- `basePrice` must be a positive number.

---

### Update Category (Admin)

- **PATCH** `/api/admin/categories/:id`
- **Auth**: Admin

Body (any subset):

```json
{
  "name": "New name",
  "description": "Updated description",
  "basePrice": 600,
  "isActive": true
}
```

---

## Providers

### List Providers (Public)

- **GET** `/api/providers`
- **Auth**: Public

Query parameters:

- `city` – filter by city.
- `category` – filter by category ID.

Example:

```text
GET /api/providers?city=Mumbai&category=64f2...abc
```

Only **approved** providers are returned.

---

### Create / Update Provider Profile

- **POST** `/api/provider/profile`
- **Auth**: Provider

Body:

```json
{
  "categories": ["categoryId1", "categoryId2"],
  "bio": "Expert plumber with 10 years experience",
  "experienceYears": 10,
  "availabilityStatus": "available"
}
```

Notes:

- Acts as an upsert: same endpoint for create and update.
- Category IDs are validated; invalid IDs are rejected.

---

### Get Own Provider Profile

- **GET** `/api/provider/profile`
- **Auth**: Provider

Returns the provider profile with categories populated.

---

## Bookings

### Create Booking (Customer)

- **POST** `/api/bookings`
- **Auth**: Customer

Body:

```json
{
  "providerId": "provider-user-id",
  "categoryId": "category-id",
  "address": "123 Street, Area",
  "city": "Mumbai",
  "scheduledDateTime": "2024-12-25T10:00:00.000Z",
  "notes": "Need service ASAP"
}
```

Behavior:

- Validates that the provider and category are compatible.
- Checks for conflicting bookings in the same timeslot.

---

### Get Booking by ID

- **GET** `/api/bookings/:id`
- **Auth**: Booking owner (customer or provider) or admin.

---

### List My Bookings (Customer)

- **GET** `/api/bookings/my`
- **Auth**: Customer

---

### List Provider Bookings

- **GET** `/api/provider/bookings`
- **Auth**: Provider

---

### Booking Actions (State Transitions)

All booking actions are subject to state-machine rules.

- **PATCH** `/api/bookings/:id/accept` – Provider accepts booking.
- **PATCH** `/api/bookings/:id/start` – Provider starts work.
- **PATCH** `/api/bookings/:id/complete` – Provider marks booking as completed.
- **PATCH** `/api/bookings/:id/cancel` – Customer or provider cancels.
- **PATCH** `/api/bookings/:id/reschedule` – Customer requests a new schedule.

Each transition validates:

- Current state vs allowed transitions.
- Actor permissions (customer vs provider).

---

### Add Work Notes & Images

- **POST** `/api/bookings/:id/work`
- **Auth**: Provider
- **Content-Type**: `multipart/form-data`

Fields:

- `notes` – text description.
- `images` – one or more image files.
- Query param `type` – `"before"` or `"after"`.

Example (conceptual):

```text
POST /api/bookings/:id/work?type=before
Content-Type: multipart/form-data
  notes = "Started work"
  images[] = file1.jpg
  images[] = file2.jpg
```

Uploaded images are stored in Cloudinary, and URLs persisted on the booking.

---

## Reviews

### Submit Review

- **POST** `/api/reviews`
- **Auth**: Customer

Body:

```json
{
  "bookingId": "booking-id",
  "rating": 5,
  "comment": "Excellent service!"
}
```

Behavior:

- Ensures the booking belongs to the customer and is completed.
- Updates aggregate rating for the provider.

---

### Delete Review (Admin)

- **DELETE** `/api/admin/reviews/:id`
- **Auth**: Admin

---

## Admin

### List Providers

- **GET** `/api/admin/providers`
- **Auth**: Admin

Query:

- `approved=true|false` – filter by approval status.

---

### Approve / Reject Provider

- **PATCH** `/api/admin/providers/:id/approve`
- **PATCH** `/api/admin/providers/:id/reject`
- **Auth**: Admin

---

### Platform Analytics

- **GET** `/api/admin/analytics`
- **Auth**: Admin

Response (shape may vary):

```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalProviders": 25,
    "totalBookings": 150,
    "completedBookings": 120,
    "cancelledBookings": 10,
    "averageBookingPrice": 550.0,
    "totalReviews": 95
  }
}
```

For example usage and common workflows, see the [API Usage Examples](./api-usage-examples.md).

