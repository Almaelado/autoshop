import './admin.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import http from "../http-common";

export default function Admin() {
    const navigate = useNavigate();
    const [unansweredCount, setUnansweredCount] = useState(0);
     useEffect(() => {
    // Nem válaszolt üzenetek számának lekérdezése
    const fetchUnanswered = async () => {
        try {
            const res = await http.get('auto/admin/unansweredcount');
            setUnansweredCount(res.data.count || 0);
        } catch (err) {
            setUnansweredCount(0);
        }
    };
    fetchUnanswered();
}, []);
    return (
        <div className="admin-container">
            <h1>Admin Felület</h1>
            <p>Üdvözlünk az adminisztrációs felületen!</p>
            {unansweredCount > 0 && (
    <div className="admin-alert">
        <b>Figyelem!</b> {unansweredCount} megválaszolatlan üzenet érkezett az érdeklődőktől.
        <button
            style={{ marginLeft: "1em" }}
            onClick={() => navigate('/admin/uzenetek')}
        >
            Üzenetek megtekintése
        </button>
    </div>
)}
            <div className="admin-dashboard">
                <div className="admin-card">
                    <h2>Autók listázása</h2>
                    <button onClick={() => navigate('/admin/autok')}>Autók megtekintése</button>
                </div>
                <div className="admin-card">
                    <h2>Új autó hozzáadása</h2>
                    <button onClick={() => navigate('/admin/ujauto')}>Új autó</button>
                </div>
                <div className="admin-card">
                    <h2>Adatok módosítása</h2>
                    <button onClick={() => navigate('/admin/egyeb')}>Adatok módosítása</button>
                </div>
                <div className="admin-card">
                    <h2>Nyomtatványok</h2>
                    <button onClick={() => navigate('/admin/nyomtatvanyok')}>Nyomtatványok</button>
                </div>
            </div>
        </div>
    );
}