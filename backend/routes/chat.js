import express from "express";
import { protect } from "../middleware/auth.js";
import Chat from "../models/Chat.js";
import Pal from "../models/Pal.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to ensure history alternates correctly
const prepareGeminiHistory = (chats) => {
  const history = [];
  let lastRole = null;

  for (const chat of chats) {
    const geminiRole = chat.role === "ai" ? "model" : "user";
    
    // Gemini crashes if two roles of the same type are adjacent. 
    // We combine consecutive messages from the same role.
    if (geminiRole === lastRole) {
      history[history.length - 1].parts[0].text += `\n${chat.content}`;
    } else {
      history.push({
        role: geminiRole,
        parts: [{ text: chat.content }]
      });
      lastRole = geminiRole;
    }
  }
  return history;
};

// POST /api/ai/:palId/message
router.post("/:palId/message", protect, async (req, res) => {
  try {
    const { palId } = req.params;
    const userId = req.user._id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // 1️⃣ Save User's message to DB immediately
    await Chat.create({ palId, userId, role: "user", content: message });

    // 2️⃣ Fetch Pal details for the System Prompt
    const pal = await Pal.findById(palId);
    if (!pal) return res.status(404).json({ error: "Pal not found" });

    // 3️⃣ Fetch conversation history (last 12 messages)
    const rawHistory = await Chat.find({ palId, userId })
      .sort({ timestamp: -1 })
      .limit(12)
      .lean();

    // 4️⃣ Format history (Reversing because Mongo 'limit' takes the newest)
    // We remove the very last message (the current user msg) because sendMessage adds it automatically
    const formattedHistory = prepareGeminiHistory(rawHistory.reverse()).slice(0, -1);

    const convo_instructions = 
        `- Respond to the user based on the role, personality, and traits described above.
        - Keep responses concise, natural, and as if talking to a real person. 
        For example, if your role is a friend or a nurse, your responses should be warm and supportive, 
        unless the personality explicitly states a contradicting trait.
        - Use the user's message to guide your reply.`;


    // 5️⃣ Initialize Gemini 2.5 Flash with System Instructions
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: `
          Your role is ${pal.role}. 
          Name: ${pal.name}.
          Overall personality: ${pal.personality.description}. 
          Traits: ${pal.personality.traits.join(", ")}.
          Speaking Style: ${pal.personality.tone}.
          Conversation intructions: ${convo_instructions}.
        `.trim() }]
      }
    });

    // 6️⃣ Execute Chat
    const chatSession = model.startChat({ history: formattedHistory });
    const result = await chatSession.sendMessage(message);
    const aiReply = result.response.text();

    // 7️⃣ Save AI's response to DB
    const savedAiChat = await Chat.create({ 
      palId, 
      userId, 
      role: "ai", 
      content: aiReply 
    });

    res.json({ aiMessage: aiReply, chatId: savedAiChat._id });

  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "The AI companion is resting. Try again shortly." });
  }
});

export default router;