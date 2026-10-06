require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// ─── Middlewares globales (terceros) ───
app.use(cors());                // Habilita CORS
app.use(morgan('dev'));         // Logging de requests
app.use(express.json());        // Parsear body JSON

// ─── Middleware personalizado global ───
app.use((req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);
  next(); // Pasar al siguiente middleware
});

// ─── Rutas de autenticación ───
const authRouter = require('./routes/auth.routes');
app.use('/api/auth', authRouter);

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
app.use('/api', reportosRouter);
const horariosComercioRouter = require('./routes/horariosComercio.routes');
app.use('/api', horariosComercioRouter);

// ─── Middleware de errores global (al final) ───
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

module.exports = app;
