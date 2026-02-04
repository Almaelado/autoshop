import React, { useEffect, useState } from 'react';
import http from "../http-common.js";
import './Chatablak.css';

export default function Chatablak({ accessToken , admin}) {
    const vevoId = new URLSearchParams(window.location.search).get('vevoId');
    const autoId = new URLSearchParams(window.location.search).get('autoId');
    //console.log("admin chatablak:", admin);
    if(admin){
        var uzenetId = new URLSearchParams(window.location.search).get('uzenetId');
    } 
    //console.log("vevoId:", vevoId, " autoId:", autoId, " uzenetId:", uzenetId);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true); // kezdéskor true
    const [rendezett, setRendezett] = useState([]);
    const [ujUzenet, setUjUzenet] = useState("");
    
    
    useEffect(() => {
        fetchChatMessages();
    }, []);
    useEffect(() => {
    const ujRendezett = [];
    for (let i = 0; i < messages.length; i++) {
        console.log("Üzenet:", messages[i]);
        if (messages[i].valasz) {
            ujRendezett.push([messages[i].uzenet_text, messages[i].elkuldve,false]);
            ujRendezett.push([messages[i].valasz, messages[i].valasz_datum,true]);
        }
        else{
            ujRendezett.push([messages[i].uzenet_text, messages[i].elkuldve,false]);
        }
    }
    ujRendezett.sort((a, b) => new Date(a[1]) - new Date(b[1]));
    setRendezett(ujRendezett);
    console.log(rendezett);

}, [messages]);


    const kuldUzenet = async () => {
    if (!ujUzenet.trim()){
        alert("Üzenet mező nem lehet üres!");
        return;
    }
    if(rendezett[rendezett.length - 1][2]===true && admin===true){
        alert("Válasz már érkezett az utolsó üzenetre, nem küldhető újabb üzenet!");
        return;
    }
    try {
        if(admin){
            await http.post(
                "/auto/admin/chatablak",
                {
                    uzenetId,
                    vevoId,
                    autoId,
                    uzenet_text: ujUzenet
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
        }else{
            await http.post(
                "/auto/felhasznalo/chatablak",
                {
                    vevoId,
                    autoId,
                    uzenet_text: ujUzenet
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
        }

        setUjUzenet("");         // üzenet mező ürítése
 
        fetchChatMessages(); // frissíti a chatet
    } catch (error) {
        console.error("Hiba az üzenet küldésekor:", error);
    }
};


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
    //console.log("Üzenetek:", rendezett);
    return (
        <div className="chat-container">
    <div className="chat-header">
        <h2>Chatablak</h2>
    </div>

    <div className="chat-messages">
        {rendezett.map((msg,index) => {
            if(msg[2]===true){
                return (
                    <div key={index} className="chat-row">
                        <div className="message right">
                            <p>{msg[0]}</p>
                            <small>{msg[1]}</small>
                        </div>
                    </div>
                );
            }
            return (
                <div key={index} className="chat-row">
                    <div className="message left">
                        <p>{msg[0]}</p>
                        <small>{msg[1]}</small>
                    </div>
                </div>
            );
        })}
    </div>

    <div className="chat-input">
        <input
            type="text"
            placeholder="Írj egy üzenetet..."
            value={ujUzenet}
            onChange={(e) => setUjUzenet(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && kuldUzenet()}
        />
        <button onClick={kuldUzenet}>Küldés</button>
    </div>
</div>

    );
}
