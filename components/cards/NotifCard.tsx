import Image from 'next/image'
import Link from 'next/link'

export const NotifCard = ({data}:{data:any}) => {

  return (
  <div className='flex items-center gap-4 px-4 py-3 lg:px-6 border-b-[1px] border-neutral-800'>
    <Link href={`/profile/${data.author.id}`}>
      <Image src={data.author.image} width={100} height={100} alt={data.author.username} className="object-cover rounded-full w-16 h-16 max-sm:w-12       max-sm:h-12"/>
    </Link>

    <Link href={data.link}>
      <p className='text-text'>
        <b>{data.author.username}</b> {data.desc}
      </p>
    </Link>  

  </div>
  )
}
