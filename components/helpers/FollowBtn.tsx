"use client"
import { follow} from "@/lib/actions/User";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useOptimistic } from "react";
import toast from "react-hot-toast";

interface Props{
    followId: string;    
    followers: string[];
    icon: Boolean
}

export const FollowBtn = ({followId, followers, icon}: Props) => {

    const pathname = usePathname();
    const {data: session, status} = useSession();

    const [optimisticFollowers, addOptimisticFollowers] = useOptimistic(
        followers,
        (state, action: any) => {
          return [...state, action]
        }
      );

    const handleFollow = async () => {
        if(status !== "loading" && status == "unauthenticated") return toast.error("Please Login to follow")
        addOptimisticFollowers({
            // @ts-ignore
            followers: followers.push(session?.user.id)
        })
        const data = await follow({followId, pathname});
    }

  return (
    <div className='flex items-center gap-3'>
        {icon && (
            <i className='far fa-message text-text text-lg cursor-pointer'></i>
        )}
        <button className='rounded-full px-4 py-2 transition-all bg-text text-bg border-[1px] border-text shadow-sm max-sm:text-sm'
        onClick={handleFollow}
        >
            {/* @ts-ignore */}
            {session && optimisticFollowers.includes(session.user.id) ? "Unfollow" : "Follow"}
        </button>
    </div> 
  )
}
