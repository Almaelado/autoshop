import { useState } from "react"; 
import http from "../http-common";


 export default function EgyebMod({accessToken}) {
    const [vizsgalt, setVizsgalt] = useState(0);
    const [szin, setSzin] = useState("");
    const [uzemanyag, setUzemanyag] = useState("");
    const [modell, setModell] = useState("");
    const [valto, setValto] = useState("");

    const handleSzinMod = (szin) => {
        http.post(`/auto/addszin`, {szin}, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then(response => {
                console.log("Szín hozzáadva:", response.data);
            })
            .catch(error => {
                console.error("Hiba a szín hozzáadása során:", error);
            });
    };

    const handleUzemanyagMod = (uzemanyag) => {
        http.post(`/auto/adduzemanyag`, {uzemanyag}, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then(response => {
                console.log("Üzemanyag hozzáadva:", response.data);
            })
            .catch(error => {
                console.error("Hiba az üzemanyag hozzáadása során:", error);
            });
    };
    const handleAutoMod = (modell) => {
        http.post(`/auto/addmodell`, {modell}, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then(response => {
                console.log("Autó modell hozzáadva:", response.data);
            })
            .catch(error => {
                console.error("Hiba az autó modell hozzáadása során:", error);
            });
    };
    const handleValtoMod = (valto) => {
        http.post(`/auto/addvalto`, {valto}, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then(response => {
                console.log("Váltó hozzáadva:", response.data);
            })
            .catch(error => {
                console.error("Hiba a váltó hozzáadása során:", error);
            });
    };
  return (
    <div>
        <h2>Admin Módosítások</h2>
        <button onClick={() => setVizsgalt(1)}>Új Szín felvétele</button>
        <button onClick={() => setVizsgalt(2)}>Új Üzemanyag típus felvétele</button>
        <button onClick={() => setVizsgalt(3)}>Új Autó modell felvételes</button>
        <button onClick={() => setVizsgalt(4)}>Új Váltó felvétele</button>
        {vizsgalt === 1 && <div>
            <h3>Színek módosítása</h3>
            <input type="text" onChange={(e) => setSzin(e.target.value)} />
            <button onClick={() => handleSzinMod(szin)}>Módosítás</button>
            </div>}
        {vizsgalt === 2 && <div>
            <h3>Üzemanyag típusok módosítása</h3>
            <input type="text" onChange={(e) => setUzemanyag(e.target.value)} />
            <button onClick={() => handleUzemanyagMod(uzemanyag)}>Módosítás</button>
            </div>}
        {vizsgalt === 3 && <div>
            <h3>Autó modellek módosítása</h3>
            <input type="text" onChange={(e) => setModell(e.target.value)} />
            <button onClick={() => handleAutoMod(modell)}>Módosítás</button>
            </div>}
        {vizsgalt === 4 && <div>
            <h3>Váltók módosítása</h3>
            <input type="text" onChange={(e) => setValto(e.target.value)} />
            <button onClick={() => handleValtoMod(valto)}>Módosítás</button>
            </div>}

    </div>

  );
}