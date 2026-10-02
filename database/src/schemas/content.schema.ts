/**
 * ELYSE DEV — Mongoose schemas: SkillGroup, ExperienceEntry, Profile
 */
import mongoose from "mongoose";

const { Schema } = mongoose;
import type { ExperienceEntry, Profile, SkillGroup } from "../types.js";

const skillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    note: { type: String, trim: true },
  },
  { _id: false },
);

export const skillGroupSchema = new Schema<SkillGroup>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortLabel: { type: String, required: true, trim: true },
    skills: { type: [skillSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "skill_groups",
  },
);

export const experienceSchema = new Schema<ExperienceEntry>(
  {
    id: { type: String, required: true, unique: true, index: true },
    kind: {
      type: String,
      enum: ["education", "project", "learning", "work"],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    organisation: { type: String, trim: true },
    period: { type: String, trim: true },
    location: { type: String, trim: true },
    summary: { type: String, required: true },
    highlights: { type: [String], default: [] },
    isPlaceholder: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "experience",
  },
);

const profileHighlightSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    note: { type: String, trim: true },
  },
  { _id: false },
);

export const profileSchema = new Schema<Profile>(
  {
    id: { type: String, required: true, unique: true, default: "profile" },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    headline: { type: String, required: true },
    summary: { type: String, required: true },
    bio: { type: [String], default: [] },
    focusAreas: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    github: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    availability: { type: String, required: true },
    highlights: { type: [profileHighlightSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "profile",
  },
);
