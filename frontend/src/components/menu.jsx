import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from 'react-bootstrap/NavDropdown';


export default function Menu() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>

        <Navbar.Brand as={Link} to="/">Ndidi Autó kereskedés</Navbar.Brand>

        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Kezdőlap</Nav.Link>
            <Nav.Link as={Link} to="/autok">Autók</Nav.Link>
            <Nav.Link as={Link} to="/regisztracio">Regisztráció</Nav.Link>
            <Nav.Link as={Link} to="/bejelentkez">Bejelentkezés</Nav.Link>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}