import { ComposeXheader } from "@/components/forms";
import { Feed, Header } from "@/components/shared";
import { FeedSkeleton } from "@/components/skeleton";
import { getCurrentUser } from "@/lib/actions/User";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {

  const {data, success} = await getCurrentUser();
  
  if(success && data.onBoarded == false)
    redirect(`/onboarding/${data.id}`)
  
  return (
    <>
    <section className="py-2">
      <div className="relative">
        <Header label="Home" isBack={false}/>
      </div>
      {
        success && (
        <div className="max-sm:hidden">      
          <ComposeXheader btnTitle="Post" placeholder="What is happening?!" authorImg={data?.image} authorId={data?._id} authorUsername={data?.username}/>
        </div>
        )
      }
      
      
      <Suspense fallback={<FeedSkeleton/>}>
        <Feed currentUser={success && data._id }/>
      </Suspense>

  </section>
    </>
  )
}
