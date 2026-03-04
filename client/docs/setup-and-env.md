# Frontend Setup and Environment

This document explains how to install, configure, and run the SevaConnect frontend.

---

## 1) Requirements

- Node.js 18+ (Node 20+ recommended)
- npm 9+
- Backend API running (`server/`)

---

## 2) Install

```bash
cd client
npm install
```

---

## 3) Environment Variable

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Variable Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:5000/api` | Backend API base URL used by Axios client |

Where used:

- `client/src/api/axios.js`

---

## 4) Run Modes

### Development

```bash
cd client
npm run dev
```

Default Vite dev URL:

- `http://localhost:5173`

### Production Build

```bash
cd client
npm run build
```

### Preview Build

```bash
cd client
npm run preview
```

### Lint

```bash
cd client
npm run lint
```

---

## 5) Backend Dependency Notes

Frontend assumes backend is accessible and CORS allows frontend origin.

Checklist:

- Backend running on expected port.
- `VITE_API_URL` points to `/api`.
- Backend `CORS_ORIGIN` includes frontend origin.

---

## 6) Auth Session Behavior

Token storage:

- localStorage key: `seva_token`
- helper: `client/src/utils/storage.js`

Axios interceptors:

- request interceptor injects bearer token
- response interceptor clears token + redirects to `/login` on `401`

---

## 7) Troubleshooting

### Frontend loads but no data

- verify `VITE_API_URL`
- verify backend health at `GET /`
- check browser network panel for CORS/401 errors

### Repeated redirect to `/login`

- token expired or invalid
- backend rejected token

### API calls hitting wrong host

- check `.env`
- restart Vite after env changes

---

## 8) Related Docs

- [Architecture](./architecture.md)
- [State and Data Flow](./state-and-data-flow.md)
