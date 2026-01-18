const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample chat endpoint
app.post('/api/chat', (req, res) => {
  const { message, companionName } = req.body;
  // Placeholder AI response - replace with actual AI service later
  const responses = [
    `That's interesting! I appreciate you sharing that with me.`,
    `I'm here to listen. Tell me more!`,
    `Thanks for chatting with me, ${companionName}!`,
    `That sounds wonderful! How does that make you feel?`
  ];
  const response = responses[Math.floor(Math.random() * responses.length)];
  res.json({ response });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
