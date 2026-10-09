// // import crypto from "crypto";
// // import type { NextRequest } from "next/server";

// // export const OAUTH_COOKIE = "gh_oauth";
// // const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
// // const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

// // const secret = () => process.env.JWT_SECRET || "dev-secret";

// // export function oauthConfig() {
// //   const id = process.env.GITHUB_CLIENT_ID;
// //   const secretKey = process.env.GITHUB_CLIENT_SECRET;
// //   if (!id || !secretKey) return null;
// //   return { id, secret: secretKey };
// // }

// // /** Public base URL of this app. */
// // export function baseUrl(req: NextRequest) {
// //   return (process.env.APP_URL || req.nextUrl.origin).replace(/\/$/, "");
// // }

// // /** Callback URL registered in the GitHub OAuth App. */
// // export function callbackUrl(req: NextRequest) {
// //   return process.env.GITHUB_CALLBACK_URL || `${baseUrl(req)}/api/github/callback`;
// // }

// // /* ---- signed, short-lived cookie that remembers state + typed username + app user ---- */
// // export function signPayload(data: Record<string, unknown>) {
// //   const body = Buffer.from(JSON.stringify({ ...data, exp: Date.now() + 10 * 60 * 1000 })).toString("base64url");
// //   const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
// //   return `${body}.${sig}`;
// // }

// // export function readPayload<T = Record<string, string>>(value?: string): T | null {
// //   if (!value) return null;
// //   const [body, sig] = value.split(".");
// //   if (!body || !sig) return null;
// //   const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
// //   const a = Buffer.from(sig);
// //   const b = Buffer.from(expected);
// //   if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
// //   try {
// //     const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
// //     if (!data.exp || data.exp < Date.now()) return null;
// //     return data as T;
// //   } catch {
// //     return null;
// //   }
// // }

// // export function authorizeUrl(opts: { clientId: string; redirectUri: string; state: string; username: string }) {
// //   const p = new URLSearchParams({
// //     client_id: opts.clientId,
// //     redirect_uri: opts.redirectUri,
// //     scope: "repo read:user",
// //     state: opts.state,
// //     login: opts.username, // pre-fills the GitHub sign-in with this account
// //     allow_signup: "false",
// //   });
// //   return `${GITHUB_AUTHORIZE}?${p.toString()}`;
// // }

// // export async function exchangeCode(code: string, redirectUri: string): Promise<string> {
// //   const cfg = oauthConfig();
// //   if (!cfg) throw new Error("GitHub OAuth is not configured");
// //   const res = await fetch(GITHUB_TOKEN_URL, {
// //     method: "POST",
// //     headers: { Accept: "application/json", "Content-Type": "application/json" },
// //     body: JSON.stringify({ client_id: cfg.id, client_secret: cfg.secret, code, redirect_uri: redirectUri }),
// //     cache: "no-store",
// //   });
// //   const data = await res.json().catch(() => ({}));
// //   if (!data.access_token) throw new Error(data.error_description || "GitHub did not return an access token");
// //   return data.access_token as string;
// // }

// // /**
// //  * Revoke the user's whole authorization (grant) for this app on GitHub.
// //  * After this the user must approve the app again on GitHub for the next analysis.
// //  */
// // export async function revokeGrant(token: string) {
// //   const cfg = oauthConfig();
// //   if (!cfg) return;
// //   try {
// //     const res = await fetch(`https://api.github.com/applications/${cfg.id}/grant`, {
// //       method: "DELETE",
// //       headers: {
// //         Accept: "application/vnd.github+json",
// //         "Content-Type": "application/json",
// //         "User-Agent": "github-developer-intelligence",
// //         Authorization: `Basic ${Buffer.from(`${cfg.id}:${cfg.secret}`).toString("base64")}`,
// //       },
// //       body: JSON.stringify({ access_token: token }),
// //       cache: "no-store",
// //     });
// //     if (res.status !== 204) console.error("GitHub grant revoke failed:", res.status);
// //   } catch (e) {
// //     console.error("GitHub grant revoke error:", e);
// //   }
// // }

// import crypto from "crypto";
// import type { NextRequest } from "next/server";

// export const OAUTH_COOKIE = "gh_oauth";
// const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
// const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

// const secret = () => process.env.JWT_SECRET || "dev-secret";

