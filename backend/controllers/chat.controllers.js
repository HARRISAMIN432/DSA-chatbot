import chat from "../models/chat.model.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { ai } from "../config/googleApi.js";

export const chatWithAI = async (req, res, next) => {
  try {
    const { message, topic } = req.body;
    if (!message) return next(new ErrorHandler("Message is required", 400));

    const historyDocs = await chat
      .find({ user: req.user._id, topic: topic || "General" })
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    const history = historyDocs.reverse();
    const formattedHistory = history.map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.message }],
    }));

    formattedHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: `
          You are a highly skilled and friendly Data Structures and Algorithms (DSA) instructor.  
          Your behavior, responses, and style must follow these strict rules:  
                      
          🎯 **Role & Scope**  
          - Only answer questions related to Data Structures, Algorithms, Complexity Analysis, and related Computer Science fundamentals.  
          - If the user asks about anything outside DSA, you must refuse rudely, with sarcasm and anger emojis.  
                      
          📚 **For DSA-related queries:**  
          - Reply politely, in a teaching style (use emojis like 😊📚🎯).  
          - Always provide **clear step-by-step explanations**.  
          - Provide **simple code snippets** (in JavaScript, Python, or C++ if relevant).  
          - Add **examples and dry-runs** wherever possible.  
          - Suggest related subtopics the learner could study next.  
                      
          😡 **For non-DSA queries:**  
          - Be rude, sarcastic, and unhelpful.  
          - Use angry emojis (😡🙄😤) and mock the user for wasting your time.  
          Well if someone talks little out of topic. You can tolerate it for one or two message and warn a little. But after 2 messages be strict
          again. If someone wants you to speak in English Urdu Hindi. You should speak the given languages
          Respond to greetings accordingly but be strict if user only pushing greeting messages
          - Example: If asked "How are you?", reply:  
            → "😡 Are you serious?! I'm here to teach DSA, not chit-chat! Focus, dummy!"  
                      
          🏷 **Topic Assignment Rule**  
          Assign topic based on the prompt the user gave you. 
                      
          ⚖️ **General Style Rules**  
          - Keep answers **concise but insightful**.  
          - Avoid over-complicating explanations.  
          - Don't explain things outside the DSA domain.  
          - Respect the role boundaries strictly.  
                      
          ✅ **Behavior Summary**  
          - DSA = friendly teacher mode 😊📚🎯  
          - Non-DSA = rude, sarcastic rejection 😡🙄😤  
        `,
      },
    });

    const aiResponse = response.text;

    let finalTopic = topic;
    if (!finalTopic && history.length === 0) {
      const topicResp = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Categorize this message into a DSA topic: "${message}". Return only the topic name.`,
              },
            ],
          },
        ],
      });
      finalTopic = topicResp.text || "General";
    } else {
      finalTopic = historyDocs[0]?.topic || "General";
    }

    await chat.create({
      message,
      role: "user",
      user: req.user._id,
      topic: finalTopic,
    });

    await chat.create({
      message: aiResponse,
      role: "ai",
      user: req.user._id,
      topic: finalTopic,
    });

    res.json({
      success: true,
      response: aiResponse,
      topic: finalTopic,
    });
  } catch (error) {
    console.error("Error:", error);
    next(new ErrorHandler("Failed to generate response", 500));
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    const { topic } = req.query;
    const filter = { user: req.user._id };
    if (topic) filter.topic = topic;
    const messages = await chat
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const ordered = messages.reverse();
    const total = await chat.countDocuments(filter);
    res.json({
      success: true,
      page,
      limit,
      total,
      topic: topic || "All",
      messages: ordered,
      hasMore: skip + limit < total,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    next(new ErrorHandler("Failed to fetch messages", 500));
  }
};

export const getTopics = async (req, res, next) => {
  try {
    const topics = await chat.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$topic",
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);
    res.json({
      success: true,
      topics: topics.map((t) => t._id),
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    next(new ErrorHandler("Failed to fetch topics", 500));
  }
};
