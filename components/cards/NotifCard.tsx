import Image from 'next/image'
import Link from 'next/link'

export const NotifCard = () => {
  return (
    <Link href="/notifications" className='flex items-center gap-4 px-4 py-2 lg:px-6 border-b-[1px] border-neutral-800'>
        <div className="relative max-md:w-10 max-md:h-10 w-14 h-14 object-cover">
            <Image src="/logo.svg" fill alt="X" className="object-cover rounded-full"/>
        </div>

        <p className='text-text md:text-[15px] text-sm'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit id beatae quae itatis voluptatum unde, et quia ipsum nam amet est! Dignissimos!
        </p>

    </Link>
  )
}
