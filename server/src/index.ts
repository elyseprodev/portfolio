/**
 * ELYSE DEV — API entry point.
 */
import { createApp } from "./app.ts";
import { env } from "./config/env.ts";
import { getStoreMeta, resolveContentStore } from "@elyse/database";

async function main(): Promise<void> {
  // Resolve the datastore before accepting traffic so the logs state clearly
  // which backend is serving content.
  await resolveContentStore();
  const meta = getStoreMeta();

  console.info(
    `[server] database backend: ${meta.backend}${meta.degraded ? " (DEGRADED)" : ""} — ${meta.details}`,
  );
  if (!env.contact.resendApiKey || !env.contact.notifyTo) {
    console.info(
      "[server] contact e-mail notifications: disabled (messages are still stored)",
    );
  }

  const app = createApp();
  const server = app.listen(env.port, "0.0.0.0", () => {
    console.info(
      `[server] ELYSE DEV API listening on http://0.0.0.0:${env.port} (${env.nodeEnv})`,
    );
  });

  const shutdown = (signal: string) => {
    console.info(`[server] ${signal} received — shutting down`);
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((error: unknown) => {
  console.error(
    "[server] failed to start:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
