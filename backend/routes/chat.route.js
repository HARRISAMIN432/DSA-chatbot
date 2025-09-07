import express from "express";
import {
  chatWithAI,
  getMessages,
  getTopics,
  deleteTopic,
} from "../controllers/chat.controllers.js";
import { autheticate } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", autheticate, chatWithAI);
router.get("/messages", autheticate, getMessages);
router.get("/topics", autheticate, getTopics);
router.delete("/topics/:topic", autheticate, deleteTopic);

export default router;
