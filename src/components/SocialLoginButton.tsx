'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SocialLoginButton() {
  const { data: session, status } = useSession();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  // 🛡️ Prevent mismatch by not rendering anything until client is fully mounted
  if (!hasMounted || status === 'loading') {
    return null;
  }
  if (session) {
    return (
      <>
        <p>{session.user?.name}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }
  return (
    <>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
    </>
  );
}
