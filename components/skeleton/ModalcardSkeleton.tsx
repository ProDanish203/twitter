import React from 'react'

export const ModalcardSkeleton = () => {
  return (
    <div className="rounded-md flex gap-2">
        <div className='w-[50px] h-[50px] rounded-full animate-pulse bg-neutral-600'/>

        <div className='flex flex-col gap-2 justify-center'>
            <div className='animate-pulse bg-neutral-600 h-3 w-36 rounded-full'/>
            <div className='animate-pulse bg-neutral-600 h-3 w-20 rounded-full'/>
        </div>
    </div>
  )
}
