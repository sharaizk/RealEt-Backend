import { model, Schema, Types } from "mongoose";
const chatRoomSchema = new Schema(
  {
    name: String,
    sender: { type: Types.ObjectId, ref: "User" },
    receiver: {
      type: Types.ObjectId,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

chatRoomSchema.virtual("receiver_builder", {
  ref: "Builder",
  localField: "receiver",
  foreignField: "_id",
  justOne: true,
});

const ChatRooms = model("ChatRooms", chatRoomSchema);
export default ChatRooms;
