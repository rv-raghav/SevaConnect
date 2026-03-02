## Architecture

The SevaConnect backend follows a modular, layered architecture designed for clarity, testability, and separation of concerns.

At a high level:

```text
Client → Routes → Controllers → Services → Models → MongoDB
                ↓
           Middlewares & Utils
```

---

## Project Structure

Key backend folders under `server/src`:

- **`index.js`**: Application entrypoint. Loads environment, connects to MongoDB, starts the HTTP server.
- **`app.js`**: Express app setup: security middleware, CORS, JSON parsing, routes, and global error handling.

- **`config/`**
  - `env.js`: Loads and validates environment variables used throughout the app.
  - `cloudinary.js`: Cloudinary client configuration for media uploads.

- **`routes/`**
  - `authRoutes.js`: Authentication endpoints (`/api/auth/*`).
  - `categoryRoutes.js`: Public categories (`/api/categories`).
  - `providerRoutes.js`: Provider profile and provider-facing booking endpoints.
  - `bookingRoutes.js`: Customer and provider booking operations.
  - `reviewRoutes.js`: Review CRUD operations.
  - `adminRoutes.js`: Admin-only management and analytics.

- **`controllers/`**
  - `authController.js`, `categoryController.js`, `providerController.js`,
    `bookingController.js`, `reviewController.js`, `adminController.js`.
  - Each controller:
    - Accepts validated request data.
    - Invokes one or more service methods.
    - Shapes the HTTP response and status codes.

- **`services/`**
  - `authService.js`: Registration, login, token generation, and role handling.
  - `categoryService.js`: Category CRUD with uniqueness and active flags.
  - `providerService.js`: Provider profile upsert, approval checks, and filtering.
  - `bookingService.js`: Booking creation, state transitions, conflict checks.
  - `reviewService.js`: Review creation/deletion and rating aggregation.
  - `adminService.js`: Admin analytics and provider management helpers.

- **`models/`**
  - `User.js`: User accounts with fields like `name`, `email`, `passwordHash`, `role`, `city`, `isApproved`.
  - `ServiceCategory.js`: Service categories with names, descriptions, and `basePrice`.
  - `ProviderProfile.js`: Provider-specific info (categories, experience, availability, rating).
  - `Booking.js`: Bookings with references to users, providers, and categories, plus status and scheduling.
  - `Review.js`: Customer reviews with rating and comment, linked to bookings/providers.

- **`middlewares/`**
  - `authMiddleware.js`: Verifies JWT tokens and attaches user to `req.user`.
  - `roleMiddleware.js`: Enforces role-based access control on routes.
  - `rateLimiters.js`: Rate limiting for sensitive endpoints (e.g., auth).
  - `uploadMiddleware.js`: Multer-based file parsing for images.
  - `validateRequest.js`: Validates request bodies/params against Joi schemas.
  - `notFound.js`: 404 handler.
  - `errorHandler.js`: Central error formatting and logging.

- **`validators/`**
  - `requestSchemas.js`: Joi schemas for request validation (auth, bookings, etc.).

- **`utils/`**
  - `AppError.js`: Custom error class for consistent error handling.
  - `asyncHandler.js`: Wraps async route handlers to forward errors.
  - `bookingTransitions.js`: Booking state-machine rules and helpers.
  - `logger.js`: Centralized logging abstraction.

---

## Request Flow

1. **Incoming HTTP request** hits Express route (e.g., `/api/bookings`).
2. **Middlewares** run:
   - Security (`helmet`, CORS).
   - Parsing (`express.json`).
   - Auth (`authMiddleware`) and roles (`roleMiddleware`) as needed.
   - Validation (`validateRequest` with Joi schema).
3. **Controller** receives a clean, validated `req` object and calls the relevant service.
4. **Service** executes business logic:
   - Interacts with one or more Mongoose models.
   - Enforces invariants (e.g., booking conflict checks, valid state transitions).
   - Throws `AppError` for controlled error cases.
5. **Controller** returns normalized JSON response:
   - `{ success: true, data: ..., message?: string }` on success.
   - Errors are handled by the global `errorHandler`.

---

## Booking State Machine

Booking transitions are centralized in `utils/bookingTransitions.js` and enforced by the booking service.

- **States**:
  - `requested`
  - `confirmed`
  - `in-progress`
  - `completed`
  - `cancelled`

- **Allowed transitions** (examples):
  - `requested → confirmed` (provider accepts).
  - `confirmed → in-progress` (provider starts work).
  - `in-progress → completed` (work finished).
  - `requested/confirmed → cancelled` (customer or provider cancels with rules).

Any attempt to perform an invalid transition should result in a 400-level error.

---

## Cross-Cutting Concerns

- **Error Handling**
  - All errors are funneled to `errorHandler`, which:
    - Logs details (via `logger`).
    - Normalizes error responses.
    - Hides internal implementation details from API consumers.

- **Logging**
  - `logger.js` abstracts logging (console today, can be upgraded later).
  - Logs startup, DB connectivity, and operational errors.

- **Security**
  - JWTs are validated for protected routes, with roles enforced by `roleMiddleware`.
  - Rate limiting on auth routes.
  - Helmet and CORS are applied globally.

For API-by-API details, see the [API Reference](./api-reference.md).

