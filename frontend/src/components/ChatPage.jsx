import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import API_URL from '../config/api';
import './ChatPage.css';

export default function ChatPage() {
    const { palId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [pal, setPal] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (token) {
            fetchPal();
            fetchHistory();
        }
    }, [palId, token]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchPal = async () => {
        try {
            const response = await fetch(`${API_URL}/api/pals/${palId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch pal');
            const data = await response.json();
            setPal(data);
        } catch (err) {
            console.error('Error fetching pal:', err);
            setError('Failed to load pal');
        }
    };


    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this pal?')) return;

        try {
            const response = await fetch(`${API_URL}/api/pals/${palId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete pal');
            navigate('/pals');
        } catch (err) {
            console.error('Error deleting pal:', err);
            alert('Failed to delete pal');
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setShowInfo(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/api/chat/${palId}/history`);
            if (!response.ok) throw new Error('Failed to fetch history');
            const history = await response.json();
            setMessages(history);
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/chat/${palId}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'ai', content: data.aiMessage }]);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Failed to send message');
            setMessages(prev => prev.slice(0, -1)); // Remove the user message if request failed
        } finally {
            setLoading(false);
        }
    };

    if (!pal) {
        return <div className="chat-page-container"><p>Loading...</p></div>;
    }

    return (
        <div className="chat-page-container">
            <div className="chat-header">
                <button className="back-btn" onClick={() => navigate('/pals')}>← Back</button>
                <div className="pal-header-info">
                    <img src={pal.image} alt={pal.name} className="pal-avatar" />
                    <div>
                        <h2>{pal.name}</h2>
                        <p className="pal-role">{pal.role}</p>
                    </div>
                </div>

                <div className="chat-actions">
                    <button
                        className="info-pal-btn-chat"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowInfo(!showInfo);
                        }}
                    >
                        ⋮
                    </button>
                    {showInfo && (
                        <div
                            className="pal-info-popover chat-popover"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <strong>{pal.name}</strong>

                            <div className="popover-row">
                                <span><b>Role: </b> {pal.role}</span>
                            </div>

                            {pal.personality?.description && (
                                <p className="popover-description">
                                    <b>Description: </b>{pal.personality.description}
                                </p>
                            )}

                            {pal.personality?.traits?.length > 0 && (
                                <div className="popover-traits">
                                    <p><b>Traits: </b></p>
                                    {pal.personality.traits.map((trait, i) => (
                                        <span key={i} className="trait-chip">
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="popover-row">
                                <span><b>Speaking Style:</b></span>
                                <span>{pal.personality?.speakingStyle}</span>
                            </div>

                            <button
                                className="update-pal-btn"
                                onClick={() => navigate(`/pals/${pal._id}/updatePal`)}
                            >
                                ✏️ Update
                            </button>
                            <button
                                className="delete-pal-btn-popover"
                                onClick={handleDelete}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <p>👋 Hi! I'm {pal.name}, your {pal.role}.</p>
                        <p>Feel free to chat with me!</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                        {msg.role === 'ai' && (
                            <img src={pal.image} alt={pal.name} className="chat-message-avatar" />
                        )}
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                {loading && (
                    <div className="message ai">
                        <img src={pal.image} alt={pal.name} className="chat-message-avatar" />
                        <div className="message-content typing">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {error && <div className="error-banner">{error}</div>}

            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="chat-input"
                />
                <button type="submit" disabled={loading} className="send-btn">
                    {loading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    );

} 