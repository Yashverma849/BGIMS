# MM BGIMS — Heritage Reimagined

A premium, production-grade website for **Maratha Mandir's Babasaheb Gawde Institute of Management Studies**, Mumbai. Built with Astro + TypeScript so the institute team can edit content, scale to a real backend, and deploy to any modern static or serverless host.

**Aesthetic direction:** _Modern Heritage_ — editorial sophistication of HBS / INSEAD / LBS websites married to the cultural warmth of premium Indian heritage brands.

**Launch readiness:** 0 type errors · 0 lint warnings · 16 / 16 unit tests · 21 / 21 e2e tests · CSP + HSTS + X-Frame headers · rate-limited API · sitemap · OG image · robots · 404 page · CI workflow · platform configs for Vercel / Netlify / self-hosted Node.

---

## Quick start

```bash
pnpm install
pnpm dev          # http://127.0.0.1:4321 — hot reload
```

Production build + serve (self-hosted Node):

```bash
pnpm build
pnpm start        # binds 0.0.0.0:4321 with full security headers
```

Scripts:

```bash
pnpm check        # astro + typescript (zero errors required)
pnpm lint         # eslint --max-warnings 0
pnpm format       # prettier
pnpm test:unit    # vitest (schema + format)
pnpm test:e2e     # playwright (pages, API, apply flow, admin)
pnpm test         # unit + e2e
pnpm verify       # check + lint + unit + build  ← CI gate
```

---

## How the project is organised

```
src/
├── content/                 typed content collections (zod-validated)
│   ├── faculty/             one .json per scholar (director + core + visiting + advisory)
│   ├── programmes/          one .json per programme (mba-bf, mms, bms, phd)
│   ├── events/              one .json per event with category + date + icon
│   ├── alumni/              spotlight + notable cards
│   └── config.ts            collection schemas
│
├── layouts/                 BaseLayout · PublicLayout · AdminLayout
├── components/              reusable .astro components, grouped by domain
│   ├── nav/                 Nav, Footer (mounted by PublicLayout)
│   ├── layout/              PageHero, CtaBanner
│   ├── home/                hero + heritage + stats blocks
│   ├── programmes/          ProgramCard
│   ├── people/              FacultyCard, PersonCard, AlumniCard
│   ├── proof/               testimonial slider, recruiters marquee
│   ├── events/              EventCard
│   └── admin/               sidebar, kpi tiles, tables (used by /admin/dashboard)
│
├── pages/                   Astro routes (1:1 with URL paths)
│   ├── index.astro · about.astro · programs.astro · placements.astro
│   ├── faculty.astro · events.astro · alumni.astro · contact.astro
│   ├── admissions.astro · apply.astro
│   ├── admin/login.astro · admin/dashboard.astro
│   └── api/enquiries.ts · api/applications.ts
│
├── styles/                  layered global CSS
│   ├── tokens.css           CSS custom properties (colours, type, spacing, motion)
│   ├── main.css             base + components (the design system)
│   └── pages.css            page-scoped styles (placements, events, apply, admin…)
│
├── scripts/                 ES-module behaviours (per-page imports keep bundles small)
│   ├── boot.ts              loader · scroll progress · sticky nav · mobile menu · magnetic
│   ├── reveal.ts · cursor.ts · counters.ts · particles.ts · hero-words.ts
│   ├── testimonial-slider.ts · filter-chips.ts · enquiry-form.ts
│   ├── apply/stepper.ts · apply/payment.ts
│   └── admin/auth-gate.ts · admin/login.ts · admin/dashboard.ts
│
└── lib/                     domain logic, validation, adapters
    ├── schema.ts            zod schemas for Application, Enquiry, Login, Session
    ├── format.ts            INR currency, dates, fee-with-GST math
    ├── site.ts              brand info, nav links, contact details
    ├── analytics.ts         pluggable event() — defaults to no-op
    ├── cms/                 CmsAdapter (localStorage today, http when flagged)
    ├── payments/            PaymentGateway interface + razorpay-mock
    ├── auth/                AuthAdapter + clientMockAuth
    └── data/                static datasets too small for collections
                             (placements, recruiters, FAQ, fees, scholarships…)

public/
├── favicon.svg
├── robots.txt
└── img/                     drop institute photography here
```

---

## Editing content (no code required)

| Want to… | Edit |
|---|---|
| Add a faculty member | Add `src/content/faculty/dr-newperson.json` matching the schema |
| Update a programme's tuition | `src/content/programmes/mms.json` |
| Publish a new event | Add `src/content/events/13-new-event.json` |
| Change the home hero copy | `src/pages/index.astro` (search for `hero__title`) |
| Update phone / email / address | `src/lib/site.ts` |
| Change the FAQ list | `src/lib/data/contact.ts` |
| Update placement KPIs | `src/lib/data/placements.ts` |

