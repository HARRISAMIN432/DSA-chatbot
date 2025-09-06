import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const chat = mongoose.model("Chats", chatSchema);
export default chat;
