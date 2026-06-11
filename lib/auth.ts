import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  // @ts-expect-error — @auth/prisma-adapter types differ slightly from next-auth v4
  adapter: PrismaAdapter(prisma),

  // Use JWT sessions so we can read them in middleware via getToken()
  session: { strategy: 'jwt' },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, `user` is available
      if (user) {
        token.id = user.id;
        // Fetch role from DB (not present on the default user object)
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.role = dbUser?.role ?? Role.USER;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  events: {
    async createUser({ user }) {
      // Automatically make the pre-configured admin email an ADMIN
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail && user.email === adminEmail) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: Role.ADMIN },
        });
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
