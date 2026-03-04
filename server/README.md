# SevaConnect Backend (`server`)

Node.js + Express API for SevaConnect marketplace operations.

This service exposes:

- Authentication and session identity APIs
- Category and provider discovery APIs
- Booking lifecycle APIs
- Review APIs
- Admin moderation and analytics APIs

---

## Quick Start

```bash
cd server
npm install
npm run dev
```

Default local API base: `http://localhost:5000/api`

---

## Environment

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/seva-connect
JWT_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=http://localhost:5173
```

Environment validation is enforced by `src/config/env.js` on startup.

---

## Scripts

- `npm run dev` - start API with nodemon
- `npm start` - start API in normal runtime mode

Manual phase test scripts:

- `npm run test:auth`
- `npm run test:phase2`
- `npm run test:phase3`
- `npm run test:phase6-7`
- `npm run test:all`

Seed data:

- `node src/seed.js`

---

## Architecture At A Glance

- Request path: `routes -> middleware -> controllers -> services -> models`
- Validation: Joi schemas at route boundaries
- AuthN/AuthZ: JWT middleware + role middleware
- Data: MongoDB via Mongoose
- Uploads: multer (memory) + Cloudinary
- Security: helmet, CORS policy, rate limiting, centralized error handling

---

## Backend Documentation

1. `docs/README.md`
2. `docs/overview.md`
3. `docs/architecture.md`
4. `docs/configuration.md`
5. `docs/database.md`
6. `docs/api-reference.md`
7. `docs/api-usage-examples.md`
8. `docs/security.md`
9. `docs/testing.md`

---

## Related

- Root docs: `../README.md`
- Frontend app: `../client/README.md`
