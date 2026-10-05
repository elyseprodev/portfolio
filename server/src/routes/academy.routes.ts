/**
 * ELYSE DEV — academy routes.
 *
 *   GET  /api/courses                 → the catalogue (filter: track, level, status)
 *   GET  /api/courses/:slug           → one course with its curriculum
 *   GET  /api/certificates/:code      → verify a certificate
 *   POST /api/certificates            → issue one (rate limited, validated)
 *
 * Certificates are public once issued: whoever holds the code can check it,
 * which is the entire point of a verification code. Nothing else about a
 * student is stored — no email, no address, no account.
 */
import { Router } from "express";
import { resolveContentStore, getStoreMeta } from "@elyse/database";
import { sendOk } from "../lib/api-response.ts";
import { createRateLimiter } from "../lib/rate-limit.ts";
import { certificateRequestSchema, courseQuerySchema } from "../lib/validation.ts";
import { HttpError } from "../middleware/error-handler.ts";
import {
  findCertificate,
  issueCertificate,
  normaliseCode,
} from "../services/certificate.service.ts";

export const academyRouter = Router();

const CERTIFICATE_WINDOW_MS = Number(process.env.CERTIFICATE_WINDOW_MS ?? 60 * 60 * 1000);
const CERTIFICATE_MAX_PER_WINDOW = Number(process.env.CERTIFICATE_MAX_PER_WINDOW ?? 10);

const certificateLimiter = createRateLimiter({
  windowMs: CERTIFICATE_WINDOW_MS,
  max: CERTIFICATE_MAX_PER_WINDOW,
});

academyRouter.get("/courses", async (req, res) => {
  const query = courseQuerySchema.parse(req.query);
  const store = await resolveContentStore();
  const all = await store.listCourses();

  let courses = all;
  if (query.track) courses = courses.filter((course) => course.trackId === query.track);
  if (query.level) courses = courses.filter((course) => course.level === query.level);
  if (query.status) courses = courses.filter((course) => course.status === query.status);
  if (query.featured !== undefined) {
    courses = courses.filter((course) => Boolean(course.featured) === query.featured);
  }
  if (query.limit) courses = courses.slice(0, query.limit);

  sendOk(res, courses, {
    backend: getStoreMeta(),
    count: courses.length,
    total: all.length,
  });
});

academyRouter.get("/courses/:slug", async (req, res) => {
  const store = await resolveContentStore();
  const { slug } = req.params;
  const course = await store.getCourse(slug);
  if (!course) {
    throw new HttpError(404, "course_not_found", `No course with slug "${slug}".`);
  }
  sendOk(res, course, { backend: getStoreMeta() });
});

academyRouter.get("/certificates/:code", async (req, res) => {
  const certificate = await findCertificate(req.params.code);
  if (!certificate) {
    throw new HttpError(
      404,
      "certificate_not_found",
      "No certificate matches that code. Check the code and try again.",
    );
  }
  sendOk(res, certificate, { backend: getStoreMeta(), verified: true });
});

academyRouter.post("/certificates", async (req, res) => {
  const payload = certificateRequestSchema.parse(req.body ?? {});

  const key = (req.headers["x-forwarded-for"]?.toString().split(",")[0] ?? req.ip ?? "unknown").trim();
  const limit = certificateLimiter.check(key);
  if (!limit.allowed) {
    res.setHeader("Retry-After", Math.ceil(limit.retryAfterMs / 1000));
    throw new HttpError(
      429,
      "rate_limited",
      "That is a lot of certificates in one hour. Please try again shortly.",
    );
  }

  const store = await resolveContentStore();
  const course = await store.getCourse(payload.courseSlug);
  if (!course) {
    throw new HttpError(
      404,
      "course_not_found",
      `No course with slug "${payload.courseSlug}" — pick one from /api/courses.`,
    );
  }

  const certificate = await issueCertificate({
    studentName: payload.studentName,
    course,
  });

  sendOk(res, certificate, { backend: getStoreMeta() }, 201);
});

/** Exposed for tests: forgives a key so a suite can start from a clean slate. */
export const __certificateLimiter = certificateLimiter;
export { normaliseCode };
