import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registro } from '../services/auth';

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    nivel: 'principiante'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registro(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={onSubmit} className="auth-form">
        <h1>Crear cuenta</h1>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={onChange}
            placeholder="Tu nombre"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="tu@email.com"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            required
            minLength={6}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono (opcional)</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={onChange}
            placeholder="+57 300 000 0000"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nivel">Nivel ciclista</label>
          <select
            id="nivel"
            name="nivel"
            value={form.nivel}
            onChange={onChange}
            disabled={loading}
          >
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
            <option value="experto">Experto</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Ingresa</Link>
        </p>
      </form>
    </div>
  );
}