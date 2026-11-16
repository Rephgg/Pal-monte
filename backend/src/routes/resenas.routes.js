const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resenas.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/resenas', verificarToken, ctrl.create);              
router.put('/resenas/:resena_id', verificarToken, ctrl.update);    
router.delete('/resenas/:resena_id', verificarToken, ctrl.remove); 

module.exports = router;
