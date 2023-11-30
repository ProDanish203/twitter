import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/utils/firebase";

const uploadFile = (file:any, setProgress:any) => {
    if(!file) return;
    const fileName = new Date().getTime() + file.name;
      
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);

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