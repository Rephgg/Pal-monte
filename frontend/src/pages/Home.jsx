import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <header className="hero">
        <h1>Pal' Monte</h1>
        <p>Tu comunidad ciclista para descubrir rutas, eventos y comercios</p>
        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
          <Link to="/registro" className="btn btn-secondary">Registrarse</Link>
        </div>
      </header>
      <section className="features">
        <article className="feature">
          <h3>🗺️ Rutas</h3>
          <p>Descubre y comparte rutas ciclistas con detalles de distancia, dificultad y geometría.</p>
        </article>
        <article className="feature">
          <h3>🏪 Comercios</h3>
          <p>Encuentra talleres, cafeterías y tiendas amigables con ciclistas cerca de ti.</p>
        </article>
        <article className="feature">
          <h3>📅 Eventos</h3>
          <p>Participa en salidas grupales, competiciones y encuentros de la comunidad.</p>
        </article>
        <article className="feature">
          <h3>👤 Perfil</h3>
          <p>Gestiona tu perfil, favoritos, historial de rutas realizadas y logros.</p>
        </article>
      </section>
    </div>
  );
}