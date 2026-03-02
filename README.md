## SevaConnect – Local Services Platform

SevaConnect is a local services booking platform (e.g., plumbers, electricians, home services) with a Node.js/Express backend and MongoDB persistence.

This repository currently contains the **backend API** under the `server` directory.

---

## Project Structure

- **`server/`**: SevaConnect backend API
  - `src/`: Express app, routes, controllers, services, models, middlewares, utils
  - `docs/`: Backend documentation set (architecture, APIs, database, security, testing, etc.)

If/when a frontend is added, it can live alongside `server/` (e.g., `client/`).

---

## Quick Start (Backend)

- **Prerequisites**
  - **Node.js** 18+
  - **MongoDB** (local instance or Atlas)

- **Install dependencies**

  ```bash
  cd server
  npm install
  ```

- **Configure environment**

  Create `server/.env` (see detailed guide in `server/docs/configuration.md`):

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

- **Run in development**

  ```bash
  cd server
  npm run dev
  ```

- **Run in production**

  ```bash
  cd server
  npm start
  ```

---

## Backend Documentation Set (Reading Order)

All backend docs live under `server/docs/`. Recommended reading order:

1. **Overview** – high-level product and backend capabilities  
   - `server/docs/overview.md`

2. **Architecture** – folder layout, layers, and request flow  
   - `server/docs/architecture.md`

3. **Configuration & Environment** – `.env`, MongoDB, Cloudinary, CORS, logging  
   - `server/docs/configuration.md`

4. **Database Model** – conceptual schema for users, categories, providers, bookings, reviews  
   - `server/docs/database.md`

5. **API Reference** – endpoints, payloads, and behavior  
   - `server/docs/api-reference.md`

6. **API Usage Examples** – cURL-based workflows for auth, marketplace, bookings, reviews, admin  
   - `server/docs/api-usage-examples.md`

7. **Security Model** – auth, roles, rate limiting, validation, hardening  
   - `server/docs/security.md`

8. **Testing & Quality** – test phases, coverage, and how to run/extending tests  
   - `server/docs/testing.md`

Use this root README as the entry point, then follow the docs above for deeper detail.

---

## Backend Tech Stack (Server)

- **Runtime**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT-based with role-based access control
- **Storage**: Cloudinary (image uploads)
- **Security**:
  - Helmet (security headers)
  - CORS (origin restriction)
  - Express Rate Limit (rate limiting)
  - Joi (input validation)
  - bcrypt (password hashing)

---

## Testing

From `server/` you can run:

```bash
# Individual test phases
node test-auth.js
node test-phase2.js
node test-phase3-e2e.js
node test-phase6-7.js

# Or, once npm test is configured:
npm test
```

For full details on what each phase covers and how to extend tests, see `server/docs/testing.md`.

---

## License

ISC
