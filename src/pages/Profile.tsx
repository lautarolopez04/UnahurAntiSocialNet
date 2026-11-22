import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Card, Button, Alert, Spinner, CardBody, CardText } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { getPostsByUserId, getCommentsByPostId } from '../services/api'
import type { Post } from '../types'

interface EnrichedPost extends Post {
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
              let total = 0;
              try {
                const comentarios = await getCommentsByPostId(p.id);
                total = comentarios.length;
              } catch {
                total = 0;
              }
              return {...p, visibleCommentsCount: total}
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <Container className='py-4' style={{maxWidth:'800px'}}>
        <Card className='mb-4'>
          <Card.Body className='d-flex align-items-center gap-3 flex-wrap'>
            <div className='d-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0'
                style= {{
                  width:90,
                  height:90,
                  fontSize:'2.5rem',
                  backgroundColor: 'grey',
                  color:'white',
                }}
            >
              {user?.nickName.charAt(0).toUpperCase()}
            </div>

            <div className='flex-grow-1'>
              <h1 className='h3 fw-bold mb-1'>
                {user?.nickName}
              </h1>
              <small>
                {publicaciones.length} {publicaciones.length === 1 ? 'publicación' : 'publicaciones'}
              </small>
            </div>

            <Button variant='danger' size='sm' onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Card.Body>
        </Card>

        <hr></hr>

        <h2 className='h5 mb-3'>Mis publicaciones</h2>

        {loading && (
          <div className='text-center my-5'>
            <Spinner animation='border' role='status' variant='light'></Spinner>
          </div>
        )}
        {error && <Alert variant='danger'>{error}</Alert>}
        {!loading && !error && publicaciones.length === 0 && (
          <p>No hay publicaciones.</p>
        )}

        <div className='d-flex flex-column gap-3 pb-5'>
          {publicaciones.map((p) => (
            <Card key={p.id} className='w-100'>
              <CardBody className='d-flex flex-column'>
                <CardText className='fs-5'>
                  {p.description}
                </CardText>

                <div className='mt-auto d-flex justify-content-between align-items-center pt-2'>
                  <small>
                    {p.visibleCommentsCount}{' '}
                    {p.visibleCommentsCount === 1 ? 'comentario' : 'comentarios'}
                  </small>

                  <Link to={`/post/${p.id}`}>
                    <Button size='sm'>
                      Ver más
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Container>      
    </div>
  )
}