import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEventoById, inscribirEvento, cancelarInscripcion } from '../services/eventos';

export default function EventoDetalle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { evento_id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inscribiendo, setInscribiendo] = useState(false);
  const [inscrito, setInscrito] = useState(false);

  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    getEventoById(evento_id)
      .then((data) => {
        setEvento(data);
        setInscrito(!!data.asistentes?.some((a) => a.id === user?.id));
      })
      .catch(() => setError('No se pudo cargar el evento'))
      .finally(() => setLoading(false));
  }, [evento_id, user?.id]);

  if (loading) return <div className="loading">Cargando evento...</div>;
  if (error) return (
    <div className="eventos">
      <div className="message error">{error}</div>
      <Link to="/eventos" className="btn btn-secondary">Volver a eventos</Link>
    </div>
  );

  const cupoLleno = evento.cupo_actual >= evento.cupo_max;

  const handleInscribir = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setInscribiendo(true);
    try {
      await inscribirEvento(evento_id, user.id);
      setInscrito(true);
      setEvento({ ...evento, cupo_actual: (evento.cupo_actual || 0) + 1 });
    } catch (err) {
      setError(err.response?.data?.msg || 'No se pudo inscribir');
    } finally {
      setInscribiendo(false);
    }
  };

  const handleCancelar = async () => {
    if (!user) return;
    setCancelando(true);
    try {
      await cancelarInscripcion(evento_id, user.id);
      setInscrito(false);
      setEvento({ ...evento, cupo_actual: Math.max(0, (evento.cupo_actual || 0) - 1) });
    } catch (err) {
      setError(err.response?.data?.msg || 'No se pudo cancelar la inscripción');
    } finally {
      setCancelando(false);
    }
  };

  return (
    <div className="eventos">
      <Link to="/eventos" className="btn btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>
        ← Volver a eventos
      </Link>

      <article className="evento-detalle">
        <div className="evento-detalle-body">
          <span className="evento-badge">{evento.cancelado ? 'Cancelado' : 'Próximo'}</span>
          <h1>{evento.titulo}</h1>
          <div className="evento-meta">
            <span>📅 {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</span>
            <span>🕒 {evento.hora_inicio || '-'}</span>
            <span>📍 {evento.lugar || '-'}</span>
            <span>👥 {evento.cupo_actual}/{evento.cupo_max} cupos</span>
            {evento.organizador && <span>👤 Organizador: {evento.organizador}</span>}
          </div>
          <p className="evento-descripcion">{evento.descripcion || 'Sin descripción disponible.'}</p>

          <div className="evento-actions" style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {user ? (
              inscrito ? (
                <button
                  onClick={handleCancelar}
                  disabled={cancelando}
                  className="btn btn-ghost"
                >
                  {cancelando ? 'Cancelando...' : 'Cancelar inscripción'}
                </button>
              ) : cupoLleno || evento.cancelado ? (
                <button disabled className="btn btn-ghost" style={{ color: '#9ca3af' }}>
                  {evento.cancelado ? 'Evento cancelado' : 'Cupo lleno'}
                </button>
              ) : (
                <button onClick={handleInscribir} disabled={inscribiendo} className="btn btn-primary">
                  {inscribiendo ? 'Inscribiendo...' : 'Inscribirme'}
                </button>
              )
            ) : (
              <Link to="/login" className="btn btn-primary">
                Inicia sesión para inscribirte
              </Link>
            )}
          </div>

          {error && <div className="message error" style={{ marginTop: 12 }}>{error}</div>}

          <section className="evento-section" style={{ marginTop: 24 }}>
            <h2>Asistentes ({evento.asistentes?.length || 0})</h2>
            {evento.asistentes?.length ? (
              <ul className="asistentes-list">
                {evento.asistentes.map((a) => (
                  <li key={a.id} className="asistente-item">{a.nombre}</li>
                ))}
              </ul>
            ) : (
              <p className="empty">Aún no hay asistentes inscritos.</p>
            )}
          </section>
        </div>
      </article>
    </div>
  );
}
