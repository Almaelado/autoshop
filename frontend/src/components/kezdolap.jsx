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
        <Row>
          {randomAutok.map((auto) => (
            <Col key={auto.id} md={4} className="mb-3">
              <Card>
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
                <Card.Text>{auto.ar} Ft</Card.Text>
                <Button variant="primary" onClick={() => setSelectedAutoId(auto.id)}>Megnézem</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </div>
  );
}
