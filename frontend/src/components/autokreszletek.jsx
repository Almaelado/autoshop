import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import http from "../http-common.js";
import { Carousel } from "react-bootstrap";
import './autokreszletek.css';

export default function Autokreszletek({ accessToken, onLoginModalOpen,admin }) {
    const { autoId } = useParams(); // az URL-ből jön
    const navigate = useNavigate();
    const location = useLocation();
    const [auto, setAuto] = useState(null);
    const [kepek, setKepek] = useState([]);
    const [error, setError] = useState(null);
    const [ajanlott, setAjanlott] = useState([]); // ajánlott autók
    const [loading, setLoading] = useState(true); // betöltés animáció
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [erdekelLoading, setErdekelLoading] = useState(false);
    const [erdekelSuccess, setErdekelSuccess] = useState(false);
    const [editAuto, setEditAuto] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [markak,setMarkak] = useState([]);
    const [uzemanyag,setUzemanyag] = useState([]);
    const [valto,setValto] = useState([]);
    const [szin,setSzin] = useState([]);

    useEffect(() => {
  if (auto && admin) {
    setEditAuto(auto);
  }
}, [auto, admin]);



    useEffect(() => {
        if (!autoId) return;
        setLoading(true);
        const fetchAuto = async () => {
            try {
                const res = await http.get(`auto/egy/${autoId}`);
                const res2 = await http.get(`auto/marka`);
                const res3 = await http.get(`auto/szin`);
                const res4 = await http.get(`auto/uzemanyag`);
                const res5 = await http.get(`auto/valtok`);

                setMarkak(res2);
                setSzin(res3);
                setUzemanyag(res4);
                setValto(res5);
                setAuto(res.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Nem sikerült betölteni az autót");
            } finally {
                setLoading(false);
            }
        };
        fetchAuto();
    }, [autoId]);

    useEffect(() => {
        if (!autoId) return;
        const maxImages = 20;
        const promises = [];
        for (let i = 1; i <= maxImages; i++) {
            const path = `/img/${autoId}_${i}.jpg`;
            promises.push(new Promise(resolve => {
                const img = new window.Image();
                img.src = path;
                img.onload = () => resolve(path);
                img.onerror = () => resolve(null);
            }));
        }
        Promise.all(promises).then(results => {
            setKepek(results.filter(k => k !== null));
        });
    }, [autoId]);

    // Ajánlott autók lekérése (pl. azonos típus vagy árkategória alapján)
    useEffect(() => {
        if (!auto || !autoId) return;
        //console.log('Ajánlott autók lekérdezés, auto.nev:', auto.nev, 'autoId:', autoId);
        const fetchAjanlott = async () => {
            try {
                const res = await http.get(`auto/ajanlott/${auto.nev}?kiveve=${autoId}`);
                setAjanlott(res.data || []);
                //console.log('Ajánlott autók válasz:', res.data);
                if (!res.data || res.data.length === 0) {
                  console.warn('Nincs ajánlott autó találat! Ellenőrizd a backend választ és az adatbázist.');
                }
            } catch (err) {
                setAjanlott([]);
                console.error('Ajánlott autók hiba:', err);
            }
        };
        fetchAjanlott();
    }, [auto, autoId]);

    const handleChange = (e) => {
  const { name, value } = e.target;
  setEditAuto(prev => ({
    ...prev,
    [name]: value
  }));
};

    const handleSave = async () => {
  setSaveLoading(true);
  setSaveSuccess(false);
  try {
    await http.put(
      `/auto/szerkesztes/${autoId}`,
      editAuto,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true
      }
    );
    setSaveSuccess(true);
  } catch (err) {
    alert("Hiba történt a mentés során!");
  } finally {
    setSaveLoading(false);
  }
};


    const handleErdekel = async () => {
      if (!accessToken) {
        if (onLoginModalOpen) {
          onLoginModalOpen();
        } else {
          setShowLoginPrompt(true);
        }
        return;
      }
      setErdekelLoading(true);
      setShowLoginPrompt(false);
      setErdekelSuccess(false);
      try {
        const erdeklestettAutok = await http.get('auto/erdekeltek', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        //console.log('Érdeklődött autók:', erdeklestettAutok.data);
        if (erdeklestettAutok.data.some(a => a.id === Number(autoId))) {
          alert('Már érdeklődtél ez iránt az autó iránt!');
          setErdekelLoading(false);
          return;
        }
        await http.post(
          "/auto/erdekel",
          { autoId: Number(autoId) },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setErdekelSuccess(true);
      } catch (err) {
        setErdekelSuccess(false);
        alert("Hiba történt az érdeklődés mentésekor!");
      } finally {
        setErdekelLoading(false);
      }
    };

    if (error) return <div>{error}</div>;
    if (loading) return (
        <div className="betoltes-spinner">
            <div className="spinner"></div>
            <div>Betöltés...</div>
        </div>
    );
    if (!auto) return <div>Betöltés...</div>;

    if (admin === true) {
  if (!editAuto) return <div>Betöltés...</div>;


  return (
  <div className="container my-4 admin-auto-szerkesztes">
    <div className="card shadow-sm">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">Autó szerkesztése (ADMIN)</h5>
      </div>

      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Márka</label>
            <select
  className="form-select"
  name="nev"
  value={editAuto.nev ||""}
  onChange={handleChange}
>
  {markak.data?.map(m => (
    <option key={m.id} value={m.nev}>
      {m.nev}
    </option>
  ))}
</select>

          </div>

          <div className="col-md-6">
            <label className="form-label">Modell</label>
            <input
              className="form-control"
              name="model"
              value={editAuto.model || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Leírás</label>
            <textarea
              className="form-control"
              rows="3"
              name="leírás"
              value={editAuto.leírás || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Ár (Ft)</label>
            <input
              type="number"
              className="form-control"
              name="ar"
              value={editAuto.ar || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Kilométer</label>
            <input
              type="number"
              className="form-control"
              name="km"
              value={editAuto.km || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Évjárat</label>
            <input
              type="number"
              className="form-control"
              name="kiadasiev"
              value={editAuto.kiadasiev || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Üzemanyag</label>
            <select
  className="form-select"
  name="üzemanyag"
  value={editAuto.üzemanyag|| ""}
  onChange={handleChange}
>
  {uzemanyag.data?.map(u => (
    <option key={u.id} value={u.nev}>
      {u.nev}
    </option>
  ))}
</select>


          </div>

          <div className="col-md-6">
            <label className="form-label">Váltó</label>
            <select
  className="form-select"
  name="váltó"
  value={editAuto.váltó || ""}
  onChange={handleChange}
>
  {valto.data?.map(v => (
    <option key={v.id} value={v.nev}>
      {v.nev}
    </option>
  ))}
</select>

          </div>

          <div className="col-md-6">
            <label className="form-label">Szín</label>
            <select
  className="form-select"
  name="szin_nev"
  value={editAuto.szin_nev || ""}
  onChange={handleChange}
>
  {szin.data?.map(s => (
    <option key={s.id} value={s.nev}>
      {s.nev}
    </option>
  ))}
</select>

          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn btn-primary px-4"
            onClick={handleSave}
            disabled={saveLoading}
          >
            {saveLoading ? "Mentés..." : "Mentés"}
          </button>
        </div>

        {saveSuccess && (
          <div className="alert alert-success mt-3 mb-0">
            ✔ Sikeresen mentve
          </div>
        )}
      </div>
    </div>
  </div>
);

}

    else{
      return (
  <div className="auto-details-fullpage">
    <div className="auto-details-page">
      <button
        className="close-btn"
        onClick={() => {
          if (location.state?.fromKezdolap) {
            navigate('/');
          } else {
            const prevId = location.state?.previousId;
            if (prevId) {
              navigate(`/auto/${prevId}`);
            } else {
              navigate('/autok');
            }
          }
        }}
      >
        X
      </button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', justifyContent: 'space-between' }}>
  {/* Bal oldali Érdekel gomb */}
  <div>
    <button className="erdekel-btn" onClick={handleErdekel} disabled={erdekelLoading} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4 }}>
      {erdekelLoading ? "Mentés..." : "Érdekel"}
    </button>
    {erdekelSuccess && <span style={{ color: 'green', marginLeft: 8 }}>Hozzáadva az érdeklődésekhez!</span>}
    {showLoginPrompt && (
      <div style={{ color: 'red', marginTop: 8 }}>
        Jelentkezz be az érdeklődéshez!
      </div>
    )}
  </div>

  {/* Jobb oldali Üzenet gomb */}
  <div>
    <button
      className="uzenet-btn"
      onClick={() => navigate(`/uzenet/${autoId}`)}
      style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4 }}
    >
      Üzenet
    </button>
  </div>
</div>


      {/* Carousel */}
      {kepek.length > 0 && (
        <div className="carousel-container">
          <Carousel interval={null} indicators controls>
            {kepek.map((kep, index) => (
              <Carousel.Item key={index}>
                <div className="carousel-img-wrapper">
                  <img src={kep} alt={`Kép ${index + 1}`} className="carousel-img" />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      {/* Autó adatok */}
      <div className="auto-info">
        <h2>{auto.nev} {auto.model}</h2>
        <p>{auto.leírás}</p>
        <div className="auto-specs">
          <div>
            <div className="label">Szín</div>
            <div className="value">{auto.szin_nev}</div>
          </div>
          <div>
            <div className="label">Kilométer</div>
            <div className="value">{auto.km?.toLocaleString()} km</div>
          </div>
          <div>
            <div className="label">Ár</div>
            <div className="value">{auto.ar?.toLocaleString()} Ft</div>
          </div>
          {/* Új adatok */}
          <div>
            <div className="label">Évjárat</div>
            <div className="value">{auto.kiadasiev || '-'}</div>
          </div>
          <div>
            <div className="label">Üzemanyag</div>
            <div className="value">{auto.üzemanyag || '-'}</div>
          </div>
          <div>
            <div className="label">Váltó</div>
            <div className="value">{auto.váltó || '-'}</div>
          </div>
        </div>
      </div>

      {/* Ajánlott autók */}
      {ajanlott.length > 0 && (
        <div className="ajanlott-autok">
          <h3>Hasonló autók</h3>
          <div className="ajanlott-lista">
            {ajanlott.map((a) => (
              <div
                key={a.id}
                className="ajanlott-card"
                onClick={() => {
                  if (a.id !== Number(autoId)) {
                    navigate(`/auto/${a.id}`, { state: { previousId: Number(autoId) } });
                  }
                }}
              >
                <img src={`/img/${a.id}_1.jpg`} alt={a.nev} className="ajanlott-img" />
                <div className="ajanlott-info">
                  <div className="ajanlott-nev">{a.nev} {a.model}</div>
                  <div className="ajanlott-ar">{a.ar?.toLocaleString()} Ft</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
    }
    
}

