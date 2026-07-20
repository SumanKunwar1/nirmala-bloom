# Nirmala Foundation — Backend API

Production-ready REST API for the Nirmala Foundation Nepal website & admin panel.
Built with **Node.js + Express + MongoDB (Mongoose)**.

## Stack & features

- **Express** with a clean, layered structure (config → routes → controllers → models)
- **MongoDB Atlas** via Mongoose (connection pooling, graceful reconnect)
- **JWT auth** (bcrypt-hashed passwords, Bearer token or httpOnly cookie)
- **Security**: helmet, CORS allow-list, rate limiting, `express-mongo-sanitize`, `hpp`
- **DX**: standardized `{ success, message, data, meta }` responses, central error handler, request logging, gzip compression
- **Scalable**: generic CRUD controller/route factory — new collections are a one-liner
- **Graceful shutdown** on SIGINT/SIGTERM and DB disconnect

## Project structure

```
backend/
├── src/
│   ├── config/          # env config + Mongo connection
│   ├── controllers/     # factory (generic CRUD) + auth/submission/donation/setting
│   ├── middleware/      # auth, error handler, rate limiters, validation
│   ├── models/          # Mongoose schemas (+ toJSON plugin)
│   ├── routes/          # route modules, wired in routes/index.js
│   ├── seed/            # seed script + dataset
│   ├── utils/           # ApiError, ApiResponse, asyncHandler, logger
│   ├── app.js           # express app (middleware pipeline)
│   └── server.js        # bootstrap + graceful shutdown
├── .env                 # secrets (git-ignored)
└── .env.example
```

## Getting started

```bash
cd backend
npm install
cp .env.example .env      # then fill in MONGODB_URI + JWT_SECRET
npm run seed              # create admin user + seed content
npm run dev               # start on http://localhost:5000
```

Health check: `GET http://localhost:5000/health`
API base: `http://localhost:5000/api/v1`

Default admin (from `.env` `SEED_ADMIN_*`): `admin@nirmala.org` / `admin123` — **change these in production.**

## Auth

```
POST   /api/v1/auth/login       { email, password }  → { token, user }
GET    /api/v1/auth/me          (Bearer token)
PATCH  /api/v1/auth/password    { currentPassword, newPassword }
POST   /api/v1/auth/register    (admin only) { name, email, password, role }
POST   /api/v1/auth/logout
```

Send the token as `Authorization: Bearer <token>` on protected requests.

## Content endpoints

Each collection supports full REST. **Reads are public; writes require auth.**

| Resource | Base path |
|---|---|
| Hero slides | `/api/v1/hero-slides` |
| Impact stats | `/api/v1/impact-stats` |
| Testimonials | `/api/v1/testimonials` |
| Programs | `/api/v1/programs` (+ `/slug/:slug`) |
| Team | `/api/v1/team` |
| Milestones | `/api/v1/milestones` |
| Stories | `/api/v1/stories` (+ `/slug/:slug`) |
| Get-involved | `/api/v1/involve-ways` |
| Resources | `/api/v1/resources` |
| Gallery albums | `/api/v1/gallery-albums` (+ `/slug/:slug`) |
| Partners | `/api/v1/partners` |

Verbs: `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`, plus `PATCH /reorder` (body `{ items: [{ id, order }] }`) for the admin drag-to-order.
List query params: `?page=&limit=&sort=&q=<text search>` plus filters like `?published=true`, `?category=`, `?status=`.

## Singletons, inbox & analytics

```
GET  /api/v1/settings                 # all sections { site, about, contact, footer }
GET  /api/v1/settings/:key
PUT  /api/v1/settings/:key            (auth)

POST /api/v1/submissions              # PUBLIC — contact form
GET  /api/v1/submissions              (auth)
GET  /api/v1/submissions/stats        (auth)
PATCH /api/v1/submissions/:id/read    (auth)
POST /api/v1/submissions/:id/reply    (auth)   # emails the sender + records the reply
DELETE /api/v1/submissions/:id        (auth)

POST /api/v1/donations                # PUBLIC — donate form (recorded as pending)
GET  /api/v1/donations                (auth)
GET  /api/v1/donations/stats          (auth)   # raised, donors, average, pending, byCampaign
POST /api/v1/donations/manual         (auth)    # admin adds a record directly
PATCH/DELETE /api/v1/donations/:id    (auth)

POST /api/v1/newsletter               # PUBLIC — subscribe (idempotent)
POST /api/v1/newsletter/unsubscribe   # PUBLIC
GET  /api/v1/newsletter               (auth)
GET  /api/v1/newsletter/stats         (auth)
DELETE /api/v1/newsletter/:id         (auth)
```

### Forms & notifications

The public forms — **contact**, **donate**, and **newsletter** — are rate-limited and, when
`SMTP_HOST` + `ADMIN_NOTIFY_EMAIL` are set, trigger an email notification to the team (and a
confirmation to the subscriber). With SMTP unset, notifications are logged and the request
still succeeds, so everything is testable without email configured.

## Production notes

- Set `NODE_ENV=production`, a strong unique `JWT_SECRET`, and the real `CLIENT_URL`(s).
- The API accepts up to 15MB bodies to support base64 image uploads from the admin. **For scale, move image storage to object storage (S3 / Cloudinary) and store URLs** instead of base64.
- Put the app behind a reverse proxy / platform (Render, Railway, Fly, ECS). `trust proxy` is already enabled.
- Add a process manager (PM2) or container orchestrator; the app shuts down gracefully.
