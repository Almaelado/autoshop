import { use, useState,useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import http from "../http-common";
import TypeaheadComponent from './typeahead.jsx';

export default function Szamla({ accessToken }) {
  const LIMIT = 10;
  const [vevoNev, setVevoNev] = useState("");
  const [vevoCim, setVevoCim] = useState("");
  const [vevoId, setVevoId] = useState(null);
  const [termek, setTermek] = useState("");
  const [mennyiseg, setMennyiseg] = useState(1);
  const [egysegar, setEgysegar] = useState(0);
  const [fizetesimodLista, setFizetesimodLista] = useState([]);
  const [vevokLista, setVevokLista] = useState([]);
  const [egesz,setEgesz] = useState("");
  const [fizetesimod,setFizetesimod] = useState("");
  const [autokLista, setAutokLista] = useState([]);
const [autokLathato, setAutokLathato] = useState(false);
const [kivalasztottAutoId, setKivalasztottAutoId] = useState(null);
  
const [offset, setOffset] = useState(0);
const [betolt, setBetolt] = useState(false);
const [vanTobb, setVanTobb] = useState(true);

const [autokKereses, setAutokKereses] = useState("");

const szurtAutokLista = autokLista.filter(auto =>
  auto.nev.toLowerCase().includes(autokKereses.toLowerCase()) ||
  auto.model.toLowerCase().includes(autokKereses.toLowerCase()) ||
  auto.szin_nev.toLowerCase().includes(autokKereses.toLowerCase())
);




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

    const handleAutokToggle = () => {
  if (autokLathato) {
    setAutokLathato(false);
  } else {
    setOffset(0);
    setVanTobb(true);
    setAutokLathato(true);
    fetchAutok(true); // reset=true → tiszta lista
  }
};


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
                setVevoId(jsonData.vevok[i].id);
                console.log("Beállított vevő név:", jsonData.vevok[i].nev);
                console.log("Beállított vevő cím:", jsonData.vevok[i].lakcim);
                break;
            }
        }
    }

    const handleFizetesimodValasztas = (valasztott) => {
       // console.log("Kiválasztott fizetési mód:", valasztott[0]);
        const jsonData = JSON.parse(egesz);
        for(let i = 0 ; i<jsonData.fizetesimod.length;i++){
            if(jsonData.fizetesimod[i].mod === valasztott[0]){
                setFizetesimod(jsonData.fizetesimod[i].mod);
                break;
            }
        }
    }
    const fetchAutok = async (reset = false) => {
  if (betolt || !vanTobb) return;

  setBetolt(true);

  try {
    const res = await http.get(
      `/auto/minden?limit=${LIMIT}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const ujAutok = res.data;

    setAutokLista(prev => {
      if (reset) return [...ujAutok]; // ha reset, csak az új adat
      // különben add hozzá, de csak egyedi ID-k
      const ids = new Set(prev.map(a => a.id));
      const uniqueAutok = ujAutok.filter(a => !ids.has(a.id));
      return [...prev, ...uniqueAutok];
    });

    setOffset(prev => prev + LIMIT);

    if (ujAutok.length < LIMIT) {
      setVanTobb(false);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setBetolt(false);
  }
};

const MentesAdatbazisba = async (adatok) => {
  try {
    const res = await http.post('/auto/szamla', { adatok }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Sikeres mentés az adatbázisba:", res.data);
  } catch (err) {
    console.error("Hiba a mentés során:", err);
  }
};

const handleAutoKivalasztas = (auto) => {
  setKivalasztottAutoId(auto.id);
  setTermek(`${auto.nev} ${auto.model}`);
  setEgysegar(auto.ar);
  setMennyiseg(1);
  setAutokLathato(false);
};
const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchAutok();
  }
};

  const generatePDF = () => {
  const doc = new jsPDF();


  const datum = new Date().toLocaleDateString("hu-HU");
  const szamlaSzam = `SZ-${Math.floor(Math.random() * 100000)}`;

  // ===== CÉG ADATOK =====
  doc.setFontSize(14);
  doc.text("Ndidi Auto Kft.", 14, 20);
  doc.setFontSize(10);
  doc.text("5400 Mezőtúr, XXIII utca 4.", 14, 26);
  doc.text("Adószám: 88472717-4-32", 14, 31);
  doc.text("Email: info@ndidiauto.hu", 14, 36);

  // ===== FEJLÉC =====
  doc.setFontSize(18);
  doc.text("SZÁMLA", 150, 20);
  doc.setFontSize(10);
  doc.text(`Számlaszám: ${szamlaSzam}`, 150, 30);
  doc.text(`Dátum: ${datum}`, 150, 35);

  // ===== VEVŐ =====
  doc.setFontSize(12);
  doc.text("Vásárló adatai:", 14, 50);
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
doc.text(`Fizetési mód: ${fizetesimod}`, 140, y);
doc.text(`Nettó összesen: ${netto.toLocaleString("hu-HU")} Ft`, 140, y + 6);
doc.text(`ÁFA (27%): ${afa.toLocaleString("hu-HU")} Ft`, 140, y + 12);


  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(`Bruttó összesen: ${brutto.toLocaleString("hu-HU")} Ft`, 140, y + 18);
  doc.setFont(undefined, "normal");

  // ===== LÁBLÉC =====
  doc.setFontSize(9);
  doc.text(
    "A számla elektronikusan készült, aláírás nélkül is érvényes.",
    14,
    280
  );

  doc.save("szamla.pdf");
  MentesAdatbazisba({
    szamlaSzam,
    vevoId,
    datum,
    fizetesimod,
    autokId: kivalasztottAutoId,
  });
};


  return (
    <div>
      <h2>Számla készítése</h2>
      <h4>Vevő adatai</h4>
      <TypeaheadComponent
        label="Felhsználók:"
        options={vevokLista}
        onChange={handleVevoValasztas}
      />
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
      <button onClick={handleAutokToggle}>
  {autokLathato ? "Vissza" : "Autók megjelenítése"}
</button>


      <div
  style={{
    maxHeight: "300px",
    overflowY: "auto",
    border: "1px solid #ccc",
    marginTop: "10px",
  }}
  onScroll={handleScroll}
>

      {autokLathato && (
  <div
    style={{ maxHeight: "300px", overflowY: "auto" }}
    onScroll={handleScroll}
  >
    <input 
      type="text"
      placeholder="Keresés..."
      value={autokKereses}
      onChange={(e)=>setAutokKereses(e.target.value)}
      style={{width:"100%",marginBottom:"10px",padding: "5px"}}
     />
    <table width="100%" border="1" cellPadding="5">
  <thead>
    <tr>
      <th>Márka</th>
      <th>Modell</th>
      <th>Szín</th>
      <th>Ajtók</th>
      <th>KM</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {szurtAutokLista.map(auto => (
      <tr key={auto.id}>
        <td>{auto.nev}</td>
        <td>{auto.model}</td>
        <td>{auto.szin_nev}</td>
        <td>{auto.ajtoszam}</td>
        <td>{auto.km}</td>
        <td>
          <button onClick={() => handleAutoKivalasztas(auto)}>
            Kiválaszt
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

{betolt && <p style={{ textAlign: "center" }}>Betöltés...</p>}
{!vanTobb && <p style={{ textAlign: "center" }}>Nincs több adat</p>}



    {betolt && <p style={{ textAlign: "center" }}>Betöltés...</p>}
    {!vanTobb && (
      <p style={{ textAlign: "center" }}>Nincs több adat</p>
    )}
  </div>
)}

</div>

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
        onChange={handleFizetesimodValasztas}
      />

      <button onClick={generatePDF}>Számla letöltése (PDF)</button>
    </div>
  );
}
