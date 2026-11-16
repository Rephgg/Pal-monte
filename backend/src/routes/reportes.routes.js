const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportes.controller');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

router.get('/reportes', ctrl.getAll);                        
router.post('/reportes', verificarToken, ctrl.create);                       
router.put('/reportes/:reporte_id/estado', ...soloAdmin, ctrl.cambiarEstado); 
router.delete('/reportes/:reporte_id', ...soloAdmin, ctrl.remove);         

module.exports = router;