import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './CustomizationForm.css';
import Combobox from './Combobox';

function CustomizationForm({ onCustomize }) {
    const { token } = useContext(AuthContext);
    const [name, setName] = useState('');
    // ... existing state
    const [personality, setPersonality] = useState({
        description: '',
        background: '', // New field
        traits: [],
        speakingStyle: 'Friendly & Casual', // New field
    });

    const speakingStyleOptions = [
        "Friendly & Casual",
        "Professional & Polite",
        "Short & Direct",
        "Sarcastic & Witty",
        "Bubbly & Enthusiastic",
        "Wise & Calm",
        "Poetic & Flowery"
    ];

    const roleOptions = [
        "friend",
        "therapist",
        "doctor",
        "mentor",
        "teaching assistant"
    ];

    const [role, setRole] = useState('friend');
    // const [notificationPref, setNotificationPref] = useState('check-in');
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const traitOptions = ["Helpful", "Empathetic", "Cheerful", "Adorable", "Funny", "Adventurous", "Wise", "Energetic", "Calm", "Constructive", "Supportive", "Honest", "Playful", "Encouraging", "Teasing", "Direct", "Uses Emojis", "Short Replies", "Curious"]



    const [customTrait, setCustomTrait] = useState('');

    const handleTraitChange = (trait) => {
        setPersonality(prev => ({
            ...prev,
            traits: prev.traits.includes(trait)
                ? prev.traits.filter(t => t !== trait)
                : [...prev.traits, trait]
        }));
    };

    const addCustomTrait = (e) => {
        e.preventDefault();
        if (customTrait.trim() && !personality.traits.includes(customTrait.trim())) {
            setPersonality(prev => ({
                ...prev,
                traits: [...prev.traits, customTrait.trim()]
            }));
            setCustomTrait('');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Please enter a name for your companion!');
            return;
        }
        if (!preview) {
            alert('Please upload a photo of your plushie!');
            return;
        }
        if (!personality.description.trim()) {
            alert('Please describe your companion\'s personality!');
            return;
        }

        setLoading(true);
        try {
            const palData = {
                name,
                image: preview,
                personality,
                role,
            };

            const response = await fetch('http://127.0.0.1:3000/api/pals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(palData)
            });

            if (!response.ok) {
                throw new Error('Failed to create pal');
            }

            const newPal = await response.json();
            onCustomize({ name, personality, role, photoUrl: preview });
            navigate('/pals');
        } catch (error) {
            console.error('Error creating pal:', error);
            alert('Failed to create companion. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="customization-form">
            <h2>Create Your AI Companion</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Upload Your Plushie's Photo *</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                    {preview && (
                        <div className="preview">
                            <img src={preview} alt="Plushie preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Companion Name *</label>
                    <input
                        type="text"
                        placeholder="e.g., Buddy, Luna, Max"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <Combobox
                        value={role}
                        onChange={setRole}
                        options={roleOptions}
                        placeholder="Choose or type your role"
                    />
                </div>


                {/* <div className="form-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Describe your companion’s personality, animal type, tone, vibe, and/or narrative. Ex: A warm, slightly sarcastic friend who likes using casual language. She is my closest plushy and I like to cuddle her before I sleep!"
                        value={personality.description}
                        onChange={(e) => setPersonality(prev => ({ ...prev, description: e.target.value }))}
                        rows="4"
                        required
                    />
                </div> */}
                <div className="form-group">
                    <label>Background & Story</label>
                    <textarea
                        className="description-textarea"
                        placeholder="Where did they come from? Give them a history. Ex. He is a capybala and he has stayed with me since I was five. I always cuddle him before I sleep."
                        value={personality.background}
                        onChange={(e) => setPersonality(prev => ({ ...prev, background: e.target.value }))}
                        rows="3"
                    />
                </div>


                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="description-textarea"
                        placeholder="Describe your companion in more detail! Ex: A warm, slightly sarcastic friend who likes using casual language."
                        value={personality.description}
                        onChange={(e) => setPersonality(prev => ({ ...prev, description: e.target.value }))}
                        rows="4"
                        required
                    />
                </div>



                <div className="form-group">
                    <label>Personality Traits (select multiple)</label>
                    <div className="traits-container">
                        {traitOptions.map(trait => (
                            <label key={trait} className="trait-checkbox">
                                <input
                                    type="checkbox"
                                    checked={personality.traits.includes(trait)}
                                    onChange={() => handleTraitChange(trait)}
                                />
                                {trait.charAt(0).toUpperCase() + trait.slice(1)}
                            </label>
                        ))}
                        {/* Display added custom traits as checked boxes too or just chips?
                             User said "allow user to type their own".
                             Let's show existing user traits that ARE NOT in options as well, so they can uncheck them.
                          */}
                        {personality.traits.filter(t => !traitOptions.includes(t)).map(trait => (
                            <label key={trait} className="trait-checkbox">
                                <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => handleTraitChange(trait)}
                                />
                                {trait}
                            </label>
                        ))}
                    </div>

                    <div className="custom-trait-input">
                        <input
                            type="text"
                            placeholder="Type a custom trait..."
                            value={customTrait}
                            onChange={(e) => setCustomTrait(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') addCustomTrait(e); }}
                        />
                        <button type="button" onClick={addCustomTrait} className="add-trait-btn">+</button>
                    </div>
                </div>

                <div className="form-group">
                    <label>Speaking Style</label>
                    <Combobox
                        value={personality.speakingStyle}
                        onChange={(val) => setPersonality(prev => ({ ...prev, speakingStyle: val }))}
                        options={speakingStyleOptions}
                        placeholder="Select style or type your own"
                    />
                </div>


                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/pals')}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating Companion...' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CustomizationForm;

