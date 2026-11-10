const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/horariosComercio.controller');

// HORARIOS DE COMERCIO
router.get('/comercios/:comercio_id/horarios', ctrl.getByComercio);   // GET    /api/comercios/:id/horarios
router.post('/comercios/:comercio_id/horarios', ctrl.create);         // POST   /api/comercios/:id/horarios
router.put('/horarios/:horario_id', ctrl.update);                     // PUT    /api/horarios/:id
router.delete('/horarios/:horario_id', ctrl.remove);                  // DELETE /api/horarios/:id

module.exports = router;