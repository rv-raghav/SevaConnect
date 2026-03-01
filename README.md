# SevaConnect Backend API

A MERN-based backend for a local services booking platform.

## Features

- **Authentication**: JWT-based with roles (customer, provider, admin)
- **Service Categories**: Admin-managed categories with pricing
- **Provider Profiles**: Profiles with categories, availability, and ratings
- **Booking Workflow**: State machine enforced transitions (requested → confirmed → in-progress → completed)
- **Conflict Detection**: Prevents double-booking
- **Review System**: Customer reviews with rating aggregation
- **Work Notes & Images**: Before/after photo uploads via Cloudinary
- **Admin Provider Approval**: Admin controls provider onboarding
- **Analytics**: Dashboard statistics for admins

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image uploads)
- Helmet (security headers)
- Express Rate Limit (rate limiting)
- Joi (validation)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/seva-connect
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Run Development

```bash
npm run dev
```

### Run Production

```bash
npm start
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Bearer Token |

**Register Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer", // or "provider"
  "city": "Mumbai"
}
```

**Login Payload:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | List all active categories | Public |
| POST | `/api/admin/categories` | Create category | Admin |
| PATCH | `/api/admin/categories/:id` | Update category | Admin |

### Providers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/providers` | List available providers | Public |
| POST | `/api/provider/profile` | Create/update profile | Provider |
| GET | `/api/provider/profile` | Get own profile | Provider |

**List Providers Query:**
```
GET /api/providers?city=Mumbai&category=categoryId
```

### Bookings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create booking | Customer |
| GET | `/api/bookings/:id` | Get booking by ID | Owner/Admin |
| GET | `/api/bookings/my` | My bookings | Customer |
| GET | `/api/provider/bookings` | Provider bookings | Provider |
| PATCH | `/api/bookings/:id/accept` | Accept booking | Provider |
| PATCH | `/api/bookings/:id/start` | Start work | Provider |
| PATCH | `/api/bookings/:id/complete` | Complete booking | Provider |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking | Customer/Provider |
| PATCH | `/api/bookings/:id/reschedule` | Reschedule | Customer |
| POST | `/api/bookings/:id/work` | Add work notes/images | Provider |

**Create Booking:**
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

**Work Update:**
```
POST /api/bookings/:id/work?type=before
Content-Type: multipart/form-data

fields:
- notes: "Started work"
- images: [file1.jpg, file2.jpg]
```

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reviews` | Submit review | Customer |
| DELETE | `/api/admin/reviews/:id` | Delete review | Admin |

**Create Review:**
```json
{
  "bookingId": "booking-id",
  "rating": 5,
  "comment": "Excellent service!"
}
```

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/providers` | List all providers | Admin |
| GET | `/api/admin/providers?approved=true` | Filter by approval | Admin |
| PATCH | `/api/admin/providers/:id/approve` | Approve provider | Admin |
| PATCH | `/api/admin/providers/:id/reject` | Reject provider | Admin |
| GET | `/api/admin/analytics` | Get platform analytics | Admin |
| DELETE | `/api/admin/reviews/:id` | Delete review | Admin |

**Analytics Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalProviders": 25,
    "totalBookings": 150,
    "completedBookings": 120,
    "cancelledBookings": 10,
    "averageBookingPrice": 550.00,
    "totalReviews": 95
  }
}
```

---

## Example cURL Commands

### Register Customer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123","city":"Mumbai"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

### Get Categories
```bash
curl http://localhost:5000/api/categories
```

### List Providers
```bash
curl "http://localhost:5000/api/providers?city=Mumbai"
```

### Create Booking (Customer)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"providerId":"...","categoryId":"...","address":"123 St","city":"Mumbai","scheduledDateTime":"2024-12-25T10:00:00.000Z"}'
```

### Provider Accepts Booking
```bash
curl -X PATCH http://localhost:5000/api/bookings/BOOKING_ID/accept \
  -H "Authorization: Bearer PROVIDER_TOKEN"
```

### Submit Review
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -d '{"bookingId":"...","rating":5,"comment":"Great service!"}'
```

### Admin Analytics
```bash
curl http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Testing

Run tests:

```bash
# Phase 1 - Auth
node test-auth.js

# Phase 2 - Marketplace
node test-phase2.js

# Phase 3-4 - E2E Workflow
node test-phase3-e2e.js

# Phase 6-7 - Admin & Hardening
node test-phase6-7.js
```

---

## Security Features

- **Helmet**: HTTP security headers
- **CORS**: Configurable origin restriction
- **Rate Limiting**: 100 requests/15min on auth routes
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt
- **JWT Tokens**: 7-day expiry
- **Role-based Access Control**: Routes protected by role middleware

---

## Architecture

```
Routes → Controllers → Services → Models
```

- **Routes**: Define endpoints and middleware chain
- **Controllers**: Thin, handle request/response only
- **Services**: Business logic, DB operations
- **Models**: Mongoose schemas

---

## License

ISC
