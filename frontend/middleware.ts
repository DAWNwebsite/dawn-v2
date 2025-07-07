import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define public, protected, and auth routes
  const publicRoutes = ['/', '/about', '/contact', '/students', '/educators'];
  const protectedRoutes = ['/dashboard', '/profile', '/assessments', '/learning'];
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/parental-consent'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  // If the user has a token (is logged in)
  if (token) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // If the user does not have a token (is not logged in)
  if (!token) {
    if (isProtectedRoute) {
      const loginUrl = new URL('/auth/signin', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes - CRITICAL: Don't interfere with auth flow)
     * - api/public (public API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     */
    '/((?!api/auth|api/public|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 