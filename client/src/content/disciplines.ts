/**
 * ELYSE DEV — depth by discipline.
 *
 * ⚠️ EDITABLE. These are the three working layers, written from what this
 * repository and the listed projects actually contain — not from assumed job
 * history. There are no dates, employers or metrics here because none have been
 * supplied; add them only when they are true.
 *
 * Presentation content (like the "How I work" cards on the About page), so it
 * lives with the client rather than in the database layer.
 */

export interface Discipline {
  id: string;
  emoji: string;
  title: string;
  summary: string;
  /** Concrete practices — each one is visible in the linked work. */
  points: string[];
  /** Where this layer can be inspected. */
  evidence: {
    label: string;
    href: string;
    note: string;
  };
  /** Skill group on /skills that covers the same ground. */
  skillGroupId: string;
}

export const disciplines: Discipline[] = [
  {
    id: "backend",
    emoji: "⚙️",
    title: "Backend",
    summary:
      "Interfaces are the easy part to demo, so I make the server side do real work: validate everything, answer predictably, and fail honestly.",
    points: [
      "Express routes with Zod validation on every input — query strings, params and request bodies",
      "One response envelope for the whole API (data + meta) so the frontend never guesses",
      "Correct status codes: 404 for missing resources, 422 with per-field messages, 429 for rate limits",
      "Abuse handling that works without storing personal data — a salted fingerprint and a sliding window",
      "Optional integrations kept optional: e-mail notification and the GitHub proxy both degrade instead of breaking the page",
      "PHP for server-rendered applications and database-driven work",
    ],
    evidence: {
      label: "The API behind this site",
      href: "/projects/elyse-dev-portfolio",
      note: "Every route above is running here — /api/content, /api/contact, /api/github, /api/health.",
    },
    skillGroupId: "backend",
  },
  {
    id: "database",
    emoji: "🗄️",
    title: "Database",
    summary:
      "Data outlives the interface that created it, so I model it deliberately and choose the store per project instead of by habit.",
    points: [
      "MongoDB document modelling with Mongoose: schemas, types, indexes and query shapes",
      "MySQL relational schema and SQL for work that is naturally tabular",
      "A repository interface so the API behaves identically against different stores",
      "Honest failure reporting — a configured-but-unreachable database is reported as degraded, never hidden",
      "Seeding and verification scripts so a fresh environment can be brought up reproducibly",
      "Indexes and validation chosen for the queries the app actually runs",
    ],
    evidence: {
      label: "The database layer in this project",
      href: "/projects/elyse-dev-portfolio",
      note: "Schemas, models and two store adapters (MongoDB and a local fallback) with a verification script.",
    },
    skillGroupId: "databases",
  },
  {
    id: "tools",
    emoji: "🧰",
    title: "Tools & Platforms",
    summary:
      "The habits and tooling that decide whether a project stays maintainable after the first week.",
    points: [
      "Git and GitHub: small commits with a reason, feature branches, and pull requests instead of pushing straight to main",
      "TypeScript in strict mode across the whole repository, including the shared types between layers",
      "ESLint with Next.js, React hooks and accessibility rules wired into the production build",
      "Testing with Node's built-in test runner — 47 automated tests, no extra test framework",
      "npm workspaces to keep client, server and database as separate packages in one repository",
      "Environment configuration through .env with secrets never committed and never logged",
      "Deployment: Next.js on a Node host, the API as a managed web service, MongoDB Atlas for data",
    ],
    evidence: {
      label: "This repository's setup",
      href: "/github",
      note: "Live repository list, plus the tests, linting and workspace layout actually in use.",
    },
    skillGroupId: "practice",
  },
];
