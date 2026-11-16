import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPerfil, updatePerfil, updatePassword } from '../services/auth';

export default function Perfil() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Formulario info personal
  const [formInfo, setFormInfo] = useState({
    nombre: '',
    email: '',
    telefono: '',
    nivel: 'principiante'
  });

  // Formulario contraseña
  const [formPass, setFormPass] = useState({
    password_actual: '',
    password_nueva: '',
    password_confirm: ''
  });

  // Cargar datos del perfil
  useEffect(() => {
    if (user?.id) {
      getPerfil(user.id).then((data) => {
        setFormInfo({
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono || '',
          nivel: data.nivel || 'principiante'
        });
        setUser({ ...user, ...data });
      });
    }
  }, [user, setUser]);

  const onChangeInfo = (e) => setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
  const onChangePass = (e) => setFormPass({ ...formPass, [e.target.name]: e.target.value });

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await updatePerfil(user.id, formInfo);
      const updated = { ...user, ...formInfo };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Error al actualizar' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePass = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    if (formPass.password_nueva !== formPass.password_confirm) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await updatePassword(user.id, {
        password_actual: formPass.password_actual,
        password_nueva: formPass.password_nueva
      });
      setFormPass({ password_actual: '', password_nueva: '', password_confirm: '' });
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Error al actualizar contraseña' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perfil">
      <header className="perfil-header">
        <div className="perfil-avatar">
          {user?.foto ? (
            <img src={user.foto} alt={user.nombre} />
          ) : (
            user?.nombre?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
        <h1>Mi Perfil</h1>
      </header>

      <div className="perfil-summary">
        <div className="summary-card">
          <span className="summary-icon">🚴</span>
          <div>
            <p className="summary-value">{user?.nivel || 'principiante'}</p>
            <p className="summary-label">Nivel ciclista</p>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon">❤️</span>
          <div>
            <p className="summary-value">0</p>
            <p className="summary-label">Rutas favoritas</p>
          </div>
        </div>
      </div>

      <nav className="perfil-tabs">
        <button
          className={activeTab === 'info' ? 'active' : ''}
          onClick={() => setActiveTab('info')}
        >
          Información personal
        </button>
        <button
          className={activeTab === 'password' ? 'active' : ''}
          onClick={() => setActiveTab('password')}
        >
          Cambiar contraseña
        </button>
      </nav>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {activeTab === 'info' && (
        <form onSubmit={handleUpdateInfo} className="perfil-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formInfo.nombre}
                onChange={onChangeInfo}
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
                value={formInfo.email}
                onChange={onChangeInfo}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={formInfo.telefono}
                onChange={onChangeInfo}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nivel">Nivel ciclista</label>
              <select
                id="nivel"
                name="nivel"
                value={formInfo.nivel}
                onChange={onChangeInfo}
                disabled={loading}
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="experto">Experto</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handleUpdatePass} className="perfil-form">
          <div className="form-group">
            <label htmlFor="password_actual">Contraseña actual</label>
            <input
              id="password_actual"
              name="password_actual"
              type="password"
              value={formPass.password_actual}
              onChange={onChangePass}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password_nueva">Nueva contraseña</label>
            <input
              id="password_nueva"
              name="password_nueva"
              type="password"
              value={formPass.password_nueva}
              onChange={onChangePass}
              required
              minLength={6}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password_confirm">Confirmar nueva contraseña</label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              value={formPass.password_confirm}
              onChange={onChangePass}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Actualizando...' : 'Cambiar contraseña'}
          </button>
        </form>
      )}
    </div>
  );
}