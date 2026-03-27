import React, { useEffect, useState } from 'react';
import http from "../../http-common.js";
import { useNavigate} from 'react-router-dom';
import './uzenetek.css';


export default function Uzenetek({ accessToken }) {
    const [uzenetek, setUzenetek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const formatLastActivity = (value) => {
        if (!value) return "";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString("hu-HU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        const fetchUzenetek = async () => {
            setLoading(true);
            //console.log("Lekérdezem az üzeneteket az accessTokenrel:", accessToken);
            try {
                console.log("Lekérdezem az üzeneteket az accessTokennel:", accessToken);
                const res = await http.get(
                    'auto/uzenetek',
                    {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUzenetek(res.data || []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Nem sikerült lekérdezni az üzeneteket");
            } finally {
                setLoading(false);
            }
        };
        fetchUzenetek();
    }, [accessToken]);

    if (loading) {
        return (
            <div className="uzenetek-container">
                <div className="uzenet-ures">Betöltés...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="uzenetek-container">
                <div className="uzenet-ures" style={{ color: "#e74c3c" }}>{error}</div>
            </div>
        );
    }

    return (
        <div className="uzenetek-container">
            <div className="uzenetek-header">
                <button
                    type="button"
                    className="uzenetek-back"
                    onClick={() => navigate(-1)}
                >
                    Vissza
                </button>
                <h2 className="uzenetek-title">Üzeneteim</h2>
                <div className="uzenetek-header-spacer" />
            </div>
            {uzenetek.length === 0 ? (
                <div className="uzenet-ures">Nincsenek üzenetek.</div>
            ) : (
                <div className="uzenet-lista">
                    {uzenetek.map((uzenet, index) => (
                        <div
                            key={index}
                            className="uzenet-kartya"
                            onClick={() => navigate(`/uzenetablak?autoId=${uzenet.auto_id}&vevoId=${uzenet.vevo_id}`)}
                        >
                            <div className="uzenet-fejlec">
                                <div className="uzenet-fejlec-bal">
                                    <span className="uzenet-nev">{uzenet.nev}</span>
                                    <span className="uzenet-model">{uzenet.model}</span>
                                    <span className="uzenet-ar">{uzenet.ar} Ft</span>
                                </div>
                                <span className="uzenet-datum">{formatLastActivity(uzenet.utolso_aktivitas)}</span>
                            </div>
                            <div className="uzenet-utolso-cim">Utolsó üzenet</div>
                            <div className="uzenet-tartalom">{uzenet.utolso_uzenet || "Még nincs megjeleníthető üzenet."}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
