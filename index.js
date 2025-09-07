import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import cors from "cors";
import chatRoutes from "./backend/routes/chat.route.js";
import { error } from "./backend/middleware/error.middleware.js";
import helmet from "helmet";
import userRouter from "./backend/routes/user.route.js";
import { connectDB } from "./backend/config/database.js";

const app = express();

app.use(
  cors({
    origin: "https://dsa-chatbot-xi.vercel.app",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());

connectDB();

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/chat", chatRoutes);
app.use(error);

app.get("/test", (req, res) => {
  res.send("Api is working fine");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
