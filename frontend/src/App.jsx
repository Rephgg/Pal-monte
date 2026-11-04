import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/registro" element={user ? <Navigate to="/dashboard" replace /> : <Registro />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Layout() {
  const { user } = useAuth();

  return (
    <div className="app">
      <header className="main-header">
        <Link to="/" className="logo">Pal' Monte</Link>
        <nav className="main-nav">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/perfil">Perfil</Link>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary">Registrarse</Link>
            </>
          )}
        </nav>
      </header>
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}