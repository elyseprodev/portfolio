/**
 * ELYSE DEV — datastore contract.
 *
 * Two adapters implement it:
 *   • `mongo-store`  → MongoDB through Mongoose (production target)
 *   • `json-store`   → zero-dependency JSON files (local development fallback)
 *
 * The rest of the platform only ever talks to this interface, so the API keeps
 * working identically with or without a MongoDB instance available.
 */
import type {
  Certificate,
  ContactMessage,
  ContactMessageInput,
  ContentBundle,
  Course,
  ExperienceEntry,
  Profile,
  Project,
  ServiceMeta,
  SkillGroup,
} from "../types.js";

export interface ContactMessageContext {
  requestFingerprint: string;
  userAgent?: string;
}

export interface ContentStore {
  /** Describes which backend answered and whether it is running degraded. */
  readonly meta: ServiceMeta;

  /** Opens connections, verifies indexes and seeds content when empty. */
  init(): Promise<void>;

  getProfile(): Promise<Profile>;
  listProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  listSkillGroups(): Promise<SkillGroup[]>;
  listExperience(): Promise<ExperienceEntry[]>;
  listCourses(): Promise<Course[]>;
  getCourse(slug: string): Promise<Course | null>;
  getContent(): Promise<ContentBundle>;

  /** Certificates are written once and read back by their verification code. */
  saveCertificate(certificate: Certificate): Promise<Certificate>;
  getCertificate(code: string): Promise<Certificate | null>;

  createContactMessage(
    input: ContactMessageInput,
    context: ContactMessageContext,
  ): Promise<ContactMessage>;
  listContactMessages(limit: number): Promise<ContactMessage[]>;
  countMessagesByFingerprint(
    requestFingerprint: string,
    sinceIso: string,
  ): Promise<number>;

  close(): Promise<void>;
}
