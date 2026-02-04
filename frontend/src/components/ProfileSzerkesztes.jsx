import http from "../http-common";
import { useEffect, useState } from "react";
import './ProfileSzerkesztes.css';
import { useNavigate, useLocation } from "react-router-dom";

export default function ProfileSzerkesztes({ accessToken }) {
  const [profilData, setProfilData] = useState(null);
  const [editValues, setEditValues] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Mely mezőket rejtsük el
  const hiddenFields = ["admin", "jelszo", "id"];

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

  const handlePasswordChange = (field, value) => {
    setPasswordFields(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      alert("Az új jelszavak nem egyeznek!");
      return;
    }

    try {
      const payload = {
        email: editValues.email,
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

  if (!profilData) return <div className="profile-edit-container"><div className="profile-edit-form"><div>Betöltés...</div></div></div>;

  return (
  <div className="profile-edit-container">
    <form className="profile-edit-form" onSubmit={e => e.preventDefault()}>
      <div className="profile-edit-back">
        <button
          type="button"
          className="profile-edit-back-btn"
          onClick={() => {
            if (location.state?.from) {
              navigate(location.state.from);
            } else {
              navigate("/profil");
            }
          }}
        >
          &#8592; Vissza
        </button>
      </div>
      <h1>Profil Szerkesztése</h1>
      <p>
        Cég esetében csak az adószám megadása kötelező, magánszemélynél nem.<br />
        A lakcím mezőnél pontos cím megadása kötelező, cég esetén a székhelyet kell megadni.
      </p>
      <div className="profile-edit-columns">
        <div className="profile-edit-left">
          {/* Profil mezők */}
          {Object.keys(profilData)
            .filter(key => !hiddenFields.includes(key))
            .map(key => (
              <div className="profile-field" key={key}>
                <label>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {(key === "lakcim" || key === "adoszam") && <span className="required">*</span>}
                </label>
                <input
                  type="text"
                  value={editValues[key] ?? ""}
                  onChange={e => handleChange(key, e.target.value)}
                  autoComplete="off"
                />
              </div>
            ))}
          <button
            type="button"
            className="profile-edit-btn"
            onClick={handleUpdateAll}
          >
            Módosít
          </button>
        </div>
        <div className="profile-edit-right">
          {/* Jelszó mezők */}
          <div className="password-section">
            <h3>Jelszó módosítása</h3>
            <div className="profile-field">
              <label>Régi jelszó</label>
              <input
                type="password"
                placeholder="Régi jelszó"
                value={passwordFields.oldPassword}
                onChange={e => handlePasswordChange("oldPassword", e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="profile-field">
              <label>Új jelszó</label>
              <input
                type="password"
                placeholder="Új jelszó"
                value={passwordFields.newPassword}
                onChange={e => handlePasswordChange("newPassword", e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="profile-field">
              <label>Új jelszó ismét</label>
              <input
                type="password"
                placeholder="Új jelszó ismét"
                value={passwordFields.confirmPassword}
                onChange={e => handlePasswordChange("confirmPassword", e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <button
              type="button"
              className="profile-edit-btn"
              onClick={handlePasswordUpdate}
            >
              Jelszó módosít
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
);
}