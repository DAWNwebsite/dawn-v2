import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define public, protected, and auth routes
  const publicRoutes = ['/', '/about', '/contact', '/students', '/educators'];
  const protectedRoutes = ['/dashboard', '/profile', '/assessments', 'learning'];
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/parental-consent'];

  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/api/public');
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  // If the user has a token (is logged in)
  if (token) {
    // If they try to access an auth route (like signin), redirect to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // Otherwise, allow access to any other route
    return NextResponse.next();
  }

  // If the user does not have a token (is not logged in)
  if (!token) {
    // If they try to access a protected route, redirect to signin
    if (isProtectedRoute) {
      const loginUrl = new URL('/auth/signin', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Otherwise, allow access to public and auth routes
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/ (API routes, other than public ones)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth/session|api/public|_next/static|_next/image|favicon.ico).*)',
  ],
}; 