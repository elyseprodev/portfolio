/**
 * ELYSE DEV — API tests.
 *
 *   npm test -w @elyse/server
 *
 * The real Express stack is booted on an ephemeral port and exercised over
 * HTTP with Node's built-in test runner and fetch — no extra test dependency.
 * Contact submissions land in the git-ignored local store
 * (`database/.data/contact-messages.json`), never in MongoDB.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { Server } from "node:http";

import type { Profile, Project, SkillGroup } from "@elyse/database/types";

/**
 * Test isolation: contact submissions are rate limited per fingerprint, and the
 * count is persisted in the git-ignored local store. Giving this suite its own
 * salt keeps it independent of how many messages other suites sent — and of how
 * many times the suite has already run today.
 */
process.env.CONTACT_FINGERPRINT_SALT = `api-test-${Date.now()}-${Math.random()}`;
process.env.CONTACT_MAX_PER_WINDOW = "50";

const { createApp } = await import("../src/app.ts");

interface ApiEnvelope<T> {
  data: T;
  meta: Record<string, unknown>;
}

let server: Server;
let baseUrl: string;

before(async () => {
  const app = createApp();
  server = await new Promise<Server>((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not determine the test server port.");
  }
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

async function getJson<T>(path: string): Promise<{ status: number; body: ApiEnvelope<T> }> {
  const response = await fetch(`${baseUrl}${path}`);
  const body = (await response.json()) as ApiEnvelope<T>;
  return { status: response.status, body };
}

describe("health", () => {
  it("reports the active database backend", async () => {
    const { status, body } = await getJson<{
      status: string;
      database: { backend: string };
    }>("/api/health");

    assert.equal(status, 200);
    assert.ok(["ok", "degraded"].includes(body.data.status));
    assert.ok(["mongodb", "json-store"].includes(body.data.database.backend));
  });
});

describe("content routes", () => {
  it("returns the full content bundle", async () => {
    const { status, body } = await getJson<{
      profile: Profile;
      projects: Project[];
      skillGroups: SkillGroup[];
    }>("/api/content");

    assert.equal(status, 200);
    assert.equal(body.data.profile.name, "Elyse Dev");
    assert.ok(body.data.projects.length >= 1);
    assert.ok(body.data.skillGroups.length >= 1);
  });

  it("filters projects by category", async () => {
    const { body } = await getJson<Project[]>("/api/projects?category=frontend");
    assert.ok(body.data.length >= 1);
    for (const project of body.data) {
      assert.equal(project.category, "frontend");
    }
  });

  it("searches projects", async () => {
    const { body } = await getJson<Project[]>("/api/projects?q=education");
    assert.ok(body.data.some((project) => project.slug === "light-education"));
  });

  it("rejects an unknown category with a validation error", async () => {
    const response = await fetch(`${baseUrl}/api/projects?category=nonsense`);
    assert.equal(response.status, 422);
    const payload = (await response.json()) as { error: { code: string } };
    assert.equal(payload.error.code, "validation_failed");
  });

  it("returns a single project by slug", async () => {
    const { status, body } = await getJson<Project>(
      "/api/projects/elyse-dev-portfolio",
    );
    assert.equal(status, 200);
    assert.equal(body.data.slug, "elyse-dev-portfolio");
  });

  it("404s for an unknown project slug", async () => {
    const response = await fetch(`${baseUrl}/api/projects/does-not-exist`);
    assert.equal(response.status, 404);
  });

  it("marks draft projects so the UI never presents them as finished", async () => {
    const { body } = await getJson<Project[]>("/api/projects");
    const drafts = body.data.filter((project) => project.isDraft);
    assert.ok(drafts.length >= 1);
    for (const draft of drafts) {
      assert.equal(draft.links.length, 0);
    }
  });
});

describe("github route", () => {
  it("degrades gracefully instead of inventing activity", async () => {
    const { status, body } = await getJson<{
      available: boolean;
      repos: unknown[];
      reason?: string;
    }>("/api/github");

    assert.equal(status, 200);
    if (!body.data.available) {
      assert.equal(body.data.repos.length, 0);
      assert.ok(body.data.reason && body.data.reason.length > 10);
    }
  });
});

describe("contact route", () => {
  it("validates submissions and explains what is wrong", async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "A", email: "not-an-email", subject: "", message: "short" }),
    });

    assert.equal(response.status, 422);
    const payload = (await response.json()) as {
      error: { code: string; details: { field: string }[] };
    };
    assert.equal(payload.error.code, "validation_failed");
    assert.ok(payload.error.details.some((issue) => issue.field === "email"));
  });

  it("accepts a valid message and reports notification state honestly", async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Visitor",
        email: "visitor@example.com",
        subject: "Collaboration on a project",
        topic: "collaboration",
        message:
          "Hello Elyse, I would like to collaborate on a small web application.",
      }),
    });

    assert.equal(response.status, 201);
    const payload = (await response.json()) as ApiEnvelope<{
      status: string;
      notification: string;
    }>;
    assert.equal(payload.data.status, "received");
    assert.ok(
      ["sent", "not-configured", "failed"].includes(payload.data.notification),
    );
  });

  it("silently drops honeypot submissions", async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Spam Bot",
        email: "bot@example.com",
        subject: "Buy something",
        message: "This message was written by an automated submission tool.",
        company: "definitely-a-bot",
      }),
    });

    assert.equal(response.status, 202);
    const payload = (await response.json()) as ApiEnvelope<{ status: string }>;
    assert.equal(payload.data.status, "received");
  });

  it("never exposes stored messages publicly", async () => {
    const { body } = await getJson<Record<string, unknown>>("/api/contact");
    assert.equal(body.meta.messagesExposed, false);
    assert.ok(!("message" in body.data));
  });
});

describe("unknown routes", () => {
  it("returns a JSON 404 envelope", async () => {
    const response = await fetch(`${baseUrl}/api/not-a-real-route`);
    assert.equal(response.status, 404);
    const payload = (await response.json()) as { error: { code: string } };
    assert.equal(payload.error.code, "not_found");
  });
});
