require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { loggerMiddleware } = require('./middlewares/loggerMiddleware');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();
app.set('trust proxy', 1);

const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use(morgan('dev'));

app.use(express.json());

const isDev = process.env.NODE_ENV !== 'production';
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: isDev ? 10000 : parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, msg: 'Demasiadas peticiones, intenta mas tarde' },
});
app.use('/api', generalLimiter);

app.use(loggerMiddleware);

const usuariosRouter = require('./routes/usuarios.routes');
app.use('/api', usuariosRouter);

const rutasRouter = require('./routes/rutas.routes');
app.use('/api', rutasRouter);
const comerciosRouter = require('./routes/comercios.routes');
app.use('/api', comerciosRouter);
const eventosRouter = require('./routes/eventos.routes');
app.use('/api', eventosRouter);

const favoritosRouter = require('./routes/favoritos.routes');
app.use('/api', favoritosRouter);
const resenasRouter = require('./routes/resenas.routes');
app.use('/api', resenasRouter);
const realizadasRouter = require('./routes/rutasRealizadas.routes');
app.use('/api', realizadasRouter);

const sesionesRouter = require('./routes/sesiones.routes');
app.use('/api', sesionesRouter);
const bicicletasRouter = require('./routes/bicicletas.routes');
app.use('/api', bicicletasRouter);
const geometriaRouter = require('./routes/rutasGeometria.routes');
app.use('/api', geometriaRouter);
const socialRouter = require('./routes/social.routes');
app.use('/api', socialRouter);
const notificacionesRouter = require('./routes/notificaciones.routes');
app.use('/api', notificacionesRouter);
const logrosRouter = require('./routes/logros.routes');
app.use('/api', logrosRouter);
const patrocinadoresRouter = require('./routes/patrocinadores.routes');
app.use('/api', patrocinadoresRouter);
const reportesRouter = require('./routes/reportes.routes');
app.use('/api', reportesRouter);
const horariosComercioRouter = require('./routes/horariosComercio.routes');
app.use('/api', horariosComercioRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
