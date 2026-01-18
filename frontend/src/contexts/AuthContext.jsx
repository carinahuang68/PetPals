// import { createContext, useState } from 'react';

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token') || null);

//   const login = async (email, password) => {
//     try {
//       const response = await fetch('http://localhost:3000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Login failed');
//       }

//       const data = await response.json();
//       setToken(data.token);
//       setUser(data);
//       localStorage.setItem('token', data.token);
//       return data;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const register = async (username, email, password) => {
//     try {
//       const response = await fetch('http://localhost:3000/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, email, password })
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || 'Registration failed');
//       }

//       const data = await response.json();
//       setToken(data.token);
//       setUser(data);
//       localStorage.setItem('token', data.token);
//       return data;
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
