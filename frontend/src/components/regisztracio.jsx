import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import http from '../http-common';
import './regisztracio.css';

export default function Regisztracio() {
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
            await http.post('/auto/regisztracio', { email, password });
            setSuccess("Sikeres regisztráció! Most be tudsz jelentkezni.");
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
        <div className="register-container">
            <Form className="register-form" onSubmit={handleSubmit}>
                <h2>Regisztráció</h2>
                <p>Csatlakozz hozzánk, móka és kacagás vár!</p>

                <Form.Group className="form-group" controlId="regEmail">
                    <Form.Label>Email cím</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Írd be az email címed"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="form-group" controlId="regPassword">
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Írd be a jelszavad"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="form-group" controlId="regConfirmPassword">
                    <Form.Label>Jelszó megerősítése</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Írd be újra a jelszavad"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {error && <div style={{ color: "#ff6f91", marginTop: "10px", fontWeight: "bold" }}>{error}</div>}
                {success && <div style={{ color: "#6a89cc", marginTop: "10px", fontWeight: "bold" }}>{success}</div>}

                <Button className="register-button" type="submit">
                    Regisztráció
                </Button>

                <div className="register-link">
                    Már van fiókod? <a href="/login">Jelentkezz be!</a>
                </div>
            </Form>
        </div>
    );
}