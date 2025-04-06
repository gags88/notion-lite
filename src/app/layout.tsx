import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notion Lite',
  description: 'Advanced notes app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang='en'>
      <body className={inter.className}>
        <SessionProviderWrapper session={session}>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
