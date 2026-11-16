import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <header className="hero">
        <h1>Pal' Monte</h1>
        <p>
          Tu comunidad ciclista para descubrir rutas, eventos y comercios
          amigables con la bicicleta en Ibagué.
        </p>
        <div className="hero-actions">
          {user ? (
            <>
              <Link to="/rutas" className="btn btn-primary">Explorar rutas</Link>
              <Link to="/perfil" className="btn btn-secondary">Mi perfil</Link>
            </>
          ) : (
            <>
              <Link to="/registro" className="btn btn-primary">Únete gratis</Link>
              <Link to="/login" className="btn btn-secondary">Iniciar sesión</Link>
            </>
          )}
        </div>
      </header>

      <section className="features">
        <article className="feature">
          <span className="feature-icon">🗺️</span>
          <h3>Rutas</h3>
          <p>Descubre y comparte rutas ciclistas con distancia, dificultad y geometría.</p>
        </article>
        <article className="feature">
          <span className="feature-icon">🏪</span>
          <h3>Comercios</h3>
          <p>Encuentra talleres, cafeterías y tiendas amigables con ciclistas cerca de ti.</p>
        </article>
        <article className="feature">
          <span className="feature-icon">📅</span>
          <h3>Eventos</h3>
          <p>Participa en salidas grupales, competiciones y encuentros de la comunidad.</p>
        </article>
        <article className="feature">
          <span className="feature-icon">❤️</span>
          <h3>Favoritos</h3>
          <p>Guarda tus rutas preferidas y lleva el registro de las realizadas.</p>
        </article>
      </section>

      <section className="cta">
        <h2>Listo para rodar</h2>
        <p>Crea tu cuenta y comienza a explorar la comunidad ciclista de Ibagué.</p>
        <div className="cta-actions">
          {user ? (
            <Link to="/rutas" className="btn btn-primary">Ver rutas disponibles</Link>
          ) : (
            <Link to="/registro" className="btn btn-primary">Regístrate ahora</Link>
          )}
        </div>
      </section>
    </div>
  );
}
