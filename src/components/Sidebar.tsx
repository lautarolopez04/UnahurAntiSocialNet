import { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import type { User } from '../types';

const API_URL = 'http://localhost:3001';

interface Tendencia {
  nombre: string;
  cantidad: number;
}

interface SidebarProps {
  tendencias: Tendencia[];
}

const novedadesHurlingham = [
  { titulo: 'El San Martín anunció demoras... otra vez', detalle: 'Transporte · Tendencia' },
  { titulo: 'Se terminaron las medialunas del buffet', detalle: 'UNAHUR · Hace 2 h' },
  { titulo: 'Alerta de lluvia en Villa Tesei', detalle: 'Clima · Hace 5 h' },
];

export function Sidebar({ tendencias }: SidebarProps) {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [seguidos, setSeguidos] = useState<number[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const otros = data.filter((u: User) => u.id !== user?.id).slice(0, 5);
          setUsuarios(otros);
          setSeguidos(otros.slice(0, 3).map((u: User) => u.id));
        }
      })
      .catch(() => setUsuarios([]));
  }, [user]);

  const toggleSeguir = (id: number) => {
    setSeguidos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <aside className="sidebar d-flex flex-column gap-3">
      <Card className="sidebar-card animar-entrada">
        <Card.Body>
          <h2 className="h6 fw-bold mb-3">Perfiles que seguís</h2>
          {usuarios.length === 0 && (
            <div className="d-flex flex-column gap-3" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <div className="d-flex align-items-center gap-2" key={n}>
                  <div className="skeleton skeleton-avatar" />
                  <div className="skeleton skeleton-linea" style={{ width: '60%' }} />
                </div>
              ))}
            </div>
          )}
          <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
            {usuarios.map((u) => (
              <li key={u.id} className="d-flex align-items-center gap-2 sidebar-usuario">
                <Avatar nickName={u.nickName} tamano={38} />
                <div className="flex-grow-1 text-truncate">
                  <span className="fw-semibold d-block text-truncate">{u.nickName}</span>
                  <small className="text-muted">@{u.nickName}</small>
                </div>
                <Button
                  size="sm"
                  variant={seguidos.includes(u.id) ? 'outline-primary' : 'primary'}
                  className="rounded-pill px-3 btn-animado"
                  onClick={() => toggleSeguir(u.id)}
                  aria-pressed={seguidos.includes(u.id)}
                >
                  {seguidos.includes(u.id) ? 'Siguiendo' : 'Seguir'}
                </Button>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>

      <Card className="sidebar-card animar-entrada" style={{ animationDelay: '100ms' }}>
        <Card.Body>
          <h2 className="h6 fw-bold mb-3">Tendencias</h2>
          {tendencias.length === 0 && (
            <small className="text-muted">Todavía no hay tendencias.</small>
          )}
          <ol className="list-unstyled mb-0 d-flex flex-column gap-2">
            {tendencias.map((tendencia, index) => (
              <li key={tendencia.nombre} className="tendencia-item rounded-3 px-2 py-1">
                <small className="text-muted d-block">{index + 1} · Tendencia en Hurlingham</small>
                <span className="fw-bold">#{tendencia.nombre}</span>
                <small className="text-muted d-block">
                  {tendencia.cantidad} {tendencia.cantidad === 1 ? 'publicación' : 'publicaciones'}
                </small>
              </li>
            ))}
          </ol>
        </Card.Body>
      </Card>

      <Card className="sidebar-card animar-entrada" style={{ animationDelay: '200ms' }}>
        <Card.Body>
          <h2 className="h6 fw-bold mb-3">Qué está pasando</h2>
          <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
            {novedadesHurlingham.map((novedad) => (
              <li key={novedad.titulo} className="tendencia-item rounded-3 px-2 py-1">
                <small className="text-muted d-block">{novedad.detalle}</small>
                <span className="fw-semibold">{novedad.titulo}</span>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>

      <small className="text-muted px-2">
        Términos · Privacidad · Accesibilidad · © 2026 UnaHur Anti-Social Net
      </small>
    </aside>
  );
}
