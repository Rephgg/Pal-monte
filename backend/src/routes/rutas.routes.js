const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rutas.controller');
const { soloAdmin } = require('../middlewares/authMiddleware');

// RUTAS (público)
router.get('/rutas', ctrl.getAll);                    // GET    /api/rutas?dificultad=
router.get('/rutas/:ruta_id', ctrl.getById);          // GET    /api/rutas/:id

// ADMIN - RUTAS (token + rol administrador)
router.post('/admin/rutas', ...soloAdmin, ctrl.create);             // POST   /api/admin/rutas
router.put('/admin/rutas/:ruta_id', ...soloAdmin, ctrl.update);     // PUT    /api/admin/rutas/:id
router.delete('/admin/rutas/:ruta_id', ...soloAdmin, ctrl.remove);  // DELETE /api/admin/rutas/:id

module.exports = router;
