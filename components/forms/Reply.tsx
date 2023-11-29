"use client"
import Image from 'next/image'
import React, { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { getUser } from '@/lib/actions/User';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { addTweet } from '@/lib/actions/Tweet';

export const Reply = ({postId}: {postId: string}) => {

    const {data: session} = useSession();
    const [user, setUser] = useState();
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState("");
    const [image, setImage] = useState("");

    const pathname = usePathname();

    const getData = async () => {
        // @ts-ignore
        const {data, success} = await getUser(session?.user.id); 
        if(success) setUser(data);
    }

    useEffect(() => {
        getData();
    }, [session]);

    const addComment = async (e: FormEvent) => {
        e.preventDefault();
        try{
            const {success} = await addTweet({
                caption,
                image,
                parentId: postId,
                pathname
            });
            if(success){
                toast.success("Comment added");
                setCaption("");
                setFile("");
                setImage("");
            }
        }catch(error){
            toast.error("Something went wrong");
        }
    }


  return (
    <div className="flex items-start gap-0 py-2 px-3 border-b-[1px] border-neutral-800">
        
    <div className="h-full w-[80px]">
        <div className="relative max-md:w-8 max-md:h-8 w-12 h-12 object-contain">
            {/* @ts-ignore */}
            <Image fill src={`${user && user?.image || "/dummyUser.png"}`} alt={user ? user?.username : 'username'} className='rounded-full object-cover'/>
        </div>
    </div>

    <form onSubmit={addComment} className="relative w-full">

        <textarea className="w-full text-text bg-transparent border-b-[1px] border-neutral-800 resize-none mb-1 outline-none"
        placeholder="Add reply"
        value={caption}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
        >

        </textarea>

        <div className="flex items-center justify-between gap-2">

        <div className="text-primary flex gap-5">
            <i className="far fa-image cursor-pointer"></i>
        </div>

        <button 
        type='submit'
        className="text-text bg-primary rounded-full px-5 py-1">Reply</button>

        </div>

    </form>

    </div>
  )
}
