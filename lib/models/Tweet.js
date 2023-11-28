import { Schema, model, models } from "mongoose";

const TweetSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    caption: {
        type: String,
        required: [true, "Caption is required"]
    },
    image: String,
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    children:[
        {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
    ],    
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    shares: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    ],    
    shareCount: {
        type: Number,
        default: 0
    },
},
{timestamps: true}
)

const Tweet = models.Tweet || model('Tweet', TweetSchema);

export default Tweet;