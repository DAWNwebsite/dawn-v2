import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

// Define the properties we want to add to the session and user objects
interface CustomUser {
  id: string
  role: string
  name?: string | null
  email?: string | null
  image?: string | null
}

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends DefaultUser {
    role?: string | null
    accessToken?: string | null
    refreshToken?: string | null
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: {
      id: string;
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null
    }
    accessToken?: string | null
    refreshToken?: string | null
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    id?: string | null
    role?: string | null
    accessToken?: string | null
    refreshToken?: string | null
  }
} 