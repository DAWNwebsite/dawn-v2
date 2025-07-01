import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

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

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|public).*)',
  ]
} 