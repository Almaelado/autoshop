import './App.css'; 
import Autok from './components/felhasznaloi/autok.jsx';
import Bejelentkez from './components/profil/bejelentkez.jsx';
import Regisztracio from './components/profil/regisztracio.jsx';
import Szures from './components/felhasznaloi/szures.jsx';
import Menu from './components/felhasznaloi/menu.jsx';
import Reszletek from './components/felhasznaloi/autokreszletek.jsx';
import Kezdolap from './components/felhasznaloi/kezdolap.jsx';
import Footer from './components/felhasznaloi/footer.jsx';
import { useState, useEffect, useRef, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profil from './components/profil/profil.jsx';
import http from "./http-common";
import Admin from './components/admin/admin.jsx';
import VedettVonal from "./components/admin/VedettVonal.jsx";
import AdminVonal from "./components/admin/AdminVonal.jsx";
import AdminAutok from './components/admin/AdminAutok.jsx';
import Nyomtatvanyok from './components/admin/Nyomtatvanyok.jsx';
import ProfileSzerkesztes from './components/profil/ProfileSzerkesztes.jsx';
import Uzenet from './components/chatablak/uzenet.jsx';
import Uzenetek from './components/chatablak/uzenetek.jsx';
import AdminUzenetek from './components/admin/AdminUzenetek.jsx';
import Chatablak from './components/chatablak/Chatablak.jsx';
import Ujauto from './components/admin/Ujauto.jsx';
import EgyebMod from './components/admin/EgyebMod.jsx';
import './premium-theme.css';

function App() {
  const [belepett, setBelepett] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [szuroNyitva, setSzuroNyitva] = useState(false);
  const [loading, setLoading] = useState(true);
  const hargitaRef = useRef(null);
  const hargitaRafRef = useRef(null);


  const [szur, setSzur] = useState(JSON.stringify({
    markak:[], uzemanyag:[], szin:[], arRange:[], kmRange:[],
    evjarat:[], irat:false, valto:[], motormeret:0, ajto:[], szemely:[]
  }));

  const updateHargitaViewport = useCallback(() => {
    const hargita = hargitaRef.current;
    if (!hargita) return;

    const rect = hargita.getBoundingClientRect();
    const top = Math.max(Math.round(rect.top), 0);
    const bottom = Math.min(Math.round(rect.bottom), window.innerHeight);
    const height = Math.max(bottom - top, 0) || window.innerHeight;

    hargita.style.setProperty('--hargita-top', `${top}px`);
    hargita.style.setProperty('--hargita-height', `${height}px`);
  }, []);

  const scheduleHargitaViewportUpdate = useCallback(() => {
    if (hargitaRafRef.current !== null) return;

    hargitaRafRef.current = window.requestAnimationFrame(() => {
      hargitaRafRef.current = null;
      updateHargitaViewport();
    });
  }, [updateHargitaViewport]);

  const setHargitaNode = useCallback((node) => {
    hargitaRef.current = node;
    updateHargitaViewport();
  }, [updateHargitaViewport]);

  useEffect(() => {
    const root = document.documentElement;
    let scrollRafId = null;
    const SCROLL_DARKEN_DISTANCE_PX = 3200;

    const updateScrollProgress = () => {
      scrollRafId = null;
      const progress = Math.min(window.scrollY / SCROLL_DARKEN_DISTANCE_PX, 1);
      const easedProgress = Math.pow(progress, 0.85);

      root.style.setProperty('--scroll-progress', easedProgress.toFixed(4));
    };

    const scheduleScrollProgressUpdate = () => {
      if (scrollRafId !== null) return;
      scrollRafId = window.requestAnimationFrame(updateScrollProgress);
    };

    updateScrollProgress();
    window.addEventListener('scroll', scheduleScrollProgressUpdate, { passive: true });
    window.addEventListener('resize', scheduleScrollProgressUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleScrollProgressUpdate);
      window.removeEventListener('resize', scheduleScrollProgressUpdate);
      if (scrollRafId !== null) {
        window.cancelAnimationFrame(scrollRafId);
      }
      root.style.removeProperty('--scroll-progress');
    };
  }, []);

  // Refresh token
 useEffect(() => {
  const refreshAccessToken = async () => {
    try {
      const res = await http.post('/auto/refresh', {}, { withCredentials: true });
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setBelepett(true);
        console.log("res.data.user.admin:", Boolean(Number(res.data.user.admin)));
        setIsAdmin(Boolean(Number(res.data.user.admin)));
      } else {
        setBelepett(false);
        setIsAdmin(false);
      }
    } catch (err) {
      setBelepett(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  refreshAccessToken();
}, []);

  useEffect(() => {
    const handleViewportChange = () => {
      scheduleHargitaViewportUpdate();
    };

    updateHargitaViewport();
    window.addEventListener('scroll', handleViewportChange, { passive: true });
    window.addEventListener('resize', handleViewportChange);

    return () => {
      window.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
      if (hargitaRafRef.current !== null) {
        window.cancelAnimationFrame(hargitaRafRef.current);
        hargitaRafRef.current = null;
      }
    };
  }, [updateHargitaViewport, scheduleHargitaViewportUpdate]);


  // Betöltés amíg nem tudjuk az admin státuszt
  if (loading) return <div>Betöltés...</div>;


  return (
    <BrowserRouter>
      <Menu
        belepett={belepett}
        setAdmin={setIsAdmin}
        setAccessToken={setAccessToken}
        setBelepett={setBelepett}
        isAdmin={isAdmin} // passzoljuk a Menu-nak
      />
      <div className="App">
        <Routes>
          <Route path="/" element={<Kezdolap />} />
          <Route path="/autok" element={
  <div
    className='Hargita'
    ref={setHargitaNode}
  >
    {!szuroNyitva && (
      <button
        className="szuro-gomb btn btn-primary d-flex align-items-center"
        onClick={() => setSzuroNyitva(true)}
      >
        <span className="me-2 bi bi-funnel"></span> Szűrő
      </button>
    )}
    {szuroNyitva && <div className="overlay" onClick={() => setSzuroNyitva(false)} />}
    <div className={`szuro-panel${szuroNyitva ? ' nyitva' : ''}`}>
      <Szures onSearch={filter => setSzur(filter)} nyitva={szuroNyitva} setNyitva={setSzuroNyitva} />
    </div>
    <Autok szuro={szur} admin={isAdmin} />
  </div>
} />
          <Route path="/regisztracio" element={<Regisztracio />} />
          <Route path="/bejelentkez" element={<Bejelentkez setBelepett={setBelepett} setAccessToken={setAccessToken} setAdmin={setIsAdmin}/>} />
          <Route path="/profile" element={<VedettVonal belepett={belepett}><Profil accessToken={accessToken}/></VedettVonal>} />
          <Route path="/profil/szerkesztes" element={<VedettVonal belepett={belepett}><ProfileSzerkesztes accessToken={accessToken}/></VedettVonal>} />

          {/* Admin utak */}
          <Route path="/admin" element={<AdminVonal belepett={belepett} isAdmin={isAdmin}><Admin /></AdminVonal>} />
          <Route path="/admin/autok" element={<AdminVonal belepett={belepett} isAdmin={isAdmin}><AdminAutok /></AdminVonal>} />
          <Route path="/admin/nyomtatvanyok" element={<AdminVonal belepett={belepett} isAdmin={isAdmin}><Nyomtatvanyok accessToken={accessToken} /></AdminVonal>} />
          <Route path="/admin/uzenetek" element={<AdminVonal belepett={belepett} isAdmin={isAdmin}><AdminUzenetek accessToken={accessToken} /></AdminVonal>} />
          <Route path="/admin/chatablak" element={<AdminVonal belepett={belepett} isAdmin={isAdmin}><Chatablak accessToken={accessToken} admin={true} /></AdminVonal>} />
          <Route path="/admin/auto/:autoId" element={<AdminVonal belepett={belepett} isAdmin={isAdmin}><Reszletek accessToken={accessToken} admin={isAdmin} /></AdminVonal>} />
          <Route path="/admin/ujauto" element={<AdminVonal belepett={belepett} isAdmin={isAdmin}><Ujauto accessToken={accessToken} /></AdminVonal>} />
          <Route path="/admin/egyeb" element={<AdminVonal belepett={belepett} isAdmin={isAdmin}><EgyebMod accessToken={accessToken} /></AdminVonal>} />

          <Route path="/auto/:autoId" element={<Reszletek accessToken={accessToken} admin={false} />} />
          <Route path="/uzenet/:autoId" element={<Uzenet accessToken={accessToken} />} />
          <Route path="/uzenetek" element={<Uzenetek accessToken={accessToken} />} />
          <Route path="/uzenetablak" element={<Chatablak accessToken={accessToken} admin={false} />} />
        </Routes>
      </div>
      <Footer />
      
    </BrowserRouter>
  );
}


export default App;

