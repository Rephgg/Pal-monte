const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rutas.controller');
const { soloAdmin } = require('../middlewares/authMiddleware');

router.get('/rutas', ctrl.getAll);                    
router.get('/rutas/:ruta_id', ctrl.getById);          

router.post('/admin/rutas', ...soloAdmin, ctrl.create);             
router.put('/admin/rutas/:ruta_id', ...soloAdmin, ctrl.update);     
router.delete('/admin/rutas/:ruta_id', ...soloAdmin, ctrl.remove);  

module.exports = router;
