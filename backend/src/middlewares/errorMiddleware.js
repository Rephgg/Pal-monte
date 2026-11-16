
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    ok: false,
    msg: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
};

const notFound = (req, res) => {
  res.status(404).json({ ok: false, msg: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
