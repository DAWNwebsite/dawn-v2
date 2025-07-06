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
  // Extend the built-in session object
  interface Session extends DefaultSession {
    user: CustomUser & DefaultSession["user"]
  }

  // Extend the built-in user object
  interface User extends DefaultUser, CustomUser {}
}

declare module "next-auth/jwt" {
  // Extend the built-in JWT object
  interface JWT extends DefaultJWT {
    id: string
    role: string
  }
} 