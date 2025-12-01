import { useState, useEffect } from "react";
import http from "../http-common";
import { Container, Row, Col, Carousel } from "react-bootstrap";

export default function Autokreszletek({ autoId }) {
  const [auto, setAuto] = useState(null);
  const [error, setError] = useState(null);
  const [kepek, setKepek] = useState([]);

  useEffect(() => {
    const fetchAutoDetails = async () => {
      try {
        const response = await http.get(`/auto/egy/${autoId}`);
        setAuto(response.data);
      } catch (error) {
        setError("Nem sikerült betölteni az autó adatait.");
      }
    };
    fetchAutoDetails();
  }, [autoId]);


  // Képlista generálás ID alapján
  useEffect(() => {
  if (!autoId) return;

  const maxImages = 20;
  const promises = [];

  for (let i = 1; i <= maxImages; i++) {
    const path = `/img/${autoId}_${i}.jpg`;

    const p = new Promise(resolve => {
      const img = new Image();
      img.src = path;

      img.onload = () => resolve(path);
      img.onerror = () => resolve(null); // ha nincs ilyen kép
    });

    promises.push(p);
  }

  Promise.all(promises).then(results => {
    const valid = results.filter(k => k !== null);
    setKepek(valid);
  });

}, [autoId]);


  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!auto || kepek.length === 0) return <div>Betöltés...</div>;


  return (
  <div className="auto-details-page">
    <Container className="mt-4">

      <Row className="justify-content-center align-items-start">

        {/* BAL OLDAL – Carousel */}
        <Col md={6} className="mb-4">
          <Carousel interval={null} indicators={true} controls={true}>
            {kepek.map((kep, index) => (
              <Carousel.Item key={index}>
                <div
                  style={{
                    width: "100%",
                    height: "600px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={kep}
                    alt={`Kép ${index + 1}`}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                    className="d-block"
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        {/* JOBB OLDAL – Autó adatok */}
        <Col md={4} className="text-center">
          <h2 className="mb-3">
            {auto.nev} {auto.model}
          </h2>

          <p className="text-muted">{auto.leírás}</p>

          <ul className="list-unstyled mt-4">
            <li><strong>Szín:</strong> {auto.szin_nev}</li>
            <li><strong>Km:</strong> {auto.km.toLocaleString()} km</li>
            <li>
              <strong>Ár:</strong>{" "}
              {auto.ar.toLocaleString()} Ft
            </li>
          </ul>
        </Col>

      </Row>

    </Container>
  </div>
);
}
