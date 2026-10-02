/**
 * ELYSE DEV — consistent API envelopes.
 *
 * Every response is either:
 *   { "data": …, "meta": { … } }                    → success
 *   { "error": { "code", "message", "details?": … } } → failure
 */
import type { Response } from "express";

export interface SuccessMeta {
  [key: string]: unknown;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function sendOk<T>(
  res: Response,
  data: T,
  meta: SuccessMeta = {},
  status = 200,
): void {
  res.status(status).json({ data, meta });
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
): void {
  const body: ApiErrorBody = { error: { code, message } };
  if (details !== undefined) body.error.details = details;
  res.status(status).json(body);
}
