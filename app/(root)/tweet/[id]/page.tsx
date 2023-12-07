import { PostCard } from '@/components/cards';
import { Reply } from '@/components/forms';
import { Header } from '@/components/shared';
import { getTweet } from '@/lib/actions/Tweet';
import { redirect } from 'next/navigation';

interface Params{
  params: {
    id: string;
  }
}

export async function generateMetadata({params}:Params){
  const {tweet} = await getTweet(params.id);
  return {
    title: `${tweet.author.name} on X : "${tweet.caption.substring(0,50)}"`,
    description: `${tweet.caption} | View tweet on twitterds`
  }
}

const Tweet = async ({params}: Params) => {

  const {id} = params;
  const {tweet, success} = await getTweet(id);
  if(!success) return redirect('/');

  return (
    <section>
    <div>
        <Header label="Post" isBack={true}/>
    </div>

    <PostCard key={tweet._id} data={tweet} isComments={tweet.children.length > 0} isMedia={tweet.image !== ''}/>
      <Reply postId={tweet._id}/>

    {
      tweet.children.length > 0 
      ? 
      tweet.children.map((tweet:any, i:number) => (
        <PostCard key={tweet._id} data={tweet} isComments={tweet.children.length > 0} isMedia={tweet.image !== ''}/>
      ))
      : (
        <h5 className='text-text text-xl font-semibold sm:px-7 px-3 sm:py-7 py-5'>No comments yet :&#40;</h5>
      )
    }
    </section>
  )
}

export default Tweet;