import React, { useState } from 'react';

function CustomizationForm({ onCustomize }) {
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('friendly');
  const [role, setRole] = useState('friend');
  const [notificationPref, setNotificationPref] = useState('check-in');
  const [preview, setPreview] = useState(null);

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
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a name for your companion!');
      return;
    }
    if (!preview) {
      alert('Please upload a photo of your doll!');
      return;
    }
    onCustomize({ name, personality, role, notificationPref, photoUrl: preview });
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
              <img src={preview} alt="Doll preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
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
          <select value={personality} onChange={(e) => setPersonality(e.target.value)}>
            <option value="friendly">Friendly & Cheerful</option>
            <option value="calm">Calm & Wise</option>
            <option value="playful">Playful & Silly</option>
            <option value="supportive">Supportive & Empathetic</option>
          </select>
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

        <button type="submit" className="submit-btn">
          Create Companion
        </button>
      </form>
    </div>
  );
}

export default CustomizationForm;
