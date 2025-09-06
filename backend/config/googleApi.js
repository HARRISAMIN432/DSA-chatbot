import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

console.log(process.env.GEMINI_KEY);

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
});
