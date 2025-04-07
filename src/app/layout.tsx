import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import { auth } from '@/auth';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notion Lite',
  description: 'Advanced notes app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang='en'>
      <body className={inter.className}>
        <SessionProviderWrapper session={session}>
          <>
            <Navbar />
            {children}
          </>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
