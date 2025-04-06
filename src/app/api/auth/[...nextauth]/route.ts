import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          email: user.email,
          name: user.name,
          avatarUrl: user.image,
          authProvider: account?.provider,
        });
      }
      return true;
    },
    async session({ session }) {
      await dbConnect();
      const dbUser = await User.findOne({ email: session.user?.email });
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.authProvider = dbUser.authProvider;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