// export function oauthConfig() {
//   const id = process.env.GITHUB_CLIENT_ID;
//   const secretKey = process.env.GITHUB_CLIENT_SECRET;
//   if (!id || !secretKey) return null;
//   return { id, secret: secretKey };
// }

// const isLocalUrl = (u?: string) => !!u && /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/i.test(u);
// const isProd = () => process.env.NODE_ENV === "production";

// /** Public base URL of this app (works locally, on Vercel, and behind proxies). */
// export function baseUrl(req: NextRequest) {
//   const env = process.env.APP_URL?.trim();
//   // In production never trust a localhost value (usually copied from .env.example).
//   if (env && !(isProd() && isLocalUrl(env))) return env.replace(/\/$/, "");

//   // Vercel / reverse proxies put the real public host in these headers.
//   const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
//   if (host && !(isProd() && /^(localhost|127\.0\.0\.1)/i.test(host))) {
//     const proto = req.headers.get("x-forwarded-proto")?.split(",")[0] || (isProd() ? "https" : req.nextUrl.protocol.replace(":", ""));
//     return `${proto}://${host}`.replace(/\/$/, "");
//   }

//   if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
//   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
//   return req.nextUrl.origin.replace(/\/$/, "");
// }

// /** Callback URL registered in the GitHub OAuth App. */
// export function callbackUrl(req: NextRequest) {
//   const env = process.env.GITHUB_CALLBACK_URL?.trim();
//   // Only honor the env value if it is a full callback URL (ends with the callback path).
//   if (env && /\/api\/github\/callback\/?$/.test(env) && !(isProd() && isLocalUrl(env))) return env.replace(/\/$/, "");
//   return `${baseUrl(req)}/api/github/callback`;
// }

// /* ---- signed, short-lived cookie that remembers state + typed username + app user ---- */
// export function signPayload(data: Record<string, unknown>) {
//   const body = Buffer.from(JSON.stringify({ ...data, exp: Date.now() + 10 * 60 * 1000 })).toString("base64url");
//   const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
//   return `${body}.${sig}`;
// }

// export function readPayload<T = Record<string, string>>(value?: string): T | null {
//   if (!value) return null;
//   const [body, sig] = value.split(".");
//   if (!body || !sig) return null;
//   const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
//   const a = Buffer.from(sig);
//   const b = Buffer.from(expected);
//   if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
//   try {
//     const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
//     if (!data.exp || data.exp < Date.now()) return null;
//     return data as T;
//   } catch {
//     return null;
//   }
// }

// export function authorizeUrl(opts: { clientId: string; redirectUri: string; state: string; username: string }) {
//   const p = new URLSearchParams({
//     client_id: opts.clientId,
//     redirect_uri: opts.redirectUri,
//     scope: "repo read:user",
//     state: opts.state,
//     login: opts.username, // pre-fills the GitHub sign-in with this account
//     allow_signup: "false",
//   });
//   return `${GITHUB_AUTHORIZE}?${p.toString()}`;
// }

// export async function exchangeCode(code: string, redirectUri: string): Promise<string> {
//   const cfg = oauthConfig();
//   if (!cfg) throw new Error("GitHub OAuth is not configured");
//   const res = await fetch(GITHUB_TOKEN_URL, {
//     method: "POST",
//     headers: { Accept: "application/json", "Content-Type": "application/json" },
//     body: JSON.stringify({ client_id: cfg.id, client_secret: cfg.secret, code, redirect_uri: redirectUri }),
//     cache: "no-store",
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!data.access_token) throw new Error(data.error_description || "GitHub did not return an access token");
//   return data.access_token as string;
// }

// /**
//  * Revoke the user's whole authorization (grant) for this app on GitHub.
//  * After this the user must approve the app again on GitHub for the next analysis.
//  */
// export async function revokeGrant(token: string) {
//   const cfg = oauthConfig();
//   if (!cfg) return;
//   try {
//     const res = await fetch(`https://api.github.com/applications/${cfg.id}/grant`, {
//       method: "DELETE",
//       headers: {
//         Accept: "application/vnd.github+json",
//         "Content-Type": "application/json",
//         "User-Agent": "github-developer-intelligence",
//         Authorization: `Basic ${Buffer.from(`${cfg.id}:${cfg.secret}`).toString("base64")}`,
//       },
//       body: JSON.stringify({ access_token: token }),
//       cache: "no-store",
//     });
//     if (res.status !== 204) console.error("GitHub grant revoke failed:", res.status);
//   } catch (e) {
//     console.error("GitHub grant revoke error:", e);
//   }
// }


