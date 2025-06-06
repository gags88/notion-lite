import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import { handleSignOut } from '@/app/actions/authActions';

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className='flex justify-between items-center py-3 px-4 bg-white shadow-md'>
      <Link href='/' className='text-xl font-bold'>
        Notion Lite
      </Link>
      {!session ? (
        <div className='flex'>
          <Link href='/auth/signin' className='mr-2'>
            <Button variant='default'>Sign In</Button>
          </Link>
          <Link href='/auth/register'>
            <Button variant='ghost'>Register</Button>
          </Link>
        </div>
      ) : (
        <form action={handleSignOut}>
          <Button variant='default' type='submit'>
            Sign Out
          </Button>
        </form>
      )}
    </nav>
  );
}
