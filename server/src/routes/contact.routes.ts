/**
 * ELYSE DEV — contact routes.
 *
 *   POST /api/contact   → validate, store and optionally notify
 *   GET  /api/contact   → count only, so the endpoint never leaks messages
 *
 * Stored messages are intentionally NOT readable through the public API.
 */
import { Router } from "express";
import { resolveContentStore } from "@elyse/database";
import { sendOk } from "../lib/api-response.ts";
import { contactMessageSchema } from "../lib/validation.ts";
import { HttpError } from "../middleware/error-handler.ts";
import {
  clientIp,
  fingerprintRequest,
  isRateLimited,
  submitContactMessage,
} from "../services/contact.service.ts";

export const contactRouter = Router();

contactRouter.post("/contact", async (req, res) => {
  const payload = contactMessageSchema.parse(req.body ?? {});

  // Honeypot: only automated clients fill a field that humans cannot see.
  // The response is deliberately indistinguishable from a normal one.
  if (payload.company && payload.company.trim().length > 0) {
    sendOk(res, { status: "received" }, { spam: true }, 202);
    return;
  }

  const ip = clientIp(req.headers["x-forwarded-for"]?.toString(), req.ip ?? "unknown");
  const userAgent = req.headers["user-agent"]?.toString().slice(0, 300);
  const requestFingerprint = fingerprintRequest(ip, userAgent ?? "");

  if (await isRateLimited(requestFingerprint)) {
    throw new HttpError(
      429,
      "rate_limited",
      "You have already sent several messages recently. Please try again in a little while.",
    );
  }

  const result = await submitContactMessage(payload, {
    requestFingerprint,
    ...(userAgent ? { userAgent } : {}),
  });

  sendOk(
    res,
    {
      status: "received",
      id: result.message.id,
      receivedAt: result.message.createdAt,
      notification: result.notification,
    },
    {
      ...(result.notificationDetail
        ? { notificationDetail: result.notificationDetail }
        : {}),
    },
    201,
  );
});

contactRouter.get("/contact", async (_req, res) => {
  const store = await resolveContentStore();
  const messages = await store.listContactMessages(1);
  // The public endpoint exposes a count only — never message contents.
  sendOk(res, { accepted: messages.length > 0 }, { messagesExposed: false });
});
