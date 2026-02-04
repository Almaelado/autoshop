import { useState } from "react"; 

 export default function EgyebMod() {
    const [vizsgalt, setVizsgalt] = useState(0);

    const handleSzinMod = () => {
        // Szín módosítás logika itt
    };

    const handleUzemanyagMod = () => {
        // Üzemanyag típus módosítás logika itt
    };
    const handleAutoMod = () => {
        // Autó modell módosítás logika itt
    };
    const handleValtoMod = () => {
        // Váltó módosítás logika itt
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
            <input type="text" />
            <button>Módosítás</button>
            </div>}
        {vizsgalt === 2 && <div>
            <h3>Üzemanyag típusok módosítása</h3>
            <input type="text" />
            <button>Módosítás</button>
            </div>}
        {vizsgalt === 3 && <div>
            <h3>Autó modellek módosítása</h3>
            <input type="text" />
            <button>Módosítás</button>
            </div>}
        {vizsgalt === 4 && <div>
            <h3>Váltók módosítása</h3>
            <input type="text" />
            <button>Módosítás</button>
            </div>}

    </div>

  );
}