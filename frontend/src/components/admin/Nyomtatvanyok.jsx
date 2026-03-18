import { useState } from "react";
import Szamla from "./Szamla";
import "./Nyomtatvanyok.css";

export default function Nyomtatvanyok({ accessToken }) {
  const [nyomtatvanyok, setNyomtatvanyok] = useState("");

  const printAdasveteli = () => {
    window.open("/adasveteli.pdf", "_blank");
    setNyomtatvanyok("adasveteli");
  };

  return (
    <div className="nyomtatvanyok-container">
      <h1>Admin Nyomtatványok Kezelése</h1>
      <div className="nyomtatvanyok-actions">
        <button onClick={printAdasveteli}>Adásvételi</button>
        <button onClick={() => setNyomtatvanyok("szamla")}>Számla</button>
      </div>
      {nyomtatvanyok === "adasveteli" && (
        <div>
          <h2>Átirányítás Adásvételi Nyomtatványra</h2>
        </div>
      )}
      {nyomtatvanyok === "szamla" && (
        <div>
          <Szamla accessToken={accessToken} />
        </div>
      )}
    </div>
  );
}