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
            // First, attempt to create the new user
            const signupRes = await fetch(`${apiBaseUrl}/auth/signup`, {
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

            const signupData = await signupRes.json();

            if (!signupRes.ok) {
              // If signup fails (e.g., user already exists), throw an error
              throw new Error(signupData.error || 'Signup failed');
            }
            
            // If signup is successful, immediately try to log the new user in
            // Fall through to the sign-in logic
            
          } catch (error: any) {
            // Re-throw the error to be caught by the frontend
            throw new Error(error.message);
          }
        }

        // --- SIGN IN (or fall-through from successful signup) ---
        try {
          const res = await fetch(`${apiBaseUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" }
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Login failed');
          }

          const data = await res.json();
          
          // The backend returns { user: { ID, FullName, Email, Role } }
          // We must map this to an object that NextAuth understands.
          if (data && data.user) {
            return {
              id: data.user.ID,
              name: data.user.FullName,
              email: data.user.Email,
              role: data.user.Role,
            };
          }

          return null;

        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      // The user object is only available on the first login.
      // Persist the user data to the token.
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      // The session object is what the client-side receives.
      // We are taking the data from the token and putting it into the session.
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
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