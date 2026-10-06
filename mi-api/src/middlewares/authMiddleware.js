const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // Leer el header Authorization: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ ok: false, error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, email, rol }
    next(); // Token válido → continuar
  } catch (err) {
    return res.status(403).json({ ok: false, error: 'Token inválido o expirado' });
  }
};

module.exports = { verificarToken };
