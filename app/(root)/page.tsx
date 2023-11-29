import { ComposeXheader } from "@/components/forms";
import { Feed, Header } from "@/components/shared";
import { getCurrentUser } from "@/lib/actions/User";


export default async function Home() {

  const {data, success} = await getCurrentUser();
  if(!success) return;
  return (
    <>
    <section className="py-2">
      <div className="relative">
        <Header label="Home" isBack={false}/>
      </div>
      
      <div className="max-sm:hidden">      
        <ComposeXheader btnTitle="Post" placeholder="What is happening?!" authorImg={data?.image} authorId={data?._id} authorUsername={data?.username}/>
      </div>
      
      <Feed currentUser={data._id}/>

  </section>
    </>
  )
}
