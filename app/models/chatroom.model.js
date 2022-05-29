import { model, Schema, Types } from "mongoose";
const chatRoomSchema = new Schema(
  {
    name: String,
    sender: { type: Types.ObjectId, ref: "User" },
    receiver: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ChatRooms = model("ChatRooms", chatRoomSchema);
export default ChatRooms;
