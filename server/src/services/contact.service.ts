/**
 * ELYSE DEV — contact message service.
 *
 * Responsibilities:
 *   • store the message through the active database backend
 *   • throttle abusive senders (in-memory sliding window, no raw IP stored)
 *   • optionally send an e-mail notification, and report honestly when e-mail
 *     is not configured instead of pretending a mail went out
 */
import { createHash } from "node:crypto";
import type { ContactMessage } from "@elyse/database/types";
import { resolveContentStore } from "@elyse/database";
import { env } from "../config/env.ts";
import type { ContactMessagePayload } from "../lib/validation.ts";

export interface ContactResult {
  message: ContactMessage;
  notification: "sent" | "not-configured" | "failed";
  notificationDetail?: string;
}

/** Non-reversible fingerprint: salted hash of IP + user agent. */
export function fingerprintRequest(ip: string, userAgent: string): string {
  return createHash("sha256")
    .update(`${env.contact.fingerprintSalt}:${ip}:${userAgent}`)
    .digest("hex");
}

export function clientIp(headerValue: string | undefined, fallback: string): string {
  return headerValue?.split(",")[0]?.trim() || fallback;
}

export async function isRateLimited(
  requestFingerprint: string,
): Promise<boolean> {
  const store = await resolveContentStore();
  const since = new Date(Date.now() - env.contact.windowMs).toISOString();
  const recent = await store.countMessagesByFingerprint(
    requestFingerprint,
    since,
  );
  return recent >= env.contact.maxPerWindow;
}

async function sendNotification(
  payload: ContactMessagePayload,
): Promise<{ notification: ContactResult["notification"]; detail?: string }> {
  if (!env.contact.resendApiKey || !env.contact.notifyTo) {
    return {
      notification: "not-configured",
      detail:
        "Stored successfully. E-mail notifications are off — set RESEND_API_KEY and CONTACT_NOTIFY_TO on the server to receive them.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.contact.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.contact.notifyFrom,
        to: [env.contact.notifyTo],
        reply_to: payload.email,
        subject: `[ELYSE DEV] ${payload.subject}`,
        text: [
          `From: ${payload.name} <${payload.email}>`,
          `Topic: ${payload.topic}`,
          "",
          payload.message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[contact] notification failed:", response.status, detail);
      return { notification: "failed", detail: "Message saved, but the e-mail notification could not be delivered." };
    }

    return { notification: "sent" };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown error";
    console.error("[contact] notification error:", detail);
    return { notification: "failed", detail };
  }
}

export async function submitContactMessage(
  payload: ContactMessagePayload,
  context: { requestFingerprint: string; userAgent?: string },
): Promise<ContactResult> {
  const store = await resolveContentStore();

  const message = await store.createContactMessage(
    {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      topic: payload.topic,
      message: payload.message,
    },
    context,
  );

  const { notification, detail } = await sendNotification(payload);

  return {
    message,
    notification,
    ...(detail ? { notificationDetail: detail } : {}),
  };
}
