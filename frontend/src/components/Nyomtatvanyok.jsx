import { useState } from "react";
import Szamla from "./Szamla";

export default function Nyomtatvanyok() {
  const [nyomtatvanyok, setNyomtatvanyok] = useState("");

  const printAdasveteli = () => {
  const win = window.open("/adasveteli.pdf", "_blank");
  win.onload = () => {
    win.print();
  };
};


  return (
    <div>
      <h1>Admin Nyomtatványok Kezelése</h1>
      <p><button onClick={printAdasveteli}>Adásvételi</button> <button onClick={() => setNyomtatvanyok("szamla")}>Számla</button></p>
      {nyomtatvanyok === "adasveteli" && (
        <div>
          <h2>Átirányítás Adásvételi Nyomtatványra</h2>
        </div>
      )}
      {nyomtatvanyok === "szamla" && (
        <div>
          <Szamla />
        </div>
      )}
    </div>
  );
}