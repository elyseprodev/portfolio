/**
 * ELYSE DEV — Mongoose schema: Project
 */
import mongoose from "mongoose";

const { Schema } = mongoose;
import type { Project } from "../types.js";

const projectLinkSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["live", "source", "docs", "other"],
      required: true,
    },
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const projectShotSchema = new Schema(
  {
    src: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
  },
  { _id: false },
);

const projectChallengeSchema = new Schema(
  {
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
  },
  { _id: false },
);

export const projectSchema = new Schema<Project>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    category: {
      type: String,
      enum: ["full-stack", "frontend", "backend", "learning"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "concept"],
      required: true,
      default: "in-progress",
    },
    year: { type: String, required: true },
    featured: { type: Boolean, default: false, index: true },
    isDraft: { type: Boolean, default: true },
    overview: { type: [String], default: [] },
    problem: { type: String, default: "" },
    goals: { type: [String], default: [] },
    features: { type: [String], default: [] },
    stack: { type: [String], default: [], index: true },
    links: { type: [projectLinkSchema], default: [] },
    gallery: { type: [projectShotSchema], default: [] },
    challenges: { type: [projectChallengeSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "projects",
  },
);

projectSchema.index({ title: "text", summary: "text", tagline: "text" });
