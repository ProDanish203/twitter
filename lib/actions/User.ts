"use server"
import { connectDb } from "@/lib/config/db";
import User from "@/lib/models/User";
import Tweet from "@/lib/models/Tweet";
import Notification from "@/lib/models/Notification";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/utils/auth";

interface EditProps{
    name: string;
    username: string;
    image: string;
    banner: string;
    bio: string;
    pathname: string;
}

interface followProps{
    followId: string;
    pathname: string;
}

export const getUser = async (id: string) => {
    try{
        await connectDb();
        const data = await User.findById(id)
        .select('_id name username image');

        if(data){
            return {data, success: true, message: "User fetched successfully"}
        }else{
            return {success: false, message: "Error while fetching user data"}
        }

    }catch(error:any){
        throw new Error(`Failed to fetch User data: ${error.message}`)
    }
}

export const getCurrentUser = async () => {
    try{
        const session = await getAuthSession()
        if(!session) 
            return { success: false, message: "Authentication error"}
    
        await connectDb();
        const data = await User.findById(session.user.id)
        .select('_id name username image banner bio location hasNotifications onBoarded');

        if(data){
            return {data, success: true, message: "User fetched successfully"}
        }else{
            return {success: false, message: "Error while fetching user data"}
        }

    }catch(error:any){
        throw new Error(`Failed to fetch User data: ${error.message}`)
    }
}

export const getProfile = async (id: string) => {
    try{
        await connectDb();
        const user = await User.findById(id)
        .populate({
            path: 'tweets', 
            model: Tweet,
            match: { parentId: { $exists: false } },
            populate: {
                path: 'author', 
                model: User,
                select: '_id name username image'
            },
            options: {
                sort: { createdAt: -1 }
            }
        })

        if(user){
            return {user, success: true, message: "Profile fetched successfully"}
        }else{
            return {success: false, message: "Error while fetching user profile"}
        }

    }catch(error:any){
        throw new Error(`Failed to fetch User profile: ${error.message}`)
    }
}


export const updateProfile = async ({ name, username, image, banner, bio,  pathname}: EditProps) => {
    try{
        const session = await getAuthSession()
        if(!session) 
            return { success: false, message: "Authentication error"}
    
        await connectDb();

        const existingUser = await User.findOne({username: username, _id: { $ne: session.user.id }})
        if(existingUser)
            return {success: false, message: "Username taken"}

        const updateUser = await User.findByIdAndUpdate(session.user.id, {
            name, username, image, banner, bio, onBoarded: true
        });

        if(updateUser)  
        return {success: true, message: "Profile updated successfully"}
        else
        return {success: false, message: "Error while updating profile"}


    }catch(error:any){
        throw new Error(`Failed to fetch User data: ${error.message}`)
    }finally{
        revalidatePath(pathname);    
    }
}

export const follow = async ({ followId, pathname }: followProps) => {
    try {
        const session = await getAuthSession();
        if (!session) 
            return { success: false, message: "Authentication error" };

        await connectDb();

        // Check if the user is already following the target user
        const isFollowing = await User.findOne({
            _id: session.user.id,
            followings: followId,
        });

        if (isFollowing) {
            // If already following, remove the relationship
            const unfollowUser = await User.findByIdAndUpdate(session.user.id, {
                $pull: { followings: followId },
            });

            const unfollowedUser = await User.findByIdAndUpdate(followId, {
                $pull: { followers: session.user.id },
            });

            revalidatePath(pathname);

            if (unfollowUser && unfollowedUser)  
                return { success: true, message: "Unfollowed successfully" };
            else
                return { success: false, message: "Error while updating profile" };
        } else {
            // addToSet will add onlu a unique element into the array
            const followUser = await User.findByIdAndUpdate(session.user.id, {
                $addToSet: { followings: followId },
            });

            const followedUser = await User.findByIdAndUpdate(followId, {
                $addToSet: { followers: session.user.id },
            });

            // Create a new notification document
            const notif = await Notification.create({
                user: followId,
                author: session.user.id,
                link: `/profile/${followId}`,
                desc: `started following you.`,
            });

            await User.findByIdAndUpdate(notif.user, {
                $push: { notifications: notif._id },
                $set: { hasNotification: true },
            }, {new: true})

            
            if (followUser && followedUser)  
            return { success: true, message: "Followed successfully" };
            else
            return { success: false, message: "Error while updating profile" };
        }

    } catch (error:any) {
        throw new Error(`Failed to follow/unfollow user: ${error.message}`);
    }finally{
        revalidatePath(pathname);
    }
};



export const getNotifications = async () => {
    try{
        const session = await getAuthSession()
        if(!session) 
            return { success: false, message: "Authentication error"}

        await connectDb();

        const notifs = await User.findById(session.user.id)
        .select("_id name username image notifications hasNotifications")
        .populate({
            path: "notifications",
            model: Notification,
            populate: {
                path: 'author',
                model: User,
                select: '_id name username image'
            },
            options: {
                sort: { createdAt: -1 }
            }
        })

        if(notifs){
            return {notifs, success: true, message: "User fetched successfully"}
        }else{
            return {success: false, message: "Error while fetching user data"}
        }

    }catch(error:any){
        throw new Error(`Failed to fetch User data: ${error.message}`)
    }
}
