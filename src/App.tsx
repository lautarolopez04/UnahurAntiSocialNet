import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppNavbar } from './components/AppNavbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PostDetail } from './pages/PostDetail';
import { Profile } from './pages/Profile';
import { CreatePost } from './pages/CreatePost';

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <main className="container mb-5">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetail />} />

          {/* Rutas Protegidas (solo usuarios logueados) */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          {/* Cualquier otra ruta redirige al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;