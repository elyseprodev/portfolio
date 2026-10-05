/**
 * ELYSE DEV — Mongoose model registry.
 *
 * Models are registered lazily through `getModels()` so that importing this
 * file never opens a connection by itself.
 */
import mongoose from "mongoose";
import type { Model } from "mongoose";
import type {
  Certificate,
  ContactMessage,
  Course,
  CourseTrack,
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
import {
  certificateSchema,
  courseSchema,
  courseTrackSchema,
} from "../schemas/course.schema.js";

export interface DatabaseModels {
  ProjectModel: Model<Project>;
  SkillGroupModel: Model<SkillGroup>;
  ExperienceModel: Model<ExperienceEntry>;
  ProfileModel: Model<Profile>;
  ContactMessageModel: Model<Omit<ContactMessage, "id">>;
  CourseModel: Model<Course>;
  CourseTrackModel: Model<CourseTrack>;
  CertificateModel: Model<Certificate>;
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
    CourseModel:
      (mongoose.models.Course as Model<Course>) ??
      mongoose.model<Course>("Course", courseSchema),
    CourseTrackModel:
      (mongoose.models.CourseTrack as Model<CourseTrack>) ??
      mongoose.model<CourseTrack>("CourseTrack", courseTrackSchema),
    CertificateModel:
      (mongoose.models.Certificate as Model<Certificate>) ??
      mongoose.model<Certificate>("Certificate", certificateSchema)
  };

  return cached;
}
