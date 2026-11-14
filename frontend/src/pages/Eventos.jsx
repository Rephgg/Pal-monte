import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEventos } from '../services/eventos';

export default function Eventos() {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEventos()
      .then((data) => setEventos(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los eventos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Cargando eventos...</div>;

  return (
    <div className="eventos">
      <div className="eventos-header">
        <h1>Eventos</h1>
        <Link to="/perfil" className="btn btn-ghost">
          {user?.nombre ? `Hola, ${user.nombre}` : 'Perfil'}
        </Link>
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="eventos-grid">
        {eventos.length === 0 ? (
          <p className="empty">No hay eventos próximos programados.</p>
        ) : (
          eventos.map((evento) => (
            <article key={evento.id} className="evento-card">
              <div className="evento-card-body">
                <span className="evento-fecha">
                  {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) : ''}
                </span>
                <h3>{evento.titulo}</h3>
                <p className="evento-descripcion">{evento.descripcion || 'Sin descripción disponible.'}</p>
                <div className="evento-meta">
                  <span>📍 {evento.lugar || '-'}</span>
                  <span>🕒 {evento.hora_inicio || '-'}</span>
                  <span>👥 {evento.cupo_actual}/{evento.cupo_max}</span>
                </div>
                <Link to={`/eventos/${evento.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 10 }}>
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
