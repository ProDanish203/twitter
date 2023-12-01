import { format, formatDistanceToNowStrict } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { LikeButton } from '../helpers';

interface Props{
    isComments: boolean
    isMedia: boolean;
    data: any
}

export const PostCard = ({data, isComments, isMedia}: Props) => {

    const formattedDate = format(new Date(data.createdAt), "yyyy-MM-dd HH:mm");
    const smallDate = formatDistanceToNowStrict(new Date(data.createdAt))
    
  return (
    <div className="relative flex p-2 max-md:pr-5 border-b-[1px] border-neutral-800 overflow-hidden w-full">

        <div className="h-full w-[70px] max-md:w-[50px]">
            <Link href={`/profile/${data.author._id}`}>
            <div className="relative max-md:w-10 max-md:h-10 w-12 h-12 object-contain">
                <Image fill src={data.author.image || `/dummyUser.png`} alt={data.author.username}
                className="rounded-full object-cover"
                />
            </div>
            </Link>
            {/* {isComments && (
                <div className="h-[90%] w-[2px] bg-neutral-700 absolute md:left-8 left-6"/>
            )} */}
        </div>
    {/* Author section */}
    <div className="relative w-full">

        <div className="flex items-center justify-between gap-2 w-full max-sm:ml-2">
            <div className='flex items-center gap-2'>
                <Link href={`/profile/${data.author._id}`} className="text-text font-semibold">{data.author.name.substring(0, 10)}</Link> 
                <Link href={`/profile/${data.author._id}`} className="text-sm text-placeolder">@{data.author.username}</Link>
            </div>
            <span className="max-md:hidden text-sm text-placeolder">{smallDate} ago</span>
            <span className="md:hidden text-sm text-placeolder">{smallDate} ago</span>
        </div>

        <Link href={`/tweet/${data._id}`}>
            
        <p className="text-text md:text-[15px] my-2">{data.caption}</p>

        {isMedia && (
            <div className="relative mt-3 mb-4">
            <Image src={data.image} width={1000} height={1000} alt="lorem ipsum"
            className="object-cover rounded-xl max-w-[500px] w-full h-[500px]"
            />
        </div>
        )}
        </Link>

        <div className="flex items-center justify-between gap-2 max-w-[400px] mb-1">

            <div className="text-placeolder max-sm:text-sm">
                <Link href={`/tweet/${data._id}`}>
                    <i className="far fa-comment mr-2 cursor-pointer"></i>
                </Link>
                <span>{data.children.length}</span>
            </div>

            <LikeButton likes={data.likes} likedBy={data.likedBy} postId={data._id}/>

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
