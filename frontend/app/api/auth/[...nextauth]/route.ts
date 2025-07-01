import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        age: { label: "Age", type: "number" },
        parentalConsent: { label: "Parental Consent", type: "checkbox" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // COPPA compliance check
        const age = parseInt(credentials.age || "0")
        if (age < 13 && !credentials.parentalConsent) {
          throw new Error("Parental consent required for users under 13")
        }

        // Mock user for development
        return {
          id: "mock-user-id",
          email: credentials.email,
          name: "Mock User",
          role: "student",
          age: age,
          hasParentalConsent: !!credentials.parentalConsent
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.age = user.age
        token.hasParentalConsent = user.hasParentalConsent
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.age = token.age as number
        session.user.hasParentalConsent = token.hasParentalConsent as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 