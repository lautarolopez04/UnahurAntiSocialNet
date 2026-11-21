import { useEffect, useState, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Badge, Button, Form, Alert, Spinner, ListGroup } from 'react-bootstrap';
import type { Post, PostImage, Comment } from '../types';

const API_URL = 'http://localhost:3001'; 

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para el formulario controlado de nuevo comentario
  const [newComment, setNewComment] = useState<string>('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Función reutilizable para cargar los datos del post, imágenes y comentarios
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

      setPost(postData);
      setImages(imagesData);
      setComments(commentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la publicación.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [id]);

  // Manejo del envío del comentario (POST /comments)
  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    // Validación de campo obligatorio
    if (!newComment.trim()) {
      setCommentError('El comentario no puede estar vacío.');
      return;
    }

    // Cuando tengas el AuthContext, reemplazá este 1 por user.id
    const currentUserId = 1; 

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
          userId: currentUserId,
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
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error || 'Publicación no encontrada'}</Alert>
        <Link to="/">
          <Button variant="secondary">Volver al inicio</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">
        ← Volver al feed
      </Link>

      {/* Tarjeta principal con descripción, imágenes y etiquetas */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Text className="fs-5">{post.description}</Card.Text>

          {/* Galería de imágenes si existen */}
          {images.length > 0 && (
            <div className="d-flex flex-column gap-3 my-3">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt="Imagen adjunta al post"
                  className="img-fluid rounded"
                  style={{ maxHeight: '450px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                />
              ))}
            </div>
          )}

          {/* Etiquetas */}
          {post.Tags && post.Tags.length > 0 && (
            <div className="mt-3">
              {post.Tags.map((tag) => (
                <Badge bg="secondary" className="me-1" key={tag.id}>
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Sección de comentarios visibles */}
      <h4 className="mb-3">Comentarios ({comments.length})</h4>

      {comments.length === 0 ? (
        <p className="text-muted">Aún no hay comentarios visibles en esta publicación.</p>
      ) : (
        <ListGroup className="mb-4">
          {comments.map((comment) => (
            <ListGroup.Item key={comment.id}>
              <small className="text-muted d-block mb-1">Usuario #{comment.userId}</small>
              <span>{comment.content}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Formulario controlado para agregar comentario */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Agregar un comentario</h5>
          
          {commentError && <Alert variant="danger">{commentError}</Alert>}

          <Form onSubmit={handleCommentSubmit}>
            <Form.Group className="mb-3" controlId="commentContent">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Escribí tu comentario acá..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={submitting}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Comentar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};