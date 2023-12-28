"use client"
import { likeTweet } from "@/lib/actions/Tweet";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useOptimistic } from "react";
import toast from "react-hot-toast";

interface Props{
    likes: number;
    postId: string;
    likedBy: string[];
}

interface Session{
  
}

export const LikeButton = ({likes, postId, likedBy}: Props) => {

    const pathname = usePathname();
    const {data: session} = useSession();

    const [optimtisticLike, addOptimisticLike] = useOptimistic(
      likedBy,
      (state, addLike: any) => {
        return [...state, addLike]
      }
    );

    const handleLike = async () => {
      if(!session) return toast.error("Please login to like tweet")
      addOptimisticLike({
        // @ts-ignore
        likedBy: likedBy.push(session.user.id)
      });
      const {success} = await likeTweet(postId, pathname);
      if(!success) return toast.error("Something went wrong");
    }

  return (
    <div className="text-placeolder max-sm:text-sm"
    onClick={handleLike}
    >
        {/* @ts-ignore */}
        <i className={` mr-2 cursor-pointer ${session && optimtisticLike.includes(session.user.id) ? 'fas fa-heart text-red-600': 'far fa-heart'}`}></i>
        <span>{likes}</span>
    </div>
  )
}
