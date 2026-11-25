import { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
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
      sticky="top"
      variant="dark"
      expand="lg"
      className="mb-4 navbar-glass"
      expanded={menuAbierto}
      onToggle={(abierto) => setMenuAbierto(abierto)}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={cerrarMenu} className="d-flex align-items-center gap-2 brand-animada">
          <img
            src={logoUnahur}
            alt="Logo UnaHur"
            style={{ height: '40px', width: 'auto' }}
          />
          <span className="fw-bold">UnaHur Anti-Social Net</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-lg-auto gap-1 gap-lg-2 my-3 my-lg-0">
            <Nav.Link as={NavLink} to="/" end onClick={cerrarMenu} className="nav-pill">
              <span aria-hidden="true">🏠</span> Inicio
            </Nav.Link>

            {user && (
              <>
                <Nav.Link as={NavLink} to="/crear-post" onClick={cerrarMenu} className="nav-pill">
                  <span aria-hidden="true">✏️</span> Nueva publicación
                </Nav.Link>
                <Nav.Link as={NavLink} to="/perfil" onClick={cerrarMenu} className="nav-pill">
                  <span aria-hidden="true">👤</span> Mi perfil
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="flex-row flex-wrap align-items-center gap-2 pb-2 pb-lg-0">
            {user ? (
              <>
                <Link to="/perfil" onClick={cerrarMenu} className="usuario-chip d-flex align-items-center gap-2 text-decoration-none">
                  <Avatar nickName={user.nickName} tamano={32} />
                  <span className="small fw-semibold">@{user.nickName}</span>
                </Link>
                <Button variant="outline-danger" size="sm" className="rounded-pill px-3 btn-animado" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button as={NavLink} to="/login" onClick={cerrarMenu} variant="outline-primary" size="sm" className="rounded-pill px-3 btn-animado">
                  Iniciar sesión
                </Button>
                <Button as={NavLink} to="/register" onClick={cerrarMenu} variant="primary" size="sm" className="rounded-pill px-3 btn-animado">
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
