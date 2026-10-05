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
  /**
   * One message per field, in the same order and wording as the client rules
   * (client/src/lib/validation.ts), so a visitor never sees two complaints about
   * the same input.
   */
  email: z
    .string()
    .trim()
    .toLowerCase()
    .superRefine((value, ctx) => {
      if (value.length === 0) {
        ctx.addIssue({ code: "custom", message: "Please enter your email address." });
        return;
      }
      if (value.length > 200) {
        ctx.addIssue({
          code: "custom",
          message: "Please keep your email under 200 characters.",
        });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        ctx.addIssue({
          code: "custom",
          message: "That does not look like a valid email address.",
        });
      }
    }),
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

/* -------------------------------------------------------------------------- */
/* Academy                                                                    */
/* -------------------------------------------------------------------------- */

export const courseQuerySchema = z.object({
  track: z.string().trim().max(40).optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  status: z.enum(["available", "in-development", "planned"]).optional(),
  featured: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((value) => value === true || value === "true")
    .optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
});

/**
 * A certificate carries a student name and the course they completed — nothing
 * else. The name is validated as text, not as a credential: any human name in
 * any script is acceptable, and punctuation is allowed.
 */
export const certificateRequestSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(2, "Please enter the name that should appear on the certificate.")
    .max(80, "Please keep the name under 80 characters.")
    .refine((value) => /[\p{L}\p{N}]/u.test(value), {
      message: "The name needs at least one letter or number.",
    }),
  courseSlug: z
    .string()
    .trim()
    .min(1, "Please choose a course.")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Course slugs are lowercase words separated by dashes."),
});

export type CourseQuery = z.infer<typeof courseQuerySchema>;
export type CertificateRequest = z.infer<typeof certificateRequestSchema>;
