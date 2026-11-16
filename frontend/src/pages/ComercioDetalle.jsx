import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getComercioById, crearResena } from '../services/comercios';

export default function ComercioDetalle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { comercio_id } = useParams();
  const [comercio, setComercio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resenaForm, setResenaForm] = useState({ calificacion: 5, comentario: '' });
  const [enviando, setEnviando] = useState(false);
  const [yaReseno, setYaReseno] = useState(false);

  useEffect(() => {
    getComercioById(comercio_id)
      .then((data) => {
        setComercio(data);
        setYaReseno(
          !!data.resenas?.some((r) => user && r.usuario === user.nombre)
        );
      })
      .catch(() => setError('No se pudo cargar el comercio'))
      .finally(() => setLoading(false));
  }, [comercio_id, user]);

  if (loading) return <div className="loading">Cargando comercio...</div>;
  if (error) return (
    <div className="comercios">
      <div className="message error">{error}</div>
      <Link to="/comercios" className="btn btn-secondary">Volver a comercios</Link>
    </div>
  );

  const promedio = Number(comercio.promedio_calificacion || 0).toFixed(1);

  const handleResena = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setEnviando(true);
    try {
      await crearResena({
        id_usuario: user.id,
        id_comercio: comercio.id,
        calificacion: Number(resenaForm.calificacion),
        comentario: resenaForm.comentario,
      });
      setYaReseno(true);
      setResenaForm({ calificacion: 5, comentario: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'No se pudo guardar la reseña');
    } finally {
      setEnviando(false);
    }
  };

  const opcionesCalificacion = [5, 4, 3, 2, 1].map((v) => (
    <option key={v} value={v}>{v} ⭐</option>
  ));

  return (
    <div className="comercios">
      <Link to="/comercios" className="btn btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>
        ← Volver a comercios
      </Link>

      <article className="comercio-detalle">
        <div className="comercio-detalle-body">
          <span className="comercio-badge">{comercio.tipo}</span>
          <h1>{comercio.nombre}</h1>
          <div className="comercio-meta">
            <span>📍 {comercio.direccion || '-'}</span>
            <span>📞 {comercio.telefono || '-'}</span>
            <span>🕒 {comercio.horario || '-'}</span>
            {comercio.verificado && <span style={{ color: '#2e7d32' }}>✔ Verificado</span>}
          </div>
          <div className="comercio-rating" style={{ marginTop: 8 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1b5e20' }}>
              {promedio}
            </span>
            <span style={{ color: '#666', marginLeft: 6 }}>({comercio.resenas?.length || 0} reseñas)</span>
          </div>

          {user && !yaReseno ? (
            <form onSubmit={handleResena} className="resena-form" style={{ marginTop: 20 }}>
              <h3 style={{ marginBottom: 10, fontSize: '1rem', color: '#263238' }}>Deja tu reseña</h3>
              <div className="form-group" style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6, color: '#263238' }}>
                  Calificación
                </label>
                <select
                  value={resenaForm.calificacion}
                  onChange={(e) => setResenaForm({ ...resenaForm, calificacion: e.target.value })}
                  className="form-select"
                  style={{ width: 120 }}
                >
                  {opcionesCalificacion}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6, color: '#263238' }}>
                  Comentario
                </label>
                <textarea
                  value={resenaForm.comentario}
                  onChange={(e) => setResenaForm({ ...resenaForm, comentario: e.target.value })}
                  rows={3}
                  className="form-select"
                  style={{ width: '100%' }}
                  placeholder="Cuéntanos tu experiencia..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="btn btn-primary"
              >
                {enviando ? 'Enviando...' : 'Publicar reseña'}
              </button>
            </form>
          ) : user && yaReseno ? (
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: 12 }}>Ya dejaste una reseña para este comercio.</p>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
              Inicia sesión para reseñar
            </Link>
          )}

          {error && <div className="message error" style={{ marginTop: 12 }}>{error}</div>}

          <section className="resenas-section" style={{ marginTop: 24 }}>
            <h2>Reseñas ({comercio.resenas?.length || 0})</h2>
            {comercio.resenas?.length ? (
              <div className="resenas-list">
                {comercio.resenas.map((r) => (
                  <article key={r.id} className="resena-card">
                    <div className="resena-header">
                      <span className="resena-usuario">{r.usuario || 'Anónimo'}</span>
                      <span className="resena-calificacion">⭐ {r.calificacion}</span>
                    </div>
                    <p className="resena-comentario">{r.comentario}</p>
                    <span className="resena-fecha">
                      {r.fecha ? new Date(r.fecha).toLocaleDateString() : ''}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty">Aún no hay reseñas para este comercio.</p>
            )}
          </section>
        </div>
      </article>
    </div>
  );
}
