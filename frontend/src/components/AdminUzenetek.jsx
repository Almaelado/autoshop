


export default function AdminUzenetek({ accessToken }) {
    const [uzenetek, setUzenetek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUzenetek = async () => {
            setLoading(true);
            try {
                const res = await http.post('auto/adminuzenetek', {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUzenetek(res.data || []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Nem sikerült lekérdezni az üzeneteket");
            }
            finally {
                setLoading(false);
            }
        };
        fetchUzenetek();
    }, [accessToken]);
    if (loading) {
        return <div className="container mt-4">Betöltés...</div>;
    }   
    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }
    return (
        <div className="container mt-4">
            <h2>Üzenetek az érdeklődőktől</h2>
            {uzenetek.length === 0 ? (
                <div>Nincsenek üzenetek.</div>
            ) : (
                <div className="list-group">
                    {uzenetek.map((uzenet, index) => (
                        <div key={index} className="list-group-item">
                            {/* FEJLÉC: NÉV + MODELL + ÁR */}
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                <h4 className="mb-1">
                                    {uzenet.nev} {uzenet.model}
                                </h4>   
                                <span className="fw-bold text-success">
                                    {uzenet.ar} Ft
                                </span>
                            </div>
                            {/* ÜZENET TARTALMA */}
                            <p className="mt-2">{uzenet.uzenet_text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}