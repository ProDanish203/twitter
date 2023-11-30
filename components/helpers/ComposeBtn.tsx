import Link from 'next/link'


export const ComposeBtn = ({userId}: {userId: string}) => {
  return (
    <Link href={`/composeTweet?userid=${userId}`} className='fixed bottom-20 right-5'>
    <button className='bg-primary text-text p-2 rounded-full w-12 h-12 shadow-lg'>
        <i className='fas fa-feather'></i>
    </button>
    </Link>
  )
}
