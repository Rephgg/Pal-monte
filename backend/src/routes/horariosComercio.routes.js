const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/horariosComercio.controller');
<<<<<<< HEAD
const { soloAdmin } = require('../middlewares/authMiddleware');

<<<<<<< HEAD
// HORARIOS DE COMERCIO (GET público; crear/editar/eliminar solo admin)
router.get('/comercios/:comercio_id/horarios', ctrl.getByComercio);   // GET    /api/comercios/:id/horarios
router.post('/comercios/:comercio_id/horarios', ...soloAdmin, ctrl.create);         // POST   /api/comercios/:id/horarios
router.put('/horarios/:horario_id', ...soloAdmin, ctrl.update);                     // PUT    /api/horarios/:id
router.delete('/horarios/:horario_id', ...soloAdmin, ctrl.remove);                  // DELETE /api/horarios/:id
=======

// HORARIOS DE COMERCIO
router.get('/comercios/:comercio_id/horarios', ctrl.getByComercio);   // GET    /api/comercios/:id/horarios
router.post('/comercios/:comercio_id/horarios', ctrl.create);         // POST   /api/comercios/:id/horarios
router.put('/horarios/:horario_id', ctrl.update);                     // PUT    /api/horarios/:id
router.delete('/horarios/:horario_id', ctrl.remove);                  // DELETE /api/horarios/:id
>>>>>>> 67b4edc (feat(rutas): Modificación de los archivos del backend.)
=======
router.get('/comercios/:comercio_id/horarios', ctrl.getByComercio);   
router.post('/comercios/:comercio_id/horarios', ...soloAdmin, ctrl.create);         
router.put('/horarios/:horario_id', ...soloAdmin, ctrl.update);                     
router.delete('/horarios/:horario_id', ...soloAdmin, ctrl.remove);                  
>>>>>>> Dev

module.exports = router;