import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register a user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all fields" });
        }

        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const user = new User(req.body);
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ username: user.username, email: user.email, id: user._id, token });
    } catch (err) {
        console.error("Error in register: ", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user || (await user.matchPassword(password)) === false) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const token = generateToken(user._id);
        res.json({ username: user.username, email: user.email, id: user._id, token });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
})

router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
})

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

export default router;