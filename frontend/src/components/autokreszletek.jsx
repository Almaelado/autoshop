import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../http-common.js";
import { Carousel } from "react-bootstrap";

export default function Autokreszletek({ accessToken, onLoginModalOpen }) {
    const { autoId } = useParams(); // az URL-ből jön
    const navigate = useNavigate();
    const [auto, setAuto] = useState(null);
    const [kepek, setKepek] = useState([]);
    const [error, setError] = useState(null);
    const [ajanlott, setAjanlott] = useState([]); // ajánlott autók
    const [loading, setLoading] = useState(true); // betöltés animáció
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [erdekelLoading, setErdekelLoading] = useState(false);
    const [erdekelSuccess, setErdekelSuccess] = useState(false);

    useEffect(() => {
        if (!autoId) return;
        setLoading(true);
        const fetchAuto = async () => {
            try {
                const res = await http.get(`auto/egy/${autoId}`);
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
        console.log('Ajánlott autók lekérdezés, auto.nev:', auto.nev, 'autoId:', autoId);
        const fetchAjanlott = async () => {
            try {
                const res = await http.get(`auto/ajanlott/${auto.nev}?kiveve=${autoId}`);
                setAjanlott(res.data || []);
                console.log('Ajánlott autók válasz:', res.data);
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

    return (
  <div className="auto-details-fullpage">
    <div className="auto-details-page">
      <button className="close-btn" onClick={() => navigate('/autok')}>X</button>

      {/* Érdekel gomb */}
      <div style={{ margin: '16px 0' }}>
        <button className="erdekel-btn" onClick={handleErdekel} disabled={erdekelLoading}>
          {erdekelLoading ? "Mentés..." : "Érdekel"}
        </button>
        {erdekelSuccess && <span style={{ color: 'green', marginLeft: 8 }}>Hozzáadva az érdeklődésekhez!</span>}
        {showLoginPrompt && (
          <div style={{ color: 'red', marginTop: 8 }}>
            Jelentkezz be az érdeklődéshez!
          </div>
        )}
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
              <div key={a.id} className="ajanlott-card" onClick={() => {
                if (a.id !== Number(autoId)) {
                  navigate(`/auto/${a.id}`);
                }
              }}>
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

