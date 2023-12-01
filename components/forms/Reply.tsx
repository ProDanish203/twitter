"use client"
import Image from 'next/image'
import React, { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { getUser } from '@/lib/actions/User';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { addTweet } from '@/lib/actions/Tweet';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/utils/firebase";

export const Reply = ({postId}: {postId: string}) => {

    const {data: session} = useSession();
    const [user, setUser] = useState();
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState("");
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState(0);

    const pathname = usePathname();

    const getData = async () => {
        // @ts-ignore
        const {data, success} = await getUser(session?.user.id); 
        if(success) setUser(data);
    }

    useEffect(() => {
        getData();
    }, [session]);

    const uploadFile = (file:any) => {
        if(!file) return;
        const fileName = new Date().getTime() + file.name;
          
        const storage = getStorage(app);
        const storageRef = ref(storage, `/tweets/${fileName}`);

    
        const uploadTask = uploadBytesResumable(storageRef, file);
            
        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
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

    const addComment = async (e: FormEvent) => {
        e.preventDefault();
        try{
            if(!caption) return toast.error("Textfield cannot be empty")
            if(file && progress >= 0 && progress != 100) return toast.error("Uploading media, please wait")

            if(file && image.length <= 0) return toast.error("Uploading media, please wait")
        
            const {success} = await addTweet({
                caption,
                image,
                parentId: postId,
                pathname
            });
            if(success){
                toast.success("Comment added");
                setCaption("");
                setFile("");
                setImage("");
                setProgress(0);
            }
        }catch(error){
            toast.error("Something went wrong");
        }
    }


  return (
    <div className="flex items-start gap-0 py-2 px-3 border-b-[1px] border-neutral-800">
        
    <div className="h-full w-[80px]">
        <div className="relative max-md:w-8 max-md:h-8 w-12 h-12 object-contain">
            {/* @ts-ignore */}
            <Image fill src={`${user && user?.image || "/dummyUser.png"}`} alt={user ? user?.username : 'username'} className='rounded-full object-cover'/>
        </div>
    </div>

    <form onSubmit={addComment} className="relative w-full">

        <textarea className="w-full text-text bg-transparent border-b-[1px] border-neutral-800 resize-none mb-1 outline-none"
        placeholder="Add reply"
        value={caption}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
        >

        </textarea>

        <div className="flex items-center justify-between gap-2">

        <div className="text-primary flex gap-5">
          <input type="file" id="image" 
          className="hidden"
          accept="image/*"
          onChange={(e:any) => setFile(e.target.files[0])}
          />
          <label htmlFor="image">
            <i className="far fa-image cursor-pointer"></i>
          </label>
        </div>

        <button 
        type='submit'
        className="text-text bg-primary rounded-full px-5 py-1">Reply</button>

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
  )
}
