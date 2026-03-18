import { Link, useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BsEnvelope, BsPersonCircle } from "react-icons/bs";
import http from "../../http-common";
import './menu.css';

export default function Menu({belepett, setBelepett, setAdmin, setAccessToken, isAdmin}) {
  const location = useLocation();

  const isActivePath = (paths, options = {}) => {
    const { exact = false } = options;
    const currentPath = location.pathname;

    return paths.some((path) => {
      if (exact) return currentPath === path;
      return currentPath === path || currentPath.startsWith(`${path}/`);
    });
  };

  const navLinkClass = (paths, options) =>
    `menu-link${isActivePath(paths, options) ? " active" : ""}`;

  const dropdownClass = (paths, options) =>
    `menu-dropdown${isActivePath(paths, options) ? " active" : ""}`;

  
  // Admin Navbar csak ha tényleg admin
  if (location.pathname.startsWith("/admin") && isAdmin) {
    return (
      <Navbar bg="dark" variant="dark" expand="lg" className="main-menu">
        <Container>
          <Navbar.Brand as={Link} to="/admin" className="menu-brand">
            <img
              src="http://localhost:80/img/autoshoplogo.png"
              alt="Ndidi Autó kereskedés logo"
              height="40"
              className="menu-logo"
            />
            <span className="menu-brand-text">Ndidi Autó kereskedés</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-nav" />
          <Navbar.Collapse id="admin-nav">
            <Nav>
              <Nav.Link
                as={Link}
                to="/admin/nyomtatvanyok"
                className={navLinkClass(["/admin/nyomtatvanyok"])}
              >
                Nyomtatványok
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/autok"
                className={navLinkClass(["/admin/autok", "/admin/auto"])}
              >
                Autók
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/ujauto"
                className={navLinkClass(["/admin/ujauto"])}
              >
                Új autó
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/egyeb"
                className={navLinkClass(["/admin/egyeb"])}
              >
                Módósítások
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/admin/uzenetek"
                className={navLinkClass(["/admin/uzenetek", "/admin/chatablak"])}
              >
                <span className="menu-icon" aria-hidden="true"><BsEnvelope /></span>
                Üzenetek
              </Nav.Link>
              <NavDropdown
                title={
                  <>
                    <span className="menu-icon" aria-hidden="true"><BsPersonCircle /></span>
                    Admin
                  </>
                }
                id="admin-dropdown"
                className={dropdownClass(["/admin"], { exact: true })}
              >
                <NavDropdown.Item onClick={async () => {
                  await http.post("/auto/logout", {}, { withCredentials: true });
                  setBelepett(false);
                  setAdmin(false);
                  setAccessToken(null);
                  window.location.href = "/";
                }}>Kijelentkezés</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  // Normál Navbar
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="main-menu">
  <Container>
    <Navbar.Brand as={Link} to="/" className="menu-brand">
      <img
        src="http://localhost:80/img/autoshoplogo.png"
        alt="Ndidi Autó kereskedés logo"
        height="40"
        className="menu-logo"
      />
      <span className="menu-brand-text">Ndidi Autó kereskedés</span>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="nav" />
    <Navbar.Collapse id="nav">
      
      {/* BAL OLDAL */}
      <Nav>
        <Nav.Link as={Link} to="/" className={navLinkClass(["/"], { exact: true })}>
          Kezdőlap
        </Nav.Link>
        <Nav.Link as={Link} to="/autok" className={navLinkClass(["/autok", "/auto"])}>
          Autók
        </Nav.Link>
      </Nav>

      {/* JOBB OLDAL */}
      <Nav className="ms-auto">
        
        {belepett ? (
          <>
            <Nav.Link
              as={Link}
              to="/uzenetek"
              className={navLinkClass(["/uzenetek", "/uzenet", "/uzenetablak"])}
            >
              <span className="menu-icon" aria-hidden="true"><BsEnvelope /></span>
              Üzenetek
            </Nav.Link>
            <NavDropdown
              title={
                <>
                  <span className="menu-icon" aria-hidden="true"><BsPersonCircle /></span>
                  Saját fiók
                </>
              }
              id="basic-nav-dropdown"
              className={dropdownClass(["/profile", "/profil"])}
            >
              <NavDropdown.Item as={Link} to="/profile">Profilom</NavDropdown.Item>
              <NavDropdown.Item
                onClick={async () => {
                  await http.post("/auto/logout", {}, { withCredentials: true });
                  window.location.href = "/";
                  setBelepett(false);
                  setAdmin(false);
                  setAccessToken(null);
                }}
              >
                Kijelentkezés
              </NavDropdown.Item>
            </NavDropdown>
          </>
        ) : (
          <NavDropdown
            title={
              <>
                <span className="menu-icon" aria-hidden="true"><BsPersonCircle /></span>
                Bejelentkezés
              </>
            }
            id="basic-nav-dropdown"
            className={dropdownClass(["/bejelentkez", "/regisztracio"])}
          >
            <NavDropdown.Item as={Link} to="/regisztracio">Regisztráció</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bejelentkez">Bejelentkezés</NavDropdown.Item>
          </NavDropdown>
        )}
      </Nav>

    </Navbar.Collapse>
  </Container>
</Navbar>

  );
}
