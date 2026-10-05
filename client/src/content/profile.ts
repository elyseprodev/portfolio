import type { Profile } from "@elyse/database/types";

/**
 * ELYSE DEV — profile content.
 *
 * ⚠️ EDITABLE: everything here is safe to change. Only facts that were supplied
 * are stated; nothing about employment, certificates or metrics is invented.
 * This file is mirrored into `database/data/profile.json` via `npm run db:sync`.
 */
export const profile: Profile = {
  id: "profile",
  name: "Elyse Dev",
  shortName: "Elyse",
  role: "Full-Stack Software Developer",
  location: "Rwanda",
  headline:
    "I build modern, useful web applications for the web — and I care about how they feel.",
  summary:
    "Full-stack developer from Rwanda working across JavaScript, React, Next.js, Node.js, Express and PHP. I enjoy turning real problems into clean interfaces backed by sensible data models, and I am currently deepening my security knowledge so the things I ship stay trustworthy.",
  bio: [
    "I am a full-stack software developer based in Rwanda. My work sits where a considered interface meets a well-structured backend: React and Next.js on the front, Node.js, Express and PHP behind it, and MongoDB or MySQL holding everything together.",
    "I started out building things for the web because I wanted my own ideas to actually work in a browser — a student platform, a messaging flow, a video experience. That habit stuck. Today I care as much about why a feature exists as how it is implemented, and I would rather ship something small and correct than something large and fragile.",
    "Right now I am going deeper into cybersecurity, API design and authentication. Practising those skills on real projects keeps my understanding honest, and it makes me a developer who thinks about failure cases before they happen.",
    "If you are working on something useful and want a developer who reads the documentation, asks real questions and finishes the job, I would like to hear about it.",
  ],
  focusAreas: [
    "Full-stack web development",
    "JavaScript and modern frontend engineering",
    "React and Next.js applications",
    "Node.js and Express APIs",
    "PHP and database-driven systems",
    "Cybersecurity fundamentals",
  ],
  interests: [
    "Building useful, modern web applications",
    "Clean API and database design",
    "Authentication and authorisation",
    "Learning cybersecurity",
    "Responsive, accessible interfaces",
    "Teaching myself something new every week",
  ],
  /**
   * Verified live: this account exists and its public repositories are the ones
   * the GitHub page reports. Change it here and every link, the API default and
   * the live activity panel follow.
   */
  github: "https://github.com/elyseprodev",
  // No public e-mail address has been supplied yet, so it is left undefined and
  // the UI says so honestly. Set it here to publish a mailto link everywhere
  // (footer, about and contact pages pick it up automatically).
  availability:
    "Open to collaborations, freelance work and junior-to-mid full-stack roles — remote or based in Rwanda.",
  highlights: [
    { label: "Stack focus", value: "React · Next.js · Node · PHP" },
    { label: "Data", value: "MongoDB · MySQL" },
    {
      label: "Based in",
      value: "Rwanda",
      note: "Open to remote collaboration",
    },
    {
      label: "Currently learning",
      value: "Cybersecurity",
      note: "Secure auth, APIs and data handling",
    },
  ],
};
