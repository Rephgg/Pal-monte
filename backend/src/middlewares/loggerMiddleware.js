
const loggerMiddleware = (req, res, next) => {
  const marca = new Date().toISOString();
  const usuario = req.usuario ? `user=${req.usuario.id}` : 'anonimo';
  console.log(`[${marca}] ${req.method} ${req.originalUrl} ${usuario}`);
  next(); 
};

module.exports = { loggerMiddleware };
