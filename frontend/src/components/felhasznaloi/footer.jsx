import { Link } from "react-router-dom";
import "./footer.css";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>Ndidi Auto kereskedes</h3>
            <p>Attekintheto autokereses es egyszeru kapcsolatfelvetel egy helyen.</p>
          </div>

          <nav className="footer-links" aria-label="Footer navigacio">
            <Link to="/">Kezdolap</Link>
            <Link to="/autok">Autok</Link>
            <Link to="/bejelentkez">Bejelentkezes</Link>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Ndidi Auto Kereskedes. Minden jog fenntartva.</p>
        </div>
      </div>
    </footer>
  );
}
