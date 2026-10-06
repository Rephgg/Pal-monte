const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rutasGeometria.controller');

// GEOMETRÍA DE RUTAS (traza + paradas)
router.get('/rutas/:ruta_id/puntos', ctrl.getPuntos);             // GET    /api/rutas/:id/puntos
router.post('/rutas/:ruta_id/puntos', ctrl.addPunto);             // POST   /api/rutas/:id/puntos
router.put('/puntos-ruta/:punto_id', ctrl.updatePunto);           // PUT    /api/puntos-ruta/:id
router.delete('/puntos-ruta/:punto_id', ctrl.removePunto);        // DELETE /api/puntos-ruta/:id

router.get('/rutas/:ruta_id/paradas', ctrl.getParadas);           // GET    /api/rutas/:id/paradas
router.post('/rutas/:ruta_id/paradas', ctrl.addParada);           // POST   /api/rutas/:id/paradas
router.delete('/paradas-ruta/:parada_id', ctrl.removeParada);     // DELETE /api/paradas-ruta/:id

module.exports = router;