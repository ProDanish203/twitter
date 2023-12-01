import { ExploreCard } from "@/components/cards"
import { Header } from "@/components/shared"
import { exploreUsers } from "@/lib/actions/Explore"
import { redirect } from "next/navigation";

interface Profile{
  _id: string;
  name: string;
  username: string;
  image: string;
  followings: string[];
  followers: string[];
}

const Explore = async () => {

  const {data, success} = await exploreUsers();
  // @ts-ignore
  const {users, user} = data;
  if(!success) return redirect('/');

  return (
    <section className='min-h-screen'>
    <div>
      <Header label="Explore" isBack={true}/>
    </div>

    <div className="px-3 py-2 mt-5 flex flex-col gap-3 justify-center w-full">
    { users && users.length > 0 
    ? users?.map((profile:Profile, i:number) => (
        <ExploreCard data={profile} key={profile._id} currentUser={user}/>
      ))
      : (
        <h3 className='text-text text-xl font-semibold sm:px-7 px-3 sm:py-7 py-5'>Nothing to show :&#40;</h3>
      )
    }
    </div>
    </section>
  )
}

export default Explore