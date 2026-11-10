const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/horariosComercio.controller');
const { soloAdmin } = require('../middlewares/authMiddleware');

// HORARIOS DE COMERCIO (GET público; crear/editar/eliminar solo admin)
router.get('/comercios/:comercio_id/horarios', ctrl.getByComercio);   // GET    /api/comercios/:id/horarios
router.post('/comercios/:comercio_id/horarios', ...soloAdmin, ctrl.create);         // POST   /api/comercios/:id/horarios
router.put('/horarios/:horario_id', ...soloAdmin, ctrl.update);                     // PUT    /api/horarios/:id
router.delete('/horarios/:horario_id', ...soloAdmin, ctrl.remove);                  // DELETE /api/horarios/:id

module.exports = router;