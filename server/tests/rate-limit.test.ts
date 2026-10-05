/**
 * ELYSE DEV — contact rate limiting.
 *
 *   npm test -w @elyse/server
 *
 * Boots the real app with a deliberately small limit and proves that the
 * throttle actually engages — and that it identifies senders by a salted
 * fingerprint rather than by anything reversible.
 *
 * The fingerprint salt is randomised per run so the counters always start from
 * zero, no matter how many times the suite is executed within the window.
 * Stored messages land in the git-ignored `database/.data/contact-messages.json`.
 */
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { Server } from "node:http";

process.env.CONTACT_MAX_PER_WINDOW = "2";
process.env.CONTACT_WINDOW_MS = "600000";
process.env.CONTACT_FINGERPRINT_SALT = `rate-limit-test-${Date.now()}`;

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

function payload(index: number) {
  return {
    name: `Rate Limit Test ${index}`,
    email: `rate.limit.${index}@example.com`,
    subject: `Automated test submission ${index}`,
    topic: "question",
    message:
      "This message exists to verify the sliding-window rate limiter behaves as documented.",
  };
}

async function post(body: unknown) {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: (await response.json()) as unknown };
}

describe("contact rate limiting", () => {
  it("accepts submissions up to the configured limit, then refuses with 429", async () => {
    const first = await post(payload(1));
    const second = await post(payload(2));
    const third = await post(payload(3));

    assert.equal(first.status, 201, "first submission should be stored");
    assert.equal(second.status, 201, "second submission should be stored");

    assert.equal(third.status, 429, "third submission should be rate limited");
    const error = (third.body as { error: { code: string; message: string } }).error;
    assert.equal(error.code, "rate_limited");
    assert.match(error.message, /already sent several messages/i);
  });

  it("does not leak which messages it is counting", async () => {
    const { status, body } = await post(payload(4));
    assert.equal(status, 429);
    const error = (body as { error: { details?: unknown } }).error;
    assert.equal(error.details, undefined, "the 429 response should not echo stored data");
  });

  it("keeps the public listing free of message contents", async () => {
    const response = await fetch(`${baseUrl}/api/contact`);
    const payloadJson = (await response.json()) as {
      data: Record<string, unknown>;
      meta: Record<string, unknown>;
    };

    assert.equal(payloadJson.meta.messagesExposed, false);
    assert.deepEqual(Object.keys(payloadJson.data), ["accepted"]);
  });
});
