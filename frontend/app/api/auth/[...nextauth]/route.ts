import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
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
        parentalConsent: { label: "Parental Consent", type: "checkbox" },
        action: { label: "Action", type: "text" },
        name: { label: "Full Name", type: "text" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }
        
        const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080';

        // --- SIGN UP ---
        if (credentials.action === 'signup') {
          try {
            const age = parseInt(credentials.age || "0");
            if (age < 13 && !credentials.parentalConsent) {
              throw new Error("Parental consent is required for users under 13.");
            }
            
            const res = await fetch(`${apiBaseUrl}/auth/signup`, {
              method: 'POST',
              body: JSON.stringify({
                fullname: credentials.name,
                email: credentials.email,
                password: credentials.password,
                role: credentials.role,
                country: "Not Specified",
              }),
              headers: { "Content-Type": "application/json" }
            });
            
            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error || 'Signup failed');
            }
            // On successful signup, we don't log the user in automatically.
            // Return null and let the user log in on the sign-in page.
            return null;

          } catch (error: any) {
            // Re-throw the error to be caught by the frontend
            throw new Error(error.message);
          }
        }

        // --- SIGN IN ---
        if (credentials.action === 'signin') {
          try {
            const res = await fetch(`${apiBaseUrl}/auth/login`, {
              method: 'POST',
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error || 'Login failed');
            }

            // If login is successful, the backend returns user data and tokens.
            // We pass this back to NextAuth to create the session.
            return data.user;

          } catch (error: any) {
            throw new Error(error.message);
          }
        }
        
        return null; // Default to null if no action matches
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
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 