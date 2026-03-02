## SevaConnect Backend Overview

SevaConnect is a local services booking platform backend, built as a RESTful API that powers customer, provider, and admin flows.

- **Customers** discover service providers (e.g., plumbers, electricians), create and manage bookings, and leave reviews.
- **Providers** manage their profile, availability, bookings, and work history.
- **Admins** manage categories, approve providers, and view platform analytics.

This backend is built using **Node.js + Express** with **MongoDB + Mongoose** as the primary datastore, and integrates with **Cloudinary** for media storage.

---

## High-Level Capabilities

- **Authentication & Authorization**
  - JWT-based authentication with role-based access control (`customer`, `provider`, `admin`).
  - Secure registration & login with password hashing and token generation.
  - `GET /api/auth/me` for current user profile.

- **Service Marketplace**
  - Configurable **service categories** with descriptions and base pricing.
  - **Provider profiles** with categories, experience, availability, and ratings.
  - Public provider search with filters on city and category.

- **Booking Lifecycle**
  - Booking creation by customers.
  - Strict booking state transitions (requested → confirmed → in-progress → completed / cancelled).
  - Conflict detection to prevent double-booking.
  - Work notes and before/after images uploads via Cloudinary.

- **Reviews & Ratings**
  - Customers can submit reviews on completed bookings.
  - Ratings are aggregated into provider profiles.

- **Admin & Analytics**
  - Admin-managed provider approval workflow.
  - Core analytics (totals, averages, etc.) for platform health.

For a deeper dive into how these pieces fit together, continue with the [Architecture](./architecture.md) document.

