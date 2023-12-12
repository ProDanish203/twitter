"use client"
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFeed } from "@/lib/actions/Tweet";
import { PostCard } from "../cards";

interface Props{
  dark: boolean;
  currentUser: string;
  initialFeed: any
}

export const LoadMore = async ({dark, currentUser, initialFeed}: Props) => {

    const { ref, inView } = useInView();
    // const [data, setData] = useState(initialFeed);
    // const [page, setPage] = useState(1);
    const router = useRouter();

    // const handleLoadMore = async () => {  
    //   const next = page + 1;
    //   const {feed, success} = await getFeed({currentUser});
    //   console.log(feed)
    //   // @ts-ignore
    //   // if(success && feed.length){
    //   //   setPage(next);
    //   //   // @ts-ignore
    //   //   setData([...data, ...feed])
    //   // }
    // }

    // useEffect(() => {
    //   if(inView) handleLoadMore();
    //     // router.push(`?page=${2}`, { scroll: false});

    // }, [inView])
    
  return (
    <>
    {/* <div>
    { data &&
      data.length > 0 ?
      data.map((post:any) => (
        <PostCard key={post.id} data={post} isComments={post.children.length > 0} isMedia={post.image !== ''}/>
      ))
      : (
        <h3 className='text-text text-xl font-semibold sm:px-7 px-3 sm:py-7 py-5'>Nothing to show :&#40;</h3>
      )
    }
    </div> */}
    <div 
    // This line is causing the trouble when i assign the ref 
    ref={ref}
    className={`${!dark ? "lds-ellipsis" : "lds-ellipsis dark"} `}><div></div><div></div><div></div><div></div></div>
    </>
  )
}
