import React, { useState, useEffect } from "react";
import Autokreszletek from "./autokreszletek.jsx";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import http from "../http-common";
import "./FoOldal.css"; 

export default function FoOldal() {
  const [autok, setAutok] = useState([]);
  const [randomAutok, setRandomAutok] = useState([]);
  const [selectedAutoId, setSelectedAutoId] = useState(null);

  const fetchAutok = async () => {
    try {
      const response = await http.get("/auto/minden");
      setAutok(response.data);
      const shuffled = [...response.data].sort(() => 0.5 - Math.random());
      setRandomAutok(shuffled.slice(0, 6)); 
    } catch (error) {
      console.error("Error fetching autok:", error);
    }
  };

  useEffect(() => {
    fetchAutok();
  }, []);

  if (selectedAutoId !== null) {
    return (
      <div className="autok-container">
        <button className="vissza-btn" onClick={() => setSelectedAutoId(null)}>
          Vissza
        </button>
        <Autokreszletek autoId={selectedAutoId} />
      </div>
    );
  }

  return (
    <div id="fo-oldal">

      {/* -------- HERO BANNER -------- */}
      <div className="hero">
        <div className="hero-overlay">
          <h1>Ndidi Autókereskedés</h1>
          <p>Minőségi autók elérhető áron • Megbízhatóság • Szakértelem</p>
          <a href="#kiemelt" className="hero-btn">Fedezd fel az autókat</a>
        </div>
      </div>

      {/* -------- KIEMELT AUTÓK -------- */}
      <Container id="kiemelt" className="my-5">
        <h2 className="section-title">Kiemelt autóink</h2>

        <div className="car-grid">
          {randomAutok.map((auto) => (
            <Card key={auto.id} className="car-card">
              <Card.Img
                variant="top"
                src={`/img/${auto.id}_1.jpg`}
              />

              <Card.Body>
                <Card.Title>
                  {auto.nev} {auto.model}
                </Card.Title>

                <Card.Text className="car-price">
                  {auto.ar.toLocaleString()} Ft
                </Card.Text>

                <Button
                  variant="primary"
                  className="car-btn"
                  onClick={() => setSelectedAutoId(auto.id)}
                >
                  Részletek
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>

      {/* -------- RÓLUNK -------- */}
      <div className="rolunk-section">
        <h2>Rólunk</h2>
        <p>
          Üdvözlünk az <strong>Ndidi Autókereskedésnél</strong>!
          Több mint egy évtizede foglalkozunk minőségi autók értékesítésével.
          Célunk, hogy minden ügyfelünk olyan autót találjon, amely árban és megbízhatóságban is tökéletes számára.
        </p>

        <p>
          Folyamatosan frissülő kínálatunkban csak gondosan átvizsgált, tiszta és kiváló állapotú járműveket találsz.
          Köszönjük, hogy minket választasz!
        </p>
      </div>
      {/* -------- MIÉRT MINKET VÁLASSZ? -------- */}
<div className="why-us-section my-5">
  <h2 className="section-title">Miért válassz minket?</h2>
  <Row className="justify-content-center text-center">
    <Col md={3} sm={6} className="mb-4">
      <div className="why-us-card">
        <i className="bi bi-car-front-fill icon"></i>
        <h5>100% átvizsgált autók</h5>
        <p>Minden jármű teljes körű ellenőrzésen megy keresztül.</p>
      </div>
    </Col>
    <Col md={3} sm={6} className="mb-4">
      <div className="why-us-card">
        <i className="bi bi-speedometer2 icon"></i>
        <h5>Valós kilométeróra</h5>
        <p>Teljesen megbízható km-óra állások minden autón.</p>
      </div>
    </Col>
    <Col md={3} sm={6} className="mb-4">
      <div className="why-us-card">
        <i className="bi bi-cash-stack icon"></i>
        <h5>Kedvező árak</h5>
        <p>Versenyképes árak, mindenki számára elérhető autók.</p>
      </div>
    </Col>
    <Col md={3} sm={6} className="mb-4">
      <div className="why-us-card">
        <i className="bi bi-tools icon"></i>
        <h5>Garancia & szerviz</h5>
        <p>Minden autónkhoz garancia és átvizsgált szerviztörténet jár.</p>
      </div>
    </Col>
  </Row>
</div>

{/* -------- VÁSÁRLÓI VÉLEMÉNYEK -------- */}
<div className="testimonials-section my-5 p-5 bg-light text-center rounded">
  <h2 className="section-title">Vásárlóink mondták</h2>
  <Row className="justify-content-center mt-4">
    <Col md={4} className="mb-4">
      <div className="testimonial-card p-3 shadow-sm rounded">
        <p className="testimonial-text">
          „Nagyon korrekt cég, az autó tökéletes állapotban volt, minden kérdésemre válaszoltak.”
        </p>
        <h6 className="testimonial-author">– Kovács Péter</h6>
      </div>
    </Col>
    <Col md={4} className="mb-4">
      <div className="testimonial-card p-3 shadow-sm rounded">
        <p className="testimonial-text">
          „Gyors és egyszerű vásárlás, az autó kiváló állapotban érkezett. Csak ajánlani tudom!”
        </p>
        <h6 className="testimonial-author">– Szabó Anna</h6>
      </div>
    </Col>
    <Col md={4} className="mb-4">
      <div className="testimonial-card p-3 shadow-sm rounded">
        <p className="testimonial-text">
          „Nagyon kedves személyzet, profi kiszolgálás és tiszta autók. Biztosan visszatérek!”
        </p>
        <h6 className="testimonial-author">– Tóth Gábor</h6>
      </div>
    </Col>
  </Row>
</div>


      {/* -------- TÉRKÉP -------- */}
      <div className="terkep-container">
        <h3>Hol találsz minket?</h3>

        <iframe
          title="Mezőtúr céghely"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2682.863933094359!2d20.46123431573988!3d47.31409127915814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c5d1f7b4b93f%3A0x400af0f66198b30!2sMezőtúr!5e0!3m2!1shu!2hu!4v1700000000000!5m2!1shu!2hu"
          width="100%"
          height="450"
          style={{ border: "0" }}
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
