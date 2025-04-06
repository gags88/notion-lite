'use client';

import LoginButton from '@/components/LoginButton';

export default function Home() {
  return (
    <main className='p-6'>
      <h1 className='text-2xl font-bold'>Notion Lite</h1>
      <LoginButton />
    </main>
  );
}
