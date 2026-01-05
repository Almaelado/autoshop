import './App.css'; 
import Autok from './components/autok.jsx';
import Bejelentkez from './components/bejelentkez.jsx';
import Regisztracio from './components/regisztracio.jsx';
import Szures from './components/szures.jsx';
import Menu from './components/menu.jsx';
import Reszletek from './components/autokreszletek.jsx';
import Kezdolap from './components/kezdolap.jsx';
import Footer from './components/footer.jsx';
import { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Profil from './components/profil.jsx';
import http from "./http-common";
import Admin from './components/admin.jsx';
import VedettVonal from "./components/VedettVonal.jsx";
import AdminVonal from "./components/AdminVonal.jsx";
import AdminAutok from './components/AdminAutok.jsx';
import AdminFelhasznalok from './components/AdminFelhasznalok.jsx';

function App() {
  const [belepett, setBelepett] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [szuroNyitva, setSzuroNyitva] = useState(false);
  const [loading, setLoading] = useState(true);

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
                
                if (response.data.user.admin === 1) {
                  setIsAdmin(true);
                } else {
                  setIsAdmin(false);
                }
              } else {
                // nincs token, tehát user nem bejelentkezett
                setAccessToken(null);
                setBelepett(false);
              }
            } catch (err) {
              console.error(err);
              setAccessToken(null);
              setBelepett(false);
            } finally {
              setLoading(false);
            }

          };

          refreshAccessToken();
        }, []);


  if (loading) {
    return <div>Betöltés...</div>;
  }
  return (
    <BrowserRouter>
      <Menu belepett={belepett} setAdmin={setIsAdmin} setAccessToken={setAccessToken} setBelepett={setBelepett}/>
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

                <Autok szuro={szur} admin={isAdmin} />
              </div>
            }
          />

          <Route path="/regisztracio" element={<Regisztracio />} />
          <Route path="/bejelentkez" element={<Bejelentkez setBelepett={setBelepett} setAccessToken={setAccessToken} setAdmin={setIsAdmin}/>} />
          <Route path="/profile" element={
            <VedettVonal belepett={belepett}>
              <Profil accessToken={accessToken}/>
            </VedettVonal>
          } />
          <Route path="/admin" element={
              <AdminVonal belepett={belepett} isAdmin={isAdmin}>
                <Admin />
              </AdminVonal>
          } />
          <Route path="/admin/autok" element={
              <AdminVonal belepett={belepett} isAdmin={isAdmin}>
                <AdminAutok />
              </AdminVonal>
          } />
          <Route path="/admin/felhasznalok" element={
              <AdminVonal belepett={belepett} isAdmin={isAdmin}>
                <AdminFelhasznalok />
              </AdminVonal>
          } />
          <Route path="/auto/:autoId" element={<Reszletek />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
