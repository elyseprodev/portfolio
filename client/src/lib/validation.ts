/**
 * ELYSE DEV — client-side form rules.
 *
 * Mirrors the server's Zod schema (server/src/lib/validation.ts). The server is
 * still the source of truth: this exists to give immediate, accessible feedback
 * rather than to replace server validation.
 */
import type { ContactTopic } from "@elyse/database/types";

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  topic: ContactTopic;
  message: string;
  /** Honeypot — hidden from humans. */
  company: string;
}

export type ContactField = Exclude<keyof ContactFormValues, "company">;

export type ContactErrors = Partial<Record<ContactField, string>>;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const contactTopics: { value: ContactTopic; label: string }[] = [
  { value: "collaboration", label: "Collaboration on a project" },
  { value: "freelance", label: "Freelance work" },
  { value: "opportunity", label: "A role or opportunity" },
  { value: "question", label: "A question about my work" },
  { value: "other", label: "Something else" },
];

export const emptyContactForm: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  topic: "collaboration",
  message: "",
  company: "",
};

export function validateContactForm(values: ContactFormValues): ContactErrors {
  const errors: ContactErrors = {};

  const name = values.name.trim();
  if (name.length < 2) errors.name = "Please enter at least 2 characters.";
  else if (name.length > 120) errors.name = "Please keep your name under 120 characters.";

  const email = values.email.trim();
  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(email))
    errors.email = "That does not look like a valid email address.";

  const subject = values.subject.trim();
  if (subject.length < 3) errors.subject = "Please add a short subject.";
  else if (subject.length > 160)
    errors.subject = "Please keep the subject under 160 characters.";

  const message = values.message.trim();
  if (message.length < 20)
    errors.message = "Please write at least 20 characters so I can help properly.";
  else if (message.length > 5000)
    errors.message = "Please keep the message under 5000 characters.";

  return errors;
}

export const MESSAGE_MAX = 5000;

export function fieldError(
  result: { field: string; message: string }[] | undefined,
  field: ContactField,
): string | undefined {
  return result?.find((issue) => issue.field === field)?.message;
}
