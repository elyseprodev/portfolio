/**
 * ELYSE DEV — Express application factory.
 *
 * Exported separately from the HTTP listener so tests can boot the real stack
 * on an ephemeral port without touching the process lifecycle.
 */
import express from "express";
import type { Express } from "express";
import cors from "cors";
import { env } from "./config/env.ts";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from "./middleware/error-handler.ts";
import { academyRouter } from "./routes/academy.routes.ts";
import { contactRouter } from "./routes/contact.routes.ts";
import { contentRouter } from "./routes/content.routes.ts";
import { githubRouter } from "./routes/github.routes.ts";
import { healthRouter } from "./routes/health.routes.ts";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  if (env.trustProxy) app.set("trust proxy", 1);

  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin / server-to-server requests have no Origin header.
        if (!origin) return callback(null, true);
        if (env.corsOrigins.includes(origin)) return callback(null, true);
        if (!env.isProduction && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      methods: ["GET", "POST", "OPTIONS"],
      maxAge: 86400,
    }),
  );

  app.use(express.json({ limit: "64kb" }));
  app.use(requestLogger);

  app.get("/", (_req, res) => {
    res.json({
      name: "ELYSE DEV API",
      owner: "Elyse Dev",
      description:
        "Portfolio content, academy courses, certificates, contact messages and GitHub activity for elyse.dev.",
      routes: [
        "GET /api/health",
        "GET /api/content",
        "GET /api/profile",
        "GET /api/projects",
        "GET /api/projects/:slug",
        "GET /api/skills",
        "GET /api/experience",
        "GET /api/courses",
        "GET /api/courses/:slug",
        "GET /api/certificates/:code",
        "POST /api/certificates",
        "GET /api/github",
        "POST /api/contact",
      ],
    });
  });

  app.use("/api", healthRouter);
  app.use("/api", contentRouter);
  app.use("/api", academyRouter);
  app.use("/api", githubRouter);
  app.use("/api", contactRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
