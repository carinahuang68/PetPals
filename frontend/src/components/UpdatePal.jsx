import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import API_URL from "../config/api";
import "./CustomizationForm.css";
import Combobox from "./Combobox";

export default function UpdatePal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(null);

    // Same options as CustomizationForm
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
        "mentor",
        "adventure-buddy"
    ];

    const traitOptions = ["Helpful", "Empathetic", "Cheerful", "Adorable", "Funny", "Adventurous", "Wise", "Energetic", "Calm", "Constructive", "Supportive", "Honest", "Playful", "Encouraging", "Teasing", "Direct", "Uses Emojis", "Short Replies", "Curious"]

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        image: "",
        personality: {
            background: "",
            description: "",
            speakingStyle: "",
            traits: []
        }
    });

    const [customTrait, setCustomTrait] = useState('');

    useEffect(() => {
        const fetchPal = async () => {
            try {
                const res = await fetch(`${API_URL}/api/pals/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Failed to load pal");

                const pal = await res.json();
                setPreview(pal.image);

                setFormData({
                    name: pal.name || "",
                    role: pal.role || "friend",
                    image: pal.image || "",
                    personality: {
                        background: pal.personality?.background || "",
                        description: pal.personality?.description || "",
                        speakingStyle: pal.personality?.speakingStyle || "",
                        traits: pal.personality?.traits || []
                    }
                });
            } catch (err) {
                setError("Could not load pal");
            } finally {
                setLoading(false);
            }
        };

        fetchPal();
    }, [id, token]);

    /* Handlers */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePersonalityChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            personality: {
                ...prev.personality,
                [field]: value
            }
        }));
    }

    const handleTraitChange = (trait) => {
        setFormData(prev => ({
            ...prev,
            personality: {
                ...prev.personality,
                traits: prev.personality.traits.includes(trait)
                    ? prev.personality.traits.filter(t => t !== trait)
                    : [...prev.personality.traits, trait]
            }
        }));
    };

    const addCustomTrait = (e) => {
        e.preventDefault();
        const traitToAdd = customTrait.trim();
        if (traitToAdd && !formData.personality.traits.includes(traitToAdd)) {
            setFormData(prev => ({
                ...prev,
                personality: {
                    ...prev.personality,
                    traits: [...prev.personality.traits, traitToAdd]
                }
            }));
            setCustomTrait('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/api/pals/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Update failed");

            navigate("/pals");
        } catch (err) {
            setError("Failed to update pal");
            setSubmitting(false);
        }
    };

    if (loading) return <p>Loading pal...</p>;

    return (
        <div className="customization-form"> {/* Reuse container class */}
            <h2>Update Pal</h2>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                {/* Image Preview (Read Only for update for now unless we add upload logic, 
                    Create form has upload, Update form usually might too but keeping it simple as per previous valid logic,
                    just showing preview) */}
                <div className="form-group">
                    <label>Assigned Photo</label>
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
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <Combobox
                        value={formData.role}
                        onChange={(val) => setFormData(prev => ({ ...prev, role: val }))}
                        options={roleOptions}
                        placeholder="Choose or type your role"
                    />
                </div>

                <div className="form-group">
                    <label>Background & Story</label>
                    <textarea
                        className="description-textarea"
                        value={formData.personality.background}
                        onChange={(e) => handlePersonalityChange('background', e.target.value)}
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="description-textarea"
                        value={formData.personality.description}
                        onChange={(e) => handlePersonalityChange('description', e.target.value)}
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label>Personality Traits (select multiple)</label>
                    <div className="traits-container">
                        {traitOptions.map(trait => (
                            <label key={trait} className="trait-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.personality.traits.includes(trait)}
                                    onChange={() => handleTraitChange(trait)}
                                />
                                {trait.charAt(0).toUpperCase() + trait.slice(1)}
                            </label>
                        ))}
                        {/* Custom traits display */}
                        {formData.personality.traits.filter(t => !traitOptions.includes(t)).map(trait => (
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
                        value={formData.personality.speakingStyle}
                        onChange={(val) => handlePersonalityChange('speakingStyle', val)}
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
                    <button type="submit" className="save-btn submit-btn" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save Updates'}
                    </button>
                </div>
            </form>
        </div>
    );
}
