/**
 * ELYSE DEV — Mongoose schema: ContactMessage
 *
 * Messages are stored verbatim (name / email / subject / message) which is
 * everything needed to reply. No raw IP addresses are persisted: only a salted
 * SHA-256 fingerprint used for basic abuse throttling.
 */
import mongoose from "mongoose";

const { Schema } = mongoose;
import type { ContactMessage } from "../types.js";

export const contactMessageSchema = new Schema<ContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    topic: {
      type: String,
      enum: ["collaboration", "freelance", "opportunity", "question", "other"],
      default: "other",
    },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ["received"], default: "received" },
    createdAt: { type: String, required: true, index: true },
    requestFingerprint: { type: String, required: true, index: true },
    userAgent: { type: String, maxlength: 300 },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    versionKey: false,
    collection: "contact_messages",
  },
);
