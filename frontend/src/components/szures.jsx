import { use, useEffect, useState } from "react";
import TypeaheadComponent from "./typeahead.jsx";
import RangeSlider from "./RangeSlider.jsx";
import Checkbox from "./checkbox.jsx";
import Button from 'react-bootstrap/Button';
import http from "../http-common";
import {useSearchParams} from "react-router-dom"; 
import './szures.css';

export default function Szures({ value, onSearch,nyitva,setNyitva }) {
  const [searchParams, setSearchParams] = useSearchParams();

    // Állapotok
    const [markak, setMarkak] = useState([]);
    const [markaList, setMarkaList] = useState([]);

    const [uzemanyag, setUzemanyag] = useState([]);
    const [uzemanyagList, setUzemanyagList] = useState([]);

    const [szin, setSzin] = useState([]);
    const [szinList, setSzinList] = useState([]);


    const [valto, setValto] = useState([]);
    const [valtoList, setValtoList] = useState([]);

    const [evjarat, setEvjarat] = useState([1900,new Date().getFullYear()]);

    const maxKm = 200000;
    const [kmRange, setKmRange] = useState([0,maxKm]);

    const maxAr = 3000000;
    const [arRange, setArRange] = useState([0, maxAr]); // kétvégű csúszka

    const [motormeret, setMotormeret] = useState(0);

    const [irat, setIrat] = useState(false);

    const [ajto, setAjto] = useState([]);
    const [ajtoList, setAjtoList] = useState([]);

    const [szemely, setSzemely] = useState([]);
    const [szemelyList, setSzemelyList] = useState([]);


    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
      const fetchData = async (endpoint, setter) => {
      try {
        const response = await http.get(endpoint);
        setter(response.data);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
  };

      fetchData("auto/marka", setMarkaList);
      fetchData("auto/uzemanyag", setUzemanyagList);
      fetchData("auto/szin", setSzinList);
      fetchData("auto/valtok", setValtoList);
      fetchData("auto/ajtok", setAjtoList);
      fetchData("auto/szemelyek", setSzemelyList);

      handleSearch();

      const params = Object.fromEntries([...searchParams]);

      if (params.markak) setMarkak(params.markak.split(","));
      if (params.uzemanyag) setUzemanyag(params.uzemanyag.split(","));
      if (params.szin) setSzin(params.szin.split(","));
      if (params.arMin || params.arMax) setArRange([Number(params.arMin) || 0, Number(params.arMax) || maxAr]);
      if (params.kmMin || params.kmMax) setKmRange([Number(params.kmMin) || 0, Number(params.kmMax) || maxKm]);
      if (params.evMin || params.evMax) setEvjarat([Number(params.evMin) || 1900, Number(params.evMax) || new Date().getFullYear()]);
      if (params.irat) setIrat(true);
      if (params.valto) setValto(params.valto.split(","));
      if (params.motormeret) setMotormeret(params.motormeret);
      if (params.ajto) setAjto(params.ajto.split(","));
      if (params.szemely) setSzemely(params.szemely.split(","));

    }, [searchParams]);

  // Kezelők (NEM hívnak többé triggerOnChange-t)
  const handleMarkakChange = setMarkak;
  const handleSzinChange = setSzin;
  const handleUzemanyagChange = setUzemanyag;
  const handleArChange = setArRange;
  const handleKmChange = setKmRange;
  const handleEvjaratChange = setEvjarat;
  // Csak gombnyomásra adja át a szűrőt
  const handleSearch = () => {
    const filters = {
      markak,
      uzemanyag,
      szin,
      arRange,
      kmRange,
      evjarat,
      irat,
      valto,
      motormeret,
      ajto,
      szemely
    };
    const filtersString = JSON.stringify(filters);
    if (onSearch) {
      onSearch(filtersString);
    }

    const params = {};

    if (markak.length) params.markak = markak.join(",");
    if (uzemanyag.length) params.uzemanyag = uzemanyag.join(",");
    if (szin.length) params.szin = szin.join(",");
    if (arRange[0] !== 0) params.arMin = arRange[0];
    if (arRange[1] !== maxAr) params.arMax = arRange[1];
    if (kmRange[0] !== 0) params.kmMin = kmRange[0];
    if (kmRange[1] !== maxKm) params.kmMax = kmRange[1];
    if (evjarat[0] !== 1900) params.evMin = evjarat[0];
    if (evjarat[1] !== new Date().getFullYear()) params.evMax = evjarat[1];
    if (irat) params.irat = true;
    if (valto.length) params.valto = valto.join(",");
    if (motormeret) params.motormeret = motormeret;
    if (ajto.length) params.ajto = ajto.join(",");
    if (szemely.length) params.szemely = szemely.join(",");

    setSearchParams(params); // Frissíti az URL-t

  };

  return (
    <div id="Szures" className={nyitva ? "nyitva" : ""}>
      <button className="bezar-btn" onClick={() => setNyitva(false)}>
        ✖ Bezár
      </button>
      <TypeaheadComponent
        className="SzamlaTypeahead"
        label="Gyártányok"
        options={markaList}
        labelKey="nev"
        value={markak}
        onChange={handleMarkakChange}
      />

      <TypeaheadComponent
        label="Üzemanyagok"
        options={uzemanyagList}
        labelKey="nev"
        value={uzemanyag}
        onChange={handleUzemanyagChange}
      />
        <TypeaheadComponent
        label="Színek"
        options={szinList}
        labelKey="nev"
        value={szin}
        onChange={handleSzinChange}
      />

      <RangeSlider
        label="Ár"
        min={0}
        max={maxAr}
        step={100000}
        value={arRange}
        onChange={handleArChange}
        mertek={"Ft"}
      />
      <RangeSlider
        label="Futott Kilométer"
        min={0}
        max={maxKm}
        step={50000}
        value={kmRange}
        onChange={handleKmChange}
        mertek={"Km"}
      />
      <RangeSlider
        label="Gyártási év"
        min={1900}
        max={new Date().getFullYear()}
        step={1}
        value={evjarat}
        onChange={handleEvjaratChange}
        mertek={"Év"}
      />
        <Checkbox cim="Érvényes Magyar Okmányokkal" value={irat} onChange={setIrat} />

        <Button variant="outline-info" onClick={handleSearch}>Keresés</Button>
         <p style={{cursor: "pointer", color: "blue"}} onClick={() => setShowMore(!showMore)}>
        {showMore ? "Kevesebb szűrő" : "További szűrők"}
      </p>

      {/* További szűrők */}
      {showMore && (
        <div id="moreFilters">
          <TypeaheadComponent
            label="Váltó típus"
            labelKey="váltó"
            options={valtoList}
            value={valto}
            onChange={setValto}
          />
          <input name="motormeret" type="number" value={motormeret} onChange={(e)=>setMotormeret(e.target.value)}/>
          <TypeaheadComponent
            label="Ajtók száma"
            labelKey="ajtoszam"
            options={ajtoList}
            value={ajto}
            onChange={setAjto}
          />
          <TypeaheadComponent
            label="Személyek száma"
            labelKey="szemelyek"
            options={szemelyList}
            value={szemely}
            onChange={setSzemely}
          />
        </div>
      )}
    </div>
  );
}
