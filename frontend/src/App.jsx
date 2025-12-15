import './App.css'; 
import Autok from './components/autok.jsx';
import Bejelentkez from './components/bejelentkez.jsx';
import Regisztracio from './components/regisztracio.jsx';
import Szures from './components/szures.jsx';
import Menu from './components/menu.jsx';
import Kezdolap from './components/kezdolap.jsx';
import Footer from './components/footer.jsx';
import { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Profil from './components/profil.jsx';
import http from "./http-common";

function App() {
  const [belepett, setBelepett] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [szuroNyitva, setSzuroNyitva] = useState(false);
  const [szur, setSzur] = useState(JSON.stringify({
            markak:[],      
            uzemanyag:[],       
            szin:[],               
            arRange:[],
            kmRange:[],
            evjarat:[],
            irat:false,
            valto:[],                  
            motormeret:0,
            ajto:[],                           
            szemely:[]                         
        }));
  
        useEffect(() => {
          const refreshAccessToken = async () => {
            try {
              const response = await http.post('/auto/refresh', {}, { withCredentials: true });

              if (response.data?.accessToken) {
                setAccessToken(response.data.accessToken);
                setBelepett(true);
              } else {
                // nincs token, tehát user nem bejelentkezett
                setAccessToken(null);
                setBelepett(false);
              }
            } catch (err) {
              console.error(err);
              setAccessToken(null);
              setBelepett(false);
            }

          };

          refreshAccessToken();
        }, []);



  return (
    <BrowserRouter>
      <Menu belepett={belepett}/>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Kezdolap />
              </>
            }
          />
          <Route
            path="/autok"
            element={
              <div className='Hargita'>
                <button 
                  className="szuro-gomb" 
                  onClick={() => setSzuroNyitva(prev => !prev)}
                >
                  Szűrő
                </button>
                {szuroNyitva && <div className="overlay" onClick={() => setSzuroNyitva(false)} />}
                <Szures 
                  onSearch={(filter) => setSzur(filter)} 
                  nyitva={szuroNyitva}
                  setNyitva={setSzuroNyitva}
                />

                <Autok szuro={szur} />
              </div>
            }
          />

          <Route path="/regisztracio" element={<Regisztracio />} />
          <Route path="/bejelentkez" element={<Bejelentkez setBelepett={setBelepett} setAccessToken={setAccessToken} />} />
          <Route path="/profile" element={<Profil accessToken={accessToken}/>} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
