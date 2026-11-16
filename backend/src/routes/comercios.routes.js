const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/comercios.controller');
const { soloAdmin } = require('../middlewares/authMiddleware');

router.get('/comercios', ctrl.getAll);                    
router.get('/comercios/:comercio_id', ctrl.getById);      

router.post('/admin/comercios', ...soloAdmin, ctrl.create);             
router.put('/admin/comercios/:comercio_id', ...soloAdmin, ctrl.update); 
router.delete('/admin/comercios/:comercio_id', ...soloAdmin, ctrl.remove); 

module.exports = router;
