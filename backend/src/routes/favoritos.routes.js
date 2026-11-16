const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/favoritos.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/favoritos', verificarToken, ctrl.getByUsuario);            
router.post('/favoritos', verificarToken, ctrl.add);                    
router.delete('/favoritos', verificarToken, ctrl.remove);               

module.exports = router;
