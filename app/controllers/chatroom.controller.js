import { ChatRoom } from "../models";
import pusher from "../libraries/pusher";

export const getChatRoom = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const allChatRooms = await ChatRoom.find({
      $or: [
        {
          receiver: _id,
        },
        {
          sender: _id,
        },
      ],
    })
      .sort("-createdAt")
      .populate({
        path: "receiver",
        select: "fullName role secondaryRole profileImage",
      })
      .populate({
        path: "sender",
        select: "fullName role secondaryRole profileImage",
      });
    return res.status(200).json(allChatRooms);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const createChatRoom = async (req, res, next) => {
  const { name, sender, receiver } = req?.body;
  if (!name || !sender || !receiver) {
    return res.status(401).json({ message: "Incomplete data" });
  }
  try {
    const newChatRoom = await ChatRoom.create({
      name,
      sender,
      receiver,
    });
    if (!newChatRoom)
      return res.status(401).json({ message: "Couldn't create the room" });
    const newRoom = await ChatRoom.findOne({
      _id: newChatRoom._id,
    })
      .populate({
        path: "receiver",
        select: "fullName role secondaryRole profileImage",
      })
      .populate({
        path: "sender",
        select: "fullName role secondaryRole profileImage",
      });
    pusher.trigger(`${receiver}`, "new-chatroom", {
      ...newRoom._doc,
    });
    return res.status(200).json(newChatRoom);
  } catch (error) {
    return res.status(500).json(error);
  }
};
