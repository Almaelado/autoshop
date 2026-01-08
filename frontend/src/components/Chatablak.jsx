import React, { useEffect, useState } from 'react';
import http from "../http-common.js";

export default function Chatablak({ accessToken }) {
    const vevoId = new URLSearchParams(window.location.search).get('vevoId');
    const autoId = new URLSearchParams(window.location.search).get('autoId');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true); // kezdéskor true
    const [rendezett, setRendezett] = useState([]);
    
    useEffect(() => {
        fetchChatMessages();
    }, []);
    useEffect(() => {
    const ujRendezett = [];
    for (let i = 0; i < messages.length; i++) {
        ujRendezett.push([messages[i].uzenet_text, messages[i].elkuldve]);
        if (messages[i].valasz) {
            ujRendezett.push([messages[i].valasz, messages[i].valasz_datum]);
        }
    }
    ujRendezett.sort((a, b) => new Date(a[1]) - new Date(b[1]));
    setRendezett(ujRendezett);
    console.log(rendezett);

}, [messages]);


    const fetchChatMessages = async () => {
        setLoading(true); // fetch előtt
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
        } finally {
            setLoading(false); // fetch után
        }
    };

    if (loading) {
        return <div>Betöltés...</div>; // loading state kezelése
    }

    if (messages.length === 0) {
        return <div>Nincsenek üzenetek.</div>; // üres chat kezelése
    }

    return (
        <div className="chat-container">
            <h2>Chatablak</h2>
            {messages.map((msg) => (
                <div key={msg.id} className="chat-row">
                    <div className="message left">
                        <p>{msg.uzenet_text}</p>
                        <small>{msg.elkuldve}</small>
                    </div>
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
