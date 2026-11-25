import { useState } from 'react';
import type { FormEvent } from 'react';
import { createUser } from '../services/api'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BannerCard } from '../components/BannerCard'

export function Register() {

  const [nickName, setNickName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanNick = nickName.trim();
    const cleanEmail = email.trim();
    if (!cleanNick || !cleanEmail) {
      setErrorMsg('Completar todos los campos');
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser(cleanNick, cleanEmail);
      setSuccessMsg('Cuenta creada con éxito');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : 'No se pudo crear el usuario';
      setErrorMsg(
        detail === 'Failed to fetch' ? 'No se pudo conectar con la API' : detail
      );

    } finally {
      setIsSubmitting(false);
    }
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className='container py-5'>
      <div className='row align-items-center justify-content-center g-4'>
        <BannerCard />
        <div className='col-md-8 col-lg-5'>
          <div className='card border shadow-sm rounded-3'>
            <div className='card-body p-4'>
              <h2 className='fw-bold text-primary text-center mb-4'> Crear cuenta </h2>

              {errorMsg && (
                <div className='alert alert-danger py-2 small text-center' role='alert'>{errorMsg}</div>
              )}
              {successMsg && (
                <div className='alert alert-success py-2 small text-center' role='status'>{successMsg}</div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className='mb-3'>
                  <label htmlFor="registerNickname" className="form-label fw-bold mb-1"> Usuario </label>
                  <input
                    id="registerNickname"
                    type="text"
                    className={`form-control ${errorMsg && !nickName.trim() ? 'is-invalid' : ''}`}
                    placeholder="Nombre de usuario"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className='mb-3'>
                  <label htmlFor="registerEmail" className="form-label fw-bold mb-1"> Email </label>
                  <input
                    id="registerEmail"
                    type="email"
                    className={`form-control ${errorMsg && !email.trim() ? 'is-invalid' : ''}`}
                    placeholder="ejemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="d-grid mt-3">
                  <button
                    type="submit"
                    className="btn btn-success fw-semibold py-2"
                    disabled={isSubmitting || !!successMsg}
                  >
                    {isSubmitting ? 'Registrando...' : 'Registrarse'}
                  </button>
                </div>
              </form>

              <hr className='my-4'></hr>

              <div className='text-center'>
                <Link to="/login" className="btn btn-outline-primary fw-semibold px-4">
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}