import crypto from "crypto";
import type { NextRequest } from "next/server";

export const OAUTH_COOKIE = "gh_oauth";
const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

const secret = () => process.env.JWT_SECRET || "dev-secret";

export function oauthConfig() {
  const id = process.env.GITHUB_CLIENT_ID;
  const secretKey = process.env.GITHUB_CLIENT_SECRET;
  if (!id || !secretKey) return null;
  return { id, secret: secretKey };
}

const isLocalUrl = (u?: string) => !!u && /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/i.test(u);
const isProd = () => process.env.NODE_ENV === "production";

/** Public base URL of this app (works locally, on Vercel, and behind proxies). */
export function baseUrl(req: NextRequest) {
  const env = process.env.APP_URL?.trim();
  // In production never trust a localhost value (usually copied from .env.example).
  if (env && !(isProd() && isLocalUrl(env))) return env.replace(/\/$/, "");

  // Vercel / reverse proxies put the real public host in these headers.
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host && !(isProd() && /^(localhost|127\.0\.0\.1)/i.test(host))) {
    const proto = req.headers.get("x-forwarded-proto")?.split(",")[0] || (isProd() ? "https" : req.nextUrl.protocol.replace(":", ""));
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return req.nextUrl.origin.replace(/\/$/, "");
}

/** Callback URL registered in the GitHub OAuth App. */
export function callbackUrl(req: NextRequest) {
  const env = process.env.GITHUB_CALLBACK_URL?.trim();
  // Only honor the env value if it is a full callback URL (ends with the callback path).
  if (env && /\/api\/github\/callback\/?$/.test(env) && !(isProd() && isLocalUrl(env))) return env.replace(/\/$/, "");
  return `${baseUrl(req)}/api/github/callback`;
}

/* ---- signed, short-lived cookie that remembers state + typed username + app user ---- */
export function signPayload(data: Record<string, unknown>) {
  const body = Buffer.from(JSON.stringify({ ...data, exp: Date.now() + 10 * 60 * 1000 })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readPayload<T = Record<string, string>>(value?: string): T | null {
  if (!value) return null;
  const [body, sig] = value.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Date.now()) return null;
    return data as T;
  } catch {
    return null;
  }
}

export function authorizeUrl(opts: { clientId: string; redirectUri: string; state: string; username?: string }) {
  const p = new URLSearchParams({
    client_id: opts.clientId,
    redirect_uri: opts.redirectUri,
    scope: "repo read:user",
    state: opts.state,
    allow_signup: "false",
    prompt: "select_account", // lets users with several GitHub accounts pick/switch the account
  });
  if (opts.username) p.set("login", opts.username); // pre-fills the GitHub sign-in with this account
  return `${GITHUB_AUTHORIZE}?${p.toString()}`;
}

export async function exchangeCode(code: string, redirectUri: string): Promise<string> {
  const cfg = oauthConfig();
  if (!cfg) throw new Error("GitHub OAuth is not configured");
  const res = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: cfg.id, client_secret: cfg.secret, code, redirect_uri: redirectUri }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) throw new Error(data.error_description || "GitHub did not return an access token");
  return data.access_token as string;
}

/**
 * Revoke the user's whole authorization (grant) for this app on GitHub.
 * After this the user must approve the app again on GitHub for the next analysis.
 */
export async function revokeGrant(token: string) {
  const cfg = oauthConfig();
  if (!cfg) return;
  try {
    const res = await fetch(`https://api.github.com/applications/${cfg.id}/grant`, {
      method: "DELETE",
      headers: {
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "github-developer-intelligence",
        Authorization: `Basic ${Buffer.from(`${cfg.id}:${cfg.secret}`).toString("base64")}`,
      },
      body: JSON.stringify({ access_token: token }),
      cache: "no-store",
    });
    if (res.status !== 204) console.error("GitHub grant revoke failed:", res.status);
  } catch (e) {
    console.error("GitHub grant revoke error:", e);
  }
}