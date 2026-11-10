/**
 * Middleware global de errores.
 * Debe ser el ULTIMO de app.js. Express lo detecta por tener 4 parametros,
 * por eso next queda sin usar aunque no se llame.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  // Si las cabeceras ya se enviaron, solo delegamos
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    ok: false,
    msg: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
};

/** 404 para rutas no registradas. */
const notFound = (req, res) => {
  res.status(404).json({ ok: false, msg: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
