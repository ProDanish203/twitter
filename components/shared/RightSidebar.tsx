import { SearchBar } from "@/components/forms";
import Image from "next/image";
import Link from "next/link";
import { FollowBtn } from "../helpers";
import { exploreSomeUsers } from "@/lib/actions/Explore";

interface Profile{
  _id: string;
  name: string;
  username: string;
  image: string;
  followings: string[];
  followers: string[];
}

export const RightSidebar = async () => {

  const {data, success} = await exploreSomeUsers();
  // @ts-ignore
  const {users, user} = data;
  if(!success) return;

  return (
    <div className='h-screen lg:min-w-[200px] max-w-[350px] pt-28 lg:w-full w-fit sticky p-7 top-0 right-0 border-l-[1px] border-neutral-800 overflow-hidden'>
        
      <div className='flex flex-col gap-5 w-full items-start justify-between'>

          <SearchBar/>

          <div className='bg-darkAccent py-5 w-[300px] rounded-md'>
              
              <h2 className='text-text text-xl font-semibold mb-4 px-5'>Who to follow</h2>
              <div className='flex flex-col gap-2'>
              {users && users.length > 0 && 
              users.map((profile:Profile) => (
              <div key={profile._id} className='flex items-center w-full justify-between gap-3 px-5 py-2 hover:bg-placeolder transition'>

                  <div className='flex items-center gap-2'>
                      <Link href={`/profile/${profile._id}`} className='relative  object-cover'>
                          <Image src={profile.image || "/dummyUser.png"} className='rounded-full object-cover w-10 h-10' height={100} width={100} alt='username'/>
                      </Link>

                      <Link href={`/profile/${profile._id}`}>
                          <h6 className='text-text font-semibold md:text-md'>{profile.name}</h6>
                          <p className='text-whiteAccent text-sm'>@{profile.username}</p>
                      </Link>
                  </div>

                  <FollowBtn followId={profile._id} followers={user.followings} icon={false}/>
              </div>
              ))
              }
          </div>

          </div>
      </div>

    </div>
  )
}
