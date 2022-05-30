import { ChatRoom } from "../models";

export const getChatRoom = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const allChatRooms = await ChatRoom.find({
      $or: [
        {
          user1: userId,
        },
        {
          user2: userId,
        },
      ],
    })
      .populate({
        path: "receiver",
        select: "fullName role secondaryRole profileImage",
      })
      .populate({ path: "sender", select: "fullName role secondaryRole" });
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
    const chatRoomExists = await ChatRoom.find({ sender, receiver });
    if (chatRoomExists)
      return res.status(401).json({ message: "Chat Room Already Exists" });
    const newChatRoom = await ChatRoom.create({
      name,
      sender,
      receiver,
    });
    if (!newChatRoom)
      return res.status(401).json({ message: "Couldn't create the room" });

    return res.status(200).json(newChatRoom);
  } catch (error) {
    return res.status(500).json(error);
  }
};
