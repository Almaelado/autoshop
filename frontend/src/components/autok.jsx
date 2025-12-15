import http from "../http-common";
import { useState, useEffect,useRef,useCallback } from "react";
import { Card, ListGroup } from "react-bootstrap";
import Autokreszletek from "./autokreszletek.jsx";
import './Autok.css';

const Autok = ({ szuro }) => {
    const [autok, setAutok] = useState([]);
    const [selectedAutoId, setSelectedAutoId] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef();

    const fetchAutok = async () => {
        setLoading(true);
        try {
            console.log(szuro)
            const response = await http.post("/auto/szuro",szuro);
            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setAutok((prev) => {
                const newItems = response.data.filter(
                    (item) => !prev.some((prevItem) => prevItem.id === item.id)
                );
                    return [...prev, ...newItems];
                });
            }
        } catch (error) {
            console.log(szuro);
            console.error("Error fetching autok:", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setAutok([]);
        setPage(1);
        setHasMore(true);
    }, [szuro]);
    useEffect(() => {
        //console.log("Fetching autok with szuro:", szuro);
        let szuroJson = JSON.parse(szuro);
        szuroJson.limit = 30;
        szuroJson.page = page;
        szuro = JSON.stringify(szuroJson);
        fetchAutok(szuro);
    }, [szuro,page]);

    const lastItemRef = useCallback(
        (node) => {
          if (loading) return;
          if (observerRef.current) observerRef.current.disconnect();
          observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
              setPage((prev) => prev + 1);
            }
          });
          if (node) observerRef.current.observe(node);
        },
        [loading, hasMore]
  );

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
                {
                    autok.map((auto, index) => {
                        if (autok.length === index + 1) {
                            return (
                                <Card className="autok-card" key={index} ref={lastItemRef}>
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
                            );
                        } else {
                            return (
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
                            );
                        }
                    })
                }
                {loading && <p>Loading...</p>}
                {!hasMore && <p>Nincs több autó.</p>}
            </div>
        </div>
    );
};

export default Autok;
