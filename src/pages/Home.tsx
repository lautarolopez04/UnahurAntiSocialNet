import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';
import { SkeletonCard } from '../components/SkeletonCard';
import { Sidebar } from '../components/Sidebar';
import type { Post, PostImage, Comment } from '../types';

const API_URL = 'http://localhost:3001';
const POSTS_POR_TANDA = 6;

interface EnrichedPost extends Post {
  images: PostImage[];
  visibleCommentsCount: number;
}

export const Home = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<EnrichedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidadVisible, setCantidadVisible] = useState<number>(POSTS_POR_TANDA);
  const [mostrarBotonArriba, setMostrarBotonArriba] = useState<boolean>(false);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const resPosts = await fetch(`${API_URL}/posts`);
        if (!resPosts.ok) throw new Error('Error al cargar las publicaciones');
        const rawPosts: Post[] = await resPosts.json();

        const enriched = await Promise.all(
          rawPosts.map(async (post) => {
            const [resImages, resComments] = await Promise.all([
              fetch(`${API_URL}/postimages/post/${post.id}`),
              fetch(`${API_URL}/comments/post/${post.id}`),
            ]);

            const images: PostImage[] = resImages.ok ? await resImages.json() : [];
            const comments: Comment[] = resComments.ok ? await resComments.json() : [];

            return {
              ...post,
              images,
              visibleCommentsCount: comments.length,
            };
          })
        );

        setPosts(enriched.sort((a, b) => b.id - a.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarBotonArriba(window.scrollY > 400);

      const llegoAlFinal =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (llegoAlFinal && cantidadVisible < posts.length) {
        setCantidadVisible(cantidadVisible + POSTS_POR_TANDA);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cantidadVisible, posts.length]);

  useEffect(() => {
    document.title = `(${posts.length}) Inicio | UnaHur Anti-Social Net`;

    return () => {
      document.title = 'UnaHur Anti-Social Net';
    };
  }, [posts]);

  const conteoTags: Record<string, number> = posts.reduce((acumulado: Record<string, number>, post: EnrichedPost) => {
    post.Tags?.forEach((tag) => {
      acumulado[tag.name] = (acumulado[tag.name] || 0) + 1;
    });
    return acumulado;
  }, {});

  const tendencias = Object.entries(conteoTags)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 6);

  const postsVisibles = posts.slice(0, cantidadVisible);
  const hayMasPosts = cantidadVisible < posts.length;

  const cargarMas = () => {
    setCantidadVisible((prev) => prev + POSTS_POR_TANDA);
  };

  const volverArriba = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container className="py-4">
      <Row className="g-4">
      <Col lg={8}>
      <div className="p-4 mb-4 bg-dark text-white rounded-3 border-start border-4 border-primary shadow-sm banner-home animar-entrada">
  <h1 className="h2 fw-bold mb-1">UnaHur Anti-Social Net</h1>
  <p className="text-light text-opacity-75 mb-0">
    La red donde compartís lo que pensás sin algoritmos que te persigan.
  </p>
</div>
<hr></hr>
<section aria-labelledby="titulo-feed">
<div className="d-flex justify-content-between align-items-center mb-3">
        <h2 id="titulo-feed" className="h4 fw-bold mb-0">Publicaciones recientes</h2>
        {user && (
          <Button as={Link} to="/crear-post" variant="primary" size="sm" className="rounded-pill px-3 btn-animado text-nowrap">
            + Crear publicación
          </Button>
        )}
      </div>
      {loading && (
        <Row xs={1} md={2} className="g-4">
          <SkeletonCard cantidad={4} enColumnas />
        </Row>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && posts.length === 0 && (
        <Alert variant="info">
          Todavía no hay publicaciones.{' '}
          {user ? '¡Sé el primero en postear!' : 'Iniciá sesión para crear la primera.'}
        </Alert>
      )}

      <Row xs={1} md={2} className="g-4">
        {postsVisibles.map((post, index) => (
          <Col key={post.id}>
            <Card
              as="article"
              className="h-100 shadow-sm post-card animar-entrada"
              style={{ animationDelay: `${(index % POSTS_POR_TANDA) * 70}ms` }}
            >
              {post.User && (
                <div className="d-flex align-items-center gap-2 px-3 pt-3 pb-2">
                  <Avatar nickName={post.User.nickName} tamano={34} />
                  <span className="fw-semibold small">@{post.User.nickName}</span>
                </div>
              )}
              {post.images.length > 0 && (
                <Card.Img
                  variant="top"
                  src={post.images[0].url}
                  alt={`Imagen de la publicación: ${post.description}`}
                  className="post-card-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}

              <Card.Body className="d-flex flex-column">
                <Card.Text className="post-descripcion">{post.description}</Card.Text>

                <div className="mb-3">
                  {post.Tags?.map((tag) => (
                    <Badge bg="secondary" className="me-1 tag-badge" key={tag.id}>
                      #{tag.name}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                  <small className="text-muted">
                    <span aria-hidden="true">💬</span> {post.visibleCommentsCount}{' '}
                    {post.visibleCommentsCount === 1 ? 'comentario' : 'comentarios'}
                  </small>

                  <Button as={Link} to={`/post/${post.id}`} variant="primary" size="sm" className="rounded-pill px-3 btn-animado">
                    Ver más
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {hayMasPosts && (
        <div className="text-center mt-4">
          <Button variant="outline-primary" className="rounded-pill px-4 btn-animado" onClick={cargarMas}>
            Ver más publicaciones
          </Button>
        </div>
      )}

      {!loading && !hayMasPosts && posts.length > 0 && (
        <p className="text-center text-muted mt-4 mb-0 animar-entrada">
          Llegaste al final. No hay más publicaciones por ahora.
        </p>
      )}
</section>
      </Col>

      <Col lg={4} className="d-none d-lg-block">
        <div className="sidebar-sticky">
          <Sidebar tendencias={tendencias} />
        </div>
      </Col>
      </Row>

      {mostrarBotonArriba && (
        <Button
          variant="primary"
          className="btn-volver-arriba shadow btn-animado animar-entrada"
          onClick={volverArriba}
          aria-label="Volver arriba"
        >
          ↑
        </Button>
      )}
    </Container>
  );
};
