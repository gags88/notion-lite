import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className='md:flex min-h-screen'>
      <div className='w-full md:w-1/2 flex items-center justify-center '>
        <div className='max-w-sm m-8'>
          <div className='text-black text-5xl md:text-15xl font-black'>403</div>
          <div className='w-16 h-1 bg-blue-dark my-3 md:my-6'></div>
          <p className='text-grey-darker text-2xl md:text-3xl font-light mb-8 leading-normal'>
            You don&apos;t have permission to view this page.
          </p>
          <Link
            href='/'
            className='bg-transparent text-grey-darkest font-bold uppercase tracking-wide py-3 px-6 border-2 border-grey-light hover:border-grey rounded-lg'
          >
            Go Home
          </Link>
        </div>
      </div>
      <div className='relative pb-full md:flex md:pb-0 md:min-h-screen w-full md:w-1/2'>
        <div className='absolute pin bg-cover bg-no-repeat md:bg-right lg:bg-center'></div>
      </div>
    </div>
  );
}
