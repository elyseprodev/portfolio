/**
 * ELYSE DEV — typed environment configuration.
 *
 * Everything is optional: the API is designed to run with zero configuration
 * (local JSON store, email notifications off) and to upgrade automatically when
 * real values are supplied. No secret is ever logged.
 */
import "dotenv/config";

function list(value: string | undefined, fallback: string[]): string[] {
  const items = (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : fallback;
}

function flag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

const isProduction = process.env.NODE_ENV === "production";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction,
  port: Number(process.env.PORT ?? 4000),
  /**
   * Browser origins allowed to call the API directly. The Next.js client calls
   * the API from the server, so CORS mainly matters for local tooling and for
   * deployments where the browser talks to the API directly.
   */
  corsOrigins: list(process.env.CORS_ORIGIN, [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]),
  mongo: {
    uri: process.env.MONGODB_URI?.trim() ?? "",
    dbName: process.env.MONGODB_DB?.trim() || "elyse_dev",
  },
  github: {
    token: process.env.GITHUB_TOKEN?.trim() ?? "",
    username: process.env.GITHUB_USERNAME?.trim() || "ElissaElyse7",
    /** How long GitHub responses are cached in memory (ms). */
    cacheTtl: Number(process.env.GITHUB_CACHE_TTL_MS ?? 5 * 60 * 1000),
  },
  contact: {
    resendApiKey: process.env.RESEND_API_KEY?.trim() ?? "",
    notifyTo: process.env.CONTACT_NOTIFY_TO?.trim() ?? "",
    notifyFrom: process.env.CONTACT_NOTIFY_FROM?.trim() || "onboarding@resend.dev",
    /** Salt used for non-reversible request fingerprints. */
    fingerprintSalt:
      process.env.CONTACT_FINGERPRINT_SALT?.trim() ||
      "elyse-dev-portfolio-local-salt",
    maxPerWindow: Number(process.env.CONTACT_MAX_PER_WINDOW ?? 5),
    windowMs: Number(process.env.CONTACT_WINDOW_MS ?? 60 * 60 * 1000),
  },
  trustProxy: flag(process.env.TRUST_PROXY, !isProduction),
  logRequests: flag(process.env.LOG_REQUESTS, !isProduction),
} as const;

export type Env = typeof env;
