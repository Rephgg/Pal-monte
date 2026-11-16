const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ ok: false, msg: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; 
    next();                 
  } catch (err) {
    return res.status(403).json({ ok: false, msg: 'Token invalido o expirado' });
  }
};

const verificarRol = (...rolesPermitidos) => (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ ok: false, msg: 'Token requerido' });
  }

  if (!rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({ ok: false, msg: 'No tienes permisos para esta accion' });
  }

  next();
};

const soloAdmin = [verificarToken, verificarRol('administrador')];

module.exports = { verificarToken, verificarRol, soloAdmin };
