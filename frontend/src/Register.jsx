// import { useState, useContext } from 'react';
// import { AuthContext } from './contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { register } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (!username.trim() || !email.trim() || !password.trim()) {
//       setError('Please fill in all fields');
//       return;
//     }

//     try {
//       await register(username, email, password);
//       navigate('/customize');
//     } catch (err) {
//       setError(err.message || 'Sign up failed. Please try again.');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Create Account</h2>
//         {error && <div className="error-message">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Username</label>
//             <input 
//               type="text"
//               className="form-control"
//               placeholder="Choose a username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Email address</label>
//             <input 
//               type="email"
//               className="form-control"
//               placeholder="your@email.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input 
//               type="password"
//               className="form-control"
//               placeholder="Enter a strong password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary">Sign Up</button>
//           <p className="auth-link">
//             Already have an account? <a href="" onClick={() => navigate('/login')}>Login here</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }
