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
    title: `Update profile ${data.name} | X`,
    description: `${data.username} | View full profile on X.com`
  }
}

const EditProfile = async ({params}: Params) => {

  const {id} = params;
  const {data, success} = await getCurrentUser();
  if(!success) redirect('/')
  if(data.id != id) redirect(`/profile/${data.id}`)
  

  return (
    <section className='min-h-screen'>
      <div>
        <Header isBack={true} label="Edit Profile"/>
      </div>
      {data && (
        <Edit id={id} data={data} redirect={`/profile/${id}`}/>
      )}

    </section>
  )
}

export default EditProfile;