/**
 * ELYSE DEV — MongoDB store (Mongoose adapter).
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Connection } from "mongoose";
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
import { getModels } from "../models/index.js";
import type { ContactMessageContext, ContentStore } from "./repository.js";

const here = dirname(fileURLToPath(import.meta.url));
const SEED_DIR = join(here, "..", "..", "data");

async function seedFile<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(join(SEED_DIR, name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface MongoDocument {
  toObject(): Record<string, unknown>;
}

const CONTENT_OMIT = ["_id", "__v", "createdAt", "updatedAt"];
const MESSAGE_OMIT = ["_id", "__v", "updatedAt"];

function toPlain<T extends object>(
  doc: MongoDocument,
  omit: string[] = CONTENT_OMIT,
): T {
  const raw = doc.toObject() as Record<string, unknown>;
  for (const key of omit) delete raw[key];
  return raw as T;
}

export class MongoContentStore implements ContentStore {
  readonly meta: ServiceMeta = {
    backend: "mongodb",
    degraded: false,
    details: "MongoDB via Mongoose.",
  };

  constructor(private readonly connection: Connection) {}

  async init(): Promise<void> {
    const { ProjectModel, SkillGroupModel, ExperienceModel, ProfileModel } =
      getModels();

    await Promise.all([
      ProjectModel.syncIndexes(),
      SkillGroupModel.syncIndexes(),
      ExperienceModel.syncIndexes(),
      ProfileModel.syncIndexes(),
    ]);

    await this.seedIfEmpty();
  }

  /** Seeds content collections on first run so the site is never empty. */
  private async seedIfEmpty(): Promise<void> {
    const { ProjectModel, SkillGroupModel, ExperienceModel, ProfileModel } =
      getModels();

    const [projects, skills, experience, profile] = await Promise.all([
      seedFile<Project[]>("projects.json", []),
      seedFile<SkillGroup[]>("skills.json", []),
      seedFile<ExperienceEntry[]>("experience.json", []),
      seedFile<Profile | null>("profile.json", null),
    ]);

    if ((await ProjectModel.estimatedDocumentCount()) === 0 && projects.length) {
      await ProjectModel.insertMany(projects);
    }
    if ((await SkillGroupModel.estimatedDocumentCount()) === 0 && skills.length) {
      await SkillGroupModel.insertMany(skills);
    }
    if (
      (await ExperienceModel.estimatedDocumentCount()) === 0 &&
      experience.length
    ) {
      await ExperienceModel.insertMany(experience);
    }
    if ((await ProfileModel.estimatedDocumentCount()) === 0 && profile) {
      await ProfileModel.create(profile);
    }
  }

  async getProfile(): Promise<Profile> {
    const { ProfileModel } = getModels();
    const doc = await ProfileModel.findOne({ id: "profile" }).lean().exec();
    if (!doc) {
      throw new Error(
        "Profile document not found — run `npm run db:seed` to seed MongoDB.",
      );
    }
    const { _id: _ignored, ...profile } = doc as Profile & { _id: unknown };
    return profile as Profile;
  }

  async listProjects(): Promise<Project[]> {
    const { ProjectModel } = getModels();
    const docs = await ProjectModel.find().sort({ featured: -1, year: -1 }).exec();
    return docs.map((doc) => toPlain<Project>(doc));
  }

  async getProject(slug: string): Promise<Project | null> {
    const { ProjectModel } = getModels();
    const doc = await ProjectModel.findOne({ slug }).exec();
    return doc ? toPlain<Project>(doc) : null;
  }

  async listSkillGroups(): Promise<SkillGroup[]> {
    const { SkillGroupModel } = getModels();
    const docs = await SkillGroupModel.find().sort({ createdAt: 1 }).exec();
    return docs.map((doc) => toPlain<SkillGroup>(doc));
  }

  async listExperience(): Promise<ExperienceEntry[]> {
    const { ExperienceModel } = getModels();
    const docs = await ExperienceModel.find().sort({ createdAt: 1 }).exec();
    return docs.map((doc) => toPlain<ExperienceEntry>(doc));
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
    const { ContactMessageModel } = getModels();
    const fingerprint = createHash("sha256")
      .update(context.requestFingerprint)
      .digest("hex")
      .slice(0, 32);

    const doc = await ContactMessageModel.create({
      name: input.name,
      email: input.email,
      subject: input.subject,
      topic: input.topic,
      message: input.message,
      status: "received",
      createdAt: new Date().toISOString(),
      requestFingerprint: fingerprint,
      userAgent: context.userAgent,
    });

    const plain = toPlain<Omit<ContactMessage, "id">>(doc, MESSAGE_OMIT);
    return { ...plain, id: String(doc._id) };
  }

  async listContactMessages(limit: number): Promise<ContactMessage[]> {
    const { ContactMessageModel } = getModels();
    const docs = await ContactMessageModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    return docs.map((doc) => ({
      ...toPlain<Omit<ContactMessage, "id">>(doc, MESSAGE_OMIT),
      id: String(doc._id),
    }));
  }

  async countMessagesByFingerprint(
    requestFingerprint: string,
    sinceIso: string,
  ): Promise<number> {
    const { ContactMessageModel } = getModels();
    const fingerprint = createHash("sha256")
      .update(requestFingerprint)
      .digest("hex")
      .slice(0, 32);
    return ContactMessageModel.countDocuments({
      requestFingerprint: fingerprint,
      createdAt: { $gte: sinceIso },
    }).exec();
  }

  async close(): Promise<void> {
    await this.connection.close();
  }
}
