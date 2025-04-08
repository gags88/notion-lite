import { auth } from '@/auth';
import { type NextRequest } from 'next/server';
import { type Session } from 'next-auth';

type NextAuthRequest = NextRequest & {
  auth: Session | null;
};

const prohibitedPagesAfterSignIn = ['/auth/signin', '/auth/register'];
const apiAuthRoutePrefix = '/api/auth';
const publicRoutes: string[] = ['/', '/about', ...prohibitedPagesAfterSignIn];
const DEFAULT_LOGIN_REDIRECT = '/';

// Middleware function wrapped with NextAuth
export default auth((req: NextAuthRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthRoutePrefix);
  if (isApiAuthRoute || isPublicRoute) {
    return;
  }
  if (prohibitedPagesAfterSignIn.includes(nextUrl.pathname) && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/signin', nextUrl));
  }
  return;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)'],
};
