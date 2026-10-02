# Content checklist — what still needs your input

Everything on the site is either **verified** or **explicitly marked as pending**. This file
lists the pending items, where they live, and how to fill them in. Nothing here is invented
on your behalf, so a few sections are intentionally empty until you supply them.

---

## 1. ⚠️ Confirm your GitHub username (highest priority)

You supplied `https://github.com/ElissaElyse7`.

**During development that URL returned HTTP 404** — the account is not publicly reachable
(verified twice: via `curl` against the GitHub API and in the browser-facing page). The
organisation that hosts this repository (`elyseprodev`) does resolve, which suggests the
handle may have changed or is spelled differently.

Fix it in **three** places:

| File                                   | What to change                                     |
| -------------------------------------- | -------------------------------------------------- |
| `client/src/content/profile.ts`        | `github:` URL                                      |
| `client/src/content/site.ts`           | `github:` URL                                      |
| `server/src/config/env.ts` / `.env`    | `GITHUB_USERNAME=` (defaults to `ElissaElyse7`)     |

Until then the GitHub page shows an honest "curated list" fallback instead of live activity.

---

## 2. Public e-mail address (optional)

`client/src/content/profile.ts` → `email: ""`

- Leave empty and the contact page says the address is not published, which is honest.
- Set it and a `mailto:` link appears in the footer, contact page and about page.
- To **receive** messages by e-mail (not just store them), set `RESEND_API_KEY` and
  `CONTACT_NOTIFY_TO` on the server. Without them the form tells visitors plainly that the
  message was stored but no e-mail was sent.

---

## 3. Education, work and certificates

`client/src/content/experience.ts` — three entries are `isPlaceholder: true`:

| Entry id                 | What to add                                             |
| ------------------------ | ------------------------------------------------------- |
| `formal-education`       | Programme, institution, years, qualification           |
| `professional-experience`| Employer/client, role, dates, verified outcomes         |
| `courses-certificates`   | Course/certificate title, issuer, verification link     |

When you fill one in, set `isPlaceholder: false` — it then renders as a normal timeline entry
instead of appearing in the "Editable placeholders" panel.

---

## 4. Project details

`client/src/content/projects.ts` — three projects are `isDraft: true` and show a
**"Details pending"** badge:

- `light-education`
- `campus-connect`
- `video-web-app`

For each one you can supply:

- `links[]` — a live demo URL and/or the repository URL (only add links that exist; the card
  shows "Repository link not provided yet" rather than a dead button).
- `gallery[]` — real screenshots. Current entries are generated concept artwork in the site's
  visual language (regenerate with `node client/scripts/generate-project-artwork.mjs` or simply
  drop PNG/JPG files into `client/public/images/projects/` and update the paths).
- `overview[]`, `problem`, `goals[]`, `features[]`, `challenges[]` — the case-study copy.
- `status` / `year` / `category` / `stack`.

Set `isDraft: false` once the write-up is real.

---

## 5. A real portrait (optional)

`client/public/images/elyse-dev-mark.svg` is an abstract monogram illustration used on the
home and about pages. If you want a photograph instead:

1. Add `client/public/images/portrait.jpg` (roughly square, ideally ≥ 1200px).
2. Swap the `src` in `client/src/components/sections/home/HeroSection.tsx`,
   `AboutPreviewSection.tsx` and `client/src/app/about/page.tsx`.
3. Update the `alt` text to describe you.

The site is deliberate about not presenting generated imagery as a photograph of you.

---

## 6. Infrastructure values (`.env`)

| Variable                   | Needed for                                              |
| -------------------------- | ------------------------------------------------------- |
| `MONGODB_URI`              | Real persistence (otherwise the JSON store is used)     |
| `MONGODB_DB`               | Database name (default `elyse_dev`)                     |
| `CORS_ORIGIN`              | Browser origins allowed to call the API                 |
| `API_URL` (client)         | Where the Next.js server finds the API                  |
| `NEXT_PUBLIC_SITE_URL`     | Canonical URLs, sitemap, absolute Open Graph URLs        |
| `GITHUB_TOKEN`             | Higher GitHub rate limit for the activity page           |
| `RESEND_API_KEY` + `CONTACT_NOTIFY_TO` | E-mail notifications for contact messages    |
| `CONTACT_FINGERPRINT_SALT` | Random string; salts the abuse-tracking fingerprint      |

Copy `.env.example` → `.env`. **Never commit `.env`.**

---

## 7. Things that are intentionally absent

To keep the site credible, these do **not** exist anywhere in the code:

- Testimonials or client quotes
- Employer history, job titles or dates
- Certificates or course completions
- User counts, download counts, uptime percentages or any other metric
- Contribution graphs, streaks, star counts or repository totals
- Social profiles other than the GitHub account you supplied
- A production domain name or canonical URLs

Add them only when they are true and verifiable — the components already support them.
