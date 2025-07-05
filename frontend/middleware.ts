import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// =================================================================
// ============== A U T H E N T I C A T I O N   I S   O N ===========
// =================================================================

/**
 * Simple middleware to allow all requests to pass through for debugging. (Currently disabled)
 *
export function middleware(request: NextRequest) {
  return NextResponse.next()
}
*/


// FULL AUTHENTICATION MIDDLEWARE (Currently enabled)

import { withAuth } from "next-auth/middleware"

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


export const config = {
  // This matcher applies the middleware to all routes except for static assets and API routes.
  // When re-enabling authentication, you might want to make this more specific.
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
} 