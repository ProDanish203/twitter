import { Edit } from '@/components/forms';
import { Header } from '@/components/shared';
import { getCurrentUser } from '@/lib/actions/User';
import { redirect } from 'next/navigation';

interface Params{
  params: {
    id: string;
  }
}

export async function generateMetadata(){
  const {data} = await getCurrentUser();
  return {
    title: `Complete profile ${data.name} | X`,
    description: `${data.username} | View profile on X.com`
  }
}

const Onboarding = async ({params}:Params ) => {
    const {id} = params;
    const {data, success} = await getCurrentUser();
    if(data.id != id) redirect(`/profile/${data.id}`)
  
  return (
    <section className='min-h-screen'>
      <div>
        <Header isBack={true} label="Complete Profile"/>
      </div>
      {data && (
        <Edit id={id} data={data} redirect='/'/>
      )}

    </section>
  )
}

export default Onboarding;