import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import  type { Post, PostImage, Comment } from '../types';

const API_URL = 'http://localhost:3001'; 

interface EnrichedPost extends Post {
  images: PostImage[];
  visibleCommentsCount: number;
}

export const Home = () => {
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

        // Por cada post, traemos sus imágenes y comentarios visibles según los endpoints de la API
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

        // Ordenamos para mostrar primero los más recientes (por id descendente)
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
      {}
      <div className="p-4 mb-4 bg-dark text-white rounded-3">
        <h1>UnaHur Anti-Social Net</h1>
        <p className="lead mb-0">
          La red donde compartís lo que pensás sin algoritmos que te persigan.
        </p>
      </div>

      <h2 className="mb-3">Publicaciones recientes</h2>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && posts.length === 0 && (
        <Alert variant="info">Todavía no hay publicaciones. ¡Sé el primero en postear!</Alert>
      )}

      <Row xs={1} md={2} className="g-4">
        {posts.map((post) => (
          <Col key={post.id}>
            <Card className="h-100 shadow-sm">
              {/* Imágenes (si las hay) */}
              {post.images.length > 0 && (
                <Card.Img
                  variant="top"
                  src={post.images[0].url}
                  alt="Imagen de la publicación"
                  style={{ maxHeight: '250px', objectFit: 'cover' }}
                />
              )}

              <Card.Body className="d-flex flex-column">
                {/* Descripción */}
                <Card.Text>{post.description}</Card.Text>

                {/* Etiquetas */}
                <div className="mb-3">
                  {post.Tags?.map((tag) => (
                    <Badge bg="secondary" className="me-1" key={tag.id}>
                      #{tag.name}
                    </Badge>
                  ))}
                </div>

                {/* Pie de tarjeta: comentarios visibles + botón Ver más */}
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