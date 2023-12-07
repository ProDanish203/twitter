import { Header, ProfileFeed, ProfileHeader } from '@/components/shared';
import { FeedSkeleton } from '@/components/skeleton';
import { getCurrentUser, getProfile } from '@/lib/actions/User';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'

interface Params{
  params: {
    id: string;
  }
}

export async function generateMetadata({params}: Params){
  // @ts-ignore
  const {data, success} = await getCurrentUser();
  const {user} = await getProfile(params.id);
  return {
    title: `${success && data?.id == params.id ? "Your Profile": "@" + user.username + "'s Profile"} | view on X`,
    description: `${user.username} | View full blog on X.com`
  }
}

const Profile = async ({params}: Params) => {

  const {id} = params;
  const {data, success} = await getCurrentUser();
  if(success && data.onBoarded == false)
    redirect(`/onboarding/${data.id}`)
  
  const {user} = await getProfile(id);

  return (
    <section className='w-full relative'>
    <div>
      {/* @ts-ignore */}
      <Header isBack={true} label={success && data?._id == id ? `Your Profile`: `${user.username}'s Profile`}/>
    </div>
    {/* @ts-ignore */}
    <ProfileHeader pfp={user?.image} username={user?.username} name={user?.name} bio={user?.bio} currentUserProfile={success && data?._id == id} createdAt={user?.createdAt} following={user?.followings} followers={user?.followers} userId={user?._id} banner={user?.banner}/>

    <Suspense fallback={<FeedSkeleton/>}>
      <ProfileFeed userId={user?.id} tweets={user?.tweets}/>
    </Suspense>
      
  </section>
  )
}

export default Profile;