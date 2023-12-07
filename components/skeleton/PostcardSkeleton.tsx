import React from 'react'

export const PostcardSkeleton = () => {
  return (
    <div className="relative p-2 max-md:pr-5 border-b-[1px] border-neutral-800 overflow-hidden w-full flex gap-2">

      <div className='w-[50px] h-[50px] rounded-full animate-pulse bg-neutral-600'/>

      <div className='w-full'>
        <div className='animate-pulse mb-2 bg-neutral-600 h-3 w-36 rounded-full'/>
        <div className='animate-pulse bg-neutral-600 h-3 w-20 rounded-full'/>
      

        <div className='mt-5 w-[70%] animate-pulse bg-neutral-600 h-3 rounded-full'/>

        {/* Image Skeleton */}
        <div className='max-w-[500px] h-[500px] w-full rounded-xl mt-3 mb-4 animate-pulse bg-neutral-700'/>

      
      <div className="flex items-center justify-between gap-2 max-w-[400px] mb-1">

            <div className="text-placeolder max-sm:text-sm">
              <i className="far fa-comment mr-2 cursor-pointer"></i>
              <span>0</span>
            </div>

            <div className="text-placeolder max-sm:text-sm">
              <i className="far fa-heart mr-2 cursor-pointer"></i>
              <span>0</span>
            </div>

            <div className="text-placeolder max-sm:text-sm">
              <i className="fas fa-retweet mr-2 cursor-pointer"></i>
              <span>0</span>
            </div>

            <div className="text-placeolder max-sm:text-sm">
              <i className="fas fa-share-nodes mr-2 cursor-pointer"></i>
              <span>0</span>
            </div>

      </div>
      
      </div>
    </div>
  )
}
