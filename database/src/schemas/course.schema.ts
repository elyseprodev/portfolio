/**
 * ELYSE DEV — Mongoose schemas: Course, CourseTrack and Certificate.
 */
import mongoose from "mongoose";

const { Schema } = mongoose;
import type { Certificate, Course, CourseTrack } from "../types.js";

const courseModuleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    hours: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

export const courseSchema = new Schema<Course>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    language: { type: String, required: true, trim: true },
    mark: { type: String, required: true, trim: true },
    trackId: { type: String, required: true, index: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "in-development", "planned"],
      required: true,
      index: true,
    },
    tagline: { type: String, required: true },
    summary: { type: String, required: true },
    weeks: { type: Number, required: true, min: 1 },
    hours: { type: Number, required: true, min: 1 },
    outcomes: { type: [String], default: [] },
    modules: { type: [courseModuleSchema], default: [] },
    capstone: { type: String, required: true },
    prerequisites: { type: [String], default: [] },
    tooling: { type: [String], default: [] },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "courses",
  },
);

export const courseTrackSchema = new Schema<CourseTrack>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    emoji: { type: String, trim: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "course_tracks",
  },
);

export const certificateSchema = new Schema<Certificate>(
  {
    code: { type: String, required: true, unique: true, index: true },
    studentName: { type: String, required: true, trim: true },
    courseSlug: { type: String, required: true, index: true },
    courseTitle: { type: String, required: true, trim: true },
    kind: { type: String, enum: ["completion", "sample"], required: true },
    issuedAt: { type: String, required: true },
    hours: { type: Number, required: true, min: 0 },
    moduleCount: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "certificates",
  },
);
