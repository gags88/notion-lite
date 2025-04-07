import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { signInSchema } from './lib/zod';
// import { db } from './lib/db';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { Adapter } from 'next-auth/adapters';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: '',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials) {
        let user = null;
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error('Invalid credentials:', parsedCredentials.error.errors);
          return null;
        }
        user = {
          id: '1',
          name: 'Gagandeep Sharma',
          email: 'gagan@gagan.com',
          role: 'admin',
        };
        if (!user) {
          console.log('Invalid credentials');
          return null;
        }
        return user;
      },
    }),
    Github,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // adapter: PrismaAdapter(db) as Adapter,
  // session: { strategy: 'jwt' },
  callbacks: {
    async authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      // const role = auth?.user.role || 'user';
      if (pathname.startsWith('/auth/signin') && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return !!auth;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});