The schema in `src/content/config.ts` validates every field at build time — if you add a faculty record without `name` or `bio`, the build will tell you exactly which file is wrong.

---

## Architecture — the big calls

### 1. Layouts replace duplicated chrome
`PublicLayout` mounts `Nav` + `Footer` once. The active link is computed from `Astro.url.pathname` — no per-page `class="active"` to maintain. `AdminLayout` is a separate shell (no nav/footer, client-side auth gate).

### 2. Per-page JS islands
Each page imports only the scripts it needs. The home page boots counters + slider + marquee + particles; the apply page boots the stepper + payment modules; the contact page boots the enquiry form. Astro's per-page bundling does the code-splitting.

### 3. Adapters isolate mocks
`lib/cms`, `lib/payments`, `lib/auth` each expose an interface plus a default implementation. To swap the mock Razorpay for the real SDK, write `lib/payments/razorpay-real.ts` matching the same `PaymentGateway` interface and change one import in `scripts/apply/payment.ts`. UI doesn't change.

### 4. Real API routes behind a flag
`/api/enquiries` and `/api/applications` validate with the same zod schemas the client uses. They write to `.data/*.json` in dev (gitignored). Set `PUBLIC_USE_SERVER_API=true` in `.env.local` to route writes through them; default is local-storage-only.

### 5. localStorage keys preserved
`mmbgims_applications`, `mmbgims_enquiries`, `mmbgims_session`, `mmbgims_content_home` are byte-compatible with the legacy reference build, so the admin dashboard's "Seed Demo Data" button and existing in-flight applications continue to work end-to-end.

---

## Production-grade plumbing

| Concern | Where it lives | What it does |
|---|---|---|
| **Security headers** | [src/middleware.ts](src/middleware.ts) for SSR routes, [server.mjs](server.mjs) for static, [vercel.json](vercel.json) / [netlify.toml](netlify.toml) for platform deploys | CSP scoped to fonts.googleapis, OpenStreetMap, Razorpay; HSTS preload; X-Frame DENY; nosniff; strict referrer; Permissions-Policy locking down geolocation/camera/mic |
| **Rate limiting** | [src/middleware.ts](src/middleware.ts) | Per-IP+path token bucket on `/api/*` (20 req / 60s). For real abuse, sit Cloudflare Turnstile or the Vercel firewall in front. |
| **Health probe** | [src/pages/api/health.ts](src/pages/api/health.ts) | `GET /api/health` → `{status, timestamp, version}`; `cache-control: no-store`; never depends on DB/payments |
| **404 page** | [src/pages/404.astro](src/pages/404.astro) | Branded fallback with home + contact CTAs |
| **OG / SEO** | [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) | Per-page title/description, canonical, Open Graph (with [public/og.svg](public/og.svg)), Twitter card, theme-color, JSON-LD EducationalOrganization on home |
| **Sitemap + robots** | `@astrojs/sitemap` + [public/robots.txt](public/robots.txt) | Generated at build (excludes `/admin/*` + `/api/*`) |
| **Prefetch** | `astro.config.mjs` | `prefetchAll` with `viewport` strategy — every visible link is warmed up |
| **HTML compression + immutable assets** | `compressHTML: true` in config; `Cache-Control: public, max-age=31536000, immutable` on `/_astro/*` | Smaller payloads + perfect cache hits on hashed bundles |
| **Graceful shutdown** | [server.mjs](server.mjs) | SIGTERM/SIGINT drain with 10s deadline — clean rolling deploys |
| **CI gate** | [.github/workflows/ci.yml](.github/workflows/ci.yml) | typecheck → lint → unit → build → e2e (Playwright) on every PR |
| **Tests** | [tests/unit/](tests/unit/) (vitest) · [tests/e2e/](tests/e2e/) (Playwright) | 16 unit + 21 e2e covering all 12 pages, all API routes, the apply flow, the admin dashboard, and the rate limiter |

---

## Razorpay integration — production path

The current build uses `lib/payments/razorpay-mock.ts` — a 3.2-second simulated handshake that returns a synthetic payment id. To wire the real Razorpay SDK:

