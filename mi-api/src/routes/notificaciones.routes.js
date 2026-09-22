const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificaciones.controller');

// NOTIFICACIONES
router.get('/notificaciones', ctrl.getByUsuario);                       // GET    /api/notificaciones?usuario_id=
router.get('/notificaciones/no-leidas', ctrl.getNoLeidas);              // GET    /api/notificaciones/no-leidas?usuario_id=
router.post('/notificaciones', ctrl.create);                            // POST   /api/notificaciones
router.put('/notificaciones/:notificacion_id/leida', ctrl.marcarLeida); // PUT    /api/notificaciones/:id/leida
router.put('/notificaciones/leidas', ctrl.marcarTodasLeidas);           // PUT    /api/notificaciones/leidas?usuario_id=
router.delete('/notificaciones/:notificacion_id', ctrl.remove);         // DELETE /api/notificaciones/:id

module.exports = router;