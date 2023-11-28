import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already in use"]
    },
    name: String,
    emailVerfied: {
        type: Boolean,
        default: false
    },
    bio: String,
    password: String,
    location: String,
    image: String,
    banner: String,
    hasNotifications: {
        type: Boolean,
        default: false
    },
    onBoarded: {
        type: Boolean,
        default: false
    },
    followers:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    ],    
    followings:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    ],    
    tweets:[
        {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
    ],    
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
    ],    
    notfications: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
    ]
},
{timestamps: true}
)

const User = models.User || model('User', UserSchema);

export default User;