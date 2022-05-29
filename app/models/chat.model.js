import { model, Schema } from "mongoose";
const chatSchema = new Schema(
  {
    message: String,
    name: String,
    received: Boolean,
  },
  { timestamps: true }
);

const Chats = model("Chats", chatSchema, "chats");
export default Chats;
