import React from 'react'
import { PostcardSkeleton } from '.'

export const FeedSkeleton = () => {
  return (
    <div>
    { Array(10).fill(0).map((post:any, i:number) => (
        <PostcardSkeleton key={i}/>
      ))
    }
    </div>
  )
}
