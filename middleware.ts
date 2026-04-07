import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Matches any admin route for any locale: /en/admin, /uz/admin/locations, etc.
const ADMIN_ROUTE = /^\/(?:en|uz|ru)\/admin/;

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (ADMIN_ROUTE.test(pathname)) {
    // Read the JWT from the session cookie — no database query needed.
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Derive locale from the URL so we redirect to the right login page.
    const locale = pathname.match(/^\/(en|uz|ru)/)?.[1] ?? "en";

    if (!token) {
      // Not signed in — redirect to login, preserving the intended destination.
      const loginUrl = new URL(`/${locale}/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "admin") {
      // Signed in but not an admin — redirect to the public homepage.
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    // Admin confirmed — fall through to intlMiddleware for cookie/header setup.
  }

  return intlMiddleware(req);
}

export const config = {
  // Run on all routes except static files, Next.js internals, and API routes.
  // API routes (/api/*) are excluded so NextAuth callbacks work without auth checks.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/"],
};
