"use client"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateProfile } from "@/lib/actions/User";
import Image from "next/image";

interface Props{
    data: any;
    id:string
}

export const Edit = ({id, data}: Props) => {

    const router = useRouter();
    const pathname = usePathname();

    const [name, setName] = useState(data.name || "")
    const [username, setUsername] = useState(data.username || "")
    const [image, setImage] = useState(data.image || "")
    const [banner, setBanner] = useState(data.banner || "")
    const [bio, setBio] = useState( data.bio || "")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validations
        if(!username) return toast.error("Username is required")
        if(!name) return toast.error("Name is required")
        if(username.includes(" ")) return toast.error("Username must not contain white spaces");
        if(bio && bio.length > 300) return toast.error("Long bio")

        try{
            const {success} = await updateProfile({
                name, username, image, banner, bio, pathname
            })
            if(success){
                toast.success("Profile updated successfully");
                router.push(`/profile/${id}`);
            } else
                return toast.error("Unable to edit profile");

        }catch(error){
            toast.error("Unable to edit profile");
            console.log(error);
        }
    }

  return (
<>
<form className='md:px-7 px-5 py-7' onSubmit={handleSubmit}>

    <div className="relative max-md:flex items-center justify-center">
        <Image src={image} alt={username} width={500} height={500}
        className="object-cover rounded-full md:max-w-[150px] md:max-h-[150px] max-w-[110px] max-h-[110px] cursor-pointer"
        />
    </div>

    <div className='mb-3 flex justify-center flex-col gap-1'>
        <label htmlFor="" className='text-neutral-400 ml-1'>Name</label>
        <input type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className='text-text bg-transparent outline-none border-[1px] border-neutral-500 px-2 py-2 rounded-md max-w-[500px] w-full'
        />
    </div>

    <div className='mb-3 flex justify-center flex-col gap-1'>
        <label htmlFor="" className='text-neutral-400 ml-1'>Username</label>
        <input type="text" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className='text-text bg-transparent outline-none border-[1px] border-neutral-500 px-2 py-2 rounded-md max-w-[500px] w-full'
        />
    </div>

    <div className='mb-3 flex justify-center flex-col gap-1'>
        <label htmlFor="bio" className='text-neutral-400 ml-1'>Bio</label>
        <textarea name="bio" rows={5} value={bio} onChange={(e:any) => setBio(e.target.value)} id='bio'
        className='text-text bg-transparent outline-none border-[1px] border-neutral-500 px-2 py-2 rounded-md max-w-[500px] w-full resize-none'
        placeholder='Bio'
        ></textarea>
    </div>

    <button type='submit' className='text-text bg-primary disabled:opacity-60 rounded-full px-5 py-2 mt-4 max-w-[150px] w-full shadow-md'>Save</button>
    

</form>
</>
  )
}
