import { useState, useEffect, useRef, useCallback } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import http from "../http-common";
import './Autok.css';

const Autok = ({ szuro }) => {
    const [autok, setAutok] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef();

    const navigate = useNavigate();

    const fetchAutok = async () => {
        setLoading(true);
        try {
            let szuroJson = JSON.parse(szuro);
            szuroJson.limit = 30;
            szuroJson.page = page;
            const response = await http.post("/auto/szuro", szuroJson);

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
            console.error("Error fetching autok:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setAutok([]);
        setPage(1);
        setHasMore(true);
    }, [szuro]);

    useEffect(() => {
        fetchAutok();
    }, [szuro, page]);

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

    return (
        <div className="autok-container">
            <h1>Autók Listája</h1>
            <div className="autok-grid">
                {autok.map((auto, index) => (
                    <Card
                        className="autok-card"
                        key={auto.id}
                        ref={autok.length === index + 1 ? lastItemRef : null}
                        onClick={() => navigate(`/auto/${auto.id}`)}
                    >
                        <Card.Img variant="top" src={`/img/${auto.id}_1.jpg`} />
                        <Card.Body>
                            <Card.Title>{auto.nev} {auto.model}</Card.Title>
                            <Card.Text>{auto.leírás}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Szín: {auto.szin_nev}</ListGroup.Item>
                            <ListGroup.Item>{auto.km} km</ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <Card.Text >Ár: {auto.ar} Ft</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            {loading && <p>Betöltés...</p>}
            {!hasMore && <p>Nincs több autó.</p>}
        </div>
    );
};

export default Autok;
