/**
 * ELYSE DEV — shared domain types.
 *
 * This module is dependency-free on purpose: the Next.js client imports these
 * types with `import type { … } from "@elyse/database/types"`, which is fully
 * erased at compile time (no Mongoose, no Node APIs ever reach the browser).
 */

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export interface ProfileHighlight {
  label: string;
  value: string;
  /** Optional clarification shown as small print under the value. */
  note?: string;
}

export interface Profile {
  /** Stable identifier for the singleton profile document. */
  id: "profile";
  name: string;
  shortName: string;
  role: string;
  location: string;
  headline: string;
  summary: string;
  bio: string[];
  focusAreas: string[];
  interests: string[];
  /** Public links that are actually known. Never invent these. */
  github: string;
  /** Set to an e-mail address only if you want it published on the site. */
  email?: string;
  availability: string;
  highlights: ProfileHighlight[];
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export type ProjectCategory =
  | "full-stack"
  | "frontend"
  | "backend"
  | "learning";

export type ProjectStatus = "completed" | "in-progress" | "concept";

export interface ProjectLink {
  kind: "live" | "source" | "docs" | "other";
  label: string;
  href: string;
}

export interface ProjectShot {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectChallenge {
  challenge: string;
  solution: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: string;
  featured: boolean;
  /**
   * `true` marks a project whose detail copy still needs to be supplied by
   * Elyse. Draft projects are rendered with a visible "details pending" label
   * so they are never mistaken for finished case studies.
   */
  isDraft: boolean;
  overview: string[];
  problem: string;
  goals: string[];
  features: string[];
  stack: string[];
  links: ProjectLink[];
  gallery: ProjectShot[];
  challenges: ProjectChallenge[];
}

/* -------------------------------------------------------------------------- */
/* Skills                                                                     */
/* -------------------------------------------------------------------------- */

export interface Skill {
  name: string;
  /** Key resolved to a local SVG icon by the client. */
  icon: string;
  note?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  /**
   * Optional pictograph shown before the title. Kept separate from `title` so
   * the UI can mark it `aria-hidden` — screen readers would otherwise announce
   * "gear" before the word "Backend".
   */
  emoji?: string;
  description: string;
  /** Short label used by the compact homepage preview. */
  shortLabel: string;
  skills: Skill[];
}

/* -------------------------------------------------------------------------- */
/* Experience & learning journey                                              */
/* -------------------------------------------------------------------------- */

export type ExperienceKind = "education" | "project" | "learning" | "work";

export interface ExperienceEntry {
  id: string;
  kind: ExperienceKind;
  title: string;
  organisation?: string;
  period?: string;
  location?: string;
  summary: string;
  highlights: string[];
  /** `true` when the entry needs real dates/qualifications from Elyse. */
  isPlaceholder: boolean;
}

/* -------------------------------------------------------------------------- */
/* Contact messages                                                           */
/* -------------------------------------------------------------------------- */

export type ContactTopic =
  | "collaboration"
  | "freelance"
  | "opportunity"
  | "question"
  | "other";

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  topic: ContactTopic;
  message: string;
  /** Honeypot field — must stay empty; filled only by bots. */
  company?: string;
}

export interface ContactMessage extends Omit<ContactMessageInput, "company"> {
  id: string;
  createdAt: string;
  status: "received";
  /** Non-reversible hash, used for basic abuse tracking — never a raw IP. */
  requestFingerprint: string;
  userAgent?: string;
}

/* -------------------------------------------------------------------------- */
/* Content bundle & service metadata                                          */
/* -------------------------------------------------------------------------- */

export interface ContentBundle {
  profile: Profile;
  projects: Project[];
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
}

export interface ServiceMeta {
  /** Which persistence backend answered the request. */
  backend: "mongodb" | "json-store";
  /** `true` when the configured MongoDB URI was unreachable. */
  degraded: boolean;
  details: string;
}
