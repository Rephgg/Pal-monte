const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

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

module.exports = app;
