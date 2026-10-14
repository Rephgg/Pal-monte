const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticacion por JWT.
 * Lee el header: Authorization: Bearer <token>
 * Si el token es valido adjunta req.usuario y continua;
 * si no, corta la peticion con 401 (falta) o 403 (invalido/expirado).
 */
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ ok: false, msg: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Adjuntar datos al request
    next();                 // Token valido -> continuar
  } catch (err) {
    return res.status(403).json({ ok: false, msg: 'Token invalido o expirado' });
  }
};

/**
 * Middleware de autorizacion por rol.
 * Debe ir despues de verificarToken para que req.usuario exista.
 * Uso: router.get('/admin/usuarios', verificarToken, verificarRol('administrador'), ctrl.getAll)
 */
const verificarRol = (...rolesPermitidos) => (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ ok: false, msg: 'Token requerido' });
  }

  if (!rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({ ok: false, msg: 'No tienes permisos para esta accion' });
  }

  next();
};

/** Atajo: exige token y rol administrador. */
const soloAdmin = [verificarToken, verificarRol('administrador')];

module.exports = { verificarToken, verificarRol, soloAdmin };
