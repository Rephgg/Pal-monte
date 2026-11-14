import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFavoritos, agregarFavorito, eliminarFavorito } from '../services/favoritos';

export default function Favoritos() {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    getFavoritos(user.id)
      .then((data) => setFavoritos(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los favoritos'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const toggleFavorito = async (ruta_id, estaEnFavoritos) => {
    if (!user?.id) return;
    try {
      if (estaEnFavoritos) {
        await eliminarFavorito(user.id, ruta_id);
      } else {
        await agregarFavorito(user.id, ruta_id);
      }
      setFavoritos(favoritos.filter((f) => f.id !== ruta_id));
    } catch (err) {
      setError(err.response?.data?.msg || 'No se pudo actualizar favoritos');
    }
  };

  if (loading) return <div className="loading">Cargando favoritos...</div>;

  return (
    <div className="rutas">
      <div className="rutas-header">
        <h1>Mis Favoritos</h1>
        <Link to="/rutas" className="btn btn-secondary">Explorar rutas</Link>
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="rutas-grid">
        {favoritos.length === 0 ? (
          <p className="empty">No tienes rutas favoritas aún.</p>
        ) : (
          favoritos.map((ruta) => (
            <article key={ruta.id} className="ruta-card">
              <div className="ruta-card-image">
                {ruta.imagen ? (
                  <img src={ruta.imagen} alt={ruta.nombre} />
                ) : (
                  <span className="ruta-card-placeholder">🚴</span>
                )}
              </div>
              <div className="ruta-card-body">
                <span className="ruta-badge">{ruta.dificultad}</span>
                <h3>{ruta.nombre}</h3>
                <p className="ruta-description">{ruta.descripcion || 'Sin descripción disponible.'}</p>
                <div className="ruta-meta">
                  <span>📏 {ruta.distancia_km} km</span>
                  <span>⏱️ {ruta.tiempo_estimado} h</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button
                    onClick={() => toggleFavorito(ruta.id, true)}
                    className="btn btn-ghost"
                    style={{ color: '#b71c1c' }}
                  >
                    Quitar
                  </button>
                  <Link to={`/rutas/${ruta.id}`} className="btn btn-primary" style={{ flex: 1 }}>
                    Ver detalle
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
