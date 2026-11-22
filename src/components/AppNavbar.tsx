import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">

          <span>UnaHur Anti-Social Net</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            {user && (
              <>
                <Nav.Link as={Link} to="/crear-post">
                  Nueva Publicación
                </Nav.Link>
                <Nav.Link as={Link} to="/perfil">
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
                <Nav.Link as={Link} to="/login">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
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