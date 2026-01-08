import React, { useEffect, useState } from 'react';
import http from "../http-common.js";

export default function Chatablak({ accessToken }) {
    const vevoId = new URLSearchParams(window.location.search).get('vevoId');
    const autoId = new URLSearchParams(window.location.search).get('autoId');

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchChatMessages();
    }, []);

    const fetchChatMessages = async () => {
        try {
            const response = await http.get('/auto/chatablak', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: { vevoId, autoId }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Hiba a chat üzenetek lekérdezésekor:", error);
        }
    };

    return (
        <div className="chat-container">
            <h2>Chatablak</h2>

            {messages.map((msg) => (
                <div key={msg.id} className="chat-row">
                    
                    {/* Vevő üzenete (bal oldal) */}
                    <div className="message left">
                        <p>{msg.uzenet_text}</p>
                        <small>{msg.elkuldve}</small>
                    </div>

                    {/* Eladó válasza (jobb oldal, ha van) */}
                    {msg.valasz && (
                        <div className="message right">
                            <p>{msg.valasz}</p>
                            <small>{msg.valasz_datum}</small>
                        </div>
                    )}

                </div>
            ))}
        </div>
    );
}
