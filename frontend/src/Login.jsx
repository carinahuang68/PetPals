import { useState, useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await login(email, password);
            navigate('/pals');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials and try again.');
        }
    }
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <input 
                            type="email"
                            className="form-control"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required/>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <p className="auth-link">
                        Don't have an account? <a href="#" onClick={() => navigate('/register')}>Sign up here</a>
                    </p>
                </form>
            </div>
        </div>
    )
}