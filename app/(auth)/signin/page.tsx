"use client"
import Image from 'next/image';
// import React, { useEffect, useState } from 'react'
import { signIn, useSession, getProviders } from "next-auth/react";
import { redirect } from 'next/navigation';

const SignIn = () => {

  const {data: session} = useSession();
//   const [providers, setProviders] = useState(null)

//   useEffect(() => {
//     const configureProviders = async () => {
//       const res = await getProviders();
//       // @ts-ignore
//       setProviders(res);
//     }

//     configureProviders();
//   }, [])

  if(session?.user) redirect("/");

  
  return (
    <section className='min-h-screen w-full md:px-10 px-7'>
      
      <div className='flex max-md:flex-col gap-10 min-h-screen py-5'>
        <div className='md:flex-1 max-md:w-[150px] max-md:h-[150px] max-sm:w-[100px] max-sm:h-[100px] relative'>
          <Image src="/logo.svg" fill alt='logo'/>
        </div>

        <div className='md:flex-1 flex flex-col justify-center text-text'>
          
          <h2 className='text-text text-5xl font-bold mb-10 leading-tight'>Happening now</h2>

          <h5 className='text-text text-3xl font-bold mb-10'>Join today.</h5>

          <div>
          {/* {providers && 
          Object.values(providers).map((provider:any) => (
            <button type='button' 
            key={provider.name} 
            onClick={() => signIn(provider.id)}
            className='px-5 py-2 rounded-full font-bold flex gap-4 items-center justify-center bg-text text-bg'>
              <Image src="/google.svg" width={30} height={30} alt='google' className='object-cover'/>
              Continue with google
            </button>
          ))
          } */}

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

export default SignIn;