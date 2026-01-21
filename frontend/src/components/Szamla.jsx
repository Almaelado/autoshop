import { use, useState,useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import http from "../http-common";
import TypeaheadComponent from './typeahead.jsx';

export default function Szamla({ accessToken }) {
  const [vevoNev, setVevoNev] = useState("");
  const [vevoCim, setVevoCim] = useState("");
  const [termek, setTermek] = useState("");
  const [mennyiseg, setMennyiseg] = useState(1);
  const [egysegar, setEgysegar] = useState(0);
  const [fizetesimodLista, setFizetesimodLista] = useState([]);
  const [vevokLista, setVevokLista] = useState([]);
  const [egesz,setEgesz] = useState("");

  useEffect(() => {
    // Példa: Vevő adatok lekérése API-ból
    const fetchVevoAdatok = async () => {
        try {
            //console.log("Lekérem a vevő adatait az accessToken segítségével:", accessToken);
            const res = await http.get('/auto/szamla', { headers: {
                        Authorization: `Bearer ${accessToken}`
                    }});
                    console.log("Vevő adatok sikeresen lekérve:", res.data);
                    setEgesz(JSON.stringify(res.data));
            const vevokLista = [];
            for(let i = 0;i<res.data.vevok.length;i++){
                vevokLista.push(res.data.vevok[i].email);
            }
            setVevokLista(vevokLista);
            const fizetesimodLista = [];
            for(let i = 0;i<res.data.fizetesimod.length;i++){
                fizetesimodLista.push(res.data.fizetesimod[i].mod);
            }
            setFizetesimodLista(fizetesimodLista);
            console.log("Vevők lista:", vevokLista);
            console.log("Fizetési módok lista:", fizetesimodLista);
        } catch (err) {
            console.error("Hiba a vevő adatok lekérésekor:", err);
        }
    };

    fetchVevoAdatok();
}, []);

    const handleVevoValasztas = (valasztott) => {
        //console.log("Kiválasztott vevő:", valasztott);
        const jsonData = JSON.parse(egesz);
        //console.log("Teljes JSON adat:", jsonData);
        for(let i = 0;i<jsonData.vevok.length;i++){
            if(jsonData.vevok[i].email === valasztott[0]){
                //console.log("Talált vevő adatok:", jsonData.vevok[i].nev, jsonData.vevok[i].lakcim);
                if(jsonData.vevok[i].lakcim){
                    setVevoCim(jsonData.vevok[i].lakcim);
                }
                if(jsonData.vevok[i].nev){
                    setVevoNev(jsonData.vevok[i].nev);
                }
                console.log("Beállított vevő név:", jsonData.vevok[i].nev);
                console.log("Beállított vevő cím:", jsonData.vevok[i].lakcim);
                break;
            }
        }
    }

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
      <TypeaheadComponent
        label="Vevők"
        options={vevokLista}
        onChange={handleVevoValasztas}
      />
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

      <TypeaheadComponent
        label="Fizetési mód"
        options={fizetesimodLista}
      />

      <button onClick={generatePDF}>Számla letöltése (PDF)</button>
    </div>
  );
}
