# Deploying ELYSE DEV

Three pieces, deployed in this order: **database → API → website**. Each step ends with a
verification you can run, so you never have to guess whether a step worked.

Total cost for this setup: **£0 / $0** on free tiers (MongoDB Atlas M0, Render free web
service, Vercel Hobby).

```
   Vercel (client)                Render (API)                MongoDB Atlas
   your-site.vercel.app   ──►  elyse-dev-api.onrender.com  ──►  cluster0…
   Next.js server-side fetch     Express + tsx                 database: elyse_dev
```

---

## 0. Before you start

| You need | Why |
| --- | --- |
| A GitHub account with this repository | Both hosts deploy from GitHub |
| The branch merged to `main` (or deploy the branch directly) | Simplest to keep deploying one branch |
| About 20 minutes | Mostly waiting for dashboards |

Check your work locally first — everything below assumes this passes:

```bash
npm ci --include=dev
npm run lint && npm run typecheck && npm test && npm run build
```

---

## 1. Database — MongoDB Atlas

1. Create a free account at <https://cloud.mongodb.com> and choose **Build a Database → M0
   (free)**.
2. Region: pick the one closest to your API host (Frankfurt pairs well with Render's Frankfurt
   region).
3. **Database Access → Add New Database User** — username `elyse_dev`, click *Autogenerate
   Secure Password*, and **copy the password now** (it is shown once).
4. **Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`). Managed
   hosts do not have static outbound IPs on free plans, so this is required. The credentials —
   not the IP allowlist — are what protect the database.
5. **Connect → Drivers → Node.js** and copy the connection string. It looks like:

   ```
   mongodb+srv://elyse_dev:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

6. Replace `<password>` with the real password. If your password contains `@ : / ?` or `#`,
   percent-encode those characters (`@` → `%40`) or the URI will fail to parse.

**Verify before moving on.** From your machine, with the real URI:

```bash
MONGODB_URI="mongodb+srv://…" MONGODB_DB=elyse_dev npm run db:seed
MONGODB_URI="mongodb+srv://…" MONGODB_DB=elyse_dev npm run db:verify
```

`db:verify` should print `backend : mongodb` and your four projects, four skill groups and six
experience entries. If it prints `json-store`, the URI is wrong or the password was not
encoded — re-read step 6.

---

## 2. API — Render

1. Push your work to GitHub (`main` is simplest, otherwise deploy the branch).
2. <https://dashboard.render.com> → **New → Blueprint** → select this repository. Render reads
   [`render.yaml`](../render.yaml) and proposes a web service named **elyse-dev-api**.
3. When prompted, fill the values marked as secret in the blueprint:

   | Variable | Value |
   | --- | --- |
   | `MONGODB_URI` | The Atlas string from step 1 |
   | `CORS_ORIGIN` | Leave for now — come back after step 3 and set it to your Vercel URL |
   | `GITHUB_TOKEN` | Optional. A fine-grained token with **no extra scopes** raises the GitHub rate limit for the activity page |
   | `RESEND_API_KEY` / `CONTACT_NOTIFY_TO` | Optional. Without them contact messages are still stored — the form simply says no e-mail was sent |
   | `CONTACT_FINGERPRINT_SALT` | Render generates one automatically |

4. Deploy. The first build takes a few minutes.
5. **Verify** (replace with your service URL):

   ```bash
   curl https://elyse-dev-api.onrender.com/api/health
   ```

   You want:

   ```json
   { "data": { "status": "ok",
               "database": { "backend": "mongodb", "degraded": false },
               "integrations": { "emailNotifications": false, "githubToken": true } } }
   ```

   * `status: "degraded"` → MongoDB is not reachable; the API is falling back to a local store
     which **will be wiped on the next deploy**. Fix `MONGODB_URI` now.
   * `backend: "json-store"` with `degraded: false` → `MONGODB_URI` is not set at all.

**Free-plan note:** Render's free service sleeps after ~15 minutes of inactivity, so the first
request afterwards takes ~50 seconds. The client does not break when that happens: it renders
bundled content instead, and the footer status line says the API is offline.

---

## 3. Website — Vercel

1. <https://vercel.com/new> → import this repository.
2. **Configure the project:**

   | Setting | Value |
   | --- | --- |
   | Framework preset | Next.js (detected) |
   | Root Directory | `client` |
   | Build & Output Settings | leave as detected |
   | "Include files outside the root directory" | **enable** (needed for the `@elyse/database` workspace) |

   [`client/vercel.json`](../client/vercel.json) supplies the install/build commands and the
   security headers, so the install step is already handled.

