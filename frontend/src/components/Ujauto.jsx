import http from '../http-common.js';
import React from 'react';
import { useState , useEffect } from 'react';

export default function Ujauto({accessToken}) {  
    const [markak, setMarkak] = useState([]);
    const [valtok, setValtok] = useState([]);
    const [uzemanyagok, setUzemanyagok] = useState([]);
    const [szinek, setSzinek] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const markakRes = await http.get('/auto/marka');
                setMarkak(markakRes.data);
                const valtokRes = await http.get('/auto/valtok');
                setValtok(valtokRes.data);
                const uzemanyagokRes = await http.get('/auto/uzemanyag');
                setUzemanyagok(uzemanyagokRes.data);
                const szinekRes = await http.get('/auto/szin');
                setSzinek(szinekRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const autoData = Object.fromEntries(formData.entries());
        try {
            await http.post('/auto/ujauto', autoData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            alert('Az új autó sikeresen hozzáadva!');
            e.target.reset();
        } catch (err) {
            console.error('Error adding new car:', err);
            alert('Hiba történt az autó hozzáadásakor.');
        }
    };

    return (
    <div>
        <h2>Új autó hozzáadása</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label >Márka:</label>
                <select name='nev'>
                    {markak.map((marka) => (
                        <option key={marka.id} value={marka.nev}>{marka.nev}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Váltó:</label>
                <select name='váltó'>
                    {valtok.map((valto) => (
                        <option key={valto.id} value={valto.nev}>{valto.nev}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Üzemanyag:</label>
                <select name='üzemanyag'> 
                    {uzemanyagok.map((uzemanyag) => (
                        <option key={uzemanyag.id} value={uzemanyag.nev}>{uzemanyag.nev}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Szín:</label>
                <select name='szin_nev'>
                    {szinek.map((szin) => (
                        <option key={szin.id} value={szin.nev}>{szin.nev}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Modell:</label>
                <input type="text" name="modell" />
            </div>
            <div>
                <label>Évjárat:</label>
                <input type="number" name="evjarat" />
            </div>
            <div>
                <label>Ár:</label>
                <input type="number" name="ar" />
            </div>
            <div>
                <label>Kilométeróra állás:</label>
                <input type="number" name="km" />

            </div>
            <div>
                <label>Motor méret (cm³):</label>
                <input type="number" step="0.1" name="motormeret" />
            </div>
            <div>
                <label>Ajtók száma:</label>
                <input type="number" name="ajtok" />
            </div>
            <div>
                <label>Személyek száma:</label>
                <input type="number" name="szemelyek" />
            </div>
            <div>
                <label>Iratok állapota:</label>
                <select name="irat">
                    <option value="1">Rendben</option>
                    <option value="0">Hiányos</option>
                </select>
            </div>
            <div>
                <label>Leírás:</label>
                <textarea name="leiras"></textarea>
            </div>
            <button type="submit">Hozzáadás</button>
        </form>
    </div>
  );
}