import type { ExperienceEntry } from "@elyse/database/types";

/**
 * ELYSE DEV — experience & learning journey.
 *
 * ⚠️ EDITABLE: entries flagged `isPlaceholder: true` are intentionally empty
 * slots for information only you can supply (school, dates, employers,
 * certificates). The Experience page lists them in a "needs your input" panel
 * and they never pretend to be verified facts.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "full-stack-project-work",
    kind: "project",
    title: "Full-stack project work",
    organisation: "Personal & collaborative projects",
    period: "Ongoing",
    location: "Rwanda",
    summary:
      "Building and iterating on complete web applications — an education platform, a student messaging app and a video web app — from interface design through to API and database work.",
    highlights: [
      "Designed typed content models that a Next.js client and an Express API can both rely on",
      "Implemented authentication flows and protected routes",
      "Modelled data in MongoDB and MySQL and wrote the queries behind each screen",
      "Reviewed and refactored my own code between iterations instead of rewriting from scratch",
    ],
    isPlaceholder: false,
  },
  {
    id: "self-directed-learning",
    kind: "learning",
    title: "Self-directed full-stack development",
    organisation: "Independent study",
    period: "Ongoing",
    location: "Remote",
    summary:
      "A deliberate learning track through the modern JavaScript stack: from HTML, CSS and core JavaScript into React, Next.js, Node.js, Express and PHP, with databases alongside each step.",
    highlights: [
      "Learned by shipping: every topic was applied to a project rather than only read about",
      "Practised Git and GitHub workflows — branches, commits, pull requests",
      "Studied API design, error handling and loading states as first-class concerns",
      "Kept a habit of documenting what I build so it can be explained, not just demoed",
    ],
    isPlaceholder: false,
  },
  {
    id: "cybersecurity-track",
    kind: "learning",
    title: "Cybersecurity learning track",
    organisation: "Independent study",
    period: "Current focus",
    location: "Remote",
    summary:
      "Deepening my security knowledge so the applications I build start from secure defaults: authentication, authorisation, input validation and the OWASP fundamentals behind them.",
    highlights: [
      "Studying authentication and authorisation patterns and applying them in real projects",
      "Practising secure input handling and validation on my own APIs",
      "Learning how common web vulnerabilities are introduced — and prevented",
    ],
    isPlaceholder: false,
  },
  {
    id: "formal-education",
    kind: "education",
    title: "Formal education — add your programme",
    organisation: "Add your school, college or university",
    period: "Add start and end year",
    location: "Rwanda",
    summary:
      "This slot is reserved for your verified academic background. Add the programme, institution and dates you want publicly visible — or delete this entry entirely.",
    highlights: [
      "Add the qualification you received",
      "Add relevant coursework or a final project",
    ],
    isPlaceholder: true,
  },
  {
    id: "professional-experience",
    kind: "work",
    title: "Professional experience — add your roles",
    organisation: "Add employer or client",
    period: "Add dates",
    location: "Add location",
    summary:
      "Reserved for employment, internships or client work. Include what you were responsible for and what changed because of your work.",
    highlights: [
      "Add the responsibilities you held",
      "Add the outcomes you can verify",
    ],
    isPlaceholder: true,
  },
  {
    id: "courses-certificates",
    kind: "learning",
    title: "Courses & certificates — add the ones you hold",
    organisation: "Add the issuing platform",
    period: "Add completion date",
    summary:
      "Reserved for courses and certifications. This site will not display a certificate that cannot be verified, so only add what you can point to.",
    highlights: [
      "Add the certificate title and issuer",
      "Add a verification link if one exists",
    ],
    isPlaceholder: true,
  },
];

export const experienceKindLabels: Record<ExperienceEntry["kind"], string> = {
  education: "Education",
  project: "Project",
  learning: "Learning",
  work: "Work",
};

/** Entries still waiting on real information from Elyse. */
export const placeholderExperience = experience.filter(
  (entry) => entry.isPlaceholder,
);

/** Entries backed by information already supplied. */
export const confirmedExperience = experience.filter(
  (entry) => !entry.isPlaceholder,
);
