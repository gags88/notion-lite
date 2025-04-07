import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      authProvider?: string | null;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    authProvider?: string | null;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
