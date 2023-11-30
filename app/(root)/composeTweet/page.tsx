import { ComposeXheader } from '@/components/forms';
import { Header } from '@/components/shared';
import { getUser } from '@/lib/actions/User';
import React from 'react'

interface Params{
  searchParams: {
    userid: string;
  }
}

const ComposeTweet = async ({searchParams}: Params) => {

  const {data, success} = await getUser(searchParams.userid); 
  if(!success) return;
  
  return (
  <section className='w-full'>

    <div>
      <Header isBack={true} label="Compose"/>
    </div>
    <div className='max-xs:w-screen w-full'>
      <ComposeXheader btnTitle="Post" placeholder="What is happening?!" authorImg={data?.image} authorId={data?._id} authorUsername={data?.username}/>
    </div>
  </section>
  )
}

export default ComposeTweet;