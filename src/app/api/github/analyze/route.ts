import { NextResponse } from "next/server";

import { extractUsername } from "@/lib/github";
import { HttpError, handle, requireSession } from "@/lib/http";
import { analyzeAndStore } from "@/lib/service";

/**
 * PUBLIC analysis only.
 * Public + private analysis never goes through this route: it needs a one-time
 * GitHub authorization (see /api/github/connect and /api/github/callback).
 */
export const POST = handle(async (req) => {
  const session = await requireSession();
  const body = await req.json().catch(() => ({}));

  const username = extractUsername(String(body.url ?? ""));

  if (!username) {
    throw new HttpError(
      400,
      "Enter a valid GitHub profile URL, e.g. https://github.com/username"
    );
  }

  const report = await analyzeAndStore(
    username,
    session.id,
    Boolean(body.refresh),
    "public"
  );

  return NextResponse.json(report);
});
