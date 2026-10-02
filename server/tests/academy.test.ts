/**
 * ELYSE DEV — academy tests.
 *
 *   npm test -w @elyse/server
 *
 * Covers the parts that must not silently break: the limiter's window maths,
 * the verification-code alphabet, certificate issuance through the real HTTP
 * stack, and verification round-trips. Certificates land in the git-ignored
 * local store, never in MongoDB, and the limiter is reset between suites.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { Server } from "node:http";

import { createRateLimiter } from "../src/lib/rate-limit.ts";
import {
  buildCertificate,
  CODE_ALPHABET,
  generateVerificationCode,
  normaliseCode,
} from "../src/services/certificate.service.ts";
import { createApp } from "../src/app.ts";
import type { Certificate, Course } from "@elyse/database/types";

const COURSE: Course = {
  slug: "test-course",
  language: "Testlang",
  mark: "TL",
  trackId: "web",
  level: "beginner",
  status: "available",
  tagline: "A course used by the test suite",
  summary: "Not shipped to students — this exists so the suite can issue certificates.",
  weeks: 4,
  hours: 40,
  outcomes: ["One", "Two", "Three"],
  modules: [
    { title: "One", summary: "First module", hours: 8 },
    { title: "Two", summary: "Second module", hours: 32 },
  ],
  capstone: "a test project",
  prerequisites: [],
  tooling: ["nothing"],
  image: "/images/courses/test-course.svg",
};

describe("rate limiter", () => {
  it("allows exactly the configured number of actions per window", () => {
    const clock = 1_000;
    const limiter = createRateLimiter({
      windowMs: 1_000,
      max: 3,
      now: () => clock,
    });

    assert.equal(limiter.check("a").allowed, true);
    assert.equal(limiter.check("a").allowed, true);
    assert.equal(limiter.check("a").allowed, true);

    const blocked = limiter.check("a");
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfterMs > 0, "a blocked caller is told when to retry");
  });

  it("forgets an action once its window has passed", () => {
    let clock = 1_000;
    const limiter = createRateLimiter({ windowMs: 1_000, max: 1, now: () => clock });

    assert.equal(limiter.check("a").allowed, true);
    assert.equal(limiter.check("a").allowed, false);

    clock += 1_001;
    assert.equal(limiter.check("a").allowed, true, "the window must slide");
  });

  it("counts callers separately", () => {
    const limiter = createRateLimiter({ windowMs: 1_000, max: 1, now: () => 5 });
    assert.equal(limiter.check("a").allowed, true);
    assert.equal(limiter.check("b").allowed, true, "one caller must not exhaust another's budget");
    assert.equal(limiter.size(), 2);
    limiter.reset();
    assert.equal(limiter.size(), 0);
  });
});

describe("verification codes", () => {
  it("never contains a character a human can misread", () => {
    for (let index = 0; index < 200; index += 1) {
      const code = generateVerificationCode();
      assert.match(code, /^EDA-[A-Z2-9]{4}-[A-Z2-9]{4}$/, `unexpected code shape: ${code}`);
      for (const character of code.replace(/^EDA-|-/g, "")) {
        assert.ok(
          CODE_ALPHABET.includes(character),
          `"${character}" is not in the safe alphabet (${code})`,
        );
      }
    }
  });

  it("is unique across a burst", () => {
    const codes = new Set(Array.from({ length: 500 }, () => generateVerificationCode()));
    assert.equal(codes.size, 500, "codes must not collide in normal use");
  });

  it("forgives how a code was typed", () => {
    const expected = "EDA-7F3K-M4QX";
    assert.equal(normaliseCode("eda-7f3k-m4qx"), expected);
    assert.equal(normaliseCode("EDA 7F3K M4QX"), expected);
    assert.equal(normaliseCode("eda7f3km4qx"), expected);
    assert.equal(normaliseCode("  EDA-7F3K-M4QX  "), expected);
  });

  it("leaves an unparseable code alone so the API can reject it", () => {
    assert.equal(normaliseCode("not-a-code"), "NOT-A-CODE");
  });
});

describe("certificate records", () => {
  it("marks a completion for an available course", () => {
    const certificate = buildCertificate({
      studentName: "  Amina   Kayitesi ",
      course: COURSE,
      now: () => new Date("2026-03-01T10:00:00.000Z"),
    });

    assert.equal(certificate.kind, "completion");
    assert.equal(certificate.studentName, "Amina Kayitesi", "name whitespace is tidied");
    assert.equal(certificate.courseTitle, "Testlang");
    assert.equal(certificate.issuedAt, "2026-03-01T10:00:00.000Z");
    assert.equal(certificate.moduleCount, 2);
    assert.equal(certificate.hours, 40);
  });

  it("issues a clearly-labelled sample while a course is still in development", () => {
    const certificate = buildCertificate({
      studentName: "Amina Kayitesi",
      course: { ...COURSE, status: "in-development" },
    });
    assert.equal(
      certificate.kind,
      "sample",
      "a course that is not available must not claim a completed certificate",
    );
  });
});

describe("academy API", () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    const app = createApp();
    server = await new Promise<Server>((resolve) => {
      const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
    });
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("no test port");
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("serves the course catalogue with metadata", async () => {
    const response = await fetch(`${baseUrl}/api/courses`);
    const body = (await response.json()) as {
      data: Course[];
      meta: { count: number; total: number; backend: { backend: string } };
    };
    assert.equal(response.status, 200);
    assert.ok(body.data.length >= 20, "the catalogue should cover many languages");
    assert.equal(body.meta.count, body.data.length);
    assert.ok(body.meta.backend.backend.length > 0);
  });

  it("filters by track and by status", async () => {
    const response = await fetch(`${baseUrl}/api/courses?track=web&status=available`);
    const body = (await response.json()) as { data: Course[] };
    assert.equal(response.status, 200);
    assert.ok(body.data.length > 0, "expected at least one available web course");
    for (const course of body.data) {
      assert.equal(course.trackId, "web");
      assert.equal(course.status, "available");
    }
  });

  it("404s an unknown course rather than returning an empty object", async () => {
    const response = await fetch(`${baseUrl}/api/courses/definitely-not-a-course`);
    assert.equal(response.status, 404);
    const body = (await response.json()) as { error: { code: string } };
    assert.equal(body.error.code, "course_not_found");
  });

  it("issues a certificate and verifies it by code", async () => {
    const issue = await fetch(`${baseUrl}/api/certificates`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        studentName: "Test Student",
        courseSlug: "javascript",
      }),
    });
    assert.equal(issue.status, 201);
    const issued = (await issue.json()) as { data: Certificate; meta: { backend: unknown } };
    assert.match(issued.data.code, /^EDA-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    assert.equal(issued.data.studentName, "Test Student");
    assert.equal(issued.data.courseSlug, "javascript");
    assert.equal(issued.data.kind, "completion");

    const verify = await fetch(`${baseUrl}/api/certificates/${issued.data.code.toLowerCase()}`);
    assert.equal(verify.status, 200, "verification must accept a lower-case code");
    const verified = (await verify.json()) as { data: Certificate; meta: { verified: boolean } };
    assert.equal(verified.data.code, issued.data.code);
    assert.equal(verified.meta.verified, true);
  });

  it("rejects an empty name and a missing course", async () => {
    const emptyName = await fetch(`${baseUrl}/api/certificates`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ studentName: " ", courseSlug: "javascript" }),
    });
    assert.equal(emptyName.status, 422, "a name without letters is unprocessable input");
    const emptyBody = (await emptyName.json()) as { error: { code: string } };
    assert.equal(emptyBody.error.code, "validation_failed");

    const badCourse = await fetch(`${baseUrl}/api/certificates`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ studentName: "Test Student", courseSlug: "no-such-course" }),
    });
    assert.equal(badCourse.status, 404);
  });

  it("404s an unknown verification code", async () => {
    const response = await fetch(`${baseUrl}/api/certificates/EDA-ZZZZ-ZZZZ`);
    assert.equal(response.status, 404);
    const body = (await response.json()) as { error: { code: string } };
    assert.equal(body.error.code, "certificate_not_found");
  });
});
