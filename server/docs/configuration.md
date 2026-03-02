## Configuration & Environment

This document describes how to configure and run the SevaConnect backend.

---

## Environment Variables

Environment variables are loaded via `dotenv` and validated in `src/config/env.js`.

Create a `.env` file in the `server` directory with the following variables:

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

### Key Variables

- **`PORT`**: Port on which the Express server listens.
- **`MONGO_URI`**: MongoDB connection string (local or Atlas).
- **`JWT_SECRET`**: Secret used to sign and verify JWT tokens.
- **`CLOUDINARY_*`**: Credentials for Cloudinary media storage.
- **`CORS_ORIGIN`**: Comma-separated list of allowed origins for CORS.
- **`NODE_ENV`**: Typical values: `development`, `production`, `test`.

---

## Installation

From the project root:

```bash
cd server
npm install
```

Node.js 18+ is recommended.

---

## Running the Server

### Development

```bash
cd server
npm run dev
```

This uses `nodemon` to auto-restart on file changes.

### Production

```bash
cd server
npm start
```

Ensure `NODE_ENV=production` and that your `.env` values are set appropriately.

---

## MongoDB Setup

- For local development, run a MongoDB instance (e.g., via Docker or a local install).
- For production, use a managed MongoDB service (e.g., MongoDB Atlas).

### Example Docker Compose Snippet (Optional)

```yaml
version: "3.8"
services:
  mongo:
    image: mongo:7
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data: {}
```

Then set:

```env
MONGO_URI=mongodb://localhost:27017/seva-connect
```

---

## Cloudinary Setup

1. Create a Cloudinary account.
2. Create a new Cloud name and API keys.
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env`.

The backend uses the configured Cloudinary client in `src/config/cloudinary.js` for file uploads.

---

## CORS Configuration

- `CORS_ORIGIN` can be:
  - A single origin: `http://localhost:3000`
  - Multiple origins, comma-separated: `http://localhost:3000,http://localhost:4173`

The value is split and applied in `src/app.js`:

- If one or more origins are provided, only those origins are allowed.
- If `CORS_ORIGIN` is empty, all origins are allowed (development convenience).

For security in production, always set explicit allowed origins.

---

## Logging

Logging is handled via `src/utils/logger.js` and used in:

- `src/index.js` for startup and DB connection logs.
- `src/middlewares/errorHandler.js` for error logs.

You can later swap `logger` to use more advanced transports (e.g., Winston, pino).

For security-related config details, see the [Security Model](./security.md).

