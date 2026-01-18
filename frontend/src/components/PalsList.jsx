import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PalsList.css';

export default function PalsList() {
  const [pals, setPals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPals();
  }, []);

  const fetchPals = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/pals', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pals');
      }

      const data = await response.json();
      setPals(data);
      setError('');
    } catch (err) {
      console.error('Error fetching pals:', err);
      setError('Failed to load your pals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="pals-container"><p>Loading your pals...</p></div>;
  }

  return (
    <div className="pals-container">
      <h2>Your PetPals</h2>
      {error && <p className="error-message">{error}</p>}
      
      {pals.length === 0 ? (
        <p className="no-pals">You haven't created any pals yet!</p>
      ) : (
        <div className="pals-grid">
          {pals.map(pal => (
            <div key={pal._id} className="pal-card">
              <div className="pal-image">
                <img src={pal.image} alt={pal.name} />
              </div>
              <div className="pal-info">
                <h3>{pal.name}</h3>
                <p className="pal-role">{pal.role}</p>
                <button 
                  className="chat-btn"
                  onClick={() => navigate(`/chat/${pal._id}`)}
                >
                  💬 Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
