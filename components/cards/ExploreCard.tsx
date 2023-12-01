import Image from "next/image"
import { FollowBtn } from "../helpers"
import Link from "next/link";

interface Props{
    data: {
        _id: string;
        name: string;
        username: string;
        image: string;
        followings: string[];
        followers: string[];
    };
    currentUser: {
        _id: string;
        name: string;
        username: string;
        image: string;
        followings: string[];
        followers: string[];
    }
}

export const ExploreCard = ({data, currentUser}: Props) => {
  return (
    <div className="bg-darkAccent p-4 rounded-md w-full flex items-center justify-between gap-2">

        <div className="flex items-center gap-4">
            <Link href={`/profile/${data._id}`}>
                <Image src={data.image} alt={data.name} width={100} height={100}
                className="object-cover rounded-full w-16 h-16"
                />
            </Link>
            <div>
                <h4 className="text-text font-semibold">{data.name}</h4>
                <h5 className="text-neutral-500">@{data.username}</h5>
            </div>
        </div>

        <div>
            <FollowBtn followId={data._id} followers={currentUser.followings} icon={false}/>
        </div>
    </div>
  )
}
