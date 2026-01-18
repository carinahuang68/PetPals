import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdatePal.css";

export default function UpdatePal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        personality: {
            description: "",
            tone: "",
            traits: []
        }
    });

    /* Fetch existing pal */
    useEffect(() => {
        const fetchPal = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/pals/${id}`);
                if (!res.ok) throw new Error("Failed to load pal");

                const pal = await res.json();

                setFormData({
                    name: pal.name || "",
                    role: pal.role || "",
                    personality: {
                        description: pal.personality?.description || "",
                        tone: pal.personality?.tone || "",
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
    }, [id]);

    /* Handlers */
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("personality.")) {
            const key = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                personality: {
                    ...prev.personality,
                    [key]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTraitsChange = (e) => {
        const traits = e.target.value
            .split(",")
            .map(t => t.trim())
            .filter(Boolean);

        setFormData(prev => ({
            ...prev,
            personality: {
                ...prev.personality,
                traits
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`http://localhost:3000/api/pals/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Update failed");

            navigate("/pals");
        } catch (err) {
            setError("Failed to update pal");
        }
    };

    if (loading) return <p>Loading pal...</p>;

    return (
        <div className="update-pal-container">
            <h2>Update Pal</h2>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="update-pal-form">
                <label>
                    Name
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Role
                    <input
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Personality Description
                    <textarea
                        name="personality.description"
                        value={formData.personality.description}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Tone
                    <input
                        name="personality.tone"
                        value={formData.personality.tone}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Traits (comma separated)
                    <input
                        value={formData.personality.traits.join(", ")}
                        onChange={handleTraitsChange}
                    />
                </label>

                <div className="form-actions">
                    <button type="submit">Save Changes</button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
