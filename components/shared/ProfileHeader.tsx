import Image from 'next/image';
import Link from 'next/link';
import { format } from "date-fns";
import { FollowBtn, LogoutBtn } from '../helpers';
import { Modal } from '.';

interface Props{
    pfp: string;
    name: string;
    username: string;
    bio: string;
    currentUserProfile: boolean;
    createdAt: string;
    following: string[]
    followers: string[];
    userId: string;
    banner: string;
}   

export const ProfileHeader = async ({userId, name, username, pfp, banner, bio, createdAt, currentUserProfile, followers, following} : Props) => {

    const formattedDate = format(new Date(createdAt), 'MMMM yyyy')
    console.log(banner)


  return (
    <div className='w-full border-b-[1px] border-neutral-800 '>
        <div className='sm:h-[200px] h-[150px] bg-neutral-700 relative w-full'>
            {banner && (
                <Image src={banner} fill alt={username} className='object-cover'/>
            )}
            <div className='absolute -bottom-10 left-0 right-0 flex items-center justify-between gap-10 sm:px-7 px-5'>
                <div className='relative object-contain'>
                    <Image src={pfp || "/images/dummyUser.png"} width={400} height={400} alt={username} className='rounded-full object-cover md:w-28 md:h-28 w-20 h-20'/>
                </div>

                <div className='sm:mt-10 mt-16 flex items-center gap-3'>
                {currentUserProfile ? (
                    <>
                    <LogoutBtn/>

                    <Link href={`/editProfile/${userId}`}>
                        <button className='rounded-full px-4 py-2 text-text bg-transparent transition-all hover:bg-text hover:text-bg border-[1px] border-text max-sm:text-sm max-sm:py-1 max-sm:px-3 shadow-sm'>Edit Profile</button>
                    </Link>
                    
                    </>
                ) : (
                    <FollowBtn followId={userId} followers={followers} icon/>        
                )}
                </div>

            </div>
        </div>
        

        <div className='mt-14 sm:px-7 px-5 pb-7'>
            <div>
                <p className='text-text sm:text-lg font-semibold leading-5'>{name}</p>
                <p className='text-placeolder max-sm:text-sm'>@{username}</p>
            </div>

            <p className='text-neutral-300 max:sm:text-sm my-4'>{bio}</p>
            
            <div className='mb-4'>
                <div className='flex items-center gap-3'>
                    <i className='far fa-calendar text-neutral-400 text-lg'></i>
                    <p className='max-sm:text-sm text-placeolder'>Joined: {formattedDate}</p>
                </div>
            </div>

            <div className='flex items-center gap-4'>
                <Modal data={following} title="Following" btnTitle="Following"/>
                <Modal data={followers} title="Followers" btnTitle="Followers"/>                
            </div>
        </div>

    </div>
  )
}
