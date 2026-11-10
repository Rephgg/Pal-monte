require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { loggerMiddleware } = require('./middlewares/loggerMiddleware');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

// =====================================================
// MIDDLEWARES GLOBALES
// Se ejecutan en cada peticion, en este orden, antes
// de llegar a cualquier ruta.
// =====================================================

// 1. CORS: permite que el frontend (otra IP/puerto) consuma la API
app.use(cors());

// 2. Logging HTTP: Morgan imprime cada peticion en consola
app.use(morgan('dev'));

// 3. Parsear body JSON
app.use(express.json());

// 4. Limite de peticiones: evita abuso/fuerza bruta
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, msg: 'Demasiadas peticiones, intenta mas tarde' },
});
app.use('/api', generalLimiter);

// 5. Middleware personalizado global: log con fecha y metodo
app.use(loggerMiddleware);

// =====================================================
// CABLEADO DE RUTAS
// Cada miembro del equipo crea su módulo de rutas y lo
// registra aquí. Consulta src/PLAN_DIVISION.md para ver
// qué parte corresponde a cada uno.
// =====================================================

// Miembro 1: Usuarios, Perfil y Autenticación
const usuariosRouter = require('./routes/usuarios.routes');
app.use('/api', usuariosRouter);

// Miembro 2: Rutas, Comercios y Eventos
const rutasRouter = require('./routes/rutas.routes');
app.use('/api', rutasRouter);
const comerciosRouter = require('./routes/comercios.routes');
app.use('/api', comerciosRouter);
const eventosRouter = require('./routes/eventos.routes');
app.use('/api', eventosRouter);

// Miembro 3: Favoritos, Reseñas y Rutas Realizadas
const favoritosRouter = require('./routes/favoritos.routes');
app.use('/api', favoritosRouter);
const resenasRouter = require('./routes/resenas.routes');
app.use('/api', resenasRouter);
const realizadasRouter = require('./routes/rutasRealizadas.routes');
app.use('/api', realizadasRouter);

// =====================================================
// MÓDULOS NUEVOS (ampliación de la base de datos)
// Sesiones y autenticación, bicicletas, geometría de
// rutas, comunidad, notificaciones, logros,
// patrocinadores, moderación y horarios comerciales.
// =====================================================

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

// =====================================================
// MIDDLEWARE DE ERRORES GLOBAL
// Va al final: primero 404 para rutas inexistentes,
// luego el manejador de errores (4 parametros).
// =====================================================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
