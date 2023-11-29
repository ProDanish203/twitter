import { Header, ProfileFeed, ProfileHeader } from '@/components/shared';
import { getCurrentUser, getProfile, getUser } from '@/lib/actions/User';
import React from 'react'

interface Params{
  params: {
    id: string;
  }
}

const Profile = async ({params}: Params) => {

  const {id} = params;
  const {data, success} = await getCurrentUser();
  if(!success) return;

  const {user} = await getProfile(id);

  return (
    <section className='w-full relative'>
    <div>
      {/* @ts-ignore */}
      <Header isBack={true} label={data?._id == id ? `Your Profile`: `${user.username}'s Profile`}/>
    </div>
    {/* @ts-ignore */}
    <ProfileHeader pfp={user?.image} username={user?.username} name={user?.name} bio={user?.bio} currentUserProfile={data?._id == id} createdAt={user?.createdAt} following={user?.followings} followers={user?.followers} userId={user?._id} banner={user?.coverImage}/>

    <ProfileFeed userId={user?._id} tweets={user?.tweets}/>
      
  </section>
  )
}

export default Profile;