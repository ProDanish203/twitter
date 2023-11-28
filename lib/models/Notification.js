import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    desc: String,
},
{timestamps: true}
)

const Notification = models.Notification || model('Notification', NotificationSchema);

export default Notification;