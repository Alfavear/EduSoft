import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Mock users
        if (credentials.username === "admin.general" && credentials.password === "admin123") {
          return { id: "1", name: "Administrador", email: "admin.general", role: "ADMIN" };
        }
        if (credentials.username === "juan.perez" && credentials.password === "profe123") {
          return { id: "2", name: "Docente Juan", email: "juan.perez", role: "TEACHER" };
        }
        if (credentials.username === "maria.gomez" && credentials.password === "alumno123") {
          return { id: "3", name: "Estudiante Maria", email: "maria.gomez", role: "STUDENT" };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).username = session.user.email; // we used email to store username in NextAuth default types
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "edusoft-super-secret-key"
};
