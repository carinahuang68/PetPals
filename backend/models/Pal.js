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
            type: String
        },
        traits: {
            type: [String],
            default: []
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
        required: true
    }
}, {
    timestamps: true
});

const Pal = mongoose.model("Pal", palSchema);
export default Pal;
