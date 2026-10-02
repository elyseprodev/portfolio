/**
 * ELYSE DEV — degraded database behaviour.
 *
 *   npm test -w @elyse/server
 *
 * The most important promise in this codebase is that a misconfigured
 * production database is never hidden. This suite points MONGODB_URI at an
 * unreachable address and proves that:
 *
 *   1. the process still starts and serves traffic (the JSON store takes over)
 *   2. /api/health reports status "degraded" with a human-readable reason
 *   3. content routes keep working from the fallback, so the site never breaks
 *
 * It runs in its own process, so the poisoned MONGODB_URI cannot affect the
 * other suites.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { Server } from "node:http";

// Port 1 is reserved and never listening: the connection fails immediately.
process.env.MONGODB_URI = "mongodb://127.0.0.1:1/elyse_dev_unreachable";
process.env.MONGODB_TIMEOUT_MS = "800";

const { createApp } = await import("../src/app.ts");

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

interface HealthPayload {
  status: string;
  database: { backend: string; degraded: boolean; details: string };
}

describe("unreachable MongoDB", () => {
  it("reports the failure instead of pretending to be healthy", async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);

    const { data } = (await response.json()) as { data: HealthPayload };

    assert.equal(data.status, "degraded");
    assert.equal(data.database.degraded, true);
    assert.equal(data.database.backend, "json-store");
    assert.match(data.database.details, /unreachable|ECONNREFUSED|failed/i);
  });

  it("keeps serving content from the fallback store", async () => {
    const response = await fetch(`${baseUrl}/api/content`);
    assert.equal(response.status, 200);

    const { data, meta } = (await response.json()) as {
      data: { profile: { name: string }; projects: unknown[] };
      meta: { backend?: { degraded?: boolean } };
    };

    assert.equal(data.profile.name, "MURENGERANTWARI Elyse");
    assert.ok(data.projects.length > 0);
    assert.equal(meta.backend?.degraded, true, "meta should flag the degraded backend");
  });

  it("still stores contact messages through the fallback store", async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Degraded Store Test",
        email: "degraded@example.com",
        subject: "Verifying the fallback store accepts writes",
        topic: "other",
        message:
          "This message verifies that a degraded database still accepts writes instead of failing.",
      }),
    });

    assert.equal(response.status, 201);
    const { data } = (await response.json()) as {
      data: { status: string; notification: string };
    };
    assert.equal(data.status, "received");
    assert.ok(["sent", "not-configured", "failed"].includes(data.notification));
  });
});