3. **Environment variables** (Settings → Environment Variables — add for Production *and*
   Preview):

   | Name | Value | Notes |
   | --- | --- | --- |
   | `API_URL` | `https://elyse-dev-api.onrender.com` | **Server-only.** The browser never sees it. This is what makes live API content and the contact form work |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-site.vercel.app` | Enables canonical URLs, absolute Open Graph URLs and the sitemap |
   | `API_REQUEST_TIMEOUT_MS` | `2500` | Optional. How long the client waits before falling back to bundled content |

4. Deploy.
5. **Verify** your deployed site:

   ```bash
   curl -s https://your-site.vercel.app/ | grep -o "Elyse Dev" | head -1
   curl -s https://your-site.vercel.app/sitemap.xml | head -5     # needs NEXT_PUBLIC_SITE_URL
   curl -s https://your-site.vercel.app/opengraph-image -o /dev/null -w "%{http_code}\n"
   ```

   Then open `/contact` and send yourself a real message with your own e-mail address. You
   should get a reference ID and either "notification sent" (if Resend is configured) or an
   explicit note that e-mail notifications are off.

---

## 4. Close the loop

1. **CORS:** in Render, set `CORS_ORIGIN` to your Vercel URL (`https://your-site.vercel.app`)
   and let it redeploy. Requests are server-to-server so CORS is not strictly required, but
   setting it keeps the API locked to your own frontend if you ever call it from the browser.
2. **Custom domain (optional):** add it in Vercel, then update `NEXT_PUBLIC_SITE_URL` to the
   final domain so canonical URLs and the sitemap use it. Do not set it to a domain you have
   not pointed at the deployment.
3. **Redeploy the client** after changing `NEXT_PUBLIC_SITE_URL` — it is inlined at build time.

---

## 4b. Changing content after you deploy

Content lives in `client/src/content/` and is mirrored into `database/data/`:

```bash
# edit client/src/content/projects.ts (or profile / skills / experience / disciplines)
npm run db:sync          # mirror into database/data/*.json
npm run db:seed          # push into MongoDB (needs MONGODB_URI)
git commit -am "content: …" && git push
```

The site reads content **from the API**, and the API reads it from MongoDB — so after seeding,
give it up to **5 minutes** and it appears. That window is the deliberate `revalidate: 300`
cache on the client's content fetches, which keeps the API free of a request per page view.

To make a change appear immediately: redeploy the client (Vercel → Deployments → Redeploy), or
temporarily lower the window by setting `revalidate` in `client/src/lib/content.ts`.

> The order matters. Editing `client/src/content/` alone changes nothing on a deployed site
> that is serving from MongoDB — `db:sync` **and** `db:seed` are what push the change through.
> Locally, when the API is unreachable, the same edits appear instantly because the client falls
> back to the bundled content.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Site shows bundled content; footer says "API offline" | `API_URL` missing, wrong, or the API is asleep/booting | Check `API_URL` in Vercel; open `/api/health` directly; retry after ~50s on the free plan |
| `/api/health` says `degraded` | MongoDB unreachable | Password not percent-encoded, user not created, or IP allowlist blocking. Re-run `db:verify` locally |
| Contact form says the message service is unreachable | The Next route handler could not reach the API | Same as row 1 — this is the honest failure message, not a bug |
| GitHub page shows "Could not reach GitHub" while `curl api.github.com` works | Node in the container is not reading the system CA bundle | `NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt` (already set in `render.yaml` and the Dockerfile). Never disable TLS verification |
| GitHub page says the token was rejected | Bad or expired `GITHUB_TOKEN` | Replace it, or unset it to use the lower unauthenticated limit |
| Sitemap is empty | `NEXT_PUBLIC_SITE_URL` not set | Set it and redeploy — a sitemap needs absolute URLs, and inventing a domain would be worse than shipping none |
| Render build fails on `npm ci` | Lockfile and `package.json` out of sync | Run `npm install` locally, commit the updated `package-lock.json`, push |
| Build fails with "Cannot find module @elyse/database" | Vercel did not include files outside `client/` | Re-check the "Include files outside the root directory" setting |

---

## Alternatives

**Docker anywhere** (Railway, Fly.io, a VPS) — [`Dockerfile`](../Dockerfile) builds the API from
the repository root:

```bash
docker build -t elyse-dev-api .
docker run --rm -p 4000:4000 \
  -e MONGODB_URI="mongodb+srv://…" \
  -e CORS_ORIGIN="https://your-domain.com" \
  -e GITHUB_USERNAME=elyseprodev \
  elyse-dev-api
```

**Keep MongoDB local instead of Atlas** — only viable if your host offers a persistent disk
(Render's free plan does not). `docker-compose.yml` at the root runs MongoDB 7 for local
development; on a host with a disk you would point `MONGODB_URI` at that instance instead.

**Everything on one box** — build the client (`npm run build`) and run `npm start`, which
serves the API and the Next.js server together. Both bind `0.0.0.0`, so a reverse proxy
(Nginx/Caddy) in front with TLS is all that is left.

---

## What this repository already does for you

* `npm start` runs both processes; the API binds `0.0.0.0`.
* `/api/health` reports the real datastore and whether it is degraded.
* Missing configuration degrades gracefully instead of crashing: no `MONGODB_URI` → local
  store; no `RESEND_API_KEY` → messages stored, notification honestly reported as
  `not-configured`; no `GITHUB_TOKEN` → GitHub's lower rate limit, still functional.
* No secret is ever sent to the browser, and `.env` is git-ignored.
* CI ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) runs lint, type checks, tests,
  the production build and the contrast budget on every push.
