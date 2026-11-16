const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/patrocinadores.controller');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

router.get('/patrocinadores', ctrl.getAll);                              
router.post('/admin/patrocinadores', ...soloAdmin, ctrl.create);                       
router.put('/admin/patrocinadores/:patrocinador_id', ...soloAdmin, ctrl.update);       
router.delete('/admin/patrocinadores/:patrocinador_id', ...soloAdmin, ctrl.remove);    

router.get('/eventos/:evento_id/patrocinadores', ctrl.getByEvento);      
router.post('/eventos/:evento_id/patrocinadores', verificarToken, ctrl.vincular);        
router.delete('/eventos/:evento_id/patrocinadores', verificarToken, ctrl.desvincular);   

module.exports = router;