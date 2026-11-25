import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Card, Button, Alert, CardBody, CardText } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { getPostsByUserId, getCommentsByPostId, getPostImages } from '../services/api'
import { SkeletonCard } from '../components/SkeletonCard'
import type { Post, PostImage } from '../types'

interface EnrichedPost extends Post {
  images: PostImage[];
  visibleCommentsCount: number;
}

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [publicaciones, setPublicaciones] = useState<EnrichedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const[error, setError] = useState<string | null>(null)

  useEffect(() => {
    if(!user) return;

    const fetchUserPosts = async () => {
        if (!user) return;
        try {
          setLoading(true);
          setError(null);
          const posts = await getPostsByUserId(user.id);
          const enriched = await Promise.all(
            posts.map(async (p) => {
              const [comentarios, images] = await Promise.all([
                getCommentsByPostId(p.id).catch(() => []),
                getPostImages(p.id).catch(() => []),
              ]);
              return {...p, visibleCommentsCount: comentarios.length, images}
            })
          );
          setPublicaciones(enriched.sort((a,b) => b.id - a.id));
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al cargar las publicaciones.');
        } finally {
          setLoading(false);
        }
      };
      fetchUserPosts();
  }, [user]);

  useEffect(() => {
    document.title = `@${user?.nickName} | UnaHur Anti-Social Net`;

    return () => {
      document.title = 'UnaHur Anti-Social Net';
    };
  }, [user]);

  const totalComentarios = publicaciones.reduce(
    (acumulado, p) => acumulado + p.visibleCommentsCount,
    0
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <Container className='py-4' style={{maxWidth:'800px'}}>
        <Card className='mb-4 shadow-sm perfil-header animar-entrada'>
          <Card.Body className='d-flex align-items-center gap-3 flex-wrap'>
            <div className='d-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0 avatar-perfil avatar-pulso'
                aria-hidden='true'
            >
              {user?.nickName.charAt(0).toUpperCase()}
            </div>

            <div className='flex-grow-1'>
              <h1 className='h3 fw-bold mb-1'>
                @{user?.nickName}
              </h1>
              <small className='text-muted'>
                {publicaciones.length} {publicaciones.length === 1 ? 'publicación' : 'publicaciones'}
                {' · '}
                {totalComentarios} {totalComentarios === 1 ? 'comentario recibido' : 'comentarios recibidos'}
              </small>
            </div>

            <Button variant='outline-danger' size='sm' className='rounded-pill px-3 btn-animado' onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Card.Body>
        </Card>

        <hr></hr>
        <section aria-labelledby='titulo-mis-publicaciones'>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 id='titulo-mis-publicaciones' className='h5 mb-0'>Mis publicaciones</h2>
          {user && (
            <Button as={Link} to="/crear-post" variant="primary" size="sm" className="rounded-pill px-3 btn-animado text-nowrap">
              + Crear publicación
            </Button>
          )}
        </div>

        {loading && (
          <div className='d-flex flex-column gap-3'>
            <SkeletonCard cantidad={2} />
          </div>
        )}
        {error && <Alert variant='danger'>{error}</Alert>}
        {!loading && !error && publicaciones.length === 0 && (
          <Card className='text-center p-4 animar-entrada'>
            <p className='mb-3'>Todavía no publicaste nada.</p>
            <div>
              <Button as={Link} to="/crear-post" variant="primary" className="rounded-pill px-4 btn-animado">
                Crear mi primera publicación
              </Button>
            </div>
          </Card>
        )}

        <div className='d-flex flex-column gap-3 pb-5'>
          {publicaciones.map((p, index) => (
            <Card
              as='article'
              key={p.id}
              className='w-100 shadow-sm post-card animar-entrada'
              style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
            >
              {p.images.length > 0 && (
                <Card.Img
                  variant='top'
                  src={p.images[0].url}
                  alt={`Imagen de la publicación: ${p.description}`}
                  className='post-card-img'
                  loading='lazy'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                ></Card.Img>
              )}
              <CardBody className='d-flex flex-column'>
                <CardText className='fs-5 post-descripcion'>
                  {p.description}
                </CardText>

                <div className='mt-auto d-flex justify-content-between align-items-center pt-2 border-top'>
                  <small className='text-muted'>
                    <span aria-hidden='true'>💬</span> {p.visibleCommentsCount}{' '}
                    {p.visibleCommentsCount === 1 ? 'comentario' : 'comentarios'}
                  </small>

                  <Button as={Link} to={`/post/${p.id}`} size='sm' className='rounded-pill px-3 btn-animado'>
                    Ver más
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        </section>
      </Container>
    </div>
  )
}
