"use server"
import { connectDb } from "@/lib/config/db";
import User from "@/lib/models/User";
import { getAuthSession } from "@/utils/auth";


export const exploreUsers = async () => {
    try{
        const session = await getAuthSession()
        if(!session) 
            return { success: false, message: "Authentication error"}

        await connectDb();
        const user = await User.findById(session.user.id).select("_id username name image followings followers")

        const users = await User.find({
            $and: [
                { _id: { $ne: user._id } },
                { _id: { $nin: user.followings } },
            ],
        })
        .sort({createdAt: -1})
        .select('_id name username image followers followings');

        if(users){
            const exploreData = {
                users, user
            }
            return {exploreData, success: true, message: "User fetched successfully"}
        }else{
            return {success: false, message: "Error while fetching user data"}
        }

    }catch(error:any){
        throw new Error(`Failed to fetch User data: ${error.message}`)
    }
}


export const exploreSomeUsers = async () => {
    try{
        const session = await getAuthSession()
        if(!session) 
            return { success: false, message: "Authentication error"}

        await connectDb();
        const user = await User.findById(session.user.id).select("_id username name image followings followers")

        const users = await User.find({
            $and: [
                { _id: { $ne: user._id } },
                { _id: { $nin: user.followings } },
            ],
        })
        .limit(10)
        .sort({createdAt: -1})
        .select('_id name username image followers followings');

        if(user){
            const data = {users, user}
            return {data, success: true, message: "User fetched successfully"}
        }else{
            return {success: false, message: "Error while fetching user data"}
        }

    }catch(error:any){
        throw new Error(`Failed to fetch User data: ${error.message}`)
    }
}


