import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      authProvider?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    authProvider?: string | null;
  }
}
