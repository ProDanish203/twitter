import { Edit } from '@/components/forms';
import { Header } from '@/components/shared';
import { getCurrentUser } from '@/lib/actions/User';
import { redirect } from 'next/navigation';

interface Params{
  params: {
    id: string;
  }
}

const EditProfile = async ({params}: Params) => {

  const {id} = params;
  const {data, success} = await getCurrentUser();
  if(data.id != id) redirect(`/profile/${data.id}`)
  

  return (
    <>
    <section className='min-h-screen'>
      <div>
        <Header isBack={true} label="Edit Profile"/>
      </div>
      {data && (
        <Edit id={id} data={data}/>
      )}

    </section>
    </>
  )
}

export default EditProfile;