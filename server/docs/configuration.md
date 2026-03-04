# Backend Configuration and Environment

This document explains backend setup, required env variables, local development, and production configuration considerations.

---

## 1) Runtime Requirements

- Node.js 18+ (Node 20+ recommended)
- npm 9+
- MongoDB (local or Atlas)
- Cloudinary account for media uploads

---

## 2) Install Dependencies

```bash
cd server
npm install
```

---

## 3) Environment Variables

Create `server/.env`.

Example:

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

---

## 4) Env Variable Reference

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `NODE_ENV` | No (default `development`) | `development` | Runtime mode (`development`, `test`, `production`) |
| `PORT` | No (default `5000`) | `5000` | HTTP port |
| `MONGO_URI` | Yes | `mongodb://localhost:27017/seva-connect` | Mongo connection string |
| `JWT_SECRET` | Yes | `long-secret-value` | JWT signing key |
| `CLOUDINARY_CLOUD_NAME` | Yes | `abc123` | Cloudinary cloud config |
| `CLOUDINARY_API_KEY` | Yes | `123456789` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | `secret` | Cloudinary API secret |
| `CORS_ORIGIN` | Optional | `http://localhost:5173,http://localhost:4173` | Allowed origins list (comma-separated) |

Validation is enforced in `server/src/config/env.js` at startup.

If validation fails, server exits with a clear error message.

---

## 5) Local Run Modes

### Development

```bash
cd server
npm run dev
```

- Uses `nodemon`
- Hot restart on file changes

### Standard Runtime

```bash
cd server
npm start
```

---

## 6) Startup Sequence

When `src/index.js` runs:

1. `dotenv` loads `.env`.
2. Env schema validation runs.
3. Express app is loaded.
4. MongoDB connection is established.
5. HTTP server starts only after DB connection succeeds.

If DB connection fails, process exits non-zero.

---

## 7) MongoDB Notes

For local MongoDB:

```env
MONGO_URI=mongodb://localhost:27017/seva-connect
```

For Atlas, use SRV URI:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
```

Production recommendation:

- use dedicated DB user with least privilege
- enable IP/network restrictions
- rotate credentials regularly

---

## 8) Cloudinary Notes

Image uploads (`POST /api/bookings/:id/work`) depend on Cloudinary configuration in:

- `server/src/config/cloudinary.js`

Upload constraints:

- max 5 files per request (multer route-level)
- max 5MB per file
- in-memory upload buffer

If Cloudinary credentials are invalid, upload endpoints will fail with 5xx/operational error responses.

---

## 9) CORS Behavior

`CORS_ORIGIN` is parsed as comma-separated origins in `app.js`.

- If list is non-empty: only listed origins allowed.
- If empty/missing: CORS allows all origins (dev convenience).

Production recommendation:

- always define explicit origins.

---

## 10) Logging

Current logging abstraction is in `server/src/utils/logger.js`.

- Startup logs
- DB connection logs
- Error logs (through middleware/controller handling paths)

For advanced observability, logger can be swapped with `pino` or `winston` with minimal code changes.

---

## 11) Seed Script

Seed realistic data:

```bash
cd server
node src/seed.js
```

Important:

- Seed script clears existing collections before insertion.
- Use only in development/non-production environments.

---

## 12) Health and Readiness Endpoints

Operational probe routes:

- `GET /api/health`
  - Returns `200` when API process is alive.
- `GET /api/ready`
  - Returns `200` when MongoDB connection state is ready.
  - Returns `503` when database dependency is not ready.

Example:

```bash
curl -i http://localhost:5000/api/health
curl -i http://localhost:5000/api/ready
```

---

## 13) Related Docs

- [Architecture](./architecture.md)
- [Security](./security.md)
- [Testing](./testing.md)
