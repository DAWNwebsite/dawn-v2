import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// =================================================================
// ============== A U T H E N T I C A T I O N   I S   O F F ==========
// =================================================================
// To re-enable authentication, comment out the simple middleware
// below and uncomment the full `withAuth` middleware logic.
// =================================================================

/**
 * Simple middleware to allow all requests to pass through for debugging.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next()
}


/*
// FULL AUTHENTICATION MIDDLEWARE (Currently disabled)

import { withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

export default withAuth(
  // Augment the request with the user's token
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Role-based access control can be handled here if needed
    // For example:
    // if (pathname.startsWith("/admin") && token?.role !== "admin") {
    //   return new NextResponse("You are not authorized!");
    // }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
*/


export const config = {
  // This matcher applies the middleware to all routes except for static assets and API routes.
  // When re-enabling authentication, you might want to make this more specific.
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
} 