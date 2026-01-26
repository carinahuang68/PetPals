import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import API_URL from '../config/api';
import './PalsList.css';

export default function PalsList() {
    const { token, logout, user } = useContext(AuthContext);
    const [pals, setPals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedPal, setSelectedPal] = useState(null);
    const [infoPalId, setInfoPalId] = useState(null);

    useEffect(() => {
        if (token) {
            fetchPals();
        }
    }, [token]);

    const fetchPals = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/pals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
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

    useEffect(() => {
        const handleClickOutside = () => setInfoPalId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDelete = async (palId) => {
        const confirmed = window.confirm('Are you sure you want to delete this pal?');
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/api/pals/${palId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete pal');
            }

            // Optimistically update UI
            setPals(prev => prev.filter(pal => pal._id !== palId));
        } catch (err) {
            console.error('Error deleting pal:', err);
            alert('Failed to delete pal');
        }
    };


    if (loading) {
        return <div className="pals-container"><p>Loading your pals...</p></div>;
    }

    return (
        <div className="pals-container">
            <div className="pals-header-row">
                <div>
                    <h2 className="pals-page-title">Your PetPals</h2>
                    {user && <p className="welcome-text">Welcome back, {user.username}! 👋 <a href="#" className="logout-link" onClick={(e) => { e.preventDefault(); logout(); navigate('/'); }}>Logout</a></p>}
                </div>
                <div className="header-actions">
                    <button
                        className="add-pal-btn"
                        onClick={() => navigate('/customize')}
                    >
                        + Add Pal
                    </button>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {pals.length === 0 ? (
                <p className="no-pals">You haven't created any pals yet!</p>
            ) : (
                <div className="pals-grid">
                    {pals.map(pal => (
                        <div key={pal._id} className="pal-card">
                            {/* Delete button */}
                            <button
                                className="delete-pal-btn"
                                onClick={() => handleDelete(pal._id)}
                                aria-label="Delete pal"
                            >
                                ✕
                            </button>

                            {/* Info button */}
                            <button
                                className="info-pal-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setInfoPalId(infoPalId === pal._id ? null : pal._id);
                                }}
                                aria-label="Pal info"
                            >
                                ℹ️
                            </button>
                            {infoPalId === pal._id && (
                                <div
                                    className="pal-info-popover"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <strong >{pal.name}</strong>

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
                                        onClick={() => handleDelete(pal._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            )}


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

            {/* Modal */}
            {selectedPal && (
                <div
                    className="pal-modal-overlay"
                    onClick={() => setSelectedPal(null)}
                >
                    <div
                        className="pal-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-modal-btn"
                            onClick={() => setSelectedPal(null)}
                        >
                            ✕
                        </button>

                        <h2>{selectedPal.name}</h2>

                        <div className="pal-modal-section">
                            <strong>Role</strong>
                            <p>{selectedPal.role}</p>
                        </div>

                        <div className="pal-modal-section">
                            <strong>Personality Description</strong>
                            <p>
                                {selectedPal.personality?.description ||
                                    "No description provided"}
                            </p>
                        </div>

                        <div className="pal-modal-section">
                            <strong>Traits</strong>
                            {selectedPal.personality?.traits?.length > 0 ? (
                                <ul>
                                    {selectedPal.personality.traits.map((trait, i) => (
                                        <li key={i}>{trait}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>None</p>
                            )}
                        </div>

                        <div className="pal-modal-section">
                            <strong>Tone</strong>
                            <p>{selectedPal.personality?.tone}</p>
                        </div>

                        <div className="pal-modal-section">
                            <strong>Created</strong>
                            <p>
                                {new Date(selectedPal.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Logout Button */}
            <div className="mobile-logout-container">
                <button
                    className="mobile-logout-btn"
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );

}
