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
          const data = JSON.parse(rawResponseText);

          if (!res.ok) {
            throw new Error(data.error || 'Login failed');
          }
          
          if (data && data.user) {
            const user = {
              id: data.user.id,
              name: data.user.fullname,
              email: data.user.email,
              role: data.user.role,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
            return user;
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
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id || '';
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role || '';
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: false,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 