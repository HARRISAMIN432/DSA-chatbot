import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true }
);

const chat = mongoose.model("Chats", chatSchema);
export default chat;
