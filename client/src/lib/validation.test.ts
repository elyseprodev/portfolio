/**
 * ELYSE DEV — form validation tests.
 *
 *   npm test -w @elyse/client
 *
 * Node's built-in test runner via tsx. These cover the rules that mirror the
 * server's Zod schema, so a drift between the two is caught before it reaches a
 * visitor.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  EMAIL_PATTERN,
  MESSAGE_MAX,
  emptyContactForm,
  validateContactForm,
} from "./validation";

/** A message that is long enough to pass the minimum length rule. */
const GOOD_MESSAGE = "Hello Elyse, I would like to collaborate on a web app.";

function values(overrides: Partial<typeof emptyContactForm> = {}) {
  return { ...emptyContactForm, ...overrides };
}

describe("contact form validation", () => {
  it("accepts a complete, valid submission", () => {
    const errors = validateContactForm(
      values({
        name: "Jean Bosco",
        email: "jean@example.com",
        subject: "Collaboration on a project",
        message: GOOD_MESSAGE,
      }),
    );

    assert.deepEqual(errors, {});
  });

  it("requires a name of at least two characters", () => {
    const errors = validateContactForm(
      values({ name: "A", email: "a@b.co", subject: "Hi there", message: GOOD_MESSAGE }),
    );
    assert.match(errors.name ?? "", /at least 2 characters/i);
  });

  it("rejects an obviously malformed email address", () => {
    for (const email of ["not-an-email", "missing@tld", "two@@example.com", "no-at-sign.com"]) {
      const errors = validateContactForm(
        values({ name: "Visitor", email, subject: "Subject line", message: GOOD_MESSAGE }),
      );
      assert.ok(errors.email, `expected "${email}" to be rejected`);
    }
  });

  it("accepts the email shapes people actually use", () => {
    for (const email of [
      "elyse@example.com",
      "first.last+tag@sub.example.co.rw",
      "developer_7@example.io",
    ]) {
      assert.ok(EMAIL_PATTERN.test(email), `expected "${email}" to be accepted`);
    }
  });

  it("requires a subject", () => {
    const errors = validateContactForm(
      values({ name: "Visitor", email: "v@example.com", subject: "Hi", message: GOOD_MESSAGE }),
    );
    assert.ok(errors.subject);
  });

  it("requires a message of real substance", () => {
    const errors = validateContactForm(
      values({
        name: "Visitor",
        email: "v@example.com",
        subject: "A real subject",
        message: "too short",
      }),
    );
    assert.match(errors.message ?? "", /at least 20 characters/i);
  });

  it("rejects a message beyond the server limit", () => {
    const errors = validateContactForm(
      values({
        name: "Visitor",
        email: "v@example.com",
        subject: "A real subject",
        message: "x".repeat(MESSAGE_MAX + 1),
      }),
    );
    assert.match(errors.message ?? "", /under 5000 characters/i);
  });

  it("reports every invalid field at once, not just the first", () => {
    const errors = validateContactForm(values());
    assert.deepEqual(
      Object.keys(errors).sort(),
      ["email", "message", "name", "subject"],
    );
  });

  it("ignores surrounding whitespace when measuring length", () => {
    const errors = validateContactForm(
      values({
        name: "   Elyse   ",
        email: "  elyse@example.com  ",
        subject: "  A padded subject  ",
        message: `   ${GOOD_MESSAGE}   `,
      }),
    );
    assert.deepEqual(errors, {});
  });
});
