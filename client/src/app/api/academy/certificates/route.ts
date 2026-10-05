/**
 * ELYSE DEV — certificate issuance proxy.
 *
 * The browser posts here on the same origin; this handler forwards to the
 * Express API, which validates the payload, applies its rate limit and writes
 * the certificate through the content store. Keeping the proxy means the API
 * host never has to be reachable from a visitor's browser.
 */
import { NextResponse } from "next/server";

import { apiPost } from "@/lib/api";

interface IssuedCertificate {
  code: string;
  studentName: string;
  courseSlug: string;
  courseTitle: string;
  kind: "completion" | "sample";
  issuedAt: string;
  hours: number;
  moduleCount: number;
}

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "The request body could not be read." } },
      { status: 400 },
    );
  }

  const result = await apiPost<IssuedCertificate>("/api/certificates", payload);

  if (result.ok) {
    return NextResponse.json({ data: result.data, meta: result.meta }, { status: 201 });
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
