const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/logros.controller');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

router.get('/logros', ctrl.getAll);                              
router.post('/admin/logros', ...soloAdmin, ctrl.create);                       
router.put('/admin/logros/:logro_id', ...soloAdmin, ctrl.update);              
router.delete('/admin/logros/:logro_id', ...soloAdmin, ctrl.remove);           

router.get('/logros-usuario', verificarToken, ctrl.getLogrosByUsuario);          
router.post('/logros-usuario', verificarToken, ctrl.desbloquear);                

module.exports = router;