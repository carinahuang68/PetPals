import { useState, useRef, useEffect } from 'react';

function ChatCompanion({ companion }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages([...messages, { type: 'user', text: userMessage }]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          companionName: companion.name,
          personality: companion.personality,
          role: companion.role
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'companion', text: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'companion', text: 'Sorry, I had trouble responding. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-companion">
      <div className="companion-header">
        <h2>Chat with {companion.name}</h2>
        <p className="companion-role">{companion.personality} {companion.role}</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="initial-message">
            <p>Hi! I'm {companion.name}, your new companion. How are you doing today? 🎉</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && <div className="message companion loading">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading || !inputValue.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatCompanion;
