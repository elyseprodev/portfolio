# ELYSE DEV — API reference

Base URL: `http://127.0.0.1:4000` in development (`API_URL` on the client points here).
Every response is a JSON envelope — there are no bare arrays or bare objects.

```jsonc
// success
{ "data": <payload>, "meta": { /* context: which database answered, counts, … */ } }

// failure
{ "error": { "code": "validation_failed", "message": "…", "details": [ … ] } }
```

`meta.backend` is included on content routes and reports the **real** datastore:

```json
{ "backend": "json-store", "degraded": false, "details": "Local JSON store — set MONGODB_URI to persist content in MongoDB." }
```

---

## `GET /`

Service index — name, owner and the route list.

## `GET /api/health`

Liveness plus the datastore and integration state. This is the endpoint that makes the
deployment honest: if `MONGODB_URI` was configured but unreachable, `status` is `"degraded"`
and `details` explains why.

```json
{
  "data": {
    "status": "ok",
    "uptimeSeconds": 131,
    "environment": "development",
    "timestamp": "2026-10-02T18:48:24.959Z",
    "database": {
      "backend": "json-store",
      "degraded": false,
      "details": "Local JSON store — set MONGODB_URI to persist content in MongoDB."
    },
    "integrations": { "emailNotifications": false, "githubToken": true }
  },
  "meta": {}
}
```

## `GET /api/content`

Everything the client needs in one request — profile, projects, skill groups and experience.

## `GET /api/profile`

The singleton profile document (name, role, location, bio, focus areas, highlights, links).

## `GET /api/projects`

| Query       | Type                                              | Notes                                    |
| ----------- | ------------------------------------------------- | ---------------------------------------- |
| `category`  | `full-stack` \| `frontend` \| `backend` \| `learning` | Exact match                          |
| `featured`  | `true` \| `false`                                 | Featured projects only                   |
| `q`         | string (≤ 120)                                    | Searches title, tagline, summary and stack |
| `limit`     | 1–50                                              | Truncates after filtering                |

`meta` carries `count` (returned) and `total` (before filtering).

```bash
curl "http://localhost:4000/api/projects?category=frontend&limit=3"
```

```json
{
  "data": [{ "slug": "video-web-app", "title": "Video Web Application", "isDraft": true }],
  "meta": { "backend": { "backend": "json-store", "degraded": false, "details": "…" }, "count": 1, "total": 4 }
}
```

An unsupported `category` is rejected with `422 validation_failed` rather than silently
returning everything.

## `GET /api/projects/:slug`

One project, including `overview`, `problem`, `goals`, `features`, `stack`, `links`, `gallery`
and `challenges`. Unknown slugs return `404` with `error.code = "project_not_found"`.

`isDraft: true` marks a project whose case study is still being written — the UI labels those
visibly and never renders a link that does not exist.

## `GET /api/skills`

Skill groups (frontend, backend, databases, practice). Levels are never scored numerically.

## `GET /api/experience`

Timeline entries. `isPlaceholder: true` means the entry is an empty slot awaiting real
information and is rendered in the "Editable placeholders" panel.

## `GET /api/github`

Server-side proxy for the public GitHub REST API, so the browser never needs a token.

| Field            | Meaning                                                        |
| ---------------- | -------------------------------------------------------------- |
| `available`      | `false` when GitHub could not be reached or rate-limited        |
| `reason`         | Human-readable explanation shown to the visitor                 |
| `profile`        | Login, name, bio, avatar, public repo/follower counts           |
| `repos`          | Non-fork, non-archived repositories, most relevant first        |
| `languages`      | `{ name, repos }` counted from primary repo languages           |
| `rateLimit`      | `limit`, `remaining`, `resetAt`                                 |
| `fetchedAt`      | When the payload was produced                                   |
| `cached`         | `true` when served from the 5-minute in-memory cache             |

Use `?refresh=1` to bypass the cache. Responses are cached for `GITHUB_CACHE_TTL_MS`
(default 5 minutes) so ordinary browsing does not consume the quota.

## `POST /api/contact`

```json
{
  "name": "Jean Bosco",
  "email": "jean@example.com",
  "subject": "Collaboration on a student platform",
  "topic": "collaboration",
  "message": "Hello Elyse, I am building … (≥ 20 characters)",
  "company": ""
}
```

* `topic` ∈ `collaboration` · `freelance` · `opportunity` · `question` · `other`
* `company` is a **honeypot** — leave it empty. A filled honeypot returns `202` and stores
  nothing, so bots cannot tell they were discarded.

**201 Created**

```json
{
  "data": {
    "status": "received",
    "id": "6bf959d4-6600-466c-a06c-7abcad39b2f1",
    "receivedAt": "2026-10-02T18:48:43.913Z",
    "notification": "not-configured"
  },
  "meta": {
    "notificationDetail": "Stored successfully. E-mail notifications are off — set RESEND_API_KEY and CONTACT_NOTIFY_TO on the server to receive them."
  }
}
```

`notification` is one of `sent`, `not-configured` or `failed` — the API never claims an e-mail
was delivered when it was not, and the client displays this verbatim.

**422 Unprocessable Entity** — one message per invalid field:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Some fields need your attention.",
    "details": [
      { "field": "name", "message": "Please enter at least 2 characters." },
      { "field": "email", "message": "That does not look like a valid email address." },
      { "field": "subject", "message": "Please add a short subject." },
      { "field": "message", "message": "Please write at least 20 characters so I can help properly." }
    ]
  }
}
```

**429 Too Many Requests** — `error.code = "rate_limited"` after `CONTACT_MAX_PER_WINDOW`
(default 5) submissions within `CONTACT_WINDOW_MS` (default 1 hour) from the same
salted fingerprint.

## `GET /api/contact`

Counts only — `{ "data": { "accepted": true }, "meta": { "messagesExposed": false } }`.
Stored messages are deliberately **not** readable through the public API.

## Errors

| Status | `error.code`        | When                                             |
| ------ | ------------------- | ------------------------------------------------ |
| 404    | `not_found`         | Unknown API route (`project_not_found` for slugs) |
| 422    | `validation_failed` | Zod rejected the request body or query            |
| 429    | `rate_limited`      | Contact submissions over the limit                |
| 500    | `internal_error`    | Unexpected failure (details only outside production) |

## CORS

Only origins listed in `CORS_ORIGIN` are allowed; in development, `localhost` and
`127.0.0.1` are accepted automatically. The Next.js client calls the API server-side, so the
browser never needs CORS at all.

## Security notes

* No secret is ever returned by the API — `GITHUB_TOKEN` is used server-side only, and
  `meta.tokenConfigured` reports a boolean, never the value.
* Contact messages store a **salted SHA-256 fingerprint** for throttling; raw IP addresses are
  never persisted.
* Request bodies are limited to 64 kB.
* `x-powered-by` is disabled and JSON bodies are parsed with a size limit; unknown routes
  return a JSON envelope instead of an HTML stack trace.
