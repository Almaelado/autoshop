import http from "../http-common";
import { useEffect, useState } from "react";

export default function ProfileSzerkesztes({ accessToken }) {
  const [profilData, setProfilData] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Mely mezőket rejtsük el
  const hiddenFields = ["admin","jelszo", "id"];

  useEffect(() => {
    if (!accessToken) return;

    const fetchProfil = async () => {
      try {
        const response = await http.get("/auto/profil", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setProfilData(response.data);

        // Biztosítjuk, hogy minden mező legalább üres string legyen
        const initializedValues = Object.fromEntries(
          Object.keys(response.data).map(key => [key, response.data[key] ?? ""])
        );
        setEditValues(initializedValues);
      } catch (error) {
        console.error("Error fetching profil data:", error);
      }
    };

    fetchProfil();
  }, [accessToken]);

  const handleChange = (key, value) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };

  // Profil adatok frissítése egy gombbal
  const handleUpdateAll = async () => {
    try {
      const payload = {
        id: profilData.id,
        nev: editValues.nev,
        email: editValues.email,
        lakcim: editValues.lakcim,
        adoszam: editValues.adoszam
      };

      await http.put(`/auto/profilmodosit`, payload, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setProfilData(prev => ({ ...prev, ...editValues }));
      alert("Profil adatok sikeresen frissítve!");
    } catch (error) {
      console.error("Hiba a profil frissítésénél:", error);
      alert("Hiba történt a frissítés során");
    }
  };

  // Jelszó mezők kezelése
  const handlePasswordChange = (field, value) => {
    setPasswordFields(prev => ({ ...prev, [field]: value }));
  };

  // Jelszó frissítése a backend /jelszomodositas végpontján
  const handlePasswordUpdate = async () => {
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      alert("Az új jelszavak nem egyeznek!");
      return;
    }

    try {
      const payload = {
        email: editValues.email,               // az aktuális emailt küldjük
        oldPassword: passwordFields.oldPassword,
        newPassword: passwordFields.newPassword
      };

      await http.put("/auto/jelszomodositas", payload, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      alert("Jelszó sikeresen frissítve!");
      setPasswordFields({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Hiba a jelszó frissítésénél:", error);
      alert("Hiba történt a jelszó frissítése során");
    }
  };

  if (!profilData) return <div>Betöltés...</div>;

  return (
    <div>
      <h1>Profil Szerkesztése</h1>
      <p>
        Cég esetében csak az adószám megadása kötelező, magánszemélynél nem.<br />
        A lakcím mezőnél pontos cím megadása kötelező, cég esetén a székhelyet kell megadni.
      </p>

      {/* Profil mezők */}
      {Object.keys(profilData)
        .filter(key => !hiddenFields.includes(key))
        .map(key => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>
              {key}:
              {(key === "lakcim" || key === "adoszam") && <span style={{ color: "red" }}> *</span>}
            </label>
            <input
              type="text"
              value={editValues[key] ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
              style={{ marginRight: "10px" }}
            />
          </div>
        ))}

      {/* Egy gomb, ami egyszerre frissíti az összes mezőt */}
      <button onClick={handleUpdateAll} style={{ marginTop: "10px" }}>Módosít</button>

      {/* Jelszó mezők */}
      <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
        <h3>Jelszó módosítása</h3>
        <input
          type="password"
          placeholder="Régi jelszó"
          value={passwordFields.oldPassword}
          onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
          style={{ marginRight: "10px", marginBottom: "5px" }}
        /><br />
        <input
          type="password"
          placeholder="Új jelszó"
          value={passwordFields.newPassword}
          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
          style={{ marginRight: "10px", marginBottom: "5px" }}
        /><br />
        <input
          type="password"
          placeholder="Új jelszó ismét"
          value={passwordFields.confirmPassword}
          onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
          style={{ marginRight: "10px", marginBottom: "5px" }}
        /><br />
        <button onClick={handlePasswordUpdate}>Jelszó módosít</button>
      </div>
    </div>
  );
}
