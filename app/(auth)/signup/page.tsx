"use client"
import Image from 'next/image';
import { signIn, useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

const Signup = () => {
  return (
    <section className='min-h-screen w-full md:px-10 px-7'>
      
      <div className='flex max-md:flex-col gap-10 min-h-screen py-5'>
        <div className='md:flex-1 flex items-center justify-center'>
          <Image src="/logo.svg" width={300} height={300} alt='logo'
          className='object-cover w-52 h-52 md:w-[400px] md:h-[400px]'
          />
        </div>

        <div className='md:flex-1 flex flex-col justify-center text-text'>
          
          <h2 className='text-text text-5xl font-bold mb-10 leading-tight'>Happening now</h2>

          <h5 className='text-text text-3xl font-bold mb-10'>Join today.</h5>

          <div>
            <button type='button'  
            onClick={() => signIn("google")}
            className='px-5 py-2 rounded-full font-bold flex gap-4 items-center justify-center bg-text text-bg'>
              <Image src="/google.svg" width={30} height={30} alt='google' className='object-cover'/>
              Continue with google
            </button>
          </div>

        </div>
      </div>

    </section>
  )
}

export default Signup