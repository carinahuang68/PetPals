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
            type: String,
            required: true // Making this required since it's core to the AI
        },
        // NEW: Background field to store the origin story
        background: {
            type: String,
            default: ""
        },
        traits: {
            type: [String],
            default: []
        },
        // CHANGED: Renamed 'tone' to 'speakingStyle' to match your form
        speakingStyle: {
            type: String,
            default: "Friendly & Casual"
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const Pal = mongoose.model("Pal", palSchema);
export default Pal;
