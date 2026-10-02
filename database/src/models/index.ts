/**
 * ELYSE DEV — Mongoose model registry.
 *
 * Models are registered lazily through `getModels()` so that importing this
 * file never opens a connection by itself.
 */
import mongoose from "mongoose";
import type { Model } from "mongoose";
import type {
  ContactMessage,
  ExperienceEntry,
  Profile,
  Project,
  SkillGroup,
} from "../types.js";
import { contactMessageSchema } from "../schemas/contact-message.schema.js";
import {
  experienceSchema,
  profileSchema,
  skillGroupSchema,
} from "../schemas/content.schema.js";
import { projectSchema } from "../schemas/project.schema.js";

export interface DatabaseModels {
  ProjectModel: Model<Project>;
  SkillGroupModel: Model<SkillGroup>;
  ExperienceModel: Model<ExperienceEntry>;
  ProfileModel: Model<Profile>;
  ContactMessageModel: Model<Omit<ContactMessage, "id">>;
}

let cached: DatabaseModels | null = null;

export function getModels(): DatabaseModels {
  if (cached) return cached;

  cached = {
    ProjectModel:
      (mongoose.models.Project as Model<Project>) ??
      mongoose.model<Project>("Project", projectSchema),
    SkillGroupModel:
      (mongoose.models.SkillGroup as Model<SkillGroup>) ??
      mongoose.model<SkillGroup>("SkillGroup", skillGroupSchema),
    ExperienceModel:
      (mongoose.models.Experience as Model<ExperienceEntry>) ??
      mongoose.model<ExperienceEntry>("Experience", experienceSchema),
    ProfileModel:
      (mongoose.models.Profile as Model<Profile>) ??
      mongoose.model<Profile>("Profile", profileSchema),
    ContactMessageModel:
      (mongoose.models.ContactMessage as Model<Omit<ContactMessage, "id">>) ??
      mongoose.model<Omit<ContactMessage, "id">>(
        "ContactMessage",
        contactMessageSchema,
      ),
  };

  return cached;
}
