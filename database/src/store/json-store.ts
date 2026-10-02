/**
 * ELYSE DEV — local JSON store.
 *
 * A dependency-free implementation of `ContentStore` used when no MongoDB URI
 * is configured (or when MongoDB cannot be reached). Seed documents are read
 * from `database/data/*.json`; contact messages are appended to
 * `database/.data/contact-messages.json`, which is git-ignored.
 *
 * This keeps local development and the hosted preview fully functional while
 * remaining explicit about the fact that it is *not* a production database.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ContactMessage,
  ContactMessageInput,
  ContentBundle,
  ExperienceEntry,
  Profile,
  Project,
  ServiceMeta,
  SkillGroup,
} from "../types.js";
import type { ContactMessageContext, ContentStore } from "./repository.js";

const here = dirname(fileURLToPath(import.meta.url));
/** <repo>/database */
const DATABASE_ROOT = join(here, "..", "..");
const SEED_DIR = join(DATABASE_ROOT, "data");
const DATA_DIR = join(DATABASE_ROOT, ".data");
const MESSAGES_FILE = join(DATA_DIR, "contact-messages.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export class JsonContentStore implements ContentStore {
  readonly meta: ServiceMeta = {
    backend: "json-store",
    degraded: false,
    details:
      "Local JSON store — set MONGODB_URI to persist content in MongoDB.",
  };

  private messages: ContactMessage[] | null = null;

  async init(): Promise<void> {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
  }

  private async loadMessages(): Promise<ContactMessage[]> {
    if (!this.messages) {
      this.messages = await readJson<ContactMessage[]>(MESSAGES_FILE, []);
    }
    return this.messages;
  }

  async getProfile(): Promise<Profile> {
    const profile = await readJson<Profile | null>(
      join(SEED_DIR, "profile.json"),
      null,
    );
    if (!profile) {
      throw new Error(
        "database/data/profile.json is missing — run `npm run db:sync` to generate it from client/src/content.",
      );
    }
    return profile;
  }

  async listProjects(): Promise<Project[]> {
    return readJson<Project[]>(join(SEED_DIR, "projects.json"), []);
  }

  async getProject(slug: string): Promise<Project | null> {
    const projects = await this.listProjects();
    return projects.find((project) => project.slug === slug) ?? null;
  }

  async listSkillGroups(): Promise<SkillGroup[]> {
    return readJson<SkillGroup[]>(join(SEED_DIR, "skills.json"), []);
  }

  async listExperience(): Promise<ExperienceEntry[]> {
    return readJson<ExperienceEntry[]>(join(SEED_DIR, "experience.json"), []);
  }

  async getContent(): Promise<ContentBundle> {
    const [profile, projects, skillGroups, experience] = await Promise.all([
      this.getProfile(),
      this.listProjects(),
      this.listSkillGroups(),
      this.listExperience(),
    ]);
    return { profile, projects, skillGroups, experience };
  }

  async createContactMessage(
    input: ContactMessageInput,
    context: ContactMessageContext,
  ): Promise<ContactMessage> {
    const store = await this.loadMessages();
    const message: ContactMessage = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      subject: input.subject,
      topic: input.topic,
      message: input.message,
      status: "received",
      createdAt: new Date().toISOString(),
      requestFingerprint: createHash("sha256")
        .update(context.requestFingerprint)
        .digest("hex")
        .slice(0, 32),
      userAgent: context.userAgent,
    };
    store.push(message);
    await writeFile(MESSAGES_FILE, JSON.stringify(store, null, 2), "utf8");
    return message;
  }

  async listContactMessages(limit: number): Promise<ContactMessage[]> {
    const store = await this.loadMessages();
    return [...store].reverse().slice(0, limit);
  }

  async countMessagesByFingerprint(
    requestFingerprint: string,
    sinceIso: string,
  ): Promise<number> {
    const store = await this.loadMessages();
    const fingerprint = createHash("sha256")
      .update(requestFingerprint)
      .digest("hex")
      .slice(0, 32);
    return store.filter(
      (message) =>
        message.requestFingerprint === fingerprint &&
        message.createdAt >= sinceIso,
    ).length;
  }

  async close(): Promise<void> {
    this.messages = null;
  }
}
