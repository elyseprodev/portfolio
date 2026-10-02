/**
 * ELYSE DEV — server-side API bridge.
 *
 * All calls to the Express API happen on the server (React Server Components),
 * which means:
 *   • the browser never needs to know the API URL (no CORS, no localhost calls)
 *   • a dead or slow API degrades to the local typed content instead of an error
 *
 * `API_URL` is a server-only variable. Set it on the hosting platform when the
 * API lives on a different host; locally it defaults to the dev API port.
 */
import type { ServiceMeta } from "@elyse/database/types";

export type DataSource = "api" | "local";

export interface ApiEnvelope<T> {
  data: T;
  meta: Record<string, unknown> & { backend?: ServiceMeta };
}

const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:4000"
).replace(/\/$/, "");

/** How long the client waits for the API before falling back. */
const REQUEST_TIMEOUT_MS = Number(process.env.API_REQUEST_TIMEOUT_MS ?? 2500);

export interface ApiResult<T> {
  data: T;
  meta: ApiEnvelope<T>["meta"];
}

/**
 * GET a JSON envelope from the API. Returns `null` on any failure so callers
 * can fall back — this is a portfolio, not a payment system: it must render.
 */
export async function apiGet<T>(
  path: string,
  options: { revalidate?: number; tags?: string[] } = {},
): Promise<ApiResult<T> | null> {
  // Never call the API from the browser: the browser cannot reach the API
  // host in most deployments, and everything is rendered on the server.
  if (typeof window !== "undefined") return null;

  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: {
        revalidate: options.revalidate ?? 300,
        ...(options.tags ? { tags: options.tags } : {}),
      },
    });

    if (!response.ok) {
      if (response.status !== 404) {
        console.warn(`[api] ${path} responded with ${response.status}`);
      }
      return null;
    }

    const payload = (await response.json()) as ApiEnvelope<T>;
    if (!payload || typeof payload !== "object" || !("data" in payload)) {
      console.warn(`[api] ${path} returned an unexpected envelope`);
      return null;
    }

    return { data: payload.data, meta: payload.meta ?? {} };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    console.info(
      `[api] ${path} unavailable (${reason}) — using local content fallback.`,
    );
    return null;
  }
}

/** Auth-free POST used by the contact route handler (server → server). */
export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<{ ok: true; data: T; meta: Record<string, unknown> } | {
  ok: false;
  status: number;
  code: string;
  message: string;
  details?: unknown;
}> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | (ApiEnvelope<T> & { error?: never })
      | { error: { code: string; message: string; details?: unknown } }
      | null;

    if (response.ok && payload && "data" in payload) {
      return { ok: true, data: payload.data, meta: payload.meta ?? {} };
    }

    const errorPayload =
      payload && "error" in payload && payload.error
        ? payload.error
        : {
            code: "upstream_error",
            message: "The server could not handle that request.",
          };

    return {
      ok: false,
      status: response.status,
      code: errorPayload.code,
      message: errorPayload.message,
      ...("details" in errorPayload && errorPayload.details !== undefined
        ? { details: errorPayload.details }
        : {}),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    return {
      ok: false,
      status: 503,
      code: "api_unreachable",
      message: `The message service is not reachable right now (${reason}).`,
    };
  }
}
