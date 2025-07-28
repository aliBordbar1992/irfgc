import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "@/types";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { normalizeUsername } from "@/lib/normalization";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Normalize username for case-insensitive lookup
          const normalizedUsername = normalizeUsername(credentials.username);

          // Find user in database by normalized username
          const user = await prisma.user.findUnique({
            where: { usernameNormalized: normalizedUsername },
          });

          if (!user) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            username: user.username,
            email: user.email || undefined,
            name: user.name,
            role: user.role as UserRole,
            avatar: user.avatar || undefined,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string | undefined;
        session.user.name = token.name as string;
        session.user.role = token.role as UserRole;
        session.user.avatar = token.avatar as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email?: string;
      name: string;
      role: UserRole;
      avatar?: string;
    };
  }

  interface User {
    id: string;
    username: string;
    email?: string;
    name: string;
    role: UserRole;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email?: string;
    name: string;
    role: UserRole;
    avatar?: string;
  }
}
