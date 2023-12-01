"use client"
import { navItems } from '@/utils/data'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from "next-auth/react";
import { getUser } from '@/lib/actions/User';
import { useEffect, useState } from 'react';


export const BottomBar = () => {

    const pathName = usePathname();
    const {data: session} = useSession();
    const [user, setUser] = useState()

    const getData = async () => {
      //@ts-ignore
      const {data, success} = await getUser(session?.user.id);
      setUser(data);
    }

    useEffect(() => {
      getData();
    }, [session])

  return (
    
    <div className='fixed bottom-0 left-0 right-0 glassmorphism p-4 px-6 w-full'>
    {user && (
    <nav className='flex items-center justify-between gap-3 '>
      {navItems.map((link) =>{
        const isActive = (pathName.includes(link.title) && link.path.length > 1) || pathName === link.path;
        // @ts-ignore
          if(link.path === "/profile") link.path = `/profile/${user?._id}`
          
          return(
          <>
            <Link href={link.path} key={link.path} className={`${isActive ? "text-primary": "text-text"}`}>
            <i className={`${link.icon} text-xl`}></i>
          </Link>
          </>
          )
        } )}
    </nav>
      )}
        
    </div>
  )
}
