/**
 * ELYSE DEV — health route.
 *
 *   GET /api/health  → liveness, active database backend and degraded state
 *
 * This is the endpoint that makes the deployment honest: if MONGODB_URI was
 * configured but unreachable, `degraded` is true and `details` explains why.
 */
import { Router } from "express";
import { getStoreMeta, resolveContentStore } from "@elyse/database";
import { env } from "../config/env.ts";
import { sendOk } from "../lib/api-response.ts";

export const healthRouter = Router();

const startedAt = Date.now();

healthRouter.get("/health", async (_req, res) => {
  // Touch the store so the first request reports the real backend.
  await resolveContentStore();
  const meta = getStoreMeta();

  sendOk(
    res,
    {
      status: meta.degraded ? "degraded" : "ok",
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
      database: meta,
      integrations: {
        emailNotifications: Boolean(
          env.contact.resendApiKey && env.contact.notifyTo,
        ),
        githubToken: Boolean(env.github.token),
      },
    },
    {},
    meta.degraded ? 200 : 200,
  );
});
