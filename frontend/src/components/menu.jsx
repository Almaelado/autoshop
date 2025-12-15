import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from 'react-bootstrap/NavDropdown';
import http from "../http-common";

export default function Menu({belepett}) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Ndidi Autó kereskedés</Navbar.Brand>
        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Kezdőlap</Nav.Link>
            <Nav.Link as={Link} to="/autok">Autók</Nav.Link>
            <div style={{position: 'absolute', right: 50, top: 7}}>
              {belepett ? (
                <NavDropdown title="Saját fiók" id="basic-nav-dropdown" className="ms-auto">
                  <NavDropdown.Item as={Link} to="/profile">Profilom</NavDropdown.Item>
                  <NavDropdown.Item 
                    onClick={async()=>{
                      await http.post("/auto/logout", {}, { withCredentials: true });
                      window.location.href="/";
                      
                  }}>Kijelentkezés</NavDropdown.Item>
                </NavDropdown>
              ) : (
              <NavDropdown title="Bejelentkezés" id="basic-nav-dropdown" className="ms-auto">
                <NavDropdown.Item as={Link} to="/regisztracio">Regisztráció</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/bejelentkez">Bejelentkezés</NavDropdown.Item>
              </NavDropdown>)}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}