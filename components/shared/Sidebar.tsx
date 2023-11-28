"use client"
import Image from 'next/image';
import Link from 'next/link';
import {fetcher} from "@/utils/fetcher";
import useSWR from "swr";
import { navItems } from '@/utils/data';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/actions/User';

export const Sidebar = () => {

  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState()
  const {data: session} = useSession();

  const getData = async () => {
    // @ts-ignore
    const {data, success} = getUser(session?.user.id);
    if(success) setUser(data);
  }

  useEffect(() => {
    getData();
  }, [])

  const handleLogout = async () => {
    await signOut();
    router.push("/signin");
  }

  return (
    <div className="h-screen lg:min-w-[200px] max-w-[250px] lg:w-full w-fit sticky lg:pr-7 pl-3 py-7 top-0 left-0 border-r-[1px] border-neutral-800 flex flex-col gap-2 justify-between">

        <div className="flex flex-col gap-2 justify-between lg:items-start items-center w-full">

            <Link href="/" className="relative max-md:w-10 max-md:h-10 w-14 h-14 object-cover">
                <Image src="logo.svg" fill alt="X" className="object-cover"/>
            </Link> 
            {/* {user &&  ( */}
            <>
            <div className="flex flex-col gap-10 lg:items-start w-full items-center mt-10 max-lg:pr-2">
                {navItems.map((link) => {
                    const isActive = (pathname.includes(link.title) && link.path.length > 1) || pathname === link.path;
                    //@ts-ignore
                    if((link.path === "/profile") && user) link.path = `/profile/${data.user.id}`;
                    
                    return (
                    <Link key={link.path} href={link.path || "/"} className={`${isActive ? "text-primary" : "text-text"} flex items-center gap-5 text-lg`}>
                      <i className={`${link.icon} text-2xl`}></i>
                      <p className="max-lg:hidden">{link.title}</p>
                    </Link>      
                )})
                }

                <button className="flex items-center gap-5 text-lg text-text"
                onClick={handleLogout}
                >
                    <i className="fa-solid fa-arrow-right-from-bracket text-2xl"></i>
                    <p className="max-lg:hidden">Logout</p>
                </button>

                <Link href="/composeTweet" className="text-text bg-primary rounded-full lg:py-2 text-center max-lg:w-[50px] max-lg:h-[50px] w-full">
                    <p className="max-lg:hidden">Tweet</p>
                    <div className="lg:hidden">
                        <i className="fas fa-feather text-xl"></i>
                    </div>
                </Link>
            </div>
            </>
          {/* )} */}

            

        </div>
        {user && (
        <Link href="/" className="flex items-center gap-3">
            <div className="relative max-md:w-10 max-md:h-10 w-12 h-12 object-cover">
                {/* @ts-ignore */}
                <Image src={user.image} fill alt="X" className="object-cover rounded-full"/>
            </div>

            <div className="max-lg:hidden">
                {/* @ts-ignore */}
                <p className="text-text">{user.name}</p>
                {/* @ts-ignore */}
                <p className="text-placeolder text-sm">{user.username}</p>
            </div>
        </Link>
        )}
        

    </div>
  )
}
