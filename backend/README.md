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
│   ├── controllers/     # factory (generic CRUD) + auth/submission/donation/campaign/payment/setting
│   ├── middleware/      # auth, error handler, rate limiters, validation
│   ├── models/          # Mongoose schemas (+ toJSON plugin)
│   ├── routes/          # route modules, wired in routes/index.js
│   ├── seed/            # seed script + dataset (+ campaigns.js)
│   ├── services/
│   │   ├── payments/    # gateway registry + one adapter per provider
│   │   └── donation.service.js   # settlement, campaign totals, receipts
│   ├── utils/           # ApiError, ApiResponse, asyncHandler, logger, money
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

POST /api/v1/newsletter               # PUBLIC — subscribe (idempotent)
POST /api/v1/newsletter/unsubscribe   # PUBLIC
GET  /api/v1/newsletter               (auth)
GET  /api/v1/newsletter/stats         (auth)
DELETE /api/v1/newsletter/:id         (auth)
```

## Fundraising — campaigns, donations & payments

```
# Campaigns (public reads; drafts require auth + ?all=true)
GET    /api/v1/campaigns                     # ?active= &urgent= &featured= &all=
GET    /api/v1/campaigns/slug/:slug
GET    /api/v1/campaigns/:slug/donors        # public supporter wall (anonymised)
POST   /api/v1/campaigns                     (auth)
PATCH  /api/v1/campaigns/reorder             (auth)
PATCH  /api/v1/campaigns/:id                 (auth)
DELETE /api/v1/campaigns/:id                 (auth)  # refuses if donations exist; ?force=true
POST   /api/v1/campaigns/recalculate         (auth)  # rebuild totals from donation records
POST   /api/v1/campaigns/:slug/recalculate   (auth)

# Donations
POST   /api/v1/donations                     # PUBLIC — creates the record AND opens a payment session
GET    /api/v1/donations/lookup/:reference   # PUBLIC — thank-you page lookup
GET    /api/v1/donations                     (auth)
GET    /api/v1/donations/stats               (auth)  # raised, donors, average, byCampaign/Gateway/Currency, 12-month trend
GET    /api/v1/donations/export              (auth)  # CSV — ?status= &campaignSlug= &from= &to=
POST   /api/v1/donations/manual              (auth)  # record an offline gift
PATCH  /api/v1/donations/:id/status          (auth)  # verify / refund / reopen
POST   /api/v1/donations/:id/receipt         (auth)  # re-send the receipt email
PATCH  /api/v1/donations/:id                 (auth)
DELETE /api/v1/donations/:id                 (auth)

