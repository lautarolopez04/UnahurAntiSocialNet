import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Si no hay usuario logueado en el contexto, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, muestra la página solicitada
  return <>{children}</>;
}