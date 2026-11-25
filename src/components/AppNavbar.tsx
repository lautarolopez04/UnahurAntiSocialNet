import { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoUnahur from '../assets/logoUnahur.png';


export function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const handleLogout = () => {
    cerrarMenu();
    logout();
    navigate('/login');
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="mb-4"
      expanded={menuAbierto}
      onToggle={(abierto) => setMenuAbierto(abierto)}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={cerrarMenu} className="d-flex align-items-center gap-2">
  <img
    src={logoUnahur}
    alt="Logo UnaHur"
    style={{ height: '40px', width: 'auto' }}
  />
  <span>UnaHur Anti-Social Net</span>
</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={cerrarMenu}>
              Inicio
            </Nav.Link>

            {user && (
              <>
                <Nav.Link as={Link} to="/crear-post" onClick={cerrarMenu}>
                  Nueva Publicación
                </Nav.Link>
                <Nav.Link as={Link} to="/perfil" onClick={cerrarMenu}>
                  Mi Perfil (@{user.nickName})
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto align-items-center gap-2">
            {user ? (
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={cerrarMenu}>
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={cerrarMenu}>
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}