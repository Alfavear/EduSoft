import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

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

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: {
            studentProfile: true,
            teacherProfile: true
          }
        });

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          const name = user.teacherProfile 
            ? `${user.teacherProfile.firstName} ${user.teacherProfile.lastName}` 
            : user.studentProfile 
            ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`
            : user.username;

          return { 
            id: user.id, 
            name: name, 
            email: user.username, 
            role: user.role 
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).username = session.user.email;
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
