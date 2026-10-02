/**
 * ELYSE DEV — request validation schemas (Zod).
 */
import { z } from "zod";

export const contactTopicSchema = z.enum([
  "collaboration",
  "freelance",
  "opportunity",
  "question",
  "other",
]);

export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(120, "Please keep your name under 120 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Please enter your email address.")
    .max(200, "Please keep your email under 200 characters.")
    .email("That does not look like a valid email address."),
  subject: z
    .string()
    .trim()
    .min(3, "Please add a short subject.")
    .max(160, "Please keep the subject under 160 characters."),
  topic: contactTopicSchema.default("other"),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters so I can help properly.")
    .max(5000, "Please keep the message under 5000 characters."),
  /**
   * Honeypot: a field hidden from humans. If it arrives filled in, the request
   * came from an automated client and is discarded.
   */
  company: z.string().max(200).optional(),
});

export type ContactMessagePayload = z.infer<typeof contactMessageSchema>;

export const projectQuerySchema = z.object({
  category: z
    .enum(["full-stack", "frontend", "backend", "learning"])
    .optional(),
  featured: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional(),
  q: z.string().trim().max(120).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export type ProjectQuery = z.infer<typeof projectQuerySchema>;
