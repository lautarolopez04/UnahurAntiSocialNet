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
      <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="container mb-5 flex-grow-1">
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetail />} />

          
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

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="app-footer text-center py-3">
        <small>UnaHur Anti-Social Net · Creación de Interfaces de Usuario · UNAHUR</small>
      </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;