import { model, Schema, Types } from "mongoose";
const messageSchema = new Schema({
  chatRoom: {
    type: Types.ObjectId,
    ref: "ChatRooms",
  },
  message: String,
  sender: {
    type: Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: Types.ObjectId,
    ref: "User",
  },
  timeStamp: Number,
});

const Messages = model("Messages", messageSchema);
export default Messages;
