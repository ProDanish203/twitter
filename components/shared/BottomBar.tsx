"use client"
import { navItems } from '@/utils/data'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from "next-auth/react";
import { getUser } from '@/lib/actions/User';
import { useEffect, useState } from 'react';
import loading from '@/app/(root)/loading';
import { Loader } from '../helpers';


export const BottomBar = () => {

    const pathName = usePathname();
    const {data: session, status} = useSession();

    if(status !== "loading" && status === "unauthenticated") return (
      <>
      <div className='fixed bottom-0 left-0 right-0 glassmorphism flex items-center justify-around gap-2 p-4 px-6 w-full'>
        <Link href="/signin" className='text-text text-lg'>Login</Link>
        <Link href="/signup" className='text-text text-lg'>Signup</Link>
      </div>
      </>
    ) 
    
    if(status == "loading") return (
      <>
      <div className='fixed bottom-0 left-0 right-0 glassmorphism flex items-center justify-around gap-2 p-4 px-6 w-full'>
        <Loader dark={false}/>
      </div>
      </>
    );

  return (
    
    <div className='fixed bottom-0 left-0 right-0 glassmorphism p-4 px-6 w-full'>
    {session && session.user && (
    <nav className='flex items-center justify-between gap-3 '>
      {navItems.map((link:any, i:number) =>{
        const isActive = (pathName.includes(link.title) && link.path.length > 1) || pathName === link.path;
        // @ts-ignore
          if(link.path === "/profile") link.path = `/profile/${session.user._id}`
          
          return(
            <Link href={link.path} key={i} className={`${isActive ? "text-primary": "text-text"}`}>
            <i className={`${link.icon} text-xl`}></i>
          </Link>
          )
        } )}
    </nav>
      )}
        
    </div>
  )
}
