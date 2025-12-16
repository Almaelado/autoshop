import { Link,useLocation } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from 'react-bootstrap/NavDropdown';
import http from "../http-common";


export default function Menu({belepett, setBelepett, setAdmin, setAccessToken}) {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/admin">
          Ndidi Autó kereskedés
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-nav" />
        <Navbar.Collapse id="admin-nav">

          {/* BAL OLDAL */}
          <Nav>
            <Nav.Link as={Link} to="/admin/felhasznalok">
              Felhasználók
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/uzenetek">
              Üzenetek
            </Nav.Link>
          </Nav>

          {/* JOBB OLDAL */}
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/admin/uzenetek">
              Üzenetek
            </Nav.Link>
            <NavDropdown title="Admin" id="admin-dropdown">
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
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


  return (
    <Navbar bg="dark" variant="dark" expand="lg">
  <Container>
    <Navbar.Brand as={Link} to="/">Ndidi Autó kereskedés</Navbar.Brand>
    <Navbar.Toggle aria-controls="nav" />
    <Navbar.Collapse id="nav">
      
      {/* BAL OLDAL */}
      <Nav>
        <Nav.Link as={Link} to="/">Kezdőlap</Nav.Link>
        <Nav.Link as={Link} to="/autok">Autók</Nav.Link>
      </Nav>

      {/* JOBB OLDAL */}
      <Nav className="ms-auto">
        {belepett ? (
          <NavDropdown title="Saját fiók" id="basic-nav-dropdown">
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
        ) : (
          <NavDropdown title="Bejelentkezés" id="basic-nav-dropdown">
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