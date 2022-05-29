import { Router } from "express";
import {
  createChatRoom,
  getChatRoom,
} from "../controllers/chatroom.controller";
import { userAuth } from "../middlewares/auth.middleware";
const router = Router();

router.post("/new-chatroom", createChatRoom);
router.get("/my-rooms", userAuth, getChatRoom);

export default router;
