import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPerfil, updatePerfil } from '../services/auth';

export default function Dashboard() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ favoritos: 0, historial: 0, km: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getPerfil(user.id)
        .then((res) => {
          setStats({
            favoritos: res.data?.favoritos?.length || 0,
            historial: res.data?.historial?.length || 0,
            km: res.data?.data?.km_recorridos || 0
          });
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          <div className="avatar">
            {user?.foto ? (
              <img src={user.foto} alt={user.nombre} />
            ) : (
              user?.nombre?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div>
            <h1>Hola, {user?.nombre || 'Ciclista'}</h1>
            <p className="user-meta">
              {user?.email} • {user?.nivel || 'Nivel no definido'} • {user?.rol || 'ciclista'}
            </p>
          </div>
        </div>
        <button onClick={logout} className="btn btn-ghost">Salir</button>
      </header>

      <nav className="dashboard-nav">
        <Link to="/dashboard" className="nav-item active">Resumen</Link>
        <Link to="/perfil" className="nav-item">Mi Perfil</Link>
        <Link to="/rutas" className="nav-item">Rutas</Link>
        <Link to="/eventos" className="nav-item">Eventos</Link>
        <Link to="/comercios" className="nav-item">Comercios</Link>
      </nav>

      <main className="dashboard-main">
        <section className="stats-grid">
          <article className="stat-card">
            <span className="stat-icon">❤️</span>
            <div>
              <p className="stat-value">{stats.favoritos}</p>
              <p className="stat-label">Rutas favoritas</p>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon">📍</span>
            <div>
              <p className="stat-value">{stats.historial}</p>
              <p className="stat-label">Rutas realizadas</p>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon">🚴</span>
            <div>
              <p className="stat-value">{stats.km} km</p>
              <p className="stat-label">Kilómetros recorridos</p>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon">🏆</span>
            <div>
              <p className="stat-value">{user?.nivel || '-'}</p>
              <p className="stat-label">Nivel actual</p>
            </div>
          </article>
        </section>

        <section className="quick-actions">
          <h2>Accesos rápidos</h2>
          <div className="actions-grid">
            <Link to="/rutas" className="action-card">
              <span>🗺️</span>
              <h3>Explorar rutas</h3>
              <p>Descubre nuevas rutas para tu próxima salida</p>
            </Link>
            <Link to="/eventos" className="action-card">
              <span>📅</span>
              <h3>Próximos eventos</h3>
              <p>Únete a salidas grupales y competiciones</p>
            </Link>
            <Link to="/comercios" className="action-card">
              <span>🏪</span>
              <h3>Comercios cercanos</h3>
              <p>Talleres, cafés y tiendas para ciclistas</p>
            </Link>
            <Link to="/perfil" className="action-card">
              <span>⚙️</span>
              <h3>Editar perfil</h3>
              <p>Actualiza tus datos y preferencias</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}