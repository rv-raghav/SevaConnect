## API Usage Examples

This document shows common end-to-end workflows using the SevaConnect API.

Base URL (local development):

```text
http://localhost:5000
```

---

## 1. Register and Login a Customer

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@test.com",
    "password": "pass123",
    "city": "Mumbai"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "pass123"
  }'
```

Save the `token` from the response as `CUSTOMER_TOKEN`.

---

## 2. Browse Categories and Providers

### Get Categories

```bash
curl http://localhost:5000/api/categories
```

### List Providers in a City

```bash
curl "http://localhost:5000/api/providers?city=Mumbai"
```

### List Providers by City + Category

```bash
curl "http://localhost:5000/api/providers?city=Mumbai&category=CATEGORY_ID"
```

---

## 3. Provider Onboarding

### Register Provider

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plumber Pro",
    "email": "plumber@test.com",
    "password": "pass123",
    "role": "provider",
    "city": "Mumbai"
  }'
```

### Login as Provider

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "plumber@test.com",
    "password": "pass123"
  }'
```

Save the `token` as `PROVIDER_TOKEN`.

### Create / Update Provider Profile

```bash
curl -X POST http://localhost:5000/api/provider/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PROVIDER_TOKEN" \
  -d '{
    "categories": ["CATEGORY_ID"],
    "bio": "Expert plumber with 10 years of experience",
    "experienceYears": 10,
    "availabilityStatus": "available"
  }'
```

---

## 4. Customer Booking Flow

Assuming you have:

- `CUSTOMER_TOKEN` – customer JWT.
- `PROVIDER_ID` – provider user ID.
- `CATEGORY_ID` – service category ID.

### Create Booking

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -d '{
    "providerId": "PROVIDER_ID",
    "categoryId": "CATEGORY_ID",
    "address": "123 St, Mumbai",
    "city": "Mumbai",
    "scheduledDateTime": "2024-12-25T10:00:00.000Z",
    "notes": "Need service ASAP"
  }'
```

### View My Bookings

```bash
curl http://localhost:5000/api/bookings/my \
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

---

## 5. Provider Booking Workflow

Assuming:

- `BOOKING_ID` – ID of the booking created earlier.
- `PROVIDER_TOKEN` – provider JWT.

### Accept Booking

```bash
curl -X PATCH http://localhost:5000/api/bookings/BOOKING_ID/accept \
  -H "Authorization: Bearer PROVIDER_TOKEN"
```

### Start Work

```bash
curl -X PATCH http://localhost:5000/api/bookings/BOOKING_ID/start \
  -H "Authorization: Bearer PROVIDER_TOKEN"
```

### Complete Work

```bash
curl -X PATCH http://localhost:5000/api/bookings/BOOKING_ID/complete \
  -H "Authorization: Bearer PROVIDER_TOKEN"
```

---

## 6. Work Updates with Images

Example using `curl` with multipart form data:

```bash
curl -X POST http://localhost:5000/api/bookings/BOOKING_ID/work?type=before \
  -H "Authorization: Bearer PROVIDER_TOKEN" \
  -F "notes=Starting work" \
  -F "images=@path/to/before1.jpg" \
  -F "images=@path/to/before2.jpg"
```

```bash
curl -X POST http://localhost:5000/api/bookings/BOOKING_ID/work?type=after \
  -H "Authorization: Bearer PROVIDER_TOKEN" \
  -F "notes=Finished work" \
  -F "images=@path/to/after1.jpg"
```

---

## 7. Customer Review Flow

Assuming the booking is completed and the customer is authenticated.

```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -d '{
    "bookingId": "BOOKING_ID",
    "rating": 5,
    "comment": "Great service!"
  }'
```

---

## 8. Admin Operations

Assuming you have an `ADMIN_TOKEN`.

### List Providers

```bash
curl http://localhost:5000/api/admin/providers \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Approve Provider

```bash
curl -X PATCH http://localhost:5000/api/admin/providers/PROVIDER_ID/approve \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### View Analytics

```bash
curl http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

For more on configuration, security, and environment setup, continue with:

- [Configuration & Environment](./configuration.md)
- [Security Model](./security.md)
- [Testing & Quality](./testing.md)

