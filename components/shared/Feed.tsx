import { getFeed } from '@/lib/actions/Tweet'
import { PostCard } from '../cards';
import { LoadMore } from '../helpers';

interface Props{
  currentUser: string;
  page: number;
}

export const Feed = async ({currentUser, page}: Props) => {
  const {feed, success} = await getFeed({currentUser});
  if(!success) return;
  return (
    <>
    <div>
    { feed &&
      feed.length > 0 ?
      feed.map((post:any) => (
        <PostCard key={post.id} data={post} isComments={post.children.length > 0} isMedia={post.image !== ''}/>
      ))
      : (
        <h3 className='text-text text-xl font-semibold sm:px-7 px-3 sm:py-7 py-5'>Nothing to show :&#40;</h3>
      )
    }
    </div>

    {/* Infinite Loading */}
    {/* <div className='text-center w-full mt-10'>
      <LoadMore dark={false} currentUser={currentUser} initialFeed={feed}/>
    </div> */}
    </>
  )
}
