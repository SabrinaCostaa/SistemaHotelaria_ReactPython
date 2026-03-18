import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

function NavbarTWM({ toggleTema, temaAtual }) {
  return (
    <Navbar expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">Hotelaria</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Painel de Controle</Nav.Link>
            <Nav.Link as={Link} to="/about">Informações do Sistema</Nav.Link>
            <Nav.Link as={Link} to="/auditoria">Auditoria</Nav.Link>
            
            <NavDropdown title="Cadastros" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/hospedes">Hóspedes</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/quartos">Quartos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/hospedagens">Hospedagens</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reservas">Reservas</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/limpeza">Limpeza</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Nav className="ms-auto align-items-center">
            <Button 
              variant="outline-secondary" 
              onClick={toggleTema}
              className="rounded-circle border-0"
              style={{ fontSize: '1.2rem', padding: '0 8px' }}
              title={temaAtual === 'light' ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
            >
              {temaAtual === 'light' ? '🌙' : '☀️'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarTWM;