import { useState, useEffect, useRef, useCallback } from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import http from "../http-common";
import './Autok.css';

const Autok = ({ szuro, admin }) => {
    const [autok, setAutok] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef();
    const [kereso, setKereso] = useState("");
    const [keresés,setKeresés]=useState(false);    

    //console.log("Szuro prop:", szuro);
    const navigate = useNavigate();

    const fetchAutok = async () => {
        setLoading(true);
        try {
            let szuroJson = JSON.parse(szuro);
            szuroJson.limit = 30;
            szuroJson.page = page;

            const response = await http.post("/auto/szuro",
                 {...szuroJson, keres:keresés?kereso:""});

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
    }, [szuro,keresés]);

    useEffect(() => {
        fetchAutok();
    }, [szuro, page, keresés]);

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

    const handleDelete = async (id) => {
        if (!window.confirm("Biztos törlöd az autót?")) return;
        try {
            await http.delete(`/auto/${id}`);
            setAutok(prev => prev.filter(auto => auto.id !== id));
        } catch (err) {
            console.error("Törlés hiba:", err);
        }
    };
    const handleKereso = (e) => {
        setKereso(e.target.value);
    };
    const handleKeresoGomb = (e) => {
        setAutok([]);
        setPage(1);
        setHasMore(true);
        setKeresés(kereso.trim().length > 0);
};  

    
    return (
        <div className="autok-container">
            <h1>{admin ? "Autók kezelése (Admin)" : "Autók listája"}</h1>
            <div className="kereso-sor">
                <input
                    type="text"
                    placeholder="Keresés márka vagy típus alapján..."
                    value={kereso}
                    onChange={handleKereso}
                    className="kereso-input"
                />
                <Button
                    variant="primary"
                    className="ms-2"
                    onClick={handleKeresoGomb}
                >
                    Keresés
                </Button>
            </div>

            <div className="autok-grid">
                {autok.map((auto, index) => (
                    <Card
                        className="autok-card"
                        key={auto.id}
                        ref={autok.length === index + 1 ? lastItemRef : null}
                        onClick={() => admin ?  navigate(`/admin/auto/${auto.id}`):navigate(`/auto/${auto.id}`)}
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
                            {/* FELHASZNÁLÓI FELÜLET */}
                            {!admin && (
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/auto/${auto.id}`)}
                                >
                                    Részletek
                                </Button>
                            )}

                            {/* ADMIN FELÜLET */}
                            {admin && (
                                <>
                                    <Button
                                        variant="warning"
                                        className="me-2"
                                        onClick={() => navigate(`/admin/auto/${auto.id}`)}
                                    >
                                        Szerkesztés
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(auto.id)}
                                    >
                                        Törlés
                                    </Button>
                                </>
                            )}
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
