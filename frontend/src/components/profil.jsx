import http from "../http-common";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./profil.css";


export default function Profil({ accessToken }) {
  const [profilData, setProfilData] = useState(null);
  const [erdekeltek, setErdekeltek] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handledoboz= (auto) => navigate(`/auto/${auto.id}`);

  const handleGomb= (e, auto) => {
    e.stopPropagation();
    navigate(`/uzenet/${auto.id}`);
  };


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
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-action">
          <button
            className="profile-button secondary"
            onClick={() => {
              if (location.state?.from) {
                navigate(location.state.from);
              } else {
                navigate("/");
              }
            }}
          >
            Vissza
          </button>
          <Button
            className="profile-button primary"
            onClick={() => {
              window.location.href = "/profil/szerkesztes";
            }}
          >
            Szerkesztés
          </Button>
        </div>
        <div className="profile-avatar">
          {profilData?.nev?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="profile-name">{profilData?.nev || "Betöltés..."}</div>
        <div className="profile-email">{profilData?.email}</div>
        <div className="profile-info">
          <div className="info-card">
            <div className="info-label">Regisztráció</div>
            <div className="info-value">
              {profilData?.reg_datum
                ? new Date(profilData.reg_datum).toLocaleDateString()
                : "-"}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <h2>Érdeklődéseim</h2>
      {erdekeltek.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {erdekeltek.map((auto) => (
            <li
              key={auto.id}
              onClick={() => handledoboz(auto)}
              className="auto-card"
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f8fafc",
                borderRadius: 12,
                marginBottom: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: 12,
                cursor: "pointer",
                border: "1px solid #e3eafc"
              }}
            >
              <img
                src={`/img/${auto.id}_1.jpg`}
                alt={auto.nev}
                style={{
                  width: 80,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 6,
                  marginRight: 16,
                  border: "1px solid #d0e2ff"
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {auto.nev} {auto.model}
                </div>
                <div style={{ color: '#1976d2', fontWeight: 600 }}>
                  {auto.ar?.toLocaleString()} Ft
                </div>
              </div>
              <button
                className="profile-button primary"
                style={{ marginLeft: 'auto', padding: '8px 18px', fontSize: 15 }}
                onClick={(event) => handleGomb(event, auto)}
              >
                Üzenet
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nincs még érdeklődésed.</p>
      )}
    </div>
  );
}
