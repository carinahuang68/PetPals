# 🐾 PetPals - Quick Start Guide

## How to Run the App

### Step 1: Install Backend Dependencies
Open a terminal/PowerShell and run:
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
Open another terminal/PowerShell and run:
```bash
cd frontend/petpal
npm install
```

### Step 3: Start the Backend Server
In the backend terminal, run:
```bash
npm run dev
```
You should see: `Server is running on http://localhost:3000`

### Step 4: Start the Frontend Dev Server
In the frontend terminal, run:
```bash
npm run dev
```
You should see something like: `VITE v7.2.4 ready in XXX ms → Local: http://localhost:5173/`

### Step 5: Open in Browser
Open your browser and go to: **http://localhost:5173/**

---

## User Flow

1. **Upload Photo**: Take/upload a picture of your doll or plushie
2. **Customize**: 
   - Give your companion a name
   - Choose personality (Friendly, Calm, Playful, Supportive)
   - Select role (Friend, Therapist, Mentor, Adventure Buddy)
   - Set notification preference (Daily Check-in, Reminders, None)
3. **Chat**: Start chatting with your AI companion!

---

## App Features

✅ Photo upload with preview  
✅ Customizable companion personalities  
✅ Real-time chat interface  
✅ Smooth animations  
✅ Responsive design  
✅ Beautiful gradient UI  

---

## API Endpoints

### Backend (http://localhost:5000)

**POST /api/chat**
- Send a message and get a response from the companion
- Body: `{ message: string, companionName: string, personality: string, role: string }`
- Response: `{ response: string }`

**GET /api/health**
- Check if backend is running
- Response: `{ status: "Backend is running!" }`

---

## Project Structure

```
frontend/petpal/
├── src/
│   ├── components/
│   │   ├── PhotoUpload.jsx      # Upload doll photo
│   │   ├── CustomizationForm.jsx # Configure companion
│   │   └── ChatCompanion.jsx    # Chat interface
│   ├── App.jsx                  # Main component
│   ├── App.css                  # Styled components
│   └── main.jsx
├── package.json
└── vite.config.js

backend/
├── server.js                    # Express server
└── package.json
```

---

## Troubleshooting

### Port 5000 already in use?
```bash
# Kill process on port 5000 (Windows PowerShell)
Get-Process -Name node | Stop-Process -Force
```

### Port 5173 already in use?
Vite will automatically use the next available port (5174, 5175, etc.)

### CORS errors?
Make sure the backend is running on `http://localhost:5000` and frontend can reach it.

---

## Next Steps (For Hackathon Enhancement)

1. **Integrate Real AI**: Replace placeholder responses with OpenAI API, Claude, or similar
2. **Image Recognition**: Analyze the uploaded doll image to auto-suggest personality traits
3. **Persistent Dashboard**: Save companions to a database (MongoDB, Firebase)
4. **Notifications**: Implement scheduled notifications/check-ins
5. **Voice Chat**: Add text-to-speech and speech-to-text
6. **User Accounts**: Add authentication and user profiles
---

Enjoy building! 🚀
