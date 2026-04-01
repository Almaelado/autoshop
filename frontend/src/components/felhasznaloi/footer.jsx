import { Link } from "react-router-dom";
import "./footer.css";

const currentYear = new Date().getFullYear();

export default function Footer({ isAdmin = false }) {
  return (
    <footer className={`footer${isAdmin ? " footer-admin" : ""}`}>
      <div className="footer-shell">
        <div className={`footer-top${isAdmin ? " footer-top-admin" : ""}`}>
          <div className="footer-brand">
            <h3>Ndidi Auto kereskedés</h3>
            <p>Áttekinthető autókeresés és egyszerű kapcsolatfelvétel egy helyen.</p>
          </div>

          {!isAdmin && (
            <nav className="footer-links" aria-label="Footer navigacio">
              <Link to="/">Kezdőlap</Link>
              <Link to="/autok">Autók</Link>
              <Link to="/bejelentkez">Bejelentkezés</Link>
            </nav>
          )}
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Ndidi Auto Kereskedés. Minden jog fenntartva.</p>
        </div>
      </div>
    </footer>
  );
}
