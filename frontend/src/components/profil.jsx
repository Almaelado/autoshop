import http from "../http-common";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";


export default function Profil({ accessToken }) {
  const [profilData, setProfilData] = useState(null);
  const [erdekeltek, setErdekeltek] = useState([]);

  useEffect(() => {
    console.log("Profil komponens accessToken:", accessToken);  
    if (!accessToken) return; // Ha még nincs token, ne fusson a lekérés

    const fetchProfil = async () => {
      try {
        const response = await http.get("/auto/profil", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log("Profil adat:", response.data);
        setProfilData(response.data);
      } catch (error) {
        console.error("Error fetching profil data:", error);
      }
    };

    fetchProfil();
  }, [accessToken]); // dependency: accessToken

  useEffect(() => {
    if (!accessToken) return;

    const fetchErdekeltek = async () => {
      try {
        const response = await http.get("/auto/erdekeltek", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setErdekeltek(response.data || []);
      } catch (error) {
        setErdekeltek([]);
        console.error("Error fetching erdekeltek:", error);
      }
    };

    fetchErdekeltek();
  }, [accessToken]);

  return (
    <div>
      <h1>Profilom</h1>
      <Button onClick={() => {
        window.location.href = "/profil/szerkesztes";
      } }>Szerkesztés</Button>
      {profilData ? (
        <div>
          <p>Név: {profilData.nev}</p>
          <p>Email: {profilData.email}</p>
          <p>Regisztráció dátuma: {new Date(profilData.reg_datum).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Betöltés...</p>
      )}
      <hr />
      <h2>Érdeklődéseim</h2>
      {erdekeltek.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {erdekeltek.map((auto) => (
            <li key={auto.id} style={{ marginBottom: 16, border: '1px solid #ddd', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center' }}>
              <img src={`/img/${auto.id}_1.jpg`} alt={auto.nev} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, marginRight: 16 }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 16 }}>{auto.nev} {auto.model}</div>
                <div style={{ color: '#666' }}>{auto.ar?.toLocaleString()} Ft</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nincs még érdeklődésed.</p>
      )}
    </div>
  );
}
