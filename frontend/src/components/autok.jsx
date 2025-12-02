import http from "../http-common";
import { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import Autokreszletek from "./autokreszletek.jsx";
import './Autok.css';

const Autok = ({ szuro }) => {
    const [autok, setAutok] = useState([]);
    const [selectedAutoId, setSelectedAutoId] = useState(null);
    const [szamlalo, setSzamlalo] = useState(0);

    const fetchAutok = async () => {
        try {
            console.log(szuro)
            const response = await http.post("/auto/szuro",szuro);
            console.log("Fetched autok:", response.data);
            setAutok(response.data);
        } catch (error) {
            console.log(szuro);
            console.error("Error fetching autok:", error);
        }
    };
    useEffect(() => {
        //console.log("Fetching autok with szuro:", szuro);
        let szuroJson = JSON.parse(szuro);
        szuroJson.offset = szamlalo;
        szuro = JSON.stringify(szuroJson);
        fetchAutok(szuro);
    }, [szuro,szamlalo]);

    // If a car is selected, show its details
    if (selectedAutoId !== null) {
        return (
            <div className="autok-container">
                <button onClick={() => setSelectedAutoId(null)}>Vissza</button>
                <Autokreszletek autoId={selectedAutoId} />
            </div>
        );
    }

    return (
        <div className="autok-container">
            <h1>Autók Listája</h1>
            <div className="autok-grid">
                {autok.map((auto, index) => (
                    <Card className="autok-card" key={index}>
                        <Card.Img variant="top" src={`/img/${auto.id}_1.jpg`} />
                        <Card.Body>
                            <Card.Title>{auto.nev} {auto.model}</Card.Title>
                            <Card.Text>{auto.leírás}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Szín: {auto.szin_nev}</ListGroup.Item>
                            <ListGroup.Item>{auto.km} km</ListGroup.Item>
                            <ListGroup.Item>Ár: {auto.ar} Ft</ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <button onClick={() => setSelectedAutoId(auto.id)}>Részletek</button>
                        </Card.Body>
                    </Card>
                ))}
                <button onClick={()=>setSzamlalo(szamlalo+10)}>+10</button>
            </div>
        </div>
    );
};

export default Autok;
