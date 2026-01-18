import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CustomizationForm from './components/CustomizationForm'
import ChatCompanion from './components/ChatCompanion'
import PalsList from './components/PalsList'
import Landing from './Landing'
import './App.css'

function AppContent() {
  const [companion, setCompanion] = useState(null)

  const handleCustomize = (customizationData) => {
    setCompanion(customizationData)
  }
 
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🐾 PetPals - AI Companion</h1>
        <p>Turn your plushie into a personalized AI companion</p>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pals" element={<PalsList />} />
          <Route 
            path="/customize" 
            element={
              !companion ? (
                <div className="setup-steps">
                  <CustomizationForm onCustomize={handleCustomize} />
                </div>
              ) : (
                <div className="chat-view">
                  <button className="back-btn" onClick={() => setCompanion(null)}>← New Companion</button>
                  <ChatCompanion companion={companion} />
                </div>
              )
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
