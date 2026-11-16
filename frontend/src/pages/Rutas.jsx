import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRutas } from '../services/rutas';

const DIFICULTADES = [
  { value: 'todas', label: 'Todas' },
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
];

export default function Rutas() {
  const { user } = useAuth();
  const [rutas, setRutas] = useState([]);
  const [dificultad, setDificultad] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRutas(dificultad)
      .then((data) => setRutas(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar las rutas'))
      .finally(() => setLoading(false));
  }, [dificultad]);

  if (loading) return <div className="loading">Cargando rutas...</div>;

  return (
    <div className="rutas">
      <div className="rutas-header">
        <h1>Rutas Ciclistas</h1>
        <div className="rutas-actions">
          <select
            value={dificultad}
            onChange={(e) => setDificultad(e.target.value)}
            className="form-select"
          >
            {DIFICULTADES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <Link to="/perfil" className="btn btn-ghost">
            {user?.nombre ? `Hola, ${user.nombre}` : 'Perfil'}
          </Link>
        </div>
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="rutas-grid">
        {rutas.length === 0 ? (
          <p className="empty">No se encontraron rutas con esa dificultad.</p>
        ) : (
          rutas.map((ruta) => (
            <article key={ruta.id} className="ruta-card">
              <div className="ruta-card-image">
                {ruta.imagen ? (
                  <img src={ruta.imagen} alt={ruta.nombre} onError={(e) => { e.target.style.display = 'none'; }} />
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
                  <span>🚲 {ruta.tipo_bici || '-'}</span>
                </div>
                <Link to={`/rutas/${ruta.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                  Ver detalle
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
