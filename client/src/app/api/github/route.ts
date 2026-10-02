/**
 * ELYSE DEV — GitHub activity proxy route.
 *
 * Used by the "Refresh activity" control on the GitHub page: the browser asks
 * this same-origin handler, which asks the API, which talks to GitHub (with the
 * optional server-side token). Rate limits and failures are passed through
 * verbatim so the UI can be honest about them.
 */
import { NextResponse } from "next/server";

import { apiGet } from "@/lib/api";
import type { GithubActivityPayload } from "@/lib/github";

export async function GET(request: Request): Promise<NextResponse> {
  const refresh = new URL(request.url).searchParams.has("refresh");

  const result = await apiGet<GithubActivityPayload>(
    `/api/github${refresh ? "?refresh=1" : ""}`,
    { revalidate: refresh ? 0 : 300, tags: ["github"] },
  );

  if (!result) {
    return NextResponse.json(
      {
        error: {
          code: "api_unreachable",
          message:
            "The activity API is not reachable right now. The curated repository list below still links to real repositories.",
        },
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ data: result.data, meta: result.meta });
}
