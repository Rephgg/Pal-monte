const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rutasGeometria.controller');
const { soloAdmin } = require('../middlewares/authMiddleware');

router.get('/rutas/:ruta_id/puntos', ctrl.getPuntos);             
router.post('/rutas/:ruta_id/puntos', ...soloAdmin, ctrl.addPunto);             
router.put('/puntos-ruta/:punto_id', ...soloAdmin, ctrl.updatePunto);           
router.delete('/puntos-ruta/:punto_id', ...soloAdmin, ctrl.removePunto);        

router.get('/rutas/:ruta_id/paradas', ctrl.getParadas);           
router.post('/rutas/:ruta_id/paradas', ...soloAdmin, ctrl.addParada);           
router.delete('/paradas-ruta/:parada_id', ...soloAdmin, ctrl.removeParada);     

module.exports = router;