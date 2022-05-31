import { Message } from "../models";
import pusher from "../libraries/pusher";

export const GetMessages = async (req, res) => {
  const { chatRoom } = req?.query;
  if (!chatRoom)
    return res.status(401).json({ message: "Please provide chatroom id" });
  try {
    const allMessages = await Message.find({ chatRoom: chatRoom });
    return res.status(200).json({messages:allMessages});
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const SendMessage = async (req, res) => {
  const { chatRoom, message, sender, receiver } = req?.body;
  if (!chatRoom || !message || !sender || !receiver)
    return res.status(401).json({ message: "Please provide chatroom id" });
  try {
    const timeStamp = new Date().getTime();

    const newMessage = await Message.create({
      chatRoom,
      message,
      sender,
      receiver,
      timeStamp,
    });
    if (!newMessage)
      return res.status(401).json({ message: "Couldn't send the message" });
    pusher.trigger(`${chatRoom}`, "message-received", {
      message: message,
      sender: sender,
      receiver: receiver,
      timeStamp: timeStamp,
    });
    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(500).json(error);
  }
};
