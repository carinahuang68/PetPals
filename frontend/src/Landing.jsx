import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>🐾 Welcome to PetPals</h1>
        <p className="tagline">Turn your plushie into a personalized AI companion</p>
        
        <button 
          className="cta-btn make-petpal-btn"
          onClick={() => navigate('/customize')}
        >
          Make Your Own PetPal!
        </button>
      </div>
    </div>
  );
}
