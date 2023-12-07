"use client"

import { likeTweet } from "@/lib/actions/Tweet";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface Props{
    likes: number;
    postId: string;
    likedBy: string[];
}

export const LikeButton = ({likes, postId, likedBy}: Props) => {

    const pathname = usePathname();
    const {data: session} = useSession();

    const handleLike = async () => {
      if(!session) return toast.error("Please login to like tweet")
      const {success} = await likeTweet(postId, pathname);
      if(!success) return toast.error("Something went wrong");
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
