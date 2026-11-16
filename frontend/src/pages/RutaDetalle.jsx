import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRutaById, crearResena } from '../services/rutas';
import { getRutasRealizadas, registrarRutaRealizada, getFavoritos, agregarFavorito, eliminarFavorito } from '../services/favoritos';

export default function RutaDetalle() {
  const { ruta_id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ruta, setRuta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resenaForm, setResenaForm] = useState({ calificacion: 5, comentario: '' });
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [yaRealizada, setYaRealizada] = useState(false);
  const [yaReseno, setYaReseno] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await getRutaById(ruta_id);
        if (!mounted) return;
        setRuta(data);
        setYaReseno(
          !!data.resenas?.some((r) => user && r.usuario === user.nombre)
        );
        if (user?.id) {
          const realizadas = await getRutasRealizadas(user.id);
          if (!mounted) return;
          setYaRealizada(
            Array.isArray(realizadas) &&
            realizadas.some((r) => r.id == ruta_id || r.id_ruta == ruta_id)
          );
        }
      } catch {
        if (!mounted) return;
        setError('No se pudo cargar la ruta');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [ruta_id, user]);

  const cargarFavoritos = async () => {
    if (!user?.id) return;
    try {
      const favs = await getFavoritos(user.id);
      if (!mounted) return;
      setEsFavorito(Array.isArray(favs) && favs.some((f) => f.id == ruta_id));
    } catch {
      // silencioso
    }
  };

  useEffect(() => {
    if (user?.id) cargarFavoritos();
  }, [user?.id, ruta_id]);

  const toggleFavorito = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setTogglingFav(true);
    try {
      if (esFavorito) {
        await eliminarFavorito(user.id, ruta.id);
        setEsFavorito(false);
      } else {
        await agregarFavorito(user.id, ruta.id);
        setEsFavorito(true);
      }
      setError('');
    } catch (err) {
      console.error('Error favoritos:', err);
      const data = err.response?.data;
      setError(data?.msg || data?.error || 'No se pudo actualizar favoritos');
    } finally {
      setTogglingFav(false);
    }
  };

  if (loading) return <div className="loading">Cargando ruta...</div>;
  if (error) return (
    <div className="rutas">
      <div className="message error">{error}</div>
      <Link to="/rutas" className="btn btn-secondary">Volver a rutas</Link>
    </div>
  );

  const promedio = Number(ruta.promedio_calificacion || 0).toFixed(1);

  const opcionesCalificacion = [5, 4, 3, 2, 1].map((v) => (
    <option key={v} value={v}>{v} ⭐</option>
  ));

  const marcarCompletada = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const tiempo_real = prompt('Tiempo real (horas):');
    if (tiempo_real === null || tiempo_real === '') return;
    const horas = Number(tiempo_real);
    if (!Number.isFinite(horas) || horas <= 0) {
      setError('Ingresa un tiempo válido en horas');
      return;
    }
    const observaciones = prompt('Observaciones (opcional):') || '';
    try {
      await registrarRutaRealizada(user.id, ruta.id, horas, observaciones);
      setYaRealizada(true);
      setError('');
    } catch (err) {
      console.error('Error marcando ruta completada:', err);
      const data = err.response?.data;
      if (typeof data === 'string') {
        setError(data);
      } else if (data?.error) {
        setError(data.error);
      } else if (data?.msg) {
        setError(data.msg);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('No se pudo registrar la ruta como completada');
      }
    }
  };

  const handleResena = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setEnviandoResena(true);
    try {
      await crearResena({
        id_usuario: user.id,
        id_ruta: ruta.id,
        calificacion: Number(resenaForm.calificacion),
        comentario: resenaForm.comentario,
      });
      setYaReseno(true);
      setResenaForm({ calificacion: 5, comentario: '' });
      setError('');
    } catch (err) {
      console.error('Error guardando reseña:', err);
      const data = err.response?.data;
      if (typeof data === 'string') {
        setError(data);
      } else if (data?.error) {
        setError(data.error);
      } else if (data?.msg) {
        setError(data.msg);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('No se pudo guardar la reseña');
      }
    } finally {
      setEnviandoResena(false);
    }
  };

  return (
    <div className="rutas">
      <Link to="/rutas" className="btn btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>
        ← Volver a rutas
      </Link>

      <article className="ruta-detalle">
        <div className="ruta-detalle-header">
          <div className="ruta-detalle-image">
            {ruta.imagen ? (
              <img src={ruta.imagen} alt={ruta.nombre} onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="ruta-card-placeholder">🚴</span>
            )}
          </div>
          <div className="ruta-detalle-info">
            <span className="ruta-badge">{ruta.dificultad}</span>
            <h1>{ruta.nombre}</h1>
            <div className="ruta-rating">
              <span>⭐ {promedio}</span>
              <span>({ruta.resenas?.length || 0} reseñas)</span>
            </div>
            <div className="ruta-meta">
              <span>📏 {ruta.distancia_km} km</span>
              <span>⏱️ {ruta.tiempo_estimado} h estimado</span>
              <span>🚲 {ruta.tipo_bici || '-'}</span>
              <span>📍 {ruta.zona || '-'}</span>
              <span>⛰️ {ruta.elevacion || 0} m</span>
              <span>🛣️ {ruta.superficie || '-'}</span>
            </div>

            {!user ? (
              <Link to="/login" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
                Inicia sesión para interactuar
              </Link>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {!yaRealizada ? (
                    <button onClick={marcarCompletada} className="btn btn-primary" style={{ display: 'inline-block' }}>
                      Marcar como completada
                    </button>
                  ) : (
                    <span style={{ color: '#2e7d32', fontSize: '0.9rem', marginTop: 8, display: 'block' }}>✔ Ruta completada</span>
                  )}
                  <button
                    onClick={toggleFavorito}
                    disabled={togglingFav}
                    className={`btn ${esFavorito ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ display: 'inline-block' }}
                  >
                    {togglingFav ? '...' : (esFavorito ? '★ Quitar favorito' : '☆ Agregar favorito')}
                  </button>
                </div>
              </>
            )}

            <div style={{ marginTop: 16 }}>
              {user && !yaReseno ? (
                <form onSubmit={handleResena} className="resena-form" style={{ marginTop: 12 }}>
                  <h3 style={{ marginBottom: 10, fontSize: '1rem', color: '#263238' }}>Califica esta ruta</h3>
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
                    disabled={enviandoResena}
                    className="btn btn-primary"
                  >
                    {enviandoResena ? 'Enviando...' : 'Publicar reseña'}
                  </button>
                </form>
              ) : user && yaReseno ? (
                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: 12 }}>Ya calificaste esta ruta.</p>
              ) : (
                <Link to="/login" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
                  Inicia sesión para calificar
                </Link>
              )}
            </div>

            {error && <div className="message error" style={{ marginTop: 12 }}>{error}</div>}
          </div>
        </div>

        <div className="ruta-detalle-body">
          <section className="ruta-section">
            <h2>Descripción</h2>
            <p>{ruta.descripcion || 'Sin descripción disponible.'}</p>
          </section>

          <section className="ruta-section">
            <h2>Reseñas ({ruta.resenas?.length || 0})</h2>
            {ruta.resenas?.length ? (
              <div className="resenas-list">
                {ruta.resenas.map((r) => (
                  <article key={r.id} className="resena-card">
                    <div className="resena-header">
                      <span className="resena-usuario">{r.usuario || 'Anónimo'}</span>
                      <span className="resena-calificacion">⭐ {r.calificacion}</span>
                    </div>
                    <p className="resena-comentario">{r.comentario}</p>
                    <span className="resena-fecha">{r.fecha ? new Date(r.fecha).toLocaleDateString() : ''}</span>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty">Aún no hay reseñas para esta ruta.</p>
            )}
          </section>
        </div>
      </article>
    </div>
  );
}
