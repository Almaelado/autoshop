import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import TypeaheadComponent from "../gombok/typeahead.jsx";
import RangeSlider from "../gombok/RangeSlider.jsx";
import Checkbox from "../gombok/checkbox.jsx";
import http from "../../http-common";
import "./szures.css";

export default function Szures({ value, onSearch, nyitva, setNyitva }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [markak, setMarkak] = useState([]);
  const [markaList, setMarkaList] = useState([]);

  const [uzemanyag, setUzemanyag] = useState([]);
  const [uzemanyagList, setUzemanyagList] = useState([]);

  const [szin, setSzin] = useState([]);
  const [szinList, setSzinList] = useState([]);

  const [valto, setValto] = useState([]);
  const [valtoList, setValtoList] = useState([]);

  const [evjarat, setEvjarat] = useState([2010, new Date().getFullYear()]);

  const maxKm = 200000;
  const [kmRange, setKmRange] = useState([0, maxKm]);

  const maxAr = 24000000;
  const [arRange, setArRange] = useState([0, maxAr]);

  const [motormeret, setMotormeret] = useState("");

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

    // Ha URL-bol jon a lap, a query paramokat visszatoltjuk a UI allapotaba.
    const params = Object.fromEntries([...searchParams]);

    if (params.markak) setMarkak(params.markak.split(","));
    if (params.uzemanyag) setUzemanyag(params.uzemanyag.split(","));
    if (params.szin) setSzin(params.szin.split(","));
    if (params.arMin || params.arMax) {
      setArRange([Number(params.arMin) || 0, Number(params.arMax) || maxAr]);
    }
    if (params.kmMin || params.kmMax) {
      setKmRange([Number(params.kmMin) || 0, Number(params.kmMax) || maxKm]);
    }
    if (params.evMin || params.evMax) {
      setEvjarat([
        Number(params.evMin) || 1900,
        Number(params.evMax) || new Date().getFullYear(),
      ]);
    }
    if (params.irat) setIrat(true);
    if (params.valto) setValto(params.valto.split(","));
    if (params.motormeret) setMotormeret(String(params.motormeret));
    if (params.ajto) setAjto(params.ajto.split(","));
    if (params.szemely) setSzemely(params.szemely.split(","));
  }, [searchParams]);

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
      szemely,
    };

    if (onSearch) {
      onSearch(JSON.stringify(filters));
    }

    // A szurok query paramkent is bekerulnek, hogy megoszthato legyen az allapot.
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

    setSearchParams(params);
  };

  return (
    <div id="Szures" className={nyitva ? "nyitva" : ""}>
      <button className="bezar-btn" onClick={() => setNyitva(false)}>
        Bezár
      </button>

      <TypeaheadComponent
        className="SzamlaTypeahead"
        label="Gyártmányok"
        options={markaList}
        labelKey="nev"
        value={markak}
        onChange={setMarkak}
      />

      <TypeaheadComponent
        className="SzamlaTypeahead"
        label="Üzemanyagok"
        options={uzemanyagList}
        labelKey="nev"
        value={uzemanyag}
        onChange={setUzemanyag}
      />

      <TypeaheadComponent
        className="SzamlaTypeahead"
        label="Színek"
        options={szinList}
        labelKey="nev"
        value={szin}
        onChange={setSzin}
      />

      <RangeSlider
        label="Ár"
        min={0}
        max={maxAr}
        step={100000}
        value={arRange}
        onChange={setArRange}
        mertek="Ft"
      />

      <RangeSlider
        label="Futott kilométer"
        min={0}
        max={maxKm}
        step={50000}
        value={kmRange}
        onChange={setKmRange}
        mertek="Km"
      />

      <RangeSlider
        label="Gyártási év"
        min={2010}
        max={new Date().getFullYear()}
        step={1}
        value={evjarat}
        onChange={setEvjarat}
        mertek="Év"
      />

      <Checkbox
        cim="Érvényes magyar okmányokkal"
        value={irat}
        onChange={setIrat}
      />

      <Button variant="outline-info" onClick={handleSearch}>
        Keresés
      </Button>

      <p
        className="szures-toggle"
        onClick={() => setShowMore((prev) => !prev)}
      >
        {showMore ? "Kevesebb szűrő" : "További szűrők"}
      </p>

      {showMore && (
        <div id="moreFilters" className="szures-extra-fields">
          <TypeaheadComponent
            className="SzamlaTypeahead"
            label="Váltó típus"
            labelKey="nev"
            options={valtoList}
            value={valto}
            onChange={setValto}
          />

          <div className="szuro-number-field">
            <label className="form-label m-0" htmlFor="motormeret-input">
              Motorméret
            </label>
            <input
              id="motormeret-input"
              className="form-control szuro-number-input"
              name="motormeret"
              type="number"
              min="0"
              step="1"
              placeholder="Pl. 1600"
              value={motormeret}
              onChange={(e) => setMotormeret(e.target.value)}
            />
          </div>

          <TypeaheadComponent
            className="SzamlaTypeahead"
            label="Ajtók száma"
            labelKey="ajtoszam"
            options={ajtoList}
            value={ajto}
            onChange={setAjto}
          />

          <TypeaheadComponent
            className="SzamlaTypeahead"
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