1. **Server**: add `/api/razorpay/order` to mint an order id with the Razorpay Node SDK (server-side secret).
2. **Client**: `scripts/apply/payment.ts` already calls `razorpay-mock.charge()`. Replace that import with a `razorpay-real.ts` adapter that loads `https://checkout.razorpay.com/v1/checkout.js` and invokes `new Razorpay(options)`.
3. **Webhook**: add `/api/razorpay/webhook.ts` that listens for `payment.captured` and flips the application's status from `submitted` to `paid`. Verify the `x-razorpay-signature` header.
4. **Env**: add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` to your hosting provider.

The `Application.payment` shape already reflects what Razorpay returns — `paymentId`, `method`, `amountLabel`, `capturedAt` — so the dashboard, CSV export, and email confirmations need no changes.

---

## Admin / CMS

Sign in at `/admin/login` with the demo credentials:

```
director@mmbgims.com / bgims2026
```

(or any `*@mmbgims.com` email with a 6+ character password — the auth adapter is `clientMockAuth`; replace with `lib/auth/server.ts` when wiring real auth).

The dashboard reads from the `cms` adapter, so anything the public site writes (real applications, enquiries) shows up immediately, and the **Seed demo data** button populates 12 sample applications + 4 enquiries for previewing filters and CSV export.

---

## Brand identity

| Token | Value | Use |
|---|---|---|
| **Maroon (primary)** | `#722325` | Authority, heritage |
| **Brass gold** | `#B8965A` | Luxury accents |
| **Peacock teal** | `#0F4C4C` | Tertiary character / Indian heritage warmth |
| **Cream / parchment** | `#F5EFE3` | Background |
| **Ink** | `#0F0C0A` | Text, dark sections |

**Type stack:** Cormorant Garamond (display), Fraunces (editorial serif), Italiana (italic accent), Manrope (body), JetBrains Mono (codes).

Tokens live in `src/styles/tokens.css`. Edit there to retheme.

---

## Deploying

### Self-hosted Node

`pnpm build && pnpm start` runs [server.mjs](server.mjs) — a thin wrapper that adds security headers, immutable cache-control on hashed assets, graceful shutdown, and serves both prerendered HTML and the SSR API routes from one process. Put this behind nginx/Caddy with TLS termination and you're shipping.

```bash
pnpm install --frozen-lockfile
pnpm build
HOST=0.0.0.0 PORT=4321 pnpm start
# or
pm2 start server.mjs --name mmbgims
```

Required env (see `.env.example`):

| Variable | Used by | Required? |
|---|---|---|
| `PORT`, `HOST` | server.mjs | optional, defaults `4321` / `0.0.0.0` |
| `PUBLIC_USE_SERVER_API` | client cms adapter | optional (`true` to route writes through `/api/*`) |
| `RESEND_API_KEY` | `/api/enquiries` | optional (skipped if absent — confirmation emails just log) |
| `MMBGIMS_DATA_DIR` | `/api/*` server-side persistence | optional, defaults `.data/` |

### Vercel · Netlify · Cloudflare

### Vercel (one-click)

The adapter switches automatically when Vercel sets `VERCEL=1` during build — no code change needed. Connect the repo on Vercel and it will:

1. `pnpm install --frozen-lockfile`
2. `pnpm build` → `@astrojs/vercel/serverless` writes `.vercel/output/`
3. Static pages → CDN edge; `/api/*` + SSR routes → serverless functions

**Required env vars** on the Vercel project (Settings → Environment Variables):

| Var | Value |
|---|---|
| `SESSION_SECRET` | `openssl rand -hex 32` (32+ chars; required for cookie auth) |
| `DATABASE_URL` | `libsql://<your-db>.turso.io` (see Turso step below; optional — falls back to in-memory) |
| `DATABASE_AUTH_TOKEN` | from `turso db tokens create <db>` (required if `DATABASE_URL` is set) |
| `ADMIN_PASSWORD` | strong password for the seeded Director user |

**Turso (the production DB):**

```bash
# One-time, locally:
brew install tursodatabase/tap/turso          # or: curl -sSfL https://get.tur.so/install.sh | bash
turso auth signup
turso db create mmbgims
turso db show mmbgims --url                   # → libsql://… (set as DATABASE_URL on Vercel)
turso db tokens create mmbgims                # → set as DATABASE_AUTH_TOKEN

# Apply migrations + seed the Director user against Turso:
DATABASE_URL=libsql://… DATABASE_AUTH_TOKEN=… pnpm db:migrate
DATABASE_URL=libsql://… DATABASE_AUTH_TOKEN=… ADMIN_PASSWORD=… pnpm db:seed
```

If you skip Turso, the Vercel functions fall back to **in-memory libSQL** — the site stays up but applications/enquiries don't persist across cold starts. Useful for previewing the design; not for actual launch.

### Netlify · Cloudflare

```bash
pnpm add @astrojs/netlify       # or @astrojs/cloudflare
```

Add the matching auto-select branch to [astro.config.mjs](astro.config.mjs) alongside the existing Vercel one. The DB story is the same — point `DATABASE_URL` at Turso (or Cloudflare D1 with a small driver swap).

The provided [vercel.json](vercel.json) and [netlify.toml](netlify.toml) configure security headers + asset cache-control + legacy `.html` → clean URL redirects so launch-day URLs from the old site don't 404.

---

## Reference build

The original 12-page reference HTML build (the source of all design + copy) is preserved in `_reference/`. Open both side-by-side when verifying visual parity.

---

© 2026 — Maratha Mandir's Babasaheb Gawde Institute of Management Studies.
