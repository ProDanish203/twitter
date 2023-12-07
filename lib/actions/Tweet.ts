"use server"
import { connectDb } from "@/lib/config/db";
import User from "@/lib/models/User";
import Tweet from "@/lib/models/Tweet";
import Notification from "@/lib/models/Notification";
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
        // const session = await getAuthSession()
        // if(!session) 
        //     return { success: false, message: "Authentication error"}
    
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

            const parentAuthorId = parentTweet.author;
            if(parentAuthorId != session.user.id){
                // Create a new notification document
                const notif = await Notification.create({
                    user: parentAuthorId,
                    author: session.user.id,
                    link: `/tweet/${tweet.parentId}`,
                    desc: `commented on your tweet.`,
                });

                await User.findByIdAndUpdate(notif.user, {
                    $push: { notifications: notif._id },
                    $set: { hasNotification: true },
                }); 
            }
            
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

        // Create or remove a notification when the tweet is liked or unliked
        if (updatedTweet) {
            const authorId = await updatedTweet.author;

            if(authorId != session.user.id){

                if (!isLiked) {
                    // Create a new notification document
                    const notif = await Notification.create({
                        user: authorId,
                        author: session.user.id,
                        link: `/tweet/${id}`,
                        desc: `liked your tweet.`,
                    });

                    await User.findByIdAndUpdate(notif.user, {
                        $push: { notifications: notif._id },
                        $set: { hasNotification: true },
                    }, {new: true})
                } 
                else {
                    // Find and delete the notification by its _id
                    const notif = await Notification.findOneAndDelete({
                        user: authorId,
                        author: session.user.id,
                        desc: `liked your tweet.`,
                    });
                    // Update the user's notifications
                    if (notif) {
                        await User.findByIdAndUpdate(authorId, {
                            // @ts-ignore
                            $pull: { notifications: notif._id },
                            $set: { hasNotification: true },
                        });
                    }
                }
            }
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