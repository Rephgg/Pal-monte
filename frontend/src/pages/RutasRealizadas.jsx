import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRutasRealizadas, registrarRutaRealizada } from '../services/favoritos';

export default function RutasRealizadas() {
  const { user } = useAuth();
  const [realizadas, setRealizadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    getRutasRealizadas(user.id)
      .then((data) => setRealizadas(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar las rutas realizadas'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const registrarRuta = async (ruta_id) => {
    if (!user?.id) return;
    const tiempo_real = prompt('Tiempo real (horas):');
    if (tiempo_real === null || tiempo_real === '') return;
    const observaciones = prompt('Observaciones (opcional):') || '';
    try {
      await registrarRutaRealizada(user.id, ruta_id, tiempo_real, observaciones);
      setRealizadas([...realizadas, ruta_id]);
    } catch (err) {
      setError(err.response?.data?.msg || 'No se pudo registrar la ruta realizada');
    }
  };

  if (loading) return <div className="loading">Cargando rutas realizadas...</div>;

  return (
    <div className="rutas">
      <div className="rutas-header">
        <h1>Mis Rutas Realizadas</h1>
        <Link to="/rutas" className="btn btn-secondary">Explorar rutas</Link>
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="rutas-grid">
        {realizadas.length === 0 ? (
          <p className="empty">No tienes rutas realizadas aún.</p>
        ) : (
          realizadas.map((ruta) => (
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
                <Link to={`/rutas/${ruta.id}`} className="btn btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 8 }}>
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
