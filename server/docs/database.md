## Database Model

SevaConnect uses **MongoDB** with **Mongoose** ODM.

This document summarizes the main collections and their relations.

---

## Users (`User`)

Represents platform users of different roles.

Key fields (conceptual):

- `_id: ObjectId`
- `name: string`
- `email: string` (unique)
- `passwordHash: string`
- `role: "customer" | "provider" | "admin"`
- `city: string`
- `isApproved: boolean` (for providers)
- `createdAt`, `updatedAt`

Relations:

- Providers link to `ProviderProfile`.
- Customers and providers are referenced in `Booking` and `Review`.

---

## Service Categories (`ServiceCategory`)

Represents types of services the platform offers.

Key fields:

- `_id: ObjectId`
- `name: string` (unique)
- `description: string`
- `basePrice: number`
- `isActive: boolean`
- `createdAt`, `updatedAt`

Relations:

- Referenced by `ProviderProfile` and `Booking`.

---

## Provider Profiles (`ProviderProfile`)

Provider-specific profile and marketplace metadata.

Key fields:

- `_id: ObjectId`
- `user: ObjectId` (ref: `User`)
- `categories: ObjectId[]` (ref: `ServiceCategory`)
- `bio: string`
- `experienceYears: number`
- `availabilityStatus: "available" | "busy" | "offline"` (typical values)
- `avgRating: number`
- `ratingCount: number`
- `city: string`
- `createdAt`, `updatedAt`

Relations:

- One-to-one with a provider `User`.
- Many-to-many with `ServiceCategory`.
- Aggregated rating from `Review`.

---

## Bookings (`Booking`)

Represents a service booking between a customer and provider.

Key fields:

- `_id: ObjectId`
- `customer: ObjectId` (ref: `User`)
- `provider: ObjectId` (ref: `User` or `ProviderProfile`, depending on implementation)
- `category: ObjectId` (ref: `ServiceCategory`)
- `address: string`
- `city: string`
- `scheduledDateTime: Date`
- `status: "requested" | "confirmed" | "in-progress" | "completed" | "cancelled"`
- `notes: string`
- `workLogs`: array of:
  - `type: "before" | "after"`
  - `notes: string`
  - `images: string[]` (Cloudinary URLs)
- `createdAt`, `updatedAt`

Relations:

- References `User`, `ProviderProfile`, and `ServiceCategory`.
- Referenced by `Review`.

Constraints/Logic:

- Conflict detection ensures providers are not double-booked for overlapping times.
- State transitions governed by `bookingTransitions`.

---

## Reviews (`Review`)

Customer feedback for completed bookings.

Key fields:

- `_id: ObjectId`
- `booking: ObjectId` (ref: `Booking`)
- `customer: ObjectId` (ref: `User`)
- `provider: ObjectId` (ref: `User` or `ProviderProfile`)
- `rating: number` (e.g., 1–5)
- `comment: string`
- `createdAt`, `updatedAt`

Relations:

- Linked to `Booking`, `User`, and possibly `ProviderProfile`.
- Used to compute `avgRating` and `ratingCount` on `ProviderProfile`.

---

## Indexing & Performance (Conceptual)

Typical indexes to consider (implementation may exist in schemas):

- `User.email` – unique.
- `ProviderProfile.user` – unique (one profile per provider).
- `ProviderProfile.city`, `ProviderProfile.categories` – for efficient search.
- `Booking.provider`, `Booking.scheduledDateTime`, `Booking.status` – for conflict lookup and calendars.
- `Review.provider` – for analytics and listing.

For details on how the models are used in business logic, see:

- [Architecture](./architecture.md)
- [API Reference](./api-reference.md)

