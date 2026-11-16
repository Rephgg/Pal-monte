import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import Rutas from './pages/Rutas';
import RutaDetalle from './pages/RutaDetalle';
import Eventos from './pages/Eventos';
import EventoDetalle from './pages/EventoDetalle';
import Comercios from './pages/Comercios';
import ComercioDetalle from './pages/ComercioDetalle';
import Favoritos from './pages/Favoritos';
import RutasRealizadas from './pages/RutasRealizadas';

const Protected = ({ element }) => (
  <ProtectedRoute>
    <Layout>{element}</Layout>
  </ProtectedRoute>
);

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/registro" element={user ? <Navigate to="/dashboard" replace /> : <Registro />} />
      <Route path="/dashboard" element={<Protected element={<Dashboard />} />} />
      <Route path="/perfil" element={<Protected element={<Perfil />} />} />
      <Route path="/rutas" element={<Protected element={<Rutas />} />} />
      <Route path="/rutas/:ruta_id" element={<Protected element={<RutaDetalle />} />} />
      <Route path="/eventos" element={<Protected element={<Eventos />} />} />
      <Route path="/eventos/:evento_id" element={<Protected element={<EventoDetalle />} />} />
      <Route path="/comercios" element={<Protected element={<Comercios />} />} />
      <Route path="/comercios/:comercio_id" element={<Protected element={<ComercioDetalle />} />} />
      <Route path="/favoritos" element={<Protected element={<Favoritos />} />} />
      <Route path="/rutas-realizadas" element={<Protected element={<RutasRealizadas />} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
