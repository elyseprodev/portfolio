/**
 * ELYSE DEV — error handling & request logging middleware.
 */
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.ts";
import { sendError } from "../lib/api-response.ts";

/** Our own HTTP error type, so routes can `throw new HttpError(404, …)`. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(
    res,
    404,
    "not_found",
    `No API route matches ${req.method} ${req.originalUrl}.`,
  );
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    sendError(
      res,
      422,
      "validation_failed",
      "Some fields need your attention.",
      error.issues.map((issue) => ({
        field: issue.path.join(".") || "form",
        message: issue.message,
      })),
    );
    return;
  }

  if (error instanceof HttpError) {
    sendError(res, error.status, error.code, error.message, error.details);
    return;
  }

  const message =
    error instanceof Error ? error.message : "Unexpected server error.";
  console.error("[server] unhandled error:", message);

  sendError(
    res,
    500,
    "internal_error",
    env.isProduction
      ? "Something went wrong on the server. Please try again."
      : message,
  );
};

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!env.logRequests) {
    next();
    return;
  }

  const startedAt = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    console.info(
      `[api] ${req.method} ${req.originalUrl} → ${res.statusCode} (${durationMs.toFixed(1)}ms)`,
    );
  });
  next();
}
