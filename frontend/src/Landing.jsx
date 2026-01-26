import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1>🐾 Welcome to PetPals</h1>
                <img src="/petpals1.png" alt="" className='landing-image' />
                {/* <img src="/petpals.png" alt="PetPals logo" /> */}
                <p className="tagline">Turn your plushies into personalized AI companions</p>

                <button
                    className="cta-btn make-petpal-btn"
                    onClick={() => navigate('/register')}
                >
                    Make Your Own PetPal!
                </button>
            </div>
        </div>
    );
}
