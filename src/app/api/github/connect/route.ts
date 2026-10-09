import crypto from "crypto";
import { NextResponse } from "next/server";

import { extractUsername } from "@/lib/username";
import { HttpError, handle, requireSession } from "@/lib/http";
import { OAUTH_COOKIE, authorizeUrl, callbackUrl, oauthConfig, signPayload } from "@/lib/oauth";

/** Step 1: the user typed a GitHub username -> return the GitHub authorize URL. */
export const POST = handle(async (req) => {
  const session = await requireSession();
  const cfg = oauthConfig();

  if (!cfg) {
    throw new HttpError(500, "GitHub login is not configured. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.");
  }

  const body = await req.json().catch(() => ({}));
  const username = extractUsername(String(body.username ?? ""));
  if (!username) throw new HttpError(400, "Enter a valid GitHub username.");

  const state = crypto.randomBytes(16).toString("hex");
  const url = authorizeUrl({
    clientId: cfg.id,
    redirectUri: callbackUrl(req),
    state,
    username,
  });

  const res = NextResponse.json({ url });
  res.cookies.set(OAUTH_COOKIE, signPayload({ state, username, userId: session.id }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return res;
});