# Payments
GET    /api/v1/payments/methods              # PUBLIC — gateway list + currencies + FX table
GET    /api/v1/payments/:reference/status    # PUBLIC — poll (reference is an unguessable token)
POST   /api/v1/payments/:reference/retry     # PUBLIC — new attempt after a failure
GET|POST /api/v1/payments/callback/:gateway  # donor returning from the bank
POST   /api/v1/payments/webhook/:gateway     # bank server-to-server (HMAC-authenticated)
GET    /api/v1/payments/mock/:reference      # local checkout simulator (mock mode only)
GET    /api/v1/donations/donors              # PUBLIC — site-wide supporter wall
POST   /api/v1/payments/:reference/refund    (auth)
GET    /api/v1/payments/unmatched            (auth)  # payments the bank reported that we never started
POST   /api/v1/payments/reconcile            (auth)  # re-verify unfinished payments with the bank
POST   /api/v1/payments/expire               (auth)  # sweep abandoned sessions
```

### How a donation flows

1. `POST /donations` validates the amount/currency/campaign, writes a **pending** `Donation`,
   creates a `Payment` with an unguessable `reference`, and asks the gateway for a checkout
   session. The response carries `checkout.checkoutUrl` (redirect gateways) or
   `checkout.instructions` (offline transfer).
2. The donor pays. The bank sends them back to `/payments/callback/:gateway` and — independently —
   posts to `/payments/webhook/:gateway`.
3. Either path triggers a **server-to-server verify**. The browser callback is never trusted on
   its own. Settlement is **idempotent**, so a callback and a webhook racing each other produce
   exactly one completion, one receipt number and one email.
4. On success the donation is marked `completed`, a gapless receipt number is issued
   (`NF-2026-000042`), the receipt email goes out, and the campaign's totals are resynced.

### Nothing the gateway reports is ever lost

Money can reach the bank without passing through our donate form — a webhook that
arrives after a record was deleted, a bank-hosted payment link, a merchant QR scan, a
manual push by the bank's operations desk, or simply a reference we cannot match.

When a webhook arrives for an unknown reference, `captureOrphanPayment()` **creates**
the Donation and Payment rather than dropping the notification. The record is written
with `source: "gateway"` and `needsReview: true`, attributed to the General Fund so the
money is never stranded, and the admin is emailed. It settles, receipts and counts
toward campaign totals exactly like any other donation — an admin then reassigns it to
the right donor and campaign from the **Needs review** queue in the admin panel, which
resyncs both the old and the new campaign's totals.

A webhook with no merchant reference at all is still captured (keyed on the bank's own
transaction id); only a payload carrying neither a reference, a gateway id, nor an
amount is rejected. Retried webhooks are deduplicated on the reference, so the bank
repeating a notification never creates a second record.

`POST /payments/reconcile` closes the other gap: it re-verifies every unfinished payment
directly with the bank, catching donors who paid and then closed the tab before the
redirect landed, and webhooks that never arrived. Run it on a schedule.

### Money & multi-currency

Every donation stores both the amount the donor paid (`amount` + `currency`) and its value in the
reporting currency (`baseAmount`, converted at `fxRate`). **All aggregates use `baseAmount`**, so
totals never add rupees to dollars. FX rates come from `PAYMENT_FX_RATES` — replace the dummy
table with a live feed or your bank's daily card rate.

Campaign totals are split into `raisedOffset` (historic/offline money, admin-editable) and
`raisedOnline` (derived from completed donations). The site reads the `raised` / `donors` /
`percent` virtuals, which sum the two — so an admin can never put the displayed total out of
sync with the ledger.

### Payment gateways

`src/services/payments/` holds a registry with one adapter per provider. Shipping today:

| key | kind | notes |
| --- | --- | --- |
| `globalime` | redirect | Global IME Bank — cards, mobile & internet banking, international |
| `manual` | offline | Direct bank transfer, confirmed by an admin |

Adding eSewa, Khalti, Fonepay or Stripe means writing one adapter with the same shape and
registering it — no controller or route changes.

> **Global IME credentials are dummy placeholders.** `GLOBALIME_MODE=mock` (the default) makes
> no outbound call: `/payments/mock/:reference` serves a local checkout page where you can
> simulate success, failure or cancellation, so the whole flow is testable with no bank access.
> When your merchant pack arrives, set the real `GLOBALIME_*` values and switch `GLOBALIME_MODE`
> to `sandbox`, then `live`. If the bank's field names differ from the assumed contract, edit
> `FIELD_MAP` and `parseStatus` in `globalime.gateway.js` — nothing else changes.

**Security:** webhooks are authenticated by HMAC-SHA256 over the raw request body (captured in
`app.js`) and compared in constant time; a forged signature is rejected with 401. Gateway traffic
is exempt from the general rate limiter, and opening a payment session has its own stricter one.

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
- **Payments:** set `PUBLIC_API_URL` to the publicly reachable API origin — the bank posts its
  webhook there. Register that webhook URL in the Global IME merchant portal, keep
  `GLOBALIME_SECRET_KEY` / `GLOBALIME_WEBHOOK_SECRET` out of the repo, and schedule
  `POST /payments/expire` (a few times a day) to sweep abandoned checkout sessions, and
  `POST /payments/reconcile` alongside it to re-verify anything still unfinished.
