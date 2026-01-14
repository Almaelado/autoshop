import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../http-common.js";

export default function Uzenet({ accessToken }) {
    const { autoId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await http.post(`auto/uzenet`, {
                autoId,
                uzenet: message
            }, {    
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setSuccess(true);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Nem sikerült elküldeni az üzenetet");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container mt-4">
            <h2>Üzenet küldése az eladónak</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Az üzenet sikeresen elküldve!</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">Üzenet:</label>
                    <textarea
                        id="message"
                        className="form-control"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Küldés..." : "Küldés"}
                </button>
            </form>
        </div>
    );
}
