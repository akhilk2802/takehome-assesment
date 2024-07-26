import { Navbar, Container, Nav } from "react-bootstrap";
import "../styles/css/Header.css";

const Header = () => {
  return (
    <>
      <Navbar bg="dark" expand="lg" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">SupplyTrace</Navbar.Brand>
          {/* <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav> */}
        </Container>
      </Navbar>
    </>
  );
};
export default Header;
