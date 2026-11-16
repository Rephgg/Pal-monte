const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rutasRealizadas.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/rutas-realizadas', verificarToken, ctrl.getByUsuario);  
router.post('/rutas-realizadas', verificarToken, ctrl.create);        

module.exports = router;
