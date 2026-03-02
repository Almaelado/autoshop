import { useEffect, useState } from "react";
import http from "../http-common";
import "./kepekSzerkesztese.css";

export default function KepekSzerkesztese({ autoId, onClose, accessToken }) {
  const [kepek, setKepek] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    betoltKepek();
  }, [autoId]);

  useEffect(() => {
    console.log("Betöltött képek:", kepek);
    }, [kepek]);

  const kepLetezik = (url) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);

    img.src = url;
  });
};

const betoltKepek = async () => {
  const ujKepek = [];

  for (let i = 1; i < 10; i++) {
    const url = `http://localhost:80/img/${autoId}_${i}.jpg`;

    if (await kepLetezik(url)) {
      console.log("Kép létezik:", url);
      ujKepek.push({ index: i, src: url });
    } else {
      console.log("Kép nincs meg:", url);
    }
  }

  setKepek(ujKepek); // csak egyszer állítjuk be a state-et
};

const torolKep = async (index) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a képet?")) {
        return;
    }
  try {
    await http.delete(`auto/kepek/${autoId}/${index}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Ha sikeres, frissítjük a state-et
    setKepek((prev) => prev.filter((kep) => kep.index !== index));
    console.log("Kép törölve:", index);
  } catch (err) {
    console.error("Hiba a kép törlésekor:", err);
  }
};

const feltoltKep = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

    let index =
    (kepek.length > 0
      ? Math.max(...kepek.map((k) => k.index))
      : 0)+1;


  const formData = new FormData();
  formData.append("file", file,`${autoId}_${index}`);

  try {
    await http.post(`auto/kepek/${autoId}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Sikeres feltöltés után frissítjük a képek listáját
    betoltKepek();
  } catch (err) {
    console.error("Hiba a kép feltöltésekor:", err);
  }
};

  return (
    <div className="kepek-feher-doboz">
      <div className="kepek-header">
        <h4>Képek szerkesztése</h4>
        <span>Autó ID: {autoId}</span>
      </div>

      <div className="kepek-grid">
        {kepek.map((kep) => (
          <div key={kep.index} className="kep-card">
            <img src={kep.src} alt="Autó kép" />
            <button
  className="kep-torles"
  onClick={() => torolKep(kep.index)}
>
  🗑
</button>

          </div>
        ))}

        {kepek.length < 20 && (
          <label className="kep-upload">
            +
            <input type="file" hidden onChange={feltoltKep} />
          </label>
        )}
      </div>

      <div className="kepek-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Bezárás
        </button>
        {uploading && <span>Feltöltés...</span>}
      </div>
    </div>
  );
}
