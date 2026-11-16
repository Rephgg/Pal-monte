const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sesiones.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/sesiones', ctrl.create);                                  
router.get('/sesiones', verificarToken, ctrl.getByUsuario);                             
router.get('/sesiones/validar', ctrl.validar);                          
router.delete('/sesiones/cerrar', verificarToken, ctrl.cerrar);                         

module.exports = router;