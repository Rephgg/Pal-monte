import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app">
      <header className="main-header">
        <Link to="/" className="logo">Pal' Monte</Link>
        <nav className="main-nav">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={location.pathname === '/dashboard' ? 'active' : ''}
              >
                Dashboard
              </Link>
              <Link
                to="/rutas"
                className={location.pathname === '/rutas' ? 'active' : ''}
              >
                Rutas
              </Link>
              <Link
                to="/eventos"
                className={location.pathname === '/eventos' ? 'active' : ''}
              >
                Eventos
              </Link>
              <Link
                to="/comercios"
                className={location.pathname === '/comercios' ? 'active' : ''}
              >
                Comercios
              </Link>
              <Link to="/perfil" className={location.pathname === '/perfil' ? 'active' : ''}>
                Perfil
              </Link>
              <button onClick={logout} className="btn btn-ghost">Cerrar sesión</button>
              <Link
                to="/favoritos"
                className={location.pathname === '/favoritos' ? 'active' : ''}
              >
                Favoritos
              </Link>
              <Link
                to="/rutas-realizadas"
                className={location.pathname === '/rutas-realizadas' ? 'active' : ''}
              >
                Rutas realizadas
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="main-content">{children}</main>
      <footer className="main-footer">
        Pal' Monte &middot; Comunidad ciclista de Ibagu&eacute;
      </footer>
    </div>
  );
}
