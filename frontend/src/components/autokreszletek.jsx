import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../http-common.js";
import { Carousel } from "react-bootstrap";

export default function Autokreszletek() {
    const { autoId } = useParams(); // az URL-ből jön
    const navigate = useNavigate();
    const [auto, setAuto] = useState(null);
    const [kepek, setKepek] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!autoId) return;

        const fetchAuto = async () => {
            try {
                const res = await http.get(`auto/egy/${autoId}`);
                setAuto(res.data);
            } catch (err) {
                console.error(err);
                setError("Nem sikerült betölteni az autót");
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
                const img = new Image();
                img.src = path;
                img.onload = () => resolve(path);
                img.onerror = () => resolve(null);
            }));
        }
        Promise.all(promises).then(results => {
            setKepek(results.filter(k => k !== null));
        });
    }, [autoId]);

    if (error) return <div>{error}</div>;
    if (!auto) return <div>Betöltés...</div>;

    return (
  <div className="auto-details-fullpage">
    <div className="auto-details-page">
      <button className="close-btn" onClick={() => navigate(-1)}>X</button>

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
            <div className="value">{auto.km.toLocaleString()} km</div>
          </div>
          <div>
            <div className="label">Ár</div>
            <div className="value">{auto.ar.toLocaleString()} Ft</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)};
