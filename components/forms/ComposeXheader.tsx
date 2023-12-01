"use client"
import { addTweet } from "@/lib/actions/Tweet";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/utils/firebase";


interface Props{
  placeholder: string;
  btnTitle: string;
  authorImg: string;
  authorId: string;
  authorUsername: string;
}

export const ComposeXheader = ({authorId, authorImg, authorUsername, btnTitle, placeholder}: Props) => {

    const [caption, setCaption] = useState("")
    const [file, setFile] = useState("")
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState(0);

    const router = useRouter();
    const pathname = usePathname();

  const uploadFile = (file:any) => {
    if(!file) return;
    const fileName = new Date().getTime() + file.name;
      
    const storage = getStorage(app);
    const storageRef = ref(storage, `/tweets/${fileName}`);
    
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
          setImage(downloadURL)
        });
    }
  );
  }

  useEffect(() => {
      file && uploadFile(file);
  }, [file])

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if(!caption) return toast.error("Textfield cannot be empty");
      if(file && progress >= 0 && progress != 100) return toast.error("Uploading media, please wait")

      if(file && image.length <= 0) return toast.error("Uploading media, please wait")

      const {success} = await addTweet({
        caption, image, pathname
      }); 

      if(success){
        toast.success("Tweet added");
        setCaption("")
        setFile("")
        setImage("")
        setProgress(0);
        router.push('/')
      }else     
          toast.success("Something went wrong");

    }catch(error){
      toast.error("Something went wrong");
    }
  }

  return (
  <>
  <div className="flex items-start gap-0 py-2 mt-5 px-3 border-b-[1px] border-neutral-800">
  
    <div className="h-full w-[80px]">
      <div className="relative max-md:w-8 max-md:h-8 w-12 h-12 object-contain">
        <Image fill src={authorImg || "/images/dummyUser.png"} alt={authorUsername} className="rounded-full object-cover"/>
      </div>
    </div>
  
    <form onSubmit={handlePost} className="relative w-full">

      <textarea className="w-full text-text bg-transparent border-b-[1px] border-neutral-800 resize-none mb-1 outline-none"
      placeholder={placeholder}
      value={caption}
      onChange={(e:  React.ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
      >
      </textarea>

      <div className="flex items-center justify-between gap-2">

        <div className="text-primary flex gap-5">
          <input type="file" id="image" 
          className="hidden"
          accept="image/*"
          onChange={(e:any) => {
            setFile(e.target.files[0])
          }}
          />
          <label htmlFor="image">
            <i className="far fa-image cursor-pointer"></i>
          </label>
        </div>

        <button className="text-text bg-primary rounded-full px-5 py-1" type="submit">{btnTitle}</button>

      </div>

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

    </form>

  </div>
  </>
  )
}
