const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rutasRealizadas.controller');

// RUTAS REALIZADAS (historial)
router.get('/rutas-realizadas', ctrl.getByUsuario);  // GET  /api/rutas-realizadas?usuario_id=
router.post('/rutas-realizadas', ctrl.create);        // POST /api/rutas-realizadas?usuario_id=&ruta_id=&tiempo_real=

module.exports = router;
