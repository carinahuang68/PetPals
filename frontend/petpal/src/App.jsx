import { useState } from 'react'
import CustomizationForm from './components/CustomizationForm'
import ChatCompanion from './components/ChatCompanion'
import './App.css'

function App() {
  const [companion, setCompanion] = useState(null)

  const handleCustomize = (customizationData) => {
    setCompanion(customizationData)
  }
 
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🐾 PetPals - AI Companion</h1>
        <p>Turn your doll into a personalized AI companion</p>
      </header>

      <main className="app-main">
        {!companion ? (
          <div className="setup-steps">
            <CustomizationForm onCustomize={handleCustomize} />
          </div>
        ) : (
          <div className="chat-view">
            <button className="back-btn" onClick={() => setCompanion(null)}>← New Companion</button>
            <ChatCompanion companion={companion} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
