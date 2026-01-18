import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>🐾 Welcome to PetPals</h1>
        <p className="tagline">Turn your plushie into a personalized AI companion</p>
        
        <div className="cta-buttons">
          <button 
            className="cta-btn login-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="cta-btn signup-btn"
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
