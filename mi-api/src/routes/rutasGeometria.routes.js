const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rutasGeometria.controller');
const { soloAdmin } = require('../middlewares/authMiddleware');

// GEOMETRÍA DE RUTAS (traza + paradas)
// Consulta pública; crear/editar/eliminar geometría solo admin (parte del CRUD de rutas)
router.get('/rutas/:ruta_id/puntos', ctrl.getPuntos);             // GET    /api/rutas/:id/puntos
router.post('/rutas/:ruta_id/puntos', ...soloAdmin, ctrl.addPunto);             // POST   /api/rutas/:id/puntos
router.put('/puntos-ruta/:punto_id', ...soloAdmin, ctrl.updatePunto);           // PUT    /api/puntos-ruta/:id
router.delete('/puntos-ruta/:punto_id', ...soloAdmin, ctrl.removePunto);        // DELETE /api/puntos-ruta/:id

router.get('/rutas/:ruta_id/paradas', ctrl.getParadas);           // GET    /api/rutas/:id/paradas
router.post('/rutas/:ruta_id/paradas', ...soloAdmin, ctrl.addParada);           // POST   /api/rutas/:id/paradas
router.delete('/paradas-ruta/:parada_id', ...soloAdmin, ctrl.removeParada);     // DELETE /api/paradas-ruta/:id

module.exports = router;