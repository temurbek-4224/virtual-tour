// ─────────────────────────────────────────────────────────────────────────────
// NextAuth Configuration
// Strategy: JWT (stateless cookies) + Google OAuth + Prisma adapter.
// JWT is used so middleware can check auth without a database round-trip.
// The Prisma adapter still writes User and Account records to Neon on sign-in.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  // JWT strategy — sessions live in a signed cookie, not in the DB.
  // This allows the middleware to verify auth without any DB query.
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // After sign-in: fetch the user's role from DB and embed it in the JWT.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Fetch role from database (user object from adapter has it)
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "user";
      }
      return token;
    },

    // On every request: expose role and id from the JWT into the session.
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    // Override the default /api/auth/signin page with our custom login page.
    // The [locale] prefix is handled by next-intl — we default to /en/login
    // and the middleware preserves the original URL.
    signIn: "/en/login",
    error: "/en/login",
  },
};
