const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/horariosComercio.controller');
const { soloAdmin } = require('../middlewares/authMiddleware');

router.get('/comercios/:comercio_id/horarios', ctrl.getByComercio);   
router.post('/comercios/:comercio_id/horarios', ...soloAdmin, ctrl.create);         
router.put('/horarios/:horario_id', ...soloAdmin, ctrl.update);                     
router.delete('/horarios/:horario_id', ...soloAdmin, ctrl.remove);                  

module.exports = router;