

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PROTECTED = [
  "/dashboard",
  "/analyze",
  "/profile",
  "/repositories",
  "/compare",
  "/history",
  "/saved",
  "/settings",
  "/admin",
];

const AUTH_PAGES = [
  "/login",
  "/register",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  const session = token
    ? await verifyToken(token)
    : null;

  /* =====================================================
     PUBLIC HOME PAGE
     ===================================================== */

  if (pathname === "/") {
    return NextResponse.next();
  }

  /* =====================================================
     CHECK PROTECTED ROUTES
     ===================================================== */

  const isProtected = PROTECTED.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(path + "/")
  );

  /* =====================================================
     NOT LOGGED IN → LOGIN
     ===================================================== */

  if (isProtected && !session) {
    const url = req.nextUrl.clone();

    url.pathname = "/login";
    url.search = "";

    url.searchParams.set(
      "next",
      pathname
    );

    return NextResponse.redirect(url);
  }

  /* =====================================================
     ADMIN ACCESS
     ===================================================== */

  if (
    pathname.startsWith("/admin") &&
    session?.role !== "admin"
  ) {
    const url = req.nextUrl.clone();

    url.pathname = "/dashboard";
    url.search = "";

    return NextResponse.redirect(url);
  }

  /* =====================================================
     LOGGED-IN USER VISITS LOGIN / REGISTER
     ===================================================== */

  if (
    AUTH_PAGES.includes(pathname) &&
    session
  ) {
    const url = req.nextUrl.clone();

    url.pathname =
      session.role === "admin"
        ? "/admin/dashboard"
        : "/dashboard";

    url.search = "";

    return NextResponse.redirect(url);
  }

  /* =====================================================
     ALLOW REQUEST
     ===================================================== */

  const response = NextResponse.next();

  /*
     Never let the browser (or its back/forward cache) keep
     logged-in pages. Otherwise pressing Back after logging out
     and logging in as another user can show the previous account.
  */
  if (isProtected || AUTH_PAGES.includes(pathname)) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico).*)",
  ],
};