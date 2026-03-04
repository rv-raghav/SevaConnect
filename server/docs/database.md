# Database Model (MongoDB + Mongoose)

SevaConnect backend persists data in MongoDB via Mongoose models.

This document describes schema fields, relationships, and indexing.

---

## 1) User (`User`)

File: `server/src/models/User.js`

### Fields

- `name` (String, required, trimmed)
- `email` (String, required, unique, lowercase, regex-validated)
- `password` (String, required, min 6, `select: false`)
- `role` (Enum: `customer | provider | admin`, default `customer`)
- `city` (String, required)
- `isApproved` (Boolean, default `false`)
- `approvalStatus` (Enum: `pending | approved | rejected`, default `pending`)
- `createdAt`, `updatedAt` (timestamps)

### Hooks and Methods

- Pre-save hook hashes password with bcrypt when modified.
- Instance method `comparePassword(candidatePassword)`.

### Notes

- Provider approval flow uses both `isApproved` and `approvalStatus`.
- Public registration in service layer prevents creation as admin.

---

## 2) ServiceCategory (`ServiceCategory`)

File: `server/src/models/ServiceCategory.js`

### Fields

- `name` (String, required, unique, trimmed)
- `description` (String, required)
- `basePrice` (Number, required, min 0)
- `isActive` (Boolean, default `true`)
- `icon` (String, optional)
- timestamps

---

## 3) ProviderProfile (`ProviderProfile`)

File: `server/src/models/ProviderProfile.js`

### Fields

- `userId` (ObjectId ref `User`, required, unique)
- `categories` (ObjectId[] ref `ServiceCategory`)
- `bio` (String, optional)
- `experienceYears` (Number, min 0)
- `availabilityStatus` (Enum: `available | unavailable`, default `available`)
- `ratingAverage` (Number, default `0`)
- `totalReviews` (Number, default `0`)
- timestamps

### Indexes

- `categories`
- `availabilityStatus`

### Notes

- Ratings are denormalized and maintained by review aggregation logic in `reviewService`.

---

## 4) Booking (`Booking`)

File: `server/src/models/Booking.js`

### Core Fields

- `customerId` (ObjectId ref `User`, required)
- `providerId` (ObjectId ref `User`, required)
- `categoryId` (ObjectId ref `ServiceCategory`, required)
- `address` (String, required)
- `city` (String, required)
- `scheduledDateTime` (Date, required)
- `priceSnapshot` (Number, required, min 0)
- `status` (Enum: `requested | confirmed | in-progress | completed | cancelled`)
- `notes` (String, optional)
- `cancelledBy` (Enum: `customer | provider`)
- `workNotes` (String, optional)
- timestamps

### Embedded Arrays

- `statusHistory[]`
  - `status`
  - `changedAt` (default now)
  - `changedBy` (ObjectId ref `User`)

- `beforeImages[]`
  - `publicId`
  - `url`

- `afterImages[]`
  - `publicId`
  - `url`

### Indexes

- `{ providerId: 1, scheduledDateTime: 1 }`
- `{ customerId: 1 }`
- `{ status: 1 }`

### Notes

- `priceSnapshot` stores category price at booking time to preserve historical billing.
- State transitions are validated in service layer via transition utility.

---

## 5) Review (`Review`)

File: `server/src/models/Review.js`

### Fields

- `bookingId` (ObjectId ref `Booking`, required, unique)
- `customerId` (ObjectId ref `User`, required)
- `providerId` (ObjectId ref `User`, required)
- `rating` (Number, required, min 1, max 5)
- `comment` (String, optional)
- timestamps

### Indexes

- `providerId`

### Notes

- Unique `bookingId` ensures one review per booking.

---

## 6) Relationship Overview

- `User (provider)` -> one `ProviderProfile`
- `ProviderProfile` -> many `ServiceCategory`
- `Booking` references `customer User`, `provider User`, `ServiceCategory`
- `Review` references `Booking`, `customer User`, `provider User`

---

## 7) Derived Data and Aggregations

- Provider ratings are recalculated from `Review` collection (aggregate pipeline).
- Admin analytics aggregate totals and monthly trends from `User`, `Booking`, `Review`.

---

## 8) Data Integrity Rules Enforced in Services

- Booking creation requires:
  - provider exists and is approved
  - provider profile exists and is available
  - category exists and is active
  - schedule in future

- Review creation requires:
  - booking exists
  - booking belongs to customer
  - booking status is `completed`
  - no previous review for booking

For behavior-level details, see [API Reference](./api-reference.md).
