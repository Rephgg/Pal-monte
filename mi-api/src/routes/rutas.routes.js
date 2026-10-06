const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rutas.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

// RUTAS (público) — lectura sin autenticación
router.get('/rutas', ctrl.getAll);                    // GET    /api/rutas?dificultad=
router.get('/rutas/:ruta_id', ctrl.getById);          // GET    /api/rutas/:id

// ADMIN - RUTAS (protegidas) — requieren token válido
router.post('/admin/rutas', verificarToken, ctrl.create);             // POST   /api/admin/rutas
router.put('/admin/rutas/:ruta_id', verificarToken, ctrl.update);     // PUT    /api/admin/rutas/:id
router.delete('/admin/rutas/:ruta_id', verificarToken, ctrl.remove);  // DELETE /api/admin/rutas/:id

module.exports = router;
