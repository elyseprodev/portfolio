/**
 * ELYSE DEV — contact proxy route.
 *
 * The browser posts here (same origin); this handler forwards the payload to the
 * Express API, which owns validation, rate limiting and persistence. The API URL
 * therefore never has to be reachable from the browser, and no secret or
 * service endpoint is exposed to client code.
 */
import { NextResponse } from "next/server";

import { apiPost } from "@/lib/api";

interface ContactResponse {
  status: "received";
  id: string;
  receivedAt: string;
  notification: "sent" | "not-configured" | "failed";
}

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "invalid_json",
          message: "The request body could not be read.",
        },
      },
      { status: 400 },
    );
  }

  const result = await apiPost<ContactResponse>("/api/contact", payload);

  if (result.ok) {
    return NextResponse.json(
      { data: result.data, meta: result.meta },
      { status: 201 },
    );
  }

  return NextResponse.json(
    {
      error: {
        code: result.code,
        message: result.message,
        ...(result.details !== undefined ? { details: result.details } : {}),
      },
    },
    { status: result.status },
  );
}
