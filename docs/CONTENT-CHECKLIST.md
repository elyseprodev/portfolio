# Content checklist — what still needs your input

Everything on the site is either **verified** or **explicitly marked as pending**. This file
lists the pending items, where they live, and how to fill them in. Nothing here is invented
on your behalf, so a few sections are intentionally empty until you supply them.

---

## 1. ✅ GitHub account + public name — resolved

You confirmed the account is **`https://github.com/elyseprodev`** and that the public name is
**Elyse Dev**. Both are now applied everywhere:

| Where | Value |
| --- | --- |
| `client/src/content/profile.ts` → `name`, `github` | `Elyse Dev` · `https://github.com/elyseprodev` |
| `client/src/content/site.ts` → `developerName`, `github` | same |
| `server/src/config/env.ts` → `GITHUB_USERNAME` default | `elyseprodev` |
| Hero headline, About, OG image, footer, contact page, developer mark, metadata | `Elyse Dev` / `elyseprodev` |

Verified live during development: 11 public repositories, 10 non-fork, and the GitHub page
renders them along with the aggregated language breakdown.

> The full legal name `MURENGERANTWARI Elyse` is no longer displayed anywhere. If you want it
> shown again (for example on an About page aimed at recruiters), set `profile.name` and
> `site.developerName` — one place each.

### What that changed about your projects — needs your answer

Now that the repositories are visible, here is what the account actually contains, next to the
projects on the site:

| Repository | Language | Matches a project on the site? |
| --- | --- | --- |
| `portfolio` | — | ✅ **Elyse Dev Portfolio** (already linked) |
| `app-video` | TypeScript | ❓ Possibly **Video Web Application** |
| `video_search` | CSS | ❓ Possibly **Video Web Application** |
| `elyseprodev` | — | Profile repository |
| `game` | Vue | ➕ Not on the site — worth adding? |
| `new-game` | JavaScript | ➕ Not on the site — worth adding? |
| `project` | CSS | ➕ Not on the site — worth adding? |
| `the-javascript-question` | — | ➕ Not on the site — worth adding? |
| `side-bar` | — | ➕ Not on the site — worth adding? |
| `first-c` | — | ➕ Not on the site — worth adding? |

**Tell me which repository belongs to which project** and I will wire up the links, add real
repository entries for the projects above, and (if you want) add the game and video-search work
as their own projects. Until then no repository is guessed at: the site only links what is
already verified, and the GitHub page lists the repositories directly so nothing is hidden.

**One consistency note:** the account's primary languages are CSS, JavaScript, TypeScript and
**Vue**. Vue is not listed in `client/src/content/skills.ts` — if you work in Vue, say so and I
will add it to the Frontend group (the skills page deliberately only claims what you confirm).

---

## 1b. New sections added at your request — please review

**Skills page** now uses pictograph group headings: 🎨 Frontend, ⚙️ Backend, 🗄️ Database,
🧰 Tools & Platforms (one group was renamed from "Databases", another from "Development &
Practice"). Change them in `client/src/content/skills.ts` — the emoji is a separate `emoji`
field so it stays out of the accessibility tree.

**Experience page** gained a "Depth by discipline" section with three cards — ⚙️ Backend,
🗄️ Database, 🧰 Tools & Platforms. Their wording is written **only from what this repository and
your listed projects actually contain** (validated API routes, the two store adapters, the
test count, the commit/PR workflow). There are deliberately no dates, employers or metrics.

> If any bullet overstates or understates what you have done, edit
> `client/src/content/disciplines.ts` — it is presentation content, kept beside the About page's
> "How I work" cards rather than in the database layer. Tell me the wording you prefer and I
> will change it for you.

---

## 1c. The two projects you sent — one added, one blocked

**✅ `bookoffamily.lovable.app` — added as a real, live project.**
"Book of Family Library" now appears in the project list, in the homepage's featured row and at
`/projects/book-of-family-library`. Its copy is written from the published site itself: the six
collections, the counters, the featured-books strip that loads at runtime and hands readers to
Open Library, and the language/accessibility affordances. Nothing about it is invented.

Two fields I had to infer — please confirm or correct them:

- `stack: ["React", "Vite", "Tailwind CSS", "Open Library API"]` — read from the published
  build (hashed `/assets/…` files) and the visible Open Library hand-off.
- `status: "completed"` and `year: "2026"` — the site is live, which is all I could verify.

It is also `featured: true`, so it took one of the three homepage slots. Set it to `false` in
`client/src/content/projects.ts` to swap the featured row back.

**⚠️ `menvax.netlify.app` — not a live site, so not added yet.**
The address returns Netlify's own "Site not found" page (Netlify internal ID
`01M3Z32DZZDB99EFN7BNPZQE22`), and `menvax.netify.app` as written has no DNS record at all.
Nothing on the web matches the name either. Because nothing about the project could be
verified, no card was invented for it. Send the working URL — or a one-line description, its
stack and any screenshots — and it goes in exactly like Book of Family Library.

