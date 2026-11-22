import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import type { Post, PostImage, Comment } from '../types';

const API_URL = 'http://localhost:3001';

interface EnrichedPost extends Post {
  images: PostImage[];
  visibleCommentsCount: number;
}

export const Home = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<EnrichedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Container className="py-4">
      <div className="p-4 mb-4 bg-dark text-white rounded-3 border-start border-4 border-primary shadow-sm">
  <h1 className="h2 fw-bold mb-1">UnaHur Anti-Social Net</h1>
  <p className="text-light text-opacity-75 mb-0">
    La red donde compartís lo que pensás sin algoritmos que te persigan.
  </p>
</div>
<div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 fw-bold mb-0">Publicaciones recientes</h2>
        {user && (
          <Link to="/crear-post">
            <Button variant="primary" size="sm">
              + Crear publicación
            </Button>
          </Link>
        )}
      </div>
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && posts.length === 0 && (
        <Alert variant="info">
          Todavía no hay publicaciones.{' '}
          {user ? '¡Sé el primero en postear!' : 'Iniciá sesión para crear la primera.'}
        </Alert>
      )}

      <Row xs={1} md={2} className="g-4">
        {posts.map((post) => (
          <Col key={post.id}>
            <Card className="h-100 shadow-sm">
              {post.images.length > 0 && (
                <Card.Img
                  variant="top"
                  src={post.images[0].url}
                  alt="Imagen de la publicación"
                  style={{ maxHeight: '250px', objectFit: 'cover' }}
                />
              )}

              <Card.Body className="d-flex flex-column">
                <Card.Text>{post.description}</Card.Text>

                <div className="mb-3">
                  {post.Tags?.map((tag) => (
                    <Badge bg="secondary" className="me-1" key={tag.id}>
                      #{tag.name}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                  <small className="text-muted">
                    💬 {post.visibleCommentsCount}{' '}
                    {post.visibleCommentsCount === 1 ? 'comentario visible' : 'comentarios visibles'}
                  </small>

                  <Link to={`/post/${post.id}`}>
                    <Button variant="primary" size="sm">
                      Ver más
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};