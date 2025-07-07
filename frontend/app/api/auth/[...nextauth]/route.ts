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
              throw new Error(signupData.error || 'Signup failed');
            }
            
          } catch (error: any) {
            console.error("[AUTHORIZE_SIGNUP] Error:", error);
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

          const rawResponseText = await res.text();
          console.log("[AUTHORIZE] RAW RESPONSE FROM BACKEND:", rawResponseText);
          const data = JSON.parse(rawResponseText);

          if (!res.ok) {
            throw new Error(data.error || 'Login failed');
          }

          if (data && data.user) {
            const user = {
              id: data.user.ID,
              name: data.user.FullName,
              email: data.user.Email,
              role: data.user.Role,
            };
            console.log("[AUTHORIZE] Success, returning user:", JSON.stringify(user, null, 2));
            return user;
          }

          console.log("[AUTHORIZE] Failed, returning null");
          return null;

        } catch (error: any) {
          console.error("[AUTHORIZE_LOGIN] Error:", error);
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
      console.log("[JWT] Callback fired.");
      if (user) {
        console.log("[JWT] User object present. Persisting to token.");
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      console.log("[JWT] Returning Token:", JSON.stringify(token, null, 2));
      return token
    },
    async session({ session, token }) {
      console.log("[SESSION] Callback fired.");
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role as string;
        console.log("[SESSION] Session user updated from token.");
      }
      console.log("[SESSION] Returning Session:", JSON.stringify(session, null, 2));
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