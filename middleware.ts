import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Detect admin routes (e.g. /en/admin, /ru/admin, /uz/admin)
  const isAdminRoute = /^\/(?:en|ru|uz)\/admin/.test(pathname);

  if (isAdminRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Not logged in — redirect to home with locale
      const locale = pathname.split('/')[1] || routing.defaultLocale;
      const signInUrl = new URL(`/${locale}`, request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (token.role !== 'ADMIN') {
      // Not an admin — redirect to home
      const locale = pathname.split('/')[1] || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all paths except API routes, Next.js internals, and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
