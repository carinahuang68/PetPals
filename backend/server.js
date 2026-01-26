// const express = require('express');
import express from 'express';
import { connectDB } from './config/db.js';
import palRoutes from './routes/pal.routes.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js'
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

// CORS configuration for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || '*'
        : true, // true allows the origin of the request, which is fine for local dev
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '100mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/pals', palRoutes);
app.use('/api/chat', chatRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "/frontend/dist"))); //makes content of dist folder available to client via http requests
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}


app.listen(PORT, "0.0.0.0", async () => {
    console.log("Server started at http://localhost:" + PORT);
    await connectDB();
})

