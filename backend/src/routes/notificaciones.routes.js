const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificaciones.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/notificaciones', verificarToken, ctrl.getByUsuario);                       
router.get('/notificaciones/no-leidas', verificarToken, ctrl.getNoLeidas);              
router.post('/notificaciones', verificarToken, ctrl.create);                            
router.put('/notificaciones/:notificacion_id/leida', verificarToken, ctrl.marcarLeida); 
router.put('/notificaciones/leidas', verificarToken, ctrl.marcarTodasLeidas);           
router.delete('/notificaciones/:notificacion_id', verificarToken, ctrl.remove);         

module.exports = router;