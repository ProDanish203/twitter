"use client"
import { navItems } from '@/utils/data'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from "next-auth/react";
import {fetcher} from "@/utils/fetcher";
import useSWR from "swr";

export const BottomBar = () => {

    const pathName = usePathname();
    const {data: session} = useSession()
    //@ts-ignore
    const {data, mutate, isLoading, error} = useSWR(`/api/users/${session?.user?.id}`, fetcher);

  return (
    
    <div className='fixed bottom-0 left-0 right-0 glassmorphism p-4 px-6 w-full'>
    {data && (
    <nav className='flex items-center justify-between gap-3 '>
      {navItems.map((link) =>{
        const isActive = (pathName.includes(link.title) && link.path.length > 1) || pathName === link.path;
          if(link.path === "/profile") link.path = `/profile/${data.user.id}`

          return (
            <Link href={link.path} key={link.path} className={`${isActive ? "text-primary": "text-text"}`}>
              <i className={`${link.icon}`}></i>
            </Link>
          )
        } )}
    </nav>
    )}
        
    </div>
  )
}
