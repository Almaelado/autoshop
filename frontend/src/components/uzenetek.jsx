import React, { useEffect, useState } from 'react';
import http from "../http-common.js";
import { useNavigate} from 'react-router-dom';
import './uzenetek.css';


export default function Uzenetek({ accessToken }) {
    const [uzenetek, setUzenetek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
            <h2 className="uzenetek-title">Üzeneteim</h2>
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
                                <span className="uzenet-datum">{uzenet.elkuldve}</span>
                            </div>
                            <div className="uzenet-tartalom">{uzenet.uzenet_text}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
