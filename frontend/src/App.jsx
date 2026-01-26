import { useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import CustomizationForm from './components/CustomizationForm'
import ChatCompanion from './components/ChatCompanion'
import PalsList from './components/PalsList'
import ChatPage from './components/ChatPage'
import Landing from './Landing'
import './App.css'
import UpdatePal from './components/UpdatePal'
import Register from './Register'
import Login from './Login'
import { AuthProvider, AuthContext } from './contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// Protected Route Component
function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AppContent() {
    const [companion, setCompanion] = useState(null)
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const showHeader = !location.pathname.startsWith('/chat');

    const handleCustomize = (customizationData) => {
        setCompanion(customizationData)
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="app-container">
            {showHeader && (
                <header className="app-header">
                    <div className="header-content">
                        <div>
                            <h1>🐾 PetPals - AI Companion</h1>
                            <p>Turn your plushies into personalized AI companions</p>
                        </div>
                        
                    </div>
                </header>
            )}

            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route path="/pals" element={
                        <ProtectedRoute>
                            <PalsList />
                        </ProtectedRoute>
                    } />
                    <Route path="/chat/:palId" element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/pals/:id/updatePal" element={
                        <ProtectedRoute>
                            <UpdatePal />
                        </ProtectedRoute>
                    } />
                    <Route
                        path="/customize"
                        element={
                            <ProtectedRoute>
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
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    )
}

export default App
