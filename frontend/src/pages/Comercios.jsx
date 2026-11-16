import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getComercios } from '../services/comercios';

const TIPOS = [
  { value: 'todos', label: 'Todos' },
  { value: 'taller', label: 'Taller' },
  { value: 'tienda', label: 'Tienda' },
  { value: 'cafe', label: 'Café' },
  { value: 'restaurante', label: 'Restaurante' },
];

export default function Comercios() {
  const { user } = useAuth();
  const [comercios, setComercios] = useState([]);
  const [tipo, setTipo] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getComercios(tipo)
      .then((data) => setComercios(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los comercios'))
      .finally(() => setLoading(false));
  }, [tipo]);

  if (loading) return <div className="loading">Cargando comercios...</div>;

  return (
    <div className="comercios">
      <div className="comercios-header">
        <h1>Comercios para Ciclistas</h1>
        <div className="comercios-actions">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="form-select"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <Link to="/perfil" className="btn btn-ghost">
            {user?.nombre ? `Hola, ${user.nombre}` : 'Perfil'}
          </Link>
        </div>
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="comercios-grid">
        {comercios.length === 0 ? (
          <p className="empty">No se encontraron comercios de ese tipo.</p>
        ) : (
          comercios.map((c) => (
            <article key={c.id} className="comercio-card">
              <div className="comercio-card-image">
                {c.foto ? (
                  <img src={c.foto} alt={c.nombre} onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <span className="ruta-card-placeholder">🏪</span>
                )}
              </div>
              <div className="comercio-card-body">
                <span className="comercio-badge">{c.tipo}</span>
                <h3>{c.nombre}</h3>
                <p className="comercio-direccion">{c.direccion || '-'}</p>
                <div className="comercio-meta">
                  <span>📞 {c.telefono || '-'}</span>
                  <span>🕒 {c.horario || '-'}</span>
                  <span>⭐ {Number(c.calificacion || 0).toFixed(1)}</span>
                </div>
                <Link to={`/comercios/${c.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 10 }}>
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
