const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bicicletas.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/bicicletas', verificarToken, ctrl.getByUsuario);                    
router.get('/bicicletas/:bicicleta_id', verificarToken, ctrl.getById);           
router.post('/bicicletas', verificarToken, ctrl.create);                         
router.put('/bicicletas/:bicicleta_id', verificarToken, ctrl.update);            
router.delete('/bicicletas/:bicicleta_id', verificarToken, ctrl.remove);         

module.exports = router;