---

## 1d. The Academy — what I built, and the four decisions that are yours

You asked for courses in every programming language, a programme to help developers improve, a
certificate for students who finish, more images, better performance and SEO, and a much-loved
font. All of it is built and verified. Four things need your judgement rather than mine:

**1. Course statuses.** 33 courses ship, but only **6 are marked `available`**: HTML & CSS,
JavaScript, TypeScript, PHP, SQL and Bash. Everything else is `in-development` or `planned`
(the Chinese, Ruby, Go, Rust, Java, C#, Python and most others are `in-development`; the long tail
is `planned`). I marked a course available only where I could publish a curriculum I would defend.
Flip the word in `client/src/content/courses.ts` and the badges, the certificate type and the
sitemap all follow.

> **This matters for honesty:** a certificate issued for a course that is not marked available is
> issued as a clearly-labelled **SAMPLE**. Nothing on the site claims a student completed a course
> that does not exist yet.

**2. Languages.** 33 courses: HTML & CSS, JavaScript, TypeScript, PHP, Python, Java, C#, Go, Ruby,
Elixir, Scala, Solidity, C, C++, Rust, Zig, Assembly, SQL, R, Julia, Fortran, Swift, Kotlin, Dart,
Bash, PowerShell, Lua, Perl, Haskell, F#, Clojure, Erlang, Prolog. Missing anything you want —
COBOL, MATLAB, Groovy, COBOL, Objective-C, Visual Basic, Ada, OCaml, Scheme, Crystal, Nim, V? Say
the word and each one is a single object in `courses.ts`.

**3. Ratings, student numbers and reviews.** Deliberately absent everywhere. If you have real
figures (completion numbers, testimonials with permission), send them and they go in — but I will
not invent them, and the test suite fails the build if a course claims an unverifiable statistic.

**4. The certificate's legal footing.** The certificate carries your name and a verification code,
and the record is public at `/certificate/<CODE>`. If you want it to state an institution, a
signature, a seal or a specific wording ("This certificate confirms…"), tell me the exact text.

**Also worth knowing:** certificates live in the same store as everything else. With a MongoDB URI
they persist properly; without one they are written to `database/.data/certificates.json` — durable
locally, explicitly not a production database. Run `npm run db:seed` after deployment so the course
catalogue is in MongoDB too.

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

## 5b. Every image on the site, and what each one actually is

"Add images everywhere" is done — but honesty still matters, so here is the full inventory. **Every
image below is generated artwork, not a screenshot of a real product**, and each one is captioned
or has alt text saying so. Drop a real file over the same path and the site picks it up with no
code change.

| Where | File | What it shows |
| --- | --- | --- |
| Home hero | `public/images/hero-visual.jpg` | Glass panels with orange light |
| Home about preview | `public/images/about-workspace.jpg` | Dark desk at night |
| About page (band) | `public/images/about-workspace.jpg` | Same photograph, full width |
| About page (aside) | `public/images/elyse-dev-mark.svg` | Your monogram, standing in for a portrait |
| Project cards + details | `public/images/projects/<slug>-cover.jpg` | One cover per project |
| Project details | `public/images/projects/<slug>.svg` | Line artwork beside each cover |
| Academy course cards and pages | `public/images/courses/<slug>.svg` | One generated cover per language (33) |
| Academy track banners | `public/images/courses/tracks/<track>.svg` | One per track (7) |
| Social sharing | generated at `/opengraph-image` | Text card — not a file you replace |
| Browser icon | `client/src/app/icon.svg` | Monogram mark |

**The images I could not get for you:** the two live apps you sent. `bookoffamily.lovable.app`
serves its own hero photograph and `menvax.netlify.app` is not online, and this build environment
cannot reach either host, so no real screenshot could be downloaded. When you want real captures
in place of the generated covers, save them into `public/images/projects/` using the file names in
the table above.

**One more thing only you can supply:** a portrait photograph. The About page currently shows your
monogram with alt text that says it is standing in until a portrait is supplied. Add the file and
send me the path.

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

## 6b. Deployment is prepared, not performed

`docs/DEPLOYMENT.md` walks through MongoDB Atlas → Render → Vercel with a verification command
after each step. Nothing is deployed yet because that requires your accounts: no hosting
account, no Atlas cluster and no domain exist for this project, and the site never invents one
(an unset `NEXT_PUBLIC_SITE_URL` keeps canonical URLs and the sitemap empty on purpose).

What still needs you:

1. Create the Atlas cluster and run `npm run db:seed` against it (section 1 of the guide).
2. Create the Render Blueprint from `render.yaml` and paste in the secrets.
3. Import the repo into Vercel with Root Directory `client` and set `API_URL` +
   `NEXT_PUBLIC_SITE_URL`.
4. Send yourself one message through the deployed `/contact` form to confirm storage.

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
