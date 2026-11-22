import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    const { login } = useAuth();
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

    return (
        <div className="container py-5">
            <div className="row align-items-center justify-content-center g-4">
                <BannerCard />
                <div className="col-md-8 col-lg-5">
                    <div className="card bg-white border shadow-sm rounded-3">
                        <div className="card-body p-4">
                            <h2 className="fw-bold text-primary text-center mb-4">Iniciar sesión</h2>
                            {errorMsg && (
                                <div className="alert alert-danger py-2 small text-center" role="alert">
                                    {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="loginNickname" className="form-label fw-bold text-dark mb-1">
                                        Usuario
                                    </label>
                                    <input
                                        id="loginNickname"
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingresa tu usuario"
                                        value={nickName}
                                        onChange={(e) => setNickName(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="loginPassword" className="form-label fw-bold text-dark mb-1">
                                        Contraseña
                                    </label>
                                    <input
                                        id="loginPassword"
                                        type="password"
                                        className="form-control"
                                        placeholder="Ingresa la contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="d-grid mt-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary fw-semibold py-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
                                    </button>
                                </div>
                            </form>

                            <hr className="my-4" />

                            <div className="text-center">
                                <Link to="/register" className="btn btn-outline-success fw-semibold px-4">
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