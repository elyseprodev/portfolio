/**
 * ELYSE DEV — academy certificate issuance.
 *
 * A certificate is a small, immutable record: who completed what, when, and a
 * code anyone can use to check it. Codes are generated with `randomBytes` from
 * an alphabet with the ambiguous characters removed (no O/0, I/1), grouped for
 * reading aloud, and stored through the same `ContentStore` the rest of the API
 * uses — so certificates survive a restart with MongoDB and still work locally
 * through the JSON store.
 */
import { randomInt } from "node:crypto";
import { resolveContentStore } from "@elyse/database";
import type { Certificate, Course } from "@elyse/database/types";

/**
 * No 0/O, 1/I/L, 2/Z, 5/S, 8/B — a code read down a phone line, or typed from a
 * screenshot, should still resolve to exactly one certificate.
 */
export const CODE_ALPHABET = "ACDEFGHJKMNPQRTUVWXY346789";
const GROUP_LENGTH = 4;
const GROUPS = 2;

export interface IssueCertificateInput {
  studentName: string;
  course: Course;
  /** Injected clock so the issued date is deterministic under test. */
  now?: () => Date;
}

export function generateVerificationCode(): string {
  const groups: string[] = [];
  for (let group = 0; group < GROUPS; group += 1) {
    let chunk = "";
    for (let index = 0; index < GROUP_LENGTH; index += 1) {
      chunk += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
    }
    groups.push(chunk);
  }
  return `EDA-${groups.join("-")}`;
}

/**
 * Accepts what a human types: lowercase, spaces instead of dashes, or the bare
 * body of the code. Anything that is not a plausible code is returned trimmed
 * and uppercased so the caller can reject it rather than guess at it.
 */
export function normaliseCode(input: string): string {
  const trimmed = input.trim().toUpperCase();
  const cleaned = trimmed.replace(/[^A-Z0-9]/g, "");
  const body = (cleaned.startsWith("EDA") ? cleaned.slice(3) : cleaned).trim();
  const isCodeBody =
    body.length === GROUP_LENGTH * GROUPS &&
    [...body].every((character) => CODE_ALPHABET.includes(character));
  if (!isCodeBody) return trimmed;
  return `EDA-${body.slice(0, GROUP_LENGTH)}-${body.slice(GROUP_LENGTH)}`;
}

export function buildCertificate(input: IssueCertificateInput): Certificate {
  const { studentName, course } = input;
  const issuedAt = (input.now?.() ?? new Date()).toISOString();

  return {
    code: generateVerificationCode(),
    studentName: studentName.trim().replace(/\s+/g, " "),
    courseSlug: course.slug,
    courseTitle: course.language,
    /**
     * A course that is not marked available yet cannot hand out a completed
     * certificate honestly — those are issued as clearly-labelled samples.
     */
    kind: course.status === "available" ? "completion" : "sample",
    issuedAt,
    hours: course.hours,
    moduleCount: course.modules.length,
  };
}

export async function issueCertificate(
  input: IssueCertificateInput,
): Promise<Certificate> {
  const store = await resolveContentStore();
  const certificate = buildCertificate(input);
  return store.saveCertificate(certificate);
}

export async function findCertificate(code: string): Promise<Certificate | null> {
  const store = await resolveContentStore();
  return store.getCertificate(normaliseCode(code));
}
