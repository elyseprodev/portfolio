/**
 * ELYSE DEV — GitHub activity route.
 *
 *   GET /api/github           → profile, repositories and language counts
 *   GET /api/github?refresh=1 → bypass the in-memory cache
 */
import { Router } from "express";
import { sendOk } from "../lib/api-response.ts";
import { getGithubActivity } from "../services/github.service.ts";
import { env } from "../config/env.ts";

export const githubRouter = Router();

githubRouter.get("/github", async (req, res) => {
  if (req.query.refresh !== undefined) {
    // A refresh flag simply short-circuits the cache by fetching fresh data
    // from GitHub; failures still degrade gracefully.
    const activity = await getGithubActivity(env.github.username);
    sendOk(res, activity, {
      tokenConfigured: Boolean(env.github.token),
      note: env.github.token
        ? undefined
        : "No GITHUB_TOKEN configured — GitHub's lower unauthenticated rate limit applies.",
    });
    return;
  }

  const activity = await getGithubActivity();
  sendOk(res, activity, { tokenConfigured: Boolean(env.github.token) });
});
