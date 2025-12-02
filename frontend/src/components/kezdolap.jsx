import React, { useState, useEffect } from "react";
import Autokreszletek from "./autokreszletek.jsx";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import http from "../http-common";

export default function FoOldal() {
  const [autok, setAutok] = useState([]);
  const [randomAutok, setRandomAutok] = useState([]);
  const [selectedAutoId, setSelectedAutoId] = useState(null);

  const fetchAutok = async () => {
    try {
      const response = await http.get("/auto/minden");
      setAutok(response.data);
      const shuffled = [...response.data].sort(() => 0.5 - Math.random());
      setRandomAutok(shuffled.slice(0, 5));
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
                  <button onClick={() => setSelectedAutoId(null)}>Vissza</button>
                  <Autokreszletek autoId={selectedAutoId} />
              </div>
          );
      }

  return (
  <div id="fo-oldal">
    <Container className="my-5">
      <h2 className="mb-4">Kiemelt Autók</h2>

      {/* Külön div, benne flex-ben a 3 kártya */}
      <div style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        flexWrap: "nowrap"
      }}>
        {randomAutok.slice(0, 5).map((auto) => (
          <Card key={auto.id} style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src={`/img/${auto.id}_1.jpg`}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x200";
              }}
            />

            <Card.Body>
              <Card.Title>
                {auto.nev} {auto.model}
              </Card.Title>

              <Card.Text>
                Ár: <strong>{auto.ar} Ft</strong>
              </Card.Text>

              <Button
                variant="primary"
                onClick={() => setSelectedAutoId(auto.id)}
              >
                Megnézem
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
    <div className="mt-5 p-5 bg-light text-center rounded">
  <h2 className="mb-3">Rólunk</h2>
  <p style={{ fontSize: "18px", maxWidth: "800px", margin: "0 auto" }}>
    Üdvözlünk az <strong>Ndidi Autó Kölcsönzőnél</strong>!  
    Több mint 10 éve foglalkozunk megbízható autók bérbeadásával.  
    Célunk, hogy gyorsan, egyszerűen és kedvező áron segítsünk
    megtalálni a számodra tökéletes járművet – legyen szó városi
    közlekedésről vagy hosszabb utazásról.
  </p>
  <p style={{ fontSize: "18px", maxWidth: "800px", margin: "20px auto 0" }}>
    Nálunk minden autó rendszeresen karbantartott, tiszta és készen áll az indulásra.  
    Köszönjük, hogy minket választasz!
  </p>
</div>

{/* --- TÉRKÉP SZEKCIÓ (Mezőtúr) --- */}
<div className="mt-4 mb-5" style={{ textAlign: "center" }}>
  <h3 className="mb-3">Itt talál minket</h3>
  <iframe
    title="Mezőtúr céghely"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2682.863933094359!2d20.46123431573988!3d47.31409127915814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c5d1f7b4b93f%3A0x400af0f66198b30!2sMezőtúr!5e0!3m2!1shu!2shu!4v1700000000000!5m2!1shu!2shu"
    width="100%"
    height="450"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
  </div>
);

}
