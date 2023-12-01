"use client"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { updateProfile } from "@/lib/actions/User";
import Image from "next/image";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/utils/firebase";

interface Props{
    data: any;
    id:string;
    redirect:string;
}

export const Edit = ({id, data, redirect}: Props) => {

    const router = useRouter();
    const pathname = usePathname();

    const [name, setName] = useState(data.name || "")
    const [username, setUsername] = useState(data.username || "")
    const [image, setImage] = useState(data.image || "")
    const [banner, setBanner] = useState(data.banner || "")
    const [bio, setBio] = useState( data.bio || "")
    const [file, setFile] = useState();
    const [bannerFile, setBannerFile] = useState();
    const [progress, setProgress] = useState(0);

    const uploadFile = (file:any, setter:any) => {
        if(!file) return;
        const fileName = new Date().getTime() + file.name;
          
        const storage = getStorage(app);
        const storageRef = ref(storage, `/users/${fileName}`);

        
        const uploadTask = uploadBytesResumable(storageRef, file);
            
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                setProgress(progress)
                break;
            }
        }, 
        (error) => {
            console.log(error);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setter(downloadURL)
              toast.success("Upload completed");
            });
        }
      );
      }
    
    useEffect(() => {
        file && uploadFile(file, setImage);
    }, [file])

    useEffect(() => {
        bannerFile && uploadFile(bannerFile, setBanner);
    }, [bannerFile])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validations
        if(!username) return toast.error("Username is required")
        if(!name) return toast.error("Name is required")
        if(username.includes(" ")) return toast.error("Username must not contain white spaces");
        if(bio && bio.length > 300) return toast.error("Long bio")

        if(file && progress >= 0 && progress != 100) return toast.error("Changing profile picture, please wait")

        if(bannerFile && progress >= 0 && progress != 100) return toast.error("Uploading banner, please wait")

        try{
            const {success, message} = await updateProfile({
                name, username, image, banner, bio, pathname
            })
            if(success){
                toast.success("Profile updated successfully");
                router.push(redirect);
            } else
                return toast.error(message);

        }catch(error){
            toast.error("Unable to edit profile");
            console.log(error);
        }
    }

  return (
<>
<form className='md:px-7 px-5 py-7' onSubmit={handleSubmit}>

    <div className="w-fit rounded-full">
        <label htmlFor="image" className="relative max-md:flex items-center justify-center cursor-pointer w-fit rounded-full">
            <Image src={image} alt={username} width={400} height={400}
            className="object-cover rounded-full md:w-32 md:h-32 w-[110px] h-[110px] cursor-pointer"
            />
        </label>
        <input type="file" id="image" 
        className="hidden"
        onChange={(e:any) => {
            setFile(e.target.files[0])
            uploadFile(file, setImage)
        }}
        />
    </div>
    <div>

        <label htmlFor="banner" className="text-white bg-primary rounded-md px-3 py-1 mt-3 mb-2 block w-fit">
            {data.banner ? "Change Banner": "Set banner"}
        </label>

        <input type="file" id="banner" 
        className="hidden"
        onChange={(e:any) => setBannerFile(e.target.files[0])}
        />  

        {progress > 0 && (
      <div className="max-xs:mt-5 flex items-center gap-2">
        
      <div id="progress-container" className='mt-2relative max-h-[20px] sm:w-[300px] xs:w-[250px] w-[200px] h-[10px] rounded-md overflow-hidden'>

        <div id="progress-bar" style={{width: progress + '%', height: "100%"}}
        className='h-full flex items-center justify-center'
        ></div>
        
      </div>
        <p className="text-text max-xs:text-sm">
          {progress.toFixed(1)} %
        </p>
      </div>
      )}

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
