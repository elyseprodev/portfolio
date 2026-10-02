# ELYSE DEV — completion report

**Branch:** `arena/01a0fa94-portfolio` · **Pull request:** [#1](https://github.com/elyseprodev/portfolio/pull/1) · **Head commit:** `febb982`
**Run it locally:** `npm install` → `npm run db:sync` → `npm run dev:server` (port 4000) → `npm run dev:client` (port 3000)

---

## 1. What is built

| Part | Stack | Where |
| --- | --- | --- |
| `client` | Next.js 15 (App Router), React 19, TypeScript, Tailwind | `client/` |
| `server` | Express 5, TypeScript, Zod, rate limiting, caching | `server/` |
| `database` | Mongoose schemas + models, MongoDB store, local JSON-store fallback | `database/` |

Nine pages: Home, About, Skills, Projects, Project details (per project), Experience, GitHub, Contact, custom 404.
Visual identity: liquid-glass dark UI, orange `#F97316` on `#0F0F0F`/charcoal, white / `#D1D5DB` / `#9CA3AF` text, cursor layer, ambient glow, magnetic buttons, glass reflections, page transitions, scroll reveals — all respecting `prefers-reduced-motion`.

### Added in this round

**Pictograph headings, on both pages you asked for**

- `/skills` — 🎨 Frontend · ⚙️ Backend · 🗄️ Database · 🧰 Tools & Platforms
- `/experience` — a new **Depth by discipline** section with three cards (⚙️ Backend, 🗄️ Database, 🧰 Tools & Platforms). Each card lists concrete practices, links to the evidence in this repository, and links to the matching skills group.
- The emoji is a separate field (`emoji` on `SkillGroup`) rendered inside an `aria-hidden` span, so a screen reader announces "Backend", not "gear". One shared component (`SkillGroupTitle`) drives both pages so they cannot drift apart.
- Wording only describes what this repository and the listed projects actually contain — no dates, employers, certificates or invented metrics. Edit it in `client/src/content/disciplines.ts`.
- Two group names changed to match your wording: "Databases" → **Database**, "Development & Practice" → **Tools & Platforms**.

**Deployment kit — prepared, not performed**

| File | What it does |
| --- | --- |
| `render.yaml` | Render Blueprint for the API: health check, secret placeholders, auto-generated contact salt, CA-bundle fix |
| `client/vercel.json` | Vercel config for the client: framework, monorepo install command, security headers |
| `Dockerfile` + `.dockerignore` | The API as an image for Railway / Fly.io / a VPS |
| `.github/workflows/ci.yml` | Lint, types, tests, build and contrast budget on every push |
| `docs/DEPLOYMENT.md` | Atlas → Render → Vercel in order, with a verification command after every step |

---

## 2. Checks actually executed

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | exit 0, no warnings |
| Types | `npm run typecheck` | 0 errors |
| Tests | `npm test` | **48 pass / 0 fail** (20 API across 3 suites, 28 client across 2 suites) |
| Page audit | `npm run audit` | **13/13 routes**, 0 warnings — one `h1` each, labelled controls, alt text, no duplicate ids, no dead links |
| Contrast | `npm run check:contrast` | **20/20** pairings meet WCAG AA |
| Production build | `npm run build -w @elyse/client` | **21/21 routes** compiled |
| SEO files | build with `NEXT_PUBLIC_SITE_URL` set | absolute-URL `sitemap.xml` for all 12 public routes + matching `robots.txt` (deliberately empty without the variable, rather than inventing a domain) |
| Live pictographs | `GET /skills` | all four emoji present, each inside an `aria-hidden` span |
| Live discipline cards | `GET /experience` | three cards render with evidence links |
| Live GitHub data | `GET /github` | "Live GitHub data" — 11 public repos, 10 non-fork, languages CSS / JavaScript / TypeScript / Vue |

**Not executed, and why:** no real browser exists in this environment (`playwright install` is blocked), so the visual pass is based on prerendered HTML/CSS, the audit script and the rendered OG image rather than a screenshot; **Docker is unavailable**, so the `Dockerfile` is written and reviewed but not build-tested; no MongoDB binary is available, so the database run used the JSON-store fallback; nothing was deployed, because that needs your accounts.

The social-sharing card your links will use is at `og-preview-elyse-dev.png` (1200×630: "Elyse Dev", the ED mark, the stack chips and `github.com/elyseprodev`).

---

## 3. Three things that need your accounts

Full detail, including a troubleshooting table, is in `docs/DEPLOYMENT.md`. The short version:

**Step 1 — MongoDB Atlas (the database).** Create a free M0 cluster, a database user, and allow network access. Then:

```bash
export MONGODB_URI="mongodb+srv://…"
npm run db:seed
npm run db:verify     # must print: backend : mongodb
```

Until this is done the API runs on the local JSON store and says so in every response.

**Step 2 — Render (the API).** New → Blueprint → pick this repo; Render reads `render.yaml`. Fill the secret prompts: `MONGODB_URI`, `CORS_ORIGIN` (your Vercel URL), and optionally `GITHUB_TOKEN`, `RESEND_API_KEY`, `CONTACT_NOTIFY_TO`. Verify with `curl https://<your-api>.onrender.com/api/health`. Leave the Root Directory at the repository root — the API imports the local `@elyse/database` workspace, so pointing Render at `server/` would fail to build.

**Step 3 — Vercel (the website).** Import this repo, set **Root Directory = `client`**, and enable **"Include files outside the root directory"**. Environment variables: `API_URL` (your Render URL — server-side only, never exposed to the browser) and `NEXT_PUBLIC_SITE_URL` (your public domain). Then set `CORS_ORIGIN` on Render to the Vercel domain and redeploy the API.

Vercel hosts the website, Render hosts the API, Atlas hosts the database. Nothing was deployed on your behalf.

---

## 4. Content still needed from you

Nothing below blocks the site from working — each item is a placeholder that is clearly marked as editable.

1. **Repository → project mapping.** `docs/CONTENT-CHECKLIST.md` §1 lists all 11 public repos with the project each one maps to. Please confirm or correct it.
2. **Vue.** Your `game` repo is Vue; Vue is not currently in the skills list. Say the word and it is added.
3. **Contact e-mail.** The contact form stores and validates messages today; the e-mail address shown on the contact page and the notification recipient are still placeholders (§2).
4. **Light Education and the student messaging / video apps** are deliberately generic placeholders — real names, descriptions and screenshots are yours to drop into `client/src/content/projects.ts`.
5. **Book of Family Library** (`bookoffamily.lovable.app`) was added afterwards as a live project — its stack and status are the two inferred fields to confirm (`docs/CONTENT-CHECKLIST.md` §1c).
6. **Menvax** could not be added: `menvax.netlify.app` returns Netlify's "Site not found" page — a working URL is needed (§1c).

After editing anything under `client/src/content/`, run `npm run db:sync` and `npm run db:seed` — the deployed site reads from the database, not from the bundle. There is a section on this in `docs/DEPLOYMENT.md`.
