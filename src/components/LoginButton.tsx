'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Fragment } from 'react';

export default function LoginButton() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return null;
  }
  if (session) {
    return (
      <Fragment>
        <p>{session.user?.name}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
    </Fragment>
  );
}
