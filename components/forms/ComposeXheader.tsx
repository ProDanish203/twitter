"use client"
import { addTweet } from "@/lib/actions/Tweet";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

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

    const router = useRouter();
    const pathname = usePathname();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if(!caption) return toast.error("Textfield cannot be empty");

      const {success} = await addTweet({
        caption, image, pathname
      }); 

      if(success){
        toast.success("Tweet added");
        setCaption("")
        setFile("")
        setImage("")
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
                <i className="far fa-image cursor-pointer"></i>
            </div>
    
            <button className="text-text bg-primary rounded-full px-5 py-1" type="submit">{btnTitle}</button>
    
          </div>
    
        </form>
    
      </div>
    </>
  )
}
