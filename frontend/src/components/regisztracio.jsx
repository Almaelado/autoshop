import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import http from '../http-common';

export default function Regisztracio() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError("A jelszavak nem egyeznek.");
            return;
        }

        try {
            const response = await http.post('/user/register', { username, email, password });
            setSuccess("Sikeres regisztráció! Most be tudsz jelentkezni.");
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Hiba történt a regisztráció során.");
            }
        }
    };

    return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="regUsername">
                <Form.Label>Felhasználónév</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Írd be a felhasználóneved"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="regEmail">
                <Form.Label>Email cím</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Írd be az email címed"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="regPassword">
                <Form.Label>Jelszó</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Írd be a jelszavad"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="regConfirmPassword">
                <Form.Label>Jelszó megerősítése</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Írd be újra a jelszavad"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>

            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
            {success && <div style={{ color: "green", marginTop: "10px" }}>{success}</div>}

            <Button variant="primary" type="submit" className="mt-3">
                Regisztráció
            </Button>
        </Form>
    </div>
    );
}