import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import http from '../http-common';
import { useNavigate } from 'react-router-dom';
import './bejelentkez.css';


export default function Bejelentkez( {setBelepett,setAccessToken,setAdmin} ) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await http.post('auto/login', { email, password },{withCredentials:true});
            console.log("Bejelentkezés sikeres:", response.data);
            setAccessToken(response.data.accessToken);
            setBelepett(true);
            if(response.data.user.admin === 1){
                setAdmin(true);
                navigate('/admin');
                return;
            }
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError("Hibás felhasználónév vagy jelszó.");
            } else {
                setError("Hálózati hiba, próbáld újra.");
            }
        }
    };

    return (
  <div className="login-container">
    <div className="login-form">
      <h2>Bejelentkezés</h2>
      <p>Üdv újra! Jelentkezz be a folytatáshoz.</p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="form-group">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Írd be az email címed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>Jelszó</Form.Label>
          <Form.Control
            type="password"
            placeholder="Írd be a jelszavad"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {error && (
          <div style={{ color: "#ff3333", marginTop: "10px", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <button type="submit" className="form-button">
          Bejelentkezés
        </button>
      </Form>
    </div>
  </div>
);
}

