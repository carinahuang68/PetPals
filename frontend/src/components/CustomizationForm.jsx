import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomizationForm.css';

function CustomizationForm({ onCustomize }) {
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState({
    description: '',
    traits: [],
  });
  const [role, setRole] = useState('friend');
  const [notificationPref, setNotificationPref] = useState('check-in');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const traitOptions = ['helpful', 'funny', 'adventurous', 'wise', 'energetic', 'calm',  'constructive'];

  const handleTraitChange = (trait) => {
    setPersonality(prev => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : [...prev.traits, trait]
    }));
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
        notificationsEnabled: notificationPref !== 'none'
      };

      const response = await fetch('http://localhost:3000/api/pals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(palData)
      });

      if (!response.ok) {
        throw new Error('Failed to create pal');
      }

      const newPal = await response.json();
      onCustomize({ name, personality, role, notificationPref, photoUrl: preview });
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
          <label>Personality</label>
          <textarea
            placeholder="e.g., A warm and empathetic companion who loves to listen and provide comfort"
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
          </div>
        </div>

        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="friend">Friend</option>
            <option value="therapist">Therapist</option>
            <option value="mentor">Mentor</option>
            <option value="adventure-buddy">Adventure Buddy</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notification Preference</label>
          <select value={notificationPref} onChange={(e) => setNotificationPref(e.target.value)}>
            <option value="check-in">Daily Check-in</option>
            <option value="reminders">Periodic Reminders</option>
            <option value="none">No Notifications</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Companion...' : 'Create Companion'}
        </button>
      </form>
    </div>
  );
}

export default CustomizationForm;