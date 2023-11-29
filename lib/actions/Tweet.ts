"use server"
import { connectDb } from "@/lib/config/db";
import User from "@/lib/models/User";
import Tweet from "@/lib/models/Tweet";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/utils/auth";

interface TweetProps{
    caption: string;
    image?: string;
    parentId?: string; 
    pathname: string;
}

export const getFeed = async (currentUser: string) => {
    try{
        await connectDb();
        // const feed = await Tweet.find({author: {$ne: currentUser}});
        const feed = await Tweet.find({ parentId: { $exists: false } })
        .populate({path: 'author', model: User, select: '_id name username image'})
        .sort({createdAt: -1})

        if(feed){
            return {feed, success: true, message: "Tweet fecthed successfully"}
        }else{
            return {success: false, message: "Error while fetching tweet"}
        }

    }catch(error:any){
        throw new Error(`Failed to fetch tweet: ${error.message}`)
    }
}

export const getTweet = async (id: string) => {
    try{
        const session = await getAuthSession()
        if(!session) 
            return { success: false, message: "Authentication error"}
    
        await connectDb();
        const tweet = await Tweet.findById(id)
        .populate({
            path: 'author', 
            model: User, 
            select: '_id name username image'
        })
        .populate({
            path: 'children', 
            model: Tweet, 
            populate: {
                path: 'author',
                model: User,
                select: '_id name username image'
            }
        })

        if(tweet){
            return {tweet, success: true, message: "Tweet fecthed successfully"}
        }else{
            return {success: false, message: "Error while fetching tweet"}
        }

    }catch(error:any){
        throw new Error(`Failed to fetch tweet: ${error.message}`)
    }
}


export const addTweet = async ({caption, image, pathname, parentId}: TweetProps) => {
    try{
        const session = await getAuthSession()
        if(!session) 
            return { success: false, message: "Authentication error"}
    
        await connectDb();
        const tweet = await Tweet.create({
            author: session.user.id,
            caption, image: image || '',
            parentId: parentId || undefined
        })

        if(parentId){
            const parentTweet = await Tweet.findByIdAndUpdate(parentId, {
                $push: { children: tweet._id },
            });
            if(!parentTweet)
                return {success: false, message: "Error while composing tweet"}
            // Updating the user notifications
            const parentAuthorId = parentTweet.author;
            await User.findByIdAndUpdate(parentAuthorId, {
                $push: { notifications: tweet._id },
                $set: { hasNotification: true },
            });
        }
    
        await User.findByIdAndUpdate(session.user.id, {
            $push: { tweets: tweet._id },
        })

        revalidatePath(pathname)
        if(tweet){
            return {success: true, message: "Tweet composed successfully"}
        }else{
            return {success: false, message: "Error while composing tweet"}
        }

    }catch(error:any){
        throw new Error(`Failed to compose tweet: ${error.message}`)
    }
}


export const likeTweet = async (id:string, pathname:string) => {
    try{
        const session = await getAuthSession()
        if(!session) 
            return { success: false, message: "Authentication error"}
    
        await connectDb();
        const tweet = await Tweet.findById(id)
        if(!tweet)
            return {success: true, message: "Tweet not found"}
        
        // Checks if the user has already liked the tweet or not 
        const isLiked = tweet.likedBy.includes(session.user.id);

        const updateQuery = isLiked 
        ? { $pull: { likedBy: session.user.id}, $inc: {  likes: -1}}
        : { $addToSet: { likedBy: session.user.id}, $inc: {  likes: 1}}

        const updatedTweet = await Tweet.findByIdAndUpdate(id, updateQuery, {new: true})
        // Updating the user notifications
        if (!isLiked && updatedTweet) {
            const authorId = updatedTweet.author;
            await User.findByIdAndUpdate(authorId, {
                $push: { notifications: id },
                $set: { hasNotification: true },
            });
        }

        revalidatePath(pathname)
        if(updatedTweet){
            return {success: true, message: "Tweet liked successfully"}
        }else{
            return {success: false, message: "Error while liking tweet"}
        }

    }catch(error:any){
        throw new Error(`Failed to like tweet: ${error.message}`)
    }
}