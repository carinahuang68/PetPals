import mongoose from "mongoose";

const palSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL or base64
        required: true
    },
    role: {
        type: String,
        default: "friend" // friend, therapist, mom, nurse, etc.
    },
    personality: {
        description: {
            type: String // Ex. A warm, slightly sarcastic friend who checks in daily and uses casual language.
        },
        traits: {
            type: [String], // 
            default: []
        },
        tone: {
            type: String,
            default: "casual"
        }
    },
    // commands: {  // what they should do for me
    //     type: [String], 
    //     default: [] // "go to sleep at 9pm", "take meds"
    // },
    // notificationsEnabled: {
    //     type: Boolean,
    //     default: false
    // },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: new mongoose.Types.ObjectId('000000000000000000000000')
    }
}, {
    timestamps: true
});

const Pal = mongoose.model("Pal", palSchema);
export default Pal;
