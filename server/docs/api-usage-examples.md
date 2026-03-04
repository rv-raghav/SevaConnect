# API Usage Examples (cURL)

This guide provides practical command sequences to exercise the API end to end.

Base URL assumed:

```bash
export API_BASE="http://localhost:5000/api"
```

---

## 1) Register and Login Customer

```bash
curl -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer One",
    "email": "customer.one@example.com",
    "password": "pass1234",
    "role": "customer",
    "city": "Mumbai"
  }'
```

```bash
curl -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer.one@example.com",
    "password": "pass1234"
  }'
```

Store token:

```bash
export CUSTOMER_TOKEN="<paste-jwt>"
```

---

## 2) Register Provider and Create Profile

```bash
curl -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Provider One",
    "email": "provider.one@example.com",
    "password": "pass1234",
    "role": "provider",
    "city": "Mumbai"
  }'
```

```bash
curl -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "provider.one@example.com",
    "password": "pass1234"
  }'
```

```bash
export PROVIDER_TOKEN="<paste-jwt>"
```

After category creation and provider approval (admin flow below), create/update profile:

```bash
curl -X POST "$API_BASE/provider/profile" \
  -H "Authorization: Bearer $PROVIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categories": ["<CATEGORY_ID>"],
    "bio": "Experienced provider",
    "experienceYears": 7,
    "availabilityStatus": "available"
  }'
```

---

## 3) Create Admin (Development Workflow)

Public registration cannot create admin users directly.

Common dev/test approach:

1. Register a normal user.
2. Update role in MongoDB to `admin`.
3. Login again to get token with admin role payload.

Example register:

```bash
curl -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin1234",
    "city": "Mumbai"
  }'
```

Then set role in DB manually (`admin`) and login:

```bash
curl -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin1234"
  }'
```

```bash
export ADMIN_TOKEN="<paste-jwt>"
```

---

## 4) Category Management (Admin)

### Create Category

```bash
curl -X POST "$API_BASE/admin/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plumbing",
    "description": "Pipe, leakage and fittings services",
    "basePrice": 500
  }'
```

Capture `CATEGORY_ID` from response.

### Update Category

```bash
curl -X PATCH "$API_BASE/admin/categories/<CATEGORY_ID>" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "basePrice": 650
  }'
```

### Public List Categories

```bash
curl "$API_BASE/categories"
```

---

## 5) Admin Provider Approval

### List Providers

```bash
curl "$API_BASE/admin/providers?status=pending" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Approve Provider

```bash
curl -X PATCH "$API_BASE/admin/providers/<PROVIDER_USER_ID>/approve" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Reject Provider

```bash
curl -X PATCH "$API_BASE/admin/providers/<PROVIDER_USER_ID>/reject" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 6) Public Provider Discovery

```bash
curl "$API_BASE/providers"
```

```bash
curl "$API_BASE/providers?city=Mumbai"
```

```bash
curl "$API_BASE/providers?city=Mumbai&category=<CATEGORY_ID>"
```

---

## 7) Customer Booking Workflow

### Create Booking

```bash
curl -X POST "$API_BASE/bookings" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "providerId": "<PROVIDER_USER_ID>",
    "categoryId": "<CATEGORY_ID>",
    "address": "221B, Main Street",
    "city": "Mumbai",
    "scheduledDateTime": "2026-12-31T10:00:00.000Z",
    "notes": "Please bring tools for sink repair"
  }'
```

Capture `BOOKING_ID`.

### Customer List Own Bookings

```bash
curl "$API_BASE/bookings/my?page=1&limit=10" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

### Customer Reschedule (`requested` only)

```bash
curl -X PATCH "$API_BASE/bookings/<BOOKING_ID>/reschedule" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduledDateTime": "2027-01-01T11:30:00.000Z"
  }'
```

---

## 8) Provider Booking Actions

### List Provider Bookings

```bash
curl "$API_BASE/provider/bookings?page=1&limit=10" \
  -H "Authorization: Bearer $PROVIDER_TOKEN"
```

### Accept

```bash
curl -X PATCH "$API_BASE/bookings/<BOOKING_ID>/accept" \
  -H "Authorization: Bearer $PROVIDER_TOKEN"
```

### Start

```bash
curl -X PATCH "$API_BASE/bookings/<BOOKING_ID>/start" \
  -H "Authorization: Bearer $PROVIDER_TOKEN"
```

### Complete

```bash
curl -X PATCH "$API_BASE/bookings/<BOOKING_ID>/complete" \
  -H "Authorization: Bearer $PROVIDER_TOKEN"
```

---

## 9) Upload Work Updates (Provider)

### Before Images (`in-progress`)

```bash
curl -X POST "$API_BASE/bookings/<BOOKING_ID>/work?type=before" \
  -H "Authorization: Bearer $PROVIDER_TOKEN" \
  -F "notes=Initial condition of area before work" \
  -F "images=@./before-1.jpg" \
  -F "images=@./before-2.jpg"
```

### After Images (`completed`)

```bash
curl -X POST "$API_BASE/bookings/<BOOKING_ID>/work?type=after" \
  -H "Authorization: Bearer $PROVIDER_TOKEN" \
  -F "notes=Work completed and cleaned up" \
  -F "images=@./after-1.jpg"
```

---

## 10) Customer Reviews

After booking is completed:

```bash
curl -X POST "$API_BASE/reviews" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "<BOOKING_ID>",
    "rating": 5,
    "comment": "Quick and professional service"
  }'
```

---

## 11) Admin Moderation and Analytics

### List Reviews for Moderation

```bash
curl "$API_BASE/admin/reviews" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Delete Review

```bash
curl -X DELETE "$API_BASE/admin/reviews/<REVIEW_ID>" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Platform Analytics

```bash
curl "$API_BASE/admin/analytics" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 12) Troubleshooting Examples

### 401 Unauthorized

- Missing/invalid token.
- Token expired.

### 403 Forbidden

- Token valid, but role or ownership is invalid for endpoint.

### 400 Invalid Transition

- Booking action attempted from unsupported current state.

### 400 Upload Error

- Too many files or oversized file (>5MB).
- `type` query missing or invalid.

---

## 13) Next Reading

- [API Reference](./api-reference.md)
- [Security](./security.md)
- [Testing](./testing.md)
