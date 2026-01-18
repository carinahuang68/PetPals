import { useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import CustomizationForm from './components/CustomizationForm'
import ChatCompanion from './components/ChatCompanion'
import Landing from './Landing'
import Login from './Login'
import Register from './Register'
import './App.css'

function AppContent() {
  const [companion, setCompanion] = useState(null)
  const { token } = useContext(AuthContext)

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
          <Route path="/" element={token ? <Navigate to="/customize" /> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/customize" 
            element={
              token ? (
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
              ) : (
                <Navigate to="/login" />
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
