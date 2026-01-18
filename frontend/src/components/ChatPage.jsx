import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatPage.css';

export default function ChatPage() {
  const { palId } = useParams();
  const navigate = useNavigate();
  const [pal, setPal] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchPal();
  }, [palId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchPal = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/pals/${palId}`);
      if (!response.ok) throw new Error('Failed to fetch pal');
      const data = await response.json();
      setPal(data);
    } catch (err) {
      console.error('Error fetching pal:', err);
      setError('Failed to load pal');
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
      const response = await fetch(`http://localhost:3000/api/chat/${palId}/message`, {
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
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message ai">
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
