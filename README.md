# ELYSE DEV — portfolio

**MURENGERANTWARI Elyse** · Full-Stack Software Developer · Rwanda

A complete, multi-page developer portfolio built as one product: a **Next.js client**, an
**Express API** and a **database layer** that works with MongoDB (with an honest local
fallback). The visual identity is dark liquid glassmorphism on an orange-and-black palette,
with a shared pointer-effect system, scroll reveals and reduced-motion support throughout.

> **Everything here is real or clearly marked as pending.** No invented employers,
> certificates, statistics, testimonials or repository links. See
> [`docs/CONTENT-CHECKLIST.md`](docs/CONTENT-CHECKLIST.md) for the handful of details that
> only Elyse can supply.

---

## Contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Editing content](#editing-content)
- [Database](#database)
- [Contact form](#contact-form)
- [GitHub activity](#github-activity)
- [Design system](#design-system)
- [Accessibility & performance](#accessibility--performance)
- [Quality checks that were run](#quality-checks-that-were-run)
- [Deployment](#deployment)
- [Project structure](#project-structure)

---

## Architecture

Three workspaces, one repository, one dependency tree (npm workspaces):

```
┌────────────────────────┐      server-side fetch       ┌────────────────────┐
│   client/  (Next.js)   │ ───────────────────────────► │  server/ (Express) │
│  App Router, React 19  │   API_URL (never the browser)│  Zod, CORS, rl    │
└───────────┬────────────┘                              └─────────┬──────────┘
            │ imports types only                                  │ ContentStore
            ▼                                                     ▼
┌────────────────────────────────────────┐          ┌─────────────────────────┐
│ database/ (types, schemas, seed data)  │ ◄────────│ MongoDB  or  JSON store │
└────────────────────────────────────────┘          └─────────────────────────┘
```

**Why it is split this way**

| Layer        | Responsibility                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| `client/`    | Routing, rendering, the glass design system, pointer effects, page transitions, forms, metadata.        |
| `server/`    | Content API, contact validation + rate limiting + optional notifications, GitHub proxy, health reporting. |
| `database/`  | Shared domain types, Mongoose schemas/models, seed data, and the `ContentStore` contract with two adapters (MongoDB and a local JSON store). |

The browser **never** talks to the API directly and never learns its URL: React Server
Components fetch content on the server, and the contact form posts to a same-origin Next.js
route handler (`/api/contact`) that proxies to the Express API. That removes CORS problems,
keeps secrets server-side, and means a slow or dead API degrades to the bundled typed content
instead of showing a broken page.

---

## Tech stack

| Area            | Choice                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| Client          | Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, Motion |
| Fonts / icons   | `geist` (self-hosted) · inline SVG icon set (no icon font, no requests) |
| Server          | Express 5, Zod 4, CORS, in-memory rate limiting                        |
| Database        | MongoDB via Mongoose 8, with a dependency-free JSON-store fallback      |
| Tooling         | npm workspaces, tsx, ESLint 9 (flat config + Next + a11y + hooks), TypeScript strict |

---

## Getting started

Requirements: **Node ≥ 20.9** (developed on Node 22). MongoDB is optional.

```bash
git clone https://github.com/elyseprodev/portfolio.git
cd portfolio
npm install
cp .env.example .env      # optional: fill in what you have
npm run dev               # API on :4000 and the site on :3000
```

Open <http://localhost:3000>. Without any configuration the API runs on the local JSON store
and the contact form stores messages in `database/.data/contact-messages.json` (git-ignored).

> **Dev servers bind to `0.0.0.0`** so they can be reached from container/preview hosts.

### Run the pieces separately

```bash
npm run dev:server   # Express API only  (http://localhost:4000)
npm run dev:client   # Next.js site only  (http://localhost:3000)
```

---

## Scripts

| Command                       | What it does                                                        |
| ----------------------------- | ------------------------------------------------------------------- |
| `npm run dev`                 | API + client together (concurrently)                                |
| `npm run build`               | Production build of the client                                      |
| `npm start`                   | Start the API and the built client                                  |
| `npm run lint`                | ESLint across the whole repo (flat config, Next + a11y + hooks)      |
| `npm run typecheck`           | `tsc --noEmit` for every workspace                                  |
| `npm test`                    | All test suites: API (14) + client form rules and content integrity (27) |
| `npm run audit`               | Audits 13 rendered routes (headings, landmarks, labels, alt text, ids, links) |
| `npm run check:contrast`      | WCAG contrast maths for every text/glass pairing; fails below AA     |
| `npm run db:sync`             | Mirror `client/src/content/*` → `database/data/*.json`               |
| `npm run db:seed`             | Seed MongoDB (requires `MONGODB_URI`)                               |
| `npm run db:verify`           | Report the active backend and check the content it serves            |

---

## Editing content

**Content lives in one place:** [`client/src/content/`](client/src/content).

```
client/src/content/
├── profile.ts      → name, role, bio, focus areas, links, highlights
├── projects.ts     → project cards and full project detail pages
├── skills.ts       → skill groups (grouped by discipline, no fake percentages)
└── experience.ts   → timeline entries; `isPlaceholder: true` = needs your input
```

After editing, mirror it into the database layer so the API serves the same content:

```bash
npm run db:sync     # writes database/data/*.json
npm run db:seed     # optional: push into MongoDB
```

### Honesty rules baked into the content model

- `isDraft: true` on a project renders a visible **“Details pending”** badge and hides link
  buttons that would 404. Projects without links say “Repository link not provided yet”.
- `isPlaceholder: true` on an experience entry lists it in an **“Editable placeholders”**
  panel — it is never presented as verified history.
- Skills are grouped by discipline with a note describing **what each tool is used for**;
  there are no invented proficiency percentages.
- The GitHub page never fabricates contribution graphs, streaks, stars or repo counts: it
  either shows live API data or says why it cannot.

---

## Database

Two adapters implement the same `ContentStore` interface:

1. **MongoDB** (`database/src/store/mongo-store.ts`) — used whenever `MONGODB_URI` is set and
   reachable. Seeds itself from `database/data/*.json` on first run.
2. **Local JSON store** (`database/src/store/json-store.ts`) — zero-dependency fallback.

If `MONGODB_URI` is set but **unreachable**, the API logs the failure loudly, serves from the
JSON store and reports `"degraded": true` through `GET /api/health` and the footer status
line — a misconfigured production deployment can never silently pretend to be fine.

```bash
docker compose up -d      # start MongoDB 7 locally
npm run db:seed           # seed it
npm run db:verify         # confirm which backend is answering
```

**Collections:** `profile`, `projects`, `skill_groups`, `experience`, `contact_messages`.

---

## Contact form

1. The browser validates (immediate feedback) and posts to `/api/contact` (same origin).
2. The Next.js route handler forwards the payload to the Express API.
3. The API validates again with Zod — client checks are convenience, not the security boundary.
4. Honeypot field (`company`) silently discards bot submissions.
5. Rate limit: 5 messages per hour per salted IP+user-agent fingerprint (no raw IP stored).
6. The message is stored through the active `ContentStore`.
7. **E-mail notification is optional.** With `RESEND_API_KEY` + `CONTACT_NOTIFY_TO` set, an
   e-mail is sent; without them the API returns `notification: "not-configured"` and the UI
   says plainly that the message was stored but **no e-mail was sent**.
8. Errors are mapped back onto individual fields; rate limits and outages get their own,
   honest messages. There is no fake “sent!” state anywhere.

Stored messages are **not** publicly readable: `GET /api/contact` exposes a count only.

---

## GitHub activity

`GET /api/github` proxies the public GitHub REST API (server-side, optionally with
`GITHUB_TOKEN`), caches responses for five minutes, and reports rate limits in the payload.
When GitHub cannot be reached the route returns `available: false` with a human-readable
reason, and the page shows a curated list of **real** repositories instead.

> **Known data issue:** `https://github.com/ElissaElyse7` currently returns **404** (verified
> during development), so live activity cannot resolve for that handle. Confirm or correct
> the username — see [`docs/CONTENT-CHECKLIST.md`](docs/CONTENT-CHECKLIST.md).

---

## Design system

Tailwind CSS v4 with design tokens declared in [`client/src/app/globals.css`](client/src/app/globals.css):

- **Colours:** primary orange `#F97316`, near-black `#08080B`/`#0F0F0F`, text `#FFFFFF`,
  secondary `#D1D5DB`, muted `#9CA3AF`, translucent white glass borders.
- **Glass surfaces:** `.glass`, `.glass-subtle`, `.glass-solid`, `.glass-edge`,
  `.glass-interactive` (pointer-tracked specular highlight via `--spot-x/--spot-y`).
  Blur, translucency and shadows are tuned once and reused everywhere.
- **Type scale:** fluid `text-display` → `text-caption` tokens, so headings scale from 320px
  to 1440px without media queries.
- **Motion tokens:** `--ease-glass` (cubic-bezier(0.22, 1, 0.36, 1)), `--duration-quick/base/slow`.
- **Effects:** a single ref-counted pointer listener feeds the custom cursor, ambient glow,
  magnetic buttons and card spotlights — no per-component global listeners.

---

## Accessibility & performance

Contrast and structure are **measured, not asserted**: `npm run check:contrast` computes WCAG
ratios for every text/glass pairing and `npm run audit` checks 13 rendered routes. Full results,
including the defect they found (white-on-orange button labels at 2.80:1, now 7.01:1 with a
near-black label on the same brand fill) and the two deliberate INFO rows, are in
[`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md).

- One `<h1>` per page, semantic landmarks (`header`, `nav`, `main`, `footer`), skip-to-content link.
- Visible focus rings everywhere; keyboard-operable navigation, filters, gallery and forms.
- The mobile menu is a labelled dialog: Escape closes, focus moves in and returns, scroll locks.
- `prefers-reduced-motion` neutralises page transitions, reveals, drift animations and every
  pointer effect; the native cursor is kept on touch devices.
- Pointer effects are `pointer-events: none`, `aria-hidden`, and never replace native feedback.
- Content is visible without JavaScript (a `<noscript>` rule cancels reveal animations).
- Transform/opacity-only animations, no layout thrash, `next/image` with explicit sizes,
  self-hosted fonts, no icon fonts, no third-party scripts on any page.

---

## Quality checks that were run

All commands below were executed in this environment:

| Command                                          | Result |
| ------------------------------------------------ | ------ |
| `npm test`                                       | **41 tests, 0 failures** — API (14, real HTTP against the Express app) + client (27: form rules and content-integrity checks) |
| `npm run typecheck`                              | Passes for `client`, `server` and `database` (TypeScript strict) |
| `npm run lint`                                   | Passes across the repo; also runs inside `next build` |
| `npm run build` (client)                         | **20 routes** built: 8 pages, 4 project detail pages, 2 API handlers, icon/OG image/manifest/robots/sitemap |
| `npm run audit`                                  | **13/13 routes pass**, 0 warnings — and validated against a negative control that it correctly failed |
| `npm run check:contrast`                         | All text, control and focus pairings meet WCAG AA (two decorative hairlines reported as INFO) |
| `npm run db:sync` / `db:verify`                  | Content mirrored and served from the JSON store |
| Live preview (`next dev` + API on `:4000`)       | Every route returned **200**; unknown routes returned **404**; contact POST stored a message end-to-end |

What could **not** be run here: a real browser (the sandbox has no Chromium and blocks the
browser CDNs), so visual verification was done through the prerendered HTML/CSS, the
generated Open Graph image and the build output rather than screenshots.

---

## Deployment

**Client** (Vercel or any Node host):

```bash
API_URL=https://api.your-domain.com     # server-only; the browser never sees it
NEXT_PUBLIC_SITE_URL=https://your-domain.com   # enables canonical URLs + sitemap
```

**Server** (Render, Railway, Fly, a VPS…):

```bash
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-domain.com
MONGODB_URI=mongodb+srv://…
MONGODB_DB=elyse_dev
GITHUB_TOKEN=…            # optional, higher rate limit
RESEND_API_KEY=…          # optional, e-mail notifications
CONTACT_NOTIFY_TO=you@example.com
CONTACT_NOTIFY_FROM=onboarding@resend.dev
CONTACT_FINGERPRINT_SALT=<random string>
```

The API runs through `tsx` (`npm start -w @elyse/server`); the health endpoint is
`GET /api/health`. Never commit `.env` — only `.env.example` is tracked.

---

## Project structure

```
portfolio/
├── client/                     # Next.js 15 App Router
│   ├── public/images/          # generated concept artwork + developer mark
│   ├── scripts/                # artwork generator, page audit, contrast checker
│   └── src/
│       ├── app/                # routes, layout, metadata, api handlers, globals.css
│       ├── components/
│       │   ├── effects/        # background, cursor, glow, page transition
│       │   ├── layout/         # navbar, mobile nav, footer, page container, header
│       │   ├── motion/         # scroll reveal
│       │   ├── projects/       # project card + filterable grid
│       │   ├── sections/       # homepage + shared sections
│       │   └── ui/             # glass surfaces, buttons, badges, icons, form pieces
│       ├── content/            # ← EDIT CONTENT HERE
│       └── lib/                # api bridge, content loaders, pointer store, hooks, utils
├── server/                     # Express 5 API
│   ├── src/{config,routes,services,middleware,lib}/
│   └── tests/api.test.ts       # 14 tests over real HTTP
├── database/                   # types, schemas, models, stores, seed data, scripts
└── docs/
    ├── API.md                  # endpoint reference with real responses
    ├── ACCESSIBILITY.md        # measured contrast + audit results
    └── CONTENT-CHECKLIST.md    # what still needs your input
```

---

Built by **MURENGERANTWARI Elyse** — client, server and database written from scratch.
Content that is still pending is labelled as such, on purpose.
