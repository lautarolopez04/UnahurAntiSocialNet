import { Card, Col } from 'react-bootstrap';

interface SkeletonCardProps {
  cantidad: number;
  enColumnas?: boolean;
}

export function SkeletonCard({ cantidad, enColumnas = false }: SkeletonCardProps) {
  const tarjetas = Array.from({ length: cantidad }, (_, index) => index);

  const tarjeta = (index: number) => (
    <Card className="h-100 skeleton-card" key={index} aria-hidden="true">
      <div className="skeleton skeleton-img" />
      <Card.Body>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton skeleton-linea" style={{ width: '40%' }} />
        </div>
        <div className="skeleton skeleton-linea mb-2" />
        <div className="skeleton skeleton-linea mb-2" style={{ width: '85%' }} />
        <div className="skeleton skeleton-linea" style={{ width: '60%' }} />
      </Card.Body>
    </Card>
  );

  return (
    <>
      <span className="visually-hidden" role="status">Cargando...</span>
      {tarjetas.map((index) =>
        enColumnas ? <Col key={index}>{tarjeta(index)}</Col> : tarjeta(index)
      )}
    </>
  );
}
