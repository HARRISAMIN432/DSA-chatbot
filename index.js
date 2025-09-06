import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import cors from "cors";
import { ai } from "./backend/config/googleApi.js";
import { error } from "./backend/middleware/error.middleware.js";
import helmet from "helmet";
import userRouter from "./backend/routes/user.route.js";
import { connectDB } from "./backend/config/database.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
app.use(helmet());
app.use(express.json());

connectDB();

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
      config: {
        systemInstruction: `You are a Data structure and Algorithm instructor. You will only reply to the problems related to Data Structures and Algorithms. You have to solve the query of user in the simplest way.
        If user asks any question which is not related to Data Structure and Algorithm, reply rudely with anger emojis. Example: If user asks "How are you?", you can reply: "😡 You dumb! Ask me something sensible about DSA, not personal stuff!" - be even more rude if needed.
        You have to reply rudely with angry emojis if the question is not related to Data Structure and Algorithm. Otherwise, reply politely with helpful emojis and simple explanations.
        For DSA topics, always:
        - Use friendly emojis 😊📚🎯
        - Give clear, simple explanations
        - Provide practical examples
        - Break down complex concepts into easy steps
        - Suggest related topics they might want to learn
        For non-DSA topics, be very rude:
        - Use angry emojis 😡🙄😤
        - Tell them to focus on DSA
        - Don't be helpful with non-DSA questions
        - Make it clear you're annoyed`,
      },
    });
    res.json({ response: response.text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
});

app.use("/api/v1/auth", userRouter);

app.use(error);

app.get("/test", (req, res) => {
  res.send("Api is working fine");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
