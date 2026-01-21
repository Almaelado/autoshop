import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Szamla() {
  const [vevoNev, setVevoNev] = useState("");
  const [vevoCim, setVevoCim] = useState("");
  const [termek, setTermek] = useState("");
  const [mennyiseg, setMennyiseg] = useState(1);
  const [egysegar, setEgysegar] = useState(0);

  const generatePDF = () => {
  const doc = new jsPDF();

  const datum = new Date().toLocaleDateString("hu-HU");
  const szamlaSzam = `SZ-${Math.floor(Math.random() * 100000)}`;

  // ===== CÉG ADATOK =====
  doc.setFontSize(14);
  doc.text("Példa Kft.", 14, 20);
  doc.setFontSize(10);
  doc.text("1234 Budapest, Példa utca 12.", 14, 26);
  doc.text("Adószám: 12345678-1-42", 14, 31);
  doc.text("Email: info@peldaceg.hu", 14, 36);

  // ===== FEJLÉC =====
  doc.setFontSize(18);
  doc.text("SZÁMLA", 150, 20);
  doc.setFontSize(10);
  doc.text(`Számlaszám: ${szamlaSzam}`, 150, 30);
  doc.text(`Dátum: ${datum}`, 150, 35);

  // ===== VEVŐ =====
  doc.setFontSize(12);
  doc.text("Vevő adatai:", 14, 50);
  doc.setFontSize(10);
  doc.text(`Név: ${vevoNev}`, 14, 56);
  doc.text(`Cím: ${vevoCim}`, 14, 61);

  // ===== TÁBLÁZAT =====
  autoTable(doc, {
    startY: 70,
    head: [["Megnevezés", "Menny.", "Egységár", "Nettó"]],
    body: [
      [
        termek,
        mennyiseg,
        `${egysegar.toLocaleString("hu-HU")} Ft`,
        `${(mennyiseg * egysegar).toLocaleString("hu-HU")} Ft`,
      ],
    ],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [230, 230, 230] },
  });

  // ===== ÖSSZESÍTÉS =====
  const netto = mennyiseg * egysegar;
  const afa = netto * 0.27;
  const brutto = netto + afa;

  const y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.text(`Nettó összesen: ${netto.toLocaleString("hu-HU")} Ft`, 140, y);
  doc.text(`ÁFA (27%): ${afa.toLocaleString("hu-HU")} Ft`, 140, y + 6);

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(`Bruttó összesen: ${brutto.toLocaleString("hu-HU")} Ft`, 140, y + 14);
  doc.setFont(undefined, "normal");

  // ===== LÁBLÉC =====
  doc.setFontSize(9);
  doc.text(
    "A számla elektronikusan készült, aláírás nélkül is érvényes.",
    14,
    280
  );

  doc.save("szamla.pdf");
};


  return (
    <div>
      <h2>Számla készítése</h2>

      <h4>Vevő adatai</h4>
      <input
        placeholder="Vevő neve"
        value={vevoNev}
        onChange={e => setVevoNev(e.target.value)}
      /><br />

      <input
        placeholder="Vevő címe"
        value={vevoCim}
        onChange={e => setVevoCim(e.target.value)}
      /><br />

      <h4>Számla tételek</h4>
      <input
        placeholder="Termék / Szolgáltatás"
        value={termek}
        onChange={e => setTermek(e.target.value)}
      /><br />

      <input
        type="number"
        placeholder="Mennyiség"
        value={mennyiseg}
        onChange={e => setMennyiseg(Number(e.target.value))}
      /><br />

      <input
        type="number"
        placeholder="Egységár (Ft)"
        value={egysegar}
        onChange={e => setEgysegar(Number(e.target.value))}
      /><br /><br />

      <button onClick={generatePDF}>Számla letöltése (PDF)</button>
    </div>
  );
}
