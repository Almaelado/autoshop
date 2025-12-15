import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import http from '../http-common';

export default function Bejelentkez() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await http.post('auto/login', { email, password });
            console.log("Bejelentkezés sikeres:", response.data);
            // Itt lehet token mentése vagy átirányítás pl.:
            // localStorage.setItem('userToken', response.data.token);
            window.location.href = '/';
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError("Hibás felhasználónév vagy jelszó.");
            } else {
                setError("Hálózati hiba, próbáld újra.");
            }
        }
    };

    return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="userEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Írd be az email címed"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="userPassword">
                <Form.Label>Jelszó</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Írd be a jelszavad"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

            <Button variant="primary" type="submit" className="mt-3">
                Bejelentkezés
            </Button>
        </Form>
    </div>
    );
}

