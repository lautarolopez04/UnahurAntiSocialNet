import { useEffect, useState, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Badge, Button, Form, Alert, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';
import { SkeletonCard } from '../components/SkeletonCard';
import type { Post, PostImage, Comment } from '../types';

const API_URL = 'http://localhost:3001'; 

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para el formulario controlado de nuevo comentario
  const [newComment, setNewComment] = useState<string>('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let cancelado = false;

    const fetchPostData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        const [resPost, resImages, resComments] = await Promise.all([
          fetch(`${API_URL}/posts/${id}`),
          fetch(`${API_URL}/postimages/post/${id}`),
          fetch(`${API_URL}/comments/post/${id}`),
        ]);

        if (!resPost.ok) {
          throw new Error('No se pudo encontrar la publicación solicitada.');
        }

        const postData: Post = await resPost.json();
        const imagesData: PostImage[] = resImages.ok ? await resImages.json() : [];
        const commentsData: Comment[] = resComments.ok ? await resComments.json() : [];

        if (cancelado) return;

        setPost(postData);
        setImages(imagesData);
        setComments(commentsData);
      } catch (err) {
        if (cancelado) return;
        setError(err instanceof Error ? err.message : 'Error al cargar la publicación.');
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    fetchPostData();

    return () => {
      cancelado = true;
    };
  }, [id]);

  useEffect(() => {
    document.title = 'Publicación | UnaHur Anti-Social Net';

    return () => {
      document.title = 'UnaHur Anti-Social Net';
    };
  }, []);

  // Manejo del envío del comentario (POST /comments)
  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    // Validación de campo obligatorio
    if (!newComment.trim()) {
      setCommentError('El comentario no puede estar vacío.');
      return;
    }

    if (!user) {
      setCommentError('Tenés que iniciar sesión para comentar.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          postId: Number(id),
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo publicar el comentario.');
      }

      // Limpiamos el input y recargamos los comentarios visibles
      setNewComment('');
      const resComments = await fetch(`${API_URL}/comments/post/${id}`);
      if (resComments.ok) {
        setComments(await resComments.json());
      }
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Error al enviar el comentario.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4" style={{ maxWidth: '800px' }}>
        <SkeletonCard cantidad={1} />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error || 'Publicación no encontrada'}</Alert>
        <Button as={Link} to="/" variant="secondary">
          Volver al inicio
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-3 rounded-pill px-3 btn-animado">
        ← Volver al feed
      </Link>

      <Card as="article" className="mb-4 shadow-sm animar-entrada">
        <Card.Body>
          {post.User && (
            <div className="d-flex align-items-center gap-2 mb-3">
              <Avatar nickName={post.User.nickName} tamano={44} />
              <span className="fw-bold">@{post.User.nickName}</span>
            </div>
          )}
          <Card.Text className="fs-5" style={{ whiteSpace: 'pre-line' }}>{post.description}</Card.Text>

          
          {images.length > 0 && (
            <div className="d-flex flex-column gap-3 my-3">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={`Imagen adjunta a la publicación: ${post.description}`}
                  className="img-fluid rounded post-detail-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          )}

         
          {post.Tags && post.Tags.length > 0 && (
            <div className="mt-3">
              {post.Tags.map((tag) => (
                <Badge bg="secondary" className="me-1 tag-badge" key={tag.id}>
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

     
      <section aria-labelledby="titulo-comentarios">
      <h2 id="titulo-comentarios" className="h4 mb-3">Comentarios ({comments.length})</h2>

      {comments.length === 0 ? (
        <p className="text-muted">Aún no hay comentarios visibles en esta publicación.</p>
      ) : (
        <ListGroup className="mb-4">
          {comments.map((comment, index) => (
            <ListGroup.Item
              key={comment.id}
              className="d-flex gap-3 comentario-item animar-entrada"
              style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
            >
              <Avatar nickName={comment.User?.nickName || `usuario${comment.userId}`} tamano={36} />
              <div>
                <small className="text-muted d-block mb-1">
                  {comment.User?.nickName ? `@${comment.User.nickName}` : `Usuario #${comment.userId}`}
                </small>
                <span style={{ whiteSpace: 'pre-line' }}>{comment.content}</span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

     
      <Card className="shadow-sm auth-card animar-entrada">
        <Card.Body>
          <h3 className="h5 mb-3">Agregar un comentario</h3>
          
          {commentError && <Alert variant="danger" className="alerta-animada">{commentError}</Alert>}

          {user ? (
            <Form onSubmit={handleCommentSubmit}>
              <Form.Group className="mb-3" controlId="commentContent">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Escribí tu comentario acá..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={submitting}
                  maxLength={300}
                />
                <Form.Text className="text-muted">
                  {newComment.length}/300 caracteres
                </Form.Text>
              </Form.Group>

              <Button variant="primary" type="submit" className="rounded-pill px-4 btn-animado" disabled={submitting}>
                {submitting && (
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                )}
                {submitting ? 'Enviando...' : 'Comentar'}
              </Button>
            </Form>
          ) : (
            <p className="mb-0">
              Para comentar tenés que <Link to="/login">iniciar sesión</Link>.
            </p>
          )}
        </Card.Body>
      </Card>
      </section>
    </Container>
  );
};