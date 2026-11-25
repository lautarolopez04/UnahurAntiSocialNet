import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/index';
import { BannerCard } from '../components/BannerCard'

const API_URL = 'http://localhost:3001';
const FIXED_PASSWORD = '123456';

export const LoginCard = () => {
    const [nickName, setNickName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { user, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMsg('');

        const cleanNick = nickName.trim();

        if (!cleanNick || !password) {
            setErrorMsg('Completá tu usuario y contraseña.');
            return;
        }

        if (password !== FIXED_PASSWORD) {
            setErrorMsg('Contraseña incorrecta.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/users`);

            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor (${response.status})`);
            }

            const users = (await response.json()) as User[];

            const matchedUser = users.find(
                (u) => u.nickName.toLowerCase() === cleanNick.toLowerCase()
            );

            if (!matchedUser) {
                setErrorMsg('No se ha encontrado el nombre de usuario. Podés registrarte abajo.');
                return;
            }

            login(matchedUser);
            navigate('/');
        } catch (err: unknown) {
            const detail = err instanceof Error ? err.message : 'Error de conexión';
            console.error('Error en login:', detail);
            setErrorMsg('No se pudo conectar con la API. Verificá que el backend esté corriendo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="container py-5">
            <div className="row align-items-center justify-content-center g-4">
                <BannerCard />
                <div className="col-md-8 col-lg-5">
                    <div className="card border shadow-sm rounded-4 auth-card animar-entrada">
                        <div className="card-body p-4">
                            <h2 className="fw-bold text-primary text-center mb-1">Iniciar sesión</h2>
                            <p className="text-muted text-center small mb-4">¡Qué bueno verte de nuevo!</p>
                            {errorMsg && (
                                <div className="alert alert-danger py-2 small text-center alerta-animada" role="alert">
                                    {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-floating mb-3">
                                    <input
                                        id="loginNickname"
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingresa tu usuario"
                                        value={nickName}
                                        onChange={(e) => setNickName(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="loginNickname">Usuario</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        id="loginPassword"
                                        type="password"
                                        className="form-control"
                                        placeholder="Ingresa la contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="loginPassword">Contraseña</label>
                                </div>

                                <div className="d-grid mt-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary fw-semibold py-2 rounded-pill btn-animado"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && (
                                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                                        )}
                                        {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
                                    </button>
                                </div>
                            </form>

                            <hr className="my-4" />

                            <div className="text-center">
                                <Link to="/register" className="btn btn-outline-success fw-semibold px-4 rounded-pill btn-animado">
                                    Crear cuenta nueva
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};