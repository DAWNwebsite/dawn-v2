import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/profile', '/assessments', '/learning']
    
    // Admin routes
    const adminRoutes = ['/admin']
    
    // Teacher routes
    const teacherRoutes = ['/teacher']

    // Check if current path is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
    const isTeacherRoute = teacherRoutes.some(route => pathname.startsWith(route))

    // COPPA compliance check for users under 13
    if (token && isProtectedRoute) {
      const age = token.age as number
      const hasParentalConsent = token.hasParentalConsent as boolean
      
      if (age < 13 && !hasParentalConsent) {
        return NextResponse.redirect(new URL('/auth/parental-consent', req.url))
      }
    }

    // Role-based access control
    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (isTeacherRoute && !['teacher', 'admin'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to auth pages and public routes
        if (pathname.startsWith('/auth') || 
            pathname.startsWith('/api/auth') ||
            pathname === '/' ||
            pathname.startsWith('/about') ||
            pathname.startsWith('/contact') ||
            pathname.startsWith('/students') ||
            pathname.startsWith('/educators')) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(req) {
  const token = await getToken({ req, secret })
  const { pathname } = req.nextUrl

  // Allow requests for API authentication and static files
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/"
  ) {
    return NextResponse.next()
  }
  
  // Temporarily allow access to the dashboard for debugging
  if (pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Redirect to login if no token and trying to access a protected route
  if (!token && pathname !== "/auth/signin" && pathname !== "/auth/signup" && pathname !== "/auth/parental-consent") {
    const loginUrl = new URL("/auth/signin", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in, and tries to access login/signup, redirect to dashboard
  if (token && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // Temporarily remove dashboard from protected routes
    // '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*'
  ],
} 