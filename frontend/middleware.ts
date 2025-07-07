import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(`[MIDDLEWARE] Pathname: ${pathname}`);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (token) {
    console.log('[MIDDLEWARE] Token found.');
  } else {
    console.log('[MIDDLEWARE] No token found.');
  }

  // Define public, protected, and auth routes
  const publicRoutes = ['/', '/about', '/contact', '/students', '/educators'];
  const protectedRoutes = ['/dashboard', '/profile', '/assessments', '/learning'];
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/parental-consent'];

  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/api/public');
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  console.log(`[MIDDLEWARE] Is protected route? ${isProtectedRoute}`);

  const isAuthRoute = authRoutes.includes(pathname);
  console.log(`[MIDDLEWARE] Is auth route? ${isAuthRoute}`);

  // If the user has a token (is logged in)
  if (token) {
    if (isAuthRoute) {
      console.log('[MIDDLEWARE] User with token on auth route. Redirecting to dashboard.');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    console.log('[MIDDLEWARE] User has token. Allowing access.');
    return NextResponse.next();
  }

  // If the user does not have a token (is not logged in)
  if (!token) {
    if (isProtectedRoute) {
      console.log('[MIDDLEWARE] User without token on protected route. Redirecting to signin.');
      const loginUrl = new URL('/auth/signin', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  console.log('[MIDDLEWARE] No specific rule matched. Allowing access by default.');
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