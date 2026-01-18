import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract
            token = req.headers.authorization.split(" ")[1];
            console.log("Token found: ", token);

            // Verify
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token: ", decoded);

            // Find user in DB
            req.user = await User.findById(decoded.id).select("-password");
            console.log("Authenticated user: ", req.user);

            return next();
        } catch (error) {
            console.error("Token verification failed: ", error.message);
            return res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    } else {
        console.error("No token provided in request");
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
}