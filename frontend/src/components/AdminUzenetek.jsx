import React, { useEffect, useState } from 'react';
import http from "../http-common";
import {useNavigate} from "react-router-dom";
import './AdminUzenetek.css';

export default function AdminUzenetek({ accessToken }) {
    const [uzenetek, setUzenetek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUzenetek = async () => {
            setLoading(true);
            try {
                const res = await http.post('auto/adminuzenetek', {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUzenetek(res.data || []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Nem sikerült lekérdezni az üzeneteket");
            }
            finally {
                setLoading(false);
            }
        };
        fetchUzenetek();
    }, [accessToken]);
    if (loading) {
        return <div className="container mt-4">Betöltés...</div>;
    }   
    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }
     return (
        <div className="admin-uzenetek-container">
            <div className="admin-uzenetek-title">Üzenetek az érdeklődőktől</div>
            {uzenetek.length === 0 ? (
                <div className="uzenet-ures">Nincsenek üzenetek.</div>
            ) : (
                <div className="uzenet-lista">
                    {uzenetek.map((uzenet, index) => (
                        <div
                            key={index}
                            className="uzenet-kartya"
                            onClick={() => {
                                navigate(`/admin/chatablak?autoId=${uzenet.auto_id}&vevoId=${uzenet.vevo_id}&uzenetId=${uzenet.id}`)
                            }}
                        >
                            <div className="uzenet-fejlec">
                                <span className="uzenet-nev">{uzenet.nev}</span>
                                <span className="uzenet-model">{uzenet.model}</span>
                                <span className="uzenet-ar">{uzenet.ar} Ft</span>
                            </div>
                            <div className="uzenet-tartalom">{uzenet.uzenet_text}</div>
                            {/* Ha van dátum vagy státusz, ide illesztheted: */}
                            {/* <div className="uzenet-datum">{uzenet.datum}</div> */}
                            {/* <span className={`uzenet-statusz${uzenet.read ? " read" : ""}`}>{uzenet.read ? "Olvasott" : "Új"}</span> */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}