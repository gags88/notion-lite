import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { signInSchema } from '@/lib/zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: '',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error('Invalid credentials:', parsedCredentials.error.errors);
          return null;
        }
        const { email, password } = parsedCredentials.data;
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          throw new Error('Invalid email or password.');
        }
        if (user.authProvider && user.authProvider !== 'credentials') {
          throw new Error(`This email is linked with ${user.authProvider}. Please sign in using that method.`);
        }
        if (!user.password) {
          throw new Error('Invalid email or password.');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid email or password.');
        }
        return {
          id: user.id,
          name: user.name || user.email,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Github,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    // async authorized({ request: { nextUrl }, auth }) {
    //   const isLoggedIn = !!auth?.user;
    //   const { pathname } = nextUrl;
    //   // const role = auth?.user.role || 'user';
    //   if (pathname.startsWith('/auth/signin') && isLoggedIn) {
    //     return Response.redirect(new URL('/', nextUrl));
    //   }
    //   return !!auth;
    // },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'credentials') {
        return true;
      }
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name ?? profile?.name ?? '',
              avatarUrl: user.image ?? profile?.picture ?? null,
              authProvider: account?.provider, // 'github' or 'google'
              emailVerified: account?.provider === 'google' || account?.provider === 'github' ? new Date() : null,
              role: Role.USER,
            },
          });
        }
        return true;
      } catch (err) {
        console.error('Error syncing social login user:', err);
        return false;
      }
    },
    jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.id = user.id;
      }
      if (user?.role) {
        token.role = user.role;
      }
      if (trigger === 'update' && session?.user?.role) {
        token.role = session.user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id.toString();
      }
      if (token?.role) {
        session.user.role = token.role.toString();
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});
