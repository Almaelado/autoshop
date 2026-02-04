import http from '../http-common.js';
import React, { useState, useEffect } from 'react';
import './Ujauto.css';

export default function Ujauto({ accessToken }) {
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
    <div className="ujauto-form-container">
      <h2>Új autó hozzáadása</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="marka">Márka:</label>
          <select name="nev" id="marka" required>
            <option value="">Válassz...</option>
            {markak.map((marka) => (
              <option key={marka.id} value={marka.nev}>{marka.nev}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="valto">Váltó:</label>
          <select name="váltó" id="valto" required>
            <option value="">Válassz...</option>
            {valtok.map((valto) => (
              <option key={valto.id} value={valto.nev}>{valto.nev}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="uzemanyag">Üzemanyag:</label>
          <select name="üzemanyag" id="uzemanyag" required>
            <option value="">Válassz...</option>
            {uzemanyagok.map((uzemanyag) => (
              <option key={uzemanyag.id} value={uzemanyag.nev}>{uzemanyag.nev}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="szin">Szín:</label>
          <select name="szin_nev" id="szin" required>
            <option value="">Válassz...</option>
            {szinek.map((szin) => (
              <option key={szin.id} value={szin.nev}>{szin.nev}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="modell">Modell:</label>
          <input type="text" name="modell" id="modell" required />
        </div>
        <div>
          <label htmlFor="evjarat">Évjárat:</label>
          <input type="number" name="evjarat" id="evjarat" min="1900" max={new Date().getFullYear()} required />
        </div>
        <div>
          <label htmlFor="ar">Ár:</label>
          <input type="number" name="ar" id="ar" min="0" required />
        </div>
        <div>
          <label htmlFor="km">Kilométeróra állás:</label>
          <input type="number" name="km" id="km" min="0" required />
        </div>
        <div>
          <label htmlFor="motormeret">Motor méret (cm³):</label>
          <input type="number" step="0.1" name="motormeret" id="motormeret" min="0" required />
        </div>
        <div>
          <label htmlFor="ajtok">Ajtók száma:</label>
          <input type="number" name="ajtok" id="ajtok" min="1" max="6" required />
        </div>
        <div>
          <label htmlFor="szemelyek">Személyek száma:</label>
          <input type="number" name="szemelyek" id="szemelyek" min="1" max="9" required />
        </div>
        <div>
          <label htmlFor="irat">Iratok állapota:</label>
          <select name="irat" id="irat" required>
            <option value="1">Rendben</option>
            <option value="0">Hiányos</option>
          </select>
        </div>
        <div>
          <label htmlFor="leiras">Leírás:</label>
          <textarea name="leiras" id="leiras" />
        </div>
        <button type="submit">Hozzáadás</button>
      </form>
    </div>
  );
}