/**
 * Middleware global de logging.
 * Imprime metodo, url y usuario (si hay token) en cada peticion.
 */
const loggerMiddleware = (req, res, next) => {
  const marca = new Date().toISOString();
  const usuario = req.usuario ? `user=${req.usuario.id}` : 'anonimo';
  console.log(`[${marca}] ${req.method} ${req.originalUrl} ${usuario}`);
  next(); // Pasar al siguiente middleware
};

module.exports = { loggerMiddleware };
