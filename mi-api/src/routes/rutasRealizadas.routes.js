const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rutasRealizadas.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

// RUTAS REALIZADAS / historial (requiere token)
router.get('/rutas-realizadas', verificarToken, ctrl.getByUsuario);  // GET  /api/rutas-realizadas?usuario_id=
router.post('/rutas-realizadas', verificarToken, ctrl.create);        // POST /api/rutas-realizadas?usuario_id=&ruta_id=&tiempo_real=

module.exports = router;
