import React from 'react'
import { PostCard } from '../cards';

interface Props{
    userId: string;
    tweets:any
}

export const ProfileFeed = ({userId, tweets}: Props) => {

return (
<>
    {
    tweets &&
    tweets?.length > 0 ? 
    tweets?.map((post:any) => (
        <PostCard key={post._id} data={post} isComments={post.children.length > 0} isMedia={post.image !== ''}/>
    ))
    : (
        <div className='p-7'>
            <h2 className='text-text sm:text-xl text-lg font-bold'>No Posts yet</h2>
        </div>
    )}
</>
)

}
