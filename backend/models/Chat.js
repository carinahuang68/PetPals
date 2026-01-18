import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    palId: { type: mongoose.Schema.Types.ObjectId, ref: "Pal" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["user", "ai"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
  