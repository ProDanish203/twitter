import { Header, ProfileFeed, ProfileHeader } from '@/components/shared';
import { getCurrentUser, getProfile } from '@/lib/actions/User';
import { redirect } from 'next/navigation';
import React from 'react'

interface Params{
  params: {
    id: string;
  }
}

export async function generateMetadata({params}: Params){
  // @ts-ignore
  const {data} = await getCurrentUser();
  const {user} = await getProfile(params.id);
  return {
    title: `${data?._id == params.id ? "Your Profile": "@" + user.username + "'s Profile"} | view on X`,
    description: `${data.username} | View full blog on X.com`
  }
}

const Profile = async ({params}: Params) => {

  const {id} = params;
  const {data, success} = await getCurrentUser();
  if(!success) return redirect('/');
  if(data.onBoarded == false)
    redirect(`/onboarding/${data.id}`)
  

  const {user} = await getProfile(id);

  return (
    <section className='w-full relative'>
    <div>
      {/* @ts-ignore */}
      <Header isBack={true} label={data?._id == id ? `Your Profile`: `${user.username}'s Profile`}/>
    </div>
    {/* @ts-ignore */}
    <ProfileHeader pfp={user?.image} username={user?.username} name={user?.name} bio={user?.bio} currentUserProfile={data?._id == id} createdAt={user?.createdAt} following={user?.followings} followers={user?.followers} userId={user?._id} banner={user?.banner}/>

    <ProfileFeed userId={user?._id} tweets={user?.tweets}/>
      
  </section>
  )
}

export default Profile;