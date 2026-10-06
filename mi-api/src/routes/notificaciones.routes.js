const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificaciones.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

// NOTIFICACIONES (requiere token: son del usuario logueado)
router.get('/notificaciones', verificarToken, ctrl.getByUsuario);                       // GET    /api/notificaciones?usuario_id=
router.get('/notificaciones/no-leidas', verificarToken, ctrl.getNoLeidas);              // GET    /api/notificaciones/no-leidas?usuario_id=
router.post('/notificaciones', verificarToken, ctrl.create);                            // POST   /api/notificaciones
router.put('/notificaciones/:notificacion_id/leida', verificarToken, ctrl.marcarLeida); // PUT    /api/notificaciones/:id/leida
router.put('/notificaciones/leidas', verificarToken, ctrl.marcarTodasLeidas);           // PUT    /api/notificaciones/leidas?usuario_id=
router.delete('/notificaciones/:notificacion_id', verificarToken, ctrl.remove);         // DELETE /api/notificaciones/:id

module.exports = router;