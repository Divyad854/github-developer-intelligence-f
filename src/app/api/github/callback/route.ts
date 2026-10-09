// import { NextRequest, NextResponse } from "next/server";

// import { getSession } from "@/lib/auth";
// import { analyzeAndStore } from "@/lib/service";
// import { OAUTH_COOKIE, baseUrl, callbackUrl, exchangeCode, readPayload, revokeGrant } from "@/lib/oauth";

// export const dynamic = "force-dynamic";

// /**
//  * Step 2: GitHub sends the user back here after they signed in (email + verification code)
//  * and clicked "Authorize". The token is used ONCE, then the authorization is revoked.
//  */
// export async function GET(req: NextRequest) {
//   const base = baseUrl(req);

//   const done = (path: string) => {
//     const res = NextResponse.redirect(`${base}${path}`);
//     res.cookies.set(OAUTH_COOKIE, "", { path: "/", maxAge: 0 });
//     return res;
//   };
//   const fail = (message: string) => done(`/analyze?error=${encodeURIComponent(message)}`);

//   const sp = req.nextUrl.searchParams;
//   if (sp.get("error")) return fail("GitHub authorization was cancelled. Nothing was analyzed.");

//   const code = sp.get("code");
//   const state = sp.get("state");
//   const payload = readPayload<{ state: string; username: string; userId: string }>(
//     req.cookies.get(OAUTH_COOKIE)?.value
//   );
//   const session = await getSession();

//   if (!code || !state || !payload || payload.state !== state || !session || session.id !== payload.userId) {
//     return fail("The authorization session expired or is invalid. Please try again.");
//   }

//   let token: string;
//   try {
//     token = await exchangeCode(code, callbackUrl(req));
//   } catch (e) {
//     return fail(e instanceof Error ? e.message : "Could not complete GitHub authorization.");
//   }

//   try {
//     // Who actually authorized? It must be the username that was typed.
//     const meRes = await fetch("https://api.github.com/user", {
//       headers: {
//         Accept: "application/vnd.github+json",
//         "User-Agent": "github-developer-intelligence",
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     });
//     const me = await meRes.json().catch(() => ({}));
//     if (!meRes.ok || !me.login) return fail("Could not verify the GitHub account.");

//     if (String(me.login).toLowerCase() !== payload.username.toLowerCase()) {
//       return fail(`You authorized @${me.login}, but you entered @${payload.username}. Nothing was analyzed.`);
//     }

//     const report = await analyzeAndStore(me.login, session.id, true, "all", token);
//     return done(`/profile/${encodeURIComponent(me.login)}?report=${report.id}`);
//   } catch (e) {
//     console.error("OAuth analyze error:", e);
//     return fail(e instanceof Error ? e.message : "Analysis failed. Please try again.");
//   } finally {
//     // One authorization = one analysis. Always remove the access on GitHub.
//     await revokeGrant(token);
//   }
// }
import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { analyzeAndStore } from "@/lib/service";
import { OAUTH_COOKIE, baseUrl, callbackUrl, exchangeCode, readPayload, revokeGrant } from "@/lib/oauth";

export const dynamic = "force-dynamic";

/**
 * Step 2: GitHub sends the user back here after they signed in and clicked "Authorize".
 * The token is used ONCE, then the authorization is revoked.
 * Whichever GitHub account signs in (yours, or a friend's) is the one analyzed.
 */
export async function GET(req: NextRequest) {
  const base = baseUrl(req);

  const done = (path: string) => {
    const res = NextResponse.redirect(`${base}${path}`);
    res.cookies.set(OAUTH_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  };
  const fail = (message: string) => done(`/analyze?error=${encodeURIComponent(message)}`);

  const sp = req.nextUrl.searchParams;
  if (sp.get("error")) return fail("GitHub authorization was cancelled. Nothing was analyzed.");

  const code = sp.get("code");
  const state = sp.get("state");
  const payload = readPayload<{ state: string; username: string; userId: string }>(
    req.cookies.get(OAUTH_COOKIE)?.value
  );
  const session = await getSession();

  if (!code || !state || !payload || payload.state !== state || !session || session.id !== payload.userId) {
    return fail("The authorization session expired or is invalid. Please try again.");
  }

  let token: string;
  try {
    token = await exchangeCode(code, callbackUrl(req));
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Could not complete GitHub authorization.");
  }

  try {
    // Which GitHub account signed in and authorized?
    const meRes = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "github-developer-intelligence",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const me = await meRes.json().catch(() => ({}));
    if (!meRes.ok || !me.login) return fail("Could not verify the GitHub account.");

    // That account's own sign-in is its consent, so any account may be analyzed
    // (the report is saved in the logged-in app user's History).
    const report = await analyzeAndStore(me.login, session.id, true, "all", token);
    return done(`/profile/${encodeURIComponent(me.login)}?report=${report.id}`);
  } catch (e) {
    console.error("OAuth analyze error:", e);
    return fail(e instanceof Error ? e.message : "Analysis failed. Please try again.");
  } finally {
    // One authorization = one analysis. Always remove the access on GitHub.
    await revokeGrant(token);
  }
}