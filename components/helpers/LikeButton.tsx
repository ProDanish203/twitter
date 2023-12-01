"use client"

import { likeTweet } from "@/lib/actions/Tweet";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface Props{
    likes: number;
    postId: string;
    likedBy: string[];
}

export const LikeButton = ({likes, postId, likedBy}: Props) => {

    const pathname = usePathname();
    const {data: session} = useSession();

    const handleLike = async () => {
        const {success} = await likeTweet(postId, pathname);
    }

  return (
    <div className="text-placeolder max-sm:text-sm"
    onClick={handleLike}
    >
        {/* @ts-ignore */}
        <i className={` mr-2 cursor-pointer ${session && likedBy.includes(session.user.id) ? 'fas fa-heart text-red-600': 'far fa-heart'}`}></i>
        <span>{likes}</span>
    </div>
  )
}
