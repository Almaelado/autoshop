import http from "../http-common";
import { useEffect, useState } from "react";

export default function Profil({ accessToken }) {
  const [profilData, setProfilData] = useState(null);

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

  return (
    <div>
      <h1>Profilom</h1>
      {profilData ? (
        <div>
          <p>Név: {profilData.nev}</p>
          <p>Email: {profilData.email}</p>
          <p>Regisztráció dátuma: {new Date(profilData.reg_datum).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Betöltés...</p>
      )}
    </div>
  );
}
